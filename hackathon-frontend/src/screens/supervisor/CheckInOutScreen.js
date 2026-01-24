import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

import { checkIn, checkOut, getTodayAttendance } from '../../db/attendance';

export default function CheckInOutScreen() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [logs, setLogs] = useState([]);

  const handleCheckInOut = async () => {
    console.log('CHECK-IN BUTTON PRESSED');

    try {
      if (!checkedIn) {
        await checkIn({
          userId: 'SUPERVISOR_1',
          projectId: 1,
        });
      } else {
        // 🔴 FIX: match function signature
        await checkOut({ userId: 'SUPERVISOR_1' });
      }

      setCheckedIn(!checkedIn);
      loadLogs();
    } catch (e) {
      console.log('❌ ERROR IN CHECK-IN/OUT', e);
    }
  };

  const loadLogs = async () => {
    const data = await getTodayAttendance('SUPERVISOR_1');
    setLogs(data);
  };

  const renderLog = ({ item }) => (
    <View style={styles.logCard}>
      {/* 🔴 FIX: render fields that actually exist */}
      <Text style={styles.logType}>{item.status}</Text>
      <Text style={styles.logText}>
        {item.check_in_time || item.check_out_time}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logo}>🏗</Text>
        </View>
        <Text style={styles.heading}>Supervisor Attendance</Text>
      </View>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Current Status</Text>
        <Text
          style={[
            styles.statusValue,
            { color: checkedIn ? '#22C55E' : '#EF4444' },
          ]}
        >
          {checkedIn ? 'Checked In' : 'Checked Out'}
        </Text>
        <Text style={styles.gpsText}>📍 GPS Enabled</Text>
      </View>

      {/* Check In / Out Button */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          { backgroundColor: checkedIn ? '#EF4444' : '#F4B400' },
        ]}
        onPress={handleCheckInOut}
      >
        <Text style={styles.actionText}>
          {checkedIn ? 'Check Out' : 'Check In'}
        </Text>
      </TouchableOpacity>

      {/* Logs */}
      <Text style={styles.sectionTitle}>Attendance History</Text>

      <FlatList
        data={logs}
        // 🔴 FIX: correct primary key
        keyExtractor={(item) => item.local_id}
        renderItem={renderLog}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No attendance records yet
          </Text>
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
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
    marginBottom: 20,
  },
  logoBox: {
    backgroundColor: '#F4B400',
    padding: 14,
    borderRadius: 16,
    marginRight: 12,
  },
  logo: { fontSize: 24 },
  heading: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  statusCard: {
    backgroundColor: '#121826',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 20,
  },
  statusLabel: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: '800',
    marginVertical: 6,
  },
  gpsText: {
    color: '#9CA3AF',
    fontSize: 12,
  },

  actionButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  actionText: {
    color: '#0B0F14',
    fontSize: 18,
    fontWeight: '800',
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  logCard: {
    backgroundColor: '#121826',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 12,
  },
  logType: {
    color: '#fff',
    fontWeight: '700',
    marginBottom: 4,
  },
  logText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 30,
  },
});
