
import React, { useState } from 'react';
import { UploadCloud, CheckCircle, File, Image } from 'lucide-react';

const Step5_Documents = ({ data, onChange }) => {

    // data.documents: { photo: null, birthCert: null, tc: null }

    const [docs, setDocs] = useState(data.documents || {});

    const handleUpload = (key, fileName) => {
        // Mock upload
        const newDocs = { ...docs, [key]: { name: fileName, status: 'Uploaded', date: new Date().toLocaleDateString() } };
        setDocs(newDocs);
        onChange({ ...data, documents: newDocs });
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
                    onClick={() => { const d = { ...docs }; delete d[id]; setDocs(d); onChange({ ...data, documents: d }); }}
                    className="text-xs font-bold text-red-500 hover:underline"
                >
                    Remove
                </button>
            ) : (
                <label className="cursor-pointer bg-white border border-gray-300 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm">
                    Upload
                    <input type="file" className="hidden" onChange={(e) => handleUpload(id, e.target.files[0]?.name || 'doc.pdf')} />
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
