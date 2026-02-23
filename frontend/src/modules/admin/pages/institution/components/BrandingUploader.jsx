
import React from 'react';
import { Upload, CheckCircle2 } from 'lucide-react';

const BrandingUploader = ({ data, onUpload, isLocked, fileReading }) => {
    const UploadSlot = ({ label, field, recommended }) => {
        const hasImage = !!data[field];
        const isCurrentUploading = fileReading;

        return (
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <div
                    className={`
                        border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all min-h-[160px]
                        ${hasImage ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-indigo-400'}
                        ${(isLocked || isCurrentUploading) ? 'pointer-events-none opacity-60' : 'cursor-pointer'}
                    `}
                    onClick={() => !isLocked && !isCurrentUploading && onUpload(field)}
                >
                    {isCurrentUploading ? (
                        <div className="py-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                            <span className="text-xs text-gray-500 block">Processing...</span>
                        </div>
                    ) : hasImage ? (
                        <div className="relative w-full h-28 flex items-center justify-center">
                            <img src={data[field]} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                            <div className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm text-green-600">
                                <CheckCircle2 size={18} />
                            </div>
                        </div>
                    ) : (
                        <div className="py-2">
                            <Upload size={28} className="mx-auto text-gray-400 mb-2" />
                            <span className="text-sm text-gray-600 block font-medium">Click to Upload</span>
                            <span className="text-xs text-gray-400 block mt-1">{recommended}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
                <h3 className="text-base font-semibold text-gray-800 mb-4">Institute Logo</h3>
                <div className="max-w-md">
                    <UploadSlot
                        label="Logo"
                        field="logo"
                        recommended="500x500px PNG recommended"
                    />
                </div>
            </div>
        </div>
    );
};

export default BrandingUploader;
