import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Auth reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
                error: null
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
                error: null
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null
            };
        default:
            return state;
    }
};

// Initial state
const initialState = {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token'),
    loading: true,
    error: null
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Set up axios defaults
    useEffect(() => {
        if (state.token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [state.token]);

    // Check if user is logged in on app start
    useEffect(() => {
        const checkAuth = async () => {
            if (state.token) {
                try {
                    const response = await axios.get(`${API_BASE_URL}/users/me`);
                    dispatch({
                        type: 'LOGIN_SUCCESS',
                        payload: {
                            user: response.data.user,
                            token: state.token
                        }
                    });
                } catch (error) {
                    localStorage.removeItem('token');
                    dispatch({ type: 'LOGOUT' });
                }
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };

        checkAuth();
    }, []);

    // Login function
    const login = async (email, password) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'CLEAR_ERROR' });

            const response = await axios.post(`${API_BASE_URL}/users/login`, {
                email,
                password
            });

            const { user, token } = response.data;

            localStorage.setItem('token', token);
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, token }
            });

            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Login failed';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            return { success: false, error: errorMessage };
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            dispatch({ type: 'CLEAR_ERROR' });

            const response = await axios.post(`${API_BASE_URL}/users`, userData);

            const { user, token } = response.data;

            localStorage.setItem('token', token);
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, token }
            });

            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Registration failed';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
            return { success: false, error: errorMessage };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
    };

    // Clear error function
    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const value = {
        ...state,
        login,
        register,
        logout,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
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

