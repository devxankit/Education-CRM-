import React, { useState } from 'react';
import { Upload, X, File, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudentStore } from '../../../../store/studentStore';

const HomeworkSubmission = ({ homework, onSubmissionComplete }) => {
    const submitHomework = useStudentStore(state => state.submitHomework);
    const [file, setFile] = useState(null);
    const [note, setNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validate size (e.g., 5MB)
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }
            setFile(selectedFile);
            setError('');
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async () => {
        if (!file) {
            setError('Please attach a file to submit.');
            return;
        }

        setIsSubmitting(true);
        try {
            const base64 = await convertToBase64(file);
            const submissionData = {
                homeworkId: homework.id,
                content: note,
                attachments: [
                    { name: file.name, base64 }
                ]
            };

            const result = await submitHomework(submissionData);
            if (result) {
                setSuccess(true);
                setTimeout(() => {
                    onSubmissionComplete();
                }, 1000);
            } else {
                setError('Failed to submit homework. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred during submission.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="py-8 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4"
                >
                    <CheckCircle size={32} />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900">Submitted Successfully!</h3>
                <p className="text-sm text-gray-500 mt-1">Your promptness is appreciated.</p>
            </div>
        );
    }

    return (
        <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-bold text-gray-900 mb-4">Your Submission</h4>

            {/* File Upload Area */}
            {!file ? (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                    <div className="w-10 h-10 bg-indigo-50 text-primary rounded-full flex items-center justify-center mb-2">
                        <Upload size={20} />
                    </div>
                    <p className="text-sm font-medium text-gray-700">Tap to upload file</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, DOC (Max 5MB)</p>
                </div>
            ) : (
                <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between border border-gray-200">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-white rounded-lg border border-gray-100 text-gray-500 shrink-0">
                            <File size={20} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-[10px] text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setFile(null)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 text-xs text-red-600 mt-2 bg-red-50 p-2 rounded-lg">
                    <AlertTriangle size={14} /> {error}
                </div>
            )}

            {/* Optional Note */}
            <div className="mt-4">
                <label className="text-xs font-medium text-gray-700 mb-1 block">Add Note (Optional)</label>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any comments for the teacher..."
                    className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 min-h-[80px]"
                />
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={isSubmitting || !file}
                className={`w-full mt-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                    ${isSubmitting || !file
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primaryDark active:scale-[0.98] shadow-sm'
                    }`}
            >
                {isSubmitting ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Uploading...
                    </>
                ) : (
                    'Submit Homework'
                )}
            </button>
        </div>
    );
};

export default HomeworkSubmission;
