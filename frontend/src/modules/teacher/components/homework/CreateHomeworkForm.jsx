import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, UploadCloud, Calendar, FileText, Check, Trash2 } from 'lucide-react';
import { useTeacherStore } from '../../../../store/teacherStore';

const CreateHomeworkForm = ({ isOpen, onClose, classes }) => {
    const addHomework = useTeacherStore(state => state.addHomework);
    const profile = useTeacherStore(state => state.profile);
    const isCreating = useTeacherStore(state => state.isCreatingHomework);

    const [selectedClassId, setSelectedClassId] = useState(null);
    const [title, setTitle] = useState('');
    const [instructions, setInstructions] = useState('');
    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleRemoveFile = (e) => {
        e.stopPropagation();
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handlePublish = async () => {
        if (!selectedClassId || !title) {
            alert("Please fill all required fields (Class and Title)");
            return;
        }

        const selectedMapping = classes.find(c => c.id === selectedClassId);

        const payload = {
            classId: selectedMapping.classId,
            sectionId: selectedMapping.sectionId,
            subjectId: selectedMapping.subjectId,
            title,
            instructions,
            dueDate,
            status: 'published',
            academicYearId: profile?.currentAcademicYear || profile?.academicYearId || "65af736f987654edcba98765",
            branchId: profile?.branchId?._id || profile?.branchId || "65af736f987654edcba12345",
            attachments: selectedFile ? [{ name: selectedFile.name, url: "" }] : []
        };

        const success = await addHomework(payload);

        if (success) {
            alert("Homework Published Successfully!");
            setTitle('');
            setInstructions('');
            setSelectedClassId(null);
            setSelectedFile(null);
            onClose();
        } else {
            alert("Failed to publish homework. Please try again.");
        }
    };

    if (!isOpen) return null;

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
                className="relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto flex flex-col"
            >
                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10 rounded-t-2xl">
                    <h2 className="text-lg font-bold text-gray-900">Create Homework</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-5 space-y-5 overflow-y-auto">
                    {/* Class Selection Slider */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2.5 px-1">Select Class (Drag to scroll)</label>
                        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                            {classes.map(cls => {
                                const isSelected = selectedClassId === cls.id;
                                return (
                                    <button
                                        key={cls.id}
                                        onClick={() => setSelectedClassId(cls.id)}
                                        className={`flex-shrink-0 min-w-[120px] p-3 rounded-xl border transition-all text-left relative ${isSelected
                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200'
                                            : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300'
                                            }`}
                                    >
                                        <div className="text-xs opacity-70 mb-0.5 uppercase tracking-wider font-semibold">Class {cls.className}</div>
                                        <div className="text-sm font-bold truncate">{cls.subjectName}</div>
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 bg-white/20 p-0.5 rounded-full">
                                                <Check size={12} className="text-white" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 px-1">Assignment Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Chapter 4 Exercises"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        />
                    </div>

                    {/* Instructions */}
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 px-1">Instructions</label>
                        <textarea
                            rows={4}
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder="Detailed instructions for students..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-medium text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all"
                        ></textarea>
                    </div>

                    {/* Date & Files Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 px-1">Due Date</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-500 group-focus-within:text-indigo-600 z-10">
                                    <Calendar size={18} />
                                </div>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer relative z-0"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 px-1">Attachments</label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            {!selectedFile ? (
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-[50px] flex items-center justify-center gap-2 bg-gray-50 border border-dashed border-gray-300 text-gray-500 rounded-xl text-sm font-bold hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all active:scale-95"
                                >
                                    <UploadCloud size={18} /> <span>Add File</span>
                                </button>
                            ) : (
                                <div className="w-full h-[50px] flex items-center justify-between px-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <FileText size={16} className="text-indigo-600 flex-shrink-0" />
                                        <span className="text-xs font-bold text-gray-700 truncate max-w-[80px]">{selectedFile.name}</span>
                                    </div>
                                    <button onClick={handleRemoveFile} className="p-1 hover:bg-red-100 rounded-full text-red-500 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-auto bg-white border-t border-gray-100 p-4 flex gap-3 rounded-b-2xl">
                    <button onClick={onClose} className="flex-1 py-3.5 px-4 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 active:scale-95 transition-all">
                        Cancel
                    </button>
                    <button
                        onClick={handlePublish}
                        disabled={isCreating}
                        className="flex-1 py-3.5 px-4 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 shadow-xl shadow-gray-200 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isCreating ? 'Publishing...' : 'Publish Homework'}
                    </button>
                </div>

            </motion.div>
        </div>
    );
};

export default CreateHomeworkForm;
