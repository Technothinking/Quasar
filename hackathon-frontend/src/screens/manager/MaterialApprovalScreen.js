import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function MaterialApprovalScreen({ route }) {
  const { projectId, projectName } = route.params || {};
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // Track which item is being updated

  useEffect(() => {
    fetchRequests();
  }, [projectId]);

  const fetchRequests = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('material_requests')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch requests: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      setActionLoading(id);
      const { error } = await supabase
        .from('material_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setRequests(prev => prev.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      ));

      Alert.alert('Success', `Request ${newStatus} successfully.`);
    } catch (err) {
      Alert.alert('Update Failed', err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.material}>{item.material_name}</Text>
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

      <Text style={styles.quantity}>Quantity: {item.quantity_requested} {item.unit}</Text>
      <Text style={styles.requestedBy}>Requested By: {item.submitted}</Text>

      {item.status === 'pending' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveBtn]}
            onPress={() => updateStatus(item.id, 'approved')}
            disabled={actionLoading === item.id}
          >
            <Text style={styles.actionText}>{actionLoading === item.id ? '...' : 'APPROVE'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.rejectBtn]}
            onPress={() => updateStatus(item.id, 'rejected')}
            disabled={actionLoading === item.id}
          >
            <Text style={styles.actionText}>{actionLoading === item.id ? '...' : 'REJECT'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#F4B400" />
        <Text style={{ color: 'white', marginTop: 10 }}>Loading Requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Material Approvals</Text>
          <Text style={styles.subHeading}>
            Project: {projectName || '...'}
          </Text>
        </View>

        <View style={styles.logoBox}>
          <Text style={styles.logo}>🏗</Text>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
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
