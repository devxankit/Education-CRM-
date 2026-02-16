import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdmissionWizard from './components/AdmissionWizard';
import { CheckCircle, AlertCircle, Lock, Loader2 } from 'lucide-react';
import { useAdminStore, selectAcademicYearsForSelect } from '../../../../../../store/adminStore';

const StudentAdmission = () => {
    const navigate = useNavigate();
    const [isComplete, setIsComplete] = useState(false);
    const [submittedId, setSubmittedId] = useState(null);
    const [submittedWaitlisted, setSubmittedWaitlisted] = useState(false);
    const academicYears = useAdminStore(selectAcademicYearsForSelect);
    const { fetchAcademicYears, fetchAdmissionRule, admitStudent, recordFeePayment } = useAdminStore();
    const [academicYearId, setAcademicYearId] = useState('');
    const [policy, setPolicy] = useState(null);
    const [policyLoading, setPolicyLoading] = useState(true);

    useEffect(() => {
        fetchAcademicYears();
    }, [fetchAcademicYears]);

    useEffect(() => {
        if (academicYears.length > 0) {
            const active = academicYears.find(ay => ay.status === 'active') || academicYears[0];
            if (!academicYearId) {
                setAcademicYearId(active?._id || '');
            }
        }
    }, [academicYears, academicYearId]);

    useEffect(() => {
        const load = async () => {
            if (!academicYearId) {
                setPolicyLoading(false);
                return;
            }
            setPolicyLoading(true);
            const data = await fetchAdmissionRule(academicYearId);
            setPolicy(data);
            setPolicyLoading(false);
        };
        load();
    }, [academicYearId, fetchAdmissionRule]);

    const handleComplete = async (data) => {
        try {
            const { admissionFee, ...rest } = data;
            const payload = { ...rest, academicYearId: academicYearId || undefined };
            const result = await admitStudent(payload);
            if (result) {
                const studentId = result._id || result.id;
                if (studentId && admissionFee?.collectNow && admissionFee?.feeStructureId && admissionFee?.amount > 0) {
                    try {
                        await recordFeePayment(studentId, {
                            feeStructureId: admissionFee.feeStructureId,
                            amount: Number(admissionFee.amount),
                            paymentMethod: admissionFee.paymentMethod || 'Cash',
                            remarks: admissionFee.remarks || ''
                        });
                    } catch (feeErr) {
                        console.error("Fee recording failed:", feeErr);
                    }
                }
                setSubmittedId(result.admissionNo);
                setSubmittedWaitlisted(result.waitlisted || false);
                setIsComplete(true);
            }
        } catch (error) {
            console.error("Admission failed:", error);
        }
    };

    const handleCancel = () => {
        if (confirm("Exit admission process? Unsaved progress will be lost.")) {
            navigate('/admin/people/students');
        }
    };

    const isAdmissionBlocked = () => {
        if (!policy?.window) return false;
        if (policy.window.isOpen === false) return true;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (policy.window.startDate) {
            const start = new Date(policy.window.startDate);
            start.setHours(0, 0, 0, 0);
            if (today < start) return true;
        }
        if (policy.window.endDate && !policy.window.allowLate) {
            const end = new Date(policy.window.endDate);
            end.setHours(23, 59, 59, 999);
            if (today > end) return true;
        }
        return false;
    };

    const getBlockMessage = () => {
        if (!policy?.window) return null;
        if (policy.window.isOpen === false) return 'Admissions are currently closed for this academic year.';
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (policy.window.startDate) {
            const start = new Date(policy.window.startDate);
            start.setHours(0, 0, 0, 0);
            if (today < start) return `Admission window opens on ${start.toLocaleDateString()}.`;
        }
        if (policy.window.endDate && !policy.window.allowLate) {
            const end = new Date(policy.window.endDate);
            end.setHours(23, 59, 59, 999);
            if (today > end) return 'Admission window has closed. Late applications are not allowed.';
        }
        return null;
    };

    if (isComplete) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-white p-6 text-center animate-in zoom-in-95 duration-500">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-sm ${submittedWaitlisted ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                    <CheckCircle size={48} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2 font-['Poppins']">
                    {submittedWaitlisted ? 'Added to Waitlist' : 'Admission Successful!'}
                </h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                    {submittedWaitlisted ? (
                        <>Student has been added to the waitlist. Admission number <strong>{submittedId}</strong>. You will be notified when a seat becomes available.</>
                    ) : (
                        <>Student has been enrolled securely. The admission number is <strong>{submittedId}</strong>. Documents are queued for verification.</>
                    )}
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/admin/people/students')}
                        className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Go to Student List
                    </button>
                    <button
                        onClick={() => { setIsComplete(false); setSubmittedId(null); }}
                        className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md transition-colors"
                    >
                        Admit Another Student
                    </button>
                </div>
            </div>
        );
    }

    const blocked = isAdmissionBlocked();
    const blockMsg = getBlockMessage();

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm z-10">
                <h1 className="text-lg font-bold text-gray-800 font-['Poppins']">New Student Admission</h1>
                <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500">Academic Year</label>
                    <select
                        value={academicYearId}
                        onChange={(e) => setAcademicYearId(e.target.value)}
                        className="text-sm font-semibold border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        {academicYears.map(ay => (
                            <option key={ay._id} value={ay._id}>{ay.name} {ay.status === 'active' ? '(Active)' : ''}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Policy block banner */}
            {!policyLoading && blocked && (
                <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <Lock className="text-red-600 shrink-0 mt-0.5" size={24} />
                    <div>
                        <h3 className="font-bold text-red-800">Admissions Not Available</h3>
                        <p className="text-sm text-red-700 mt-1">{blockMsg}</p>
                        <p className="text-xs text-red-600 mt-2">Configure admission policy at Operations → Admission Policy & Rules.</p>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                {policyLoading ? (
                    <div className="h-full flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-indigo-500 mb-2" size={32} />
                        <p className="text-gray-500 text-sm">Loading admission policy...</p>
                    </div>
                ) : blocked ? (
                    <div className="h-full flex flex-col items-center justify-center p-8">
                        <AlertCircle className="text-amber-500 mb-4" size={48} />
                        <p className="text-gray-600 text-center max-w-md">{blockMsg}</p>
                        <p className="text-sm text-gray-400 mt-2">Select a different academic year or configure the policy.</p>
                    </div>
                ) : (
                    <AdmissionWizard
                        onComplete={handleComplete}
                        onCancel={handleCancel}
                        academicYearId={academicYearId}
                        workflow={{
                            requireFee: policy?.workflow?.requireFee ?? false,
                            requireDocs: policy?.workflow?.requireDocs ?? false
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default StudentAdmission;
