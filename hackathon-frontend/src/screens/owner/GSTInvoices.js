import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function GSTInvoices() {
  const raBill = 'RA_Bill_1.pdf';
  const gstInvoice = 'GST_Invoice_1.pdf';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoBox}><Text style={styles.logo}>🏗</Text></View>
        <Text style={styles.heading}>GST / RA Bills</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>RA Bill</Text>
        <Text style={styles.cardText}>{raBill}</Text>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>View</Text></TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>GST Invoice</Text>
        <Text style={styles.cardText}>{gstInvoice}</Text>
        <TouchableOpacity style={styles.button}><Text style={styles.buttonText}>View</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F14', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  logoBox: { backgroundColor: '#F4B400', padding: 14, borderRadius: 16, marginRight: 12 },
  logo: { fontSize: 24 },
  heading: { color: '#fff', fontSize: 22, fontWeight: '700' },
  card: {
    backgroundColor: '#121826',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  cardTitle: { color: '#F4B400', fontWeight: '700', marginBottom: 6 },
  cardText: { color: '#fff', marginBottom: 10 },
  button: { backgroundColor: '#F4B400', padding: 12, borderRadius: 14, alignItems: 'center' },
  buttonText: { color: '#0B0F14', fontWeight: '700' },
});
