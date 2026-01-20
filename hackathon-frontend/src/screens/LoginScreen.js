import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function LoginScreen({ route, navigation }) {
  const { role } = route.params;
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSendOTP = () => {
    if (!phone) {
      setError('Mobile number is required');
      return;
    }

    if (phone.length !== 10) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }

    setError('');
    navigation.navigate('OTP', { role, phone });
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

      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Role: {role}</Text>

      {/* Phone Input */}
      <TextInput
        placeholder="Enter phone number"
        placeholderTextColor="#9CA3AF"
        keyboardType="phone-pad"
        maxLength={10}
        value={phone}
        onChangeText={(text) => {
          setPhone(text.replace(/[^0-9]/g, ''));
          setError('');
        }}
        style={styles.input}
      />

      {/* Error message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Send OTP */}
      <TouchableOpacity
        style={[
          styles.button,
          phone.length !== 10 && { opacity: 0.6 }
        ]}
        onPress={handleSendOTP}
        disabled={phone.length !== 10}
      >
        <Text style={styles.buttonText}>Send OTP</Text>
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
  logoEmoji: {
    fontSize: 32,
  },
  appName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#F4B400',
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    color: 'white',
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 16,
    fontSize: 13,
  },
  button: {
    backgroundColor: '#F4B400',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#0b0f14',
    fontSize: 18,
    fontWeight: '700',
  },
});
