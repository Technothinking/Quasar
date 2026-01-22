import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function OwnerTaskScreen() {
  // Example tasks fetched from backend later; here for offline display
  const [tasks, setTasks] = useState([
    { id: '1', task: 'Foundation Work – Block A', assignee: 'Supervisor 1', status: 'In Progress' },
    { id: '2', task: 'Steel Rod Arrangement', assignee: 'Supervisor 2', status: 'Pending' },
    { id: '3', task: 'Cement Unloading', assignee: 'Worker Team A', status: 'Done' },
  ]);

  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <Text style={styles.taskTitle}>{item.task}</Text>
      <Text style={styles.taskAssignee}>👷 Assigned to: {item.assignee}</Text>
      <Text style={[styles.taskStatus, 
        item.status === 'Done' ? styles.done : item.status === 'In Progress' ? styles.inProgress : styles.pending
      ]}>
        ⏳ Status: {item.status}
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
        <Text style={styles.heading}>Task Overview</Text>
      </View>

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks assigned yet</Text>
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
  logo: { fontSize: 24 },
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
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  taskAssignee: {
    color: '#9CA3AF',
    fontSize: 13,
    marginBottom: 4,
  },
  taskStatus: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  done: { color: '#22C55E' },
  inProgress: { color: '#F59E0B' },
  pending: { color: '#F4B400' },
  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 30,
  },
});
