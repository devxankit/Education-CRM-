import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ZoomIn, ZoomOut, Download, AlertTriangle } from 'lucide-react';

const DocumentPreview = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col animate-fade-in">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-white/10 backdrop-blur-md border-b border-white/10">
                <div className="text-white">
                    <h3 className="font-bold text-sm">Aadhaar_Card_Front.jpg</h3>
                    <p className="text-[10px] text-gray-400">Uploaded on 12 Oct 2024</p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Controls */}
                    <div className="hidden md:flex gap-2 bg-black/20 rounded-lg p-1">
                        <button className="p-2 text-white hover:bg-white/10 rounded"><ZoomOut size={18} /></button>
                        <button className="p-2 text-white hover:bg-white/10 rounded"><ZoomIn size={18} /></button>
                    </div>

                    <button className="p-2 text-indigo-400 hover:text-indigo-300 font-bold text-xs flex items-center gap-1">
                        <Download size={16} /> <span className="hidden md:inline">Download</span>
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-4">
                {/* Placeholder for PDF/Image */}
                <div className="max-w-3xl w-full bg-white aspect-[3/4] shadow-2xl flex flex-col items-center justify-center text-gray-300">
                    <AlertTriangle size={64} className="mb-4 opacity-50" />
                    <p className="font-bold text-lg text-gray-400">Preview Simulation</p>
                    <p className="text-sm">In a real app, the PDF/Image would render here.</p>
                </div>
            </div>
        </div>
    );
};

export default DocumentPreview;
