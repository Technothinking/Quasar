import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
    ScrollView,
    Modal,
    TextInput,
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function ToolLibraryScreen({ route }) {
    const { project } = route.params || {};
    const projectId = project?.id;

    const [tools, setTools] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTool, setSelectedTool] = useState(null);
    const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
    const [returnModalVisible, setReturnModalVisible] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [returnCondition, setReturnCondition] = useState('ok');
    const [returnRemarks, setReturnRemarks] = useState('');
    const [supervisorId, setSupervisorId] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, [projectId]);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            setSupervisorId(user?.id);

            await Promise.all([fetchTools(), fetchWorkers()]);
        } catch (err) {
            console.error('Initial fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTools = async () => {
        const { data, error } = await supabase
            .from('tools')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) console.error('Fetch tools error:', error);
        else setTools(data || []);
    };

    const fetchWorkers = async () => {
        if (!projectId) return;
        const { data: roles, error: rolesError } = await supabase
            .from('project_user_roles')
            .select('user_id')
            .eq('project_id', projectId)
            .eq('role_id', 4);

        if (rolesError) return;

        const userIds = roles.map(r => r.user_id);
        if (userIds.length === 0) return;

        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', userIds);

        if (profilesError) return;
        setWorkers(profiles || []);
    };

    const handleCheckout = async () => {
        if (!selectedWorker) {
            Alert.alert('Error', 'Please select a worker');
            return;
        }

        try {
            const { error: logError } = await supabase
                .from('tool_logs')
                .insert([{
                    tool_id: selectedTool.tool_id,
                    user_id: selectedWorker,
                    project_id: projectId,
                    checked_out_by: supervisorId
                }]);

            if (logError) throw logError;

            const { error: toolError } = await supabase
                .from('tools')
                .update({ status: 'Not available' })
                .eq('tool_id', selectedTool.tool_id);

            if (toolError) throw toolError;

            Alert.alert('Success', 'Tool checked out successfully');
            setCheckoutModalVisible(false);
            fetchTools();
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    const handleReturn = async () => {
        try {
            // 1. Find the latest active log for this tool
            const { data: latestLog, error: logFetchError } = await supabase
                .from('tool_logs')
                .select('*')
                .eq('tool_id', selectedTool.tool_id)
                .is('returned_at', null)
                .order('checked_out_at', { ascending: false })
                .limit(1)
                .single();

            if (logFetchError) throw new Error('No active checkout log found');

            // 2. Update the log
            const { error: logUpdateError } = await supabase
                .from('tool_logs')
                .update({
                    returned_at: new Date().toISOString(),
                    condition_on_return: returnCondition,
                    remarks: returnRemarks,
                    actioned_by: supervisorId
                })
                .eq('id', latestLog.id);

            if (logUpdateError) throw logUpdateError;

            // 3. Update tool status
            const newStatus = returnCondition === 'damaged' ? 'repairing' : 'available';
            const { error: toolUpdateError } = await supabase
                .from('tools')
                .update({ status: newStatus })
                .eq('tool_id', selectedTool.tool_id);

            if (toolUpdateError) throw toolUpdateError;

            Alert.alert('Success', 'Tool returned successfully');
            setReturnModalVisible(false);
            fetchTools();
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    const renderTool = ({ item }) => (
        <View style={styles.toolCard}>
            <View style={styles.toolInfo}>
                <Text style={styles.toolName}>{item.tool_name}</Text>
                <Text style={styles.toolCode}>ID: {item.tool_code}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>
            <View style={styles.toolActions}>
                {item.status === 'available' ? (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                            setSelectedTool(item);
                            setCheckoutModalVisible(true);
                        }}
                    >
                        <Text style={styles.actionButtonText}>Check Out</Text>
                    </TouchableOpacity>
                ) : item.status === 'Not available' ? (
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: '#3B82F6' }]}
                        onPress={() => {
                            setSelectedTool(item);
                            setReturnModalVisible(true);
                        }}
                    >
                        <Text style={styles.actionButtonText}>Return</Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.repairingText}>Under Repair</Text>
                )}
            </View>
        </View>
    );

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'available': return '#22C55E';
            case 'not available': return '#EF4444';
            case 'repairing': return '#F59E0B';
            default: return '#9CA3AF';
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F4B400" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.logoBox}>
                    <Text style={styles.logo}>🛠</Text>
                </View>
                <View>
                    <Text style={styles.heading}>Tool Library</Text>
                    <Text style={styles.subHeading}>{project?.name}</Text>
                </View>
            </View>

            <FlatList
                data={tools}
                keyExtractor={(item) => item.tool_id.toString()}
                renderItem={renderTool}
                ListEmptyComponent={<Text style={styles.emptyText}>No tools found in library</Text>}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            {/* Checkout Modal */}
            <Modal visible={checkoutModalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Check Out: {selectedTool?.tool_name}</Text>
                        <Text style={styles.label}>Select Worker</Text>
                        <ScrollView style={{ maxHeight: 200 }}>
                            {workers.map(worker => (
                                <TouchableOpacity
                                    key={worker.id}
                                    style={[
                                        styles.workerOption,
                                        selectedWorker === worker.id && styles.workerOptionSelected
                                    ]}
                                    onPress={() => setSelectedWorker(worker.id)}
                                >
                                    <Text style={[styles.workerText, selectedWorker === worker.id && { color: '#0B0F14' }]}>
                                        {worker.full_name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setCheckoutModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleCheckout}
                            >
                                <Text style={styles.confirmButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Return Modal */}
            <Modal visible={returnModalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Return Tool: {selectedTool?.tool_name}</Text>

                        <Text style={styles.label}>Condition</Text>
                        <View style={styles.conditionRow}>
                            <TouchableOpacity
                                style={[styles.conditionBtn, returnCondition === 'ok' && styles.conditionBtnActive]}
                                onPress={() => setReturnCondition('ok')}
                            >
                                <Text style={[styles.conditionText, returnCondition === 'ok' && { color: '#0B0F14' }]}>OK</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.conditionBtn, returnCondition === 'damaged' && styles.conditionBtnActive, { backgroundColor: returnCondition === 'damaged' ? '#EF4444' : '#1C2430' }]}
                                onPress={() => setReturnCondition('damaged')}
                            >
                                <Text style={[styles.conditionText, returnCondition === 'damaged' && { color: '#FFFFFF' }]}>Damaged</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Remarks (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Add any remarks..."
                            placeholderTextColor="#9CA3AF"
                            value={returnRemarks}
                            onChangeText={setReturnRemarks}
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setReturnModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleReturn}
                            >
                                <Text style={styles.confirmButtonText}>Return Tool</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0B0F14', padding: 20 },
    loadingContainer: { flex: 1, backgroundColor: '#0B0F14', justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
    logoBox: { backgroundColor: '#F4B400', padding: 14, borderRadius: 16, marginRight: 12 },
    logo: { fontSize: 24 },
    heading: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
    subHeading: { color: '#9CA3AF', fontSize: 13 },
    toolCard: {
        backgroundColor: '#121826',
        padding: 16,
        borderRadius: 18,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    toolInfo: { flex: 1 },
    toolName: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    toolCode: { color: '#9CA3AF', fontSize: 12, marginTop: 2 },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginTop: 6,
    },
    statusText: { color: '#0B0F14', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
    actionButton: { backgroundColor: '#F4B400', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
    actionButtonText: { color: '#0B0F14', fontWeight: '700', fontSize: 13 },
    repairingText: { color: '#F59E0B', fontWeight: '700' },
    emptyText: { color: '#9CA3AF', textAlign: 'center', marginTop: 40 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
    modalContent: { backgroundColor: '#121826', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#1F2937' },
    modalTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 20 },
    label: { color: '#9CA3AF', fontSize: 13, marginBottom: 8, marginTop: 10 },
    workerOption: { backgroundColor: '#1C2430', padding: 14, borderRadius: 12, marginBottom: 8 },
    workerOptionSelected: { backgroundColor: '#F4B400' },
    workerText: { color: '#FFFFFF', fontWeight: '600' },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
    modalButton: { flex: 1, padding: 14, borderRadius: 14, alignItems: 'center' },
    cancelButton: { backgroundColor: '#1C2430', marginRight: 10 },
    confirmButton: { backgroundColor: '#F4B400' },
    cancelButtonText: { color: '#FFFFFF', fontWeight: '700' },
    confirmButtonText: { color: '#0B0F14', fontWeight: '700' },
    conditionRow: { flexDirection: 'row', gap: 10 },
    conditionBtn: { flex: 1, backgroundColor: '#1C2430', padding: 12, borderRadius: 12, alignItems: 'center' },
    conditionBtnActive: { backgroundColor: '#22C55E' },
    conditionText: { color: '#9CA3AF', fontWeight: '700' },
    input: {
        backgroundColor: '#0B0F14',
        borderRadius: 12,
        padding: 14,
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#1F2937',
        marginTop: 4,
    },
});
