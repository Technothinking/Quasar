import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function OTPScreen({ route, navigation }) {
  const { role } = route.params;
  const [otp, setOtp] = useState('');

  const verifyOTP = () => {
    const normalizedRole = role.trim().toLowerCase();

    switch (normalizedRole) {
      case 'owner':
        navigation.replace('OwnerHome');
        break;

      case 'manager':
        navigation.replace('ManagerHome');
        break;

      case 'supervisor':
      case 'site engineer': // future-proof
        navigation.replace('SupervisorStack');
        break;

      case 'worker':
        navigation.replace('WorkerHome');
        break;

      default:
        console.log('Unknown role:', role);
        navigation.replace('WorkerHome');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🏗</Text>
        </View>
        <Text style={styles.appName}>ConstructPro</Text>
      </View>

      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        Enter the OTP sent to your number
      </Text>

      <TextInput
        placeholder="Enter OTP"
        placeholderTextColor="#9CA3AF"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={verifyOTP}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f14',
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    backgroundColor: '#facc15',
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
  },
  logoEmoji: { fontSize: 32 },
  appName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#F4B400',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    color: 'white',
    textAlign: 'center',
    letterSpacing: 8,
    fontSize: 20,
  },
  button: {
    backgroundColor: '#F4B400',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#0b0f14',
    fontSize: 18,
    fontWeight: '700',
  },
});
