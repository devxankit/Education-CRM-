import React, { useState, useEffect, useMemo } from 'react';
import { 
    Users, 
    Calendar as CalendarIcon, 
    Search, 
    Filter, 
    Download, 
    RefreshCcw,
    ChevronRight,
    Search as SearchIcon,
    ArrowUpDown,
    CheckCircle2,
    XCircle,
    Clock,
    UserMinus,
    AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../../../../store/adminStore';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Premium Student Attendance View for Admin
 * Features: Branch, Class, Section, Course filters, Date selection, Export
 */
const StudentAttendance = () => {
    const navigate = useNavigate();
    // Store Actions & State
    const branches = useAdminStore(state => state.branches);
    const classes = useAdminStore(state => state.classes);
    const sections = useAdminStore(state => state.sections);
    const courses = useAdminStore(state => state.courses);
    const academicYears = useAdminStore(state => state.academicYears);
    const fetchBranches = useAdminStore(state => state.fetchBranches);
    const fetchClasses = useAdminStore(state => state.fetchClasses);
    const fetchSections = useAdminStore(state => state.fetchSections);
    const fetchCourses = useAdminStore(state => state.fetchCourses);
    const fetchAcademicYears = useAdminStore(state => state.fetchAcademicYears);
    const fetchMasterAttendance = useAdminStore(state => state.fetchMasterAttendance);

    // Local State
    const [loading, setLoading] = useState(false);
    const [attendanceData, setAttendanceData] = useState(null);
    const [noRecordStudents, setNoRecordStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState([]);
    const itemsPerPage = 8;
    
    // Filter State
    const [filters, setFilters] = useState({
        branchId: 'all',
        classId: 'all',
        sectionId: 'all',
        courseId: 'all',
        academicYearId: 'all',
        date: new Date().toISOString().split('T')[0]
    });

    // Initial Data Fetch: Only Branches
    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    // Handle Branch Change: Fetch Academic Years for that branch
    useEffect(() => {
        if (filters.branchId && filters.branchId !== 'all') {
            fetchAcademicYears(filters.branchId);
            // Reset lower filters
            setFilters(prev => ({ 
                ...prev, 
                academicYearId: 'all', 
                classId: 'all', 
                sectionId: 'all', 
                courseId: 'all' 
            }));
        }
    }, [filters.branchId, fetchAcademicYears]);

    // Handle AY Change: Fetch Classes & Courses for that branch + AY
    useEffect(() => {
        if (filters.branchId !== 'all' && filters.academicYearId !== 'all') {
            fetchClasses(filters.branchId, false, filters.academicYearId);
            fetchCourses(filters.branchId, filters.academicYearId);
            // Reset lower filters
            setFilters(prev => ({ 
                ...prev, 
                classId: 'all', 
                sectionId: 'all', 
                courseId: 'all' 
            }));
        }
    }, [filters.branchId, filters.academicYearId, fetchClasses, fetchCourses]);

    // Fetch Sections when Class changes
    useEffect(() => {
        if (filters.classId && filters.classId !== 'all') {
            fetchSections(filters.classId);
            setFilters(prev => ({ ...prev, sectionId: 'all' }));
        }
    }, [filters.classId, fetchSections]);

    // Load Attendance Data
    const loadAttendance = async () => {
        setLoading(true);
        try {
            const result = await fetchMasterAttendance(filters);
            if (result.success) {
                if (result.data) {
                    setAttendanceData(result.data);
                    setNoRecordStudents([]);
                } else {
                    setAttendanceData(null);
                    setNoRecordStudents(result.students || []);
                }
            }
        } catch (error) {
            console.error('Failed to load attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAttendance();
    }, [filters.branchId, filters.classId, filters.sectionId, filters.courseId, filters.date]);

    // Derived Data
    const displayData = useMemo(() => {
        if (attendanceData) {
            return attendanceData.attendanceData.map(entry => ({
                id: entry.studentId?._id || entry.studentId,
                name: `${entry.studentId?.firstName || ''} ${entry.studentId?.lastName || ''}`.trim() || 'N/A',
                admissionNo: entry.studentId?.admissionNo || '-',
                rollNo: entry.studentId?.rollNo || '-',
                status: entry.status,
                remarks: entry.remarks || '-',
                photo: entry.studentId?.photo || null,
                gender: entry.studentId?.gender || '-'
            }));
        } else if (noRecordStudents.length > 0) {
            return noRecordStudents.map(item => ({
                id: item.studentId?._id || item.studentId,
                name: `${item.studentId?.firstName || ''} ${item.studentId?.lastName || ''}`.trim() || 'N/A',
                admissionNo: item.studentId?.admissionNo || '-',
                rollNo: item.studentId?.rollNo || '-',
                status: 'Not Marked',
                remarks: '-',
                photo: item.studentId?.photo || null,
                gender: item.studentId?.gender || '-'
            }));
        }
        return [];
    }, [attendanceData, noRecordStudents]);

    useEffect(() => {
        setCurrentPage(1);
        setSelectedIds([]); // Reset selection on search or filter change
    }, [searchTerm, filters]);

    const filteredDisplayData = useMemo(() => {
        if (!searchTerm) return displayData;
        const lowerSearch = searchTerm.toLowerCase();
        return displayData.filter(student => 
            student.name.toLowerCase().includes(lowerSearch) || 
            student.admissionNo.toLowerCase().includes(lowerSearch) ||
            student.rollNo.toString().includes(lowerSearch)
        );
    }, [displayData, searchTerm]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredDisplayData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredDisplayData, currentPage]);

    const totalPages = Math.ceil(filteredDisplayData.length / itemsPerPage);

    const stats = useMemo(() => {
        const total = displayData.length;
        const present = displayData.filter(s => s.status === 'Present').length;
        const absent = displayData.filter(s => s.status === 'Absent').length;
        const late = displayData.filter(s => s.status === 'Late').length;
        const leave = displayData.filter(s => s.status === 'Leave').length;
        const notMarked = displayData.filter(s => s.status === 'Not Marked').length;

        return { total, present, absent, late, leave, notMarked };
    }, [displayData]);

    // UI Helpers
    const getStatusStyles = (status) => {
        switch (status) {
            case 'Present': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Absent': return 'bg-rose-50 text-rose-700 border-rose-100';
            case 'Late': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'Leave': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'Not Marked': return 'bg-gray-50 text-gray-500 border-gray-100';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Present': return <CheckCircle2 size={14} />;
            case 'Absent': return <XCircle size={14} />;
            case 'Late': return <Clock size={14} />;
            case 'Leave': return <UserMinus size={14} />;
            case 'Not Marked': return <AlertCircle size={14} />;
            default: return null;
        }
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(filteredDisplayData.map(s => s.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

        // Table Data Source
        const dataToExport = selectedIds.length > 0 
            ? filteredDisplayData.filter(s => selectedIds.includes(s.id))
            : filteredDisplayData;

        // Recalculate stats for exported data
        const exportStats = {
            total: dataToExport.length,
            present: dataToExport.filter(s => s.status === 'Present').length,
            absent: dataToExport.filter(s => s.status === 'Absent').length,
            others: dataToExport.filter(s => !['Present', 'Absent'].includes(s.status)).length
        };
        
        // Add Title
        doc.setFontSize(22);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text("Attendance Report", 14, 20);
        
        // Add Metadata Header
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139); // slate-500
        const reportDate = format(new Date(filters.date), 'PPPP');
        doc.text(`Report Date: ${reportDate}`, 14, 28);
        doc.text(`Generated On: ${timestamp}`, 14, 33);
        
        // Filter Details
        const branchName = branches.find(b => b._id === filters.branchId)?.name || 'All Branches';
        const className = classes.find(c => c._id === filters.classId)?.name || 'All Classes';
        const sectionName = (sections[filters.classId] || []).find(s => s._id === filters.sectionId)?.name || 'All Sections';
        const courseName = courses.find(c => c._id === filters.courseId)?.name || 'All Courses';
        
        doc.setFontSize(11);
        doc.setTextColor(51, 65, 85); // slate-700
        doc.text(`Branch: ${branchName}`, 14, 42);
        doc.text(`Class: ${className} (${sectionName})`, 14, 48);
        doc.text(`Course: ${courseName}`, 14, 54);

        // Stats Box
        doc.setDrawColor(226, 232, 240); // slate-200
        doc.setFillColor(248, 250, 252); // slate-50
        doc.roundedRect(140, 38, 56, 22, 2, 2, 'FD');
        
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105); // slate-600
        doc.text(`Total: ${exportStats.total}`, 145, 43);
        doc.setTextColor(16, 185, 129); // emerald-500
        doc.text(`Present: ${exportStats.present}`, 145, 48);
        doc.setTextColor(244, 63, 94); // rose-500
        doc.text(`Absent: ${exportStats.absent}`, 145, 53);
        doc.setTextColor(245, 158, 11); // amber-500
        doc.text(`Others: ${exportStats.others}`, 170, 48);

        const tableColumn = ["#", "Student Name", "Admission No", "Roll No", "Status", "Gender"];
        const tableRows = dataToExport.map((student, index) => [
            index + 1,
            student.name,
            student.admissionNo,
            student.rollNo,
            student.status,
            student.gender
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 62,
            theme: 'striped',
            headStyles: { 
                fillColor: [15, 23, 42], 
                textColor: [255, 255, 255],
                fontSize: 10,
                fontStyle: 'bold',
                halign: 'left'
            },
            bodyStyles: { 
                fontSize: 9,
                textColor: [51, 65, 85]
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252]
            },
            columnStyles: {
                0: { cellWidth: 10 },
                4: { fontStyle: 'bold' }
            },
            didParseCell: (data) => {
                if (data.section === 'body' && data.column.index === 4) {
                    const status = data.cell.raw;
                    if (status === 'Present') data.cell.styles.textColor = [5, 150, 105];
                    if (status === 'Absent') data.cell.styles.textColor = [220, 38, 38];
                }
            }
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184); // slate-400
            doc.text(
                `Page ${i} of ${pageCount} - Generated by Education CRM`,
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }

        doc.save(`Attendance_Report_${filters.date}_${className}.pdf`);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-['Poppins']">
                        Attendance Master
                    </h1>
                    <div className="flex items-center gap-2 text-slate-500">
                        <CalendarIcon size={16} />
                        <span className="text-sm font-medium">
                            {format(new Date(filters.date), 'PPPP')}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={loadAttendance}
                        className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    >
                        <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button 
                        onClick={handleExportPDF}
                        className={twMerge(
                            "flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-semibold shadow-xl active:scale-95",
                            selectedIds.length > 0 
                                ? "bg-indigo-600 text-white shadow-indigo-200" 
                                : "bg-slate-900 text-white shadow-slate-200"
                        )}
                    >
                        <Download size={18} />
                        <span>{selectedIds.length > 0 ? `Export Selected (${selectedIds.length})` : 'Export Filtered'}</span>
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard label="Total Students" value={stats.total} color="slate" icon={<Users className="text-slate-500" />} />
                <StatCard label="Present" value={stats.present} color="emerald" icon={<CheckCircle2 className="text-emerald-500" />} />
                <StatCard label="Absent" value={stats.absent} color="rose" icon={<XCircle className="text-rose-500" />} />
                <StatCard label="Late" value={stats.late} color="amber" icon={<Clock className="text-amber-500" />} />
                <StatCard label="Leave" value={stats.leave} color="blue" icon={<UserMinus className="text-blue-500" />} />
                <StatCard label="Not Marked" value={stats.notMarked} color="gray" icon={<AlertCircle className="text-gray-400" />} />
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                    {/* Branch Filter */}
                    <FilterSelect 
                        label="Branch"
                        value={filters.branchId}
                        onChange={(val) => setFilters(prev => ({ ...prev, branchId: val, classId: 'all', sectionId: 'all', courseId: 'all' }))}
                        options={[{ _id: 'all', name: 'All Branches' }, ...branches]}
                    />

                    {/* Academic Year Filter */}
                    <FilterSelect 
                        label="Academic Year"
                        value={filters.academicYearId}
                        onChange={(val) => setFilters(prev => ({ ...prev, academicYearId: val, classId: 'all', sectionId: 'all', courseId: 'all' }))}
                        options={[{ _id: 'all', name: 'Select AY' }, ...academicYears]}
                        disabled={filters.branchId === 'all'}
                    />

                    {/* Class Filter */}
                    <FilterSelect 
                        label="Class"
                        value={filters.classId}
                        onChange={(val) => setFilters(prev => ({ ...prev, classId: val, sectionId: 'all' }))}
                        options={[{ _id: 'all', name: 'Select Class' }, ...classes]}
                        disabled={filters.academicYearId === 'all'}
                    />

                    {/* Section Filter */}
                    <FilterSelect 
                        label="Section"
                        value={filters.sectionId}
                        onChange={(val) => setFilters(prev => ({ ...prev, sectionId: val }))}
                        options={[{ _id: 'all', name: 'Select Section' }, ...(sections[filters.classId] || [])]}
                        disabled={filters.classId === 'all'}
                    />

                    {/* Course Filter */}
                    <FilterSelect 
                        label="Course / Program"
                        value={filters.courseId}
                        onChange={(val) => setFilters(prev => ({ ...prev, courseId: val }))}
                        options={[{ _id: 'all', name: 'Select Course' }, ...courses]}
                        disabled={filters.academicYearId === 'all'}
                    />

                    {/* Date Picker */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Date</label>
                        <div className="relative group">
                            <CalendarIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors" />
                            <input 
                                type="date" 
                                value={filters.date}
                                onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold focus:bg-white focus:border-indigo-500 transition-all outline-none"
                            />
                        </div>
                    </div>

                    {/* Search Field */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Search</label>
                        <div className="relative group">
                            <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors" />
                            <input 
                                type="text"
                                placeholder="..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium focus:bg-white focus:border-indigo-500 transition-all outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 bg-slate-50/50">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                        checked={selectedIds.length === filteredDisplayData.length && filteredDisplayData.length > 0}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50/50">Student Info</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50/50">Adm. No / Roll</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50/50">Attendance Status</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50/50 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)
                            ) : paginatedData.length > 0 ? (
                                paginatedData.map((student) => (
                                    <tr 
                                        key={student.id} 
                                        className={twMerge(
                                            "hover:bg-slate-50/50 transition-colors group",
                                            selectedIds.includes(student.id) && "bg-indigo-50/30"
                                        )}
                                    >
                                        <td className="px-6 py-4">
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                                checked={selectedIds.includes(student.id)}
                                                onChange={() => handleSelectRow(student.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200 group-hover:border-slate-300 transition-all">
                                                    {student.photo ? (
                                                        <img src={student.photo} alt={student.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-sm bg-gradient-to-br from-slate-100 to-slate-200">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 leading-tight">{student.name}</div>
                                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">{student.gender}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-0.5">
                                                <div className="text-sm font-bold text-slate-700">{student.admissionNo}</div>
                                                <div className="text-[10px] font-semibold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded inline-block">ROLL: {student.rollNo}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={twMerge(
                                                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border",
                                                getStatusStyles(student.status)
                                            )}>
                                                {getStatusIcon(student.status)}
                                                {student.status}
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => navigate(`/admin/people/attendance/student/${student.id}`)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-all active:scale-95"
                                            >
                                                History
                                                <ChevronRight size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 bg-slate-50 rounded-full">
                                                <Search size={32} className="text-slate-300" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">No students found</p>
                                                <p className="text-sm text-slate-400">Adjust filters or search to see results.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredDisplayData.length)} of {filteredDisplayData.length}
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"
                            >
                                Previous
                            </button>
                            <div className="flex items-center gap-1">
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
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Helper Components
const StatCard = ({ label, value, color, icon }) => {
    const colorMap = {
        emerald: 'from-emerald-500/10 to-emerald-500/5 text-emerald-600 border-emerald-500/10',
        rose: 'from-rose-500/10 to-rose-500/5 text-rose-600 border-rose-500/10',
        amber: 'from-amber-500/10 to-amber-500/5 text-amber-600 border-amber-500/10',
        blue: 'from-blue-500/10 to-blue-500/5 text-blue-600 border-blue-500/10',
        slate: 'from-slate-500/10 to-slate-500/5 text-slate-600 border-slate-500/10',
        gray: 'from-gray-500/10 to-gray-500/5 text-gray-500 border-gray-500/10',
    };

    return (
        <div className={twMerge(
            "p-5 rounded-3xl border bg-gradient-to-br shadow-sm transition-all hover:scale-[1.02]",
            colorMap[color]
        )}>
            <div className="flex justify-between items-start mb-3">
                <div className="p-2 bg-white/80 rounded-xl shadow-sm border border-white/50">
                    {icon}
                </div>
            </div>
            <div>
                <div className="text-2xl font-black">{value}</div>
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-60">{label}</div>
            </div>
        </div>
    );
};

const FilterSelect = ({ label, value, onChange, options, disabled }) => (
    <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">{label}</label>
        <select 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={twMerge(
                "w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold focus:bg-white focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer",
                disabled && "opacity-50 cursor-not-allowed bg-slate-100"
            )}
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
        >
            {options.map(opt => (
                <option key={opt._id} value={opt._id}>{opt.name}</option>
            ))}
        </select>
    </div>
);

const SkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="px-6 py-4">
            <div className="w-4 h-4 bg-slate-100 rounded" />
        </td>
        <td className="px-6 py-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100" />
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-slate-100 rounded" />
                    <div className="h-3 w-16 bg-slate-50 rounded" />
                </div>
            </div>
        </td>
        <td className="px-6 py-4">
            <div className="space-y-2">
                <div className="h-4 w-24 bg-slate-100 rounded" />
                <div className="h-3 w-16 bg-slate-50 rounded" />
            </div>
        </td>
        <td className="px-6 py-4">
            <div className="h-8 w-24 bg-slate-100 rounded-full" />
        </td>
        <td className="px-6 py-4 text-right">
            <div className="h-4 w-20 bg-slate-100 rounded ml-auto" />
        </td>
    </tr>
);

export default StudentAttendance;
