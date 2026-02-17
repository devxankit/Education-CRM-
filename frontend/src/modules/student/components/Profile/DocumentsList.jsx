import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FileText, Download, ShieldCheck, Eye } from 'lucide-react';
import DocumentViewerModal from '../Documents/DocumentViewerModal';

const DocumentsList = ({ documents }) => {
    const [selectedDoc, setSelectedDoc] = useState(null);

    const handleView = (doc) => {
        if (doc?.url) {
            const validDate = doc.size && doc.size !== 'Uploaded' && !isNaN(Date.parse(doc.size)) ? doc.size : undefined;
            const modalDoc = {
                ...doc,
                permissions: doc.permissions || { view: true, download: true },
                date: validDate || doc.date,
            };
            setSelectedDoc(modalDoc);
        }
    };

    const handleDownload = async (url, name) => {
        if (!url) return;

        try {
            // Strategy 1: Cloudinary Attachment Flag (Works even with cross-origin)
            if (url.includes('res.cloudinary.com')) {
                const downloadUrl = url.replace('/upload/', '/upload/fl_attachment/');
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', name);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return;
            }

            // Strategy 2: Fetch and Blob (Forces download for same-origin or CORS-enabled URLs)
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = (name || 'document').replace(/\s+/g, '_') + (url.includes('.pdf') ? '' : '.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
            // Strategy 3: Direct Link (May only open in new tab if cross-origin and no CORS)
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', name);
            link.setAttribute('target', '_blank');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-indigo-500 rounded-full"></span>
                Official Documents
            </h3>

            {(!documents || documents.length === 0) ? (
                <p className="text-sm text-gray-500 italic">No documents available.</p>
            ) : (
                <div className="space-y-3">
                    {documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                                    <FileText size={18} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">{doc.name}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <p className="text-[10px] text-gray-400 font-medium uppercase">{doc.type} • {doc.size}</p>
                                        {(doc.status === 'Verified' || doc.status === 'approved') && (
                                            <span className="flex items-center gap-0.5 text-[10px] text-green-600 font-bold bg-green-50 px-1.5 rounded">
                                                <ShieldCheck size={10} /> Verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => handleView(doc)}
                                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                                    title="View"
                                >
                                    <Eye size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDownload(doc.url, doc.name)}
                                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                                    title="Download"
                                >
                                    <Download size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                <a href="/student/documents" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center justify-center gap-1">
                    View Full Document Vault →
                </a>
            </div>

            <AnimatePresence>
                {selectedDoc && (
                    <DocumentViewerModal
                        doc={selectedDoc}
                        onClose={() => setSelectedDoc(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default DocumentsList;
