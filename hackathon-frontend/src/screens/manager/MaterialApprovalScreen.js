import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';

const initialRequests = [
  {
    id: '1',
    material: 'Cement',
    quantity: '50 Bags',
    requestedBy: 'Supervisor – Block A',
    status: 'pending',
  },
  {
    id: '2',
    material: 'Steel Rods',
    quantity: '100 Kg',
    requestedBy: 'Supervisor – Block B',
    status: 'pending',
  },
  {
    id: '3',
    material: 'Bricks',
    quantity: '500',
    requestedBy: 'Supervisor – Block C',
    status: 'pending',
  },
];

export default function MaterialApprovalScreen() {
  const [requests, setRequests] = useState(initialRequests);

  const updateStatus = (id, newStatus) => {
    const updated = requests.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setRequests(updated);

    console.log({
      requestId: id,
      status: newStatus,
      synced: false, // offline-first
    });

    Alert.alert(
      'Saved Offline',
      `Material request ${newStatus.toUpperCase()}. Will sync when online.`
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.material}>{item.material}</Text>
        <Text
          style={[
            styles.status,
            item.status === 'approved'
              ? styles.approved
              : item.status === 'rejected'
              ? styles.rejected
              : styles.pending,
          ]}
        >
          {item.status.toUpperCase()}
        </Text>
      </View>

      <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
      <Text style={styles.requestedBy}>{item.requestedBy}</Text>

      {item.status === 'pending' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveBtn]}
            onPress={() => updateStatus(item.id, 'approved')}
          >
            <Text style={styles.actionText}>APPROVE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.rejectBtn]}
            onPress={() => updateStatus(item.id, 'rejected')}
          >
            <Text style={styles.actionText}>REJECT</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Material Approvals</Text>
          <Text style={styles.subHeading}>
            Review supervisor material requests
          </Text>
        </View>

        <View style={styles.logoBox}>
          <Text style={styles.logo}>🏗</Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      />

      {/* Offline Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          🔄 Works offline — approvals sync automatically
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  heading: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  subHeading: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 4,
  },
  logoBox: {
    backgroundColor: '#F4B400',
    padding: 14,
    borderRadius: 16,
  },
  logo: {
    fontSize: 22,
  },

  /* Card */
  card: {
    backgroundColor: '#121826',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  material: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  status: {
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    color: '#0B0F14',
  },
  pending: {
    backgroundColor: '#F4B400',
  },
  approved: {
    backgroundColor: '#22C55E',
  },
  rejected: {
    backgroundColor: '#EF4444',
  },

  quantity: {
    color: '#E5E7EB',
    marginTop: 8,
    fontSize: 14,
  },
  requestedBy: {
    color: '#9CA3AF',
    marginTop: 4,
    fontSize: 13,
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  approveBtn: {
    backgroundColor: '#22C55E',
    marginRight: 10,
  },
  rejectBtn: {
    backgroundColor: '#EF4444',
  },
  actionText: {
    color: '#0B0F14',
    fontWeight: '800',
    fontSize: 14,
  },

  infoBox: {
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
});
