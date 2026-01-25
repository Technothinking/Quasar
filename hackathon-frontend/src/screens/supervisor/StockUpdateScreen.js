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

export default function StockUpdateScreen({ route }) {
  const { project } = route.params || {};
  const projectId = project?.id;

  const [materialName, setMaterialName] = useState('');
  const [unit, setUnit] = useState('');
  const [currentQty, setCurrentQty] = useState('');

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchLogs();
    }
  }, [projectId]);

  const fetchLogs = async () => {
    try {
      setFetching(true);
      const { data, error } = await supabase
        .from('stock_update')
        .select('*')
        .eq('project_id', projectId)
        .order('id', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error('Fetch stock failed:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleAddStock = async () => {
    if (!materialName.trim() || !unit.trim() || !currentQty.trim()) {
      Alert.alert('Error', 'Please fill all stock details');
      return;
    }

    if (!projectId) {
      Alert.alert('Error', 'Project context missing');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('stock_update')
        .insert([{
          project_id: projectId,
          material_name: materialName,
          unit: unit,
          Quantity: parseFloat(currentQty)
        }])
        .select();

      if (error) throw error;

      Alert.alert('Success', 'Stock level registered!');

      setMaterialName('');
      setUnit('');
      setCurrentQty('');
      fetchLogs();
    } catch (err) {
      Alert.alert('Update Failed', err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderLog = ({ item }) => (
    <View style={styles.logCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.logTitle}>{item.material_name}</Text>
        <Text style={styles.unitBadge}>{item.unit}</Text>
      </View>

      <Text style={styles.logText}>
        📦 Available Stock:{' '}
        <Text style={styles.highlight}>
          {item.Quantity} {item.unit}
        </Text>
      </Text>

      {item.created_at && (
        <Text style={styles.timeText}>
          Updated on: {new Date(item.created_at).toLocaleString()}
        </Text>
      )}
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logo}>🏗</Text>
        </View>
        <View>
          <Text style={styles.heading}>Daily Stock Update</Text>
          {project?.name && (
            <Text style={styles.subHeading}>{project.name}</Text>
          )}
        </View>
      </View>

      {/* Input Form */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Material Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Cement / Steel / Sand"
          placeholderTextColor="#6B7280"
          value={materialName}
          onChangeText={setMaterialName}
        />

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1.5 }}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#6B7280"
              value={currentQty}
              onChangeText={setCurrentQty}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Unit</Text>
            <TextInput
              style={styles.input}
              placeholder="Kg / Bags"
              placeholderTextColor="#6B7280"
              value={unit}
              onChangeText={setUnit}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleAddStock}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Submit Update</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* List Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' }}>
        <Text style={styles.sectionTitle}>Recent Stock Levels</Text>
        <View style={styles.countContainer}>
          <Text style={styles.countText}>{logs.length} Materials</Text>
        </View>
      </View>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderLog}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No stock history for this project yet.</Text>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
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
    marginBottom: 24,
  },
  logoBox: {
    backgroundColor: '#F4B400',
    padding: 14,
    borderRadius: 16,
    marginRight: 12,
  },
  logo: { fontSize: 24 },
  heading: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  subHeading: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  formSection: {
    backgroundColor: '#121826',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 26,
  },
  label: {
    color: '#D1D5DB',
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#0B0F14',
    borderRadius: 16,
    padding: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 16,
    fontSize: 15,
  },
  button: {
    backgroundColor: '#F4B400',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#F4B400',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
  },
  countContainer: {
    backgroundColor: '#121826',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  countText: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '600',
  },
  logCard: {
    backgroundColor: '#121826',
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
  },
  unitBadge: {
    color: '#F4B400',
    fontSize: 10,
    fontWeight: '800',
    backgroundColor: 'rgba(244, 180, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  logText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  highlight: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  timeText: {
    color: '#4B5563',
    fontSize: 11,
    marginTop: 12,
    fontStyle: 'italic',
  },
  emptyText: {
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },
});
