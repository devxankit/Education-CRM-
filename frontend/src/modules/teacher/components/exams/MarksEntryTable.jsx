import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useTeacherStore } from '../../../../store/teacherStore';

const MarksEntryTable = ({ exam, subject, isOpen, onClose }) => {
    const { fetchExamStudents, submitMarks, isSubmittingMarks } = useTeacherStore();
    const examStudents = useTeacherStore(state => state.examStudents);
    const [marksData, setMarksData] = useState({});
    const [remarksData, setRemarksData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const classId = exam.classes?.[0]?._id;
    const key = `${exam._id}_${classId}_${subject.subjectId}`;
    const students = examStudents[key] || [];

    React.useEffect(() => {
        if (isOpen && exam && subject && classId) {
            const loadStudents = async () => {
                const data = await fetchExamStudents(exam._id, classId, subject.subjectId);
                // Initialize local state with existing marks if any
                if (data) {
                    const initialMarks = {};
                    const initialRemarks = {};
                    data.forEach(st => {
                        initialMarks[st._id] = st.marksObtained ?? '';
                        initialRemarks[st._id] = st.remarks ?? '';
                    });
                    setMarksData(initialMarks);
                    setRemarksData(initialRemarks);
                }
                setIsLoading(false);
            };
            loadStudents();
        }
    }, [isOpen, exam._id, classId, subject.subjectId, fetchExamStudents]);

    if (!isOpen || !exam) return null;

    const handleMarkChange = (id, value) => {
        if (value === '' || (parseFloat(value) <= subject.maxMarks)) {
            setMarksData(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleRemarkChange = (id, value) => {
        setRemarksData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmitMarks = async () => {
        const confirm = window.confirm("Are you sure you want to submit marks? This action will update student transcripts.");
        if (confirm) {
            const marksPayload = {
                examId: exam._id,
                classId: classId,
                subjectId: subject.subjectId,
                maxMarks: subject.maxMarks,
                passingMarks: subject.passingMarks,
                marksData: students.map(st => ({
                    studentId: st._id,
                    marksObtained: parseFloat(marksData[st._id]) || 0,
                    remarks: remarksData[st._id] || '',
                    status: marksData[st._id] === '' ? 'Absent' : (parseFloat(marksData[st._id]) >= subject.passingMarks ? 'Pass' : 'Fail')
                }))
            };

            const result = await submitMarks(marksPayload);
            if (result.success) {
                alert('Marks submitted successfully!');
                onClose();
            } else {
                alert(result.message || 'Failed to submit marks');
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-2xl bg-white rounded-t-2xl sm:rounded-2xl shadow-xl h-[90vh] flex flex-col"
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10 rounded-t-2xl shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{subject.subjectName} - Marks</h2>
                        <p className="text-xs text-gray-500 font-medium">{exam.examName || exam.title} • Max Marks: {subject.maxMarks}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Table Body */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
                            <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                            <p className="text-sm font-medium">Loading roster...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {students.map((student) => (
                                <div key={student._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                    <div className="flex items-center justify-between p-3 border-b border-gray-50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 bg-indigo-50 flex items-center justify-center font-bold text-indigo-600">
                                                {student.photo ? <img src={student.photo} alt="" className="w-full h-full object-cover" /> : student.firstName.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-900 leading-tight uppercase">{student.firstName} {student.lastName}</h4>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Roll: {student.rollNo || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                inputMode="decimal"
                                                placeholder="-"
                                                value={marksData[student._id]}
                                                onChange={(e) => handleMarkChange(student._id, e.target.value)}
                                                className={`w-16 h-10 text-center text-sm font-bold border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${marksData[student._id] !== '' ? 'bg-white border-gray-200 text-gray-900' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                                            />
                                            <div className={`p-2 rounded-xl ${parseFloat(marksData[student._id]) >= subject.passingMarks ? 'bg-green-50 text-green-600' : (marksData[student._id] !== '' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-300')}`}>
                                                {marksData[student._id] !== ''
                                                    ? (parseFloat(marksData[student._id]) >= subject.passingMarks ? <CheckCircle size={20} /> : <AlertCircle size={20} />)
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
                        disabled={isLoading || isSubmittingMarks}
                        className="flex-[2] py-3.5 px-4 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                    >
                        {isSubmittingMarks ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <Save size={18} />}
                        {isSubmittingMarks ? 'Submitting...' : 'Submit Marks'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default MarksEntryTable;
