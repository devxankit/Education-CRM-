import React, { useState, useEffect, useMemo } from 'react';
import { 
    Users, 
    Calendar as CalendarIcon, 
    Search, 
    Download, 
    RefreshCcw,
    CheckCircle2,
    XCircle,
    Clock,
    UserMinus,
    AlertCircle,
    Building2,
    Search as SearchIcon
} from 'lucide-react';
import { useAdminStore } from '../../../../../store/adminStore';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const TeacherAttendance = () => {
    // Store Actions & State
    const branches = useAdminStore(state => state.branches);
    const academicYears = useAdminStore(state => state.academicYears);
    const teacherAttendance = useAdminStore(state => state.teacherAttendance);
    const fetchBranches = useAdminStore(state => state.fetchBranches);
    const fetchAcademicYears = useAdminStore(state => state.fetchAcademicYears);
    const fetchTeacherAttendanceHistory = useAdminStore(state => state.fetchTeacherAttendanceHistory);
    const markTeacherAttendance = useAdminStore(state => state.markTeacherAttendance);

    // Local State
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [displayData, setDisplayData] = useState([]);
    const itemsPerPage = 5;
    
    const [filters, setFilters] = useState({
        branchId: '',
        academicYearId: '',
        date: new Date().toISOString().split('T')[0],
    });

    const [selectedTeachers, setSelectedTeachers] = useState([]);

    // Reset page on filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filters.branchId, filters.date, searchTerm]);

    // Initial Data Fetch
    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    // Handle Branch Change
    useEffect(() => {
        if (filters.branchId) {
            fetchAcademicYears(filters.branchId);
            setFilters(prev => ({ ...prev, academicYearId: '' }));
        }
    }, [filters.branchId, fetchAcademicYears]);

    // Load Attendance Data (Master List + Marked Records)
    const loadAttendance = async () => {
        if (!filters.branchId) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            
            // 1. Fetch Master List of Teachers/Staff for this branch
            const teachersRes = await axios.get(`${API_URL}/teacher-attendance/teachers?branchId=${filters.branchId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // 2. Fetch Marked Attendance for the selected date
            const attendanceRes = await axios.get(`${API_URL}/teacher-attendance/by-date?branchId=${filters.branchId}&date=${filters.date}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (teachersRes.data.success && attendanceRes.data.success) {
                const allEmployees = teachersRes.data.data;
                const dailyAttendance = attendanceRes.data.data;

                // Merge: For each employee, find their attendance record
                const combined = allEmployees.map(emp => {
                    const record = dailyAttendance.find(att => 
                        (att.employeeId === emp.id) || (att.teacherId === emp.id)
                    );
                    return {
                        ...emp,
                        status: record ? record.status : 'Not Marked',
                        checkInTime: record ? record.checkInTime : null,
                        checkOutTime: record ? record.checkOutTime : null,
                        attendanceId: record ? record._id : null
                    };
                });

                setDisplayData(combined);
            }
        } catch (error) {
            console.error('Failed to load teacher list/attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (filters.branchId) {
            loadAttendance();
            setSelectedTeachers([]); // Reset selection on branch/date change
        }
    }, [filters.branchId, filters.date]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedTeachers(filteredData.map(t => t.id));
        } else {
            setSelectedTeachers([]);
        }
    };

    const handleSelectOne = (id) => {
        setSelectedTeachers(prev => 
            prev.includes(id) 
                ? prev.filter(item => item !== id) 
                : [...prev, id]
        );
    };

    // Derived & Filtered Data
    const filteredData = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        return displayData.filter(entry => {
            const name = (entry.name || '').toLowerCase();
            const empId = (entry.employeeId || '').toLowerCase();
            const dept = (entry.department || '').toLowerCase();
            return name.includes(lowerSearch) || empId.includes(lowerSearch) || dept.includes(lowerSearch);
        });
    }, [displayData, searchTerm]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const stats = useMemo(() => {
        const total = filteredData.length;
        const present = filteredData.filter(s => s.status === 'Present').length;
        const absent = filteredData.filter(s => s.status === 'Absent').length;
        const late = filteredData.filter(s => s.status === 'Late').length;
        const halfDay = filteredData.filter(s => s.status === 'Half-Day').length;
        const leave = filteredData.filter(s => s.status === 'Leave').length;

        return { total, present, absent, late, halfDay, leave };
    }, [filteredData]);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Present': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Absent': return 'bg-rose-50 text-rose-700 border-rose-100';
            case 'Late': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'Half-Day': return 'bg-orange-50 text-orange-700 border-orange-100';
            case 'Leave': return 'bg-blue-50 text-blue-700 border-blue-100';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    const handleExportPDF = () => {
        const doc = new jsPDF('l', 'mm', 'a4'); // Landscape
        const branchName = branches.find(b => b._id === filters.branchId)?.name || 'All';
        
        const dataToExport = selectedTeachers.length > 0 
            ? filteredData.filter(t => selectedTeachers.includes(t.id))
            : filteredData;

        doc.setFontSize(20);
        doc.text("Teacher Attendance Report", 14, 15);
        doc.setFontSize(10);
        doc.text(`Branch: ${branchName}`, 14, 22);
        doc.text(`Date: ${format(new Date(filters.date), 'dd MMM yyyy')}`, 14, 27);
        if (selectedTeachers.length > 0) {
            doc.text(`Selected Records: ${selectedTeachers.length}`, 14, 32);
        }

        const tableColumn = ["Teacher Name", "ID", "Department", "Designation", "Status", "In Time", "Out Time"];
        const tableRows = dataToExport.map(att => [
            att.name,
            att.employeeId || '-',
            att.department || '-',
            att.designation || 'Teacher',
            att.status,
            att.checkInTime ? format(new Date(att.checkInTime), 'hh:mm a') : '-',
            att.checkOutTime ? format(new Date(att.checkOutTime), 'hh:mm a') : '-'
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 45,
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229] }
        });

        doc.save(`Teacher_Attendance_${branchName}.pdf`);
    };

    const handleStatusChange = async (teacher, status) => {
        if (!filters.branchId || !filters.academicYearId) {
            useAdminStore.getState().addToast('Please select Branch and Academic Year', 'warning');
            return;
        }

        try {
            await markTeacherAttendance({
                teacherId: teacher.id,
                date: filters.date,
                status: status,
                branchId: filters.branchId,
                academicYearId: filters.academicYearId,
                employeeType: teacher.type, // Added this
                attendanceId: teacher.attendanceId // Optional, for updates
            });
            loadAttendance(); // Refresh
        } catch (error) {
            console.error('Failed to mark attendance:', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Teacher Attendance
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">Monitoring staff presence and punctuality</p>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={loadAttendance}
                        className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button 
                        onClick={handleExportPDF}
                        disabled={filteredData.length === 0}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all"
                    >
                        <Download size={18} />
                        <span>{selectedTeachers.length > 0 ? `Export Selected (${selectedTeachers.length})` : 'Export Report'}</span>
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard label="Total Records" value={stats.total} color="slate" icon={<Users className="text-slate-500" />} />
                <StatCard label="Present" value={stats.present} color="emerald" icon={<CheckCircle2 className="text-emerald-500" />} />
                <StatCard label="Absent" value={stats.absent} color="rose" icon={<XCircle className="text-rose-500" />} />
                <StatCard label="Late" value={stats.late} color="amber" icon={<Clock className="text-amber-500" />} />
                <StatCard label="Half-Day" value={stats.halfDay} color="orange" icon={<Clock className="text-orange-500" />} />
                <StatCard label="Leave" value={stats.leave} color="blue" icon={<UserMinus className="text-blue-500" />} />
            </div>

            {/* Filters */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Branch</label>
                        <select 
                            value={filters.branchId}
                            onChange={(e) => setFilters(prev => ({ ...prev, branchId: e.target.value }))}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-500 transition-all outline-none"
                        >
                            <option value="">Select Branch</option>
                            {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Academic Year</label>
                        <select 
                            value={filters.academicYearId}
                            onChange={(e) => setFilters(prev => ({ ...prev, academicYearId: e.target.value }))}
                            disabled={!filters.branchId}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-500 transition-all outline-none disabled:opacity-50"
                        >
                            <option value="">Select AY</option>
                            {academicYears.map(ay => <option key={ay._id} value={ay._id}>{ay.name}</option>)}
                        </select>
                    </div>

                    <div className="space-y-1.5 lg:col-span-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Attendance Date</label>
                        <div className="relative group">
                            <CalendarIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors" />
                            <input 
                                type="date" 
                                value={filters.date}
                                onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-500 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Search Teacher</label>
                        <div className="relative">
                            <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:bg-white focus:border-indigo-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 w-10">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        onChange={handleSelectAll}
                                        checked={filteredData.length > 0 && selectedTeachers.length === filteredData.length}
                                    />
                                </th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Teacher Details</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Employee ID</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Timing</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)
                            ) : paginatedData.length > 0 ? (
                                paginatedData.map((att) => (
                                    <tr key={att.id} className={twMerge(
                                        "hover:bg-slate-50/50 transition-colors",
                                        selectedTeachers.includes(att.id) ? "bg-indigo-50/30" : ""
                                    )}>
                                        <td className="px-6 py-4">
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                checked={selectedTeachers.includes(att.id)}
                                                onChange={() => handleSelectOne(att.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-600">
                                            {format(new Date(filters.date), 'dd MMM yyyy')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900">
                                                {att.name}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{att.designation} • {att.department}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-500">
                                            {att.employeeId || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={twMerge(
                                                "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5 w-fit",
                                                getStatusStyles(att.status)
                                            )}>
                                                {att.status === 'Not Marked' && <AlertCircle size={12} />}
                                                {att.status === 'Present' && <CheckCircle2 size={12} />}
                                                {att.status === 'Absent' && <XCircle size={12} />}
                                                {att.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="text-xs font-bold text-slate-600 flex items-center gap-1">
                                                    <Clock size={10} className="text-slate-400" />
                                                    In: {att.checkInTime ? format(new Date(att.checkInTime), 'hh:mm a') : '--:--'}
                                                </div>
                                                <div className="text-xs text-slate-400 pl-3.5">Out: {att.checkOutTime ? format(new Date(att.checkOutTime), 'hh:mm a') : '--:--'}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button 
                                                    onClick={() => handleStatusChange(att, 'Present')}
                                                    className={twMerge(
                                                        "px-2 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all active:scale-95",
                                                        att.status === 'Present' ? "bg-emerald-500 text-white shadow-md shadow-emerald-200" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                                    )}
                                                >P</button>
                                                <button 
                                                    onClick={() => handleStatusChange(att, 'Absent')}
                                                    className={twMerge(
                                                        "px-2 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all active:scale-95",
                                                        att.status === 'Absent' ? "bg-rose-500 text-white shadow-md shadow-rose-200" : "bg-rose-50 text-rose-600 hover:bg-rose-100"
                                                    )}
                                                >A</button>
                                                <button 
                                                    onClick={() => handleStatusChange(att, 'Leave')}
                                                    className={twMerge(
                                                        "px-2 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all active:scale-95",
                                                        att.status === 'Leave' ? "bg-blue-500 text-white shadow-md shadow-blue-200" : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                                    )}
                                                >L</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="px-6 py-20 text-center text-slate-400 font-medium">
                                        {!filters.branchId ? "Select a branch to view attendance" : "No attendance records found for this period"}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <button 
                                key={i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                                className={twMerge(
                                    "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                                    currentPage === i + 1 
                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ label, value, color, icon }) => {
    const colorMap = {
        emerald: 'from-emerald-500/10 to-emerald-500/5 text-emerald-600 border-emerald-500/10',
        rose: 'from-rose-500/10 to-rose-500/5 text-rose-600 border-rose-500/10',
        amber: 'from-amber-500/10 to-amber-500/5 text-amber-600 border-amber-500/10',
        orange: 'from-orange-500/10 to-orange-500/5 text-orange-600 border-orange-500/10',
        blue: 'from-blue-500/10 to-blue-500/5 text-blue-600 border-blue-500/10',
        slate: 'from-slate-500/10 to-slate-500/5 text-slate-600 border-slate-500/10',
    };

    return (
        <div className={twMerge(
            "p-5 rounded-3xl border bg-gradient-to-br shadow-sm transition-all hover:scale-[1.02]",
            colorMap[color]
        )}>
            <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-white/80 rounded-xl shadow-sm border border-white/50">{icon}</div>
            </div>
            <div>
                <div className="text-2xl font-black">{value}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-60">{label}</div>
            </div>
        </div>
    );
};

const SkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="px-6 py-4"><div className="h-4 w-4 bg-slate-100 rounded" /></td>
        <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-100 rounded" /></td>
        <td className="px-6 py-4">
            <div className="h-4 w-32 bg-slate-100 rounded mb-1" />
            <div className="h-3 w-16 bg-slate-50 rounded" />
        </td>
        <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-100 rounded" /></td>
        <td className="px-6 py-4"><div className="h-6 w-20 bg-slate-100 rounded-full" /></td>
        <td className="px-6 py-4"><div className="h-8 w-24 bg-slate-100 rounded" /></td>
    </tr>
);

export default TeacherAttendance;
