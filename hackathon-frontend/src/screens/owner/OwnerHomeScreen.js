import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';

export default function OwnerHomeScreen({ navigation }) {
  const [projects, setProjects] = useState([
    { id: '1', name: 'Metro Line 4', area: 'Andheri East' },
    { id: '2', name: 'Sky Tower', area: 'Lower Parel' },
    { id: '3', name: 'Green Residency', area: 'Thane West' },
    { id: '4', name: 'Highway Expansion', area: 'Panvel' },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const addProject = () => {
    if (!name || !startDate || !endDate) {
      alert('Please fill all required fields');
      return;
    }

    const newProject = {
      id: Date.now().toString(),
      name,
      area: 'New Project',
      description,
      startDate,
      endDate,
    };

    setProjects([newProject, ...projects]);
    setShowModal(false);
    setName('');
    setDescription('');
    setStartDate('');
    setEndDate('');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() =>
        navigation.navigate('OwnerProjectDashboard', { project: item })
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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Your Projects</Text>
          <Text style={styles.subHeading}>
            High-level overview & approvals
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.addText}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* Project List */}
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      />

      {/* Create Project Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Create New Project</Text>

              <TextInput
                style={styles.input}
                placeholder="Project Name"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
              />

              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="Description"
                placeholderTextColor="#9CA3AF"
                multiline
                value={description}
                onChangeText={setDescription}
              />

              <TextInput
                style={styles.input}
                placeholder="Start Date (DD/MM/YYYY)"
                placeholderTextColor="#9CA3AF"
                value={startDate}
                onChangeText={setStartDate}
              />

              <TextInput
                style={styles.input}
                placeholder="End Date (DD/MM/YYYY)"
                placeholderTextColor="#9CA3AF"
                value={endDate}
                onChangeText={setEndDate}
              />

              <TouchableOpacity style={styles.saveBtn} onPress={addProject}>
                <Text style={styles.saveText}>Create Project</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

  addButton: {
    backgroundColor: '#F4B400',
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    fontSize: 24,
    fontWeight: '900',
  },

  card: {
    backgroundColor: '#121826',
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#121826',
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#0B0F14',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    marginBottom: 14,
  },
  saveBtn: {
    backgroundColor: '#F4B400',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: {
    fontWeight: '800',
  },
  cancelBtn: {
    alignItems: 'center',
    marginTop: 12,
  },
  cancelText: {
    color: '#9CA3AF',
  },
});
