import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Switch,
    TextInput,
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { Picker } from '@react-native-picker/picker';

const TIMING_OPTIONS = [
    { label: 'Early', value: 'early', color: '#34D399' },
    { label: 'On-Time', value: 'on_time', color: '#F4B400' },
    { label: 'Late', value: 'late', color: '#F87171' },
];

export default function StockVerificationScreen({ route }) {
    const { project } = route.params || {};
    const projectId = project?.id;

    const [requests, setRequests] = useState([]);
    const [selectedRequestId, setSelectedRequestId] = useState('');
    const [quantityReceived, setQuantityReceived] = useState('');
    const [deliveryTiming, setDeliveryTiming] = useState('on_time');
    const [isProper, setIsProper] = useState(true);
    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        if (projectId) {
            loadData();
            fetchUserRole();
        }
    }, [projectId]);

    const fetchUserRole = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;
            const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
            if (data) setUserRole(data.role);
        } catch (err) {
            console.error('Role fetch failed:', err);
        }
    };

    const loadData = async () => {
        setFetching(true);
        await Promise.all([fetchRequests(), fetchVerifications()]);
        setFetching(false);
    };

    const fetchRequests = async () => {
        try {
            const { data, error } = await supabase
                .from('material_requests')
                .select('*')
                .eq('project_id', projectId)
                .eq('status', 'approved')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data || []);
            if (data && data.length > 0) setSelectedRequestId(data[0].id.toString());
        } catch (err) {
            console.error('Fetch requests failed:', err);
        }
    };

    const fetchVerifications = async () => {
        try {
            const { data, error } = await supabase
                .from('stock_verification')
                .select('*')
                .eq('project_id', projectId)
                .order('id', { ascending: false });

            if (error) throw error;
            setVerifications(data || []);
        } catch (err) {
            console.error('Fetch verifications failed:', err);
        }
    };

    const handleVerify = async () => {
        if (!selectedRequestId) {
            Alert.alert('Error', 'Please select a material request');
            return;
        }
        if (!quantityReceived.trim()) {
            Alert.alert('Error', 'Please enter quantity received');
            return;
        }

        const selectedRequest = requests.find(r => r.id.toString() === selectedRequestId);
        if (!selectedRequest) return;

        setLoading(true);
        try {
            // Build the formatted summary for the 'status' column
            const verificationSummary = `Condition: ${isProper ? 'PROPER' : 'DAMAGED'} | Timing: ${deliveryTiming.toUpperCase()} | Ordered: ${selectedRequest.quantity_requested} ${selectedRequest.unit} | Received: ${quantityReceived} ${selectedRequest.unit}`;

            const { error } = await supabase
                .from('stock_verification')
                .insert([{
                    project_id: projectId,
                    material_name: selectedRequest.material_name,
                    status: verificationSummary
                }]);

            if (error) throw error;

            Alert.alert('Success', 'Verification registered!');
            setQuantityReceived('');
            fetchVerifications();
        } catch (err) {
            Alert.alert('Error', err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => {
        const parts = item.status?.split(' | ') || [];
        const condition = parts.find(p => p.startsWith('Condition:')) || 'Condition: N/A';
        const timing = parts.find(p => p.startsWith('Timing:')) || 'Timing: N/A';
        const stats = parts.filter(p => !p.startsWith('Condition:') && !p.startsWith('Timing:')).join(' | ');

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Text style={styles.materialTitle}>{item.material_name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: condition.includes('PROPER') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)' }]}>
                        <Text style={[styles.statusText, { color: condition.includes('PROPER') ? '#22C55E' : '#EF4444' }]}>
                            {condition.split(': ')[1]}
                        </Text>
                    </View>
                </View>
                <Text style={[styles.detailText, { fontWeight: '700', color: '#fff', marginBottom: 4 }]}>{timing}</Text>
                <Text style={styles.detailText}>{stats || 'Verification proof logged'}</Text>
                <Text style={styles.timeText}>{new Date(item.created_at).toLocaleString()}</Text>
            </View>
        );
    };

    const ListHeader = () => {
        const selectedRequest = requests.find(r => r.id.toString() === selectedRequestId);
        return (
            <View>
                <View style={styles.header}>
                    <View style={styles.logoBox}><Text style={styles.logo}>🔍</Text></View>
                    <View>
                        <Text style={styles.heading}>Stock Verification</Text>
                        <Text style={styles.subHeading}>{project?.name || 'Site Verification'}</Text>
                    </View>
                </View>

                {userRole === 'supervisor' && (
                    requests.length > 0 ? (
                        <View style={styles.formCard}>
                            <Text style={styles.label}>1. Select Approved Material</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={selectedRequestId}
                                    onValueChange={(v) => setSelectedRequestId(v)}
                                    style={{ color: '#fff' }}
                                    dropdownIconColor="#F4B400"
                                >
                                    {requests.map(req => (
                                        <Picker.Item key={req.id} label={`${req.material_name} (${req.quantity_requested} ${req.unit})`} value={req.id.toString()} />
                                    ))}
                                </Picker>
                            </View>

                            <View style={styles.row}>
                                <View style={{ flex: 1, marginRight: 10 }}>
                                    <Text style={styles.label}>Ordered Qty</Text>
                                    <View style={styles.staticField}><Text style={{ color: '#fff' }}>{selectedRequest?.quantity_requested} {selectedRequest?.unit}</Text></View>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>Received Qty *</Text>
                                    <TextInput style={styles.input} placeholder="Qty" placeholderTextColor="#9CA3AF" keyboardType="numeric" value={quantityReceived} onChangeText={setQuantityReceived} />
                                </View>
                            </View>

                            <Text style={styles.label}>2. Delivery Timing</Text>
                            <View style={styles.timingRow}>
                                {TIMING_OPTIONS.map(opt => (
                                    <TouchableOpacity key={opt.value} style={[styles.timingBtn, deliveryTiming === opt.value && { backgroundColor: opt.color }]} onPress={() => setDeliveryTiming(opt.value)}>
                                        <Text style={[styles.timingBtnText, deliveryTiming === opt.value && { color: '#0B0F14' }]}>{opt.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.switchRow}>
                                <Text style={styles.switchLabel}>Is Condition Proper/Correct?</Text>
                                <Switch value={isProper} onValueChange={setIsProper} trackColor={{ false: '#374151', true: '#22C55E' }} thumbColor="#FFFFFF" />
                            </View>

                            <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
                                {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Submit Verification</Text>}
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.infoCard}><Text style={styles.infoText}>⚠️ No approved requests found to verify.</Text></View>
                    )
                )}

                {userRole === 'manager' && (
                    <View style={[styles.infoCard, { borderColor: '#F4B400' }]}><Text style={[styles.infoText, { color: '#fff' }]}>📋 Manager Audit Mode - View Delivery Condition Logs.</Text></View>
                )}
                <Text style={styles.sectionTitle}>Verification History</Text>
            </View>
        );
    };

    if (fetching) return <View style={[styles.container, { justifyContent: 'center' }]}><ActivityIndicator size="large" color="#F4B400" /></View>;

    return (
        <View style={styles.container}>
            <FlatList
                data={verifications}
                keyExtractor={(item) => item.id?.toString()}
                renderItem={renderItem}
                ListHeaderComponent={ListHeader}
                contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                ListEmptyComponent={<Text style={styles.emptyText}>No logs registered.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0B0F14' },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    logoBox: { backgroundColor: '#F4B400', padding: 14, borderRadius: 16, marginRight: 12 },
    logo: { fontSize: 24 },
    heading: { color: '#fff', fontSize: 22, fontWeight: '700' },
    subHeading: { color: '#9CA3AF', fontSize: 13 },
    formCard: { backgroundColor: '#121826', padding: 20, borderRadius: 20, marginBottom: 24, borderWidth: 1, borderColor: '#1F2937' },
    label: { color: '#9CA3AF', fontSize: 12, marginBottom: 8 },
    pickerContainer: { backgroundColor: '#0B0F14', borderRadius: 12, borderWidth: 1, borderColor: '#1F2937', marginBottom: 20 },
    row: { flexDirection: 'row', marginBottom: 20 },
    staticField: { backgroundColor: '#0B0F14', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#1F2937', height: 48, justifyContent: 'center' },
    input: { backgroundColor: '#0B0F14', borderRadius: 12, padding: 12, color: '#fff', borderWidth: 1, borderColor: '#1F2937', height: 48 },
    timingRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    timingBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center', backgroundColor: '#0B0F14', borderWidth: 1, borderColor: '#1F2937' },
    timingBtnText: { color: '#9CA3AF', fontSize: 12, fontWeight: '700' },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    switchLabel: { color: '#D1D5DB', fontSize: 14 },
    button: { backgroundColor: '#F4B400', padding: 16, borderRadius: 14, alignItems: 'center' },
    buttonText: { color: '#0B0F14', fontWeight: '800', fontSize: 16 },
    infoCard: { backgroundColor: '#121826', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#374151', marginBottom: 20 },
    infoText: { color: '#9CA3AF', fontSize: 13, textAlign: 'center' },
    sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 12 },
    card: { backgroundColor: '#121826', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#1F2937' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    materialTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 10, fontWeight: '800' },
    detailText: { color: '#9CA3AF', fontSize: 13 },
    timeText: { color: '#4B5563', fontSize: 11, marginTop: 10 },
    emptyText: { color: '#4B5563', textAlign: 'center', marginTop: 40 },
});
