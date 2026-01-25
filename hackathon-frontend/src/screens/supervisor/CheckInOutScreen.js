import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { supabase } from '../../lib/supabase';
import { isWithinRadius } from '../../utils/location';
import { checkIn, checkOut, getTodayAttendance } from '../../db/attendance';

export default function CheckInOutScreen({ route }) {
  const { project } = route.params || {};
  const projectId = project?.id;

  const [checkedIn, setCheckedIn] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [siteLocation, setSiteLocation] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (projectId) {
      loadInitialData();
    }
  }, [projectId]);

  const loadInitialData = async () => {
    setFetching(true);
    try {
      // 1. Get current user
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      // 2. Get project site location
      const { data: siteData, error: siteError } = await supabase
        .from('project_sites')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (siteData) setSiteLocation(siteData);

      // 3. Get today's attendance
      if (authUser) {
        const attendance = await getTodayAttendance(authUser.id, projectId);
        if (attendance) {
          setCheckedIn(!!attendance.check_in_time && !attendance.check_out_time);

          const displayLogs = [];
          if (attendance.check_in_time) {
            displayLogs.push({ id: 'in', type: 'Check In', time: attendance.check_in_time });
          }
          if (attendance.check_out_time) {
            displayLogs.push({ id: 'out', type: 'Check Out', time: attendance.check_out_time });
          }
          setLogs(displayLogs);
        } else {
          setCheckedIn(false);
          setLogs([]);
        }
      }
    } catch (err) {
      console.error('Failed to load attendance data:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleCheckInOut = async () => {
    if (!siteLocation) {
      Alert.alert('Configuration Error', 'Project site location (latitude/longitude) is not set in the database.');
      return;
    }

    setLoading(true);
    try {
      // 1. Request GPS Permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'GPS access is required for site attendance.');
        setLoading(false);
        return;
      }

      // 2. Get High Accuracy Position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const { latitude, longitude } = location.coords;

      // 3. Geofencing Validation
      const inRadius = isWithinRadius(
        latitude,
        longitude,
        siteLocation.latitude,
        siteLocation.longitude,
        siteLocation.radius_meters || 200
      );

      if (!inRadius) {
        Alert.alert(
          'Out of Proximity',
          `You are not at the site. Geofencing requires you to be within ${siteLocation.radius_meters || 200}m.`
        );
        setLoading(false);
        return;
      }

      // 4. Persistence
      if (!checkedIn) {
        await checkIn({
          userId: user.id,
          projectId: projectId,
          role: 'supervisor', // Context could be dynamic later
          method: 'self'
        });
        Alert.alert('Checked In', 'Your attendance has been marked.');
      } else {
        await checkOut(user.id, projectId);
        Alert.alert('Checked Out', 'You have successfully checked out.');
      }

      // 5. Refresh State
      await loadInitialData();
    } catch (err) {
      Alert.alert('Error', err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderLog = ({ item }) => (
    <View style={styles.logCard}>
      <Text style={styles.logType}>{item.type}</Text>
      <Text style={styles.logText}>
        {new Date(item.time).toLocaleTimeString()}
      </Text>
    </View>
  );

  if (fetching) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#F4B400" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoBox}><Text style={styles.logo}>🏗</Text></View>
        <View>
          <Text style={styles.heading}>Site Attendance</Text>
          <Text style={styles.subHeading}>{project?.name || 'Project Site'}</Text>
        </View>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusLabel}>Current Status</Text>
        <Text style={[styles.statusValue, { color: checkedIn ? '#22C55E' : '#EF4444' }]}>
          {checkedIn ? '✅ Active / Checked In' : '❌ Inactive / Checked Out'}
        </Text>
        <Text style={styles.gpsText}>📍 {siteLocation ? `Geofencing Active (${siteLocation.radius_meters}m)` : 'GPS Verification Required'}</Text>
      </View>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: checkedIn ? '#EF4444' : '#F4B400' }, loading && { opacity: 0.7 }]}
        onPress={handleCheckInOut}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.actionText}>{checkedIn ? 'Check Out' : 'Check In'}</Text>}
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Today's Activity Logs</Text>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={renderLog}
        ListEmptyComponent={<Text style={styles.emptyText}>No attendance activity found for today.</Text>}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F14', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  logoBox: { backgroundColor: '#F4B400', padding: 14, borderRadius: 16, marginRight: 12 },
  logo: { fontSize: 24 },
  heading: { color: '#fff', fontSize: 22, fontWeight: '700' },
  subHeading: { color: '#9CA3AF', fontSize: 13 },
  statusCard: { backgroundColor: '#121826', padding: 18, borderRadius: 16, borderWidth: 1, borderColor: '#1F2937', marginBottom: 20 },
  statusLabel: { color: '#9CA3AF', fontSize: 13 },
  statusValue: { fontSize: 18, fontWeight: '800', marginVertical: 8 },
  gpsText: { color: '#9CA3AF', fontSize: 11 },
  actionButton: { paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginBottom: 30 },
  actionText: { color: '#0B0F14', fontSize: 18, fontWeight: '800' },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  logCard: { backgroundColor: '#121826', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#1F2937', marginBottom: 12 },
  logType: { color: '#fff', fontWeight: '700', marginBottom: 4 },
  logText: { color: '#9CA3AF', fontSize: 13 },
  emptyText: { color: '#4B5563', textAlign: 'center', marginTop: 30 },
});
