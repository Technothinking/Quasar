import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    TextInput,
    Switch,
    ScrollView,
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function StockVerificationScreen({ route }) {
    const { project } = route.params || {};
    const projectId = project?.id;

    const [requests, setRequests] = useState([]);
    const [selectedRequestId, setSelectedRequestId] = useState('');
    const [quantityReceived, setQuantityReceived] = useState('');

    // Qualitative Form State
    const [isOnTime, setIsOnTime] = useState(true);
    const [hasDefects, setHasDefects] = useState(false);
    const [isComplete, setIsComplete] = useState(true);

    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        if (projectId) {
            loadData();
        }
    }, [projectId]);

    const loadData = async () => {
        setFetching(true);
        try {
            // 1. Get current user auth
            const { data: { user: authUser } } = await supabase.auth.getUser();
            setUser(authUser);

            if (authUser) {
                // 2. Determine role from project_user_roles (Role ID 2 = Manager, 3 = Supervisor)
                const { data: roleData } = await supabase
                    .from('project_user_roles')
                    .select('role_id')
                    .eq('user_id', authUser.id)
                    .maybeSingle();

                if (roleData) {
                    if (roleData.role_id === 2) setUserRole('manager');
                    else if (roleData.role_id === 3) setUserRole('supervisor');
                    else setUserRole('other');
                } else {
                    setUserRole('other');
                }
            }

            await Promise.all([fetchRequests(), fetchVerifications()]);
        } catch (err) {
            console.error('Data load failed:', err);
        } finally {
            setFetching(false);
        }
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
            if (data && data.length > 0 && !selectedRequestId) {
                const firstReq = data[0];
                handleSelectRequest(firstReq.id.toString());
            }
        } catch (err) {
            console.error('Fetch requests failed:', err);
        }
    };

    const fetchVerifications = async () => {
        try {
            const { data: vData, error: vError } = await supabase
                .from('stock_verification')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: false });

            if (vError) throw vError;
            if (!vData || vData.length === 0) {
                setVerifications([]);
                return;
            }

            const userIds = [...new Set(vData.map(v => v.submitted_by))];
            const { data: pData } = await supabase
                .from('profiles')
                .select('id, full_name')
                .in('id', userIds);

            const profileMap = (pData || []).reduce((acc, p) => {
                acc[p.id] = p.full_name;
                return acc;
            }, {});

            const merged = vData.map(v => ({
                ...v,
                profile_name: profileMap[v.submitted_by] || 'Site Supervisor'
            }));

            setVerifications(merged);
        } catch (err) {
            console.error('Fetch verifications failed:', err);
        }
    };

    const handleSelectRequest = (id) => {
        setSelectedRequestId(id);
        const req = requests.find(r => r.id.toString() === id);
        if (req && isComplete) {
            setQuantityReceived(req.quantity_requested.toString());
        }
    };

    const handleToggleComplete = (val) => {
        setIsComplete(val);
        if (val) {
            const req = requests.find(r => r.id.toString() === selectedRequestId);
            if (req) setQuantityReceived(req.quantity_requested.toString());
        } else {
            setQuantityReceived('');
        }
    };

    const handleVerify = async () => {
        if (!selectedRequestId) {
            Alert.alert('Error', 'Please select a material from the list below');
            return;
        }

        const finalQty = parseFloat(quantityReceived);
        if (isNaN(finalQty) || finalQty < 0) {
            Alert.alert('Error', 'Please enter a valid quantity received');
            return;
        }

        const selectedRequest = requests.find(r => r.id.toString() === selectedRequestId);
        if (!selectedRequest) return;

        setLoading(true);
        try {
            const timing = isOnTime ? 'On Time' : 'Late';
            const condition = hasDefects ? 'Defective' : 'Proper';
            const completeness = isComplete ? 'Complete' : 'Partial';
            const summary = `Verified: ${timing} | ${condition} | ${completeness}`;

            const { error: insError } = await supabase
                .from('stock_verification')
                .insert([{
                    project_id: projectId,
                    material_request_id: selectedRequest.id,
                    material_name: selectedRequest.material_name,
                    unit: selectedRequest.unit || 'unit',
                    quantity_ordered: selectedRequest.quantity_requested,
                    quantity_received: finalQty,
                    status: summary,
                    submitted_by: user.id
                }]);

            if (insError) throw insError;

            const { error: updError } = await supabase
                .from('material_requests')
                .update({ status: 'verified' })
                .eq('id', selectedRequest.id);

            if (updError) console.error('Request status update failed', updError);

            Alert.alert('Success', 'Stock Verification Submitted!');
            setSelectedRequestId('');
            resetForm();
            await Promise.all([fetchRequests(), fetchVerifications()]);
        } catch (err) {
            Alert.alert('Error', err.message);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setIsOnTime(true);
        setHasDefects(false);
        setIsComplete(true);
        setQuantityReceived('');
    };

    const renderVerification = ({ item }) => {
        const isDiscrepancy = item.quantity_received < item.quantity_ordered;

        return (
            <View style={styles.vCard}>
                <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.materialTitle}>{item.material_name}</Text>
                        <Text style={styles.verifiedByText}>Verified by: {item.profile_name}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: item.status.includes('Late') || item.status.includes('Defective') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)' }]}>
                        <Text style={[styles.statusText, { color: item.status.includes('Late') || item.status.includes('Defective') ? '#EF4444' : '#22C55E' }]}>VERIFIED</Text>
                    </View>
                </View>

                <Text style={styles.statusString}>{item.status}</Text>

                <View style={styles.tableRow}>
                    <View style={styles.tableCol}>
                        <Text style={styles.colLabel}>Ordered</Text>
                        <Text style={styles.colValue}>{item.quantity_ordered} {item.unit}</Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.colLabel}>Received</Text>
                        <Text style={[styles.colValue, isDiscrepancy && { color: '#EF4444' }]}>{item.quantity_received} {item.unit}</Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.colLabel}>Disc.</Text>
                        <Text style={[styles.colValue, isDiscrepancy && { color: '#EF4444' }]}>
                            {(item.quantity_received - item.quantity_ordered).toFixed(1)}
                        </Text>
                    </View>
                </View>

                <View style={styles.footerRow}>
                    <Text style={styles.timeText}>{new Date(item.created_at).toLocaleString()}</Text>
                    <Text style={styles.idText}>#REQ-{item.material_request_id}</Text>
                </View>
            </View>
        );
    };

    const ListHeader = () => {
        const selectedRequest = requests.find(r => r.id.toString() === selectedRequestId);

        return (
            <View>
                <View style={styles.pageHeader}>
                    <View style={styles.logoBox}><Text style={styles.logo}>🛡</Text></View>
                    <View>
                        <Text style={styles.heading}>Stock Verification</Text>
                        <Text style={styles.subHeading}>{project?.name || 'Project Portal'}</Text>
                    </View>
                </View>

                {userRole === 'supervisor' && (
                    <View>
                        <Text style={styles.sectionTitle}>1. Approved Material (Awaiting Delivery)</Text>
                        <View style={styles.approvedList}>
                            {requests.length > 0 ? (
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
                                    {requests.map(req => (
                                        <TouchableOpacity
                                            key={req.id}
                                            style={[styles.miniCard, selectedRequestId === req.id.toString() && styles.selectedMiniCard]}
                                            onPress={() => handleSelectRequest(req.id.toString())}
                                        >
                                            <Text style={[styles.miniTitle, selectedRequestId === req.id.toString() && { color: '#0B0F14' }]}>{req.material_name}</Text>
                                            <Text style={[styles.miniQty, selectedRequestId === req.id.toString() && { color: '#0B0F14' }]}>{req.quantity_requested} {req.unit}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            ) : (
                                <View style={styles.allDoneCard}>
                                    <Text style={styles.allDoneText}>✅ No approved materials pending delivery.</Text>
                                </View>
                            )}
                        </View>

                        {selectedRequest && (
                            <View style={styles.formCard}>
                                <Text style={styles.formTitle}>2. Verification Form: {selectedRequest.material_name}</Text>

                                <View style={styles.switchRow}>
                                    <View>
                                        <Text style={styles.switchLabel}>Delivered on time?</Text>
                                        <Text style={styles.switchSubLabel}>Compare vs estimated schedule</Text>
                                    </View>
                                    <Switch value={isOnTime} onValueChange={setIsOnTime} trackColor={{ false: '#374151', true: '#22C55E' }} thumbColor="#fff" />
                                </View>

                                <View style={styles.switchRow}>
                                    <View>
                                        <Text style={styles.switchLabel}>Are there any defects?</Text>
                                        <Text style={styles.switchSubLabel}>Physical condition check</Text>
                                    </View>
                                    <Switch value={hasDefects} onValueChange={setHasDefects} trackColor={{ false: '#374151', true: '#EF4444' }} thumbColor="#fff" />
                                </View>

                                <View style={styles.switchRow}>
                                    <View>
                                        <Text style={styles.switchLabel}>All material ordered was delivered?</Text>
                                        <Text style={styles.switchSubLabel}>Shortage verification</Text>
                                    </View>
                                    <Switch value={isComplete} onValueChange={handleToggleComplete} trackColor={{ false: '#374151', true: '#22C55E' }} thumbColor="#fff" />
                                </View>

                                {!isComplete && (
                                    <View style={styles.quantityEditRow}>
                                        <Text style={styles.inputLabel}>Actual Quantity Received ({selectedRequest.unit})</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={quantityReceived}
                                            onChangeText={setQuantityReceived}
                                            keyboardType="numeric"
                                            placeholder="Enter actual units"
                                            placeholderTextColor="#6B7280"
                                        />
                                    </View>
                                )}

                                <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
                                    {loading ? <ActivityIndicator color="#0B0F14" /> : <Text style={styles.buttonText}>Confirm Delivery & Log Stock</Text>}
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}

                {userRole === 'manager' && (
                    <View style={styles.managerInfoCard}>
                        <Text style={styles.managerInfoText}>🛡 Manager Audit Mode - Tracking Forensic Site Logs</Text>
                    </View>
                )}

                <Text style={styles.sectionTitle}>Fulfillment Ledger (History)</Text>
            </View>
        );
    };

    if (fetching) return <View style={[styles.container, { justifyContent: 'center' }]}><ActivityIndicator size="large" color="#F4B400" /></View>;

    return (
        <View style={styles.container}>
            <FlatList
                data={verifications}
                keyExtractor={(item) => item.id?.toString()}
                renderItem={renderVerification}
                ListHeaderComponent={ListHeader}
                contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                ListEmptyComponent={<Text style={styles.emptyText}>No verified deliveries registered yet.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0B0F14' },
    pageHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    logoBox: { backgroundColor: '#F4B400', padding: 14, borderRadius: 16, marginRight: 12 },
    logo: { fontSize: 24 },
    heading: { color: '#fff', fontSize: 22, fontWeight: '700' },
    subHeading: { color: '#9CA3AF', fontSize: 13 },
    sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 12, marginTop: 10 },

    /* Mini Cards for Approved Items */
    approvedList: { marginBottom: 20 },
    miniCard: { backgroundColor: '#121826', padding: 16, borderRadius: 14, marginRight: 12, borderWidth: 1, borderColor: '#1F2937', minWidth: 140 },
    selectedMiniCard: { backgroundColor: '#F4B400', borderColor: '#F4B400' },
    miniTitle: { color: '#fff', fontWeight: '700', fontSize: 14 },
    miniQty: { color: '#9CA3AF', fontSize: 11, marginTop: 2 },

    /* Form */
    formCard: { backgroundColor: '#121826', padding: 20, borderRadius: 20, marginBottom: 30, borderWidth: 1, borderColor: '#1F2937' },
    formTitle: { color: '#F4B400', fontSize: 15, fontWeight: '700', marginBottom: 18 },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
    switchLabel: { color: '#E5E7EB', fontSize: 14, fontWeight: '600' },
    switchSubLabel: { color: '#9CA3AF', fontSize: 11, marginTop: 2 },
    quantityEditRow: { marginTop: 4, marginBottom: 24 },
    inputLabel: { color: '#F4B400', fontSize: 12, fontWeight: '700', marginBottom: 8 },
    input: { backgroundColor: '#0B0F14', borderRadius: 12, padding: 14, color: '#fff', borderWidth: 1, borderColor: '#F4B400' },
    button: { backgroundColor: '#F4B400', padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#0B0F14', fontWeight: '800', fontSize: 16 },

    /* Ledger Cards */
    vCard: { backgroundColor: '#121826', padding: 16, borderRadius: 18, marginBottom: 14, borderWidth: 1, borderColor: '#1F2937' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    materialTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
    verifiedByText: { color: '#6B7280', fontSize: 11, marginTop: 4 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 9, fontWeight: '800' },
    statusString: { color: '#F4B400', fontSize: 12, fontWeight: '600', marginBottom: 12 },
    tableRow: { flexDirection: 'row', gap: 10, marginBottom: 12, backgroundColor: '#0B0F14', borderRadius: 10, padding: 12 },
    tableCol: { flex: 1 },
    colLabel: { color: '#4B5563', fontSize: 9, textTransform: 'uppercase', marginBottom: 4 },
    colValue: { color: '#fff', fontSize: 13, fontWeight: '700' },
    footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    timeText: { color: '#4B5563', fontSize: 11 },
    idText: { color: '#4B5563', fontSize: 10, fontWeight: '700' },

    /* Empty/Manager States */
    allDoneCard: { backgroundColor: '#121826', padding: 20, borderRadius: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: '#22C55E' },
    allDoneText: { color: '#22C55E', textAlign: 'center', fontWeight: '600' },
    managerInfoCard: { backgroundColor: '#121826', padding: 16, borderRadius: 12, marginBottom: 24, borderLeftWidth: 4, borderLeftColor: '#F4B400' },
    managerInfoText: { color: '#fff', fontSize: 13, fontWeight: '600' },
    emptyText: { color: '#4B5563', textAlign: 'center', marginTop: 40 },
});
