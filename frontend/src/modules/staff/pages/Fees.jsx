
import React, { useState } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { Search, Filter, AlertCircle, CheckCircle, ChevronRight, CreditCard, Clock, Download, ArrowLeft, Wallet, FileText } from 'lucide-react';
import { useStaffStore } from '../../../store/staffStore';

const Fees = () => {
    const { user } = useStaffAuth();
    const students = useStaffStore(state => state.students) || [];
    const canEdit = user?.role === STAFF_ROLES.ACCOUNTS || user?.role === STAFF_ROLES.ADMIN;

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Filter Logic
    const filteredFees = students.filter(student => {
        const name = student?.name || '';
        const id = student?.id || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || student?.feeStatus === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-emerald-100 text-emerald-700';
            case 'Partial': return 'bg-amber-100 text-amber-700';
            case 'Overdue': return 'bg-red-100 text-red-700';
            case 'Due': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="max-w-md mx-auto pb-24 md:pb-6 relative min-h-screen p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Fees</h1>
                    <p className="text-xs text-gray-500">Collection Management</p>
                </div>
            </div>

            {/* Compact Search & Filter */}
            <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search Student..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="relative">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="appearance-none bg-white border border-gray-200 rounded-xl py-2.5 pl-3 pr-8 text-sm font-bold text-gray-600 outline-none w-28"
                    >
                        <option value="All">Status</option>
                        <option value="Paid">Paid</option>
                        <option value="Partial">Partial</option>
                        <option value="Due">Due</option>
                        <option value="Overdue">Overdue</option>
                    </select>
                    <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                </div>
            </div>

            {/* List View */}
            <div className="space-y-3">
                {filteredFees.map((student) => (
                    <div
                        key={student.id}
                        onClick={() => setSelectedStudent(student)}
                        className={`${selectedStudent?.id === student.id ? 'bg-indigo-50 ring-1 ring-indigo-200' : 'bg-white'} p-4 rounded-xl border border-gray-200 shadow-sm active:scale-[0.99] transition-all cursor-pointer flex justify-between items-center`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs">
                                {(student?.name || 'N').charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-900">{student?.name || 'Unknown'}</h3>
                                <p className="text-[10px] text-gray-500">{student?.id || 'N/A'} • {student?.class || 'N/A'}</p>
                                <div className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${getStatusColor(student?.feeStatus || 'Due')}`}>
                                    {student?.feeStatus || 'Due'}
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-[10px] text-gray-400 font-medium uppercase mb-0.5">Pending</p>
                            <p className={`text-sm font-bold ${student.fees?.pending > 0 ? 'text-gray-900' : 'text-emerald-600'}`}>
                                ₹{(student.fees?.pending || 0).toLocaleString()}
                            </p>
                            <ChevronRight size={16} className="text-gray-300 ml-auto mt-1" />
                        </div>
                    </div>
                ))}

                {filteredFees.length === 0 && (
                    <div className="text-center py-10 text-gray-400 text-sm">
                        No students found
                    </div>
                )}
            </div>

            {/* Full Screen Modal */}
            {selectedStudent && (
                <FeeDetailModal
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                    canEdit={canEdit}
                />
            )}
        </div>
    );
};

// --- SUB-COMPONENTS ---

const FeeDetailModal = ({ student, onClose, canEdit }) => {
    return (
        <div className="fixed inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-bottom-5 duration-200">
            {/* Modal Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white shadow-sm shrink-0">
                <button onClick={onClose} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <div className="flex-1">
                    <h2 className="text-base font-bold text-gray-900 leading-none">{student?.name || 'Unknown'}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{student?.id || 'N/A'}</p>
                </div>
                <div className={`text-xs font-bold px-2 py-1 rounded bg-gray-100`}>
                    {student?.class || 'N/A'}
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 pb-24">
                {/* Summary Card */}
                <div className="bg-slate-900 text-white rounded-2xl p-5 mb-6 shadow-lg shadow-slate-200">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Outstanding</p>
                    <h1 className="text-3xl font-bold mb-4">₹{(student?.fees?.pending || 0).toLocaleString()}</h1>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-300">
                            <span>Paid</span>
                            <span className="text-emerald-400 font-bold">₹{(student?.fees?.paid || 0).toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5">
                            <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${((student?.fees?.paid || 0) / (student?.fees?.total || 1)) * 100}%` }}></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500">
                            <span>0%</span>
                            <span>Total Due: ₹{(student?.fees?.total || 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Installments List */}
                <h3 className="text-sm font-bold text-gray-900 mb-3 ml-1">Installments</h3>
                <div className="space-y-3">
                    {(student?.installments || []).map((inst) => (
                        <InstallmentCard key={inst?.id || Math.random()} installment={inst} canEdit={canEdit} />
                    ))}
                </div>
            </div>

            {/* Bottom Action Bar (Context Aware) */}
            {canEdit && (student?.fees?.pending || 0) > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
                    <button onClick={() => alert('Collecting Fees Logic')} className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 transition-transform">
                        <Wallet size={18} /> Collect Fees
                    </button>
                </div>
            )}
        </div>
    );
};

const InstallmentCard = ({ installment, canEdit }) => {
    const isPaid = installment?.status === 'Paid';
    const isOverdue = installment?.status === 'Overdue';

    return (
        <div className={`rounded-xl p-4 border transition-all ${isPaid ? 'bg-gray-50 border-gray-100 opacity-75' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className={`font-bold text-sm ${isPaid ? 'text-gray-600' : 'text-gray-900'}`}>{installment?.title || 'N/A'}</h4>
                    <p className="text-[10px] text-gray-500">Due: {installment?.dueDate || 'N/A'}</p>
                </div>
                <span className={`text-sm font-bold ${isPaid ? 'text-emerald-600' : 'text-gray-900'}`}>
                    ₹{(installment?.amount || 0).toLocaleString()}
                </span>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-gray-200">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isPaid ? 'bg-emerald-100 text-emerald-700' :
                    isOverdue ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-600'
                    }`}>
                    {installment?.status || 'Due'}
                </span>

                {isPaid && installment?.receipt && (
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium bg-white px-2 py-0.5 rounded border border-gray-200">
                        <FileText size={10} /> {installment.receipt}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Fees;
