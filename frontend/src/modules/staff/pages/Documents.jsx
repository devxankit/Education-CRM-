import React, { useState, useEffect } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import { useNavigate } from 'react-router-dom';
import {
    Search, Folder, FileText, CheckCircle, AlertCircle,
    Clock, Filter, ChevronRight, Eye, User, ShieldCheck,
    Sparkles, ArrowRight, CheckCircle2, MoreVertical
} from 'lucide-react';
import { useStaffStore } from '../../../store/staffStore';

const COMPLIANCE_COLORS = {
    'Complete': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Pending': 'bg-gray-50 text-gray-500 border-gray-100',
    'Review': 'bg-amber-50 text-amber-700 border-amber-100',
    'Rejected': 'bg-rose-50 text-rose-700 border-rose-100'
};

const Documents = () => {
    const { user } = useStaffAuth();
    const navigate = useNavigate();
    const students = useStaffStore(state => state.students);
    const fetchStudents = useStaffStore(state => state.fetchStudents);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        if (students.length === 0) {
            fetchStudents();
        }
    }, [fetchStudents, students.length]);

    if (user?.role === STAFF_ROLES.TRANSPORT) {
        return <AccessDenied />;
    }

    const studentDocs = students.map(student => {
        const docs = student.documents || {};
        const docKeys = Object.keys(docs);
        const uploadedCount = docKeys.filter(k => docs[k]?.url).length;
        const requiredCount = 5; // photo, aadhar, birthCert, transferCert, prevMarksheet

        const verifiedCount = docKeys.filter(k =>
            docs[k]?.status === 'approved' ||
            docs[k]?.status === 'verified' ||
            docs[k]?.status === 'active'
        ).length;

        let complianceStatus = 'Pending';
        if (uploadedCount === 0) complianceStatus = 'Pending';
        else if (verifiedCount === requiredCount) complianceStatus = 'Complete';
        else if (docKeys.some(k => docs[k]?.status === 'rejected')) complianceStatus = 'Rejected';
        else if (docKeys.some(k => docs[k]?.status === 'in_review' || docs[k]?.status === 'pending' || docs[k]?.url)) complianceStatus = 'Review';

        return {
            id: student.id || student._id,
            entityId: student.admissionNo || student.id || student._id,
            name: `${student.firstName} ${student.lastName}`,
            type: 'Student',
            required: requiredCount,
            uploaded: uploadedCount,
            verified: verifiedCount,
            status: complianceStatus,
            photo: docs.photo?.url,
            grade: student.classId?.name || 'N/A'
        };
    });

    const allEntities = [...studentDocs];

    const filteredDocs = allEntities.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.entityId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || item.type === filterType;
        const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-12 pt-6 min-h-screen bg-gray-50/50">
            {/* Premium Header Container */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-6 sm:p-8 mb-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl"></div>

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-black uppercase tracking-widest mb-3">
                            <ShieldCheck size={12} />
                            Governance
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-none">
                            Document Compliance
                        </h1>
                        <p className="mt-2 text-sm text-gray-500 font-medium tracking-tight">
                            Verify and audit student & staff credentials in real-time.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Total Records</p>
                                <p className="text-lg font-black text-gray-900 leading-none">{filteredDocs.length}</p>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 border border-gray-100">
                                <Folder size={20} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="relative mt-8 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Find by name or registration ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-200 transition-all"
                        />
                    </div>
                    <div className="flex gap-3">
                       
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="appearance-none px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black text-gray-600 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all min-w-[140px] shadow-sm"
                        >
                            <option value="All">All Status</option>
                            <option value="Complete">Complete</option>
                            <option value="Review">In Review</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Premium Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocs.length === 0 ? (
                    <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                            <FileText size={40} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">No records matching</h3>
                        <p className="text-gray-400 font-bold mt-1">Try adjusting your filters or search criteria.</p>
                    </div>
                ) : (
                    filteredDocs.map(doc => (
                        <div
                            key={doc.id}
                            onClick={() => navigate(`/staff/documents/${doc.type.toLowerCase()}/${doc.entityId}`)}
                            className="group bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all duration-300 cursor-pointer relative overflow-hidden active:scale-[0.98]"
                        >
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 p-1 group-hover:border-indigo-200 transition-colors">
                                            {doc.photo ? (
                                                <img src={doc.photo} alt={doc.name} className="w-full h-full object-cover rounded-xl" />
                                            ) : (
                                                <div className="w-full h-full bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-400">
                                                    <User size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
                                                {doc.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100 uppercase tracking-wider">{doc.entityId}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${COMPLIANCE_COLORS[doc.status]}`}>
                                        {doc.status}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <Sparkles size={10} className="text-amber-400" />
                                                Review Progress
                                            </span>
                                            <span className="text-xs font-black text-gray-900 font-mono tracking-tighter">
                                                {doc.verified}<span className="text-gray-300 mx-0.5">/</span>{doc.required}
                                                <span className="ml-1 text-[9px] text-gray-400 uppercase tracking-widest font-sans font-bold">Verified</span>
                                            </span>
                                        </div>
                                        <div className="w-full h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 shadow-sm ${doc.verified === doc.required ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-indigo-500 to-violet-600'}`}
                                                style={{ width: `${(doc.verified / doc.required) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <div className="px-2 py-1 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-1.5">
                                                <CheckCircle2 size={12} className="text-emerald-500" />
                                                <span className="text-[10px] font-black text-gray-700">{doc.uploaded} Uploaded</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-indigo-600 group-hover:translate-x-1 transition-transform">
                                            <span className="text-[10px] font-black uppercase tracking-widest">Detail</span>
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const AccessDenied = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 bg-gray-50/50">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6 text-rose-500 shadow-xl shadow-rose-100">
            <AlertCircle size={36} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Access Restricted</h2>
        <p className="text-gray-500 font-medium mt-2 max-w-sm">
            Your current security clearance does not allow access to the documentation compliance vault.
        </p>
        <button
            onClick={() => window.history.back()}
            className="mt-8 px-8 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-black text-gray-700 hover:shadow-md transition-all active:scale-95"
        >
            Go Back
        </button>
    </div>
);

export default Documents;
