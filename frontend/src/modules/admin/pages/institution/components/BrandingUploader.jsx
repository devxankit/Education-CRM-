
import React from 'react';
import { Upload, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

const BrandingUploader = ({ data, onUpload, isLocked, fileReading }) => {

    // Helper for upload slot
    const UploadSlot = ({ label, field, recommended, aspect }) => {
        const hasImage = !!data[field];
        const isCurrentUploading = fileReading; // Since we only upload one at a time

        return (
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <div
                    className={`
                        border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center transition-all
                        ${hasImage ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-indigo-400'}
                        ${(isLocked || isCurrentUploading) ? 'pointer-events-none opacity-60' : 'cursor-pointer'}
                    `}
                    onClick={() => !isLocked && !isCurrentUploading && onUpload(field)}
                >
                    {isCurrentUploading ? (
                        <div className="py-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                            <span className="text-xs text-gray-500 block">Processing...</span>
                        </div>
                    ) : hasImage ? (
                        <div className="relative w-full h-24 flex items-center justify-center">
                            <img src={data[field]} alt="Preview" className="max-h-full max-w-full object-contain" />
                            <div className="absolute top-0 right-0 p-1 bg-white rounded-full shadow-sm text-green-600">
                                <CheckCircle2 size={16} />
                            </div>
                        </div>
                    ) : (
                        <div className="py-2">
                            <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                            <span className="text-xs text-gray-500 block">Click to Upload</span>
                            <span className="text-[10px] text-gray-400 block mt-1">{recommended}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                <ImageIcon size={18} className="text-indigo-600" />
                <h2 className="font-semibold text-gray-800">Branding & Document Identity</h2>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <UploadSlot
                        label="Logo (Light Theme)"
                        field="logoLight"
                        recommended="500x500px PNG"
                    />
                    <UploadSlot
                        label="Logo (Dark Theme)"
                        field="logoDark"
                        recommended="500x500px PNG (White text)"
                    />
                </div>

                <hr className="border-gray-100 mb-6" />

                <h3 className="text-sm font-semibold text-gray-800 mb-4">Letterhead Configuration</h3>
                <div className="grid grid-cols-1 gap-6">
                    <UploadSlot
                        label="Letterhead Header"
                        field="letterheadHeader"
                        recommended="Full width (2480px width) Image/PDF"
                    />
                    <UploadSlot
                        label="Letterhead Footer"
                        field="letterheadFooter"
                        recommended="Full width (2480px width) Image/PDF"
                    />
                </div>

                {/* Live Preview Area - A4 (210×297mm) scaled */}
                <div className="mt-8 bg-gray-100 p-6 rounded-xl border border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Document Live Preview (A4 Scaled)</h4>
                    <div
                        className="bg-white shadow-lg mx-auto flex flex-col relative overflow-hidden"
                        style={{
                            width: '210px',
                            height: '297px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                        }}
                    >
                        {/* Header - Letterhead strip */}
                        <div className="shrink-0 w-full min-h-[44px] max-h-[80px] flex items-center justify-center overflow-hidden bg-gray-50 border-b border-gray-100">
                            {data.letterheadHeader ? (
                                <img
                                    src={data.letterheadHeader}
                                    alt="Letterhead Header"
                                    className="w-full h-full object-contain object-top"
                                    style={{ maxHeight: '80px' }}
                                />
                            ) : (
                                <span className="text-[10px] text-gray-400 font-medium">Header Area</span>
                            )}
                        </div>

                        {/* Body Content Placeholder */}
                        <div className="flex-1 min-h-0 p-3 flex flex-col gap-2 overflow-hidden">
                            <div className="h-1.5 w-1/3 bg-gray-100 rounded shrink-0" />
                            <div className="h-1.5 w-2/3 bg-gray-100 rounded shrink-0" />
                            <div className="flex-1 min-h-[60px] flex items-center justify-center bg-gray-50/80 border border-dashed border-gray-200 rounded text-[10px] text-gray-400">
                                Content Area
                            </div>
                        </div>

                        {/* Footer - Letterhead strip */}
                        <div className="shrink-0 w-full min-h-[36px] max-h-[60px] flex items-center justify-center overflow-hidden bg-gray-50 border-t border-gray-100">
                            {data.letterheadFooter ? (
                                <img
                                    src={data.letterheadFooter}
                                    alt="Letterhead Footer"
                                    className="w-full h-full object-contain object-bottom"
                                    style={{ maxHeight: '60px' }}
                                />
                            ) : (
                                <span className="text-[10px] text-gray-400 font-medium">Footer Area</span>
                            )}
                        </div>

                        {/* Watermark Mockup */}
                        {data.logoLight && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
                                <img src={data.logoLight} alt="" className="max-w-[40%] max-h-[40%] object-contain" />
                            </div>
                        )}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 text-center">A4 ratio 1:1.414 • Header & footer scale to fit</p>
                </div>
            </div>
        </div>
    );
};

export default BrandingUploader;
