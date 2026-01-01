import React, { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Briefcase, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
    id: number;
    email: string;
    full_name: string;
    role: string;
    created_at?: string;
}

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, loading: contextLoading } = useUser();
    const [localUser, setLocalUser] = useState<UserProfile | null>(user);
    const [loading, setLoading] = useState(!user);

    useEffect(() => {
        if (user) {
            setLocalUser(user);
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            // ... rest of fetch logic is fine but we prefer context
        };
        fetchProfile();
    }, [user, navigate]);

    const activeUser = user || localUser;
    const isLoading = contextLoading && loading;

    if (isLoading) {
        return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    if (!activeUser) return null;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">User Profile</h2>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl font-bold">
                            {activeUser.full_name?.charAt(0) || activeUser.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <CardTitle className="text-2xl">{activeUser.full_name || 'User'}</CardTitle>
                            <CardDescription>{activeUser.role.toUpperCase()}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <Mail className="w-4 h-4 text-gray-400" />
                                {activeUser.email}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Role</label>
                            <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <Briefcase className="w-4 h-4 text-gray-400" />
                                {activeUser.role}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Account ID</label>
                            <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <User className="w-4 h-4 text-gray-400" />
                                #{activeUser.id}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-500">Joined</label>
                            <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {activeUser.created_at ? new Date(activeUser.created_at).toLocaleDateString() : 'N/A'}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfilePage;
