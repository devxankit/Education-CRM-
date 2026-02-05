import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, User, Phone, Mail, BookOpen,
    GraduationCap, MessageCircle, Clock
} from 'lucide-react';
import { useParentStore } from '../../../store/parentStore';

const TeachersPage = () => {
    const navigate = useNavigate();
    const children = useParentStore(state => state.children);
    const selectedChildId = useParentStore(state => state.selectedChildId);
    const teachers = useParentStore(state => state.teachers);
    const fetchTeachers = useParentStore(state => state.fetchTeachers);
    const isLoading = useParentStore(state => state.isLoading);

    const selectedChild = children.find(c => c._id === selectedChildId || c.id === selectedChildId) || children[0];

    React.useEffect(() => {
        if (selectedChild?._id || selectedChild?.id) {
            fetchTeachers(selectedChild?._id || selectedChild?.id);
        }
    }, [selectedChild, fetchTeachers]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500 font-medium">Loading faculty list...</p>
                </div>
            </div>
        );
    }

    // Filter teachers for selected child's class
    const classTeachers = teachers; // Backend already filters by studentId

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header */}
            <div className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/parent')}
                        className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Teachers</h1>
                        <p className="text-xs text-gray-500">
                            Class {selectedChild?.class}-{selectedChild?.section} Teachers
                        </p>
                    </div>
                </div>
            </div>

            {/* Child Indicator */}
            <div className="px-4 pt-4">
                <div className="bg-indigo-50 rounded-lg p-3 flex items-center gap-2 border border-indigo-100">
                    <GraduationCap size={18} className="text-indigo-600" />
                    <span className="text-sm text-indigo-700">
                        Showing teachers for <span className="font-bold">{selectedChild?.name}</span>
                    </span>
                </div>
            </div>

            {/* Teachers List */}
            <div className="p-4 space-y-3">
                {classTeachers.map((teacher) => (
                    <div
                        key={teacher.id}
                        className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
                    >
                        {/* Teacher Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-lg font-bold">
                                    {teacher.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">{teacher.name}</h3>
                                    <p className="text-sm text-indigo-600 font-medium">{teacher.subject}</p>
                                </div>
                            </div>
                            {teacher.isClassTeacher && (
                                <span className="px-2 py-1 text-[10px] font-bold bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                                    Class Teacher
                                </span>
                            )}
                        </div>

                        {/* Teacher Details */}
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <BookOpen size={14} className="text-gray-400" />
                                <span>{teacher.qualification}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Clock size={14} className="text-gray-400" />
                                <span>{teacher.experience} experience</span>
                            </div>
                        </div>

                        {/* Contact Actions */}
                        <div className="flex gap-2 mt-4">
                            <a
                                href={`tel:${teacher.phone}`}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                            >
                                <Phone size={14} />
                                Call
                            </a>
                            <a
                                href={`mailto:${teacher.email}`}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                            >
                                <Mail size={14} />
                                Email
                            </a>
                            <button
                                onClick={() => navigate('/parent/support/new')}
                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-sm font-medium text-indigo-700 transition-colors"
                            >
                                <MessageCircle size={14} />
                                Message
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeachersPage;
