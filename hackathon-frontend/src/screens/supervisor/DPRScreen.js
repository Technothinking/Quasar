import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

const STAGES = [
  'Excavation',
  'Slab',
  'Brickwork',
  'Plumbing',
  'Electrical',
  'Painting',
  'Finishing',
  'Other',
];

const WORK_STATUS = [
  { label: 'Work Completed', value: 'completed', icon: '✅' },
  { label: 'Partially Completed', value: 'partial', icon: '⚠️' },
  { label: 'No Work', value: 'none', icon: '❌' },
];

const ISSUES = [
  'Material',
  'Equipment',
  'Water',
  'Electricity',
  'Labour',
  'Weather',
  'Approval',
  'Payment',
  'No issue',
];

export default function DPRScreen() {
  const [stage, setStage] = useState('');
  const [otherNote, setOtherNote] = useState('');
  const [workStatus, setWorkStatus] = useState('');
  const [issues, setIssues] = useState([]);
  const [issueNote, setIssueNote] = useState('');

  const toggleIssue = (item) => {
    if (issues.includes(item)) {
      setIssues(issues.filter(i => i !== item));
    } else {
      setIssues([...issues, item]);
    }
  };

  const handleSubmit = () => {
    if (!stage || !workStatus) {
      Alert.alert('Error', 'Stage of work and work status are mandatory.');
      return;
    }

    const data = {
      stage,
      otherNote,
      workStatus,
      issues,
      issueNote,
    };

    console.log('DPR Submitted:', data);
    Alert.alert('Success', 'DPR Saved Successfully');

    // Reset
    setStage('');
    setOtherNote('');
    setWorkStatus('');
    setIssues([]);
    setIssueNote('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🏗</Text>
        </View>
        <Text style={styles.heading}>Daily Progress Report</Text>
      </View>

      {/* Stage of Work */}
      <Text style={styles.label}>Active Stage Today *</Text>
      <View style={styles.optionGrid}>
        {STAGES.map(item => (
          <TouchableOpacity
            key={item}
            style={[
              styles.optionChip,
              stage === item && styles.optionActive,
            ]}
            onPress={() => setStage(item)}
          >
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {stage === 'Other' && (
        <TextInput
          style={styles.input}
          placeholder="Optional note for Other stage"
          placeholderTextColor="#9CA3AF"
          value={otherNote}
          onChangeText={setOtherNote}
        />
      )}

      {/* Work Status */}
      <Text style={styles.label}>Work Status *</Text>
      {WORK_STATUS.map(item => (
        <TouchableOpacity
          key={item.value}
          style={[
            styles.statusRow,
            workStatus === item.value && styles.optionActive,
          ]}
          onPress={() => setWorkStatus(item.value)}
        >
          <Text style={styles.statusText}>
            {item.icon} {item.label}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Issues */}
      <Text style={styles.label}>Any issue blocking work?</Text>
      <View style={styles.optionGrid}>
        {ISSUES.map(item => (
          <TouchableOpacity
            key={item}
            style={[
              styles.optionChip,
              issues.includes(item) && styles.optionActive,
            ]}
            onPress={() => toggleIssue(item)}
          >
            <Text style={styles.optionText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Optional issue note (1–2 lines)"
        placeholderTextColor="#9CA3AF"
        value={issueNote}
        onChangeText={setIssueNote}
      />

      {/* Submit */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save DPR</Text>
      </TouchableOpacity>

      <Text style={styles.info}>
        ℹ️ Missing DPRs for multiple days may auto-flag coordination risk.
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
    marginBottom: 24,
  },
  logoBox: {
    backgroundColor: '#F4B400',
    padding: 14,
    borderRadius: 16,
    marginRight: 12,
  },
  logoEmoji: { fontSize: 24 },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  label: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 8,
    marginTop: 16,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionChip: {
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#121826',
  },
  optionActive: {
    backgroundColor: '#F4B400',
    borderColor: '#F4B400',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  statusRow: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 10,
    backgroundColor: '#121826',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#121826',
    color: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    fontSize: 14,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#F4B400',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B0F14',
  },
  info: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 14,
    textAlign: 'center',
  },
});
