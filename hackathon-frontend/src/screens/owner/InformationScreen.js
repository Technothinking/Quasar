import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '../../lib/supabase';

const { width } = Dimensions.get('window');

// Custom ProgressBar Component
const ProjectProgress = ({ percentage, label, color = '#F4B400' }) => (
  <View style={styles.statBox}>
    <View style={styles.statHeader}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statPercentage}>{percentage}%</Text>
    </View>
    <View style={styles.progressBg}>
      <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: color }]} />
    </View>
  </View>
);

// Custom BarChart Component for Finances
const FinanceChart = ({ budget, spent }) => {
  const spentRatio = Math.min((spent / budget) * 100, 100);
  const remaining = Math.max(budget - spent, 0);

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.sectionTitle}>Financial Overview (₹)</Text>
      <View style={styles.barsRow}>
        <View style={styles.barGroup}>
          <View style={[styles.bar, { height: 120, backgroundColor: '#F4B400' }]} />
          <Text style={styles.barLabel}>Budget</Text>
          <Text style={styles.barValue}>{budget}L</Text>
        </View>
        <View style={styles.barGroup}>
          <View style={[styles.bar, { height: (120 * spentRatio) / 100, backgroundColor: '#EF4444' }]} />
          <Text style={styles.barLabel}>Spent</Text>
          <Text style={styles.barValue}>{spent}L</Text>
        </View>
        <View style={styles.barGroup}>
          <View style={[styles.bar, { height: (120 * (100 - spentRatio)) / 100, backgroundColor: '#22C55E' }]} />
          <Text style={styles.barLabel}>Left</Text>
          <Text style={styles.barValue}>{remaining}L</Text>
        </View>
      </View>
    </View>
  );
};

export default function InformationScreen({ route }) {
  const { project } = route.params || {};
  const projectId = project?.id;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 0,
    approvedRequests: 0,
    dprCount: 0,
    laborToday: 0,
    budget: 250, // Mock Budget in Lakhs
    spent: 0
  });

  useEffect(() => {
    if (projectId) {
      fetchDashboardData();
    }
  }, [projectId]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch Material Requests for Spend stats
      const { data: requests } = await supabase
        .from('material_requests')
        .select('status, quantity_requested')
        .eq('project_id', projectId);

      // 2. Fetch DPRs for progress
      const { count: dprCount } = await supabase
        .from('daily_dprs')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId);

      // 3. Fetch Attendance for labor today
      const { count: laborToday } = await supabase
        .from('attendances')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId)
        .gte('created_at', new Date().toISOString().split('T')[0]);

      // Calculate logic
      const approved = requests?.filter(r => r.status === 'approved' || r.status === 'verified').length || 0;
      // Mock Spend mapping: Every approved request ~= 0.5L for demonstration
      const calculatedSpend = (approved * 0.75).toFixed(1);

      setStats({
        totalRequests: requests?.length || 0,
        approvedRequests: approved,
        dprCount: dprCount || 0,
        laborToday: laborToday || 0,
        budget: 250,
        spent: parseFloat(calculatedSpend)
      });

    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F4B400" />
        <Text style={styles.loadingText}>Synthesizing Project Insights...</Text>
      </View>
    );
  }

  // Calculate Progress: 1 DPR count ~= 2% progress (up to 95%)
  const progressPercent = Math.min(stats.dprCount * 2 + 10, 95);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Premium Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Executive Dashboard</Text>
          <Text style={styles.projectName}>{project?.name || 'Grand Estate'}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.liveBadge}><View style={styles.dot} /><Text style={styles.liveText}>LIVE UPDATES</Text></View>
            <Text style={styles.locationText}>📍 {project?.area || 'South Mumbai'}</Text>
          </View>
        </View>
        <View style={styles.logoBox}><Text style={styles.logo}>🏦</Text></View>
      </View>

      {/* Main Stats Strip */}
      <View style={styles.statsStrip}>
        <View style={styles.miniStat}>
          <Text style={styles.miniLabel}>Materials</Text>
          <Text style={styles.miniValue}>{stats.totalRequests}</Text>
        </View>
        <View style={styles.miniStat}>
          <Text style={styles.miniLabel}>Labour</Text>
          <Text style={styles.miniValue}>{stats.laborToday}</Text>
        </View>
        <View style={styles.miniStat}>
          <Text style={styles.miniLabel}>DPR Logs</Text>
          <Text style={styles.miniValue}>{stats.dprCount}</Text>
        </View>
      </View>

      {/* Progress Section */}
      <View style={styles.card}>
        <ProjectProgress percentage={progressPercent} label="Work Completion" color="#F4B400" />
        <View style={styles.healthRow}>
          <Text style={styles.healthLabel}>Site Health Index</Text>
          <Text style={styles.healthStatus}>Good</Text>
        </View>
      </View>

      {/* Finance Section */}
      <View style={styles.card}>
        <FinanceChart budget={stats.budget} spent={stats.spent} />
        <View style={styles.financeFooter}>
          <View>
            <Text style={styles.fLabel}>Total Budget</Text>
            <Text style={styles.fValue}>₹ {stats.budget}L</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.fLabel}>Actual Burn</Text>
            <Text style={[styles.fValue, { color: '#EF4444' }]}>₹ {stats.spent}L</Text>
          </View>
        </View>
      </View>

      {/* Stock Health */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Inventory Health</Text>
        <View style={styles.inventoryRow}>
          <View style={styles.invBox}>
            <Text style={styles.invVal}>{stats.approvedRequests}</Text>
            <Text style={styles.invLab}>Verified</Text>
          </View>
          <View style={styles.invBox}>
            <Text style={[styles.invVal, { color: '#F4B400' }]}>{stats.totalRequests - stats.approvedRequests}</Text>
            <Text style={styles.invLab}>Pending</Text>
          </View>
          <View style={styles.invBox}>
            <Text style={[styles.invVal, { color: '#3B82F6' }]}>12</Text>
            <Text style={styles.invLab}>Categories</Text>
          </View>
        </View>
      </View>

      {/* Project Details */}
      <View style={styles.footerInfo}>
        <Text style={styles.infoTitle}>Architectural Details</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}><Text style={styles.infoLabel}>Timeline</Text><Text style={styles.infoVal}>18 Months</Text></View>
          <View style={styles.infoItem}><Text style={styles.infoLabel}>Type</Text><Text style={styles.infoVal}>Residential</Text></View>
          <View style={styles.infoItem}><Text style={styles.infoLabel}>Consultant</Text><Text style={styles.infoVal}>DesignX</Text></View>
          <View style={styles.infoItem}><Text style={styles.infoLabel}>Contractor</Text><Text style={styles.infoVal}>ABC Infra</Text></View>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F14', padding: 20 },
  loadingContainer: { flex: 1, backgroundColor: '#0B0F14', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#9CA3AF', marginTop: 15, fontSize: 13, letterSpacing: 1 },

  /* Header */
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, marginTop: 10 },
  welcomeText: { color: '#F4B400', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  projectName: { color: '#FFFFFF', fontSize: 26, fontWeight: '800' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(34, 197, 94, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E', marginRight: 6 },
  liveText: { color: '#22C55E', fontSize: 9, fontWeight: '900' },
  locationText: { color: '#9CA3AF', fontSize: 12 },
  logoBox: { backgroundColor: 'rgba(244, 180, 0, 0.1)', borderWidth: 1, borderColor: '#F4B400', padding: 14, borderRadius: 20 },
  logo: { fontSize: 24 },

  /* Stats Strip */
  statsStrip: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  miniStat: { backgroundColor: '#121826', padding: 16, borderRadius: 16, width: (width - 60) / 3, alignItems: 'center', borderWidth: 1, borderColor: '#1F2937' },
  miniLabel: { color: '#6B7280', fontSize: 10, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6 },
  miniValue: { color: '#fff', fontSize: 20, fontWeight: '800' },

  /* Cards */
  card: { backgroundColor: '#121826', padding: 20, borderRadius: 24, marginBottom: 16, borderWidth: 1, borderColor: '#1F2937', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 20 },

  /* Progress Component */
  statBox: { marginBottom: 10 },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  statLabel: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  statPercentage: { color: '#F4B400', fontSize: 18, fontWeight: '800' },
  progressBg: { height: 10, backgroundColor: '#0B0F14', borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5 },
  healthRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, borderTopWidth: 1, borderTopColor: '#1F2937', paddingTop: 12 },
  healthLabel: { color: '#6B7280', fontSize: 12 },
  healthStatus: { color: '#22C55E', fontSize: 12, fontWeight: '700' },

  /* Finance Chart */
  chartContainer: { marginBottom: 10 },
  barsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 150, paddingBottom: 10 },
  barGroup: { alignItems: 'center' },
  bar: { width: 40, borderRadius: 8, marginBottom: 10 },
  barLabel: { color: '#6B7280', fontSize: 10, textTransform: 'uppercase', fontWeight: '700' },
  barValue: { color: '#fff', fontSize: 12, fontWeight: '700', marginTop: 2 },
  financeFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#1F2937', paddingTop: 15, marginTop: 10 },
  fLabel: { color: '#6B7280', fontSize: 10, marginBottom: 4 },
  fValue: { color: '#fff', fontSize: 18, fontWeight: '800' },

  /* Inventory Row */
  inventoryRow: { flexDirection: 'row', justifyContent: 'space-around' },
  invBox: { alignItems: 'center' },
  invVal: { color: '#22C55E', fontSize: 24, fontWeight: '800' },
  invLab: { color: '#9CA3AF', fontSize: 10, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },

  /* Footer Info */
  footerInfo: { padding: 10 },
  infoTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginBottom: 15 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  infoItem: { width: '45%', marginBottom: 15 },
  infoLabel: { color: '#6B7280', fontSize: 11 },
  infoVal: { color: '#D1D5DB', fontSize: 14, fontWeight: '600', marginTop: 2 },
  emptyText: { color: '#4B5563', textAlign: 'center', marginTop: 40 },
});
