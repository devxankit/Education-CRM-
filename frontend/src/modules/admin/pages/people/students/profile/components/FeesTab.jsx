
import React from 'react';
import { CreditCard, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const FeesTab = ({ student }) => {
    // For now, no transactions for new student
    const transactions = [];

    const stats = {
        payable: 0,
        paid: 0,
        outstanding: 0
    };

    return (
        <div className="space-y-6">

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase font-bold">Total Payable (Year)</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">₹{stats.payable.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase font-bold">Paid Till Date</p>
                    <h3 className="text-2xl font-bold text-green-600 mt-1">₹{stats.paid.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 uppercase font-bold">Outstanding</p>
                    <h3 className="text-2xl font-bold text-red-600 mt-1">₹{stats.outstanding.toLocaleString()}</h3>
                    {stats.outstanding > 0 && <p className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={10} /> Payment Due</p>}
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
                                    <td className="px-6 py-4 font-mono text-gray-800">₹{txn.amount.toLocaleString()}</td>
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
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <CreditCard size={32} className="opacity-20" />
                                            <p className="font-medium">No transaction history found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default FeesTab;
