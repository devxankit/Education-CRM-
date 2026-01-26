
import React from 'react';

const TemplatePreview = ({ template, variables }) => {

    // Mock Data Replacement
    const mockData = {
        '{{student_name}}': 'Rahul Sharma',
        '{{admission_no}}': 'ADM-2023-001',
        '{{class}}': 'X',
        '{{section}}': 'A',
        '{{academic_year}}': '2025-26',
        '{{school_name}}': 'Sunshine International School',
        '{{issue_date}}': '26 Jan 2026',
        '{{father_name}}': 'Mr. Rajesh Sharma',
        '{{dob}}': '15 Aug 2010',
        '{{employee_name}}': 'Priya Singh',
        '{{designation}}': 'Senior Teacher',
        '{{department}}': 'Science'
    };

    // Helper to replace variables in content
    const processContent = (content) => {
        let processed = content;
        Object.keys(mockData).forEach(key => {
            // Simple replaceAll equivalent
            processed = processed.split(key).join(`<span class="bg-yellow-100 text-yellow-800 font-medium px-1 rounded">${mockData[key]}</span>`);
        });
        return processed;
    };

    // Aspect Ratio Calculation (A4 is ~1:1.414)
    // We scale it down to fit container

    return (
        <div className="h-full bg-gray-100 p-8 overflow-y-auto flex items-start justify-center">

            {/* A4 Paper */}
            <div
                className="bg-white shadow-2xl relative transition-all duration-300 mx-auto"
                style={{
                    width: '210mm',
                    height: '297mm', // Standard A4
                    transform: 'scale(0.85)', // Zoom out slightly to fit
                    transformOrigin: 'top center',
                    padding: '24mm' // Standard Margin
                }}
            >
                {/* Header (Logo & School Name) */}
                <div className="text-center border-b-2 border-indigo-900 pb-6 mb-8">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full mx-auto mb-4 flex items-center justify-center text-indigo-700 font-bold text-2xl">
                        LOGO
                    </div>
                    <h1 className="text-3xl font-bold text-indigo-900 uppercase tracking-wide">Sunshine International School</h1>
                    <p className="text-gray-500 mt-2 text-sm">123, Knowledge Park, Pune, Maharashtra - 411057</p>
                </div>

                {/* Certificate Title */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-serif font-bold text-gray-800 underline decoration-double decoration-gray-300 py-2">
                        {template.purpose || 'Certificate Title'}
                    </h2>
                </div>

                {/* Body Content */}
                <div
                    className="prose prose-lg max-w-none font-serif text-gray-800 leading-relaxed text-justify"
                    dangerouslySetInnerHTML={{ __html: processContent(template.content) }}
                >
                    {/* Content Injected Here */}
                </div>

                {/* Footer / Signatures */}
                <div className="absolute bottom-24 left-24 right-24 flex justify-between items-end">
                    <div className="text-center">
                        <p className="text-sm font-bold text-gray-900 mb-8">{{ issue_date }}</p>
                        <div className="border-t border-gray-400 w-32 mx-auto pt-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                            Date of Issue
                        </div>
                    </div>

                    <div className="text-center">
                        {/* Signature Placeholder */}
                        <div className="h-16 flex items-end justify-center mb-2">
                            <span className="font-dancing-script text-2xl text-indigo-800">Principal Sign</span>
                        </div>
                        <div className="border-t border-gray-400 w-48 mx-auto pt-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                            Principal Signature
                        </div>
                    </div>
                </div>

                {/* Watermark (Optional) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                    <div className="w-96 h-96 rounded-full border-[20px] border-black"></div>
                </div>

            </div>

        </div>
    );
};

export default TemplatePreview;
