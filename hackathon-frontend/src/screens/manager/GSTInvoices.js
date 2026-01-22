import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function GSTInvoices() {
  const [raAmount, setRaAmount] = useState('50000');
  const [gstAmount, setGstAmount] = useState((50000 * 0.18).toFixed(2));
  const [fileName, setFileName] = useState('RA_Bill_1.pdf');

  const handleRevert = () => setRaAmount('');
  const handleGenerateInvoice = () => alert('GST Invoice generated (UI only)');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoBox}><Text style={styles.logo}>🏗</Text></View>
        <Text style={styles.heading}>GST / RA Bill Approval</Text>
      </View>

      <Text style={styles.label}>RA Amount</Text>
      <TextInput
        style={styles.input}
        value={raAmount}
        keyboardType="numeric"
        onChangeText={(text) => {
          setRaAmount(text);
          setGstAmount((parseFloat(text || 0) * 0.18).toFixed(2));
        }}
      />

      <View style={styles.gstBox}>
        <Text style={styles.gstText}>GST (18%): ₹ {gstAmount}</Text>
      </View>

      <Text style={styles.fileText}>Uploaded RA Bill: {fileName}</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
        <TouchableOpacity style={styles.button} onPress={handleRevert}>
          <Text style={styles.buttonText}>Revert</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleGenerateInvoice}>
          <Text style={styles.buttonText}>Generate GST Invoice</Text>
        </TouchableOpacity>
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
  label: { color: '#9CA3AF', marginBottom: 6 },
  input: {
    backgroundColor: '#121826',
    color: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  gstBox: { marginVertical: 10 },
  gstText: { color: '#F4B400', fontSize: 16, fontWeight: '700' },
  fileText: { color: '#9CA3AF', marginTop: 6 },
  button: {
    backgroundColor: '#F4B400',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    width: '48%',
  },
  buttonText: { color: '#0B0F14', fontWeight: '700', fontSize: 16 },
});
