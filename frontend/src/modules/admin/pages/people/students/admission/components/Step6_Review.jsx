import React from 'react';
import { Check, Edit2 } from 'lucide-react';
import { useAdminStore } from '../../../../../../../store/adminStore';

const Step6_Review = ({ data, onEditStep }) => {
    const classes = useAdminStore(state => state.classes);
    const sectionsObj = useAdminStore(state => state.sections);
    const transportRoutes = useAdminStore(state => state.transportRoutes);
    const branches = useAdminStore(state => state.branches);

    // Resolution Logic
    const classObj = classes.find(c => c._id === data.classId);
    const sectionObj = (sectionsObj[data.classId] || []).find(s => s._id === data.sectionId);
    const branchObj = branches.find(b => b._id === data.branchId);

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

                <Section title="1. Personal Details" step={1}>
                    <Row label="Full Name" value={`${data.firstName} ${data.middleName || ''} ${data.lastName}`} />
                    <Row label="Date of Birth" value={data.dob} />
                    <Row label="Gender" value={data.gender} />
                    <Row label="Address" value={`${data.address}, ${data.city}`} />
                </Section>

                <Section title="2. Guardian Info" step={2}>
                    <Row label="Guardian Name" value={data.parentName || 'Linked Existing'} />
                    <Row label="Relationship" value={data.relation} />
                    <Row label="Contact" value={data.parentMobile} />
                </Section>

                <Section title="3. Academic Details" step={3}>
                    <Row label="Campus" value={branchObj?.name} />
                    <Row label="Admission No" value={data.admissionNo} />
                    <Row label="Date" value={data.admissionDate} />
                    <Row label="Class Assigned" value={`${classObj?.name || 'N/A'} - ${sectionObj?.name || 'N/A'}`} />
                </Section>

                <Section title="4. Facilities" step={4}>
                    <Row label="Transport" value={data.transportRequired ? 'Yes' : 'No'} />
                    {data.transportRequired && routeObj && (
                        <Row label="Route" value={`${routeObj.name} / ${stopObj?.name || 'N/A'}`} />
                    )}
                    <Row label="Hostel" value={data.hostelRequired ? 'Yes' : 'No'} />
                </Section>

                <Section title="5. Documents" step={5}>
                    <div className="flex gap-2 flex-wrap">
                        {data.documents && Object.keys(data.documents).map(key => (
                            <span key={key} className="bg-green-50 text-green-700 border border-green-100 px-2 py-1 rounded text-xs font-bold">
                                {data.documents[key].name}
                            </span>
                        ))}
                        {(!data.documents || Object.keys(data.documents).length === 0) && <span className="text-gray-400 italic">No documents uploaded</span>}
                    </div>
                </Section>

            </div>

        </div>
    );
};

export default Step6_Review;
