import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';

interface AnalyticsData {
    ageingBuckets: { label: string; count: number; amount: number }[];
    recoveryRate: { month: string; rate: number }[];
    dcaPerformance: { name: string; cases: number; recoveryRate: number; avgDays: number }[];
    slaBreaches: { total: number; critical: number; percentage: number };
    kpis: {
        totalCases: number;
        totalAmount: number;
        avgRecoveryRate: number;
        avgResolutionDays: number;
    };
}

const AnalyticsDashboard: React.FC = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData>(mockAnalytics);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/analytics/summary');
            if (!response.ok) throw new Error('Failed to fetch analytics');
            const data = await response.json();
            setAnalytics(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            // Use mock data
            setAnalytics(mockAnalytics);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Key performance indicators and insights</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-purple-600">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Cases</CardDescription>
                        <CardTitle className="text-3xl">{analytics.kpis.totalCases}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-green-600">
                            <TrendingUp className="w-4 h-4" />
                            <span>+12% from last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-pink-600">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Amount</CardDescription>
                        <CardTitle className="text-3xl">${(analytics.kpis.totalAmount / 1000).toFixed(0)}K</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-green-600">
                            <DollarSign className="w-4 h-4" />
                            <span>+8% from last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-600">
                    <CardHeader className="pb-2">
                        <CardDescription>Avg Recovery Rate</CardDescription>
                        <CardTitle className="text-3xl">{analytics.kpis.avgRecoveryRate}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-green-600">
                            <TrendingUp className="w-4 h-4" />
                            <span>+5% from last month</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange-600">
                    <CardHeader className="pb-2">
                        <CardDescription>Avg Resolution Time</CardDescription>
                        <CardTitle className="text-3xl">{analytics.kpis.avgResolutionDays}d</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-red-600">
                            <TrendingDown className="w-4 h-4" />
                            <span>-3 days from last month</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ageing Buckets */}
                <Card>
                    <CardHeader>
                        <CardTitle>Overdue Ageing Buckets</CardTitle>
                        <CardDescription>Distribution of cases by overdue period</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics.ageingBuckets.map((bucket, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{bucket.label}</span>
                                        <div className="text-right">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{bucket.count} cases</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">${(bucket.amount / 1000).toFixed(0)}K</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                        <div
                                            className={`h-3 rounded-full ${index === 0 ? 'bg-green-500' :
                                                index === 1 ? 'bg-yellow-500' :
                                                    index === 2 ? 'bg-orange-500' :
                                                        'bg-red-500'
                                                }`}
                                            style={{ width: `${(bucket.count / analytics.kpis.totalCases) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* SLA Breaches */}
                <Card>
                    <CardHeader>
                        <CardTitle>SLA Breach Summary</CardTitle>
                        <CardDescription>Service level agreement compliance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex items-center justify-center">
                                <div className="relative w-40 h-40">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="none"
                                            className="text-gray-200 dark:text-gray-700"
                                        />
                                        <circle
                                            cx="80"
                                            cy="80"
                                            r="70"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="none"
                                            strokeDasharray={`${2 * Math.PI * 70}`}
                                            strokeDashoffset={`${2 * Math.PI * 70 * (1 - analytics.slaBreaches.percentage / 100)}`}
                                            className="text-red-500"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.slaBreaches.percentage}%</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">Breached</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                    <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-red-600">{analytics.slaBreaches.critical}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">Critical Breaches</p>
                                </div>
                                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-green-600">{analytics.kpis.totalCases - analytics.slaBreaches.total}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">On Track</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* DCA Performance Comparison */}
            <Card>
                <CardHeader>
                    <CardTitle>DCA Performance Comparison</CardTitle>
                    <CardDescription>Comparative analysis of debt collection agencies</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">DCA Name</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Active Cases</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Recovery Rate</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Avg Resolution Days</th>
                                    <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700 dark:text-gray-300">Performance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.dcaPerformance.map((dca, index) => (
                                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{dca.name}</td>
                                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{dca.cases}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[100px]">
                                                    <div
                                                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                                                        style={{ width: `${dca.recoveryRate}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">{dca.recoveryRate}%</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">{dca.avgDays} days</td>
                                        <td className="py-3 px-4">
                                            <Badge variant={dca.recoveryRate >= 75 ? 'success' : dca.recoveryRate >= 60 ? 'warning' : 'destructive'}>
                                                {dca.recoveryRate >= 75 ? 'Excellent' : dca.recoveryRate >= 60 ? 'Good' : 'Needs Improvement'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Mock analytics data
const mockAnalytics: AnalyticsData = {
    kpis: {
        totalCases: 247,
        totalAmount: 5420000,
        avgRecoveryRate: 72,
        avgResolutionDays: 45,
    },
    ageingBuckets: [
        { label: '0-30 days', count: 89, amount: 1250000 },
        { label: '31-60 days', count: 67, amount: 1890000 },
        { label: '61-90 days', count: 54, amount: 1560000 },
        { label: '90+ days', count: 37, amount: 720000 },
    ],
    recoveryRate: [
        { month: 'Jan', rate: 68 },
        { month: 'Feb', rate: 71 },
        { month: 'Mar', rate: 72 },
    ],
    dcaPerformance: [
        { name: 'DCA Alpha', cases: 89, recoveryRate: 78, avgDays: 38 },
        { name: 'DCA Beta', cases: 76, recoveryRate: 72, avgDays: 42 },
        { name: 'DCA Gamma', cases: 82, recoveryRate: 65, avgDays: 56 },
    ],
    slaBreaches: {
        total: 42,
        critical: 15,
        percentage: 17,
    },
};

export default AnalyticsDashboard;
