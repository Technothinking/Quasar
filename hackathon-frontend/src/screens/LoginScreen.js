import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

/* 🌐 Translations */
const translations = {
  en: {
    appName: 'ConstructPro',
    title: 'Login',
    phonePlaceholder: 'Enter phone number',
    sendOTP: 'Send OTP',
    errors: {
      empty: 'Mobile number is required',
      invalid: 'Enter a valid 10-digit mobile number',
    },
    roleLabel: 'Role',
  },
  hi: {
    appName: 'कंस्ट्रक्टप्रो',
    title: 'लॉगिन',
    phonePlaceholder: 'मोबाइल नंबर दर्ज करें',
    sendOTP: 'OTP भेजें',
    errors: {
      empty: 'मोबाइल नंबर आवश्यक है',
      invalid: 'सही 10 अंकों का नंबर दर्ज करें',
    },
    roleLabel: 'भूमिका',
  },
  mr: {
    appName: 'कन्स्ट्रक्टप्रो',
    title: 'लॉगिन',
    phonePlaceholder: 'फोन नंबर टाका',
    sendOTP: 'OTP पाठवा',
    errors: {
      empty: 'मोबाईल नंबर आवश्यक आहे',
      invalid: 'योग्य 10 अंकी नंबर टाका',
    },
    roleLabel: 'भूमिका',
  },
  ta: {
    appName: 'கன்ஸ்ட்ரக்ட் ப்ரோ',
    title: 'லாகின்',
    phonePlaceholder: 'தொலைபேசி எண்ணை உள்ளிடவும்',
    sendOTP: 'OTP அனுப்பு',
    errors: {
      empty: 'தொலைபேசி எண் தேவையுள்ளது',
      invalid: 'சரியான 10 இலக்க எண்ணை உள்ளிடவும்',
    },
    roleLabel: 'பாத்திரம்',
  },
};

/* 👤 Role titles for multilingual display */
const roleTitles = {
  en: { Owner: 'Owner', Manager: 'Manager', Supervisor: 'Supervisor', Worker: 'Worker' },
  hi: { Owner: 'मालिक', Manager: 'प्रबंधक', Supervisor: 'सुपरवाइज़र', Worker: 'कर्मचारी' },
  mr: { Owner: 'मालक', Manager: 'व्यवस्थापक', Supervisor: 'सुपरवायझर', Worker: 'कामगार' },
  ta: { Owner: 'உயர்முறை', Manager: 'மேலாளர்', Supervisor: 'மேற்பார்வையாளர்', Worker: 'தொழிலாளர்' },
};

export default function LoginScreen({ route, navigation }) {
  const { language } = useLanguage();
  const t = translations[language];
  const roleName = roleTitles[language][route.params.role];

  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSendOTP = () => {
    if (!phone) {
      setError(t.errors.empty);
      return;
    }

    if (phone.length !== 10) {
      setError(t.errors.invalid);
      return;
    }

    setError('');
    navigation.navigate('OTP', { role: route.params.role, phone });
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🏗</Text>
        </View>
        <Text style={styles.appName}>{t.appName}</Text>
      </View>

      <Text style={styles.title}>{t.title}</Text>
      <Text style={styles.subtitle}>{`${t.roleLabel}: ${roleName}`}</Text>

      {/* Phone Input */}
      <TextInput
        placeholder={t.phonePlaceholder}
        placeholderTextColor="#9CA3AF"
        keyboardType="phone-pad"
        maxLength={10}
        value={phone}
        onChangeText={(text) => {
          setPhone(text.replace(/[^0-9]/g, ''));
          setError('');
        }}
        style={styles.input}
      />

      {/* Error message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Send OTP */}
      <TouchableOpacity
        style={[styles.button, phone.length !== 10 && { opacity: 0.6 }]}
        onPress={handleSendOTP}
        disabled={phone.length !== 10}
      >
        <Text style={styles.buttonText}>{t.sendOTP}</Text>
      </TouchableOpacity>
    </View>
  );
}

/* 🎨 Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f14',
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    backgroundColor: '#facc15',
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
  },
  logoEmoji: {
    fontSize: 32,
  },
  appName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#F4B400',
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    color: 'white',
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 16,
    fontSize: 13,
  },
  button: {
    backgroundColor: '#F4B400',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#0b0f14',
    fontSize: 18,
    fontWeight: '700',
  },
});
