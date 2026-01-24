import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { addToOutbox } from '../db/outbox';

const API_BASE = 'http://172.16.6.247:8000'; // your backend IP

export const postWithOffline = async (endpoint, payload) => {
  const state = await NetInfo.fetch();

  if (state.isConnected) {
    // ONLINE → send immediately
    return axios.post(API_BASE + endpoint, payload);
  } else {
    // OFFLINE → queue it
    await addToOutbox(endpoint, 'POST', payload);
    console.log('📥 Queued offline:', endpoint);
    return { offline: true };
  }
};
