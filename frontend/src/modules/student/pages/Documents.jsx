import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Plus } from 'lucide-react';

// Components
import DocumentTabs from '../components/Documents/DocumentTabs';
import DocumentCard from '../components/Documents/DocumentCard';
import RequestDocumentModal from '../components/Documents/RequestDocumentModal';
import DocumentViewerModal from '../components/Documents/DocumentViewerModal';
import InfoTooltip from '../components/Attendance/InfoTooltip';
import EmptyState from '../components/Attendance/EmptyState';

import { useStudentStore } from '../../../store/studentStore';

const TABS = ['All', 'Academic', 'Certificates', 'Identity', 'Financial'];

const DocumentsPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const data = useStudentStore(state => state.documents);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('All');
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);

    // Initial Load & Smooth Scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => lenis.destroy();
    }, []);

    // Filter Logic
    const filteredData = data.filter(doc => {
        if (activeTab === 'All') return true;
        return doc.category === activeTab;
    });

    const handleView = (doc) => {
        if (!doc.permissions.view) return;
        setSelectedDoc(doc);
    };

    const handleDownload = async (doc) => {
        if (!doc.url) return;

        try {
            // Strategy 1: Cloudinary Attachment Flag
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

            // Strategy 2: Fetch and Blob
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
        <div ref={containerRef} className="min-h-screen bg-gray-50/50">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 px-4 shadow-sm">
                <div className="flex items-center justify-between max-w-lg mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-transform text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <h1 className="text-lg font-bold text-gray-900">Documents</h1>

                    <InfoTooltip
                        content={
                            <div className="space-y-2">
                                <p className="font-bold border-b border-gray-100 pb-1">Document Validity</p>
                                <p>1. Only verified documents are official.</p>
                                <p>2. Downloaded copies include a digital stamp.</p>
                                <p>3. Expired ID cards are not valid proof.</p>
                            </div>
                        }
                    >
                        <button className="p-2 -mr-2 text-gray-400 hover:text-gray-600">
                            <Info size={20} />
                        </button>
                    </InfoTooltip>
                </div>
            </div>

            <main className="max-w-lg mx-auto px-4 pt-6 pb-24">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-sm text-gray-500 font-medium">Fetching Records...</p>
                    </div>
                ) : (
                    <>
                        <DocumentTabs
                            tabs={TABS}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {filteredData.length > 0 ? (
                                    filteredData.map((doc, index) => (
                                        <DocumentCard
                                            key={doc.id}
                                            doc={doc}
                                            index={index}
                                            onView={handleView}
                                            onDownload={handleDownload}
                                        />
                                    ))
                                ) : (
                                    <div className="py-12">
                                        <EmptyState message={`No ${activeTab.toLowerCase()} documents found.`} />
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </>
                )}
            </main>

            {/* Request FAB */}
            <div className="fixed bottom-24 right-6 z-30">
                <button
                    onClick={() => setShowRequestModal(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white font-bold rounded-full shadow-lg hover:bg-gray-800 active:scale-95 transition-all"
                >
                    <Plus size={20} /> Request Doc
                </button>
            </div>

            {/* Request Modal */}
            <AnimatePresence>
                {showRequestModal && (
                    <RequestDocumentModal
                        onClose={() => setShowRequestModal(false)}
                        onSubmit={() => alert("Request Submitted Successfully (Mock)")}
                    />
                )}
            </AnimatePresence>

            {/* Document Viewer Modal */}
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

export default DocumentsPage;
