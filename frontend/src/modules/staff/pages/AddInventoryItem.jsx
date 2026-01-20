import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Package } from 'lucide-react';

const AddInventoryItem = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        category: 'Stationery',
        qty: '0',
        reorder: '10',
        location: 'Main Store'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            navigate('/staff/inventory');
        }, 1000);
    };

    return (
        <div className="max-w-xl mx-auto pb-20 md:pb-10 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 py-4 border-b border-gray-200 sticky top-0 z-10 flex items-center gap-3">
                <button onClick={() => navigate('/staff/inventory')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-50 rounded-full">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-lg font-bold text-gray-900">Add Inventory Item</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-5">

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <Package size={16} className="text-indigo-600" /> Item Details
                    </h3>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Item Name</label>
                        <input
                            required
                            type="text"
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                            placeholder="e.g. A4 Paper Sheets (500 count)"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Category</label>
                        <select
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option>Stationery</option>
                            <option>Science Lab</option>
                            <option>Sports</option>
                            <option>Cleaning Supplies</option>
                            <option>Medical</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Initial Quantity</label>
                            <input
                                required
                                type="number"
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                value={formData.qty}
                                onChange={e => setFormData({ ...formData, qty: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Reorder Level</label>
                            <input
                                required
                                type="number"
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                                value={formData.reorder}
                                onChange={e => setFormData({ ...formData, reorder: e.target.value })}
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Alert when stock falls below this.</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">Storage Location</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                            placeholder="e.g. Shelf B2, Main Store"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 md:sticky md:bottom-0 md:rounded-xl z-20">
                    <button type="submit" disabled={isLoading} className="w-full px-8 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2">
                        {isLoading ? 'Saving...' : <><Save size={18} /> Save Item</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddInventoryItem;
