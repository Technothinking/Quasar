import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../../context/LanguageContext'; // Make sure you have this

// 🔤 Translations
const translations = {
  en: {
    appName: 'ConstructPro',
    subtitle: 'Supervisor Login',
    mobileLabel: 'Mobile Number',
    mobilePlaceholder: 'Enter mobile number',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter password',
    button: 'Login',
  },
  hi: {
    appName: 'कंस्ट्रक्टप्रो',
    subtitle: 'सुपरवाइज़र लॉगिन',
    mobileLabel: 'मोबाइल नंबर',
    mobilePlaceholder: 'मोबाइल नंबर दर्ज करें',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'पासवर्ड दर्ज करें',
    button: 'लॉगिन करें',
  },
  mr: {
    appName: 'कन्स्ट्रक्टप्रो',
    subtitle: 'सुपरवायझर लॉगिन',
    mobileLabel: 'मोबाईल नंबर',
    mobilePlaceholder: 'मोबाईल नंबर टाका',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'पासवर्ड टाका',
    button: 'लॉगिन करा',
  },
  ta: {
    appName: 'கன்ஸ்ட்ரக்ட் ப்ரோ',
    subtitle: 'மேற்பார்வையாளர் லாகின்',
    mobileLabel: 'மொபைல் எண்',
    mobilePlaceholder: 'மொபைல் எண்ணை உள்ளிடவும்',
    passwordLabel: 'கடவுச்சொல்',
    passwordPlaceholder: 'கடவுச்சொல்லை உள்ளிடவும்',
    button: 'ப்ரோ வுச்செய்',
  },
};

import { useAuth } from '../../context/AuthContext';

export default function SupervisorLoginScreen({ navigation, route }) {
  const { language } = useLanguage();
  const { login, isLoading } = useAuth();
  const t = translations[language];

  // Default to Supervisor if no param (fallback), but logic expects param
  const { role_id = 3, role_name = 'Supervisor' } = route.params || {};

  const [mobile, setMobile] = useState('supervisor@test.com'); // Temp Default
  const [password, setPassword] = useState('supervisor123'); // Temp Default

  const handleLogin = async () => {
    // Using mobile as email based on backend requirement ("email": request.email)
    // Adjust if backend expects phone number logic

    const result = await login(mobile, password, role_id);
    if (!result.success) {
      alert(result.error);
    }
    // Navigation is handled by AppNavigator based on userToken state
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🏗</Text>
        </View>
        <Text style={styles.appName}>{t.appName}</Text>
        <Text style={styles.subtitle}>{role_name} Login</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Email / {t.mobileLabel}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email or mobile"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          value={mobile}
          onChangeText={setMobile}
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
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginText}>
            {isLoading ? "Logging in..." : t.button}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 20, alignItems: 'center' }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: '#6B7280' }}>Back to Role Selection</Text>
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
