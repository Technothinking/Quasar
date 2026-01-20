import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function OTPScreen({ route, navigation }) {
  const { role } = route.params;
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const verifyOTP = () => {
    if (!otp) {
      setError('OTP is required');
      return;
    }

    if (otp.length !== 6) {
      setError('Enter a valid 6-digit OTP');
      return;
    }

    setError('');

    const normalizedRole = role.trim().toLowerCase();

    switch (normalizedRole) {
      case 'owner':
        navigation.replace('OwnerHome');
        break;

      case 'manager':
        navigation.replace('ManagerHome');
        break;

      case 'supervisor':
      case 'site engineer':
        navigation.replace('SupervisorStack');
        break;

      case 'worker':
        navigation.replace('WorkerHome');
        break;

      default:
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
        maxLength={6}
        value={otp}
        onChangeText={(text) => {
          setOtp(text.replace(/[^0-9]/g, ''));
          setError('');
        }}
        style={styles.input}
      />

      {/* Error message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[
          styles.button,
          otp.length !== 6 && { opacity: 0.6 }
        ]}
        onPress={verifyOTP}
        disabled={otp.length !== 6}
      >
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
    marginBottom: 8,
    color: 'white',
    textAlign: 'center',
    letterSpacing: 8,
    fontSize: 20,
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 16,
    fontSize: 13,
    textAlign: 'center',
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
