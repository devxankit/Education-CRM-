
import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Users, GraduationCap, Briefcase, AlertCircle, CheckCircle, Download, HelpCircle } from 'lucide-react';

const BulkImport = () => {

    const [selectedType, setSelectedType] = useState('students');
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null); // 'uploading', 'success', 'error'

    const importTypes = [
        { id: 'students', label: 'Students', icon: GraduationCap, description: 'Import student records with admission details' },
        { id: 'teachers', label: 'Teachers', icon: Users, description: 'Import teacher profiles and assignments' },
        { id: 'employees', label: 'Employees', icon: Briefcase, description: 'Import non-teaching staff records' },
        { id: 'parents', label: 'Parents', icon: Users, description: 'Import parent/guardian information' },
    ];

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.xlsx'))) {
            setFile(droppedFile);
            setUploadStatus(null);
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setUploadStatus(null);
        }
    };

    const handleUpload = () => {
        if (!file) return;
        setUploadStatus('uploading');
        // Mock upload - will be replaced by actual API call
        setTimeout(() => {
            setUploadStatus('success');
        }, 2000);
    };

    const handleDownloadTemplate = () => {
        // Mock download - will be replaced by actual template download
        alert(`Downloading ${selectedType} template...`);
    };

    return (
        <div className="h-full flex flex-col pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-['Poppins']">Bulk Import</h1>
                    <p className="text-gray-500 text-sm">Import multiple records at once using CSV or Excel files.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        <HelpCircle size={16} /> Help Guide
                    </button>
                </div>
            </div>

            {/* Import Type Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {importTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                        <button
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${selectedType === type.id
                                    ? 'border-indigo-600 bg-indigo-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${selectedType === type.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
                                }`}>
                                <Icon size={20} />
                            </div>
                            <h3 className={`font-semibold ${selectedType === type.id ? 'text-indigo-700' : 'text-gray-900'}`}>
                                {type.label}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                        </button>
                    );
                })}
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:flex-row gap-6 flex-1">

                {/* Upload Area */}
                <div className="flex-1">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-gray-800">Upload File</h2>
                            <button
                                onClick={handleDownloadTemplate}
                                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                <Download size={16} /> Download Template
                            </button>
                        </div>

                        {/* Drop Zone */}
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${isDragging
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : file
                                        ? 'border-green-300 bg-green-50'
                                        : 'border-gray-300 bg-gray-50'
                                }`}
                        >
                            {file ? (
                                <div className="flex flex-col items-center">
                                    <FileSpreadsheet size={48} className="text-green-600 mb-4" />
                                    <p className="font-semibold text-gray-900">{file.name}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                    <button
                                        onClick={() => setFile(null)}
                                        className="mt-3 text-sm text-red-600 hover:text-red-700"
                                    >
                                        Remove file
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Upload size={48} className="text-gray-400 mb-4" />
                                    <p className="font-semibold text-gray-700">
                                        Drag and drop your file here
                                    </p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        or click to browse (CSV, XLSX)
                                    </p>
                                    <input
                                        type="file"
                                        accept=".csv,.xlsx"
                                        onChange={handleFileSelect}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        style={{ position: 'absolute', width: '100%', height: '100%' }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Upload Status */}
                        {uploadStatus && (
                            <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${uploadStatus === 'uploading' ? 'bg-blue-50 text-blue-700' :
                                    uploadStatus === 'success' ? 'bg-green-50 text-green-700' :
                                        'bg-red-50 text-red-700'
                                }`}>
                                {uploadStatus === 'uploading' && (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                                        <span>Uploading and processing file...</span>
                                    </>
                                )}
                                {uploadStatus === 'success' && (
                                    <>
                                        <CheckCircle size={20} />
                                        <span>File uploaded successfully! Processing records...</span>
                                    </>
                                )}
                                {uploadStatus === 'error' && (
                                    <>
                                        <AlertCircle size={20} />
                                        <span>Upload failed. Please check the file format.</span>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Upload Button */}
                        <button
                            onClick={handleUpload}
                            disabled={!file || uploadStatus === 'uploading'}
                            className={`mt-6 w-full py-3 rounded-lg font-medium transition-colors ${file && uploadStatus !== 'uploading'
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {uploadStatus === 'uploading' ? 'Processing...' : 'Start Import'}
                        </button>
                    </div>
                </div>

                {/* Instructions Sidebar */}
                <div className="w-full lg:w-80">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                        <h3 className="font-bold text-gray-800 mb-4">Import Guidelines</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex gap-2">
                                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                <span>Download the template for the selected type</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                <span>Fill in the required fields in the spreadsheet</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                <span>Save as CSV or XLSX format</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                                <span>Upload and review the validation results</span>
                            </li>
                        </ul>

                        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <div className="flex gap-2">
                                <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                <div className="text-xs text-amber-700">
                                    <strong>Note:</strong> Duplicate entries will be skipped. Make sure email/phone fields are unique.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BulkImport;
