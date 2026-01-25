import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { supabase, BUCKETS } from '../../lib/supabase';

export default function PettyCashReportScreen({ route }) {
    const { project } = route.params || {};
    const projectId = project?.id;

    const [wallet, setWallet] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (projectId) fetchData();
    }, [projectId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            await Promise.all([fetchWallet(), fetchExpenses()]);
        } catch (err) {
            console.error('Fetch data error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchWallet = async () => {
        console.log('Fetching wallet for Project ID:', projectId);
        const { data, error } = await supabase
            .from('petty_cash_wallets')
            .select('*')
            .eq('project_id', projectId)
            .single();

        if (error) {
            console.error('Wallet fetch error:', error);
            if (error.code !== 'PGRST116') {
                Alert.alert('Fetch Error', 'Failed to load wallet: ' + error.message);
            }
        } else {
            console.log('Wallet data found:', data);
            setWallet(data);
        }
    };

    const fetchExpenses = async () => {
        try {
            const { data, error } = await supabase
                .from('petty_cash_expenses')
                .select(`
                    *,
                    petty_cash_receipts (file_path)
                `)
                .eq('project_id', projectId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setExpenses(data || []);
        } catch (err) {
            console.error('Expenses fetch error:', err);
            Alert.alert('Fetch Error', 'Failed to load expenses: ' + err.message);
        }
    };

    const getImageUrl = (path) => {
        const { data } = supabase.storage.from(BUCKETS.PETTY_CASH).getPublicUrl(path);
        return data.publicUrl;
    };

    const renderExpense = ({ item }) => (
        <View style={styles.expenseCard}>
            <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                    <View style={styles.titleRow}>
                        <Text style={styles.expenseDescription}>{item.description}</Text>
                        <View style={[styles.modeBadge, item.payment_mode === 'reimbursement' && styles.modeBadgeAlt]}>
                            <Text style={styles.modeText}>{item.payment_mode === 'reimbursement' ? 'SELF PAID' : 'WALLET'}</Text>
                        </View>
                    </View>
                    <Text style={styles.timeStamp}>{new Date(item.created_at).toLocaleString()} • {item.profiles?.full_name}</Text>
                </View>
                <Text style={styles.expenseAmount}>₹{item.amount}</Text>
            </View>

            <View style={styles.metaRow}>
                <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{item.expense_type}</Text>
                </View>
                <Text style={styles.gpsText}>📍 {item.latitude?.toFixed(4)}, {item.longitude?.toFixed(4)}</Text>
            </View>

            <View style={styles.photoContainer}>
                {item.petty_cash_receipts?.map((receipt, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedImage(getImageUrl(receipt.file_path))}
                    >
                        <Image
                            source={{ uri: getImageUrl(receipt.file_path) }}
                            style={styles.receiptThumb}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F4B400" />
            </View>
        );
    }

    const totalSpent = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
    const remainingBalance = wallet ? wallet.total_budget - totalSpent : 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.logoBox}>
                    <Text style={styles.logo}>🧾</Text>
                </View>
                <View>
                    <Text style={styles.heading}>Petty Cash Report</Text>
                    <Text style={styles.subHeading}>{project?.name}</Text>
                </View>
            </View>

            {wallet && (
                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Total Budget</Text>
                            <Text style={styles.summaryValue}>₹{wallet.total_budget}</Text>
                        </View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryLabel}>Total Spent</Text>
                            <Text style={[styles.summaryValue, { color: '#EF4444' }]}>₹{totalSpent.toFixed(2)}</Text>
                        </View>
                    </View>
                    <View style={styles.remainingBox}>
                        <Text style={styles.remainingLabel}>Remaining Balance</Text>
                        <Text style={[styles.remainingValue, { color: remainingBalance <= 0 ? '#EF4444' : '#22C55E' }]}>₹{remainingBalance.toFixed(2)}</Text>
                        {remainingBalance <= 0 && (
                            <Text style={styles.exhaustedWarning}>⚠️ No more expenses allowed.</Text>
                        )}
                    </View>
                </View>
            )}

            <Text style={styles.sectionTitle}>Expense Details</Text>
            <FlatList
                data={expenses}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderExpense}
                ListEmptyComponent={<Text style={styles.emptyText}>No expenses recorded yet</Text>}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            <Modal visible={!!selectedImage} transparent={false} animationType="fade">
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setSelectedImage(null)}
                    >
                        <Text style={styles.closeText}>✕ Close</Text>
                    </TouchableOpacity>
                    <Image
                        source={{ uri: selectedImage }}
                        style={styles.fullImage}
                        resizeMode="contain"
                    />
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
    summaryCard: {
        backgroundColor: '#121826',
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    summaryItem: { flex: 1 },
    summaryLabel: { color: '#9CA3AF', fontSize: 12, marginBottom: 4 },
    summaryValue: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
    remainingBox: { borderTopWidth: 1, borderTopColor: '#1F2937', paddingTop: 16, alignItems: 'center' },
    remainingLabel: { color: '#9CA3AF', fontSize: 14, marginBottom: 4 },
    remainingValue: { fontSize: 24, fontWeight: '800' },
    exhaustedWarning: { color: '#EF4444', fontSize: 12, fontWeight: '700', marginTop: 8 },
    sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 16 },
    expenseCard: {
        backgroundColor: '#121826',
        padding: 16,
        borderRadius: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    modeBadge: { backgroundColor: '#1E293B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8 },
    modeBadgeAlt: { backgroundColor: '#7F1D1D' },
    modeText: { color: '#FFF', fontSize: 8, fontWeight: '800' },
    expenseDescription: { color: '#FFFFFF', fontSize: 15, fontWeight: '600', flex: 1, marginRight: 10 },
    expenseAmount: { color: '#EF4444', fontSize: 16, fontWeight: '800' },
    timeStamp: { color: '#6B7280', fontSize: 11, marginTop: 4 },
    metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    typeBadge: { backgroundColor: '#1C2430', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    typeText: { color: '#9CA3AF', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
    gpsText: { color: '#6B7280', fontSize: 11 },
    photoContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    receiptThumb: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#1C2430' },
    emptyText: { color: '#9CA3AF', textAlign: 'center', marginTop: 40 },
    modalContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
    fullImage: { width: '100%', height: '80%' },
    closeButton: { position: 'absolute', top: 50, right: 20, backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 12 },
    closeText: { color: '#FFF', fontWeight: '700' },
});
