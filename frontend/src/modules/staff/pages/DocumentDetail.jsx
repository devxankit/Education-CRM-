import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import {
    ArrowLeft, FileText, Upload, CheckCircle, XCircle,
    Eye, MoreHorizontal, Clock, ShieldCheck, Download,
    AlertCircle, ExternalLink, Trash2, CheckCircle2,
    Calendar, User, Fingerprint, History, Info, Sparkles
} from 'lucide-react';
import { useStaffStore } from '../../../store/staffStore';
import toast from 'react-hot-toast';

const STATUS_MAP = {
    'approved': { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle2, label: 'Approved' },
    'active': { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle2, label: 'Approved' },
    'verified': { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle2, label: 'Approved' },
    'in_review': { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: Clock, label: 'In Review' },
    'pending': { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: Clock, label: 'In Review' },
    'rejected': { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', icon: XCircle, label: 'Rejected' },
    'missing': { color: 'text-gray-400', bg: 'bg-gray-50', border: 'border-gray-100', icon: Info, label: 'Not Uploaded' }
};

const REQUIRED_DOCS = {
    student: [
        { id: 'photo', name: 'Student Photograph', mandatory: true },
        { id: 'aadhar', name: 'Aadhar Card', mandatory: true },
        { id: 'birthCert', name: 'Birth Certificate', mandatory: true },
        { id: 'transferCert', name: 'Transfer Certificate (TC)', mandatory: true },
        { id: 'prevMarksheet', name: 'Previous Year Marksheet', mandatory: false },
    ],
    teacher: [
        { id: 'degree', name: 'Degree Certificate', mandatory: true },
        { id: 'idProof', name: 'ID Proof (PAN/Aadhaar)', mandatory: true },
        { id: 'appointment', name: 'Appointment Letter', mandatory: true },
    ],
    employee: [
        { id: 'idProof', name: 'ID Proof', mandatory: true },
        { id: 'addressProof', name: 'Address Proof', mandatory: true },
        { id: 'policeVar', name: 'Police Verification', mandatory: false },
    ]
};

const DocumentDetail = () => {
    const { type, entityId } = useParams(); // URL: staff/documents/student/ADM-2026-0001
    const navigate = useNavigate();
    const { user } = useStaffAuth();
    const students = useStaffStore(state => state.students);
    const fetchStudents = useStaffStore(state => state.fetchStudents);

    const [loading, setLoading] = useState(false);
    const [entity, setEntity] = useState(null);

    useEffect(() => {
        const load = async () => {
            if (students.length === 0) {
                setLoading(true);
                await fetchStudents();
                setLoading(false);
            }
            const found = students.find(s =>
                s.admissionNo === entityId ||
                s.id === entityId ||
                s._id === entityId
            );
            if (found) setEntity(found);
        };
        load();
    }, [entityId, students, fetchStudents]);

    const requiredList = REQUIRED_DOCS[type] || [];
    const canManage = [STAFF_ROLES.DATA_ENTRY, STAFF_ROLES.PRINCIPAL, STAFF_ROLES.FRONT_DESK, STAFF_ROLES.ADMIN].includes(user?.role);

    const handleVerifyAction = async (docId, status) => {
        if (!canManage) return toast.error("Unauthorized access");

        let reason = "";
        if (status === 'rejected') {
            reason = window.prompt("Please enter the reason for rejection:");
            if (reason === null) return;
            if (!reason.trim()) return toast.error("Rejection reason is required");
        }

        const loadingToast = toast.loading(`${status === 'approved' ? 'Approving' : 'Rejecting'} document...`);
        try {
            const updatePayload = {
                [`documents.${docId}.status`]: status,
            };
            if (status === 'rejected') {
                updatePayload[`documents.${docId}.reason`] = reason;
            } else {
                updatePayload[`documents.${docId}.reason`] = "";
            }

            // This now returns the full updated student record from store
            const updated = await useStaffStore.getState().updateStudent(entity._id, updatePayload);

            // Sync local state directly from the record returned by the store
            if (updated) setEntity(updated);

            toast.success(`Document ${status === 'approved' ? 'Verified' : 'Rejected'} successfully!`, { id: loadingToast });
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status", { id: loadingToast });
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="relative">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles size={16} className="text-indigo-600" />
                </div>
            </div>
        </div>
    );

    const fullName = entity ? `${entity.firstName} ${entity.lastName}` : 'Profile Not Found';
    const totalVerified = requiredList.filter(req => {
        const doc = entity?.documents?.[req.id];
        return doc?.status === 'approved' || doc?.status === 'active' || doc?.status === 'verified';
    }).length;

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-12 pt-6 min-h-screen bg-gray-50/50">
            {/* Premium Header */}
            <div className="relative overflow-hidden bg-white mb-8 rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6 text-center sm:text-left">
                    <button
                        onClick={() => navigate('/staff/documents')}
                        className="p-3 bg-gray-50 hover:bg-white hover:shadow-md rounded-2xl transition-all border border-transparent hover:border-gray-100"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-black uppercase tracking-widest mb-3">
                            <ShieldCheck size={12} />
                            Document Verification
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">
                            {fullName}
                        </h1>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                                <Fingerprint size={12} className="text-indigo-400" />
                                {entity?.admissionNo || entityId}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 capitalize">
                                <User size={12} className="text-emerald-400" />
                                {type}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="shrink-0 flex items-center gap-4 bg-gray-50 p-4 rounded-3xl border border-gray-100">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Compliance Score</p>
                        <p className="text-2xl font-black text-gray-900">
                            {totalVerified}<span className="text-gray-300 mx-1">/</span>{requiredList.length}
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-indigo-600">
                        <ShieldCheck size={24} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Checklist Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                            <FileText size={16} className="text-indigo-500" />
                            Document Checklist
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {requiredList.map((req, idx) => {
                            const doc = entity?.documents?.[req.id];
                            const statusKey = doc?.url ? (doc.status || 'in_review') : 'missing';
                            const status = STATUS_MAP[statusKey.toLowerCase()] || STATUS_MAP.missing;
                            const Icon = status.icon;

                            return (
                                <div
                                    key={req.id}
                                    className="group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
                                        <div className="flex items-center gap-5 text-center sm:text-left">
                                            <div className={`w-14 h-14 rounded-2xl ${status.bg} ${status.color} flex items-center justify-center border-2 border-white shadow-sm shrink-0 group-hover:scale-105 transition-transform`}>
                                                <Icon size={24} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 justify-center sm:justify-start">
                                                    <h4 className="text-base font-black text-gray-900 leading-tight">{req.name}</h4>
                                                    {req.mandatory && (
                                                        <span className="text-[9px] font-black bg-rose-50 text-rose-500 px-1.5 py-0.5 rounded-lg border border-rose-100">REQUIRED</span>
                                                    )}
                                                </div>
                                                <p className={`text-[11px] font-bold mt-1.5 ${status.color} flex items-center gap-1.5 justify-center sm:justify-start`}>
                                                    {status.label}
                                                    {doc?.date && <span className="text-gray-300">•</span>}
                                                    {doc?.date && <span className="text-gray-400">{new Date(doc.date).toLocaleDateString()}</span>}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {doc?.url ? (
                                                <>
                                                    <a
                                                        href={doc.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95"
                                                        title="View Document"
                                                    >
                                                        <Eye size={18} />
                                                    </a>
                                                    {canManage && doc.status !== 'approved' && doc.status !== 'verified' && (
                                                        <div className="flex items-center gap-2 ml-2 pl-4 border-l border-gray-100">
                                                            <button
                                                                onClick={() => handleVerifyAction(req.id, 'approved')}
                                                                className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
                                                                title="Approve"
                                                            >
                                                                <CheckCircle size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleVerifyAction(req.id, 'rejected')}
                                                                className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 hover:bg-rose-600 hover:text-white transition-all active:scale-95"
                                                                title="Reject"
                                                            >
                                                                <XCircle size={18} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <button className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 text-gray-400 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-gray-100 hover:bg-white hover:border-indigo-100 hover:text-indigo-600 transition-all shadow-sm active:scale-95">
                                                    <Upload size={14} />
                                                    Upload
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {doc?.status === 'rejected' && doc.reason && (
                                        <div className="mt-4 p-4 bg-rose-50/50 rounded-2xl border border-rose-100 flex items-start gap-3">
                                            <AlertCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                                            <p className="text-[11px] font-bold text-rose-600 leading-relaxed italic">
                                                Reason: {doc.reason}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Audit & Logs */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden group">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                <History size={16} className="text-indigo-500" />
                                Audit Log
                            </h3>
                        </div>
                        <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-50">
                            {[1, 2].map((log, i) => (
                                <div key={i} className="relative pl-8">
                                    <div className="absolute left-0 top-1 w-4 h-4 rounded-full border-4 border-white bg-indigo-500 shadow-sm"></div>
                                    <p className="text-xs font-black text-gray-900">Document Uploaded</p>
                                    <p className="text-[10px] text-gray-500 mt-1 font-medium leading-relaxed">
                                        Admission photo uploaded via Staff Portal on {new Date().toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2rem] shadow-xl shadow-indigo-200 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <Sparkles className="mb-4 text-amber-300 group-hover:scale-125 transition-transform" size={28} />
                            <h2 className="text-xl font-black leading-tight mb-2">Compliance <br /> Check</h2>
                            <p className="text-indigo-100 text-[10px] font-bold leading-relaxed">
                                Ensure all mandatory documents are verified before final enrollment.
                            </p>
                        </div>
                        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentDetail;
