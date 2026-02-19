import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, AlertCircle, CheckCircle, Users, BookOpen } from 'lucide-react';
import { useTeacherStore } from '../../../../store/teacherStore';
import axios from 'axios';
import { API_URL } from '../../../../app/api';

const SubjectMarksModal = ({ isOpen, onClose, classData, subjectId, subjectName }) => {
    const { fetchClassStudents, submitMarks, isSubmittingMarks } = useTeacherStore();
    const classStudents = useTeacherStore(state => state.classStudents);
    const [marksData, setMarksData] = useState({});
    const [remarksData, setRemarksData] = useState({});
    const [maxMarks, setMaxMarks] = useState(100);
    const [passingMarks, setPassingMarks] = useState(33);
    const [isLoading, setIsLoading] = useState(true);
    const [availableExams, setAvailableExams] = useState([]);
    const [selectedExamId, setSelectedExamId] = useState('');
    const [selectedExamSubject, setSelectedExamSubject] = useState(null);
    const [isLoadingExams, setIsLoadingExams] = useState(false);

    useEffect(() => {
        if (isOpen && classData?.classId && classData?.sectionId) {
            const loadData = async () => {
                setIsLoading(true);
                setIsLoadingExams(true);
                
                // Load students
                await fetchClassStudents(classData.classId, classData.sectionId);
                
                // Load available exams for this class and subject
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/teacher/exams`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    if (response.data.success) {
                        // Filter exams that include this class and have this subject
                        const filteredExams = response.data.data
                            .filter(exam => {
                                const hasClass = exam.classes?.some(c => 
                                    (c._id || c)?.toString() === classData.classId?.toString()
                                );
                                const hasSubject = exam.subjects?.some(s => 
                                    (s.subjectId?._id || s.subjectId)?.toString() === subjectId?.toString()
                                );
                                return hasClass && hasSubject && exam.status === 'Published';
                            })
                            .map(exam => {
                                const subject = exam.subjects.find(s => 
                                    (s.subjectId?._id || s.subjectId)?.toString() === subjectId?.toString()
                                );
                                return {
                                    ...exam,
                                    subjectDetails: subject
                                };
                            });
                        
                        setAvailableExams(filteredExams);
                        
                        // Auto-select first exam if available
                        if (filteredExams.length > 0) {
                            const firstExam = filteredExams[0];
                            setSelectedExamId(firstExam._id);
                            setSelectedExamSubject(firstExam.subjectDetails);
                            setMaxMarks(firstExam.subjectDetails?.maxMarks || 100);
                            setPassingMarks(firstExam.subjectDetails?.passingMarks || 33);
                            
                            // Fetch existing marks for this exam/subject
                            try {
                                const marksResponse = await axios.get(`${API_URL}/teacher/exams/students`, {
                                    params: {
                                        examId: firstExam._id,
                                        classId: classData.classId,
                                        subjectId: subjectId,
                                        sectionId: classData.sectionId
                                    },
                                    headers: { 'Authorization': `Bearer ${token}` }
                                });
                                
                                if (marksResponse.data.success && marksResponse.data.data) {
                                    const initialMarks = {};
                                    const initialRemarks = {};
                                    marksResponse.data.data.forEach(st => {
                                        initialMarks[st._id] = st.marksObtained ?? '';
                                        initialRemarks[st._id] = st.remarks ?? '';
                                    });
                                    setMarksData(initialMarks);
                                    setRemarksData(initialRemarks);
                                }
                            } catch (error) {
                                console.error('Error fetching existing marks:', error);
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error fetching exams:', error);
                } finally {
                    setIsLoadingExams(false);
                }
                
                setIsLoading(false);
            };
            loadData();
        }
    }, [isOpen, classData?.classId, classData?.sectionId, subjectId, fetchClassStudents]);

    const students = React.useMemo(() => {
        if (!classData?.classId || !classData?.sectionId) return [];
        return classStudents.filter(s => {
            const studentClassId = s.classId?._id || s.classId;
            const studentSectionId = s.sectionId?._id || s.sectionId;
            return studentClassId?.toString() === classData.classId?.toString() && 
                   studentSectionId?.toString() === classData.sectionId?.toString();
        });
    }, [classStudents, classData?.classId, classData?.sectionId]);

    const handleMarkChange = (id, value) => {
        const numValue = value === '' ? '' : parseFloat(value);
        if (value === '' || (numValue >= 0 && numValue <= maxMarks)) {
            setMarksData(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleRemarkChange = (id, value) => {
        setRemarksData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmitMarks = async () => {
        // Validation: Check if exam is selected
        if (!selectedExamId) {
            alert('Please select an exam to save marks');
            return; // Don't close modal
        }

        // Validation: Check if at least one student has marks entered
        const studentsWithMarks = students.filter(st => 
            marksData[st._id] !== '' && 
            marksData[st._id] !== undefined && 
            marksData[st._id] !== null
        );

        if (studentsWithMarks.length === 0) {
            alert('Please enter marks for at least one student');
            return; // Don't close modal
        }

        // Validation: Check if all entered marks are valid numbers
        const invalidMarks = studentsWithMarks.filter(st => {
            const mark = parseFloat(marksData[st._id]);
            return isNaN(mark) || mark < 0 || mark > maxMarks;
        });

        if (invalidMarks.length > 0) {
            alert(`Please enter valid marks (0 to ${maxMarks}) for all students`);
            return; // Don't close modal
        }

        const confirm = window.confirm(
            `Are you sure you want to submit marks for ${studentsWithMarks.length} student(s)? This will save the marks for this exam.`
        );
        if (!confirm) return; // Don't close modal if user cancels

        try {
            const marksPayload = {
                examId: selectedExamId,
                classId: classData.classId,
                sectionId: classData.sectionId,
                subjectId: subjectId,
                maxMarks: maxMarks,
                passingMarks: passingMarks,
                marksData: studentsWithMarks.map(st => ({
                    studentId: st._id,
                    marksObtained: parseFloat(marksData[st._id]) || 0,
                    remarks: remarksData[st._id] || '',
                    status: parseFloat(marksData[st._id]) >= passingMarks ? 'Pass' : 'Fail'
                }))
            };

            const result = await submitMarks(marksPayload);
            if (result.success) {
                // Refresh marks data after successful submission
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${API_URL}/teacher/exams/students`, {
                        params: {
                            examId: selectedExamId,
                            classId: classData.classId,
                            subjectId: subjectId,
                            sectionId: classData.sectionId
                        },
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    
                    if (response.data.success && response.data.data) {
                        // Update local state with fetched marks
                        const updatedMarks = {};
                        const updatedRemarks = {};
                        response.data.data.forEach(st => {
                            updatedMarks[st._id] = st.marksObtained ?? '';
                            updatedRemarks[st._id] = st.remarks ?? '';
                        });
                        setMarksData(updatedMarks);
                        setRemarksData(updatedRemarks);
                    }
                } catch (error) {
                    console.error('Error refreshing marks:', error);
                }
                
                alert('Marks submitted successfully!');
                // Don't close modal - let user see the updated marks
                // onClose();
            } else {
                alert(result.message || 'Failed to submit marks');
                // Don't close modal on error - let user fix and retry
            }
        } catch (error) {
            console.error('Error submitting marks:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to submit marks. Please try again.';
            alert(errorMessage);
            // Don't close modal on error - let user fix and retry
        }
    };

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setMarksData({});
            setRemarksData({});
            setSelectedExamId('');
            setSelectedExamSubject(null);
            setMaxMarks(100);
            setPassingMarks(33);
        }
    }, [isOpen]);

    if (!isOpen || !classData) return null;

    const enteredCount = Object.values(marksData).filter(m => m !== '').length;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                    // Only close if clicking the backdrop, not the modal content
                    if (e.target === e.currentTarget) {
                        const confirm = window.confirm('Are you sure you want to close? Unsaved marks will be lost.');
                        if (confirm) {
                            onClose();
                        }
                    }
                }}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to parent
                className="relative w-full max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-xl h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10 rounded-t-2xl shrink-0">
                    <div className="flex-1">
                        <h2 className="text-lg font-bold text-gray-900">{subjectName} - Marks Entry</h2>
                        <p className="text-xs text-gray-500 font-medium">{classData.classSection || classData.name}</p>
                        {availableExams.length === 0 && !isLoadingExams && (
                            <p className="text-[10px] text-amber-600 font-medium mt-1 bg-amber-50 px-2 py-0.5 rounded inline-block">
                                ℹ️ No exams found. Create an exam from Exams page first.
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-xs font-bold text-gray-600">{enteredCount}/{students.length}</div>
                            <div className="text-[10px] text-gray-400">Entered</div>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Exam Selection */}
                {availableExams.length > 0 && (
                    <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
                        <label className="text-[10px] font-bold text-indigo-700 uppercase mb-1.5 block flex items-center gap-1">
                            <BookOpen size={12} />
                            Select Exam
                        </label>
                        <select
                            value={selectedExamId}
                            onChange={async (e) => {
                                const examId = e.target.value;
                                setSelectedExamId(examId);
                                const exam = availableExams.find(ex => ex._id === examId);
                                if (exam?.subjectDetails) {
                                    setSelectedExamSubject(exam.subjectDetails);
                                    setMaxMarks(exam.subjectDetails.maxMarks || 100);
                                    setPassingMarks(exam.subjectDetails.passingMarks || 33);
                                    
                                    // Fetch existing marks when exam changes
                                    try {
                                        const token = localStorage.getItem('token');
                                        const marksResponse = await axios.get(`${API_URL}/teacher/exams/students`, {
                                            params: {
                                                examId: examId,
                                                classId: classData.classId,
                                                subjectId: subjectId,
                                                sectionId: classData.sectionId
                                            },
                                            headers: { 'Authorization': `Bearer ${token}` }
                                        });
                                        
                                        if (marksResponse.data.success && marksResponse.data.data) {
                                            const initialMarks = {};
                                            const initialRemarks = {};
                                            marksResponse.data.data.forEach(st => {
                                                initialMarks[st._id] = st.marksObtained ?? '';
                                                initialRemarks[st._id] = st.remarks ?? '';
                                            });
                                            setMarksData(initialMarks);
                                            setRemarksData(initialRemarks);
                                        }
                                    } catch (error) {
                                        console.error('Error fetching marks for selected exam:', error);
                                    }
                                }
                            }}
                            onClick={(e) => e.stopPropagation()} // Prevent click from bubbling
                            onFocus={(e) => e.stopPropagation()} // Prevent focus from bubbling
                            className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            {availableExams.map(exam => (
                                <option key={exam._id} value={exam._id}>
                                    {exam.examName} ({exam.subjectDetails?.date ? new Date(exam.subjectDetails.date).toLocaleDateString() : 'No date'})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Marks Configuration */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex gap-4">
                    <div className="flex-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Max Marks</label>
                        <input
                            type="number"
                            value={maxMarks}
                            onChange={(e) => setMaxMarks(Math.max(0, parseInt(e.target.value) || 0))}
                            onClick={(e) => e.stopPropagation()} // Prevent click from bubbling
                            onFocus={(e) => e.stopPropagation()} // Prevent focus from bubbling
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                            min="0"
                            disabled={selectedExamSubject?.maxMarks !== undefined}
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Passing Marks</label>
                        <input
                            type="number"
                            value={passingMarks}
                            onChange={(e) => setPassingMarks(Math.max(0, Math.min(maxMarks, parseInt(e.target.value) || 0)))}
                            onClick={(e) => e.stopPropagation()} // Prevent click from bubbling
                            onFocus={(e) => e.stopPropagation()} // Prevent focus from bubbling
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                            min="0"
                            max={maxMarks}
                            disabled={selectedExamSubject?.passingMarks !== undefined}
                        />
                    </div>
                </div>

                {/* Table Body */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
                            <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                            <p className="text-sm font-medium">Loading students...</p>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
                            <Users className="text-gray-300" size={48} />
                            <p className="text-sm font-medium">No students found in this class</p>
                        </div>
                    ) : (
                        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                            {students.map((student, index) => (
                                <div key={student._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-between p-3 border-b border-gray-50" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            {/* Serial Number */}
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                                                <span className="text-xs font-bold text-gray-600">{index + 1}</span>
                                            </div>
                                            {/* Student Avatar */}
                                            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-indigo-100 bg-indigo-50 flex items-center justify-center font-bold text-indigo-600 shrink-0">
                                                {student.photo ? (
                                                    <img src={student.photo} alt={`${student.firstName} ${student.lastName}`} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-base">{student.firstName?.charAt(0) || 'S'}</span>
                                                )}
                                            </div>
                                            {/* Student Info */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-bold text-gray-900 leading-tight uppercase truncate">
                                                    {student.firstName} {student.lastName}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                    {student.rollNo && (
                                                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                                                            Roll: {student.rollNo}
                                                        </span>
                                                    )}
                                                    {student.admissionNo && (
                                                        <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                                            Adm: {student.admissionNo}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                placeholder="-"
                                                value={marksData[student._id] || ''}
                                                onChange={(e) => handleMarkChange(student._id, e.target.value)}
                                                onClick={(e) => e.stopPropagation()} // Prevent click from bubbling
                                                onFocus={(e) => e.stopPropagation()} // Prevent focus from bubbling
                                                className={`w-20 h-10 text-center text-sm font-bold border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${marksData[student._id] ? 'bg-white border-gray-200 text-gray-900' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                                            />
                                            <div className={`p-2 rounded-xl ${parseFloat(marksData[student._id]) >= passingMarks ? 'bg-green-50 text-green-600' : (marksData[student._id] !== '' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-300')}`}>
                                                {marksData[student._id] !== ''
                                                    ? (parseFloat(marksData[student._id]) >= passingMarks ? <CheckCircle size={20} /> : <AlertCircle size={20} />)
                                                    : <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-dashed"></div>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-gray-50/50">
                                        <input
                                            type="text"
                                            placeholder="Remarks (Optional)..."
                                            value={remarksData[student._id] || ''}
                                            onChange={(e) => handleRemarkChange(student._id, e.target.value)}
                                            onClick={(e) => e.stopPropagation()} // Prevent click from bubbling
                                            onFocus={(e) => e.stopPropagation()} // Prevent focus from bubbling
                                            className="w-full bg-transparent border-none p-0 text-[11px] font-medium text-gray-500 focus:ring-0 outline-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3.5 px-4 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmitMarks}
                        disabled={isLoading || isSubmittingMarks || enteredCount === 0 || !selectedExamId}
                        className="flex-[2] py-3.5 px-4 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isSubmittingMarks ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <Save size={18} />}
                        {isSubmittingMarks ? 'Saving...' : 'Save Marks'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default SubjectMarksModal;
