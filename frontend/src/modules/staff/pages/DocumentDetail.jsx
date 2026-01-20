import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStaffAuth } from '../context/StaffAuthContext';
import { STAFF_ROLES } from '../config/roles';
import {
    ArrowLeft, FileText, Upload, CheckCircle, XCircle,
    Eye, MoreHorizontal, Clock, ShieldCheck, Download
} from 'lucide-react';

const REQUIRED_DOCS = {
    student: [
        { id: 'RD-01', name: 'Aadhaar Card', mandatory: true },
        { id: 'RD-02', name: 'Birth Certificate', mandatory: true },
        { id: 'RD-03', name: 'Transfer Certificate', mandatory: true },
        { id: 'RD-04', name: 'Previous Marksheet', mandatory: false },
    ],
    teacher: [
        { id: 'RD-05', name: 'Degree Certificate', mandatory: true },
        { id: 'RD-06', name: 'ID Proof (PAN/Aadhaar)', mandatory: true },
        { id: 'RD-07', name: 'Appointment Letter', mandatory: true },
    ],
    employee: [
        { id: 'RD-08', name: 'ID Proof', mandatory: true },
        { id: 'RD-09', name: 'Address Proof', mandatory: true },
        { id: 'RD-10', name: 'Police Verification', mandatory: false },
    ],
    vendor: [
        { id: 'RD-11', name: 'GST Certificate', mandatory: true },
        { id: 'RD-12', name: 'Service Agreement', mandatory: true },
    ]
};

const DocumentDetail = () => {
    const { entityType, entityId } = useParams();
    const navigate = useNavigate();
    const { user } = useStaffAuth();

    // Mock State
    const [docs, setDocs] = useState([
        { id: 'DOC-101', typeId: 'RD-01', name: 'Aadhaar Card', status: 'Verified', uploadedBy: 'Data Entry', date: '2024-08-10', url: '#' },
        { id: 'DOC-102', typeId: 'RD-02', name: 'Birth Certificate', status: 'Pending', uploadedBy: 'Front Desk', date: '2024-09-01', url: '#' },
        { id: 'DOC-103', typeId: 'RD-03', name: 'Transfer Certificate', status: 'Rejected', reason: 'Blurred Image', uploadedBy: 'Parent', date: '2024-09-05', url: '#' }
    ]);

    const requiredList = REQUIRED_DOCS[entityType] || [];
    const canUpload = user?.role === STAFF_ROLES.DATA_ENTRY || (user?.role === STAFF_ROLES.FRONT_DESK && entityType === 'student');
    const canVerify = user?.role === STAFF_ROLES.DATA_ENTRY;

    const handleVerify = (docId, status) => {
        if (!canVerify) return;
        setDocs(prev => prev.map(d => d.id === docId ? { ...d, status } : d));
    };

    return (
        <div className="max-w-5xl mx-auto pb-20 md:pb-10 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white px-5 py-4 border-b border-gray-200 sticky top-0 z-20 flex items-center gap-4 shadow-sm">
                <button onClick={() => navigate('/staff/documents')} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-gray-900 capitalize">{entityType} Documents</h1>
                    <p className="text-xs text-gray-500 font-mono">ID: {entityId}</p>
                </div>
                <div className="text-right hidden md:block">
                    <p className="text-xs font-bold text-gray-500 uppercase">Compliance</p>
                    <p className={`text-sm font-bold ${docs.find(d => d.status === 'Rejected') ? 'text-red-600' : 'text-green-600'}`}>
                        {docs.filter(d => d.status === 'Verified').length}/{requiredList.length} Verified
                    </p>
                </div>
            </div>

            <div className="p-4 md:p-6 space-y-6">

                {/* Required Documents List */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <ShieldCheck size={16} className="text-indigo-600" /> Compliance Checklist
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {requiredList.map(req => {
                            const uploadedDoc = docs.find(d => d.typeId === req.id || d.name === req.name); // Simple match

                            return (
                                <div key={req.id} className="p-4 md:flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="mb-3 md:mb-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-gray-900">{req.name}</p>
                                            {req.mandatory && <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-bold border border-red-100">REQUIRED</span>}
                                        </div>
                                        {uploadedDoc ? (
                                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                <span>Uploaded by {uploadedDoc.uploadedBy} on {uploadedDoc.date}</span>
                                                {uploadedDoc.status === 'Rejected' && (
                                                    <span className="text-red-500 font-medium">• Reason: {uploadedDoc.reason}</span>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-amber-600 font-medium mt-1">Missing Document</p>
                                        )}
                                    </div>

                                    {/* Action Area */}
                                    <div className="flex items-center gap-3">
                                        {uploadedDoc ? (
                                            <>
                                                {/* Status Badge */}
                                                <Badge status={uploadedDoc.status} />

                                                {/* Actions */}
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => navigate(`preview`)} className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-gray-100" title="Preview">
                                                        <Eye size={18} />
                                                    </button>

                                                    {canVerify && uploadedDoc.status === 'Pending' && (
                                                        <>
                                                            <button onClick={() => handleVerify(uploadedDoc.id, 'Verified')} className="p-2 text-green-600 hover:bg-green-50 rounded-full" title="Verify">
                                                                <CheckCircle size={18} />
                                                            </button>
                                                            <button onClick={() => handleVerify(uploadedDoc.id, 'Rejected')} className="p-2 text-red-600 hover:bg-red-50 rounded-full" title="Reject">
                                                                <XCircle size={18} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            canUpload && (
                                                <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 border border-indigo-100 transition-colors">
                                                    <Upload size={14} /> Upload
                                                </button>
                                            )
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Audit Log (Read Only) */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 opacity-75">
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                        <Clock size={12} /> Audit Trail
                    </h3>
                    <div className="space-y-3 pl-2 border-l-2 border-gray-100">
                        <div className="text-xs">
                            <p className="font-bold text-gray-800">Document Verified</p>
                            <p className="text-gray-500">Aadhaar Card verified by Ankit (Data Entry) on 2024-08-11</p>
                        </div>
                        <div className="text-xs">
                            <p className="font-bold text-gray-800">Document Uploaded</p>
                            <p className="text-gray-500">Aadhaar Card uploaded by System on 2024-08-10</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const Badge = ({ status }) => {
    const styles = {
        'Verified': 'bg-green-50 text-green-700 border-green-200',
        'Pending': 'bg-amber-50 text-amber-700 border-amber-200',
        'Rejected': 'bg-red-50 text-red-700 border-red-200',
    };
    return (
        <span className={`px-2.5 py-1 rounded text-[10px] font-bold border ${styles[status]}`}>
            {status}
        </span>
    );
};

export default DocumentDetail;
