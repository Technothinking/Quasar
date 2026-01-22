import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function SitePhotosScreen() {
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🏗</Text>
        </View>
        <Text style={styles.heading}>Site Photos</Text>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Upload & View Site Images</Text>
        <Text style={styles.infoText}>
          Capture site progress photos for daily tracking, audits, and reports.
        </Text>
      </View>

      {/* Placeholder Area */}
      <View style={styles.placeholderBox}>
        <Text style={styles.placeholderIcon}>📸</Text>
        <Text style={styles.placeholderText}>
          No site photos uploaded yet
        </Text>
      </View>

      {/* Upload Button (future use) */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Upload Site Photo</Text>
      </TouchableOpacity>

    </View>
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
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBox: {
    backgroundColor: '#F4B400',
    padding: 14,
    borderRadius: 16,
    marginRight: 12,
  },
  logoEmoji: {
    fontSize: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Info Card */
  infoCard: {
    backgroundColor: '#121826',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 30,
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  infoText: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 20,
  },

  /* Placeholder */
  placeholderBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121826',
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  placeholderText: {
    color: '#9CA3AF',
    fontSize: 14,
  },

  /* Button */
  button: {
    backgroundColor: '#F4B400',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: '#0B0F14',
    fontSize: 16,
    fontWeight: '700',
  },
});
