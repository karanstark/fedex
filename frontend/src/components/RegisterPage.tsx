import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Briefcase, ArrowRight } from 'lucide-react';
import ShaderBackground from './ui/shader-background';

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('agent');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password, // Note: In a real app, validate password strength
                    full_name: name,
                    role
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Registration failed');
            }

            // Success
            alert('Registration successful! Please sign in.');
            navigate('/login');
        } catch (error: any) {
            console.error('Registration error:', error);
            alert(error.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <ShaderBackground />

            <Card className="w-full max-w-md relative z-10 border-white/20 bg-white/90 dark:bg-black/50 backdrop-blur-md shadow-xl">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                    <CardDescription className="text-center">
                        Join the FedEx DCA Management platform
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="name">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    className="flex h-10 w-full rounded-md border border-input bg-white/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pl-10"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
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
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="role">
                                Role
                            </label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                <select
                                    id="role"
                                    className="flex h-10 w-full rounded-md border border-input bg-white/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pl-10"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="agent">Collection Agent</option>
                                    <option value="manager">DCA Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Create a password"
                                    className="flex h-10 w-full rounded-md border border-input bg-white/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pl-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white" type="submit">
                            Create Account
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-center text-gray-500 dark:text-gray-400">
                        Already have an account?{' '}
                        <Button variant="link" className="p-0 text-pink-600 hover:text-pink-700" onClick={() => navigate('/login')}>
                            Sign in
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default RegisterPage;
