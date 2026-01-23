import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

/* 🌐 Translations */
const translations = {
  en: {
    appName: 'ConstructPro',
    tagline: 'Site Management Made Simple',
    selectRole: 'Select Your Role',
    subtitle: 'Choose how you’ll use ConstructPro',
    roles: {
      Owner: 'Business overview & decisions',
      Manager: 'Projects, approvals & billing',
      Supervisor: 'Daily site supervision',
      Worker: 'Attendance & assigned tasks',
    },
    roleTitles: {
      Owner: 'Owner',
      Manager: 'Manager',
      Supervisor: 'Supervisor',
      Worker: 'Worker',
    },
  },
  hi: {
    appName: 'कंस्ट्रक्टप्रो',
    tagline: 'साइट प्रबंधन सरल बनाया',
    selectRole: 'अपनी भूमिका चुनें',
    subtitle: 'आप ConstructPro कैसे उपयोग करेंगे',
    roles: {
      Owner: 'व्यवसाय और निर्णय',
      Manager: 'प्रोजेक्ट, स्वीकृति और बिलिंग',
      Supervisor: 'दैनिक साइट निगरानी',
      Worker: 'हाजिरी और कार्य',
    },
    roleTitles: {
      Owner: 'मालिक',
      Manager: 'प्रबंधक',
      Supervisor: 'सुपरवाइज़र',
      Worker: 'कर्मचारी',
    },
  },
  mr: {
    appName: 'कन्स्ट्रक्टप्रो',
    tagline: 'साइट व्यवस्थापन सोपे केले',
    selectRole: 'तुमची भूमिका निवडा',
    subtitle: 'ConstructPro कसा वापरणार आहात',
    roles: {
      Owner: 'व्यवसाय व निर्णय',
      Manager: 'प्रकल्प, मंजुरी व बिलिंग',
      Supervisor: 'दैनिक साइट देखरेख',
      Worker: 'हजेरी व कामे',
    },
    roleTitles: {
      Owner: 'मालक',
      Manager: 'व्यवस्थापक',
      Supervisor: 'सुपरवायझर',
      Worker: 'कामगार',
    },
  },
  ta: {
    appName: 'கன்ஸ்ட்ரக்ட் ப்ரோ',
    tagline: 'தள மேலாண்மை எளிதாக',
    selectRole: 'உங்கள் பாத்திரத்தை தேர்வு செய்யவும்',
    subtitle: 'ConstructPro ஐ எப்படி பயன்படுத்துவீர்கள்',
    roles: {
      Owner: 'வணிக முடிவுகள்',
      Manager: 'திட்டங்கள் & அனுமதிகள்',
      Supervisor: 'தள மேற்பார்வு',
      Worker: 'வருகை & பணிகள்',
    },
    roleTitles: {
      Owner: 'உயர்முறை',
      Manager: 'மேலாளர்',
      Supervisor: 'மேற்பார்வையாளர்',
      Worker: 'தொழிலாளர்',
    },
  },
};

/* 👤 Roles array */
const roles = [
  { name: 'Owner', icon: '👑' },
  { name: 'Manager', icon: '📊' },
  { name: 'Supervisor', icon: '🦺' },
  { name: 'Worker', icon: '👷' },
];

export default function RoleSelectionScreen({ navigation }) {
  const { language } = useLanguage();
  const t = translations[language];

  const handleRolePress = (role) => {
    if (role === 'Owner') {
      navigation.navigate('OwnerStack');
    } else if (role === 'Manager') {
      navigation.navigate('ManagerStack'); // add later
    } else if (role === 'Supervisor') {
      navigation.navigate('SupervisorStack'); // add later
    } else if (role === 'Worker') {
      navigation.navigate('WorkerStack'); // add later
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔰 Header */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🏗</Text>
        </View>
        <Text style={styles.appName}>{t.appName}</Text>
        <Text style={styles.tagline}>{t.tagline}</Text>
      </View>

      {/* 📌 Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.selectRole}</Text>
        <Text style={styles.sectionSubtitle}>{t.subtitle}</Text>
      </View>

      {/* 👤 Role Cards */}
      {roles.map(role => (
        <TouchableOpacity
          key={role.name}
          style={styles.card}
          activeOpacity={0.85}
          onPress={() => handleRolePress(role.name)}
        >
          <View style={styles.cardIcon}>
            <Text style={styles.iconText}>{role.icon}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{t.roleTitles[role.name]}</Text>
            <Text style={styles.cardDesc}>{t.roles[role.name]}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

/* 🎨 Styles (unchanged) */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f14',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoBox: {
    backgroundColor: '#facc15',
    padding: 20,
    borderRadius: 22,
    marginBottom: 14,
  },
  logoEmoji: { fontSize: 36 },
  appName: {
    color: 'white',
    fontSize: 30,
    fontWeight: '800',
  },
  tagline: {
    color: '#9CA3AF',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: '#9CA3AF',
    marginTop: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c2430',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    elevation: 6,
  },
  cardIcon: {
    backgroundColor: '#111827',
    padding: 14,
    borderRadius: 14,
    marginRight: 16,
  },
  iconText: { fontSize: 22 },
  cardTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  cardDesc: {
    color: '#9CA3AF',
    marginTop: 2,
    fontSize: 13,
  },
});
