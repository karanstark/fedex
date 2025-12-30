import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Shield, User, Moon, Sun } from 'lucide-react';

const SettingsPage: React.FC = () => {
    const [notifications, setNotifications] = useState(true);
    // Initialize dark mode from localStorage or system preference
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark') ||
                localStorage.getItem('theme') === 'dark';
        }
        return false;
    });

    // Effect to apply dark mode class
    React.useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account preferences and application settings</p>
            </div>

            <div className="grid gap-6">
                {/* Account Settings */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-purple-600" />
                            <CardTitle>Account Information</CardTitle>
                        </div>
                        <CardDescription>Update your personal details and role</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Display Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
                                    defaultValue="Admin User"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
                                    defaultValue="abc@gmail.com"
                                    disabled
                                />
                            </div>
                        </div>
                        <Button variant="outline" className="mt-2">Update Profile</Button>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-blue-600" />
                            <CardTitle>Notifications</CardTitle>
                        </div>
                        <CardDescription>Configure how you receive alerts and updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <h4 className="font-medium">Email Alerts</h4>
                                <p className="text-sm text-gray-500">Receive daily summaries and critical breach alerts</p>
                            </div>
                            <div
                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${notifications ? 'bg-green-500' : 'bg-gray-300'}`}
                                onClick={() => setNotifications(!notifications)}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Security */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-red-600" />
                            <CardTitle>Security</CardTitle>
                        </div>
                        <CardDescription>Manage your password and authentication methods</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button variant="outline">Change Password</Button>
                        <Button variant="outline" className="ml-4 text-red-600 hover:text-red-700 hover:bg-red-50">Enable 2FA</Button>
                    </CardContent>
                </Card>

                {/* Appearance */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            {darkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-orange-500" />}
                            <CardTitle>Appearance</CardTitle>
                        </div>
                        <CardDescription>Customize the interface theme</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <Button
                                variant={!darkMode ? 'default' : 'outline'}
                                onClick={() => setDarkMode(false)}
                                className={!darkMode ? 'bg-gray-900 text-white' : ''}
                            >
                                <Sun className="w-4 h-4 mr-2" /> Light
                            </Button>
                            <Button
                                variant={darkMode ? 'default' : 'outline'}
                                onClick={() => setDarkMode(true)}
                                className={darkMode ? 'bg-gray-900 text-white' : ''}
                            >
                                <Moon className="w-4 h-4 mr-2" /> Dark
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SettingsPage;
