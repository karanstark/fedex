import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Briefcase, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
    id: number;
    email: string;
    full_name: string;
    role: string;
    created_at: string;
}

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Check for mock mode
            if (token === 'mock-jwt-token-for-demo') {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                } else {
                    // Default mock user
                    setUser({
                        id: 1,
                        email: 'abc@gmail.com',
                        full_name: 'Admin User',
                        role: 'admin',
                        created_at: new Date().toISOString()
                    });
                }
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/api/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }

                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error:', error);
                // In a real app we might logout, but for demo let's keep showing loading or error
                // localStorage.removeItem('token');
                // navigate('/login');
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    if (loading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">User Profile</h2>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl font-bold">
                            {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <CardTitle className="text-2xl">{user.full_name || 'User'}</CardTitle>
                            <CardDescription>{user.role.toUpperCase()}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <Mail className="w-4 h-4 text-gray-400" />
                                {user.email}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Role</label>
                            <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <Briefcase className="w-4 h-4 text-gray-400" />
                                {user.role}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Account ID</label>
                            <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <User className="w-4 h-4 text-gray-400" />
                                #{user.id}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Joined</label>
                            <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {new Date(user.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfilePage;
