import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useTeacherStore } from '../../../../store/teacherStore';

const MarksEntryTable = ({ exam, students, isOpen, onClose }) => {
    const { saveMarksDraft, submitMarks } = useTeacherStore();
    // Local state for marks to allow inputs
    const [marksData, setMarksData] = useState(
        students ? students.reduce((acc, st) => ({ ...acc, [st.id]: st.marks || '' }), {}) : {}
    );

    if (!isOpen || !exam) return null;

    const handleMarkChange = (id, value) => {
        // Simple numeric validation (allow empty string)
        if (value === '' || (/^\d+$/.test(value) && parseInt(value) <= exam.totalMarks)) {
            setMarksData(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleSaveDraft = () => {
        const record = {
            examId: exam.id,
            subject: exam.subject,
            title: exam.title,
            marks: marksData,
            status: 'Draft',
            updatedAt: new Date().toISOString()
        };
        console.log('Saving draft:', record);
        saveMarksDraft(record);
        alert('Draft saved!');
    };

    const handleSubmitMarks = () => {
        const confirm = window.confirm("Are you sure you want to submit marks? This action cannot be undone.");
        if (confirm) {
            const record = {
                examId: exam.id,
                subject: exam.subject,
                title: exam.title,
                marks: marksData,
                status: 'Submitted',
                updatedAt: new Date().toISOString()
            };
            console.log('Submitting marks:', record);
            submitMarks(record);
            alert('Marks submitted successfully!');
            onClose();
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
                        <h2 className="text-lg font-bold text-gray-900">{exam.subject} - Marks</h2>
                        <p className="text-xs text-gray-500 font-medium">{exam.title} • Max Marks: {exam.totalMarks}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Table Body */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-2">
                        {students.map((student) => (
                            <div key={student.id} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-indigo-100 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                        {student.roll}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">{student.name}</h4>
                                        <p className="text-[10px] text-gray-400 font-medium tracking-wide">ID: {student.id}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="-"
                                        value={marksData[student.id]}
                                        onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                        className={`w-14 h-10 text-center text-sm font-bold border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${marksData[student.id] !== '' ? 'bg-white border-gray-200 text-gray-900' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                                    />
                                    <div className={`p-2 rounded-lg ${marksData[student.id] >= exam.passingMarks ? 'bg-green-50 text-green-600' : (marksData[student.id] !== '' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-300')}`}>
                                        {marksData[student.id] !== ''
                                            ? (marksData[student.id] >= exam.passingMarks ? <CheckCircle size={16} /> : <AlertCircle size={16} />)
                                            : <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-dashed"></div>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-3 shrink-0">
                    <button
                        onClick={handleSaveDraft}
                        className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={handleSubmitMarks}
                        className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                    >
                        <Save size={16} /> Submit Marks
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default MarksEntryTable;
