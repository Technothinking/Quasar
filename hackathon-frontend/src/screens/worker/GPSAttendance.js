import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../context/LanguageContext';
import { checkIn, checkOut, getTodayAttendance } from '../../db/attendance';
import { isWithinRadius } from '../../utils/location';

/* 🌐 Translations */
const translations = {
  en: {
    appName: 'ConstructPro',
    title: 'GPS Attendance',
    subtitle: 'One-tap attendance with live location',
    currentLocation: '📍 Current Location',
    latitude: 'Latitude',
    longitude: 'Longitude',
    timestamp: '🕒 Timestamp',
    checkIn: 'CHECK IN',
    checkOut: 'CHECK OUT',
    syncInfo: '🔄 GPS Geofencing Active',
    outOfRange: 'You are too far from the project site.',
    permissionDenied: 'Location access is required.',
  },
  hi: {
    appName: 'कंस्ट्रक्टप्रो',
    title: 'जीपीएस उपस्थिति',
    subtitle: 'एक क्लिक में उपस्थिति और लाइव स्थान',
    currentLocation: '📍 वर्तमान स्थान',
    latitude: 'अक्षांश',
    longitude: 'देशांतर',
    timestamp: '🕒 समयांक',
    checkIn: 'चेक-इन',
    checkOut: 'चेक-आउट',
    syncInfo: '🔄 जीपीएस जियोफेंसिंग सक्रिय',
    outOfRange: 'आप परियोजना स्थल से बहुत दूर हैं।',
    permissionDenied: 'स्थान पहुंच आवश्यक है।',
  },
  mr: {
    appName: 'कन्स्ट्रक्टप्रो',
    title: 'जीपीएस हजेरी',
    subtitle: 'एक क्लिकमध्ये हजेरी आणि लाइव्ह स्थान',
    currentLocation: '📍 सध्याचे स्थान',
    latitude: 'अक्षांश',
    longitude: 'रेखांश',
    timestamp: '🕒 टाइमस्टॅम्प',
    checkIn: 'चेक-इन',
    checkOut: 'चेक-आउट',
    syncInfo: '🔄 जीपीएस जिओफेन्सिंग सक्रिय',
    outOfRange: 'तुम्ही प्रकल्पाच्या ठिकाणापासून खूप लांब आहात.',
    permissionDenied: 'स्थानासाठी परवानगी आवश्यक आहे.',
  },
  ta: {
    appName: 'கன்ஸ்ட்ரக்ட் ப்ரோ',
    title: 'ஜிபிஎஸ் வருகை',
    subtitle: 'ஒரே கிளிக் மூலம் வருகை மற்றும் நேரடி இடம்',
    currentLocation: '📍 தற்போதைய இடம்',
    latitude: 'அட்சாங்',
    longitude: 'நீளங்கள்',
    timestamp: '🕒 நேரம்',
    checkIn: 'சேக்-இன்',
    checkOut: 'சேக்-அவுட்',
    syncInfo: '🔄 ஜிபிஎஸ் ஜியோஃபென்சிங் செயலில் உள்ளது',
    outOfRange: 'நீங்கள் திட்ட தளத்திலிருந்து வெகு தொலைவில் உள்ளீர்கள்.',
    permissionDenied: 'இருப்பிட அணுகல் தேவை.',
  },
};

export default function GPSAttendance({ route }) {
  const { projectId } = route.params || {};
  const { language } = useLanguage();
  const t = translations[language] || translations['en'];

  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [siteLocation, setSiteLocation] = useState(null);
  const [user, setUser] = useState(null);
  const [currentCoords, setCurrentCoords] = useState({ lat: '...', lon: '...' });

  useEffect(() => {
    if (projectId) {
      loadInitialData();
    }
  }, [projectId]);

  const loadInitialData = async () => {
    setFetching(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      const { data: siteData } = await supabase
        .from('project_sites')
        .select('latitude, longitude, radius_meters')
        .eq('project_id', projectId)
        .single();

      if (siteData) setSiteLocation(siteData);

      if (authUser) {
        const attendance = await getTodayAttendance(authUser.id, projectId);
        if (attendance) {
          setCheckedIn(!!attendance.check_in_time && !attendance.check_out_time);
        }
      }
    } catch (err) {
      console.error('Worker attendance load failed:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleToggle = async () => {
    if (!siteLocation) {
      Alert.alert('Error', 'Project site location data not found.');
      return;
    }

    setLoading(true);
    try {
      // 1. Request GPS Permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', t.permissionDenied);
        setLoading(false);
        return;
      }

      // 2. High Accuracy Position
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude, longitude } = location.coords;
      setCurrentCoords({ lat: latitude.toFixed(4), lon: longitude.toFixed(4) });

      // 3. Geofencing Validation
      const inRadius = isWithinRadius(
        latitude,
        longitude,
        siteLocation.latitude,
        siteLocation.longitude,
        siteLocation.radius_meters || 200
      );

      if (!inRadius) {
        Alert.alert('Error', t.outOfRange);
        setLoading(false);
        return;
      }

      // 4. Update Database
      if (!checkedIn) {
        await checkIn({
          userId: user.id,
          projectId: projectId,
          role: 'worker',
          method: 'self'
        });
      } else {
        await checkOut(user.id, projectId);
      }

      // 5. Refresh
      await loadInitialData();
      Alert.alert('Success', 'Sync Complete');
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator color="#F4B400" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoBox}><Text style={styles.logo}>🏗</Text></View>
        <Text style={styles.appName}>{t.appName}</Text>
      </View>

      <Text style={styles.title}>{t.title}</Text>
      <Text style={styles.subtitle}>{t.subtitle}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t.currentLocation}</Text>
        <Text style={styles.cardText}>{t.latitude}: {currentCoords.lat}</Text>
        <Text style={styles.cardText}>{t.longitude}: {currentCoords.lon}</Text>
        <View style={styles.divider} />
        <Text style={styles.cardTitle}>{t.timestamp}</Text>
        <Text style={styles.cardText}>{new Date().toLocaleTimeString()}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: checkedIn ? '#EF4444' : '#22C55E' }, loading && { opacity: 0.7 }]}
        onPress={handleToggle}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>{checkedIn ? t.checkOut : t.checkIn}</Text>}
      </TouchableOpacity>

      <View style={styles.syncBox}>
        <Text style={styles.syncText}>{t.syncInfo}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F14', padding: 24 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  logoBox: { backgroundColor: '#F4B400', padding: 14, borderRadius: 16, marginRight: 12 },
  logo: { fontSize: 24 },
  appName: { color: '#fff', fontSize: 22, fontWeight: '800' },
  title: { color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: '#9CA3AF', marginBottom: 20 },
  card: { backgroundColor: '#121826', borderRadius: 18, padding: 20, borderWidth: 1, borderColor: '#1F2937', marginBottom: 30 },
  cardTitle: { color: '#F4B400', fontWeight: '700', marginBottom: 6 },
  cardText: { color: '#E5E7EB', marginBottom: 4 },
  divider: { height: 1, backgroundColor: '#1F2937', marginVertical: 12 },
  button: { paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#0B0F14', fontSize: 18, fontWeight: '800', letterSpacing: 1 },
  syncBox: { alignItems: 'center' },
  syncText: { color: '#9CA3AF', fontSize: 13 },
});
