import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const DPR_DATA = {
  stage: 'Brickwork',
  otherNote: '',
  workStatus: 'partial',
  issues: ['Material', 'Labour'],
  issueNote: 'Bricks delivery delayed, labour shortage in afternoon',
};

const WORK_STATUS_MAP = {
  completed: { label: 'Work Completed', icon: '✅' },
  partial: { label: 'Partially Completed', icon: '⚠️' },
  none: { label: 'No Work', icon: '❌' },
};

export default function DPRViewScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>📄</Text>
        </View>
        <Text style={styles.heading}>Daily Progress Report</Text>
      </View>

      {/* Stage */}
      <View style={styles.section}>
        <Text style={styles.label}>Stage of Work</Text>
        <Text style={styles.value}>{DPR_DATA.stage}</Text>

        {DPR_DATA.stage === 'Other' && DPR_DATA.otherNote ? (
          <Text style={styles.subValue}>{DPR_DATA.otherNote}</Text>
        ) : null}
      </View>

      {/* Work Status */}
      <View style={styles.section}>
        <Text style={styles.label}>Work Status</Text>
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>
            {WORK_STATUS_MAP[DPR_DATA.workStatus].icon}{' '}
            {WORK_STATUS_MAP[DPR_DATA.workStatus].label}
          </Text>
        </View>
      </View>

      {/* Issues */}
      <View style={styles.section}>
        <Text style={styles.label}>Issues Reported</Text>

        {DPR_DATA.issues.length === 0 ||
        DPR_DATA.issues.includes('No issue') ? (
          <Text style={styles.value}>No issues reported</Text>
        ) : (
          <View style={styles.issueWrap}>
            {DPR_DATA.issues.map((item) => (
              <View key={item} style={styles.issueChip}>
                <Text style={styles.issueText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {DPR_DATA.issueNote ? (
          <View style={styles.noteBox}>
            <Text style={styles.noteLabel}>Supervisor Note</Text>
            <Text style={styles.noteText}>{DPR_DATA.issueNote}</Text>
          </View>
        ) : null}
      </View>

      {/* Info */}
      <Text style={styles.info}>
        ℹ️ DPR submitted by site supervisor. Editing is restricted.
      </Text>
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
    marginBottom: 26,
  },
  logoBox: {
    backgroundColor: '#F4B400',
    padding: 14,
    borderRadius: 16,
    marginRight: 12,
  },
  logoEmoji: {
    fontSize: 22,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },

  section: {
    marginBottom: 22,
  },
  label: {
    color: '#9CA3AF',
    fontSize: 13,
    marginBottom: 6,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  subValue: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },

  statusBox: {
    backgroundColor: '#121826',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },

  issueWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 6,
  },
  issueChip: {
    backgroundColor: '#121826',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  issueText: {
    color: '#FFFFFF',
    fontSize: 13,
  },

  noteBox: {
    backgroundColor: '#121826',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginTop: 10,
  },
  noteLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
  },
  noteText: {
    color: '#FFFFFF',
    fontSize: 14,
  },

  info: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
});
