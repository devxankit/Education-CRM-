import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, ShieldCheck, FileText, Calendar } from 'lucide-react';

const DocumentViewerModal = ({ doc, onClose }) => {
    if (!doc) return null;

    const handleDownload = async () => {
        if (!doc.url) return;

        try {
            if (doc.url.includes('res.cloudinary.com')) {
                const downloadUrl = doc.url.replace('/upload/', '/upload/fl_attachment/');
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', doc.name);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return;
            }

            const response = await fetch(doc.url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = (doc.name || 'document').replace(/\s+/g, '_') + (doc.url.includes('.pdf') ? '' : '.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Download failed:', error);
            window.open(doc.url, '_blank');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-gray-700 relative"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white line-clamp-1">{doc.name}</h2>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                {doc.isVerified && (
                                    <span className="flex items-center gap-1 text-emerald-400">
                                        <ShieldCheck size={10} /> Verified
                                    </span>
                                )}
                                <span>• {doc.size}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {doc.permissions.download && (
                            <button
                                onClick={handleDownload}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors hidden sm:block"
                                title="Download"
                            >
                                <Download size={20} />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Viewer Canvas */}
                <div className="flex-1 bg-black relative flex items-center justify-center overflow-auto p-4 custom-scrollbar">
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                        <span className="text-9xl font-black text-white -rotate-12 whitespace-nowrap">OFFICIAL RECORD</span>
                    </div>

                    {/* Content Placeholder */}
                    <div className="relative bg-white w-full max-w-2xl aspect-[1/1.4] shadow-2xl rounded-sm flex flex-col items-center justify-center p-8 text-center text-gray-800">
                        {/* Mock ID Card Review */}
                        {doc.category === 'Identity' ? (
                            <div className="w-full h-full border-4 border-double border-gray-200 p-4 flex flex-col">
                                <div className="flex items-center justify-between border-b-2 border-primary/20 pb-4 mb-4">
                                    <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                                    <div className="text-right">
                                        <h3 className="font-bold text-lg text-primary">INSTITUTE OF EXCELLENCE</h3>
                                        <p className="text-xs text-gray-500">Student Identity Card</p>
                                    </div>
                                </div>
                                <div className="space-y-4 flex-1">
                                    <div className="w-3/4 h-4 bg-gray-100 rounded"></div>
                                    <div className="w-1/2 h-4 bg-gray-100 rounded"></div>
                                    <div className="w-2/3 h-4 bg-gray-100 rounded"></div>
                                </div>
                                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-end">
                                    <div className="text-xs text-gray-400">ID: {doc.id}</div>
                                    <div className="w-24 h-8 bg-gray-100 rounded"></div>
                                </div>
                            </div>
                        ) : (
                            // Generic Document Preview
                            <>
                                <FileText size={64} className="text-gray-200 mb-4" />
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Document Preview</h3>
                                <p className="text-sm text-gray-500 max-w-xs mx-auto mb-6">
                                    This is a secure preview of <strong>{doc.name}</strong>.
                                    Digital signature verified.
                                </p>
                                <div className="w-full h-1 bg-gray-100 rounded-full max-w-[200px] mx-auto overflow-hidden">
                                    <div className="w-full h-full bg-emerald-500"></div>
                                </div>
                                <p className="text-[10px] text-emerald-600 font-bold mt-2 uppercase tracking-wide">
                                    Verified Official Copy
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Footer Metadata */}
                <div className="p-4 bg-gray-800 border-t border-gray-700 flex flex-wrap gap-4 justify-between items-center text-xs text-gray-400">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> Issued: {new Date(doc.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Digital Signature Valid</span>
                    </div>
                    {doc.permissions.download && (
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 active:scale-95 transition-all"
                        >
                            <Download size={16} /> Download Copy
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DocumentViewerModal;
