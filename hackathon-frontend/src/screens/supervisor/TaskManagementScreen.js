import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function TaskManagementScreen({ route }) {
  const { projectId } = route.params || {};

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);

      // 1. Get current supervisor's UUID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // 2. Fetch tasks assigned to this supervisor
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      console.log('Fetched tasks for supervisor:', data);
      setTasks(data || []);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      Alert.alert('Error', 'Failed to load tasks: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (taskId, currentStatus) => {
    try {
      let nextStatus;
      if (currentStatus === 'pending') {
        nextStatus = 'in_progress';
      } else if (currentStatus === 'in_progress') {
        nextStatus = 'completed';
      } else {
        return; // Already completed
      }

      const { error } = await supabase
        .from('tasks')
        .update({ status: nextStatus })
        .eq('id', taskId);

      if (error) throw error;

      // Update local state
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, status: nextStatus } : task
      ));

      Alert.alert('Success', `Task marked as ${nextStatus.replace('_', ' ')}`);
    } catch (err) {
      Alert.alert('Error', 'Failed to update task: ' + err.message);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending':
        return styles.pending;
      case 'in_progress':
        return styles.inProgress;
      case 'completed':
        return styles.completed;
      default:
        return styles.pending;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in_progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <Text style={styles.taskTitle}>{item.task_description}</Text>

      <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
        <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
      </View>

      <Text style={styles.taskMeta}>📅 Created: {new Date(item.created_at).toLocaleDateString()}</Text>
      {item.updated_at && (
        <Text style={styles.taskMeta}>🔄 Updated: {new Date(item.updated_at).toLocaleDateString()}</Text>
      )}

      {item.status !== 'completed' && (
        <TouchableOpacity
          style={styles.statusBtn}
          onPress={() => updateStatus(item.id, item.status)}
        >
          <Text style={styles.statusBtnText}>
            {item.status === 'pending'
              ? 'Start Task'
              : 'Mark Completed'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#F4B400" />
        <Text style={{ color: 'white', marginTop: 10 }}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🏗</Text>
        </View>
        <View>
          <Text style={styles.heading}>My Tasks</Text>
          <Text style={{ color: '#9CA3AF', fontSize: 12 }}>{tasks.length} task(s)</Text>
        </View>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderTask}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks assigned to you yet</Text>
        }
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
  logoEmoji: { fontSize: 24 },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  taskCard: {
    backgroundColor: '#121826',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  taskTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  taskMeta: {
    color: '#9CA3AF',
    fontSize: 13,
  },

  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 8,
  },
  pending: { backgroundColor: '#F4B400' },
  inProgress: { backgroundColor: '#3B82F6' },
  completed: { backgroundColor: '#22C55E' },
  statusText: {
    color: '#0B0F14',
    fontSize: 12,
    fontWeight: '700',
  },

  statusBtn: {
    backgroundColor: '#1F2937',
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  statusBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 40,
  },
});
