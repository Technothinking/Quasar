import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

/* 🌐 Translations */
const translations = {
  en: {
    appName: 'ConstructPro',
    title: 'OTP Verification',
    subtitle: 'Enter the OTP sent to your number',
    otpPlaceholder: 'Enter OTP',
    buttonText: 'Verify',
    errors: {
      empty: 'OTP is required',
      invalid: 'Enter a valid 6-digit OTP',
    },
  },
  hi: {
    appName: 'कंस्ट्रक्टप्रो',
    title: 'OTP सत्यापन',
    subtitle: 'अपने नंबर पर भेजा गया OTP दर्ज करें',
    otpPlaceholder: 'OTP दर्ज करें',
    buttonText: 'सत्यापित करें',
    errors: {
      empty: 'OTP आवश्यक है',
      invalid: 'सही 6 अंकों का OTP दर्ज करें',
    },
  },
  mr: {
    appName: 'कन्स्ट्रक्टप्रो',
    title: 'OTP पडताळणी',
    subtitle: 'आपल्या नंबरवर पाठवलेले OTP टाका',
    otpPlaceholder: 'OTP टाका',
    buttonText: 'पडताळा',
    errors: {
      empty: 'OTP आवश्यक आहे',
      invalid: 'योग्य 6 अंकी OTP टाका',
    },
  },
  ta: {
    appName: 'கன்ஸ்ட்ரக்ட் ப்ரோ',
    title: 'OTP சரிபார்ப்பு',
    subtitle: 'உங்கள் எண்ணிற்கு அனுப்பப்பட்ட OTP ஐ உள்ளிடவும்',
    otpPlaceholder: 'OTP உள்ளிடவும்',
    buttonText: 'சரிபார்க்கவும்',
    errors: {
      empty: 'OTP தேவையுள்ளது',
      invalid: 'சரியான 6 இலக்க OTP ஐ உள்ளிடவும்',
    },
  },
};

export default function OTPScreen({ route, navigation }) {
  const { language } = useLanguage();
  const t = translations[language];
  const { role } = route.params;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const verifyOTP = () => {
    if (!otp) {
      setError(t.errors.empty);
      return;
    }

    if (otp.length !== 6) {
      setError(t.errors.invalid);
      return;
    }

    setError('');

    const normalizedRole = role.trim().toLowerCase();

    switch (normalizedRole) {
      case 'owner':
        navigation.replace('OwnerStack');
        break;

      case 'manager':
        navigation.replace('ManagerStack');
        break;

      case 'supervisor':
      case 'site engineer':
        navigation.replace('SupervisorStack');
        break;

      case 'worker':
        navigation.replace('WorkerStack');
        break;

      default:
        navigation.replace('WorkerStack');
    }
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
      <Text style={styles.subtitle}>{t.subtitle}</Text>

      <TextInput
        placeholder={t.otpPlaceholder}
        placeholderTextColor="#9CA3AF"
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={(text) => {
          setOtp(text.replace(/[^0-9]/g, ''));
          setError('');
        }}
        style={styles.input}
      />

      {/* Error message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, otp.length !== 6 && { opacity: 0.6 }]}
        onPress={verifyOTP}
        disabled={otp.length !== 6}
      >
        <Text style={styles.buttonText}>{t.buttonText}</Text>
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
  logoEmoji: { fontSize: 32 },
  appName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#F4B400',
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    color: 'white',
    textAlign: 'center',
    letterSpacing: 8,
    fontSize: 20,
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 16,
    fontSize: 13,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#F4B400',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0b0f14',
    fontSize: 18,
    fontWeight: '700',
  },
});
