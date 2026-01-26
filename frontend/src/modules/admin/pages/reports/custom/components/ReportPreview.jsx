import React, { useState } from 'react';
import { Play, AlertTriangle } from 'lucide-react';
import ReportTable from '../../../../components/reports/ReportTable';

const ReportPreview = ({ config }) => {

    const [loading, setLoading] = useState(false);
    const [previewData, setPreviewData] = useState(null);

    const handleRunPreview = () => {
        setLoading(true);
        // Simulate API delay
        setTimeout(() => {
            setLoading(false);
            setPreviewData(generateMockData(config.fields));
        }, 1200);
    };

    // Helper to generate fake data based on selected fields
    const generateMockData = (fields) => {
        const rows = 5;
        const data = [];
        for (let i = 0; i < rows; i++) {
            const row = {};
            fields.forEach(field => {
                if (field.includes('date')) row[field] = '2026-01-26';
                else if (field.includes('amount')) row[field] = (Math.random() * 10000).toFixed(2);
                else if (field.includes('id')) row[field] = `ID-${1000 + i}`;
                else row[field] = `Sample ${field}`;
            });
            data.push(row);
        }
        return data;
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-800">Preview & Validate</h3>
                <p className="text-sm text-gray-500">Run a limited preview (top 5 rows) to verify your configuration before saving.</p>
            </div>

            {/* Config Summary Card */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-600 flex flex-wrap gap-x-6 gap-y-2">
                <div>Source: <span className="font-semibold text-gray-900 capitalize">{config.source}</span></div>
                <div>Fields: <span className="font-semibold text-gray-900">{config.fields.length} Selected</span></div>
                <div>Filters: <span className="font-semibold text-gray-900">{config.filters.length} Conditions</span></div>
                <div>Sort: <span className="font-semibold text-gray-900">{config.grouping.sortBy || 'Default'}</span></div>
            </div>

            {!previewData && !loading && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 flex flex-col items-center justify-center bg-gray-50/50">
                    <button
                        onClick={handleRunPreview}
                        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
                    >
                        <Play size={18} fill="currentColor" /> Run Preview
                    </button>
                    <p className="text-gray-400 text-sm mt-3">Click to fetch mock data</p>
                </div>
            )}

            {loading && (
                <div className="border border-gray-200 rounded-lg p-10 flex flex-col items-center justify-center bg-white min-h-[300px]">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 text-sm mt-3">Fetching preview data...</p>
                </div>
            )}

            {previewData && (
                <div className="space-y-4">
                    <ReportTable
                        columns={config.fields.map(f => ({ header: f, key: f }))}
                        data={previewData}
                    />

                    <div className="bg-yellow-50 border border-yellow-100 p-3 rounded flex items-center gap-2 text-yellow-800 text-xs">
                        <AlertTriangle size={14} />
                        <span><strong>Disclaimer:</strong> This is a preview using sample data. Actual report results may vary based on live database state.</span>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={() => setPreviewData(null)}
                            className="text-xs text-indigo-600 hover:underline"
                        >
                            Reset Preview
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportPreview;
