import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

export default function StockUpdateScreen() {
  const [materialName, setMaterialName] = useState('');
  const [unit, setUnit] = useState('');
  const [currentQty, setCurrentQty] = useState('');
  const [logs, setLogs] = useState([]);

  const addLog = () => {
    if (!materialName || !unit || !currentQty) {
      alert('Please fill all stock details');
      return;
    }

    const newLog = {
      id: Date.now().toString(),
      materialName,
      unit,
      currentQty,
      time: new Date().toLocaleString(),
    };

    setLogs([newLog, ...logs]);

    setMaterialName('');
    setUnit('');
    setCurrentQty('');
  };

  const renderLog = ({ item }) => (
    <View style={styles.logCard}>
      <Text style={styles.logTitle}>{item.materialName}</Text>

      <Text style={styles.logText}>
        📦 Current Stock:{' '}
        <Text style={styles.highlight}>
          {item.currentQty} {item.unit}
        </Text>
      </Text>

      <Text style={styles.timeText}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logo}>🏗</Text>
        </View>
        <Text style={styles.heading}>Daily Stock Update</Text>
      </View>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Material Name (e.g. Cement)"
        placeholderTextColor="#9CA3AF"
        value={materialName}
        onChangeText={setMaterialName}
      />

      <TextInput
        style={styles.input}
        placeholder="Unit (Bags / Kg / Ton)"
        placeholderTextColor="#9CA3AF"
        value={unit}
        onChangeText={setUnit}
      />

      <TextInput
        style={styles.input}
        placeholder="Current Quantity"
        placeholderTextColor="#9CA3AF"
        value={currentQty}
        onChangeText={setCurrentQty}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={addLog}>
        <Text style={styles.buttonText}>Submit Update</Text>
      </TouchableOpacity>

      {/* Logs */}
      <Text style={styles.sectionTitle}>Recent Updates</Text>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        renderItem={renderLog}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No updates submitted yet</Text>
        }
        contentContainerStyle={{ paddingBottom: 30 }}
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
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  input: {
    backgroundColor: '#121826',
    borderRadius: 14,
    padding: 14,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 12,
  },

  button: {
    backgroundColor: '#F4B400',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#0B0F14',
    fontWeight: '700',
    fontSize: 15,
  },

  sectionTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 10,
  },

  logCard: {
    backgroundColor: '#121826',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 12,
  },
  logTitle: {
    color: '#fff',
    fontWeight: '700',
    marginBottom: 6,
  },
  logText: {
    color: '#D1D5DB',
    fontSize: 14,
  },
  highlight: {
    color: '#F4B400',
    fontWeight: '600',
  },
  timeText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 6,
  },
  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 30,
  },
});
