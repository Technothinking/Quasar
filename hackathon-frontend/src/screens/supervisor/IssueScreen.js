import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
} from 'react-native';

export default function IssueScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('Low');
  const [issues, setIssues] = useState([]);

  const addIssue = () => {
    if (!title || !description) {
      alert('Please fill all fields');
      return;
    }
    const newIssue = { id: Date.now().toString(), title, description, severity };
    setIssues([newIssue, ...issues]);
    setTitle('');
    setDescription('');
    setSeverity('Low');
    console.log('New Issue Added:', newIssue);
  };

  const severityColor = (level) => {
    switch (level) {
      case 'Low':
        return '#34D399'; // green
      case 'Medium':
        return '#FACC15'; // yellow
      case 'High':
        return '#F87171'; // red
      default:
        return '#9CA3AF';
    }
  };

  const renderIssue = ({ item }) => (
    <View style={[styles.issueCard, { borderLeftColor: severityColor(item.severity) }]}>
      <Text style={styles.issueTitle}>{item.title}</Text>
      <Text style={styles.issueDesc}>{item.description}</Text>
      <Text style={[styles.severity, { color: severityColor(item.severity) }]}>
        {item.severity}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      
      {/* Header with Logo */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🏗</Text>
        </View>
        <Text style={styles.heading}>Issues & Delays</Text>
      </View>

      {/* New Issue Form */}
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Issue title"
        placeholderTextColor="#9CA3AF"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Describe the issue"
        placeholderTextColor="#9CA3AF"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Severity</Text>
      <View style={styles.severityRow}>
        {['Low', 'Medium', 'High'].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.severityBtn,
              { backgroundColor: severity === level ? severityColor(level) : '#121826' },
            ]}
            onPress={() => setSeverity(level)}
          >
            <Text
              style={{
                color: severity === level ? '#0B0F14' : '#FFFFFF',
                fontWeight: '600',
              }}
            >
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.addButton} onPress={addIssue}>
        <Text style={styles.addButtonText}>Add Issue</Text>
      </TouchableOpacity>

      {/* Existing Issues */}
      {issues.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.sectionTitle}>Reported Issues</Text>
          <FlatList
            data={issues}
            keyExtractor={(item) => item.id}
            renderItem={renderIssue}
          />
        </View>
      )}
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
  logoEmoji: {
    fontSize: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  label: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#121826',
    color: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    fontSize: 14,
    textAlignVertical: 'top',
  },
  severityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  severityBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#F4B400',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  addButtonText: {
    color: '#0B0F14',
    fontWeight: '700',
    fontSize: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  issueCard: {
    backgroundColor: '#121826',
    borderLeftWidth: 6,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderColor: '#1F2937',
  },
  issueTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  issueDesc: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 6,
  },
  severity: {
    fontWeight: '700',
    fontSize: 12,
  },
});
