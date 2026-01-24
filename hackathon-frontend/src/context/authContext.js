import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Create Context
const AuthContext = createContext();

// Backend URL (Replace with your actual backend IP/URL)
// For Android Emulator: http://10.0.2.2:8000
// For Physical Device: http://<YOUR_LP_IP>:8000
const API_URL = 'http://192.168.207.185:8000'; // Updated to detected Wi-Fi IP

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is logged in on app start
    useEffect(() => {
        isLoggedIn();
    }, []);

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let token = await AsyncStorage.getItem('userToken');
            let role = await AsyncStorage.getItem('userRole');

            if (token) {
                setUserToken(token);
                setUserRole(role ? parseInt(role) : null);
            }
            setIsLoading(false);
        } catch (e) {
            console.log(`isLoggedIn error: ${e}`);
            setIsLoading(false);
        }
    };

    const login = async (email, password, role_id) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password,
                role_id,
            });

            console.log('Login Response:', response.data);

            const token = response.data.access_token;
            const role = response.data.user.role_id;

            setUserToken(token);
            setUserRole(role);

            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('userRole', String(role));

            setIsLoading(false);
            return { success: true };

        } catch (error) {
            console.log('Login Error:', error.response?.data || error.message);
            setIsLoading(false);
            return {
                success: false,
                error: error.response?.data?.detail || 'Login failed'
            };
        }
    };

    const logout = async () => {
        setIsLoading(true);
        setUserToken(null);
        setUserRole(null);
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userRole');
        } catch (e) {
            console.log(`Logout error: ${e}`);
        }
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider value={{ login, logout, isLoading, userToken, userRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
