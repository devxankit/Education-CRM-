import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Award, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { useStudentStore } from '../../../../store/studentStore';

const ResultDetailModal = ({ result, onClose }) => {
    const profile = useStudentStore(state => state.profile);

    const handleDownloadMarksheet = useCallback(() => {
        if (!result) return;
        try {
            const doc = new jsPDF();
            const studentName = profile ? [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Student' : 'Student';

            // Header
            doc.setFontSize(18);
            doc.setFont(undefined, 'bold');
            doc.text(result.examName || 'Exam Result', 105, 20, { align: 'center' });
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            doc.text('Report Card', 105, 28, { align: 'center' });
            doc.setFontSize(10);
            doc.text(`Student: ${studentName}`, 14, 38);
            doc.text(`Date: ${result.date ? new Date(result.date).toLocaleDateString() : '-'}`, 14, 44);

            // Score summary
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.text(`Total Score: ${result.percentage}% (${result.grade})`, 14, 54);

            // Subjects table
            const tableData = (result.subjects || []).map(s => [
                s.name || 'Subject',
                `${s.marks ?? 0} / ${s.total ?? 0}`,
                s.grade || '—',
                s.status || '—'
            ]);

            autoTable(doc, {
                startY: 62,
                head: [['Subject', 'Marks', 'Grade', 'Status']],
                body: tableData,
                theme: 'grid',
                headStyles: { fillColor: [79, 70, 229], fontSize: 10 },
                styles: { fontSize: 9 }
            });

            const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 80;

            // Remarks
            if (result.remarks) {
                doc.setFontSize(10);
                doc.setFont(undefined, 'bold');
                doc.text('Teacher Remarks:', 14, finalY);
                doc.setFont(undefined, 'normal');
                const splitRemarks = doc.splitTextToSize(`"${result.remarks}"`, 180);
                doc.text(splitRemarks, 14, finalY + 6);
            }

            doc.save(`Marksheet_${(result.examName || 'Exam').replace(/\s+/g, '_')}.pdf`);
        } catch (err) {
            console.error('Failed to generate marksheet:', err);
            alert('Failed to download marksheet. Please try again.');
        }
    }, [result, profile]);

    if (!result) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden max-h-[85vh] flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{result.examName}</h2>
                        <p className="text-xs text-gray-500">Report Card</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto custom-scrollbar">
                    {/* Big Score Header */}
                    <div className="flex items-center justify-between bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-5 mb-6">
                        <div>
                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">Total Score</p>
                            <h1 className="text-3xl font-extrabold text-gray-900">{result.percentage}% <span className="text-sm font-medium text-gray-400 font-normal">({result.grade})</span></h1>
                        </div>
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-indigo-600">
                            <Award size={24} />
                        </div>
                    </div>

                    {/* Breakdown Table */}
                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden mb-6">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-4 py-3">Subject</th>
                                    <th className="px-4 py-3 text-center">Marks</th>
                                    <th className="px-4 py-3 text-right">Grade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {result.subjects && result.subjects.length > 0 ? (
                                    result.subjects.map((sub, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-gray-800">{sub.name}</td>
                                            <td className="px-4 py-3 text-center text-gray-600">
                                                {sub.marks || 0} <span className="text-[10px] text-gray-400">/ {sub.total || 0}</span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <span className={`font-bold ${
                                                    sub.status === 'Pass' ? 'text-emerald-600' : 
                                                    sub.status === 'Fail' ? 'text-red-600' : 
                                                    'text-gray-900'
                                                }`}>
                                                    {sub.grade || 'N/A'}
                                                </span>
                                                {sub.status && (
                                                    <span className={`ml-2 text-[10px] px-2 py-0.5 rounded ${
                                                        sub.status === 'Pass' ? 'bg-emerald-50 text-emerald-600' : 
                                                        sub.status === 'Fail' ? 'bg-red-50 text-red-600' : 
                                                        'bg-gray-50 text-gray-600'
                                                    }`}>
                                                        {sub.status}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-4 py-8 text-center text-gray-400 text-sm">
                                            No subject results available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Remarks */}
                    <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 mb-6">
                        <h4 className="text-xs font-bold text-yellow-800 uppercase mb-2">Teacher Remarks</h4>
                        <p className="text-sm text-yellow-900 italic leading-relaxed">"{result.remarks}"</p>
                    </div>

                    {/* Download Action */}
                    <button
                        onClick={handleDownloadMarksheet}
                        className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-800 active:scale-[0.98] transition-all"
                    >
                        <Download size={18} />
                        Download Marksheet
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ResultDetailModal;
