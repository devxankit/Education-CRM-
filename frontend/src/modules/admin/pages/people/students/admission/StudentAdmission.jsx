import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdmissionWizard from './components/AdmissionWizard';
import { CheckCircle } from 'lucide-react';
import { useAdminStore } from '../../../../../../store/adminStore';

const StudentAdmission = () => {
    const navigate = useNavigate();
    const [isComplete, setIsComplete] = useState(false);
    const [submittedId, setSubmittedId] = useState(null);
    const addStudent = useAdminStore(state => state.addStudent);

    const handleComplete = (data) => {
        // Here you would make the API call to save data
        console.log("Submitting Admission Data:", data);

        // Mock Success and persist
        setTimeout(() => {
            addStudent(data);
            setSubmittedId(data.admissionNo || `ADM-${Date.now()}`);
            setIsComplete(true);
        }, 1000);
    };

    const handleCancel = () => {
        if (confirm("Exit admission process? Unsaved progress will be lost.")) {
            navigate('/admin/people/students');
        }
    };

    if (isComplete) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-white p-6 text-center animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <CheckCircle size={48} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2 font-['Poppins']">Admission Successful!</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                    Student has been enrolled securely. The admission number is <strong>{submittedId}</strong>.
                    Documents are queued for verification.
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

    return (
        <div className="h-full flex flex-col">
            {/* Minimal Header for Focus Mode */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm z-10">
                <h1 className="text-lg font-bold text-gray-800 font-['Poppins']">New Student Admission</h1>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">Session 2024-25</span>
                </div>
            </div>

            {/* Wizard */}
            <div className="flex-1 overflow-hidden">
                <AdmissionWizard onComplete={handleComplete} onCancel={handleCancel} />
            </div>
        </div>
    );
};

export default StudentAdmission;
