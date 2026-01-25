import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { supabase, BUCKETS } from '../../lib/supabase';

export default function GSTInvoices({ route }) {
  const { project } = route.params || {};
  const projectId = project?.id;

  const [supplierName, setSupplierName] = useState('');
  const [materialName, setMaterialName] = useState('');
  const [units, setUnits] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [cgst, setCgst] = useState('9'); // Default %
  const [sgst, setSgst] = useState('9'); // Default %
  const [igst, setIgst] = useState('0');
  const [loading, setLoading] = useState(false);

  // Random Data Generators
  const gstin = `27${Math.random().toString(36).substring(2, 12).toUpperCase()}1Z5`;
  const invoiceNo = `INV-${Date.now().toString().slice(-6)}`;

  const calculateTotal = () => {
    const base = parseFloat(basePrice || 0);
    const tax = base * (parseFloat(cgst || 0) + parseFloat(sgst || 0) + parseFloat(igst || 0)) / 100;
    return (base + tax).toFixed(2);
  };

  const generatePDF = async () => {
    if (!supplierName || !materialName || !units || !basePrice) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const totalAmount = calculateTotal();
      const taxHtml = `
        <div style="margin-top: 20px; border-top: 2px solid #000; padding-top: 10px;">
          <p>Base Amount: ₹${basePrice}</p>
          <p>CGST (${cgst}%): ₹${(basePrice * cgst / 100).toFixed(2)}</p>
          <p>SGST (${sgst}%): ₹${(basePrice * sgst / 100).toFixed(2)}</p>
          <p>IGST (${igst}%): ₹${(basePrice * igst / 100).toFixed(2)}</p>
          <h2 style="color: #F4B400;">Total Amount: ₹${totalAmount}</h2>
        </div>
      `;

      const html = `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 40px; color: #333;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h1 style="color: #F4B400; margin: 0;">TAX INVOICE</h1>
              <p style="margin: 5px 0;">Generated via Quasar ConstructPro</p>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
              <div>
                <strong>Supplier:</strong><br/>
                ${supplierName}<br/>
                GSTIN: ${gstin}
              </div>
              <div style="text-align: right;">
                <strong>Invoice Details:</strong><br/>
                No: ${invoiceNo}<br/>
                Date: ${new Date().toLocaleDateString()}<br/>
                Project: ${project?.name || 'N/A'}
              </div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #f8f9fa; border-bottom: 2px solid #dee2e6;">
                  <th style="padding: 12px; text-align: left;">Description</th>
                  <th style="padding: 12px; text-align: right;">Quantity</th>
                  <th style="padding: 12px; text-align: right;">Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #dee2e6;">
                  <td style="padding: 12px;">${materialName}</td>
                  <td style="padding: 12px; text-align: right;">${units} Units</td>
                  <td style="padding: 12px; text-align: right;">₹${basePrice}</td>
                </tr>
              </tbody>
            </table>

            ${taxHtml}

            <div style="margin-top: 50px; font-size: 12px; color: #666;">
              <p>Certified that the particulars given above are true and correct.</p>
              <br/><br/>
              <p>__________________________</p>
              <p>Authorized Signatory</p>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      console.log('PDF generated at:', uri);

      await uploadToSupabase(uri, invoiceNo);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      }

    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadToSupabase = async (uri, name) => {
    try {
      // Robust Blob conversion for React Native (fixes "Network request failed")
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log('XHR Error:', e);
          reject(new TypeError("Local file fetch failed for upload"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
      });

      const fileName = `${projectId}/${name}.pdf`;

      const { error } = await supabase.storage
        .from(BUCKETS.RA_BILL)
        .upload(fileName, blob, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (error) throw error;
      Alert.alert('Success', 'Invoice generated and saved to RA_BILL bucket!');
    } catch (err) {
      console.error('Upload failed:', err);
      Alert.alert('Upload Error', err.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoBox}><Text style={styles.logo}>🧾</Text></View>
        <View>
          <Text style={styles.heading}>GST Bill Generation</Text>
          <Text style={styles.subHeading}>{project?.name || 'Project Site'}</Text>
        </View>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.label}>Supplier Name</Text>
        <TextInput style={styles.input} value={supplierName} onChangeText={setSupplierName} placeholder="e.g. UltraTech Cement" placeholderTextColor="#6B7280" />

        <Text style={styles.label}>Material Name</Text>
        <TextInput style={styles.input} value={materialName} onChangeText={setMaterialName} placeholder="e.g. TMT Steel Bars" placeholderTextColor="#6B7280" />

        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.label}>Units Supplied</Text>
            <TextInput style={styles.input} value={units} onChangeText={setUnits} keyboardType="numeric" placeholder="Qty" placeholderTextColor="#6B7280" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Base Price (₹)</Text>
            <TextInput style={styles.input} value={basePrice} onChangeText={setBasePrice} keyboardType="numeric" placeholder="Price" placeholderTextColor="#6B7280" />
          </View>
        </View>

        <Text style={styles.label}>Taxation (%)</Text>
        <View style={styles.row}>
          <View style={styles.taxColumn}>
            <Text style={styles.taxLabel}>CGST</Text>
            <TextInput style={styles.smallInput} value={cgst} onChangeText={setCgst} keyboardType="numeric" />
          </View>
          <View style={styles.taxColumn}>
            <Text style={styles.taxLabel}>SGST</Text>
            <TextInput style={styles.smallInput} value={sgst} onChangeText={setSgst} keyboardType="numeric" />
          </View>
          <View style={styles.taxColumn}>
            <Text style={styles.taxLabel}>IGST</Text>
            <TextInput style={styles.smallInput} value={igst} onChangeText={setIgst} keyboardType="numeric" />
          </View>
        </View>

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Grand Total (Incl. GST)</Text>
          <Text style={styles.totalValue}>₹ {calculateTotal()}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={generatePDF} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#0B0F14" />
          ) : (
            <Text style={styles.buttonText}>Generate & Upload Invoice</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>💡 Invoice will be auto-generated with GSTIN: {gstin}</Text>
        <Text style={styles.infoText}>📂 Files are archived in RA_BILL storage bucket.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F14', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  logoBox: { backgroundColor: '#F4B400', padding: 14, borderRadius: 16, marginRight: 12 },
  logo: { fontSize: 24 },
  heading: { color: '#fff', fontSize: 22, fontWeight: '700' },
  subHeading: { color: '#9CA3AF', fontSize: 13 },
  formCard: { backgroundColor: '#121826', padding: 20, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: '#1F2937' },
  label: { color: '#D1D5DB', fontSize: 13, marginBottom: 8, fontWeight: '600' },
  input: { backgroundColor: '#0B0F14', borderRadius: 12, padding: 14, color: '#fff', borderWidth: 1, borderColor: '#1F2937', marginBottom: 16 },
  row: { flexDirection: 'row', marginBottom: 16 },
  taxColumn: { flex: 1, alignItems: 'center', marginRight: 5 },
  taxLabel: { color: '#9CA3AF', fontSize: 11, marginBottom: 4 },
  smallInput: { backgroundColor: '#0B0F14', borderRadius: 8, width: '100%', padding: 10, color: '#fff', textAlign: 'center', borderWidth: 1, borderColor: '#1F2937' },
  totalBox: { backgroundColor: 'rgba(244, 180, 0, 0.1)', padding: 16, borderRadius: 12, marginBottom: 20, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(244, 180, 0, 0.2)' },
  totalLabel: { color: '#F4B400', fontSize: 12, fontWeight: '700', marginBottom: 4 },
  totalValue: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  button: { backgroundColor: '#F4B400', padding: 18, borderRadius: 14, alignItems: 'center' },
  buttonText: { color: '#0B0F14', fontWeight: '800', fontSize: 16 },
  infoCard: { backgroundColor: '#121826', padding: 16, borderRadius: 12, marginBottom: 40, borderStyle: 'dashed', borderWidth: 1, borderColor: '#374151' },
  infoText: { color: '#9CA3AF', fontSize: 12, marginBottom: 4 },
});
