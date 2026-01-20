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
    { id: '1', name: 'Cement', quantity: '50 Bags' },
    { id: '2', name: 'Bricks', quantity: '500' },
    { id: '3', name: 'Steel Rods', quantity: '100 Kg' },
  ]);

  const [newMaterial, setNewMaterial] = useState('');
  const [newQuantity, setNewQuantity] = useState('');

  const handleAddMaterial = () => {
    if (!newMaterial.trim() || !newQuantity.trim()) {
      alert('Please fill both fields!');
      return;
    }
    const newItem = {
      id: (materials.length + 1).toString(),
      name: newMaterial,
      quantity: newQuantity,
    };
    setMaterials([newItem, ...materials]);
    setNewMaterial('');
    setNewQuantity('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>{item.name}</Text>
      <Text style={styles.cardQuantity}>{item.quantity}</Text>
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
        placeholder="e.g. 50 Bags"
        placeholderTextColor="#9CA3AF"
        value={newQuantity}
        onChangeText={setNewQuantity}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddMaterial}>
        <Text style={styles.buttonText}>Add Material</Text>
      </TouchableOpacity>

      <Text style={styles.listHeading}>Requested Materials</Text>
    </View>
  );

  return (
    <FlatList
      style={{ backgroundColor: '#0B0F14' }} // ensures background is black
      data={materials}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={ListHeader}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
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
  logoEmoji: {
    fontSize: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  label: {
    color: '#9CA3AF',
    marginBottom: 6,
    marginTop: 12,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#121826',
    color: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#F4B400',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
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
    marginTop: 20,
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
    fontSize: 14,
  },
});
