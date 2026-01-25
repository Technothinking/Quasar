import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function WorkerHomeScreen({ route, navigation }) {
  const { projectId } = route.params || {};

  /* 📦 Modules */
  const modules = [
    { title: 'GPS Attendance', screen: 'GPSAttendance', icon: '📍' },
    { title: 'Voice Updates', screen: 'VoiceUpdates', icon: '🎤' },
    { title: 'Daily Tasks', screen: 'TaskView', icon: '📋' },
    { title: 'Photo Upload', screen: 'PhotoUpload', icon: '📸' },
  ];

  return (
    <View style={styles.container}>
      {/* 🔰 Header */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoEmoji}>🏗</Text>
        </View>
        <View>
          <Text style={styles.title}>Worker Dashboard</Text>
          <Text style={{ color: '#9CA3AF', fontSize: 12 }}>Project ID: {projectId || '...'}</Text>
        </View>
      </View>

      {/* 📦 Module Cards */}
      {modules.map(item => (
        <TouchableOpacity
          key={item.title}
          style={styles.card}
          onPress={() => navigation.navigate(item.screen, { projectId })}
          activeOpacity={0.85}
        >
          <Text style={styles.cardIcon}>{item.icon}</Text>
          <Text style={styles.cardText}>{item.title}</Text>
        </TouchableOpacity>
      ))}
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
    marginBottom: 16,
  },
  logo: {
    backgroundColor: '#F4B400',
    padding: 14,
    borderRadius: 14,
    marginRight: 12,
  },
  logoEmoji: { fontSize: 24 },
  title: {
    fontSize: 22,
    color: 'white',
    fontWeight: '700',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121826',
    padding: 18,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
    elevation: 5,
  },
  cardIcon: {
    fontSize: 22,
    marginRight: 14,
  },
  cardText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});
