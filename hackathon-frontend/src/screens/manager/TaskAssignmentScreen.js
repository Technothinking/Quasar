import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

export default function TaskAssignmentScreen() {
  const [task, setTask] = useState('');
  const [assignee, setAssignee] = useState('');
  const [tasks, setTasks] = useState([]);

  const handleAssignTask = () => {
    if (!task.trim() || !assignee.trim()) {
      alert('Please fill both fields!');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      task,
      assignee,
      status: 'Pending',
    };

    setTasks([newTask, ...tasks]);
    setTask('');
    setAssignee('');
  };

  const renderTask = ({ item }) => (
    <View style={styles.taskCard}>
      <Text style={styles.taskTitle}>{item.task}</Text>
      <Text style={styles.taskAssignee}>👷 Assigned to: {item.assignee}</Text>
      <Text
        style={[
          styles.taskStatus,
          item.status === 'Done'
            ? styles.done
            : item.status === 'In Progress'
            ? styles.inProgress
            : styles.pending,
        ]}
      >
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
        <Text style={styles.heading}>Assign Tasks</Text>
      </View>

      {/* Task Assignment Form */}
      <View style={styles.formCard}>
        <Text style={styles.label}>Task Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task details"
          placeholderTextColor="#9CA3AF"
          value={task}
          onChangeText={setTask}
        />

        <Text style={styles.label}>Assign To</Text>
        <TextInput
          style={styles.input}
          placeholder="Supervisor / Worker name"
          placeholderTextColor="#9CA3AF"
          value={assignee}
          onChangeText={setAssignee}
        />

        <TouchableOpacity style={styles.button} onPress={handleAssignTask}>
          <Text style={styles.buttonText}>Assign Task</Text>
        </TouchableOpacity>
      </View>

      {/* Assigned Tasks List */}
      <Text style={styles.sectionTitle}>Assigned Tasks</Text>
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
  container: { flex: 1, backgroundColor: '#0B0F14', padding: 20 },

  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  logoBox: {
    backgroundColor: '#F4B400',
    padding: 14,
    borderRadius: 16,
    marginRight: 12,
  },
  logo: { fontSize: 24 },
  heading: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },

  formCard: {
    backgroundColor: '#121826',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 20,
  },
  label: { color: '#9CA3AF', fontSize: 13, marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: '#0B0F14',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#F4B400',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#0B0F14', fontWeight: '700', fontSize: 15 },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  taskCard: {
    backgroundColor: '#121826',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  taskTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', marginBottom: 6 },
  taskAssignee: { color: '#9CA3AF', fontSize: 13, marginBottom: 4 },
  taskStatus: { fontSize: 12, fontWeight: '600', marginTop: 4 },
  done: { color: '#22C55E' },
  inProgress: { color: '#F59E0B' },
  pending: { color: '#F4B400' },
  emptyText: { color: '#9CA3AF', textAlign: 'center', marginTop: 30 },
});
