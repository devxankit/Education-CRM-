import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, User, Search, Filter, Save, ClipboardCheck, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { API_URL } from '@/app/api';
import { useStaffAuth } from '../context/StaffAuthContext';

const STATUS_COLORS = {
    'Present': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Absent': 'bg-rose-50 text-rose-700 border-rose-100',
    'Late': 'bg-amber-50 text-amber-700 border-amber-100',
    'Half-Day': 'bg-blue-50 text-blue-700 border-blue-100',
    'Leave': 'bg-purple-50 text-purple-700 border-purple-100',
    'Pending': 'bg-gray-50 text-gray-500 border-gray-100'
};

const TeacherAttendance = () => {
    const { user } = useStaffAuth();
    const [teachers, setTeachers] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [showAttendanceModal, setShowAttendanceModal] = useState(false);

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    const isToday = selectedDate === today;
    const isPastDate = selectedDate < today;
    const isFutureDate = selectedDate > today;

    useEffect(() => {
        fetchTeachers();
        fetchAttendance();
    }, [selectedDate]);

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/teacher-attendance/teachers`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setTeachers(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching teachers:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendance = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/teacher-attendance/by-date?date=${selectedDate}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                const attendanceMap = {};
                data.data.forEach(record => {
                    const employeeId = record.employeeId || record.teacherId?._id || record.teacherId || record.staffId?._id || record.staffId;
                    attendanceMap[employeeId] = {
                        status: record.status,
                        checkInTime: record.checkInTime,
                        checkOutTime: record.checkOutTime,
                        remarks: record.remarks
                    };
                });
                setAttendance(attendanceMap);
            }
        } catch (error) {
            console.error('Error fetching attendance:', error);
        }
    };

    const handleStatusChange = (teacherId, status) => {
        setAttendance(prev => ({
            ...prev,
            [teacherId]: {
                ...prev[teacherId],
                status
            }
        }));
    };

    const handleRemarksChange = (teacherId, remarks) => {
        setAttendance(prev => ({
            ...prev,
            [teacherId]: {
                ...prev[teacherId],
                remarks
            }
        }));
    };

    const handleMarkAttendance = (teacher) => {
        // Only allow marking attendance for today
        if (!isToday) {
            alert('You can only mark attendance for today\'s date.');
            return;
        }
        setSelectedTeacher(teacher);
        setShowAttendanceModal(true);
    };

    const handleMarkAllPresent = async () => {
        if (!isToday) {
            alert('You can only mark all as present for today\'s date.');
            return;
        }

        if (!confirm('Mark all teachers and staff as Present for today?')) {
            return;
        }

        try {
            setSaving(true);
            const token = localStorage.getItem('token');
            
            const promises = teachers.map(employee => {
                const employeeId = employee._id || employee.id;
                const employeeType = employee.type || 'teacher';
                return fetch(`${API_URL}/teacher-attendance/mark`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        teacherId: employeeId,
                        date: today,
                        status: 'Present',
                        remarks: 'Auto-marked as present',
                        employeeType
                    })
                });
            });

            await Promise.all(promises);
            alert('All teachers and staff marked as Present!');
            fetchAttendance();
        } catch (error) {
            console.error('Error marking all as present:', error);
            alert('Failed to mark all as present. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveAttendance = async (teacherId, status, remarks, employeeType) => {
        // Only allow saving for today
        if (!isToday) {
            alert('You can only mark attendance for today\'s date.');
            return;
        }

        try {
            setSaving(true);
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${API_URL}/teacher-attendance/mark`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    teacherId,
                    date: selectedDate,
                    status,
                    remarks,
                    employeeType: employeeType || 'teacher'
                })
            });

            const data = await response.json();
            if (data.success) {
                // Update local state
                setAttendance(prev => ({
                    ...prev,
                    [teacherId]: {
                        status,
                        remarks
                    }
                }));
                setShowAttendanceModal(false);
                setSelectedTeacher(null);
            } else {
                alert(data.message || 'Failed to save attendance');
            }
        } catch (error) {
            console.error('Error saving attendance:', error);
            alert('Failed to save attendance. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleBulkSave = async () => {
        // Only allow saving for today
        if (!isToday) {
            alert('You can only save attendance for today\'s date.');
            return;
        }

        try {
            setSaving(true);
            const token = localStorage.getItem('token');
            
            const promises = Object.entries(attendance).map(([employeeId, data]) => {
                if (!data.status) return Promise.resolve();
                
                // Find the employee to get their type
                const employee = teachers.find(t => (t._id || t.id) === employeeId);
                const employeeType = employee?.type || 'teacher';
                
                return fetch(`${API_URL}/teacher-attendance/mark`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        teacherId: employeeId,
                        date: selectedDate,
                        status: data.status,
                        remarks: data.remarks,
                        employeeType
                    })
                });
            });

            await Promise.all(promises);
            alert('Attendance saved successfully!');
            fetchAttendance();
        } catch (error) {
            console.error('Error saving attendance:', error);
            alert('Failed to save attendance. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Present':
                return <CheckCircle className="text-green-600" size={20} />;
            case 'Absent':
                return <XCircle className="text-red-600" size={20} />;
            case 'Late':
                return <Clock className="text-amber-600" size={20} />;
            case 'Half-Day':
                return <AlertCircle className="text-blue-600" size={20} />;
            case 'Leave':
                return <AlertCircle className="text-purple-600" size={20} />;
            default:
                return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Present':
                return 'bg-green-50 border-green-200 text-green-700';
            case 'Absent':
                return 'bg-red-50 border-red-200 text-red-700';
            case 'Late':
                return 'bg-amber-50 border-amber-200 text-amber-700';
            case 'Half-Day':
                return 'bg-blue-50 border-blue-200 text-blue-700';
            case 'Leave':
                return 'bg-purple-50 border-purple-200 text-purple-700';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-700';
        }
    };

    const filteredTeachers = teachers.filter(teacher => {
        const name = `${teacher.firstName || ''} ${teacher.lastName || ''}`.toLowerCase();
        const employeeId = (teacher.employeeId || '').toLowerCase();
        const query = searchQuery.toLowerCase();
        return name.includes(query) || employeeId.includes(query);
    });

    const getAttendanceStatus = (teacherId) => {
        const att = attendance[teacherId];
        return att?.status || 'Pending';
    };

    const markedCount = Object.values(attendance).filter(a => a.status).length;
    const totalCount = filteredTeachers.length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-12 pt-6 min-h-screen bg-gray-50/50">
            {/* Premium Header Container */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-6 sm:p-8 mb-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl"></div>

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-black uppercase tracking-widest mb-3">
                            <ClipboardCheck size={12} />
                            Attendance Management
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-none">
                            Employee Attendance
                        </h1>
                        <p className="mt-2 text-sm text-gray-500 font-medium tracking-tight">
                            Mark and manage attendance for teachers and staff on {new Date(selectedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            {isToday && <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">Today</span>}
                            {isPastDate && <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">View Only</span>}
                            {isFutureDate && <span className="ml-2 px-2 py-0.5 bg-rose-100 text-rose-700 rounded-lg text-xs font-bold">Future Date</span>}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-0.5">Marked</p>
                                <p className="text-lg font-black text-gray-900 leading-none">{markedCount}<span className="text-gray-400 text-sm">/{totalCount}</span></p>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600 border border-gray-100">
                                <CheckCircle size={20} />
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
                            placeholder="Find by name or employee ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white focus:border-indigo-200 transition-all"
                        />
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <div className="flex items-center gap-2 px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl">
                            <Calendar className="text-gray-500" size={18} />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                max={today}
                                className="bg-transparent border-none outline-none text-sm font-bold text-gray-700"
                            />
                        </div>
                        {isToday && (
                            <button
                                onClick={handleMarkAllPresent}
                                disabled={saving}
                                className="px-6 py-3.5 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-black text-sm shadow-sm active:scale-95"
                            >
                                <CheckCircle size={18} />
                                Mark All Present
                            </button>
                        )}
                        <button
                            onClick={handleBulkSave}
                            disabled={saving || markedCount === 0 || !isToday}
                            className="px-6 py-3.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-black text-sm shadow-sm active:scale-95"
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save All'}
                        </button>
                    </div>
                </div>

                {/* Warning Banner for Past/Future Dates */}
                {!isToday && (
                    <div className={`mt-6 px-4 py-3 rounded-2xl border-2 flex items-center gap-3 ${
                        isPastDate 
                            ? 'bg-amber-50 border-amber-200' 
                            : 'bg-rose-50 border-rose-200'
                    }`}>
                        <AlertCircle className={`${isPastDate ? 'text-amber-600' : 'text-rose-600'}`} size={20} />
                        <p className={`text-sm font-bold ${isPastDate ? 'text-amber-800' : 'text-rose-800'}`}>
                            {isPastDate 
                                ? 'You are viewing past attendance. Attendance can only be marked for today\'s date.' 
                                : 'Future dates are not available. Attendance can only be marked for today\'s date.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Premium Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                        <h3 className="text-xl font-black text-gray-900">Loading employees...</h3>
                    </div>
                ) : filteredTeachers.length === 0 ? (
                    <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                            <User size={40} />
                        </div>
                        <h3 className="text-xl font-black text-gray-900">No employees found</h3>
                        <p className="text-gray-400 font-bold mt-1">Try adjusting your search criteria.</p>
                    </div>
                ) : (
                    filteredTeachers.map((employee) => {
                        const employeeId = employee._id || employee.id;
                        const currentAttendance = attendance[employeeId] || {};
                        const status = getAttendanceStatus(employeeId);
                        const employeeName = employee.name || `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || 'N/A';
                        const employeeType = employee.type || 'teacher';

                        return (
                            <div
                                key={employeeId}
                                className={`group bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all duration-300 relative overflow-hidden ${
                                    isToday 
                                        ? 'hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 cursor-pointer active:scale-[0.98]' 
                                        : 'opacity-75 cursor-not-allowed'
                                }`}
                                onClick={() => isToday && handleMarkAttendance(employee)}
                            >
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 p-1 group-hover:border-indigo-200 transition-colors">
                                                <div className={`w-full h-full rounded-xl flex items-center justify-center ${
                                                    employeeType === 'staff' ? 'bg-purple-50 text-purple-400' : 'bg-indigo-50 text-indigo-400'
                                                }`}>
                                                    <User size={24} />
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-black text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
                                                    {employeeName}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100 uppercase tracking-wider">{employee.employeeId || 'N/A'}</span>
                                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase tracking-wider ${
                                                        employeeType === 'staff' 
                                                            ? 'bg-purple-50 text-purple-600 border-purple-100' 
                                                            : 'bg-blue-50 text-blue-600 border-blue-100'
                                                    }`}>
                                                        {employeeType === 'staff' ? 'Staff' : 'Teacher'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${STATUS_COLORS[status] || STATUS_COLORS.Pending}`}>
                                            {status}
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between items-end mb-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                                    <Sparkles size={10} className="text-amber-400" />
                                                    {employeeType === 'staff' ? 'Role' : 'Department'}
                                                </span>
                                            </div>
                                            <p className="text-sm font-bold text-gray-700">{employee.department || employee.designation || 'N/A'}</p>
                                        </div>

                                        {currentAttendance.remarks && (
                                            <div className="pt-2 border-t border-gray-50">
                                                <p className="text-xs text-gray-600 font-medium">{currentAttendance.remarks}</p>
                                            </div>
                                        )}

                                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                            <div className="flex gap-2">
                                                {status !== 'Pending' && (
                                                    <div className="px-2 py-1 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center gap-1.5">
                                                        <CheckCircle2 size={12} className="text-emerald-500" />
                                                        <span className="text-[10px] font-black text-emerald-700">Marked</span>
                                                    </div>
                                                )}
                                            </div>
                                            {isToday ? (
                                                <div className="flex items-center gap-1 text-indigo-600 group-hover:translate-x-1 transition-transform">
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Mark</span>
                                                    <ArrowRight size={14} />
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1 text-gray-400">
                                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                                        {isPastDate ? 'View Only' : 'Not Available'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Attendance Modal */}
            {showAttendanceModal && selectedTeacher && (
                <AttendanceModal
                    teacher={selectedTeacher}
                    currentAttendance={attendance[selectedTeacher._id || selectedTeacher.id] || {}}
                    onClose={() => {
                        setShowAttendanceModal(false);
                        setSelectedTeacher(null);
                    }}
                    onSave={(teacherId, status, remarks) => {
                        const employeeType = selectedTeacher.type || 'teacher';
                        handleSaveAttendance(teacherId, status, remarks, employeeType);
                    }}
                    saving={saving}
                    isToday={isToday}
                />
            )}
        </div>
    );
};

// Attendance Modal Component
const AttendanceModal = ({ teacher, currentAttendance, onClose, onSave, saving, isToday }) => {
    const [status, setStatus] = useState(currentAttendance.status || '');
    const [remarks, setRemarks] = useState(currentAttendance.remarks || '');

    const handleSubmit = () => {
        if (!status) {
            alert('Please select attendance status');
            return;
        }
        const teacherId = teacher._id || teacher.id;
        onSave(teacherId, status, remarks);
    };

    const teacherName = `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim() || 'N/A';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-indigo-50">
                    <div className="flex items-center gap-2">
                        <ClipboardCheck className="text-indigo-600" size={24} />
                        <h3 className="text-lg font-black text-gray-900">Mark Attendance</h3>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-1 hover:bg-indigo-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Teacher Info */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                {(teacher.firstName || '').charAt(0)}
                            </div>
                            <div>
                                <p className="font-black text-gray-900">{teacherName}</p>
                                <p className="text-xs text-gray-600 mt-0.5">ID: {teacher.employeeId || 'N/A'}</p>
                                {teacher.department && (
                                    <p className="text-xs text-gray-500 mt-0.5">{teacher.department}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status Selection */}
                    <div>
                        <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                            Attendance Status <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Present', 'Absent', 'Late', 'Half-Day', 'Leave'].map((stat) => (
                                <button
                                    key={stat}
                                    onClick={() => isToday && setStatus(stat)}
                                    disabled={!isToday}
                                    className={`px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                                        status === stat
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                                    } ${!isToday ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {stat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className="block text-sm font-black text-gray-700 mb-2 uppercase tracking-wider">
                            Remarks (Optional)
                        </label>
                        <textarea
                            value={remarks}
                            onChange={(e) => isToday && setRemarks(e.target.value)}
                            placeholder="Add any remarks or notes..."
                            rows={3}
                            disabled={!isToday}
                            className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm ${!isToday ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={onClose}
                            disabled={saving}
                            className="flex-1 px-4 py-3 text-sm font-black text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={saving || !status}
                            className="flex-1 px-4 py-3 text-sm font-black text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={16} />
                                    Save
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherAttendance;
