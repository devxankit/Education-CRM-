
import React, { useState } from 'react';
import { UploadCloud, CheckCircle, File, Image, Plus, Trash2 } from 'lucide-react';

const Step5_Documents = ({ data, onChange }) => {

    // data.documents: { photo: null, birthCert: null, tc: null }

    const [docs, setDocs] = useState(data.documents || {});
    const [uploading, setUploading] = useState(null);

    const syncDocuments = (nextDocs) => {
        setDocs(nextDocs);
        onChange({ ...data, documents: nextDocs });
    };

    const handleUpload = (key, file) => {
        if (!file) return;

        setUploading(key);
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64String = reader.result;
            const newDocs = {
                ...docs,
                [key]: {
                    name: file.name,
                    status: 'Uploaded',
                    date: new Date().toLocaleDateString(),
                    base64: base64String
                }
            };
            syncDocuments(newDocs);
            setUploading(null);
        };

        reader.readAsDataURL(file);
    };

    const handleCustomDocUpload = (index, file) => {
        if (!file) return;

        const customDocs = [...(docs.otherDocuments || [])];
        if (!customDocs[index]?.label?.trim()) {
            alert('Please enter a document name first.');
            return;
        }

        setUploading(`other-${index}`);
        const reader = new FileReader();
        reader.onloadend = () => {
            customDocs[index] = {
                ...customDocs[index],
                name: customDocs[index].label.trim(),
                status: 'Uploaded',
                date: new Date().toLocaleDateString(),
                base64: reader.result
            };
            syncDocuments({ ...docs, otherDocuments: customDocs });
            setUploading(null);
        };
        reader.readAsDataURL(file);
    };

    const addCustomDocument = () => {
        syncDocuments({
            ...docs,
            otherDocuments: [...(docs.otherDocuments || []), { label: '', name: '', status: '', date: '' }]
        });
    };

    const updateCustomDocumentLabel = (index, label) => {
        const customDocs = [...(docs.otherDocuments || [])];
        customDocs[index] = {
            ...customDocs[index],
            label,
            name: label
        };
        syncDocuments({ ...docs, otherDocuments: customDocs });
    };

    const removeCustomDocument = (index) => {
        syncDocuments({
            ...docs,
            otherDocuments: (docs.otherDocuments || []).filter((_, i) => i !== index)
        });
    };

    const DocItem = ({ id, label, required, type = 'PDF' }) => (
        <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors group">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${docs[id] ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {type === 'Image' ? <Image size={20} /> : <File size={20} />}
                </div>
                <div>
                    <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        {label}
                        {required && <span className="text-xs text-red-500 bg-red-50 px-1.5 rounded font-medium">Required</span>}
                    </h4>
                    {docs[id] ? (
                        <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <CheckCircle size={10} /> {docs[id].name} • {docs[id].date}
                        </p>
                    ) : (
                        <p className="text-xs text-gray-400">Max 5MB • {type} Only</p>
                    )}
                </div>
            </div>

            {docs[id] ? (
                <button
                    onClick={() => {
                        const nextDocs = { ...docs };
                        delete nextDocs[id];
                        syncDocuments(nextDocs);
                    }}
                    className="text-xs font-bold text-red-500 hover:underline"
                >
                    Remove
                </button>
            ) : (
                <label className={`cursor-pointer bg-white border border-gray-300 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${uploading === id ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploading === id ? 'Processing...' : 'Upload'}
                    <input type="file" className="hidden" accept={type === 'Image' ? "image/*" : ".pdf,.doc,.docx"} onChange={(e) => handleUpload(id, e.target.files[0])} />
                </label>
            )}
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header */}
            <div>
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <UploadCloud className="text-indigo-600" /> Document Verification
                </h3>
                <p className="text-sm text-gray-500">Upload digitally scanned copies of mandatory documents.</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <DocItem id="photo" label="Student Photograph" required type="Image" />
                <DocItem id="birthCert" label="Birth Certificate" required />
                <DocItem id="transferCert" label="Transfer Certificate (TC)" />
                <DocItem id="aadhar" label="Aadhaar Card Copy" />
                <DocItem id="prevMarksheet" label="Previous Year Marksheet" />

                <div className="pt-2 border-t border-gray-100 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h4 className="text-sm font-bold text-gray-800">Other Documents</h4>
                            <p className="text-xs text-gray-400">Add custom documents when the standard checklist is not enough.</p>
                        </div>
                        <button
                            type="button"
                            onClick={addCustomDocument}
                            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors"
                        >
                            <Plus size={14} />
                            Add Other
                        </button>
                    </div>

                    {(docs.otherDocuments || []).map((doc, index) => (
                        <div key={`other-doc-${index}`} className="p-4 border border-gray-100 rounded-lg bg-gray-50/60 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Document Name</label>
                                    <input
                                        type="text"
                                        value={doc.label || doc.name || ''}
                                        onChange={(e) => updateCustomDocumentLabel(index, e.target.value)}
                                        placeholder="e.g. Migration Certificate"
                                        className="w-full px-3 py-2 text-sm font-medium border border-gray-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeCustomDocument(index)}
                                    className="mt-5 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    {doc.base64 || doc.url ? (
                                        <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                            <CheckCircle size={10} /> {(doc.name || doc.label || 'Other Document')} • {doc.date}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-gray-400">Upload PDF, DOC, DOCX, or image</p>
                                    )}
                                </div>
                                <label className={`cursor-pointer bg-white border border-gray-300 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${uploading === `other-${index}` ? 'opacity-50 pointer-events-none' : ''}`}>
                                    {uploading === `other-${index}` ? 'Processing...' : doc.base64 || doc.url ? 'Replace File' : 'Upload File'}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,image/*"
                                        onChange={(e) => handleCustomDocUpload(index, e.target.files[0])}
                                    />
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg">
                <p className="text-xs text-yellow-800">
                    <strong>Note:</strong> Original documents must be submitted to the admin office for physical verification within 15 days of admission.
                </p>
            </div>

        </div>
    );
};

export default Step5_Documents;
