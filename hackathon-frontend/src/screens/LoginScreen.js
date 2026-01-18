import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen({ route, navigation }) {
  const { role } = route.params;
  const [phone, setPhone] = useState('');

  return (
    <View style={styles.container}>
      {/* Logo at top-left */}
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🏗</Text>
        </View>
        <Text style={styles.appName}>ConstructPro</Text>
      </View>

      {/* Title and Role */}
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Role: {role}</Text>

      {/* Phone Input */}
      <TextInput
        placeholder="Enter phone number"
        placeholderTextColor="#9CA3AF"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />

      {/* Send OTP Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('OTP', { role })}
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
    borderColor: '#F4B400', // yellow border
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    color: 'white',
  },
  button: {
    backgroundColor: '#F4B400', // yellow button
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#0b0f14', // dark text for contrast
    fontSize: 18,
    fontWeight: '700',
  },
});
