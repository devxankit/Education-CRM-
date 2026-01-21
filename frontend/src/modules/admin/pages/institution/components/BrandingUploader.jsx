
import React from 'react';
import { Upload, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

const BrandingUploader = ({ data, onUpload, isLocked }) => {

    // Helper for upload slot
    const UploadSlot = ({ label, field, recommended, aspect }) => {
        const hasImage = !!data[field];

        return (
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <div
                    className={`
                        border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center transition-all
                        ${hasImage ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-indigo-400'}
                        ${isLocked ? 'pointer-events-none opacity-60' : 'cursor-pointer'}
                    `}
                    onClick={() => !isLocked && onUpload(field)}
                >
                    {hasImage ? (
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

                {/* Live Preview Area */}
                <div className="mt-8 bg-gray-100 p-6 rounded-xl border border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Document Live Preview (A4 Scaled)</h4>
                    <div className="bg-white w-full aspect-[1/1.414] shadow-lg mx-auto max-w-[300px] flex flex-col relative text-[8px] text-gray-400">
                        {/* Header Image */}
                        {data.letterheadHeader ? (
                            <img src={data.letterheadHeader} alt="Header" className="w-full object-cover max-h-[15%]" />
                        ) : (
                            <div className="h-[15%] bg-gray-50 border-b border-dashed border-gray-200 flex items-center justify-center">Header Area</div>
                        )}

                        {/* Body Content Placeholder */}
                        <div className="flex-1 p-4 space-y-2">
                            <div className="h-2 w-1/3 bg-gray-100 rounded"></div>
                            <div className="h-2 w-1/2 bg-gray-100 rounded"></div>
                            <div className="h-20 w-full bg-gray-50 border border-dashed border-gray-100 rounded flex items-center justify-center">
                                Content Area
                            </div>
                        </div>

                        {/* Footer Image */}
                        {data.letterheadFooter ? (
                            <img src={data.letterheadFooter} alt="Footer" className="w-full object-cover max-h-[10%]" />
                        ) : (
                            <div className="h-[10%] bg-gray-50 border-t border-dashed border-gray-200 flex items-center justify-center">Footer Area</div>
                        )}

                        {/* Watermark Mockup */}
                        {data.logoLight && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                                <img src={data.logoLight} alt="" className="w-1/2" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandingUploader;
