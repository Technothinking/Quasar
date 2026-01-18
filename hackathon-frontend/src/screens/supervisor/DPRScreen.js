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

export default function DPRScreen() {
  const [date, setDate] = useState('');
  const [workDone, setWorkDone] = useState('');
  const [laborCount, setLaborCount] = useState('');
  const [materials, setMaterials] = useState('');
  const [remarks, setRemarks] = useState('');

  const handleSubmit = () => {
    // Validation: all fields required
    if (!date || !workDone || !laborCount || !materials || !remarks) {
      Alert.alert('Error', 'Please fill all fields before submitting!');
      return;
    }

    const data = { date, workDone, laborCount, materials, remarks };
    
    // Log submission
    console.log('DPR Submitted:', data);
    
    // Show alert
    Alert.alert('Success', 'DPR Submitted Successfully!');

    // Reset fields
    setDate('');
    setWorkDone('');
    setLaborCount('');
    setMaterials('');
    setRemarks('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      
      {/* Header with Logo */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🏗</Text>
        </View>
        <Text style={styles.heading}>Daily Progress Report</Text>
      </View>

      {/* Date Input */}
      <Text style={styles.label}>Date *</Text>
      <TextInput
        style={styles.input}
        placeholder="DD/MM/YYYY"
        placeholderTextColor="#9CA3AF"
        value={date}
        onChangeText={setDate}
      />

      {/* Work Done */}
      <Text style={styles.label}>Work Done *</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Describe the work completed today"
        placeholderTextColor="#9CA3AF"
        value={workDone}
        onChangeText={setWorkDone}
        multiline
      />

      {/* Labor Count */}
      <Text style={styles.label}>Labor Count *</Text>
      <TextInput
        style={styles.input}
        placeholder="Number of workers today"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        value={laborCount}
        onChangeText={setLaborCount}
      />

      {/* Materials Used */}
      <Text style={styles.label}>Materials Used *</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Materials consumed today"
        placeholderTextColor="#9CA3AF"
        value={materials}
        onChangeText={setMaterials}
        multiline
      />

      {/* Remarks */}
      <Text style={styles.label}>Remarks *</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Any additional notes"
        placeholderTextColor="#9CA3AF"
        value={remarks}
        onChangeText={setRemarks}
        multiline
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit DPR</Text>
      </TouchableOpacity>
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
    marginBottom: 6,
    marginTop: 12,
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
  button: {
    backgroundColor: '#F4B400',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B0F14',
  },
});
