import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';

const CreateCasePage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        customer_name: '',
        amount: '',
        overdue_days: '',
        priority: 'Medium',
        status: 'open'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // const token = localStorage.getItem('token');
            // Assuming the backend endpoint is public or token is attached if needed
            // But cases.py didn't enforce auth in previous view.

            const payload = {
                ...formData,
                amount: parseFloat(formData.amount),
                overdue_days: parseInt(formData.overdue_days),
                // dca_assigned: null,
                // recovery_probability: null // Will be calculated by backend/ML if implemented
            };

            const response = await fetch('http://localhost:8000/api/cases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // Uncomment if backend requires it
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Failed to create case');
            }

            // Success
            navigate('/cases');
        } catch (error) {
            console.error('Error creating case:', error);
            alert('Failed to create case. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/cases')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Case</h2>
                    <p className="text-gray-500 dark:text-gray-400">Enter details manually or upload in bulk</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Case Details</CardTitle>
                    <CardDescription>Enter the debt case information below</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="customer_name" className="text-sm font-medium">Customer Name</label>
                            <input
                                id="customer_name"
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent"
                                placeholder="e.g. Acme Corp"
                                value={formData.customer_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="amount" className="text-sm font-medium">Amount ($)</label>
                                <input
                                    id="amount"
                                    type="number"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent"
                                    placeholder="0.00"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="overdue_days" className="text-sm font-medium">Overdue Days</label>
                                <input
                                    id="overdue_days"
                                    type="number"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent"
                                    placeholder="Days"
                                    value={formData.overdue_days}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                            <select
                                id="priority"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Case'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="text-center">
                    <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                        <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Bulk Upload</h3>
                    <p className="text-sm text-gray-500 mb-4 max-w-xs mx-auto">Upload a CSV file to create multiple cases at once.</p>
                    <Button variant="outline">Upload CSV</Button>
                </div>
            </div>
        </div>
    );
};

export default CreateCasePage;
