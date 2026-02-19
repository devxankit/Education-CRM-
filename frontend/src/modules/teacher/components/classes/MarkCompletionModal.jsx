import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Clock, BookOpen, MessageSquare } from 'lucide-react';
import { markClassCompletion } from '../../services/classCompletion.api';

const MarkCompletionModal = ({ isOpen, onClose, classData, onSuccess }) => {
    const [formData, setFormData] = useState({
        status: 'Completed',
        actualStartTime: '',
        actualEndTime: '',
        topicsCovered: '',
        remarks: '',
        totalStudents: 0,
        presentStudents: 0,
        absentStudents: 0
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Debug: Log classData to see what we're receiving
    // IMPORTANT: All hooks must be called before any early returns
    useEffect(() => {
        if (isOpen && classData) {
            console.log('MarkCompletionModal - classData:', classData);
            if (!classData.subjectId) {
                console.warn('Warning: subjectId missing in classData:', classData);
            }
        }
    }, [isOpen, classData]);

    // Early return AFTER all hooks
    if (!isOpen || !classData) return null;

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        if (field === 'presentStudents' || field === 'totalStudents') {
            const present = field === 'presentStudents' ? parseInt(value) || 0 : formData.presentStudents;
            const total = field === 'totalStudents' ? parseInt(value) || 0 : formData.totalStudents;
            setFormData(prev => ({
                ...prev,
                absentStudents: Math.max(0, total - present)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setError('');
        
        console.log('Form submitted, classData:', classData);
        console.log('Form data:', formData);
        
        if (!formData.topicsCovered?.trim()) {
            setError('Please enter topics covered');
            return;
        }

        setSubmitting(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const todayDay = dayNames[new Date().getDay()];

            // Validate required fields
            if (!classData?.subjectId) {
                const errorMsg = 'Subject ID is missing. Please refresh the page and try again.';
                console.error('Validation error:', errorMsg, 'classData:', classData);
                setError(errorMsg);
                setSubmitting(false);
                return;
            }

            if (!classData?.classId || !classData?.sectionId) {
                const errorMsg = 'Class or Section information is missing. Please refresh and try again.';
                console.error('Validation error:', errorMsg, 'classData:', classData);
                setError(errorMsg);
                setSubmitting(false);
                return;
            }

            const timeParts = classData.time?.split(' - ');
            if (!timeParts || timeParts.length !== 2) {
                const errorMsg = 'Invalid time format. Please refresh and try again.';
                console.error('Validation error:', errorMsg, 'time:', classData.time);
                setError(errorMsg);
                setSubmitting(false);
                return;
            }

            const [startTime, endTime] = timeParts;

            const completionData = {
                classId: classData.classId,
                sectionId: classData.sectionId,
                subjectId: classData.subjectId,
                day: todayDay,
                startTime: startTime.trim(),
                endTime: endTime.trim(),
                room: classData.room || '',
                date: today,
                status: formData.status,
                actualStartTime: formData.actualStartTime || undefined,
                actualEndTime: formData.actualEndTime || undefined,
                topicsCovered: formData.topicsCovered.trim(),
                remarks: formData.remarks?.trim() || '',
                totalStudents: parseInt(formData.totalStudents) || 0,
                presentStudents: parseInt(formData.presentStudents) || 0,
                absentStudents: parseInt(formData.absentStudents) || 0
            };

            console.log('Calling API with completionData:', completionData);
            const response = await markClassCompletion(completionData);
            console.log('API Response:', response);
            
            if (response.success) {
                console.log('Success! Completion marked:', response.data);
                onSuccess?.(response.data);
                onClose();
                // Reset form
                setFormData({
                    status: 'Completed',
                    actualStartTime: '',
                    actualEndTime: '',
                    topicsCovered: '',
                    remarks: '',
                    totalStudents: 0,
                    presentStudents: 0,
                    absentStudents: 0
                });
            } else {
                const errorMsg = response.message || 'Failed to mark completion';
                console.error('API returned error:', errorMsg);
                setError(errorMsg);
            }
        } catch (err) {
            console.error('Error in handleSubmit:', err);
            const errorMsg = err.message || err.response?.data?.message || 'Failed to mark class completion';
            console.error('Error message:', errorMsg);
            setError(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Mark Class Completion</h2>
                        <p className="text-xs text-gray-500 mt-0.5">{classData.classSection} - {classData.subject}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form 
                    onSubmit={handleSubmit} 
                    className="p-6 space-y-5"
                    noValidate
                >
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                        <div className="flex gap-2">
                            {['Completed', 'Cancelled', 'Rescheduled'].map(status => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => handleChange('status', status)}
                                    className={`flex-1 py-2.5 px-3 rounded-xl border text-sm font-bold transition-all ${
                                        formData.status === status
                                            ? status === 'Completed' 
                                                ? 'bg-green-50 text-green-700 border-green-200 border-2'
                                                : status === 'Cancelled'
                                                ? 'bg-red-50 text-red-700 border-red-200 border-2'
                                                : 'bg-amber-50 text-amber-700 border-amber-200 border-2'
                                            : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actual Times */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                                <Clock size={14} /> Actual Start Time
                            </label>
                            <input
                                type="time"
                                value={formData.actualStartTime}
                                onChange={(e) => handleChange('actualStartTime', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                                <Clock size={14} /> Actual End Time
                            </label>
                            <input
                                type="time"
                                value={formData.actualEndTime}
                                onChange={(e) => handleChange('actualEndTime', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* Topics Covered */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                            <BookOpen size={14} /> Topics Covered <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={formData.topicsCovered}
                            onChange={(e) => handleChange('topicsCovered', e.target.value)}
                            rows={3}
                            placeholder="Enter topics covered in this class..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                        />
                    </div>

                    {/* Attendance Summary */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <label className="block text-sm font-bold text-gray-700 mb-3">Attendance Summary</label>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Total Students</label>
                                <input
                                    type="number"
                                    value={formData.totalStudents}
                                    onChange={(e) => handleChange('totalStudents', e.target.value)}
                                    min="0"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Present</label>
                                <input
                                    type="number"
                                    value={formData.presentStudents}
                                    onChange={(e) => handleChange('presentStudents', e.target.value)}
                                    min="0"
                                    max={formData.totalStudents}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Absent</label>
                                <input
                                    type="number"
                                    value={formData.absentStudents}
                                    readOnly
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-100 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                            <MessageSquare size={14} /> Remarks (Optional)
                        </label>
                        <textarea
                            value={formData.remarks}
                            onChange={(e) => handleChange('remarks', e.target.value)}
                            rows={2}
                            placeholder="Any additional notes..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            onClick={(e) => {
                                console.log('Submit button clicked');
                                // Let form handle submission
                            }}
                            className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Marking...' : (
                                <>
                                    <CheckCircle size={18} />
                                    Mark as Completed
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MarkCompletionModal;
