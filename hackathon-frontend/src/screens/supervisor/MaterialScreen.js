import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

export default function MaterialScreen() {
  const [materials, setMaterials] = useState([
    { id: '1', name: 'Cement', quantity: '50', unit: 'Bags' },
    { id: '2', name: 'Bricks', quantity: '500', unit: 'Nos' },
    { id: '3', name: 'Steel Rods', quantity: '100', unit: 'Kg' },
  ]);

  const [newMaterial, setNewMaterial] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newUnit, setNewUnit] = useState('');

  const handleAddMaterial = () => {
    if (!newMaterial || !newQuantity || !newUnit) {
      alert('Please fill all fields!');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: newMaterial,
      quantity: newQuantity,
      unit: newUnit,
    };

    setMaterials([newItem, ...materials]);
    setNewMaterial('');
    setNewQuantity('');
    setNewUnit('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>{item.name}</Text>
      <Text style={styles.cardQuantity}>
        {item.quantity} {item.unit}
      </Text>
    </View>
  );

  const ListHeader = () => (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🏗</Text>
        </View>
        <Text style={styles.heading}>Material Requests</Text>
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

  return (
    <FlatList
      style={{ backgroundColor: '#0B0F14' }}
      data={materials}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={ListHeader}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    />
  );
}

const styles = StyleSheet.create({
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
  cardQuantity: {
    color: '#9CA3AF',
    marginTop: 4,
  },
});
