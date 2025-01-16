import { useRouter } from 'next/router';
import { AuthService } from '../services/auth.service';
import { LoginFormValues } from '../types/auth';

const LoginPage = () => {
    const router = useRouter();

    const handleLogin = async (values: LoginFormValues) => {
        try {
            await AuthService.login(values);
            router.push('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
            // Handle login error (show error message to user)
        }
    };

    // ... rest of your component code
};

export default LoginPage; 