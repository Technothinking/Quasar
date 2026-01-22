import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function InformationScreen({ route }) {
  const { project } = route.params || {};

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.projectName}>
            {project?.name || 'Project Name'}
          </Text>
          <Text style={styles.area}>
            📍 {project?.area || 'Project Area'}
          </Text>
        </View>

        {/* Logo */}
        <View style={styles.logoBox}>
          <Text style={styles.logo}>🏗</Text>
        </View>
      </View>

      {/* Info Cards */}
      <View style={styles.card}>
        <Text style={styles.label}>Project Status</Text>
        <Text style={styles.value}>Ongoing</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Start Date</Text>
        <Text style={styles.value}>12 January 2025</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Expected Completion</Text>
        <Text style={styles.value}>6 Months</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Total Budget</Text>
        <Text style={styles.value}>₹ 2.5 Crores</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Contractor</Text>
        <Text style={styles.value}>ABC Constructions</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Supervisor</Text>
        <Text style={styles.value}>Rahul Sharma</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
    padding: 20,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  projectName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  area: {
    color: '#9CA3AF',
    marginTop: 4,
  },
  logoBox: {
    backgroundColor: '#F4B400',
    padding: 14,
    borderRadius: 16,
  },
  logo: {
    fontSize: 22,
  },

  /* Cards */
  card: {
    backgroundColor: '#121826',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  label: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
});
