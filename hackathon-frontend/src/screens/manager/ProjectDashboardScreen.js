import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default function ManagerProjectDashboardScreen({ route, navigation }) {
  const { project } = route.params;

  const modules = [
    { title: 'Material Approvals', screen: 'MaterialApproval', icon: '📦' },
    { title: 'Supervisor Reports', screen: 'SupervisorReports', icon: '📊' },
    { title: 'Site Issues', screen: 'IssueReview', icon: '⚠️' },
    { title: 'Attendance Overview', screen: 'AttendanceOverview', icon: '👷' },
    { title: 'Site Photos Review', screen: 'SitePhotosReview', icon: '📸' },
    { title: 'Task Assignment', screen: 'TaskAssignment', icon: '📋' },
    { title: 'Stock Tracking', screen: 'StockTracking', icon: '🏗' },
    { title: 'GST Invoices', screen: 'GSTInvoices', icon: '🧾' },
    { title: 'View DPRs', screen: 'ViewDPRs', icon: '📝' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.projectName}>{project.name}</Text>
          <Text style={styles.area}>Project ID: {project.id}</Text>
        </View>

        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🏗</Text>
        </View>
      </View>

      {/* Modules Grid */}
      <View style={styles.grid}>
        {modules.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigation.navigate(item.screen, { project: project, projectId: project.id, projectName: project.name })}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.text}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
    padding: 20,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  projectName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  area: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 4,
  },
  logoBox: {
    backgroundColor: '#F4B400',
    padding: 14,
    borderRadius: 16,
  },
  logoEmoji: {
    fontSize: 22,
  },

  /* Modules Grid */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#121826',
    paddingVertical: 25,
    borderRadius: 16,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  icon: {
    fontSize: 26,
    marginBottom: 8,
  },
  text: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
});
