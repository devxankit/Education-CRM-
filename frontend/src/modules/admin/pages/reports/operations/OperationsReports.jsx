import React from 'react';
import { Info } from 'lucide-react';
import SimpleOperationsTable from './components/SimpleOperationsTable';

const OperationsReports = () => {

    return (
        <div className="min-h-[calc(100vh-10rem)] overflow-hidden bg-gray-50 border border-gray-200 rounded-xl -mx-4 md:-mx-6 flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 font-['Poppins']">Transport & Operations Summary</h1>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        Simple overview of routes, hostels and support activity.
                        <Info size={14} className="text-gray-400" />
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto pb-10">
                    <SimpleOperationsTable />
                </div>
            </div>

        </div>
    );
};

export default OperationsReports;
