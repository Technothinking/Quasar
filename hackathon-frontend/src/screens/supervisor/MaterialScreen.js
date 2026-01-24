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
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function MaterialScreen({ route }) {
  const { projectId } = route.params || {};

  const [materials, setMaterials] = useState([]);
  const [newMaterial, setNewMaterial] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [supervisorName, setSupervisorName] = useState('...');
  const [projectName, setProjectName] = useState('...');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setFetching(true);
      await Promise.all([
        fetchIdentity(),
        fetchProjectInfo(),
        fetchRequests(),
      ]);
    } finally {
      setFetching(false);
    }
  };

  const fetchIdentity = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (data) setSupervisorName(data.full_name);
    } catch (err) {
      console.error('Identity fetch failed:', err);
    }
  };

  const fetchProjectInfo = async () => {
    if (!projectId) return;
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('name')
        .eq('id', projectId)
        .single();

      if (data) setProjectName(data.name);
    } catch (err) {
      console.error('Project info fetch failed:', err);
    }
  };

  const fetchRequests = async () => {
    if (!projectId) return;
    try {
      const { data, error } = await supabase
        .from('material_requests')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (!error && data) setMaterials(data);
    } catch (err) {
      console.error('Requests fetch failed:', err);
    }
  };

  const handleAddMaterial = async () => {
    if (!newMaterial || !newQuantity || !newUnit) {
      Alert.alert('Error', 'Please fill all fields!');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('material_requests')
        .insert([{
          project_id: projectId,
          Project_name: projectName,
          material_name: newMaterial,
          unit: newUnit,
          quantity_requested: parseFloat(newQuantity),
          submitted: supervisorName,
          status: 'pending'
        }]);

      if (error) throw error;

      Alert.alert('Success', 'Material request submitted!');
      setNewMaterial('');
      setNewQuantity('');
      setNewUnit('');
      fetchRequests(); // Refresh list
    } catch (err) {
      Alert.alert('Submission Failed', err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.cardText}>{item.material_name}</Text>
        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.cardQuantity}>
        {item.quantity_requested} {item.unit}
      </Text>
    </View>
  );

  const getStatusColor = (status) => {
    if (status === 'approved') return '#22C55E';
    if (status === 'rejected') return '#EF4444';
    return '#F4B400';
  };

  const ListHeader = () => (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🏗</Text>
        </View>
        <View>
          <Text style={styles.heading}>Material Requests</Text>
          <Text style={{ color: '#9CA3AF', fontSize: 12 }}>Project: {projectName}</Text>
        </View>
      </View>

      {/* Form */}
      <Text style={styles.label}>Material Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Cement"
        placeholderTextColor="#9CA3AF"
        value={newMaterial}
        onChangeText={setNewMaterial}
      />

      <Text style={styles.label}>Quantity</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 50"
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        value={newQuantity}
        onChangeText={setNewQuantity}
      />

      <Text style={styles.label}>Unit</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Kg / Bags / Nos"
        placeholderTextColor="#9CA3AF"
        value={newUnit}
        onChangeText={setNewUnit}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddMaterial}>
        <Text style={styles.buttonText}>Add Material</Text>
      </TouchableOpacity>

      <Text style={styles.listHeading}>Requested Materials</Text>
    </View>
  );

  if (fetching) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#F4B400" />
        <Text style={{ color: 'white', marginTop: 10 }}>Loading Material Data...</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={{ backgroundColor: '#0B0F14' }}
      data={materials}
      keyExtractor={(item) => item.id?.toString()}
      renderItem={renderItem}
      ListHeaderComponent={ListHeader}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
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
  label: {
    color: '#9CA3AF',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#121826',
    color: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  button: {
    backgroundColor: '#F4B400',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  buttonText: {
    color: '#0B0F14',
    fontWeight: '700',
    fontSize: 16,
  },
  listHeading: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#121826',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  cardText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  cardQuantity: {
    color: '#9CA3AF',
    marginTop: 4,
  },
});
