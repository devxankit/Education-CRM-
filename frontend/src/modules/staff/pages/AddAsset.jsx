import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Truck, Monitor, Box, AlertCircle } from 'lucide-react';

const AddAsset = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        type: 'Vehicle',
        code: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        cost: '',
        condition: 'Good',
        status: 'Active',
        assignedTo: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API
        setTimeout(() => {
            setIsLoading(false);
            navigate('/staff/assets');
        }, 1000);
    };

    return (
        <div className="max-w-2xl mx-auto pb-20 md:pb-10 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 py-4 border-b border-gray-200 sticky top-0 z-10 flex items-center gap-3">
                <button onClick={() => navigate('/staff/assets')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-50 rounded-full">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-lg font-bold text-gray-900">Add New Asset</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5">

                {/* 1. Asset Info */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Box size={16} className="text-indigo-600" /> Asset Information
                    </h3>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Asset Name</label>
                        <input
                            required
                            type="text"
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                            placeholder="e.g. School Bus 05 or Dell Latitude 3420"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Asset Type</label>
                            <select
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option>Vehicle</option>
                                <option>IT & Electronics</option>
                                <option>Furniture</option>
                                <option>Equipment</option>
                                <option>Land & Building</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Asset Code / Tag ID</label>
                            <input
                                required
                                type="text"
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                placeholder="e.g. BUS-05"
                                value={formData.code}
                                onChange={e => setFormData({ ...formData, code: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Purchase Date</label>
                            <input
                                required
                                type="date"
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                value={formData.purchaseDate}
                                onChange={e => setFormData({ ...formData, purchaseDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Purchase Cost (₹)</label>
                            <input
                                required
                                type="number"
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                placeholder="0.00"
                                value={formData.cost}
                                onChange={e => setFormData({ ...formData, cost: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* 2. Condition & Status */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <AlertCircle size={16} className="text-indigo-600" /> Condition & Status
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Condition</label>
                            <select
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                value={formData.condition}
                                onChange={e => setFormData({ ...formData, condition: e.target.value })}
                            >
                                <option>Good</option>
                                <option>Needs Repair</option>
                                <option>Damaged</option>
                                <option>Out of Service</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Status</label>
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                {['Active', 'Inactive'].map(s => (
                                    <button
                                        type="button"
                                        key={s}
                                        onClick={() => setFormData({ ...formData, status: s })}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${formData.status === s ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Assignment (Optional) */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-900">Initial Assignment (Optional)</h3>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Assign To</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                            placeholder="Department, Room, or Person Name"
                            value={formData.assignedTo}
                            onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Leave blank to keep unassigned in stock.</p>
                    </div>
                </div>

                {/* Submit */}
                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 md:sticky md:bottom-0 md:rounded-xl z-20">
                    <button type="submit" disabled={isLoading} className="w-full px-8 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                        {isLoading ? 'Saving...' : <><Save size={18} /> Save Asset</>}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AddAsset;
