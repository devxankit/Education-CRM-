import React, { useState, useEffect } from 'react';
import { 
    BookOpen, 
    BookCheck, 
    BookX, 
    Clock, 
    IndianRupee,
    TrendingUp,
    TrendingDown,
    AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/app/api';

const LibraryDashboard = () => {
    const [stats, setStats] = useState({
        totalBooks: 0,
        issuedBooks: 0,
        returnedBooks: 0,
        overdueBooks: 0,
        pendingFine: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/library/dashboard/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch library stats");
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { 
            title: 'Total Books', 
            value: stats.totalBooks, 
            icon: BookOpen, 
            color: 'blue',
            trend: '+12% from last month'
        },
        { 
            title: 'Issued Books', 
            value: stats.issuedBooks, 
            icon: BookCheck, 
            color: 'purple',
            trend: '+5% from last month'
        },
        { 
            title: 'Returned Books', 
            value: stats.returnedBooks, 
            icon: BookX, 
            color: 'green',
            trend: '+8% from last month'
        },
        { 
            title: 'Overdue Books', 
            value: stats.overdueBooks, 
            icon: Clock, 
            color: 'red',
            trend: '-2% from last month'
        }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Library Dashboard</h1>
                    <p className="text-gray-500 mt-1">Gwalior Smart Education Library Overview</p>
                </div>
                <div className="bg-indigo-50 px-4 py-2 rounded-xl flex items-center gap-3 border border-indigo-100 shadow-sm">
                    <IndianRupee className="w-5 h-5 text-indigo-600" />
                    <div>
                        <p className="text-xs text-indigo-600 font-semibold uppercase">Pending Fines</p>
                        <p className="text-lg font-bold text-indigo-900">₹{stats.pendingFine}</p>
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div 
                        key={index} 
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                    >
                        <div className="flex justify-between items-start">
                            <div className={`p-3 rounded-xl bg-${stat.color}-50 group-hover:scale-110 transition-transform`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                            </div>
                            {stat.value > 0 ? (
                                <TrendingUp className="w-4 h-4 text-green-500" />
                            ) : (
                                <TrendingDown className="w-4 h-4 text-red-500" />
                            )}
                        </div>
                        <div className="mt-4">
                            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-50">
                            <span className="text-xs text-gray-400 font-medium">{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Library Summary</h2>
                        <button className="text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                            View Detailed Report
                        </button>
                    </div>
                    <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-10 h-10 text-gray-300" />
                        </div>
                        <div>
                            <h4 className="text-gray-900 font-bold">Activity Visualization Coming Soon</h4>
                            <p className="text-gray-500 text-sm mt-1 max-w-xs">
                                We are working on interactive charts to show book circulation trends.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl text-white shadow-lg shadow-indigo-200">
                        <h3 className="text-lg font-bold mb-4">Quick Insights</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-indigo-100 text-sm">Active Members</span>
                                <span className="font-bold">1,240</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-indigo-100 text-sm">Most Borrowed</span>
                                <span className="font-bold">Physics Vol I</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-indigo-100 text-sm">New Books (This Week)</span>
                                <span className="font-bold">24</span>
                            </div>
                        </div>
                        <button className="w-full mt-6 bg-white/10 hover:bg-white/20 py-3 rounded-xl font-bold transition-all text-sm backdrop-blur-sm">
                            Manage Library Members
                        </button>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-900 font-bold mb-4">Urgent Actions</h3>
                        <div className="space-y-3">
                            {stats.overdueBooks > 0 && (
                                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                                    <Clock className="w-5 h-5 text-red-500" />
                                    <div>
                                        <p className="text-xs text-red-900 font-bold">{stats.overdueBooks} Books Overdue</p>
                                        <p className="text-[10px] text-red-600">Send notifications to students</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                <AlertCircle className="w-5 h-5 text-amber-500" />
                                <div>
                                    <p className="text-xs text-amber-900 font-bold">Low Stock Warning</p>
                                    <p className="text-[10px] text-amber-600">5 books are below minimum quantity</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LibraryDashboard;
