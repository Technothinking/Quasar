import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';

export default function CheckInOutScreen() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [logs, setLogs] = useState([]);

  const handleCheckInOut = () => {
    const entry = {
      id: Date.now().toString(),
      type: checkedIn ? 'Check-Out' : 'Check-In',
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString(),
      location: '📍 GPS Location Captured',
    };

    setLogs([entry, ...logs]);
    setCheckedIn(!checkedIn);
  };

  const renderLog = ({ item }) => (
    <View style={styles.logCard}>
      <Text style={styles.logType}>
        {item.type === 'Check-In' ? '🟢' : '🔴'} {item.type}
      </Text>
      <Text style={styles.logText}>{item.date} • {item.time}</Text>
      <Text style={styles.logLocation}>{item.location}</Text>
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
        keyExtractor={(item) => item.id}
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

  /* Header */
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

  /* Status */
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

  /* Button */
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

  /* Logs */
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
  logLocation: {
    color: '#F4B400',
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 30,
  },
});
