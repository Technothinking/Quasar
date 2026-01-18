import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';

const projects = [
  { id: '1', name: 'Metro Line 4', area: 'Andheri East' },
  { id: '2', name: 'Sky Tower', area: 'Lower Parel' },
  { id: '3', name: 'Green Residency', area: 'Thane West' },
  { id: '4', name: 'Highway Expansion', area: 'Panvel' },
];

export default function SupervisorHomeScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() =>
        navigation.navigate('ProjectDashboard', { project: item })
      }
    >
      <Text style={styles.projectName}>{item.name}</Text>
      <View style={styles.locationRow}>
        <Text style={styles.locationIcon}>📍</Text>
        <Text style={styles.area}>{item.area}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with logo top-right */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Your Projects</Text>
          <Text style={styles.subHeading}>
            Select a project to manage site work
          </Text>
        </View>

        {/* Logo pinned top-right */}
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🏗</Text>
        </View>
      </View>

      {/* Project List */}
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
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
    alignItems: 'flex-start', // aligns logo to top
    marginBottom: 28,
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
  logoEmoji: {
    fontSize: 22,
  },

  /* Card */
  card: {
    backgroundColor: '#121826',
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  projectName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  area: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});
