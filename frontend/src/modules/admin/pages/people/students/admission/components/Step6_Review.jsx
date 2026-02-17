import React from 'react';
import { Check, Edit2 } from 'lucide-react';
import { useAdminStore } from '../../../../../../../store/adminStore';

const Step6_Review = ({ data, onEditStep, stepNumbers = {}, showDocs = true, showFee = true }) => {
    const { personal = 1, academic = 2, logistics = 3, docs = 4, fee = 5 } = stepNumbers;
    const classes = useAdminStore(state => state.classes);
    const courses = useAdminStore(state => state.courses);
    const academicYears = useAdminStore(state => state.academicYears) || [];
    const feeStructures = useAdminStore(state => state.feeStructures);
    const sectionsObj = useAdminStore(state => state.sections);
    const transportRoutes = useAdminStore(state => state.transportRoutes);
    const branches = useAdminStore(state => state.branches);

    const classObj = classes?.find(c => c._id === data.classId);
    const sectionObj = (sectionsObj[data.classId] || []).find(s => s._id === data.sectionId);
    const courseObj = courses?.find(c => c._id === data.courseId);
    const branchObj = branches.find(b => b._id === data.branchId);
    const academicYearObj = academicYears.find(ay => ay._id === data.academicYearId);

    const routeObj = transportRoutes.find(r => r._id === data.routeId);
    const stopObj = routeObj?.stops?.find(s => s._id === data.stopId);

    const Section = ({ title, step, children }) => (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <h4 className="font-bold text-gray-800 text-sm">{title}</h4>
                <button onClick={() => onEditStep(step)} className="text-indigo-600 hover:bg-indigo-50 p-1 rounded transition-colors">
                    <Edit2 size={14} />
                </button>
            </div>
            <div className="p-4 text-sm text-gray-600">
                {children}
            </div>
        </div>
    );

    const Row = ({ label, value }) => (
        <div className="flex justify-between py-1 border-b border-gray-50 last:border-0">
            <span className="text-gray-500 text-xs uppercase font-semibold">{label}</span>
            <span className="font-medium text-gray-900 text-right">{value || '-'}</span>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">

            <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Review Admission Application</h3>
                <p className="text-sm text-gray-500">Please verify all details before final submission.</p>
            </div>

            <div className="max-w-3xl mx-auto">

                <Section title="1. Personal Details" step={personal}>
                    <Row label="Full Name" value={`${data.firstName} ${data.middleName || ''} ${data.lastName}`} />
                    <Row label="Date of Birth" value={data.dob} />
                    <Row label="Age" value={data.dob ? (() => {
                        const dob = new Date(data.dob);
                        const today = new Date();
                        let age = today.getFullYear() - dob.getFullYear();
                        const m = today.getMonth() - dob.getMonth();
                        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
                        return `${age} years`;
                    })() : '-'} />
                    <Row label="Gender" value={data.gender} />
                    <Row label="Parent Email" value={data.parentEmail} />
                    <Row label="Address" value={`${data.address}, ${data.city}`} />
                </Section>

                <Section title="2. Academic Details" step={academic}>
                    <Row label="Campus" value={branchObj?.name} />
                    <Row label="Academic Year" value={academicYearObj?.name} />
                    <Row label="Admission No" value={data.admissionNo} />
                    <Row label="Date" value={data.admissionDate} />
                    <Row label="Class Assigned" value={`${classObj?.name || 'N/A'} - ${sectionObj?.name || 'N/A'}`} />
                    {courseObj && <Row label="Course / Program" value={`${courseObj.name} ${courseObj.code ? `(${courseObj.code})` : ''}`} />}
                </Section>

                <Section title="3. Facilities" step={logistics}>
                    <Row label="Transport" value={data.transportRequired ? 'Yes' : 'No'} />
                    {data.transportRequired && routeObj && (
                        <Row label="Route" value={`${routeObj.name} / ${stopObj?.name || 'N/A'}`} />
                    )}
                    <Row label="Hostel" value={data.hostelRequired ? 'Yes' : 'No'} />
                </Section>

                {showDocs && docs > 0 && (
                    <Section title="4. Documents" step={docs}>
                        <div className="flex gap-2 flex-wrap">
                            {data.documents && Object.keys(data.documents).map(key => (
                                <span key={key} className="bg-green-50 text-green-700 border border-green-100 px-2 py-1 rounded text-xs font-bold">
                                    {data.documents[key].name}
                                </span>
                            ))}
                            {(!data.documents || Object.keys(data.documents).length === 0) && <span className="text-gray-400 italic">No documents uploaded</span>}
                        </div>
                    </Section>
                )}

                {showFee && fee > 0 && (
                    <Section title={showDocs ? '5. Admission Fee' : '4. Admission Fee'} step={fee}>
                        {data.admissionFee?.collectNow ? (
                            <>
                                <Row label="Fee Structure" value={feeStructures.find(f => f._id === data.admissionFee?.feeStructureId)?.name || '-'} />
                                <Row label="Base Amount" value={`₹${Number(data.admissionFee?.amount || 0).toLocaleString('en-IN')}`} />
                                {Number(data.admissionFee?.taxAmount || 0) > 0 && (
                                    <Row label="Tax" value={`₹${Number(data.admissionFee.taxAmount).toLocaleString('en-IN')}`} />
                                )}
                                <Row label="Total Payable" value={`₹${Number(data.admissionFee?.totalWithTax || data.admissionFee?.amount || 0).toLocaleString('en-IN')}`} />
                                <Row label="Payment Method" value={data.admissionFee?.paymentMethod || 'Cash'} />
                                {data.admissionFee?.transactionId && <Row label="Transaction ID" value={data.admissionFee.transactionId} />}
                                {data.admissionFee?.remarks && <Row label="Remarks" value={data.admissionFee.remarks} />}
                            </>
                        ) : (
                            <span className="text-gray-400 italic">Fee will be collected later</span>
                        )}
                    </Section>
                )}

            </div>

        </div>
    );
};

export default Step6_Review;
