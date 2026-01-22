import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useLanguage } from '../../context/LanguageContext';

/* 🌐 Translations */
const translations = {
  en: {
    appName: 'ConstructPro',
    title: 'Team Tasks',
    subtitle: 'Tasks assigned to workers',
    status: { done: 'DONE', pending: 'PENDING' },
  },
  hi: {
    appName: 'कंस्ट्रक्टप्रो',
    title: 'टीम कार्य',
    subtitle: 'मजदूरों को सौंपे गए कार्य',
    status: { done: 'पूर्ण', pending: 'बकाया' },
  },
  mr: {
    appName: 'कन्स्ट्रक्टप्रो',
    title: 'टीम कामे',
    subtitle: 'कामगारांना दिलेली कामे',
    status: { done: 'पूर्ण', pending: 'प्रलंबित' },
  },
  ta: {
    appName: 'கன்ஸ்ட்ரக்ட் ப்ரோ',
    title: 'அணி பணிகள்',
    subtitle: 'தொழிலாளர்களுக்கு ஒதுக்கப்பட்ட பணிகள்',
    status: { done: 'முடிந்தது', pending: 'மீதமுள்ளது' },
  },
};

export default function SupervisorTaskView() {
  const { language } = useLanguage();
  const t = translations[language];

  /* 🔒 Read-only task list (will come from backend later) */
  const tasks = [
    { id: 1, title: 'Foundation work – Block A', status: 'done' },
    { id: 2, title: 'Steel rod arrangement', status: 'pending' },
    { id: 3, title: 'Cement unloading', status: 'pending' },
  ];

  return (
    <View style={styles.container}>
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

      {/* Task List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskCard}>
            <Text style={styles.taskText}>{task.title}</Text>

            <View
              style={[
                styles.statusBadge,
                task.status === 'done' ? styles.done : styles.pending,
              ]}
            >
              <Text style={styles.statusText}>
                {task.status === 'done'
                  ? t.status.done
                  : t.status.pending}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* 🎨 Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
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
    color: '#9CA3AF',
    marginBottom: 20,
  },

  taskCard: {
    backgroundColor: '#121826',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskText: {
    color: '#E5E7EB',
    fontSize: 15,
    flex: 1,
    marginRight: 10,
  },

  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  pending: {
    backgroundColor: '#F4B400',
  },
  done: {
    backgroundColor: '#22C55E',
  },
  statusText: {
    fontWeight: '800',
    color: '#0B0F14',
    fontSize: 12,
  },
});
