export interface LoginFormValues {
    username: string;
    password: string;
}

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
} 