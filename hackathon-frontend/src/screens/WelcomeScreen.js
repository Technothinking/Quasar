import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

const translations = {
  en: { title: 'Welcome to ConstructPro', select: 'Select Language' },
  hi: { title: 'कंस्ट्रक्टप्रो में आपका स्वागत है', select: 'भाषा चुनें' },
  mr: { title: 'कन्स्ट्रक्टप्रो मध्ये स्वागत आहे', select: 'भाषा निवडा' },
  ta: { title: 'கன்ஸ்ட்ரக்ட் ப்ரோ வரவேற்கிறது', select: 'மொழியைத் தேர்ந்தெடுக்கவும்' },
};

export default function WelcomeScreen({ navigation }) {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  return (
    <View style={styles.container}>

      <Text style={styles.logo}>🏗</Text>
      <Text style={styles.title}>{t.title}</Text>

      <Text style={styles.subtitle}>{t.select}</Text>

      {/* 🌐 Language Buttons */}
      <View style={styles.langRow}>
        {['en', 'hi', 'mr', 'ta'].map(lang => (
          <TouchableOpacity
            key={lang}
            onPress={() => setLanguage(lang)}
            style={[
              styles.langBtn,
              language === lang && styles.active,
            ]}
          >
            <Text style={styles.langText}>{lang.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

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
  logo: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    color: '#9CA3AF',
    marginBottom: 12,
  },
  langRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  langBtn: {
    borderWidth: 1,
    borderColor: '#1F2937',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginHorizontal: 6,
  },
  active: {
    borderColor: '#F4B400',
  },
  langText: {
    color: 'white',
    fontWeight: '600',
  },
  startBtn: {
    backgroundColor: '#F4B400',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 14,
  },
  startText: {
    color: '#0b0f14',
    fontWeight: '700',
  },
});
