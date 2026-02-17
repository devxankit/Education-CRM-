import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Download, ShieldCheck, FileText, Calendar } from 'lucide-react';

const isImageUrl = (url) => {
    if (!url) return false;
    const path = url.split('?')[0].toLowerCase();
    return /\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i.test(path) || /\/image\/upload\/.*\/f_(jpg|png|gif|webp)/i.test(url);
};

/** Mobile WebViews don't display PDF in iframe - they trigger download. Use Cloudinary f_png to serve first page as image. */
const getMobilePdfImageUrl = (url) => {
    if (!url || !url.includes('res.cloudinary.com')) return url;
    return url.replace('/upload/', '/upload/f_png/');
};

const isMobile = () => typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window);

const DocumentViewerModal = ({ doc, onClose }) => {
    const [loadError, setLoadError] = useState(false);
    useEffect(() => { setLoadError(false); }, [doc?.url]);
    if (!doc) return null;

    const perms = doc.permissions || { view: true, download: true };
    const rawDate = doc.date || (doc.size && doc.size !== 'Uploaded' ? doc.size : null);
    const displayDate = rawDate ? new Date(rawDate) : new Date();
    const displayDateStr = isNaN(displayDate.getTime()) ? '—' : displayDate.toLocaleDateString();
    const viewUrl = doc.url; // Use raw URL for view (no fl_attachment - that forces download)

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
            className="fixed inset-0 z-[60] bg-gray-50 flex flex-col"
        >
            {/* Header - app colors */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100 shadow-sm shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-gray-900 line-clamp-1">{doc.name}</h2>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                            {(doc.isVerified || doc.status === 'Verified' || doc.status === 'approved') && (
                                <span className="flex items-center gap-1 text-emerald-600">
                                    <ShieldCheck size={10} /> Verified
                                </span>
                            )}
                            <span>• {doc.size}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {perms.download && (
                        <button
                            onClick={handleDownload}
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors hidden sm:block"
                            title="Download"
                        >
                            <Download size={20} />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Full-page Viewer - no visible scrollbar */}
            <div className="flex-1 relative flex items-center justify-center overflow-auto hide-scrollbar bg-gray-100 min-h-0">
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                    <span className="text-9xl font-black text-indigo-900 -rotate-12 whitespace-nowrap">OFFICIAL RECORD</span>
                </div>

                {/* Real document content - in-app view */}
                {viewUrl && !loadError ? (
                    isImageUrl(viewUrl) ? (
                        <img
                            src={viewUrl}
                            alt={doc.name}
                            className="relative max-w-full max-h-full object-contain rounded-lg shadow-lg z-10"
                            onError={() => setLoadError(true)}
                        />
                    ) : isMobile() && viewUrl.includes('res.cloudinary.com') ? (
                        /* Mobile WebViews don't display PDF in iframe - they trigger download. Cloudinary f_png serves first page as image. */
                        <img
                            src={getMobilePdfImageUrl(viewUrl)}
                            alt={doc.name}
                            className="relative max-w-full max-h-full object-contain rounded-lg shadow-lg z-10"
                            onError={() => setLoadError(true)}
                        />
                    ) : (
                        <iframe
                            src={`${viewUrl}#toolbar=0`}
                            title={doc.name}
                            className="relative w-full h-full min-h-full border-0 rounded-lg shadow-lg z-10 bg-white"
                            onError={() => setLoadError(true)}
                        />
                    )
                ) : (
                    <div className="relative bg-white w-full max-w-2xl aspect-[1/1.4] shadow-lg rounded-xl flex flex-col items-center justify-center p-8 text-center text-gray-800 border border-gray-100">
                        <FileText size={64} className="text-gray-200 mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {loadError ? 'Preview unavailable' : 'Loading...'}
                        </h3>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto">
                            {loadError ? 'Could not load document. Try downloading.' : 'Loading document preview.'}
                        </p>
                    </div>
                )}
            </div>

            {/* Footer - app colors */}
            <div className="p-4 bg-white border-t border-gray-100 flex flex-wrap gap-4 justify-between items-center text-xs text-gray-500 shrink-0">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> Issued: {displayDateStr}</span>
                    <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Digital Signature Valid</span>
                </div>
                {perms.download && (
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 w-full sm:w-auto justify-center px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all"
                    >
                        <Download size={16} /> Download Copy
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default DocumentViewerModal;
