import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { workerToggleAttendance } from '../../db/attendance';
import { getCurrentLocation } from '../../utils/location';

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
    syncInfo: '🔄 Works offline — syncs when internet is available',
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
    syncInfo: '🔄 ऑफलाइन काम करता है — इंटरनेट मिलने पर सिंक होता है',
  },
};

export default function GPSAttendance() {
  const { language } = useLanguage();
  const t = translations[language];

  const [checkedIn, setCheckedIn] = useState(false);
  const [coords, setCoords] = useState(null);

  const currentTime = new Date().toLocaleString();

  const handleToggle = async () => {
    try {
      console.log('🔵 workerToggleAttendance() START');

      // 1️⃣ Fetch GPS
      const { latitude, longitude, accuracy } = await getCurrentLocation();
      console.log('📍 GPS FETCHED:', latitude, longitude, 'accuracy:', accuracy);

      // 2️⃣ Store locally + queue for sync
      await workerToggleAttendance({
        workerId: 'WORKER_1',     // temp (will come from auth later)
        projectId: 1,             // temp (will come from backend later)
        isCheckIn: !checkedIn,
        latitude,
        longitude,
      });

      // 3️⃣ Update UI
      setCoords({ latitude, longitude });
      setCheckedIn(!checkedIn);

    } catch (e) {
      console.log('❌ GPS ATTENDANCE ERROR', e.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logo}>🏗</Text>
        </View>
        <Text style={styles.appName}>{t.appName}</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{t.title}</Text>
      <Text style={styles.subtitle}>{t.subtitle}</Text>

      {/* Location Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t.currentLocation}</Text>

        <Text style={styles.cardText}>
          {t.latitude}: {coords ? coords.latitude : 'Fetching...'}
        </Text>

        <Text style={styles.cardText}>
          {t.longitude}: {coords ? coords.longitude : 'Fetching...'}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.cardTitle}>{t.timestamp}</Text>
        <Text style={styles.cardText}>{currentTime}</Text>
      </View>

      {/* Check-in Button */}
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: checkedIn ? '#EF4444' : '#22C55E' },
        ]}
        onPress={handleToggle}
      >
        <Text style={styles.buttonText}>
          {checkedIn ? t.checkOut : t.checkIn}
        </Text>
      </TouchableOpacity>

      {/* Offline Info */}
      <View style={styles.syncBox}>
        <Text style={styles.syncText}>{t.syncInfo}</Text>
      </View>
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
    padding: 24,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoBox: {
    backgroundColor: '#F4B400',
    padding: 14,
    borderRadius: 16,
    marginRight: 12,
  },
  logo: { fontSize: 24 },
  appName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },

  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: '#9CA3AF',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#121826',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 30,
  },
  cardTitle: {
    color: '#F4B400',
    fontWeight: '700',
    marginBottom: 6,
  },
  cardText: {
    color: '#E5E7EB',
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#1F2937',
    marginVertical: 12,
  },

  button: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#0B0F14',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },

  syncBox: {
    alignItems: 'center',
  },
  syncText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
});
