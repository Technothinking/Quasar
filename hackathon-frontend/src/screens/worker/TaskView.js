import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabase';

/* 🌐 Translations */
const translations = {
  en: {
    appName: 'ConstructPro',
    title: 'Your Daily Tasks',
    subtitle: 'Manage your workload',
    status: { completed: 'DONE', in_progress: 'ACCEPTED', pending: 'PENDING' },
    actions: { accept: 'ACCEPT', complete: 'MARK COMPLETE' }
  },
  hi: {
    appName: 'कंस्ट्रक्टप्रो',
    title: 'आपके दैनिक कार्य',
    subtitle: 'अपना काम प्रबंधित करें',
    status: { completed: 'पूर्ण', in_progress: 'स्वीकार', pending: 'बकाया' },
    actions: { accept: 'स्वीकार करें', complete: 'पूर्ण करें' }
  },
  mr: {
    appName: 'कन्स्ट्रक्टप्रो',
    title: 'दैनिक कामे',
    subtitle: 'तुमचा वर्कलोड मॅनेज करा',
    status: { completed: 'पूर्ण', in_progress: 'स्वीकारले', pending: 'प्रलंबित' },
    actions: { accept: 'स्वीकार करा', complete: 'पूर्ण करा' }
  },
  ta: {
    appName: 'கன்ஸ்ட்ரக்ட் ப்ரோ',
    title: 'உங்கள் பணிகள்',
    subtitle: 'வேலைகளை நிர்வகிக்கவும்',
    status: { completed: 'முடிந்தது', in_progress: 'ஏற்றுக்கொள்ளப்பட்டது', pending: 'மீதமுள்ளது' },
    actions: { accept: 'ஏற்கவும்', complete: 'முடிக்கவும்' }
  },
};

export default function WorkerTaskView() {
  const { language } = useLanguage();
  const t = translations[language];

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('worker_tasks')
        .select('*')
        .contains('assigned_to', [user.id])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      console.error('Fetch tasks failed:', err);
      Alert.alert('Error', 'Could not load tasks');
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, nextStatus) => {
    try {
      setActionLoading(taskId);
      const { error } = await supabase
        .from('worker_tasks')
        .update({ status: nextStatus })
        .eq('id', taskId);

      if (error) throw error;

      // Local update
      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, status: nextStatus } : task
      ));
    } catch (err) {
      Alert.alert('Update Failed', err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#F4B400" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logo}>🏗</Text>
        </View>
        <Text style={styles.appName}>{t.appName}</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{t.title}</Text>
      <Text style={styles.subtitle}>{t.subtitle}</Text>

      {/* Task List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {tasks.length === 0 ? (
          <Text style={styles.emptyText}>No tasks assigned to you yet.</Text>
        ) : (
          tasks.map((task) => (
            <View key={task.id} style={styles.taskCard}>
              <View style={{ flex: 1, marginRight: 15 }}>
                <Text style={styles.taskText}>{task.task_description}</Text>

                <View style={[
                  styles.statusBadge,
                  task.status === 'completed' ? styles.done :
                    task.status === 'in_progress' ? styles.inProgress : styles.pending
                ]}>
                  <Text style={styles.statusText}>
                    {t.status[task.status] || task.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              {task.status === 'pending' && (
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => updateTaskStatus(task.id, 'in_progress')}
                  disabled={actionLoading === task.id}
                >
                  <Text style={styles.actionBtnText}>
                    {actionLoading === task.id ? '...' : t.actions.accept}
                  </Text>
                </TouchableOpacity>
              )}

              {task.status === 'in_progress' && (
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: '#22C55E' }]}
                  onPress={() => updateTaskStatus(task.id, 'completed')}
                  disabled={actionLoading === task.id}
                >
                  <Text style={styles.actionBtnText}>
                    {actionLoading === task.id ? '...' : t.actions.complete}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

/* 🎨 Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
  },
  logoBox: {
    backgroundColor: '#F4B400',
    padding: 14,
    borderRadius: 16,
    marginRight: 12,
  },
  logo: { fontSize: 24 },
  appName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: '#9CA3AF',
    marginBottom: 20,
  },
  taskCard: {
    backgroundColor: '#121826',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskText: {
    color: '#E5E7EB',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  pending: { backgroundColor: '#374151' },
  inProgress: { backgroundColor: '#3B82F6' },
  done: { backgroundColor: '#22C55E' },
  statusText: {
    fontWeight: '800',
    color: '#fff',
    fontSize: 10,
  },
  actionBtn: {
    backgroundColor: '#F4B400',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 12,
  },
  emptyText: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  }
});
