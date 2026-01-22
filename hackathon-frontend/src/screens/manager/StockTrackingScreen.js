import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function StockTrackingScreen() {
  const [inventory] = useState([
    { id: '1', item: 'Cement', inStock: '200 Bags', used: '50 Bags', wastage: '5 Bags' },
    { id: '2', item: 'Steel Rod', inStock: '500 Kg', used: '100 Kg', wastage: '10 Kg' },
  ]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.itemText}>{item.item}</Text>
      <Text style={styles.metaText}>In Stock: {item.inStock}</Text>
      <Text style={styles.metaText}>Used: {item.used}</Text>
      <Text style={styles.metaText}>Wastage: {item.wastage}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoBox}><Text style={styles.logo}>🏗</Text></View>
        <Text style={styles.heading}>Stock Tracking</Text>
      </View>

      <FlatList
        data={inventory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No inventory data</Text>}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F14', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  logoBox: { backgroundColor: '#F4B400', padding: 14, borderRadius: 16, marginRight: 12 },
  logo: { fontSize: 24 },
  heading: { color: '#fff', fontSize: 22, fontWeight: '700' },
  card: { backgroundColor: '#121826', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#1F2937', marginBottom: 12 },
  itemText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  metaText: { color: '#9CA3AF', fontSize: 13, marginTop: 4 },
  emptyText: { color: '#9CA3AF', textAlign: 'center', marginTop: 30 },
});
