import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { supabase } from '../../lib/supabase';

const { width } = Dimensions.get('window');

// Custom Bar Component
const DayBar = ({ label, cost, maxCost }) => {
    const height = maxCost > 0 ? (cost / maxCost) * 120 : 0;
    const finalHeight = cost > 0 ? Math.max(height, 20) : 4;

    return (
        <View style={styles.barGroup}>
            <Text style={styles.barValue}>
                {cost > 0 ? `${cost / 1000}k` : '-'}
            </Text>
            <View
                style={[
                    styles.bar,
                    {
                        height: finalHeight,
                        backgroundColor: cost > 0 ? '#F4B400' : '#1F2937',
                    },
                ]}
            />
            <Text style={styles.barLabel}>{label}</Text>
        </View>
    );
};

export default function CostEstimates({ route }) {
    const { project } = route.params || {};
    const projectId = project?.id;

    const [loading, setLoading] = useState(true);
    const [weeklyData, setWeeklyData] = useState([]);
    const [totalWeeklyCost, setTotalWeeklyCost] = useState(0);
    const [avgDailyCost, setAvgDailyCost] = useState(0);

    const WAGE_PER_HEAD = 500;

    useEffect(() => {
        if (projectId) {
            fetchAttendanceData();
        }
    }, [projectId]);

    const fetchAttendanceData = async () => {
        try {
            setLoading(true);

            // Last 7 days (local time range)
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 6);

            const { data, error } = await supabase
                .from('attendances')
                .select('created_at, user_id')
                .eq('role', 'worker')
                .eq('project_id', projectId)
                // IMPORTANT: keep filtering in UTC
                .gte('created_at', startDate.toISOString())
                .lte('created_at', endDate.toISOString());

            if (error) throw error;

            processCostData(data || [], startDate, endDate);
        } catch (err) {
            console.error('Cost fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const processCostData = (logs, start, end) => {
        const grouping = {};

        // Initialize last 7 days (LOCAL dates)
        const dateIterator = new Date(start);
        while (dateIterator <= end) {
            const dateKey = dateIterator.toLocaleDateString('en-CA'); // YYYY-MM-DD local
            grouping[dateKey] = new Set();
            dateIterator.setDate(dateIterator.getDate() + 1);
        }

        // Fill with attendance logs (LOCAL date grouping)
        logs.forEach(log => {
            const dateKey = new Date(log.created_at).toLocaleDateString('en-CA');
            if (grouping[dateKey]) {
                grouping[dateKey].add(log.user_id);
            }
        });

        let total = 0;
        let daysWithCost = 0;

        const chartData = Object.keys(grouping).map(dateKey => {
            const count = grouping[dateKey].size;
            const dailyCost = count * WAGE_PER_HEAD;
            const dateObj = new Date(dateKey);

            const dayLabel = dateObj.toLocaleDateString('en-US', {
                weekday: 'short',
            });

            total += dailyCost;
            if (dailyCost > 0) daysWithCost++;

            return {
                fullDate: dateKey,
                dayLabel,
                count,
                cost: dailyCost,
            };
        });

        chartData.sort((a, b) => a.fullDate.localeCompare(b.fullDate));

        setWeeklyData(chartData);
        setTotalWeeklyCost(total);
        setAvgDailyCost(daysWithCost > 0 ? Math.round(total / daysWithCost) : 0);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F4B400" />
                <Text style={styles.loadingText}>Calculating Estimates...</Text>
            </View>
        );
    }

    const maxCost = Math.max(...weeklyData.map(d => d.cost), 1000);

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Weekly Cost Estimate</Text>
                    <Text style={styles.project}>{project?.name}</Text>
                </View>
                <View style={styles.logoBox}>
                    <Text style={styles.logo}>💰</Text>
                </View>
            </View>

            {/* Total Card */}
            <View style={styles.mainCard}>
                <Text style={styles.cardLabel}>
                    TOTAL ESTIMATED COST (7 Days)
                </Text>
                <Text style={styles.totalValue}>
                    ₹ {totalWeeklyCost.toLocaleString()}
                </Text>
                <View style={styles.wageBadge}>
                    <Text style={styles.wageText}>
                        @ ₹{WAGE_PER_HEAD} / Person / Day
                    </Text>
                </View>
            </View>

            {/* Chart */}
            <View style={styles.chartCard}>
                <Text style={styles.sectionTitle}>Daily Trend</Text>
                <View style={styles.chartRow}>
                    {weeklyData.map((d, i) => (
                        <DayBar
                            key={i}
                            label={d.dayLabel}
                            cost={d.cost}
                            maxCost={maxCost}
                        />
                    ))}
                </View>
            </View>

            {/* Breakdown */}
            <Text style={styles.sectionTitle}>Daily Breakdown</Text>
            <View style={styles.listContainer}>
                {weeklyData
                    .slice()
                    .reverse()
                    .map((item, index) => (
                        <View key={index} style={styles.row}>
                            <View style={styles.dateBox}>
                                <Text style={styles.rowDate}>
                                    {new Date(item.fullDate).toLocaleDateString(
                                        'en-GB'
                                    )}
                                </Text>
                                <Text style={styles.rowDay}>
                                    {item.dayLabel}
                                </Text>
                            </View>

                            <View style={styles.workerBox}>
                                <Text style={styles.workerCount}>
                                    {item.count} Workers
                                </Text>
                            </View>

                            <View style={styles.costBox}>
                                <Text style={styles.rowCost}>
                                    ₹ {item.cost}
                                </Text>
                            </View>
                        </View>
                    ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0B0F14', padding: 20 },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#0B0F14',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: { color: '#9CA3AF', marginTop: 10 },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        marginTop: 10,
    },
    title: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
    project: { color: '#9CA3AF', fontSize: 13, marginTop: 4 },
    logoBox: {
        backgroundColor: 'rgba(244, 180, 0, 0.1)',
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#F4B400',
    },
    logo: { fontSize: 24 },

    mainCard: {
        backgroundColor: '#121826',
        padding: 24,
        borderRadius: 20,
        marginBottom: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    cardLabel: {
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    totalValue: { color: '#F4B400', fontSize: 36, fontWeight: '800' },
    wageBadge: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 12,
    },
    wageText: { color: '#3B82F6', fontSize: 11, fontWeight: '600' },

    chartCard: {
        backgroundColor: '#121826',
        padding: 20,
        borderRadius: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 20,
    },
    chartRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 160,
    },
    barGroup: { alignItems: 'center', flex: 1 },
    bar: { width: 14, borderRadius: 7, marginBottom: 8 },
    barLabel: { color: '#6B7280', fontSize: 10, fontWeight: '700' },
    barValue: { color: '#fff', fontSize: 9, marginBottom: 4 },

    listContainer: { paddingBottom: 40 },
    row: {
        flexDirection: 'row',
        backgroundColor: '#121826',
        padding: 16,
        borderRadius: 14,
        marginBottom: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    dateBox: { flex: 2 },
    rowDate: { color: '#fff', fontWeight: '600', fontSize: 14 },
    rowDay: { color: '#6B7280', fontSize: 12 },
    workerBox: { flex: 2, alignItems: 'center' },
    workerCount: { color: '#9CA3AF', fontSize: 13 },
    costBox: { flex: 2, alignItems: 'flex-end' },
    rowCost: { color: '#F4B400', fontSize: 16, fontWeight: '700' },
});
