import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, ArrowUpDown, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Case {
    id: string;
    customerName: string;
    amount: number;
    overdueDays: number;
    status: string;
    priority: string;
    dcaAssigned: string;
    recoveryProbability: number;
    createdAt: string;
}

const CaseManagement: React.FC = () => {
    const navigate = useNavigate();
    const [cases, setCases] = useState<Case[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPriority, setFilterPriority] = useState('all');

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch cases from API
        fetchCases();
    }, []);

    const fetchCases = async () => {
        setIsLoading(true);
        try {
            // Attempt to fetch from backend
            const response = await fetch('http://localhost:8000/api/cases');
            if (!response.ok) {
                console.warn('Backend not reachable or returned error, falling back to mock data');
                setCases(mockCases);
            } else {
                const data = await response.json();
                if (Array.isArray(data)) {
                    setCases(data);
                } else {
                    setCases(mockCases);
                }
            }
        } catch (error) {
            console.warn('Network error, falling back to mock data:', error);
            setCases(mockCases);
        } finally {
            setIsLoading(false);
        }
    };



    const filteredCases = cases.filter(c => {
        const matchesSearch = (c.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.id || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPriority = filterPriority === 'all' || (c.priority || '').toLowerCase() === filterPriority;
        return matchesSearch && matchesPriority;
    });

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Case Management</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track all DCA cases</p>
                </div>
                <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => navigate('/cases/new')}
                >
                    Create New Case
                </Button>
            </div>

            {/* Filters */}
            <Card className="border-white/20 bg-white/50 dark:bg-black/40 backdrop-blur-md shadow-xl">
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-purple-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by customer name or case ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white/50 dark:bg-white/5 transition-all"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white/50 dark:bg-white/5 transition-all text-sm"
                            >
                                <option value="all">All Priorities</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                            <Button variant="outline" size="icon" className="rounded-xl border-gray-200 dark:border-white/10 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                                <ArrowUpDown className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Cases Table */}
            <Card className="border-white/20 bg-white/50 dark:bg-black/40 backdrop-blur-md shadow-xl overflow-hidden">
                <CardHeader>
                    <CardTitle>Active Cases ({filteredCases.length})</CardTitle>
                    <CardDescription>Overview of all debt collection cases</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-white/10">
                                        <th className="text-left py-4 px-4 font-semibold text-sm text-gray-500 dark:text-gray-400">Case ID</th>
                                        <th className="text-left py-4 px-4 font-semibold text-sm text-gray-500 dark:text-gray-400">Customer</th>
                                        <th className="text-left py-4 px-4 font-semibold text-sm text-gray-500 dark:text-gray-400">Amount</th>
                                        <th className="text-left py-4 px-4 font-semibold text-sm text-gray-500 dark:text-gray-400">Overdue</th>
                                        <th className="text-left py-4 px-4 font-semibold text-sm text-gray-500 dark:text-gray-400">Priority</th>
                                        <th className="text-left py-4 px-4 font-semibold text-sm text-gray-500 dark:text-gray-400">Status</th>
                                        <th className="text-left py-4 px-4 font-semibold text-sm text-gray-500 dark:text-gray-400">DCA</th>
                                        <th className="text-left py-4 px-4 font-semibold text-sm text-gray-500 dark:text-gray-400">Recovery %</th>
                                        <th className="text-left py-4 px-4 font-semibold text-sm text-gray-500 dark:text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                    {filteredCases.map((caseItem) => (
                                        <tr
                                            key={caseItem.id}
                                            className="group hover:bg-purple-50/50 dark:hover:bg-purple-900/10 transition-all duration-200"
                                        >
                                            <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">{caseItem.id}</td>
                                            <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">{caseItem.customerName}</td>
                                            <td className="py-4 px-4 text-sm font-bold text-gray-900 dark:text-white">${caseItem.amount.toLocaleString()}</td>
                                            <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">{caseItem.overdueDays} days</td>
                                            <td className="py-4 px-4">
                                                <Badge className={`${caseItem.priority === 'High' ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400' :
                                                    caseItem.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                        'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                                    } border-0`}>
                                                    {caseItem.priority}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Badge variant="outline" className="border-gray-200 dark:border-gray-700">
                                                    {caseItem.status.replace('_', ' ')}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-gray-700 dark:text-gray-300">{caseItem.dcaAssigned}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-full rounded-full animate-pulse"
                                                            style={{ width: `${caseItem.recoveryProbability * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                                        {(caseItem.recoveryProbability * 100).toFixed(0)}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <Button variant="ghost" size="sm" className="hover:bg-white hover:shadow-sm dark:hover:bg-white/10 rounded-full w-8 h-8 p-0">
                                                    <Eye className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

// Mock data for demo
const mockCases: Case[] = [
    {
        id: 'CASE-001',
        customerName: 'Acme Corporation',
        amount: 45000,
        overdueDays: 67,
        status: 'in_progress',
        priority: 'High',
        dcaAssigned: 'DCA Alpha',
        recoveryProbability: 0.78,
        createdAt: '2024-01-15',
    },
    {
        id: 'CASE-002',
        customerName: 'TechStart Inc',
        amount: 23000,
        overdueDays: 34,
        status: 'open',
        priority: 'Medium',
        dcaAssigned: 'DCA Beta',
        recoveryProbability: 0.65,
        createdAt: '2024-02-10',
    },
    {
        id: 'CASE-003',
        customerName: 'Global Logistics',
        amount: 89000,
        overdueDays: 102,
        status: 'in_progress',
        priority: 'High',
        dcaAssigned: 'DCA Alpha',
        recoveryProbability: 0.45,
        createdAt: '2023-12-05',
    },
    {
        id: 'CASE-004',
        customerName: 'Retail Solutions',
        amount: 12000,
        overdueDays: 15,
        status: 'open',
        priority: 'Low',
        dcaAssigned: 'DCA Gamma',
        recoveryProbability: 0.92,
        createdAt: '2024-03-01',
    },
    {
        id: 'CASE-005',
        customerName: 'Manufacturing Co',
        amount: 56000,
        overdueDays: 78,
        status: 'resolved',
        priority: 'Medium',
        dcaAssigned: 'DCA Beta',
        recoveryProbability: 0.88,
        createdAt: '2024-01-20',
    },
];

export default CaseManagement;
