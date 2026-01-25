import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView,
} from 'react-native';
import { supabase } from '../../lib/supabase';

export default function TaskAssign({ route }) {
    const { project } = route.params || {};
    const projectId = project?.id;

    const [workers, setWorkers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [taskDescription, setTaskDescription] = useState('');
    const [selectedWorker, setSelectedWorker] = useState(null);

    useEffect(() => {
        if (projectId) {
            fetchData();
        }
    }, [projectId]);

    const fetchData = async () => {
        try {
            setLoading(true);

            if (!projectId) {
                console.error('No project ID provided!');
                Alert.alert('Error', 'No project selected. Please go back and select a project.');
                setLoading(false);
                return;
            }

            await Promise.all([fetchWorkers(), fetchTasks()]);
        } catch (err) {
            console.error('Fetch data error:', err);
            Alert.alert('Error', err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchWorkers = async () => {
        try {
            console.log('Fetching workers for project:', projectId);
            // 1. Get all user_ids with role_id = 4 (worker) for this project
            const { data: roles, error: rolesError } = await supabase
                .from('project_user_roles')
                .select('user_id')
                .eq('project_id', projectId)
                .eq('role_id', 4);

            if (rolesError) {
                console.error('Roles fetch error:', rolesError);
                throw rolesError;
            }

            console.log('Found worker roles:', roles);
            const userIds = roles.map(r => r.user_id);
            if (userIds.length === 0) {
                console.log('No workers found for this project');
                setWorkers([]);
                return;
            }

            // 2. Fetch profile details (full_name) for these users
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('id, full_name')
                .in('id', userIds);

            if (profilesError) {
                console.error('Profiles fetch error:', profilesError);
                throw profilesError;
            }
            console.log('Found workers:', profiles);
            setWorkers(profiles || []);
        } catch (err) {
            console.error('Failed to fetch workers:', err);
            setWorkers([]);
        }
    };

    const fetchTasks = async () => {
        try {
            const { data, error } = await supabase
                .from('worker_tasks')
                .select('*')
                .eq('project_id', projectId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Tasks table error:', error);
                // If table doesn't exist, just set empty array
                if (error.code === '42P01' || error.message.includes('does not exist')) {
                    console.log('worker_tasks table does not exist yet - using empty array');
                    setTasks([]);
                    return;
                }
                throw error;
            }
            setTasks(data || []);
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
            setTasks([]);
        }
    };

    const handleAssignTask = async () => {
        if (!taskDescription.trim() || !selectedWorker) {
            Alert.alert('Error', 'Please fill task description and select a worker');
            return;
        }

        try {
            const { error } = await supabase
                .from('worker_tasks')
                .insert([{
                    project_id: projectId,
                    task_description: taskDescription,
                    assigned_to: [selectedWorker],
                    status: 'pending'
                }]);

            if (error) throw error;

            Alert.alert('Success', 'Task assigned to worker successfully!');
            setTaskDescription('');
            setSelectedWorker(null);
            fetchTasks();
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    const renderTask = ({ item }) => {
        const worker = workers.find(w => w.id === item.assigned_to);
        return (
            <View style={styles.taskCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={styles.taskTitle}>{item.task_description}</Text>
                    <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        {item.status?.toUpperCase().replace('_', ' ')}
                    </Text>
                </View>
                <Text style={styles.taskAssignee}>👷 Assigned to: {worker?.full_name || 'Unknown'}</Text>
                <Text style={styles.taskMeta}>📅 Created: {new Date(item.created_at).toLocaleDateString()}</Text>
                {item.updated_at && (
                    <Text style={styles.taskMeta}>🔄 Updated: {new Date(item.updated_at).toLocaleDateString()}</Text>
                )}
            </View>
        );
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#22C55E';
            case 'in_progress': return '#F4B400';
            default: return '#9CA3AF';
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#F4B400" />
                <Text style={{ color: 'white', marginTop: 10 }}>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoBox}>
                    <Text style={styles.logo}>🏗</Text>
                </View>
                <View>
                    <Text style={styles.heading}>Assign Tasks to Workers</Text>
                    <Text style={{ color: '#9CA3AF', fontSize: 12 }}>{project?.name || 'Project'}</Text>
                </View>
            </View>

            {/* Task Assignment Form */}
            <View style={styles.formCard}>
                <Text style={styles.label}>Task Description *</Text>
                <TextInput
                    style={[styles.input, { height: 80 }]}
                    placeholder="Enter task details for worker"
                    placeholderTextColor="#9CA3AF"
                    multiline
                    value={taskDescription}
                    onChangeText={setTaskDescription}
                />

                <Text style={styles.label}>Assign To Worker *</Text>
                {workers.length === 0 ? (
                    <Text style={{ color: '#9CA3AF', fontSize: 13, marginBottom: 12 }}>
                        No workers found for this project
                    </Text>
                ) : (
                    <View style={{ marginBottom: 12 }}>
                        {workers.map(worker => (
                            <TouchableOpacity
                                key={worker.id}
                                style={[
                                    styles.workerChip,
                                    selectedWorker === worker.id && styles.workerChipSelected
                                ]}
                                onPress={() => setSelectedWorker(worker.id)}
                            >
                                <Text style={styles.workerText}>{worker.full_name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <TouchableOpacity style={styles.button} onPress={handleAssignTask}>
                    <Text style={styles.buttonText}>Assign Task</Text>
                </TouchableOpacity>
            </View>

            {/* Assigned Tasks List */}
            <Text style={styles.sectionTitle}>Assigned Tasks</Text>
            {tasks.length === 0 ? (
                <Text style={styles.emptyText}>No tasks assigned yet</Text>
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id?.toString()}
                    renderItem={renderTask}
                    scrollEnabled={false}
                />
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0B0F14', padding: 20 },

    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    logoBox: {
        backgroundColor: '#F4B400',
        padding: 14,
        borderRadius: 16,
        marginRight: 12,
    },
    logo: { fontSize: 24 },
    heading: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },

    formCard: {
        backgroundColor: '#121826',
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: '#1F2937',
        marginBottom: 20,
    },
    label: { color: '#9CA3AF', fontSize: 13, marginBottom: 6, marginTop: 10 },
    input: {
        backgroundColor: '#0B0F14',
        borderRadius: 12,
        padding: 14,
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#1F2937',
        marginBottom: 12,
    },
    workerChip: {
        backgroundColor: '#0B0F14',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    workerChipSelected: {
        backgroundColor: '#F4B400',
        borderColor: '#F4B400',
    },
    workerText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    button: {
        backgroundColor: '#F4B400',
        padding: 14,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: { color: '#0B0F14', fontWeight: '700', fontSize: 15 },

    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10,
    },

    taskCard: {
        backgroundColor: '#121826',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    taskTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
    taskAssignee: { color: '#9CA3AF', fontSize: 13, marginTop: 4 },
    taskMeta: { color: '#9CA3AF', fontSize: 12, marginTop: 4 },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        fontSize: 10,
        fontWeight: '800',
        color: '#0B0F14',
    },
    emptyText: { color: '#9CA3AF', textAlign: 'center', marginTop: 30 },
});
