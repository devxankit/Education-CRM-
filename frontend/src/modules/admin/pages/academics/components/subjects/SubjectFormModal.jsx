import React, { useState, useEffect } from 'react';
import { X, BookOpen, AlertCircle, GraduationCap, School, MapPin, Calendar } from 'lucide-react';
import { useAdminStore } from '../../../../../../store/adminStore';

const SubjectFormModal = ({ isOpen, onClose, onCreate, initialData, classes = [], courses = [], defaultBranchId = '' }) => {
    const branches = useAdminStore(state => state.branches);
    const academicYears = useAdminStore(state => state.academicYearsForSelect || []);
    const fetchBranches = useAdminStore(state => state.fetchBranches);
    const fetchAcademicYears = useAdminStore(state => state.fetchAcademicYears);
    const fetchClasses = useAdminStore(state => state.fetchClasses);
    const fetchCourses = useAdminStore(state => state.fetchCourses);

    const [formData, setFormData] = useState({
        branchId: '',
        academicYearId: '',
        name: '',
        code: '',
        type: 'theory',
        level: '',
        classIds: [],
        courseIds: []
    });

    useEffect(() => {
        if (isOpen && branches.length === 0) fetchBranches();
    }, [isOpen, branches, fetchBranches]);

    const prevOpenRef = React.useRef(false);
    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                branchId: initialData.branchId?._id || initialData.branchId || '',
                academicYearId: initialData.academicYearId?._id || initialData.academicYearId || '',
                classIds: initialData.classIds ? (initialData.classIds.map(c => c._id || c)) : [],
                courseIds: initialData.courseIds ? (initialData.courseIds.map(c => c._id || c)) : []
            });
        } else if (isOpen && !prevOpenRef.current) {
            const bid = defaultBranchId || branches[0]?._id || '';
            setFormData({
                branchId: bid,
                academicYearId: '',
                name: '',
                code: '',
                type: 'theory',
                level: '',
                classIds: [],
                courseIds: []
            });
        }
        prevOpenRef.current = isOpen;
    }, [initialData, isOpen, defaultBranchId, branches]);

    // Fetch academic years when branch changes
    useEffect(() => {
        if (isOpen && formData.branchId && formData.branchId.length === 24) {
            fetchAcademicYears(formData.branchId);
        }
    }, [isOpen, formData.branchId, fetchAcademicYears]);

    // Fetch classes & courses when branch/academic year changes (for Assignment)
    useEffect(() => {
        if (isOpen && formData.branchId && formData.branchId.length === 24) {
            fetchClasses(formData.branchId, true, formData.academicYearId || undefined);
            fetchCourses(formData.branchId);
        }
    }, [isOpen, formData.branchId, formData.academicYearId, fetchClasses, fetchCourses]);

    useEffect(() => {
        if (isOpen && formData.branchId && academicYears.length > 0 && !formData.academicYearId) {
            const active = academicYears.find(y => y.status === 'active') || academicYears[0];
            setFormData(prev => ({ ...prev, academicYearId: active?._id || '' }));
        }
    }, [isOpen, formData.branchId, academicYears]);

    if (!isOpen) return null;

    const yearsToShow = formData.branchId ? academicYears : [];

    // Filter classes based on Academic Level (for School level)
    const getFilteredClasses = () => {
        if (formData.level !== 'school') return [];
        
        // Map Academic Level (from subject form) to Class level (from class model)
        // Subject Academic Level -> Class Level mapping:
        // 'school' -> 'primary', 'secondary', 'senior_secondary'
        const levelMapping = {
            'school': ['primary', 'secondary', 'senior_secondary']
        };
        
        const allowedLevels = levelMapping[formData.level] || [];
        if (allowedLevels.length === 0) return [];
        
        return classes.filter(cls => {
            const classLevel = (cls.level || '').toLowerCase();
            return allowedLevels.includes(classLevel);
        });
    };

    // Filter courses based on Academic Level (for UG/PG levels)
    const getFilteredCourses = () => {
        if (!formData.level || formData.level === 'school') return [];
        
        // For UG/PG, show courses matching the level
        // Course type can be "UG", "PG", "Diploma", etc. (case-insensitive matching)
        return courses.filter(course => {
            const courseType = (course.type || '').toLowerCase();
            if (formData.level === 'ug') {
                // Match UG, Undergraduate, or any course that contains 'ug' or 'undergraduate'
                return courseType === 'ug' || 
                       courseType === 'undergraduate' || 
                       courseType.includes('ug') ||
                       courseType.includes('undergraduate');
            } else if (formData.level === 'pg') {
                // Match PG, Postgraduate, or any course that contains 'pg' or 'postgraduate'
                return courseType === 'pg' || 
                       courseType === 'postgraduate' || 
                       courseType.includes('pg') ||
                       courseType.includes('postgraduate');
            }
            return false;
        });
    };

    const filteredClasses = getFilteredClasses();
    const filteredCourses = getFilteredCourses();
    const isSchoolLevel = formData.level === 'school';
    const isCollegeLevel = formData.level === 'ug' || formData.level === 'pg';

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedData = { ...formData, [name]: value };
        
        if (name === 'branchId') {
            updatedData.academicYearId = '';
            updatedData.classIds = [];
            updatedData.courseIds = [];
        }
        if (name === 'academicYearId') {
            updatedData.classIds = [];
            updatedData.courseIds = [];
        }
        if (name === 'level') {
            updatedData.classIds = [];
            updatedData.courseIds = [];
        }
        
        setFormData(updatedData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.branchId || formData.branchId.length !== 24) {
            alert('Please select a Branch.');
            return;
        }
        if (!formData.academicYearId) {
            alert('Please select an Academic Year.');
            return;
        }
        if (!formData.level) {
            alert('Please select Academic Level.');
            return;
        }
        if (isSchoolLevel && formData.classIds.length === 0) {
            alert('Please select at least one class for School level subjects.');
            return;
        }
        if (isCollegeLevel && formData.courseIds.length === 0) {
            alert('Please select at least one course/program for College level subjects.');
            return;
        }
        
        const submitData = {
            ...formData,
            branchId: formData.branchId,
            academicYearId: formData.academicYearId,
            classIds: isSchoolLevel ? formData.classIds : [],
            courseIds: isCollegeLevel ? formData.courseIds : []
        };
        
        onCreate(submitData);
        onClose();
    };

    const isEdit = !!initialData;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-scale-in">

                {/* Header */}
                <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white shrink-0">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <BookOpen size={20} /> {isEdit ? 'Edit Subject' : 'New Subject Definition'}
                    </h3>
                    <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded transition-colors"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-5 min-h-0">

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <MapPin size={14} className="inline mr-1 align-middle" /> Branch
                            </label>
                            <select
                                name="branchId" required
                                value={formData.branchId} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                            >
                                <option value="">Select Branch</option>
                                {branches.map(b => (
                                    <option key={b._id} value={b._id}>{b.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Calendar size={14} className="inline mr-1 align-middle" /> Academic Year <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="academicYearId" required
                                value={formData.academicYearId} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                                disabled={!formData.branchId}
                            >
                                <option value="">{formData.branchId ? 'Select Academic Year' : 'Select Branch first'}</option>
                                {yearsToShow.map(y => (
                                    <option key={y._id} value={y._id}>{y.name}</option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-400 mt-0.5">Academic years for selected branch only.</p>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Academic Level <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="level" required
                                value={formData.level} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            >
                                <option value="">Select Academic Level</option>
                                <option value="school">School (K-12)</option>
                                <option value="ug">Undergraduate</option>
                                <option value="pg">Postgraduate</option>
                            </select>
                        </div>

                        {/* School: Assign to Classes */}
                        {isSchoolLevel && (
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <School size={16} className="text-indigo-600" />
                                    Assign to Classes
                                </label>
                                <div className="border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto grid grid-cols-2 gap-2 bg-gray-50/30">
                                    {filteredClasses.length === 0 ? (
                                        <span className="text-gray-400 italic col-span-2 text-center py-2">
                                            No classes available for School (K-12) level. Please create classes first.
                                        </span>
                                    ) : (
                                        filteredClasses.map(cls => (
                                            <label key={cls._id || cls.id} className="flex items-center gap-2 text-xs text-gray-600 hover:text-indigo-600 cursor-pointer p-1 hover:bg-white rounded transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.classIds.includes(cls._id || cls.id)}
                                                    onChange={(e) => {
                                                        const id = cls._id || cls.id;
                                                        const currentIds = [...formData.classIds];
                                                        if (e.target.checked) {
                                                            setFormData({ ...formData, classIds: [...currentIds, id] });
                                                        } else {
                                                            setFormData({ ...formData, classIds: currentIds.filter(i => i !== id) });
                                                        }
                                                    }}
                                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span>{cls.name}</span>
                                            </label>
                                        ))
                                    )}
                                </div>
                                {filteredClasses.length > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Showing {filteredClasses.length} class{filteredClasses.length !== 1 ? 'es' : ''} for School (K-12) level
                                    </p>
                                )}
                            </div>
                        )}

                        {/* College Level: Assign to Courses/Programs */}
                        {isCollegeLevel && (
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <GraduationCap size={16} className="text-indigo-600" />
                                    Assign to Courses/Programs
                                </label>
                                <div className="border border-gray-200 rounded-lg p-3 max-h-40 overflow-y-auto grid grid-cols-2 gap-2 bg-gray-50/30">
                                    {filteredCourses.length === 0 ? (
                                        <span className="text-gray-400 italic col-span-2 text-center py-2">
                                            No courses available for {formData.level === 'ug' ? 'Undergraduate' : 'Postgraduate'} level. Please create courses/programs first.
                                        </span>
                                    ) : (
                                        filteredCourses.map(course => (
                                            <label key={course._id || course.id} className="flex items-center gap-2 text-xs text-gray-600 hover:text-indigo-600 cursor-pointer p-1 hover:bg-white rounded transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.courseIds.includes(course._id || course.id)}
                                                    onChange={(e) => {
                                                        const id = course._id || course.id;
                                                        const currentIds = [...formData.courseIds];
                                                        if (e.target.checked) {
                                                            setFormData({ ...formData, courseIds: [...currentIds, id] });
                                                        } else {
                                                            setFormData({ ...formData, courseIds: currentIds.filter(i => i !== id) });
                                                        }
                                                    }}
                                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <span className="flex flex-col">
                                                    <span className="font-medium">{course.name}</span>
                                                    <span className="text-gray-400 text-[10px]">{course.code} • {course.duration} Years</span>
                                                </span>
                                            </label>
                                        ))
                                    )}
                                </div>
                                {filteredCourses.length > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} for {formData.level === 'ug' ? 'Undergraduate' : 'Postgraduate'} level
                                    </p>
                                )}
                            </div>
                        )}

                        {/* No Level Selected */}
                        {!formData.level && (
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Assignment
                                    <span className="text-xs text-gray-400 ml-2">(Select Academic Level)</span>
                                </label>
                                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/30 text-center">
                                    <p className="text-gray-400 text-sm">
                                        {formData.branchId && formData.academicYearId
                                            ? 'Select Academic Level to assign this subject to classes or courses.'
                                            : 'Select Branch and Academic Year first, then Academic Level.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                            <input
                                type="text" name="name" required
                                placeholder="e.g. Mathematics, Physics Lab"
                                value={formData.name} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        {isEdit && (
                            <div className="col-span-2 bg-gray-50 p-3 rounded border border-gray-200 flex items-center gap-3">
                                <div className="text-xs text-gray-500 font-mono">CODE: <span className="text-gray-900 font-bold">{formData.code}</span></div>
                                <span className="text-[10px] text-amber-600 bg-amber-50 px-1 rounded border border-amber-200">Immutable</span>
                            </div>
                        )}

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                name="type" required
                                value={formData.type} onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none bg-white"
                            >
                                <option value="theory">Theory Only</option>
                                <option value="practical">Practical Only</option>
                                <option value="theory_practical">Theory + Practical</option>
                            </select>
                        </div>
                    </div>

                    {isEdit && (
                        <div className="flex gap-2 p-3 bg-blue-50 text-blue-800 text-xs rounded border border-blue-100">
                            <AlertCircle size={16} className="shrink-0" />
                            <p>Updates to Subject Name will reflect across all historic records. Ensure consistency.</p>
                        </div>
                    )}
                </div>

                    <div className="p-6 pt-4 flex justify-end gap-3 border-t border-gray-100 bg-white shrink-0">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                        <button type="submit" className="px-6 py-2 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm">
                            {isEdit ? 'Update Subject' : 'Create Subject'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default SubjectFormModal;
