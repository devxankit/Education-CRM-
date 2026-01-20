import React, { useState } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { useNavigate } from 'react-router-dom';
import { Banknote, Users, Clock, AlertCircle, FileText, ChevronRight, Download, Filter, Plus } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

// --- MOCK PAYROLL DATA ---
const MOCK_PAYROLL = [
    { id: 'PAY-001', name: 'Suresh Kumar', role: 'Teacher', amount: 45000, date: '2024-10-01', status: 'Paid' },
    { id: 'PAY-002', name: 'Meera Iyer', role: 'Teacher', amount: 48000, date: '2024-10-01', status: 'Pending' },
    { id: 'PAY-003', name: 'Ramesh Singh', role: 'Driver', amount: 22000, date: '2024-10-05', status: 'Paid' },
    { id: 'PAY-004', name: 'Sunita Sharma', role: 'Clerk', amount: 25000, date: '2024-10-05', status: 'Pending' },
    { id: 'PAY-005', name: 'Rajesh Verma', role: 'Teacher', amount: 42000, date: '2024-10-01', status: 'Paid' },
];

const Payroll = () => {
    const { user } = useStaffAuth();
    const navigate = useNavigate();
    const [filterType, setFilterType] = useState('All');
    const [showRunModal, setShowRunModal] = useState(false);

    const handleExport = () => {
        alert("Downloading Payroll Report for October 2024...");
    };

    // Access Check: ACCOUNTS, ADMIN, DATA_ENTRY (View Only)
    if (![STAFF_ROLES.ACCOUNTS, STAFF_ROLES.ADMIN, STAFF_ROLES.DATA_ENTRY].includes(user?.role)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-gray-50">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
                    <Banknote size={32} className="text-red-400" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Restricted Access</h2>
                <p className="text-sm text-gray-500 mt-2 max-w-xs">You do not have permission to view Payroll.</p>
            </div>
        );
    }

    const canManagePayroll = [STAFF_ROLES.ACCOUNTS, STAFF_ROLES.ADMIN].includes(user?.role);

    const totalExpense = MOCK_PAYROLL.reduce((acc, curr) => acc + curr.amount, 0);
    const pendingCount = MOCK_PAYROLL.filter(p => p.status === 'Pending').length;

    const filteredList = MOCK_PAYROLL.filter(p => {
        if (filterType === 'All') return true;
        if (filterType === 'Teacher') return p.role === 'Teacher';
        return p.role !== 'Teacher';
    });

    return (
        <div className="max-w-7xl mx-auto md:pb-6 pb-20 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-indigo-600 px-5 pt-8 pb-16 rounded-b-[2.5rem] md:rounded-none md:pb-6 md:pt-6 md:bg-white md:border-b md:border-gray-200 relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-white md:text-gray-900">Payroll Management</h1>
                        <p className="text-xs text-indigo-100 md:text-gray-500">Salary disbursement & history</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                        <button
                            onClick={handleExport}
                            className="flex-1 md:flex-none bg-white/20 text-white md:bg-white md:text-indigo-600 border border-white/30 md:border-gray-200 px-4 py-3 rounded-xl text-sm font-bold backdrop-blur-sm md:backdrop-blur-none flex items-center justify-center gap-2 hover:bg-white/30 md:hover:bg-gray-50 transition-all"
                        >
                            <Download size={18} /> Export
                        </button>
                        {canManagePayroll && (
                            <button
                                onClick={() => setShowRunModal(true)}
                                className="flex-1 md:flex-none bg-white text-indigo-600 md:bg-indigo-600 md:text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg md:shadow-md flex items-center justify-center gap-2 hover:bg-white/90 md:hover:bg-indigo-700 transition-all"
                            >
                                <Plus size={18} /> Run Payroll
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-4 md:px-6 -mt-8 md:mt-6 space-y-6 relative z-10">

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <StatCard
                        label="Total Expense"
                        value={`₹${(totalExpense / 100000).toFixed(2)}L`}
                        sub="For Oct 2024"
                        icon={Banknote}
                        color="indigo"
                    />
                    <StatCard
                        label="Pending Salaries"
                        value={pendingCount}
                        sub="To be disbursed"
                        icon={Clock}
                        color="amber"
                    />
                    <StatCard
                        label="Processed"
                        value={MOCK_PAYROLL.length - pendingCount}
                        sub="Paid this month"
                        icon={ArrowUpRight}
                        color="green"
                    />
                    <StatCard
                        label="Staff Count"
                        value={MOCK_PAYROLL.length}
                        sub="Active Payroll"
                        icon={Users}
                        color="blue"
                    />
                </div>

                {/* List Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <FileText size={16} className="text-indigo-600" /> Salary Register
                        </h2>
                        <div className="flex p-1 bg-white border border-gray-200 rounded-lg">
                            {['All', 'Teacher', 'Staff'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${filterType === type ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {filteredList.map(item => (
                            <div
                                key={item.id}
                                onClick={() => navigate(`/staff/payroll/${item.id}`)}
                                className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-white
                                        ${item.role === 'Teacher' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {item.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{item.name}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] uppercase font-bold text-gray-400">{item.role}</span>
                                            <span className="text-xs font-medium text-gray-500">• ₹{item.amount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className={`px-2 py-1 rounded text-[10px] font-bold border ${item.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                                        }`}>
                                        {item.status}
                                    </div>
                                    <button className="p-2 text-gray-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Run Payroll Modal */}
            {showRunModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-sm rounded-xl p-6 shadow-2xl animate-scale-up">
                        <div className="flex items-center gap-3 text-indigo-600 mb-4">
                            <Banknote size={24} />
                            <h3 className="text-lg font-bold text-gray-900">Run Payroll</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            Process salaries for <strong>October 2024</strong>?
                            <br /><br />
                            This will generate <strong>{pendingCount}</strong> pending payslips and notify staff.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowRunModal(false)} className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button
                                onClick={() => { setShowRunModal(false); alert('Payroll Processed!'); }}
                                className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-md"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ label, value, sub, icon: Icon, color }) => {
    const colors = {
        indigo: 'bg-indigo-50 text-indigo-600',
        amber: 'bg-amber-50 text-amber-600',
        green: 'bg-green-50 text-green-600',
        blue: 'bg-blue-50 text-blue-600'
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
                <Icon size={16} />
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
                <p className="text-xs text-gray-500 font-medium truncate">{label}</p>
            </div>
        </div>
    );
};

export default Payroll;
