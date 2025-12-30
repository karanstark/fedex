import React from 'react';
import { AnimeNavBar } from './ui/anime-navbar';
import { LayoutDashboard, Users, BarChart3, Settings, Briefcase, PlusCircle } from 'lucide-react';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const navItems = [
        { name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
        { name: "Cases", url: "/cases", icon: Briefcase },
        { name: "New Case", url: "/cases/new", icon: PlusCircle },
        { name: "Analytics", url: "/analytics", icon: BarChart3 },
        { name: "Settings", url: "/settings", icon: Settings },
        { name: "Profile", url: "/profile", icon: Users },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Top Navigation */}
            <AnimeNavBar items={navItems} />

            {/* Main Content Area */}
            <div className="pt-32 px-4 md:px-8 pb-10">
                <main className="max-w-7xl mx-auto">
                    {children}
                </main>
            </div>

            {/* Background Gradient for dark mode */}
            <div className="fixed inset-0 -z-10 pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-[100px]" />
            </div>
        </div>
    );
};

export default DashboardLayout;
