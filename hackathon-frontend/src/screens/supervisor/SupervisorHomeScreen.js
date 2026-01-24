import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabase';

/* 🌐 Translations (UI ONLY) */
const translations = {
  en: {
    heading: 'Your Projects',
    subHeading: 'Select a project to manage site work',
  },
  hi: {
    heading: 'आपकी परियोजनाएँ',
    subHeading: 'साइट प्रबंधन के लिए परियोजना चुनें',
  },
  mr: {
    heading: 'तुमचे प्रकल्प',
    subHeading: 'साइट कामकाजासाठी प्रकल्प निवडा',
  },
  ta: {
    heading: 'உங்கள் திட்டங்கள்',
    subHeading: 'தள மேலாண்மைக்கான திட்டத்தை தேர்வு செய்யவும்',
  },
};

export default function SupervisorHomeScreen({ navigation }) {
  const { language } = useLanguage();
  const t = translations[language];

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      // 1. Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error('Not authenticated');

      // 2. Get project IDs assigned to this user from project_user_roles
      const { data: roles, error: rolesError } = await supabase
        .from('project_user_roles')
        .select('project_id')
        .eq('user_id', user.id);

      if (rolesError) throw rolesError;

      const projectIds = roles.map(r => r.project_id).filter(id => id != null);

      if (projectIds.length === 0) {
        setProjects([]);
        return;
      }

      // 3. Fetch project details
      const { data: projectList, error: projectError } = await supabase
        .from('projects')
        .select('id, name')
        .in('id', projectIds);

      if (projectError) throw projectError;

      setProjects(projectList);
    } catch (err) {
      Alert.alert('Error', 'Failed to load projects: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={styles.area}>Internal Project ID: {item.id}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>{t.heading}</Text>
          <Text style={styles.subHeading}>{t.subHeading}</Text>
        </View>

        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🏗</Text>
        </View>
      </View>

      {/* Project List */}
      {loading ? (
        <ActivityIndicator size="large" color="#F4B400" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
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
    alignItems: 'flex-start',
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

  card: {
    backgroundColor: '#121826',
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
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
