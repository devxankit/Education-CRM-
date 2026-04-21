import React, { useState, useEffect } from 'react';
import { 
    Settings, 
    Save, 
    IndianRupee, 
    Layers, 
    RotateCcw,
    ShieldCheck,
    Info
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/app/api';

const LibrarySettings = () => {
    const [formData, setFormData] = useState({
        finePerDay: 5,
        maxBooksPerStudent: 3,
        maxBooksPerTeacher: 5,
        returnDaysLimit: 7
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}/library/settings`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                setFormData(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to load settings");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_URL}/library/settings/update`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.success) {
                toast.success("Library settings updated!");
            }
        } catch (error) {
            toast.error("Failed to update settings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Library Settings</h1>
                <p className="text-gray-500 mt-1">Configure global rules and late fee structures</p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Fine Settings */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-amber-50 rounded-2xl">
                                <IndianRupee className="w-6 h-6 text-amber-600" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Fine Rules</h2>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Late Fee (Per Day)</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-3.5 text-gray-400 font-bold group-focus-within:text-indigo-600 transition-colors">₹</span>
                                <input 
                                    type="number"
                                    className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    value={formData.finePerDay}
                                    onChange={(e) => setFormData({ ...formData, finePerDay: e.target.value })}
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
                                <Info className="w-3 h-3" /> This fee applies automatically after the due date.
                            </p>
                        </div>
                    </div>

                    {/* Book Limits */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-indigo-50 rounded-2xl">
                                <Layers className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Borrow Limits</h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Max Books (Student)</label>
                                <input 
                                    type="number"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900"
                                    value={formData.maxBooksPerStudent}
                                    onChange={(e) => setFormData({ ...formData, maxBooksPerStudent: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Max Books (Staff/Teacher)</label>
                                <input 
                                    type="number"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900"
                                    value={formData.maxBooksPerTeacher}
                                    onChange={(e) => setFormData({ ...formData, maxBooksPerTeacher: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Timeline Settings */}
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-green-50 rounded-2xl">
                                <RotateCcw className="w-6 h-6 text-green-600" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Return Cycle</h2>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Default Days Limit</label>
                            <div className="relative group">
                                <input 
                                    type="number"
                                    className="w-full pr-16 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-lg font-bold"
                                    value={formData.returnDaysLimit}
                                    onChange={(e) => setFormData({ ...formData, returnDaysLimit: e.target.value })}
                                />
                                <span className="absolute right-4 top-3.5 text-gray-400 font-semibold">Days</span>
                            </div>
                        </div>
                    </div>

                    {/* Security Settings */}
                    <div className="bg-indigo-600 p-8 rounded-3xl shadow-lg shadow-indigo-100 space-y-6 text-white overflow-hidden relative group">
                        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-lg font-bold">Policy Enforcement</h2>
                        </div>
                        
                        <p className="text-sm text-indigo-100 leading-relaxed">
                            These settings will be applied across all branches of Gwalior Smart Education automatically. 
                            Changes reflect immediately in the issuance and return modules.
                        </p>

                        <div className="pt-2">
                             <div className="flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-3 py-1 rounded-full border border-white/20">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                                Live Sync Active
                             </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-10 py-4 rounded-2xl flex items-center gap-3 shadow-xl shadow-indigo-100 transition-all active:scale-95 disabled:opacity-70"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Save Configuration
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LibrarySettings;
