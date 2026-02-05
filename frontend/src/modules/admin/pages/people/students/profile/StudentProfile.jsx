
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, CreditCard, Clock, FileText, Activity } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

// Components
import ProfileHeader from './components/ProfileHeader';
import AcademicTab from './components/AcademicTab';
import FeesTab from './components/FeesTab';
import StudentEditPortal from './components/StudentEditPortal';

const StudentProfile = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const fetchStudentById = useAdminStore(state => state.fetchStudentById);
    const updateStudent = useAdminStore(state => state.updateStudent);

    const [activeTab, setActiveTab] = useState('academic');
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Fetch student data based on ID
    const loadStudent = async () => {
        setLoading(true);
        try {
            const data = await fetchStudentById(id);
            if (data) {
                setStudent(data);
            }
        } catch (error) {
            console.error('Error fetching student:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            loadStudent();
        }
    }, [id, fetchStudentById]);

    const handleUpdateSave = async (studentId, updatedData) => {
        try {
            const result = await updateStudent(studentId, updatedData);
            if (result) {
                // Manually update local state or re-fetch
                setStudent(result);
                return true;
            }
        } catch (error) {
            console.error("Failed to update student:", error);
            throw error;
        }
    };

    const tabs = [
        { id: 'academic', label: 'Academic & Attendance', icon: BookOpen },
        { id: 'fees', label: 'Fees & Finance', icon: CreditCard },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'activity', label: 'Activity Log', icon: Activity },
    ];

    // Loading state
    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-gray-500">Loading student profile...</div>
            </div>
        );
    }

    // No student found
    if (!student) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <div className="text-gray-500 mb-4">Student not found</div>
                <button
                    onClick={() => navigate('/admin/people/students')}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                    Back to Student List
                </button>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col pb-6">

            {/* Nav Back */}
            <div className="mb-4">
                <button
                    onClick={() => navigate('/admin/people/students')}
                    className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-medium text-sm transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Student List
                </button>
            </div>

            {/* Profile Header */}
            <ProfileHeader student={student} onEdit={() => setIsEditOpen(true)} />

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6 bg-white rounded-t-xl px-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-colors
                                ${activeTab === tab.id
                                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/10'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                        >
                            <Icon size={16} /> {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Tab Content */}
            <div className="flex-1">
                {activeTab === 'academic' && <AcademicTab student={student} />}
                {activeTab === 'fees' && <FeesTab student={student} />}

                {activeTab === 'documents' && (
                    <div className="bg-white p-10 rounded-xl border border-dashed border-gray-300 text-center text-gray-400">
                        <FileText size={48} className="mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-bold text-gray-600">Documents Repository</h3>
                        <p className="text-sm">Birth Certificate, TC, and Photos are stored here.</p>
                        <div className="mt-6 flex flex-wrap gap-4 justify-center">
                            {student.documents && Object.keys(student.documents).map(key => student.documents[key].url && (
                                <a key={key} href={student.documents[key].url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                                    <FileText size={24} className="text-indigo-600 mb-2" />
                                    <span className="text-xs font-bold text-gray-700">{student.documents[key].name || key}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'activity' && (
                    <div className="bg-white p-10 rounded-xl border border-dashed border-gray-300 text-center text-gray-400">
                        <Activity size={48} className="mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-bold text-gray-600">Audit Trail</h3>
                        <p className="text-sm">Log of profile updates, fee payments, and admissions.</p>
                    </div>
                )}
            </div>

            {/* Edit Portal */}
            <StudentEditPortal
                isOpen={isEditOpen}
                student={student}
                onClose={() => setIsEditOpen(false)}
                onSave={handleUpdateSave}
            />

        </div>
    );
};

export default StudentProfile;
