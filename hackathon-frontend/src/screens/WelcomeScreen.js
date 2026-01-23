import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

const translations = {
  en: { title: 'Welcome to ConstructPro', select: 'Select Language' },
  hi: { title: 'कंस्ट्रक्टप्रो में आपका स्वागत है', select: 'भाषा चुनें' },
  mr: { title: 'कन्स्ट्रक्टप्रो मध्ये स्वागत आहे', select: 'भाषा निवडा' },
  ta: { title: 'கன்ஸ்ட்ரக்ட் ப்ரோ வரவேற்கிறது', select: 'மொழியைத் தேர்ந்தெடுக்கவும்' },
};

// Full language names in native script
const languageNames = {
  en: 'English',
  hi: 'हिंदी',
  mr: 'मराठी',
  ta: 'தமிழ்',
};

export default function WelcomeScreen({ navigation }) {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  return (
    <View style={styles.container}>
      {/* 🔰 Logo with yellow background */}
      <View style={styles.logoBox}>
        <Text style={styles.logoEmoji}>🏗</Text>
      </View>

      <Text style={styles.title}>{t.title}</Text>
      <Text style={styles.subtitle}>{t.select}</Text>

      {/* 🌐 Language Buttons */}
      <View style={styles.langRow}>
        {['en', 'hi', 'mr', 'ta'].map((lang) => (
          <TouchableOpacity
            key={lang}
            onPress={() => setLanguage(lang)}
            style={[styles.langBtn, language === lang && styles.active]}
          >
            <Text style={styles.langText}>{languageNames[lang]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.startBtn}
        onPress={() => navigation.navigate('RoleSelection')}
      >
        <Text style={styles.startText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f14',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  /* Logo box with yellow background */
  logoBox: {
    backgroundColor: '#F4B400',
    padding: 30,
    borderRadius: 24,
    marginBottom: 20,
    elevation: 6,
  },
  logoEmoji: {
    fontSize: 50,
  },

  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 20,
  },

  /* Language buttons row */
  langRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
  },
  langBtn: {
    borderWidth: 1,
    borderColor: '#1F2937',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    margin: 6,
  },
  active: {
    borderColor: '#F4B400',
    backgroundColor: '#1c2430',
  },
  langText: {
    color: 'white',
    fontWeight: '600',
  },

  /* Continue button */
  startBtn: {
    backgroundColor: '#F4B400',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 14,
    elevation: 4,
  },
  startText: {
    color: '#0b0f14',
    fontWeight: '700',
    fontSize: 16,
  },
});
