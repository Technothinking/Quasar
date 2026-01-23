import NetInfo from '@react-native-community/netinfo';

export const onNetworkAvailable = (callback) => {
  return NetInfo.addEventListener(state => {
    if (state.isConnected) callback();
  });
};
