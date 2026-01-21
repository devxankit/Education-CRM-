
import React from 'react';
import { CreditCard, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const FeesTab = () => {

    // Mock Data
    const transactions = [
        { id: 'TXN-001', date: '2024-04-10', desc: 'Admission Fee', amount: 5000, status: 'Paid', mode: 'Online' },
        { id: 'TXN-002', date: '2024-04-10', desc: 'Term 1 Tuition', amount: 15000, status: 'Paid', mode: 'Check' },
        { id: 'TXN-003', date: '2024-08-01', desc: 'Term 2 Tuition', amount: 15000, status: 'Pandding', dueDate: '2024-08-15' },
    ];

    return (
        <div className="space-y-6">

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase font-bold">Total Payable (Year)</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">$45,000</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase font-bold">Paid Till Date</p>
                    <h3 className="text-2xl font-bold text-green-600 mt-1">$20,000</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase font-bold">Outstanding</p>
                    <h3 className="text-2xl font-bold text-red-600 mt-1">$25,000</h3>
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={10} /> Next due: 15 Aug</p>
                </div>
            </div>

            {/* Ledger */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Fee Ledger</h3>
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">Download Statement</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-xs text-gray-500 uppercase bg-white border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Date</th>
                                <th className="px-6 py-3 font-semibold">Description</th>
                                <th className="px-6 py-3 font-semibold">Amount</th>
                                <th className="px-6 py-3 font-semibold">Status</th>
                                <th className="px-6 py-3 font-semibold text-right">Reference</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {transactions.map((txn, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-gray-600 text-xs">{txn.date}</td>
                                    <td className="px-6 py-4 font-bold text-gray-800">{txn.desc}</td>
                                    <td className="px-6 py-4 font-mono text-gray-800">${txn.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        {txn.status === 'Paid' ? (
                                            <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold border border-green-200">
                                                <CheckCircle size={10} /> Paid
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold border border-yellow-200">
                                                <Clock size={10} /> Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right text-xs text-gray-500 font-mono">
                                        {txn.mode ? `${txn.mode} • ${txn.id}` : `Due: ${txn.dueDate}`}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default FeesTab;
