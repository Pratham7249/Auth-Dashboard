import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

interface User {
    _id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            console.log('AuthContext: Checking authentication...');
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    console.log('AuthContext: Token found, verifying...');
                    const { data } = await api.get('/auth/me');
                    console.log('AuthContext: User verified', data);
                    setUser(data);
                } catch (error) {
                    console.error('AuthContext: Verification failed', error);
                    localStorage.removeItem('token');
                }
            } else {
                console.log('AuthContext: No token found');
            }
            setIsLoading(false);
            console.log('AuthContext: Loading set to false');
        };
        checkAuth();
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem('token', token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
