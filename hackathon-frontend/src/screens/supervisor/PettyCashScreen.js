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
    Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { supabase, BUCKETS } from '../../lib/supabase';
import { decode } from 'base64-arraybuffer';

export default function PettyCashScreen({ route }) {
    const { project } = route.params || {};
    const projectId = project?.id;

    const [wallet, setWallet] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    // Form state
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [expenseType, setExpenseType] = useState('misc');
    const [receipt, setReceipt] = useState(null);

    const expenseTypes = [
        { label: 'Wages', value: 'wages' },
        { label: 'Transport', value: 'transport' },
        { label: 'Food', value: 'food' },
        { label: 'Misc', value: 'misc' },
    ];

    useEffect(() => {
        if (projectId) {
            fetchData();
        }
    }, [projectId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            await Promise.all([fetchWallet(), fetchExpenses()]);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchWallet = async () => {
        const { data, error } = await supabase
            .from('petty_cash_wallets')
            .select('*')
            .eq('project_id', projectId)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Wallet fetch error:', error);
        } else {
            setWallet(data);
        }
    };

    const fetchExpenses = async () => {
        const { data, error } = await supabase
            .from('petty_cash_expenses')
            .select(`
                *,
                petty_cash_receipts (file_path)
            `)
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Expenses fetch error:', error);
        } else {
            setExpenses(data || []);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled) {
            setReceipt(result.assets[0]);
        }
    };

    const handleAddExpense = async () => {
        if (!amount || !description) {
            Alert.alert('Error', 'Please fill amount and description');
            return;
        }

        const expAmount = parseFloat(amount);
        if (isNaN(expAmount) || expAmount <= 0) {
            Alert.alert('Error', 'Invalid amount');
            return;
        }

        if (wallet && expAmount > wallet.remaining_balance) {
            Alert.alert('Error', 'Insufficient balance in wallet');
            return;
        }

        try {
            setSubmitting(true);

            // 1. Fetch latest balance to decide payment mode
            const { data: latestWallet, error: fetchError } = await supabase
                .from('petty_cash_wallets')
                .select('remaining_balance')
                .eq('id', wallet.id)
                .single();

            if (fetchError || !latestWallet) throw new Error('Could not verify wallet balance');

            const currentBalance = latestWallet.remaining_balance;
            let paymentMode = 'wallet';
            let newBalance = currentBalance - expAmount;

            // Logic: If balance reaches 0 or below, it's a reimbursement
            if (newBalance <= 0) {
                paymentMode = 'reimbursement';
                newBalance = Math.max(0, newBalance); // Don't let wallet go negative in DB if we decide to cap it
            }

            // 2. Get GPS Location
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'GPS permission is required for expense validation.');
                setSubmitting(false);
                return;
            }
            let location = await Location.getCurrentPositionAsync({});

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                Alert.alert('Error', 'Session expired. Please log in again.');
                setSubmitting(false);
                return;
            }

            // 2. Insert into petty_cash_expenses
            const { data: expenseData, error: expenseError } = await supabase
                .from('petty_cash_expenses')
                .insert([{
                    wallet_id: wallet.id,
                    project_id: projectId,
                    amount: expAmount,
                    description,
                    expense_type: expenseType,
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    spent_by: user.id,
                    payment_mode: paymentMode // New column
                }])
                .select()
                .single();

            if (expenseError) throw expenseError;

            // 3. Upload receipt if exists
            if (receipt) {
                const fileExt = receipt.uri.split('.').pop();
                const fileName = `${expenseData.id}_${Date.now()}.${fileExt}`;
                const filePath = `receipts/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from(BUCKETS.PETTY_CASH)
                    .upload(filePath, decode(receipt.base64), {
                        contentType: `image/${fileExt}`,
                    });

                if (uploadError) throw uploadError;

                const { error: receiptError } = await supabase
                    .from('petty_cash_receipts')
                    .insert([{
                        expense_id: expenseData.id,
                        file_path: filePath
                    }]);

                if (receiptError) throw receiptError;
            }

            // 4. Update wallet balance ONLY if it was a wallet transaction or to clear remaining
            if (paymentMode === 'wallet' || currentBalance > 0) {
                const { error: walletError } = await supabase
                    .from('petty_cash_wallets')
                    .update({ remaining_balance: Math.max(0, newBalance) })
                    .eq('id', wallet.id);

                if (walletError) throw walletError;
            }

            Alert.alert(
                paymentMode === 'wallet' ? 'Success' : 'Self-Paid Recorded',
                paymentMode === 'wallet' ? 'Expense recorded from wallet.' : 'Budget exceeded. Categorized as Reimbursement.'
            );
            setModalVisible(false);
            resetForm();
            fetchData();
        } catch (err) {
            Alert.alert('Error', err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setAmount('');
        setDescription('');
        setExpenseType('misc');
        setReceipt(null);
    };

    const getReceiptUrl = (path) => {
        const { data } = supabase.storage.from(BUCKETS.PETTY_CASH).getPublicUrl(path);
        return data.publicUrl;
    };

    const renderExpense = ({ item }) => (
        <View style={styles.expenseCard}>
            <View style={styles.expenseHeader}>
                <View>
                    <View style={styles.titleRow}>
                        <Text style={styles.expenseDescription}>{item.description}</Text>
                        <View style={[styles.modeBadge, item.payment_mode === 'reimbursement' && styles.modeBadgeAlt]}>
                            <Text style={styles.modeText}>{item.payment_mode === 'reimbursement' ? 'SELF PAID' : 'WALLET'}</Text>
                        </View>
                    </View>
                    <Text style={styles.expenseDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.expenseAmount}>₹{item.amount}</Text>
            </View>
            <View style={styles.expenseMeta}>
                <View style={styles.typeBadge}>
                    <Text style={styles.typeText}>{item.expense_type}</Text>
                </View>
                <Text style={styles.gpsText}>📍 {item.latitude?.toFixed(4)}, {item.longitude?.toFixed(4)}</Text>
            </View>
            {item.petty_cash_receipts?.length > 0 && (
                <Image
                    source={{ uri: getReceiptUrl(item.petty_cash_receipts[0].file_path) }}
                    style={styles.receiptThumb}
                />
            )}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F4B400" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoBox}>
                    <Text style={styles.logo}>💰</Text>
                </View>
                <View>
                    <Text style={styles.heading}>Petty Cash Wallet</Text>
                    <Text style={styles.subHeading}>{project?.name}</Text>
                </View>
            </View>

            {/* Wallet Balance Card */}
            {wallet ? (
                <View style={styles.balanceCard}>
                    <Text style={styles.balanceLabel}>Remaining Balance</Text>
                    <Text style={styles.balanceValue}>₹{wallet.remaining_balance.toFixed(2)}</Text>
                    <View style={styles.budgetRow}>
                        <Text style={styles.budgetText}>Total Allocated: ₹{wallet.total_budget}</Text>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${(wallet.remaining_balance / wallet.total_budget) * 100}%` }]} />
                        </View>
                    </View>
                </View>
            ) : (
                <View style={styles.noWalletCard}>
                    <Text style={styles.noWalletText}>No wallet found for this project. Please contact project owner.</Text>
                </View>
            )}

            {/* History Section */}
            <View style={styles.historyHeader}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.historyTitle}>Expense History</Text>
                    {wallet && wallet.remaining_balance <= 0 && (
                        <Text style={styles.exhaustedText}>💡 Budget exhausted. New expenses will be marked as Self-Paid.</Text>
                    )}
                </View>
                <TouchableOpacity
                    style={[styles.addBtn, !wallet && { opacity: 0.5 }]}
                    disabled={!wallet}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.addBtnText}>+ New Expense</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={expenses}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderExpense}
                ListEmptyComponent={<Text style={styles.emptyText}>No expenses recorded yet</Text>}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            {/* Add Expense Modal */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <ScrollView contentContainerStyle={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Expense</Text>

                        <Text style={styles.label}>Amount (₹) *</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="Enter amount"
                            placeholderTextColor="#9CA3AF"
                            value={amount}
                            onChangeText={setAmount}
                        />

                        <Text style={styles.label}>Description *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Daily wages for 5 workers"
                            placeholderTextColor="#9CA3AF"
                            value={description}
                            onChangeText={setDescription}
                        />

                        <Text style={styles.label}>Category</Text>
                        <View style={styles.typeRow}>
                            {expenseTypes.map(type => (
                                <TouchableOpacity
                                    key={type.value}
                                    style={[styles.typeBtn, expenseType === type.value && styles.typeBtnActive]}
                                    onPress={() => setExpenseType(type.value)}
                                >
                                    <Text style={[styles.typeBtnText, expenseType === type.value && { color: '#0B0F14' }]}>{type.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Receipt Photo</Text>
                        <TouchableOpacity style={styles.receiptBtn} onPress={pickImage}>
                            <Text style={styles.receiptBtnText}>{receipt ? '✅ Receipt Selected' : '➕ Capture/Select Receipt'}</Text>
                        </TouchableOpacity>
                        {receipt && <Image source={{ uri: receipt.uri }} style={styles.receiptPreview} />}

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => { setModalVisible(false); resetForm(); }}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleAddExpense}
                                disabled={submitting}
                            >
                                {submitting ? <ActivityIndicator color="#0B0F14" /> : <Text style={styles.confirmText}>Submit Expense</Text>}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
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
    balanceCard: { backgroundColor: '#121826', borderRadius: 24, padding: 24, borderWidth: 1, borderColor: '#1F2937', marginBottom: 24 },
    balanceLabel: { color: '#9CA3AF', fontSize: 14, marginBottom: 4 },
    balanceValue: { color: '#F4B400', fontSize: 32, fontWeight: '800', marginBottom: 16 },
    budgetRow: { borderTopWidth: 1, borderTopColor: '#1F2937', paddingTop: 16 },
    budgetText: { color: '#9CA3AF', fontSize: 13, marginBottom: 8 },
    progressBar: { height: 8, backgroundColor: '#1F2937', borderRadius: 4, overflow: 'hidden' },
    progressFill: { height: '100%', backgroundColor: '#22C55E' },
    noWalletCard: { backgroundColor: '#121826', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#EF4444', marginBottom: 24 },
    noWalletText: { color: '#EF4444', textAlign: 'center' },
    historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    historyTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
    addBtn: { backgroundColor: '#F4B400', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
    addBtnText: { color: '#0B0F14', fontWeight: '800' },
    exhaustedText: { color: '#EF4444', fontSize: 11, fontWeight: '700', marginTop: 4 },
    expenseCard: { backgroundColor: '#121826', padding: 16, borderRadius: 18, marginBottom: 12, borderWidth: 1, borderColor: '#1F2937' },
    expenseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
    titleRow: { flexDirection: 'row', alignItems: 'center' },
    modeBadge: { backgroundColor: '#1E293B', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 8 },
    modeBadgeAlt: { backgroundColor: '#7F1D1D' },
    modeText: { color: '#FFF', fontSize: 8, fontWeight: '800' },
    expenseDescription: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', flex: 1, marginRight: 10 },
    expenseAmount: { color: '#EF4444', fontSize: 18, fontWeight: '800' },
    expenseDate: { color: '#6B7280', fontSize: 12, marginTop: 4 },
    expenseMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    typeBadge: { backgroundColor: '#1C2430', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    typeText: { color: '#9CA3AF', fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
    gpsText: { color: '#6B7280', fontSize: 11 },
    receiptThumb: { width: '100%', height: 120, borderRadius: 12, marginTop: 12, backgroundColor: '#1C2430' },
    emptyText: { color: '#9CA3AF', textAlign: 'center', marginTop: 40 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#121826', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, minHeight: '80%' },
    modalTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginBottom: 24 },
    label: { color: '#9CA3AF', fontSize: 13, marginBottom: 8, marginTop: 16 },
    input: { backgroundColor: '#0B0F14', borderRadius: 14, padding: 16, color: '#FFFFFF', borderWidth: 1, borderColor: '#1F2937' },
    typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    typeBtn: { backgroundColor: '#1C2430', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#1F2937' },
    typeBtnActive: { backgroundColor: '#F4B400', borderColor: '#F4B400' },
    typeBtnText: { color: '#9CA3AF', fontWeight: '700', fontSize: 14 },
    receiptBtn: { borderWidth: 1, borderColor: '#F4B400', borderStyle: 'dashed', borderRadius: 14, padding: 20, alignItems: 'center', marginTop: 8 },
    receiptBtnText: { color: '#F4B400', fontWeight: '700' },
    receiptPreview: { width: '100%', height: 200, borderRadius: 16, marginTop: 12 },
    modalActions: { flexDirection: 'row', gap: 12, marginTop: 32, paddingBottom: 20 },
    modalButton: { flex: 1, padding: 16, borderRadius: 16, alignItems: 'center' },
    cancelButton: { backgroundColor: '#1C2430' },
    confirmButton: { backgroundColor: '#F4B400' },
    cancelText: { color: '#FFFFFF', fontWeight: '700' },
    confirmText: { color: '#0B0F14', fontWeight: '800' },
});
