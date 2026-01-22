import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

export default function TaskManagementScreen() {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      task: 'Check foundation work',
      assignee: 'Supervisor',
      status: 'Pending',
    },
    {
      id: '2',
      task: 'Coordinate cement delivery',
      assignee: 'Supervisor',
      status: 'In Progress',
    },
  ]);

  const updateStatus = (id) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? {
            ...task,
            status:
              task.status === 'Pending'
                ? 'In Progress'
                : task.status === 'In Progress'
                ? 'Completed'
                : 'Completed',
          }
        : task
    ));
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <Text style={styles.taskTitle}>{item.task}</Text>
      <Text style={styles.taskMeta}>👷 Assigned to: {item.assignee}</Text>
      <Text style={styles.taskStatus}>⏳ Status: {item.status}</Text>

      {item.status !== 'Completed' && (
        <TouchableOpacity
          style={styles.statusBtn}
          onPress={() => updateStatus(item.id)}
        >
          <Text style={styles.statusBtnText}>Update Status</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🏗</Text>
        </View>
        <Text style={styles.heading}>My Tasks</Text>
      </View>

      {/* Task List */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks assigned</Text>
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
  logoEmoji: {
    fontSize: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Tasks */
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
  taskStatus: {
    color: '#F4B400',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },

  statusBtn: {
    backgroundColor: '#1F2937',
    marginTop: 10,
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
