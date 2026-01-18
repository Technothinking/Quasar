import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

const workersData = [
  { id: 1, name: 'Rahul Sharma' },
  { id: 2, name: 'Neha Patel' },
  { id: 3, name: 'Amit Verma' },
  { id: 4, name: 'Sneha Kapoor' },
  { id: 5, name: 'Vikram Singh' },
];

export default function AttendanceScreen() {
  const [attendance, setAttendance] = useState({});

  const setStatus = (id, status) => {
    setAttendance({ ...attendance, [id]: status });
  };

  const handleSubmit = () => {
    console.log('Attendance Submitted:', attendance);
    alert('Attendance Submitted!');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      
      {/* Header with Logo */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🏗</Text>
        </View>
        <Text style={styles.heading}>Attendance</Text>
      </View>

      {/* Workers List */}
      {workersData.map((worker) => (
        <View key={worker.id} style={styles.workerCard}>
          <Text style={styles.workerName}>{worker.name}</Text>
          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={[
                styles.statusButton,
                attendance[worker.id] === 'Present' && styles.present,
              ]}
              onPress={() => setStatus(worker.id, 'Present')}
            >
              <Text style={styles.statusText}>Present</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statusButton,
                attendance[worker.id] === 'Absent' && styles.absent,
              ]}
              onPress={() => setStatus(worker.id, 'Absent')}
            >
              <Text style={styles.statusText}>Absent</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.statusButton,
                attendance[worker.id] === 'Half-Day' && styles.halfDay,
              ]}
              onPress={() => setStatus(worker.id, 'Half-Day')}
            >
              <Text style={styles.statusText}>Half-Day</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit Attendance</Text>
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
  workerCard: {
    backgroundColor: '#121826',
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  workerName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#1C2430',
    alignItems: 'center',
  },
  present: {
    backgroundColor: '#16A34A', // green
  },
  absent: {
    backgroundColor: '#DC2626', // red
  },
  halfDay: {
    backgroundColor: '#3B82F6', // blue
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#F4B400',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B0F14',
  },
});
