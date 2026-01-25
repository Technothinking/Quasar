import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function TaskAssignmentScreen({ route }) {
  const { project } = route.params || {};
  const projectId = project?.id;

  const [supervisors, setSupervisors] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [task, setTask] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);

  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (!projectId) {
        console.error('No project ID provided!');
        Alert.alert('Error', 'No project selected. Please go back and select a project.');
        setLoading(false);
        return;
      }

      await Promise.all([fetchSupervisors(), fetchTasks()]);
    } catch (err) {
      console.error('Fetch data error:', err);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSupervisors = async () => {
    try {
      console.log('Fetching supervisors for project:', projectId);
      // 1. Get all user_ids with role_id = 3 (supervisor) for this project
      const { data: roles, error: rolesError } = await supabase
        .from('project_user_roles')
        .select('user_id')
        .eq('project_id', projectId)
        .eq('role_id', 3);

      if (rolesError) {
        console.error('Roles fetch error:', rolesError);
        throw rolesError;
      }

      console.log('Found roles:', roles);
      const userIds = roles.map(r => r.user_id);
      if (userIds.length === 0) {
        console.log('No supervisors found for this project');
        setSupervisors([]);
        return;
      }

      // 2. Fetch profile details (full_name) for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', userIds);

      if (profilesError) {
        console.error('Profiles fetch error:', profilesError);
        throw profilesError;
      }
      console.log('Found supervisors:', profiles);
      setSupervisors(profiles || []);
    } catch (err) {
      console.error('Failed to fetch supervisors:', err);
      setSupervisors([]);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Tasks table error:', error);
        // If table doesn't exist, just set empty array
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          console.log('Tasks table does not exist yet - using empty array');
          setTasks([]);
          return;
        }
        throw error;
      }
      setTasks(data || []);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setTasks([]);
    }
  };

  const handleAssignTask = async () => {
    if (!task.trim() || !selectedSupervisor) {
      Alert.alert('Error', 'Please fill task details and select a supervisor');
      return;
    }

    try {
      const { error } = await supabase
        .from('tasks')
        .insert([{
          project_id: projectId,
          task_description: taskDescription || task,
          assigned_to: selectedSupervisor,
          status: 'pending'
        }]);

      if (error) throw error;

      Alert.alert('Success', 'Task assigned successfully!');
      setTask('');
      setTaskDescription('');
      setSelectedSupervisor(null);
      fetchTasks();
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const renderTask = ({ item }) => {
    const supervisor = supervisors.find(s => s.id === item.assigned_to);
    return (
      <View style={styles.taskCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={styles.taskTitle}>{item.task_description}</Text>
          <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            {item.status?.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.taskAssignee}>👷 Assigned to: {supervisor?.full_name || 'Unknown'}</Text>
        <Text style={styles.taskMeta}>� Created: {new Date(item.created_at).toLocaleDateString()}</Text>
        {item.updated_at && (
          <Text style={styles.taskMeta}>� Updated: {new Date(item.updated_at).toLocaleDateString()}</Text>
        )}
      </View>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#22C55E';
      case 'in_progress': return '#F4B400';
      case 'pending': return '#9CA3AF';
      default: return '#9CA3AF';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#F4B400" />
        <Text style={{ color: 'white', marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logo}>🏗</Text>
        </View>
        <View>
          <Text style={styles.heading}>Assign Tasks</Text>
          <Text style={{ color: '#9CA3AF', fontSize: 12 }}>{project?.name || 'Project'}</Text>
        </View>
      </View>

      {/* Task Assignment Form */}
      <View style={styles.formCard}>
        <Text style={styles.label}>Task Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task title"
          placeholderTextColor="#9CA3AF"
          value={task}
          onChangeText={setTask}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 60 }]}
          placeholder="Enter task details (optional)"
          placeholderTextColor="#9CA3AF"
          multiline
          value={taskDescription}
          onChangeText={setTaskDescription}
        />

        <Text style={styles.label}>Assign To Supervisor *</Text>
        {supervisors.length === 0 ? (
          <Text style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 12 }}>
            No supervisors found for this project
          </Text>
        ) : (
          <View style={{ marginBottom: 12 }}>
            {supervisors.map(sup => (
              <TouchableOpacity
                key={sup.id}
                style={[
                  styles.supervisorChip,
                  selectedSupervisor === sup.id && styles.supervisorChipSelected
                ]}
                onPress={() => setSelectedSupervisor(sup.id)}
              >
                <Text style={styles.supervisorText}>{sup.full_name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleAssignTask}>
          <Text style={styles.buttonText}>Assign Task</Text>
        </TouchableOpacity>
      </View>

      {/* Assigned Tasks List */}
      <Text style={styles.sectionTitle}>Assigned Tasks</Text>
      {tasks.length === 0 ? (
        <Text style={styles.emptyText}>No tasks assigned yet</Text>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderTask}
          scrollEnabled={false}
        />
      )}
    </ScrollView>
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
  supervisorChip: {
    backgroundColor: '#0B0F14',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  supervisorChipSelected: {
    backgroundColor: '#F4B400',
    borderColor: '#F4B400',
  },
  supervisorText: {
    color: '#FFFFFF',
    fontWeight: '600',
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
  taskTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  taskDescription: { color: '#9CA3AF', fontSize: 13, marginBottom: 8, marginTop: 4 },
  taskAssignee: { color: '#9CA3AF', fontSize: 13, marginTop: 4 },
  taskMeta: { color: '#9CA3AF', fontSize: 12, marginTop: 4 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 10,
    fontWeight: '800',
    color: '#0B0F14',
  },
  emptyText: { color: '#9CA3AF', textAlign: 'center', marginTop: 30 },
});
