import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../../lib/supabase';

import { saveDPR } from '../../db/dpr';

const STAGES = [
  { label: 'Excavation', value: 'excavation' },
  { label: 'Slab', value: 'slab' },
  { label: 'Brickwork', value: 'brickwork' },
  { label: 'Plumbing', value: 'plumbing' },
  { label: 'Electrical', value: 'electrical' },
  { label: 'Painting', value: 'painting' },
  { label: 'Finishing', value: 'finishing' },
  { label: 'Other', value: 'other' },
];

const WORK_STATUS = [
  { label: 'Work Completed', value: 'completed', icon: '✅' },
  { label: 'Partially Completed', value: 'partial', icon: '⚠️' },
  { label: 'No Work', value: 'no_work', icon: '❌' },
];

const ISSUES = [
  { label: 'Material', value: 'material' },
  { label: 'Equipment', value: 'equipment' },
  { label: 'Water', value: 'water' },
  { label: 'Electricity', value: 'electricity' },
  { label: 'Labour', value: 'labour' },
  { label: 'Weather', value: 'weather' },
  { label: 'Approval', value: 'approval' },
  { label: 'Payment', value: 'payment' },
];

export default function DPRScreen({ route }) {
  const { projectId } = route.params || {};

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [stage, setStage] = useState('');
  const [otherNote, setOtherNote] = useState('');
  const [workStatus, setWorkStatus] = useState('');
  const [issues, setIssues] = useState([]);
  const [issueNote, setIssueNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [supervisorName, setSupervisorName] = useState('Fetching...');
  const [projectName, setProjectName] = useState('Fetching...');

  useEffect(() => {
    fetchDPRContext();
  }, []);

  const fetchDPRContext = async () => {
    try {
      // 1. Get supervisor name
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        if (profile) setSupervisorName(profile.full_name);
      }

      // 2. Get project name
      if (projectId) {
        const { data: project } = await supabase
          .from('projects')
          .select('name')
          .eq('id', projectId)
          .single();
        if (project) setProjectName(project.name);
      }
    } catch (err) {
      console.error('DPR context fetch failed:', err);
      setSupervisorName('Unknown');
      setProjectName('Unknown');
    }
  };


  const toggleIssue = (val) => {
    if (issues.includes(val)) {
      setIssues(issues.filter(i => i !== val));
    } else {
      setIssues([...issues, val]);
    }
  };

  const handleSubmit = async () => {
    if (!stage || !workStatus) {
      Alert.alert('Error', 'Please select a Stage and Work Status.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('daily_dprs')
        .insert([
          {
            project_id: projectId,
            date: date,
            active_stage: stage,
            work_status: workStatus,
            issues: issues,
            issue_note: issueNote,
            submitted_by: supervisorName,
          },
        ]);

      if (error) throw error;

      Alert.alert('Success', 'DPR Saved Successfully');

      // Reset form (except project)
      setStage('');
      setOtherNote('');
      setWorkStatus('');
      setIssues([]);
      setIssueNote('');

    } catch (err) {
      Alert.alert('Submission Failed', err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
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

      {/* Basic Info */}
      <View style={{ marginBottom: 10 }}>
        <Text style={[styles.label, { marginTop: 0 }]}>Project: {projectName}</Text>
        <Text style={[styles.label, { marginTop: 4 }]}>Submitted By: {supervisorName}</Text>
      </View>

      <Text style={styles.label}>Report Date (YYYY-MM-DD) *</Text>
      <TextInput
        style={styles.input}
        placeholder="2024-01-25"
        placeholderTextColor="#9CA3AF"
        value={date}
        onChangeText={setDate}
      />

      {/* Stage of Work */}
      <Text style={styles.label}>Active Stage Today *</Text>
      <View style={styles.optionGrid}>
        {STAGES.map(item => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.optionChip,
              stage === item.value && styles.optionActive,
            ]}
            onPress={() => setStage(item.value)}
          >
            <Text style={styles.optionText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {stage === 'other' && (
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
            key={item.value}
            style={[
              styles.optionChip,
              issues.includes(item.value) && styles.optionActive,
            ]}
            onPress={() => toggleIssue(item.value)}
          >
            <Text style={styles.optionText}>{item.label}</Text>
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
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save DPR'}</Text>
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
