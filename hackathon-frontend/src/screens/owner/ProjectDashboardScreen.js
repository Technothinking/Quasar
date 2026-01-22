import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function OwnerProjectDashboardScreen({ route, navigation }) {
  const { project } = route.params;

  const modules = [
    {
      title: 'Project Information',
      subtitle: 'Overview & milestones',
      screen: 'Information',
      icon: 'ℹ️',
    },
    {
      title: 'Progress Summary',
      subtitle: 'Overall completion status',
      screen: 'ProgressSummary',
      icon: '📊',
    },
    {
      title: 'Material Approvals',
      subtitle: 'Pending cost approvals',
      screen: 'MaterialApproval',
      icon: '📦',
    },
    {
      title: 'Task Assignment',
      subtitle: 'Assign tasks to workers & supervisors',
      screen: 'TaskAssignment', // this should match the screen name in your stack
      icon: '📋',
    },
    {
      title: 'Stock Ovwerview',
      subtitle: 'Monitor material usage & wastage',
      screen: 'StockOverview',
      icon: '🏗',
    },
    {
      title: 'GST Invoices',
      subtitle: 'View & download invoices',
      screen: 'GSTInvoices',
      icon: '🧾',
    }
  ];


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.projectName}>{project.name}</Text>
          <Text style={styles.area}>📍 {project.area}</Text>
          <Text style={styles.ownerTag}>OWNER VIEW</Text>
        </View>

        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🏗</Text>
        </View>
      </View>

      {/* Modules */}
      <View style={styles.grid}>
        {modules.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigation.navigate(item.screen, { project })}
          >
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
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
    marginBottom: 26,
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
  ownerTag: {
    marginTop: 6,
    color: '#F4B400',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  logoBox: {
    backgroundColor: '#F4B400',
    padding: 14,
    borderRadius: 16,
  },
  logoEmoji: {
    fontSize: 22,
  },

  /* Grid */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#121826',
    paddingVertical: 22,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  icon: {
    fontSize: 26,
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 12,
  },
});
