import React, { useEffect } from 'react';
import { IndianRupee, FileText } from 'lucide-react';
import { useTeacherStore } from '../../../../store/teacherStore';
import { useNavigate } from 'react-router-dom';

const PayrollHistoryCard = () => {
    const { fetchPayrollHistory, payrollHistory, isFetchingPayroll } = useTeacherStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPayrollHistory();
    }, [fetchPayrollHistory]);

    const latestPayroll = payrollHistory.length > 0 ? payrollHistory[0] : null;

    const getMonthName = (month) => {
        return new Date(2000, month - 1).toLocaleString('default', { month: 'short' });
    };

    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Payroll & Earnings</h3>
                {latestPayroll && (
                    <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
                        Status: {latestPayroll.status}
                    </span>
                )}
            </div>

            <div className="flex items-center justify-between">
                <div>
                    {latestPayroll ? (
                        <>
                            <p className="text-sm text-gray-500 mb-1">Last Salary ({getMonthName(latestPayroll.month)} {latestPayroll.year})</p>
                            <h2 className="text-2xl font-bold text-gray-900">₹{latestPayroll.netSalary?.toLocaleString()}</h2>
                            <p className="text-xs text-gray-400 mt-1">Paid on {latestPayroll.paymentDate ? new Date(latestPayroll.paymentDate).toLocaleDateString() : 'Processing'}</p>
                        </>
                    ) : (
                        isFetchingPayroll ? (
                            <div className="animate-pulse space-y-2">
                                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                                <div className="h-8 w-32 bg-gray-200 rounded"></div>
                            </div>
                        ) : (
                            <div className="text-gray-400">
                                <p className="text-sm font-medium">No payment records available.</p>
                            </div>
                        )
                    )}
                </div>

                <button
                    onClick={() => navigate('/teacher/payroll')}
                    className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 hover:scale-105 active:scale-95 transition-all shadow-sm group"
                >
                    <FileText size={22} className="group-hover:text-indigo-700" />
                </button>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center">
                <p className="text-xs text-gray-400 font-medium">
                    {payrollHistory.length} Record{payrollHistory.length !== 1 ? 's' : ''} Found
                </p>
                <button
                    onClick={() => navigate('/teacher/payroll')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                    View All Records →
                </button>
            </div>
        </div>
    );
};

export default PayrollHistoryCard;
