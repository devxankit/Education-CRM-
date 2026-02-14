import React, { useState, useEffect } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { useNavigate } from 'react-router-dom';
import { Banknote, Users, Clock, FileText, ChevronRight, Download, Plus, RefreshCw } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import { getPayrolls, getPayrollResources, createPayroll, updatePayroll, fetchPayrollRule } from '../services/payroll.api';
import PayrollFormModal from '../../admin/pages/finance/components/payroll/PayrollFormModal';

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Payroll = () => {
    const { user } = useStaffAuth();
    const navigate = useNavigate();
    const [payrollList, setPayrollList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('All');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [payrollResources, setPayrollResources] = useState(null);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [selectedBranchId, setSelectedBranchId] = useState('');
    const [financialYear, setFinancialYear] = useState('2025-26');
    const [employeeType, setEmployeeType] = useState('teacher');

    const fetchPayrollData = async () => {
        setLoading(true);
        try {
            const data = await getPayrolls({ month, year });
            const mapped = (data || []).map(p => ({
                ...p,
                id: p._id,
                name: p.employeeId?.name || [p.employeeId?.firstName, p.employeeId?.lastName].filter(Boolean).join(' ') || 'Unknown',
                role: p.employeeType === 'teacher' ? 'Teacher' : (p.employeeId?.designation || 'Staff'),
                amount: p.netSalary || 0,
                status: p.status === 'paid' ? 'Paid' : 'Pending'
            }));
            setPayrollList(mapped);
        } catch (err) {
            console.error('Failed to fetch payroll', err);
            setPayrollList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayrollData();
    }, [month, year]);

    const handleAddPayroll = async () => {
        const res = await getPayrollResources(financialYear);
        if (!res) {
            alert('Failed to load payroll resources. Please try again.');
            return;
        }
        if (!res.branches?.length) {
            alert('No branches found. Please set up branches in Admin module.');
            return;
        }
        setPayrollResources(res);
        setSelectedBranchId(res.defaultBranchId || res.branches?.[0]?._id || '');
        if (res.defaultFinancialYear) setFinancialYear(res.defaultFinancialYear);
        setIsFormOpen(true);
    };

    const handleExport = () => {
        alert(`Export for ${MONTH_NAMES[month]} ${year} - integrate with export API`);
    };

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

    const payrollData = payrollList || [];
    const totalExpense = payrollData.reduce((acc, curr) => acc + (curr?.amount || 0), 0);
    const pendingCount = payrollData.filter(p => p?.status === 'Pending').length;
    const paidCount = payrollData.filter(p => p?.status === 'Paid').length;

    const filteredList = payrollData.filter(p => {
        if (filterType === 'All') return true;
        if (filterType === 'Teacher') return p?.role === 'Teacher';
        return p?.role !== 'Teacher';
    });

    return (
        <div className="max-w-7xl mx-auto md:pb-6 pb-20 min-h-screen bg-gray-50">
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
                                onClick={handleAddPayroll}
                                className="flex-1 md:flex-none bg-white text-indigo-600 md:bg-indigo-600 md:text-white px-4 py-3 rounded-xl text-sm font-bold shadow-lg md:shadow-md flex items-center justify-center gap-2 hover:bg-white/90 md:hover:bg-indigo-700 transition-all"
                            >
                                <Plus size={18} /> Add Payroll
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-4 md:px-6 -mt-8 md:mt-6 space-y-6 relative z-10">

                {/* Month/Year Selector */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <select
                            value={month}
                            onChange={(e) => setMonth(parseInt(e.target.value))}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-800 bg-white"
                        >
                            {MONTH_NAMES.slice(1).map((m, i) => (
                                <option key={m} value={i + 1}>{m}</option>
                            ))}
                        </select>
                        <select
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-800 bg-white"
                        >
                            {[year, year - 1, year - 2].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={fetchPayrollData}
                        disabled={loading}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <RefreshCw size={18} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <StatCard
                        label="Total Expense"
                        value={totalExpense >= 100000 ? `₹${(totalExpense / 100000).toFixed(2)}L` : `₹${totalExpense.toLocaleString()}`}
                        sub={`${MONTH_NAMES[month]} ${year}`}
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
                        value={paidCount}
                        sub="Paid this month"
                        icon={ArrowUpRight}
                        color="green"
                    />
                    <StatCard
                        label="Staff Count"
                        value={payrollData.length}
                        sub="Payroll entries"
                        icon={Users}
                        color="blue"
                    />
                </div>

                {/* List Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 flex-wrap gap-3">
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
                        {loading ? (
                            <div className="p-8 text-center text-gray-400">
                                <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
                                <p className="text-sm">Loading payroll...</p>
                            </div>
                        ) : filteredList.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                No payroll records for {MONTH_NAMES[month]} {year}
                            </div>
                        ) : (
                            filteredList.map(item => (
                                <div
                                    key={item?.id || item?._id}
                                    onClick={() => navigate(`/staff/payroll/${item?.id || item?._id}`)}
                                    className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-white
                                            ${item?.role === 'Teacher' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                                            {(item?.name || 'N').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{item?.name || 'Unknown'}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] uppercase font-bold text-gray-400">{item?.role || 'Staff'}</span>
                                                <span className="text-xs font-medium text-gray-500">• ₹{(item?.amount || 0).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className={`px-2 py-1 rounded text-[10px] font-bold border ${item?.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                            {item?.status || 'Pending'}
                                        </div>
                                        <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-500" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {isFormOpen && (
                <PayrollFormModal
                    isOpen={isFormOpen}
                    onClose={() => { setIsFormOpen(false); fetchPayrollData(); }}
                    initialData={null}
                    employeeType={employeeType}
                    branchId={selectedBranchId || payrollResources?.defaultBranchId}
                    month={month}
                    year={year}
                    financialYear={financialYear}
                    teachers={payrollResources?.teachers || []}
                    staff={payrollResources?.staff || []}
                    viewMode={false}
                    createPayrollFn={(data) => createPayroll(data).then(r => r?.success ? r.data : null)}
                    updatePayrollFn={(id, data) => updatePayroll(id, data).then(r => r?.success ? r.data : null)}
                    fetchPayrollRuleFn={fetchPayrollRule}
                />
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
