import React from 'react';

const AttendanceHistory = ({ history }) => {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 ml-1">Recent Activity</h3>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {(history || []).map((log) => (
                            <tr key={log.id}>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {log.dateStr || (log.date ? new Date(log.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—')}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                    <div className="font-medium text-gray-900">{log.subject || 'All Classes'}</div>
                                    {log.markedBy && <div className="text-xs text-gray-400">By: {log.markedBy}</div>}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${log.status === 'Present' ? 'bg-green-100 text-green-800' : ''}
                                        ${log.status === 'Absent' ? 'bg-red-100 text-red-800' : ''}
                                        ${log.status === 'Late' ? 'bg-yellow-100 text-yellow-800' : ''}
                                    `}>
                                        {log.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceHistory;
