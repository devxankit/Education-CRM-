import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, User, Calendar, MapPin, BookOpen, Check, X, Clock, AlertCircle, FileText, Loader2 } from 'lucide-react';
import { useTeacherStore } from '../../../store/teacherStore';

const StudentDetailPage = () => {
    const navigate = useNavigate();
    const { id, studentId } = useParams(); // id = classId_sectionId, studentId
    const [classId, sectionId] = (id || '').split('_');

    const studentDetail = useTeacherStore(state => state.studentDetail);
    const studentDetailError = useTeacherStore(state => state.studentDetailError);
    const isFetchingStudentDetail = useTeacherStore(state => state.isFetchingStudentDetail);
    const fetchStudentDetail = useTeacherStore(state => state.fetchStudentDetail);
    const clearStudentDetail = useTeacherStore(state => state.clearStudentDetail);

    useEffect(() => {
        if (studentId && (classId || sectionId)) {
            fetchStudentDetail(studentId, classId, sectionId);
        } else if (studentId) {
            fetchStudentDetail(studentId);
        }
        return () => clearStudentDetail();
    }, [studentId, classId, sectionId, fetchStudentDetail, clearStudentDetail]);

    const getInitials = (profile) => {
        if (!profile) return '?';
        const first = (profile.firstName || '').trim();
        const last = (profile.lastName || '').trim();
        if (first && last) return (first.charAt(0) + last.charAt(0)).toUpperCase();
        return (first || last).charAt(0).toUpperCase() || '?';
    };

    const formatDate = (d) => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const statusConfig = {
        Present: { color: 'bg-green-100 text-green-700 border-green-200', icon: Check },
        Absent: { color: 'bg-red-50 text-red-600 border-red-200', icon: X },
        Late: { color: 'bg-amber-50 text-amber-600 border-amber-200', icon: Clock },
        'Half-Day': { color: 'bg-orange-50 text-orange-600 border-orange-200', icon: AlertCircle },
        Leave: { color: 'bg-blue-50 text-blue-600 border-blue-200', icon: FileText },
    };

    if (isFetchingStudentDetail && !studentDetail) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading student details...</p>
            </div>
        );
    }

    if (!studentDetail) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="text-center px-4">
                    <User className="mx-auto text-gray-300 mb-3" size={48} />
                    <h2 className="text-xl font-bold text-gray-900">Student not found</h2>
                    <p className="text-gray-500 mt-1">{studentDetailError || 'You may not have access to this student or the record does not exist.'}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const profile = studentDetail.profile || {};
    const attendanceHistory = studentDetail.attendanceHistory || [];
    const fullName = [profile.firstName, profile.middleName, profile.lastName].filter(Boolean).join(' ');
    const presentCount = attendanceHistory.filter(a => a.status === 'Present' || a.status === 'Late').length;
    const absentCount = attendanceHistory.filter(a => a.status === 'Absent').length;
    const attendancePercent = attendanceHistory.length > 0
        ? Math.round(((presentCount + (attendanceHistory.filter(a => a.status === 'Half-Day').length * 0.5)) / attendanceHistory.length) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-28">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-700"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-sm font-bold text-gray-900">Student Details</h1>
                            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Profile & Attendance</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-2xl mx-auto px-4 pt-4 space-y-5">
                {/* Profile Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-indigo-100 bg-indigo-50 flex items-center justify-center font-bold text-2xl text-indigo-600 shrink-0">
                                {profile.photo ? (
                                    <img src={profile.photo} alt={fullName} className="w-full h-full object-cover" />
                                ) : (
                                    getInitials(profile)
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">{fullName}</h2>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md">Roll {profile.rollNo || 'N/A'}</span>
                                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Adm: {profile.admissionNo || '—'}</span>
                                    {profile.gender && (
                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{profile.gender}</span>
                                    )}
                                </div>
                                <p className="text-xs font-medium text-gray-500 mt-1.5">
                                    {profile.className} — {profile.sectionName}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 grid grid-cols-2 divide-x divide-gray-100">
                        <div className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <Calendar size={16} className="text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Admission</p>
                                <p className="text-sm font-bold text-gray-900">{formatDate(profile.admissionDate)}</p>
                            </div>
                        </div>
                        <div className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <User size={16} className="text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">DOB</p>
                                <p className="text-sm font-bold text-gray-900">{formatDate(profile.dob)}</p>
                            </div>
                        </div>
                    </div>

                    {(profile.address || profile.city) && (
                        <div className="border-t border-gray-100 p-4 flex items-start gap-3">
                            <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                                <MapPin size={16} className="text-gray-500" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Address</p>
                                <p className="text-sm font-medium text-gray-700">
                                    {[profile.address, profile.city, profile.state, profile.pincode].filter(Boolean).join(', ') || '—'}
                                </p>
                            </div>
                        </div>
                    )}

                    {profile.bloodGroup && (
                        <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-3">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Blood Group</span>
                            <span className="text-sm font-bold text-gray-900">{profile.bloodGroup}</span>
                        </div>
                    )}
                </div>

                {/* Attendance Summary */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <BookOpen size={14} /> Attendance Summary
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                            <p className="text-lg font-bold text-green-700">{presentCount}</p>
                            <p className="text-[10px] font-bold text-green-600 uppercase">Present</p>
                        </div>
                        <div className="p-3 rounded-xl bg-red-50 border border-red-100">
                            <p className="text-lg font-bold text-red-700">{absentCount}</p>
                            <p className="text-[10px] font-bold text-red-600 uppercase">Absent</p>
                        </div>
                        <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                            <p className="text-lg font-bold text-indigo-700">{attendancePercent}%</p>
                            <p className="text-[10px] font-bold text-indigo-600 uppercase">Overall</p>
                        </div>
                    </div>
                </div>

                {/* Attendance History */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                        <Calendar size={14} /> Attendance History
                    </h3>
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                        {attendanceHistory.length === 0 ? (
                            <div className="py-12 text-center text-gray-400 text-sm font-medium">
                                No attendance records found
                            </div>
                        ) : (
                            attendanceHistory.map((record) => {
                                const config = statusConfig[record.status] || statusConfig.Present;
                                const Icon = config.icon;
                                return (
                                    <div
                                        key={record._id}
                                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 transition-colors"
                                    >
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{formatDate(record.date)}</p>
                                            <p className="text-[10px] text-gray-500">{record.subjectName}</p>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${config.color}`}>
                                            <Icon size={12} /> {record.status}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDetailPage;
