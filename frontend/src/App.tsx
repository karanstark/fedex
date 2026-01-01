import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ParticleHero from './components/ui/particle-hero';
import DashboardLayout from './components/DashboardLayout';
import CaseManagement from './components/CaseManagement';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import CreateCasePage from './components/CreateCasePage';
import SettingsPage from './components/SettingsPage';
import { UserProvider } from './context/UserContext';
import './index.css';

function App() {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    {/* Landing Page */}
                    <Route path="/" element={<ParticleHero />} />

                    {/* Authentication */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Dashboard Routes */}
                    <Route path="/dashboard" element={
                        <DashboardLayout>
                            <AnalyticsDashboard />
                        </DashboardLayout>
                    } />
                    <Route path="/cases" element={
                        <DashboardLayout>
                            <CaseManagement />
                        </DashboardLayout>
                    } />
                    <Route path="/cases/new" element={
                        <DashboardLayout>
                            <CreateCasePage />
                        </DashboardLayout>
                    } />
                    <Route path="/settings" element={
                        <DashboardLayout>
                            <SettingsPage />
                        </DashboardLayout>
                    } />
                    <Route path="/analytics" element={
                        <DashboardLayout>
                            <AnalyticsDashboard />
                        </DashboardLayout>
                    } />
                    <Route path="/profile" element={
                        <DashboardLayout>
                            <ProfilePage />
                        </DashboardLayout>
                    } />

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;
