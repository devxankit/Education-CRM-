
import React, { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../../../../store/adminStore';

// Components
import StudentStatsCards from './components/StudentStatsCards';
import StudentFilters from './components/StudentFilters';
import StudentTable from './components/StudentTable';

const StudentList = () => {
    const navigate = useNavigate();
    const students = useAdminStore(state => state.students);
    const fetchStudents = useAdminStore(state => state.fetchStudents);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const classOptions = useMemo(
        () => [...new Set(students.map((student) => student.classId?.name || student.class).filter(Boolean))],
        [students]
    );

    const sectionOptions = useMemo(
        () => [...new Set(students.map((student) => student.sectionId?.name || student.section).filter(Boolean))],
        [students]
    );

    const statusOptions = useMemo(
        () => [...new Set(students.map((student) => student.status).filter(Boolean))],
        [students]
    );

    const filteredStudents = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return students.filter((student) => {
            const fullName = (student.name || `${student.firstName || ''} ${student.lastName || ''}`).trim();
            const admissionNo = student.admissionNo || student.admNo || '';
            const rollNo = student.rollNo || student.roll || '';
            const studentId = student._id || student.id || '';
            const className = student.classId?.name || student.class || '';
            const sectionName = student.sectionId?.name || student.section || '';
            const status = (student.status || '').toLowerCase();
            const parentName = student.parentId?.name || student.parentName || '';

            const matchesSearch = !normalizedSearch || [fullName, admissionNo, rollNo, studentId, parentName]
                .some((value) => String(value).toLowerCase().includes(normalizedSearch));

            const matchesClass = !selectedClass || className === selectedClass;
            const matchesSection = !selectedSection || sectionName === selectedSection;
            const matchesStatus = !selectedStatus || status === selectedStatus.toLowerCase();

            return matchesSearch && matchesClass && matchesSection && matchesStatus;
        });
    }, [students, searchTerm, selectedClass, selectedSection, selectedStatus]);

    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedClass('');
        setSelectedSection('');
        setSelectedStatus('');
    };

    const handleExportStudents = () => {
        const headers = ['Name', 'Admission No', 'Roll No', 'Class', 'Section', 'Status', 'Parent', 'Parent Mobile'];
        const csvRows = [
            headers.join(','),
            ...filteredStudents.map((student) => ([
                student.name || `${student.firstName || ''} ${student.lastName || ''}`.trim(),
                student.admissionNo || student.admNo || '',
                student.rollNo || student.roll || '',
                student.classId?.name || student.class || '',
                student.sectionId?.name || student.section || '',
                student.status || '',
                student.parentId?.name || student.parentName || '',
                student.parentId?.mobile || student.parentMobile || ''
            ].map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')))
        ];

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'students.csv';
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Student Management</h1>
                    <p className="text-gray-500 text-sm">Manage student profiles, admissions, and academic records.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/people/students/add')}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg font-medium transition-all"
                    >
                        <Plus size={18} /> New Admission
                    </button>
                </div>
            </div>

            {/* Stats */}
            <StudentStatsCards />

            {/* Filters */}
            <StudentFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedClass={selectedClass}
                onClassChange={setSelectedClass}
                classOptions={classOptions}
                selectedSection={selectedSection}
                onSectionChange={setSelectedSection}
                sectionOptions={sectionOptions}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                statusOptions={statusOptions}
                onResetFilters={handleResetFilters}
                onExport={handleExportStudents}
            />

            {/* Table */}
            <StudentTable students={filteredStudents} />

        </div>
    );
};

export default StudentList;
