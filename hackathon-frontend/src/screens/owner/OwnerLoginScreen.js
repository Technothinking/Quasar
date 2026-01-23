import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../../context/LanguageContext'; // Make sure your LanguageContext is set up

// 🔤 Translations
const translations = {
  en: {
    appName: 'ConstructPro',
    subtitle: 'Owner Login',
    emailLabel: 'Email',
    emailPlaceholder: 'Enter your email',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter password',
    button: 'Login',
  },
  hi: {
    appName: 'कंस्ट्रक्टप्रो',
    subtitle: 'मालिक लॉगिन',
    emailLabel: 'ईमेल',
    emailPlaceholder: 'अपना ईमेल दर्ज करें',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'पासवर्ड दर्ज करें',
    button: 'लॉगिन करें',
  },
  mr: {
    appName: 'कन्स्ट्रक्टप्रो',
    subtitle: 'मालक लॉगिन',
    emailLabel: 'ईमेल',
    emailPlaceholder: 'तुमचा ईमेल टाका',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'पासवर्ड टाका',
    button: 'लॉगिन करा',
  },
  ta: {
    appName: 'கன்ஸ்ட்ரக்ட் ப்ரோ',
    subtitle: 'உயர்முறை லாகின்',
    emailLabel: 'மின்னஞ்சல்',
    emailPlaceholder: 'உங்கள் மின்னஞ்சலை உள்ளிடவும்',
    passwordLabel: 'கடவுச்சொல்',
    passwordPlaceholder: 'கடவுச்சொல்லை உள்ளிடவும்',
    button: 'ப்ரோ வுச்செய்',
  },
};

export default function OwnerLoginScreen({ navigation }) {
  const { language } = useLanguage();
  const t = translations[language];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🏗</Text>
        </View>
        <Text style={styles.appName}>{t.appName}</Text>
        <Text style={styles.subtitle}>{t.subtitle}</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>{t.emailLabel}</Text>
        <TextInput
          style={styles.input}
          placeholder={t.emailPlaceholder}
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>{t.passwordLabel}</Text>
        <TextInput
          style={styles.input}
          placeholder={t.passwordPlaceholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.loginButton}
          activeOpacity={0.85}
          onPress={() => navigation.replace('OwnerHome')}
        >
          <Text style={styles.loginText}>{t.button}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f14', padding: 24 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  logoBox: { backgroundColor: '#facc15', padding: 20, borderRadius: 22, marginBottom: 16 },
  logoEmoji: { fontSize: 36 },
  appName: { color: 'white', fontSize: 30, fontWeight: '800' },
  subtitle: { color: '#9CA3AF', marginTop: 6, fontSize: 14 },
  form: { backgroundColor: '#1c2430', padding: 22, borderRadius: 18, elevation: 6 },
  label: { color: '#D1D5DB', marginBottom: 6, fontSize: 13 },
  input: { backgroundColor: '#111827', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: 'white', marginBottom: 18, fontSize: 14 },
  loginButton: { backgroundColor: '#facc15', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 10 },
  loginText: { color: '#000', fontWeight: '800', fontSize: 16 },
});
