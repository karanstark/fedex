import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import ShaderBackground from './ui/shader-background';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const response = await fetch('http://localhost:8000/api/token', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            localStorage.setItem('token', data.access_token);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);

            // FALLBACK TO MOCK MODE FOR DEMO PURPOSES
            if (email === 'abc@gmail.com' && password === '12345678') {
                console.log('Using mock login fallback');
                // Create a fake token
                localStorage.setItem('token', 'mock-jwt-token-for-demo');
                localStorage.setItem('user', JSON.stringify({
                    email: 'abc@gmail.com',
                    full_name: 'Admin User',
                    role: 'admin'
                }));
                alert('Backend connection failed, but logging in via Demo Mode!');
                navigate('/dashboard');
            } else {
                alert('Connection failed. For demo, use: abc@gmail.com / 12345678');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <ShaderBackground />

            <Card className="w-full max-w-md relative z-10 border-white/20 bg-white/90 dark:bg-black/50 backdrop-blur-md shadow-2xl">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                            <Lock className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
                    <CardDescription className="text-center">
                        Sign in to your FedEx DCA account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Email input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="email">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="flex h-10 w-full rounded-md border border-input bg-white/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pl-10"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        {/* Password input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="flex h-10 w-full rounded-md border border-input bg-white/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pl-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white" type="submit">
                            Sign In
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-center text-gray-500 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Button variant="link" className="p-0 text-purple-600 hover:text-purple-700" onClick={() => navigate('/register')}>
                            Register now
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoginPage;
