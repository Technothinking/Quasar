import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLanguage } from '../../context/LanguageContext';
import { saveWorkerUpdate } from '../../db/workerUpdates';
import { getCurrentLocation } from '../../utils/location';

/* 🌐 Translations */
const translations = {
  en: {
    title: 'Daily Work Update',
    subtitle: 'Submit details to finish your shift',
    workDone: 'Work done today',
    location: 'Current location / notes',
    photo: 'Upload work photo',
    submit: 'Finish Shift',
  },
};

export default function VoiceUpdates() {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const [workDone, setWorkDone] = useState('');
  const [locationNote, setLocationNote] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [loading, setLoading] = useState(false);

  /* 📸 Pick photo */
  const pickPhoto = async () => {
    const { status } =
      await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera access needed');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.6,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  /* ✅ Submit */
  const handleSubmit = async () => {
    if (!workDone.trim()) {
      Alert.alert('Error', 'Please enter work done');
      return;
    }

    try {
      setLoading(true);

      console.log('📍 Fetching GPS for worker update');
      const { latitude, longitude } =
        await getCurrentLocation();

      await saveWorkerUpdate({
        userId: 'WORKER_1', // temp
        projectId: 1,       // temp
        workDone,
        locationNote,
        latitude,
        longitude,
        photoUri,
      });

      console.log(
        '✅ Worker update saved OFFLINE:',
        latitude,
        longitude,
        photoUri
      );

      setWorkDone('');
      setLocationNote('');
      setPhotoUri(null);

      Alert.alert('Success', 'Work update saved offline');
    } catch (e) {
      console.log('❌ Worker update error:', e.message);
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logo}>🏗</Text>
        </View>
        <Text style={styles.heading}>{t.title}</Text>
      </View>

      <Text style={styles.subtitle}>{t.subtitle}</Text>

      {/* Work Done */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={t.workDone}
          placeholderTextColor="#9CA3AF"
          value={workDone}
          onChangeText={setWorkDone}
          multiline
        />
        <TouchableOpacity style={styles.micBtn}>
          <Text style={styles.micIcon}>🎤</Text>
        </TouchableOpacity>
      </View>

      {/* Location / Notes */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={t.location}
          placeholderTextColor="#9CA3AF"
          value={locationNote}
          onChangeText={setLocationNote}
        />
        <TouchableOpacity style={styles.micBtn}>
          <Text style={styles.micIcon}>🎤</Text>
        </TouchableOpacity>
      </View>

      {/* Photo */}
      <TouchableOpacity style={styles.photoBox} onPress={pickPhoto}>
        <Text style={styles.photoIcon}>📷</Text>
        <Text style={styles.photoText}>
          {photoUri ? 'Change Photo' : t.photo}
        </Text>
      </TouchableOpacity>

      {photoUri && (
        <Image source={{ uri: photoUri }} style={styles.preview} />
      )}

      {/* Submit */}
      <TouchableOpacity
        style={[
          styles.submitBtn,
          { opacity: loading ? 0.6 : 1 },
        ]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitText}>
          {loading ? 'Saving...' : t.submit}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* 🎨 Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
    padding: 24,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  logoBox: {
    backgroundColor: '#F4B400',
    padding: 14,
    borderRadius: 16,
    marginRight: 12,
  },
  logo: { fontSize: 24 },
  heading: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },

  subtitle: {
    color: '#9CA3AF',
    marginBottom: 24,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121826',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 16,
    paddingRight: 10,
  },
  input: {
    flex: 1,
    padding: 14,
    color: '#fff',
  },
  micBtn: {
    padding: 8,
  },
  micIcon: {
    fontSize: 20,
  },

  photoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121826',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 12,
  },
  photoIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  photoText: {
    color: '#E5E7EB',
    fontSize: 15,
    fontWeight: '600',
  },

  preview: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 20,
  },

  submitBtn: {
    backgroundColor: '#F4B400',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
  },
  submitText: {
    color: '#0B0F14',
    fontWeight: '800',
    fontSize: 16,
  },
});
