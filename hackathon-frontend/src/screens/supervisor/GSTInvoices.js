import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function GSTInvoices() {
  const [raAmount, setRaAmount] = useState('');
  const [gstAmount, setGstAmount] = useState(0);
  const [fileName, setFileName] = useState('');

  const calculateGST = (amount) => {
    const gst = parseFloat(amount || 0) * 0.18;
    setGstAmount(isNaN(gst) ? 0 : gst.toFixed(2));
  };

  const handleUpload = () => {
    // Just UI placeholder for upload
    setFileName('RA_Bill_1.pdf');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoBox}><Text style={styles.logo}>🏗</Text></View>
        <Text style={styles.heading}>GST / RA Bill</Text>
      </View>

      <Text style={styles.label}>RA Amount</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter RA Amount"
        placeholderTextColor="#9CA3AF"
        value={raAmount}
        onChangeText={(text) => {
          setRaAmount(text);
          calculateGST(text);
        }}
      />

      <View style={styles.gstBox}>
        <Text style={styles.gstText}>GST (18%): ₹ {gstAmount}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpload}>
        <Text style={styles.buttonText}>Upload RA Bill</Text>
      </TouchableOpacity>

      {fileName ? <Text style={styles.fileText}>Uploaded: {fileName}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F14', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  logoBox: { backgroundColor: '#F4B400', padding: 14, borderRadius: 16, marginRight: 12 },
  logo: { fontSize: 24 },
  heading: { color: '#fff', fontSize: 22, fontWeight: '700' },
  label: { color: '#9CA3AF', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#121826',
    color: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    marginBottom: 16,
  },
  gstBox: { marginVertical: 10 },
  gstText: { color: '#F4B400', fontSize: 16, fontWeight: '700' },
  button: {
    backgroundColor: '#F4B400',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 12,
  },
  buttonText: { color: '#0B0F14', fontWeight: '700', fontSize: 16 },
  fileText: { color: '#9CA3AF', marginTop: 6 },
});
