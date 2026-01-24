import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function ManagerHomeScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch projects assigned to manager
      const { data: roles, error: rolesError } = await supabase
        .from('project_user_roles')
        .select('project_id')
        .eq('user_id', user.id);

      if (rolesError) throw rolesError;

      const projectIds = roles.map(r => r.project_id).filter(id => id != null);
      if (projectIds.length === 0) {
        setProjects([]);
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .in('id', projectIds);

      if (error) throw error;
      setProjects(data);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async () => {
    if (!name || !startDate || !endDate) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('projects')
        .insert([{
          name,
          owner_id: user.id,
          start_date: startDate,
          expected_end_date: endDate,
        }])
        .select()
        .single();

      if (error) throw error;

      // Link creator as manager
      await supabase.from('project_user_roles').insert([
        { project_id: data.id, user_id: user.id, role: 'manager' }
      ]);

      setProjects([data, ...projects]);
      setShowModal(false);
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
    } catch (err) {
      Alert.alert('Creation Failed', err.message);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() =>
        navigation.navigate('ManagerProjectDashboard', { project: item })
      }
    >
      <Text style={styles.projectName}>{item.name}</Text>

      <View style={styles.locationRow}>
        <Text style={styles.locationIcon}>📍</Text>
        <Text style={styles.area}>{item.location || 'N/A'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Your Projects</Text>
          <Text style={styles.subHeading}>
            Review & approve site requests
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.addText}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* Project List */}
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      />

      {/* Create Project Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Create New Project</Text>

              <TextInput
                style={styles.input}
                placeholder="Project Name"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
              />

              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Description"
                placeholderTextColor="#9CA3AF"
                multiline
                value={description}
                onChangeText={setDescription}
              />

              <TextInput
                style={styles.input}
                placeholder="Start Date (DD/MM/YYYY)"
                placeholderTextColor="#9CA3AF"
                value={startDate}
                onChangeText={setStartDate}
              />

              <TextInput
                style={styles.input}
                placeholder="End Date (DD/MM/YYYY)"
                placeholderTextColor="#9CA3AF"
                value={endDate}
                onChangeText={setEndDate}
              />

              <TouchableOpacity style={styles.saveBtn} onPress={addProject}>
                <Text style={styles.saveText}>Create Project</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  subHeading: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 4,
  },

  addButton: {
    backgroundColor: '#F4B400',
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontSize: 24,
    fontWeight: '900',
  },

  card: {
    backgroundColor: '#121826',
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  projectName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  area: {
    color: '#9CA3AF',
    fontSize: 14,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#121826',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#0B0F14',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    marginBottom: 14,
  },
  saveBtn: {
    backgroundColor: '#F4B400',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: {
    fontWeight: '800',
  },
  cancelBtn: {
    alignItems: 'center',
    marginTop: 12,
  },
  cancelText: {
    color: '#9CA3AF',
  },
});
