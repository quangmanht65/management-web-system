import api from '../utils/api';
import { LoginFormValues, TokenResponse } from '../types/auth';
import jwtDecode from 'jwt-decode';

export const AuthService = {
    async login(credentials: LoginFormValues) {
        const response = await api.post<TokenResponse>('/auth/login', credentials);
        const { access_token, refresh_token } = response.data;
        
        this.setTokens(access_token, refresh_token);
        return response.data;
    },

    async logout() {
        try {
            await api.post('/auth/logout');
        } finally {
            this.clearTokens();
        }
    },

    async refreshToken() {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            const response = await api.post<TokenResponse>('/auth/refresh_token', {
                refresh_token: refreshToken
            });

            const { access_token } = response.data;
            localStorage.setItem('accessToken', access_token);
            
            return access_token;
        } catch (error) {
            this.clearTokens();
            throw error;
        }
    },

    isAuthenticated(): boolean {
        const token = localStorage.getItem('accessToken');
        if (!token) return false;

        try {
            const decoded: any = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            
            return decoded.exp > currentTime;
        } catch {
            return false;
        }
    },

    setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    },

    clearTokens(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
}; 