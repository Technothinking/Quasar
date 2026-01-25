import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { supabase, BUCKETS } from '../../lib/supabase';

export default function WorkerUpdatesViewScreen({ route }) {
    const { project } = route.params || {};
    const projectId = project?.id;

    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        if (projectId) fetchUpdates();
    }, [projectId]);

    const fetchUpdates = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('work_updates')
                .select(`
                    *,
                    profiles:user_id (full_name),
                    work_update_photos (file_path)
                `)
                .eq('project_id', projectId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUpdates(data || []);
        } catch (err) {
            console.error('Fetch updates error:', err);
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (path) => {
        const { data } = supabase.storage.from(BUCKETS.WORK_UPDATES).getPublicUrl(path);
        return data.publicUrl;
    };

    const renderUpdate = ({ item }) => (
        <View style={styles.updateCard}>
            <View style={styles.cardHeader}>
                <Text style={styles.workerName}>{item.profiles?.full_name || 'Unknown Worker'}</Text>
                <Text style={styles.timeStamp}>{new Date(item.created_at).toLocaleString()}</Text>
            </View>
            <Text style={styles.description}>{item.work_description}</Text>

            <View style={styles.photoContainer}>
                {item.work_update_photos?.map((photo, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedImage(getImageUrl(photo.file_path))}
                    >
                        <Image
                            source={{ uri: getImageUrl(photo.file_path) }}
                            style={styles.updatePhoto}
                        />
                    </TouchableOpacity>
                ))}
            </View>
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
            <View style={styles.header}>
                <View style={styles.logoBox}>
                    <Text style={styles.logo}>🏗</Text>
                </View>
                <View>
                    <Text style={styles.heading}>Worker Updates</Text>
                    <Text style={styles.subHeading}>{project?.name}</Text>
                </View>
            </View>

            <FlatList
                data={updates}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderUpdate}
                ListEmptyComponent={<Text style={styles.emptyText}>No updates submitted yet</Text>}
                contentContainerStyle={{ paddingBottom: 20 }}
            />

            <Modal visible={!!selectedImage} transparent={false} animationType="fade">
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setSelectedImage(null)}
                    >
                        <Text style={styles.closeText}>✕ Close</Text>
                    </TouchableOpacity>
                    <Image
                        source={{ uri: selectedImage }}
                        style={styles.fullImage}
                        resizeMode="contain"
                    />
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
    updateCard: {
        backgroundColor: '#121826',
        padding: 16,
        borderRadius: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#1F2937',
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    workerName: { color: '#F4B400', fontWeight: '700', fontSize: 15 },
    timeStamp: { color: '#6B7280', fontSize: 11 },
    description: { color: '#E5E7EB', fontSize: 14, lineHeight: 20, marginBottom: 12 },
    photoContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    updatePhoto: { width: 100, height: 100, borderRadius: 12, backgroundColor: '#1C2430' },
    emptyText: { color: '#9CA3AF', textAlign: 'center', marginTop: 40 },
    modalContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
    fullImage: { width: '100%', height: '80%' },
    closeButton: { position: 'absolute', top: 50, right: 20, backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 12 },
    closeText: { color: '#FFF', fontWeight: '700' },
});
