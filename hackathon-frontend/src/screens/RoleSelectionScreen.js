import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const roles = [
  {
    name: 'Owner',
    icon: '👑',
    desc: 'Business overview & decisions',
  },
  {
    name: 'Manager',
    icon: '📊',
    desc: 'Projects, approvals & billing',
  },
  {
    name: 'Supervisor',
    icon: '🦺',
    desc: 'Daily site supervision',
  },
  {
    name: 'Worker',
    icon: '👷',
    desc: 'Attendance & assigned tasks',
  },
];

export default function RoleSelectionScreen({ navigation }) {
  return (
    <View style={styles.container}>

      {/* Top Logo Section */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🏗</Text>
        </View>

        <Text style={styles.appName}>ConstructPro</Text>
        <Text style={styles.tagline}>Site Management Made Simple</Text>
      </View>

      {/* Section Title */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Your Role</Text>
        <Text style={styles.sectionSubtitle}>
          Choose how you’ll use ConstructPro
        </Text>
      </View>

      {/* Role Cards */}
      {roles.map((role) => (
        <TouchableOpacity
          key={role.name}
          style={styles.card}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Login', { role: role.name })}
        >
          <View style={styles.cardIcon}>
            <Text style={styles.iconText}>{role.icon}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{role.name}</Text>
            <Text style={styles.cardDesc}>{role.desc}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

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

  logoEmoji: {
    fontSize: 36,
  },

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },

  cardIcon: {
    backgroundColor: '#111827',
    padding: 14,
    borderRadius: 14,
    marginRight: 16,
  },

  iconText: {
    fontSize: 22,
  },

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
