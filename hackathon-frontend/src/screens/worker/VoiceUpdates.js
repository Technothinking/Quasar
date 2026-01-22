import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useLanguage } from '../../context/LanguageContext';

/* 🌐 Translations */
const translations = {
  en: {
    title: 'Daily Work Update',
    subtitle: 'Submit details to finish your shift',
    workDone: 'Work done today',
    location: 'Current location',
    photo: 'Upload work photo',
    submit: 'Finish Shift',
  },
  hi: {
    title: 'दैनिक कार्य अपडेट',
    subtitle: 'अपनी शिफ्ट पूरी करने के लिए विवरण दें',
    workDone: 'आज किया गया काम',
    location: 'वर्तमान स्थान',
    photo: 'कार्य की फोटो अपलोड करें',
    submit: 'शिफ्ट समाप्त करें',
  },
  mr: {
    title: 'दैनिक काम अपडेट',
    subtitle: 'शिफ्ट पूर्ण करण्यासाठी माहिती द्या',
    workDone: 'आज केलेले काम',
    location: 'सध्याचे स्थान',
    photo: 'कामाचा फोटो अपलोड करा',
    submit: 'शिफ्ट पूर्ण करा',
  },
  ta: {
    title: 'தினசரி வேலை புதுப்பிப்பு',
    subtitle: 'உங்கள் ஷிப்ட்டை முடிக்க விவரங்களை அளிக்கவும்',
    workDone: 'இன்றைய வேலை',
    location: 'தற்போதைய இடம்',
    photo: 'வேலை புகைப்படத்தை பதிவேற்றவும்',
    submit: 'ஷிப்ட் முடிக்கவும்',
  },
};

export default function VoiceUpdates() {
  const { language } = useLanguage();
  const t = translations[language];

  const [workDone, setWorkDone] = useState('');
  const [location, setLocation] = useState('');

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

      {/* Work Done Input */}
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

      {/* Location Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={t.location}
          placeholderTextColor="#9CA3AF"
          value={location}
          onChangeText={setLocation}
        />
        <TouchableOpacity style={styles.micBtn}>
          <Text style={styles.micIcon}>🎤</Text>
        </TouchableOpacity>
      </View>

      {/* Photo Upload */}
      <TouchableOpacity style={styles.photoBox}>
        <Text style={styles.photoIcon}>📷</Text>
        <Text style={styles.photoText}>{t.photo}</Text>
      </TouchableOpacity>

      {/* Submit */}
      <TouchableOpacity style={styles.submitBtn}>
        <Text style={styles.submitText}>{t.submit}</Text>
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
    marginBottom: 24,
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
