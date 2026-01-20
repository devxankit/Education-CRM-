import React, { useState } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MapPin, Phone, Briefcase, MoreHorizontal } from 'lucide-react';

const MOCK_VENDORS = [
    { id: 'V-001', name: 'City Fuels', service: 'Transport Fuel', contact: 'Rajesh', phone: '9876541111', status: 'Active', due: 12500 },
    { id: 'V-002', name: 'Jio Fiber Business', service: 'Internet', contact: 'Support', phone: '1800-123-456', status: 'Active', due: 4500 },
    { id: 'V-003', name: 'Raj Stationery', service: 'Supplies', contact: 'Mohan', phone: '9988776622', status: 'Active', due: 0 },
    { id: 'V-004', name: 'AutoFix Garage', service: 'Maintenance', contact: 'Sardar Ji', phone: '8877665544', status: 'Active', due: 8500 },
];

const Vendors = () => {
    const { user } = useStaffAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const canAdd = [STAFF_ROLES.ACCOUNTS, STAFF_ROLES.ADMIN].includes(user?.role);

    const filteredVendors = MOCK_VENDORS.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.service.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="max-w-7xl mx-auto md:pb-6 pb-20 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 pt-5 pb-3 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Vendor Directory</h1>
                        <p className="text-xs text-gray-500">Service providers & suppliers</p>
                    </div>
                    {canAdd && (
                        <button
                            onClick={() => { }} // navigate('/staff/vendors/new') but keeping simplified for now
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
                        >
                            <Plus size={16} /> Add Vendor
                        </button>
                    )}
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search vendors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>

            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVendors.length > 0 ? (
                    filteredVendors.map(vendor => (
                        <div key={vendor.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                        {vendor.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm">{vendor.name}</h3>
                                        <p className="text-xs text-gray-500">{vendor.service}</p>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18} /></button>
                            </div>

                            <div className="space-y-2 text-xs">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone size={14} className="text-gray-400" /> {vendor.phone} ({vendor.contact})
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-2">
                                    <span className="text-gray-500 font-bold">Outstanding</span>
                                    <span className={`font-bold ${vendor.due > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                                        ₹{vendor.due.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-gray-400 font-medium text-sm">No vendors found.</div>
                )}
            </div>
        </div>
    );
};

export default Vendors;
