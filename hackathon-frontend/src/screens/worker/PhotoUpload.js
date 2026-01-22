import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useLanguage } from '../../context/LanguageContext';

/* 🌐 Translations */
const translations = {
  en: {
    appName: 'ConstructPro',
    title: 'Emergency Proof Upload',
    subtitle: 'Use this only if supervisor is unavailable',
    infoText:
      '🚨 This section is for accidents, delays, damage, or safety issues.\n\nYour photos and notes will be stored safely and synced later.',
    label: 'What happened? *',
    placeholder: 'Describe the issue / emergency',
    photoButton: '📸 Add Site Photo',
    saveButton: 'Save Proof Offline',
    footerNote: 'Location & time will be attached automatically.',
    alertRequiredTitle: 'Required',
    alertRequiredMsg: 'Please describe the incident before saving.',
    alertSavedTitle: 'Saved Offline',
    alertSavedMsg: 'Your proof has been saved and will sync when internet is available.',
  },
  hi: {
    appName: 'कंस्ट्रक्टप्रो',
    title: 'आपातकालीन प्रमाण अपलोड',
    subtitle: 'सुपरवाइजर अनुपलब्ध होने पर ही उपयोग करें',
    infoText:
      '🚨 यह अनुभाग दुर्घटनाओं, देरी, नुकसान या सुरक्षा समस्याओं के लिए है।\n\nआपकी तस्वीरें और नोट सुरक्षित रूप से संग्रहीत की जाएंगी और बाद में सिंक होंगी।',
    label: 'क्या हुआ? *',
    placeholder: 'समस्या / आपातकाल का विवरण दें',
    photoButton: '📸 साइट फोटो जोड़ें',
    saveButton: 'प्रमाण ऑफलाइन सेव करें',
    footerNote: 'स्थान और समय स्वचालित रूप से संलग्न होंगे।',
    alertRequiredTitle: 'आवश्यक',
    alertRequiredMsg: 'कृपया सेव करने से पहले घटना का विवरण दें।',
    alertSavedTitle: 'ऑफलाइन सेव किया गया',
    alertSavedMsg: 'आपका प्रमाण सेव कर दिया गया है और इंटरनेट मिलने पर सिंक होगा।',
  },
  mr: {
    appName: 'कन्स्ट्रक्टप्रो',
    title: 'आपत्कालीन पुरावा अपलोड',
    subtitle: 'सुपरवायझर उपलब्ध नसल्यासच वापरा',
    infoText:
      '🚨 हा विभाग अपघात, उशीर, नुकसान किंवा सुरक्षा समस्यांसाठी आहे.\n\nआपले फोटो आणि नोट्स सुरक्षितपणे संग्रहित केले जातील आणि नंतर समक्रमित होतील.',
    label: 'काय घडले? *',
    placeholder: 'समस्या / आपत्काल वर्णन करा',
    photoButton: '📸 साइट फोटो जोडा',
    saveButton: 'पुरावा ऑफलाइन सेव करा',
    footerNote: 'स्थान आणि वेळ स्वयंचलितपणे जोडले जातील.',
    alertRequiredTitle: 'आवश्यक',
    alertRequiredMsg: 'कृपया सेव्ह करण्यापूर्वी घटनेचे वर्णन द्या.',
    alertSavedTitle: 'ऑफलाइन सेव्ह केले',
    alertSavedMsg: 'आपला पुरावा सेव्ह केला गेला आहे आणि इंटरनेट उपलब्ध झाल्यावर समक्रमित केला जाईल.',
  },
  ta: {
    appName: 'கன்ஸ்ட்ரக்ட் ப்ரோ',
    title: 'அவசரமான ஆதாரம் பதிவேற்றம்',
    subtitle: 'மேலாளி இல்லை என்றால் மட்டுமே பயன்படுத்தவும்',
    infoText:
      '🚨 இந்த பகுதி விபத்துகள், தாமதங்கள், சேதம் அல்லது பாதுகாப்பு பிரச்சனைகளுக்காக உள்ளது.\n\nஉங்கள் புகைப்படங்கள் மற்றும் குறிப்பு பாதுகாப்பாக சேமிக்கப்படும் மற்றும் பின்னர் ஒத்திசைக்கப்படும்.',
    label: 'என்ன நடந்தது? *',
    placeholder: 'பிரச்சனை / அவசரநிலை விவரிக்கவும்',
    photoButton: '📸 தள புகைப்படம் சேர்க்கவும்',
    saveButton: 'ஆஃப்லைனில் ஆதாரம் சேமி',
    footerNote: 'இடம் மற்றும் நேரம் தானாக இணைக்கப்படும்.',
    alertRequiredTitle: 'தேவையானது',
    alertRequiredMsg: 'சேமிப்பதற்கு முன் நிகழ்வை விவரிக்கவும்.',
    alertSavedTitle: 'ஆஃப்லைனில் சேமிக்கப்பட்டது',
    alertSavedMsg: 'உங்கள் ஆதாரம் சேமிக்கப்பட்டுள்ளது மற்றும் இணையம் கிடைக்கும் போது ஒத்திசைக்கப்படும்.',
  },
};

export default function PhotoUpload() {
  const { language } = useLanguage();
  const t = translations[language];

  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!description) {
      Alert.alert(t.alertRequiredTitle, t.alertRequiredMsg);
      return;
    }

    console.log('Emergency Proof Saved:', {
      description,
      time: new Date().toISOString(),
    });

    Alert.alert(t.alertSavedTitle, t.alertSavedMsg);

    setDescription('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      
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

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoText}>{t.infoText}</Text>
      </View>

      {/* Description */}
      <Text style={styles.label}>{t.label}</Text>
      <TextInput
        style={styles.input}
        placeholder={t.placeholder}
        placeholderTextColor="#9CA3AF"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      {/* Upload Photo Button */}
      <TouchableOpacity style={styles.photoButton}>
        <Text style={styles.photoText}>{t.photoButton}</Text>
      </TouchableOpacity>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>{t.saveButton}</Text>
      </TouchableOpacity>

      {/* Footer Note */}
      <Text style={styles.footerNote}>{t.footerNote}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
    color: '#FCA5A5',
    marginBottom: 16,
  },

  infoCard: {
    backgroundColor: '#121826',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#7C2D12',
  },
  infoText: {
    color: '#FCA5A5',
    fontSize: 14,
    lineHeight: 20,
  },

  label: {
    color: '#9CA3AF',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#121826',
    borderRadius: 14,
    padding: 14,
    color: '#fff',
    height: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 16,
  },

  photoButton: {
    borderWidth: 1,
    borderColor: '#F4B400',
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  photoText: {
    color: '#F4B400',
    fontWeight: '700',
  },

  saveButton: {
    backgroundColor: '#F4B400',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveText: {
    color: '#0B0F14',
    fontWeight: '800',
    fontSize: 16,
  },

  footerNote: {
    color: '#6B7280',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 14,
  },
});
