import React, { useState, useRef } from 'react';
import { X, FileUp, Calendar } from 'lucide-react';

const EditDocumentModal = ({ isOpen, onClose, docId, docLabel, doc, onSave, loading, isUpload = false }) => {
    const isAdd = isUpload || !doc;
    const [date, setDate] = useState(doc?.date ? doc.date.slice(0, 10) : new Date().toISOString().slice(0, 10));
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        const reader = new FileReader();
        reader.onload = () => setFilePreview(reader.result);
        reader.readAsDataURL(f);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { date: date || undefined };
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result;
                onSave({ ...payload, base64 }, () => {
                    setFile(null);
                    setFilePreview(null);
                    onClose();
                });
            };
            reader.readAsDataURL(file);
        } else if (isAdd) {
            return; // file required for new upload
        } else {
            onSave(payload, () => onClose());
        }
    };

    const handleClose = () => {
        setFile(null);
        setFilePreview(null);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">{isAdd ? 'Upload document' : 'Edit document'}</h3>
                    <button type="button" onClick={handleClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <p className="text-sm text-gray-600 font-medium">{docLabel}</p>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <Calendar size={14} />
                            Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                            <FileUp size={14} />
                            {isAdd ? 'File (required)' : 'Replace file (optional)'}
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-medium text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                        >
                            {file ? file.name : (isAdd ? 'Choose file to upload' : 'Choose file to replace current document')}
                        </button>
                        {filePreview && (
                            <p className="mt-1.5 text-xs text-emerald-600 font-medium">
                                {isAdd ? 'File selected.' : 'New file selected; will replace existing on save.'}
                            </p>
                        )}
                        {isAdd && !file && (
                            <p className="mt-1.5 text-xs text-amber-600 font-medium">Select a file to upload.</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || (isAdd && !file)}
                            className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? (isAdd ? 'Uploading…' : 'Saving…') : (isAdd ? 'Upload' : 'Save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditDocumentModal;
