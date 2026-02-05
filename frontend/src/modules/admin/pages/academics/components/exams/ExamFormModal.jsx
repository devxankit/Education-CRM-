import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Clock, MapPin, CheckCircle } from 'lucide-react';
import { useAdminExamStore } from '../../../../../../store/adminExamStore';
import { useAdminStore } from '../../../../../../store/adminStore';
import { useAppStore } from '../../../../../../store/index';

const ExamFormModal = ({ isOpen, onClose, exam }) => {
    const { createExam, updateExam, isProcessing } = useAdminExamStore();
    const { classes, subjects, fetchClasses, fetchSubjects, academicYears, fetchAcademicYears } = useAdminStore();
    const { user } = useAppStore();

    const [formData, setFormData] = useState({
        examName: '',
        examType: 'Internal',
        academicYearId: '',
        startDate: '',
        endDate: '',
        description: '',
        classes: [],
        subjects: [],
        status: 'Published'
    });

    const [selectedClasses, setSelectedClasses] = useState([]);
    const [examSubjects, setExamSubjects] = useState([]);

    useEffect(() => {
        if (isOpen) {
            const branchId = user?.branchId || 'main'; // Fallback
            fetchClasses(branchId);
            fetchSubjects(branchId);
            fetchAcademicYears();

            if (exam) {
                setFormData({
                    examName: exam.examName || '',
                    examType: exam.examType || 'Internal',
                    academicYearId: exam.academicYearId?._id || exam.academicYearId || '',
                    startDate: exam.startDate ? new Date(exam.startDate).toISOString().split('T')[0] : '',
                    endDate: exam.endDate ? new Date(exam.endDate).toISOString().split('T')[0] : '',
                    description: exam.description || '',
                    classes: exam.classes?.map(c => c._id || c) || [],
                    subjects: exam.subjects || [],
                    status: exam.status || 'Published'
                });
                setSelectedClasses(exam.classes?.map(c => c._id || c) || []);
                setExamSubjects(exam.subjects?.map(s => ({
                    ...s,
                    date: s.date ? new Date(s.date).toISOString().split('T')[0] : ''
                })) || []);
            } else {
                setFormData({
                    examName: '',
                    examType: 'Internal',
                    academicYearId: academicYears[0]?._id || '',
                    startDate: '',
                    endDate: '',
                    description: '',
                    classes: [],
                    subjects: [],
                    status: 'Published'
                });
                setSelectedClasses([]);
                setExamSubjects([]);
            }
        }
    }, [isOpen, exam, fetchClasses, fetchSubjects, fetchAcademicYears, user, academicYears]);

    const handleAddSubjectRow = () => {
        setExamSubjects([...examSubjects, {
            subjectId: '',
            date: '',
            startTime: '10:00 AM',
            endTime: '01:00 PM',
            maxMarks: 100,
            passingMarks: 33,
            roomNo: ''
        }]);
    };

    const handleRemoveSubjectRow = (index) => {
        setExamSubjects(examSubjects.filter((_, i) => i !== index));
    };

    const handleSubjectChange = (index, field, value) => {
        const updated = [...examSubjects];
        updated[index][field] = value;
        setExamSubjects(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalData = {
            ...formData,
            classes: selectedClasses,
            subjects: examSubjects.filter(s => s.subjectId) // Only include rows with a subject selected
        };

        let result;
        if (exam?._id) {
            result = await updateExam(exam._id, finalData);
        } else {
            result = await createExam(finalData);
        }

        if (result.success) {
            onClose();
        } else {
            alert(result.message || 'Something went wrong');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 font-['Poppins']">
                            {exam ? 'Edit Exam Schedule' : 'Schedule New Examination'}
                        </h2>
                        <p className="text-xs text-gray-400 font-medium tracking-wide flex items-center gap-1 mt-0.5 uppercase">
                            <CheckCircle size={12} className="text-indigo-500" />
                            Academic Year {academicYears.find(y => y._id === formData.academicYearId)?.name || 'Current'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {/* Basic Info Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-6 w-1 bg-indigo-500 rounded-full"></div>
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">General Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase ml-1">Exam Name / Title</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., First Mid-Term Examination 2025"
                                    value={formData.examName}
                                    onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase ml-1">Exam Type</label>
                                <select
                                    value={formData.examType}
                                    onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all shadow-sm"
                                >
                                    <option value="Internal">Internal</option>
                                    <option value="External">External</option>
                                    <option value="Competitive">Competitive</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase ml-1">Academic Year</label>
                                <select
                                    required
                                    value={formData.academicYearId}
                                    onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all shadow-sm"
                                >
                                    <option value="">Select Year</option>
                                    {academicYears.map(year => (
                                        <option key={year._id} value={year._id}>{year.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase ml-1">Start Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm shadow-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase ml-1">End Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="date"
                                        required
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Classes Selection */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-6 w-1 bg-amber-500 rounded-full"></div>
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Applicable Classes</h3>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 shadow-inner">
                            <div className="flex flex-wrap gap-2">
                                {classes.map(cls => (
                                    <label
                                        key={cls._id}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer text-xs font-bold ${selectedClasses.includes(cls._id)
                                                ? 'bg-indigo-600 border-indigo-700 text-white shadow-md'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={selectedClasses.includes(cls._id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedClasses([...selectedClasses, cls._id]);
                                                } else {
                                                    setSelectedClasses(selectedClasses.filter(id => id !== cls._id));
                                                }
                                            }}
                                        />
                                        {cls.name}
                                    </label>
                                ))}
                                {classes.length === 0 && <p className="text-xs text-gray-400 italic">No classes found.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Subject Schedule Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="h-6 w-1 bg-emerald-500 rounded-full"></div>
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Subject Wise Schedule</h3>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddSubjectRow}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                            >
                                <Plus size={14} /> Add Subject
                            </button>
                        </div>

                        <div className="space-y-3">
                            {examSubjects.map((row, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:border-indigo-200 transition-all flex flex-col md:flex-row gap-3 items-end">
                                    <div className="flex-1 min-w-[150px] w-full">
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Subject</label>
                                        <select
                                            required
                                            value={row.subjectId}
                                            onChange={(e) => handleSubjectChange(idx, 'subjectId', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-bold text-gray-700"
                                        >
                                            <option value="">Select Subject</option>
                                            {subjects.map(sub => (
                                                <option key={sub._id} value={sub._id}>{sub.name} ({sub.code})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-full md:w-32">
                                        <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" size={12} />
                                            <input
                                                type="date"
                                                required
                                                value={row.date}
                                                onChange={(e) => handleSubjectChange(idx, 'date', e.target.value)}
                                                className="w-full pl-8 pr-2 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 w-full md:w-48">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">S.Time</label>
                                            <div className="relative">
                                                <Clock className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300" size={12} />
                                                <input
                                                    type="text"
                                                    placeholder="10:00 AM"
                                                    value={row.startTime}
                                                    onChange={(e) => handleSubjectChange(idx, 'startTime', e.target.value)}
                                                    className="w-full pl-6 pr-2 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-[10px] font-bold"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">E.Time</label>
                                            <div className="relative">
                                                <Clock className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300" size={12} />
                                                <input
                                                    type="text"
                                                    placeholder="01:00 PM"
                                                    value={row.endTime}
                                                    onChange={(e) => handleSubjectChange(idx, 'endTime', e.target.value)}
                                                    className="w-full pl-6 pr-2 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-[10px] font-bold"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 w-full md:w-32">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Marks</label>
                                            <input
                                                type="number"
                                                value={row.maxMarks}
                                                onChange={(e) => handleSubjectChange(idx, 'maxMarks', e.target.value)}
                                                className="w-full px-2 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-xs font-bold text-center"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase">Room</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300" size={12} />
                                                <input
                                                    type="text"
                                                    placeholder="101"
                                                    value={row.roomNo}
                                                    onChange={(e) => handleSubjectChange(idx, 'roomNo', e.target.value)}
                                                    className="w-full pl-6 pr-2 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-[10px] font-bold"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSubjectRow(idx)}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {examSubjects.length === 0 && (
                                <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-200 rounded-2xl text-gray-400">
                                    <p className="text-xs font-medium italic">No subjects added to this exam schedule yet.</p>
                                    <button type="button" onClick={handleAddSubjectRow} className="mt-2 text-indigo-600 font-bold text-xs underline decoration-dotted">Add One Now</button>
                                </div>
                            )}
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50 sticky bottom-0 z-10 font-bold">
                    <div className="flex items-center gap-3">
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                        >
                            <option value="Published">Publish Now</option>
                            <option value="Draft">Save as Draft</option>
                        </select>
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">Visibility Rule</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm transition-colors"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isProcessing}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2 transform disabled:opacity-50 disabled:scale-100"
                        >
                            {isProcessing ? 'Processing...' : (exam ? 'Update Schedule' : 'Launch Exam Schedule')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamFormModal;
