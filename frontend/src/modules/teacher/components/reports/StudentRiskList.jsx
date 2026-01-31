import React, { useState } from 'react';
import { ArrowUpRight, X, AlertTriangle, Phone, Mail, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentRiskList = ({ students }) => {
    const [selectedStudent, setSelectedStudent] = useState(null);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900">At-Risk Students</h3>
                <span className="text-[10px] font-bold bg-orange-50 text-orange-700 px-2 py-1 rounded-full">{students.length} Critical</span>
            </div>

            <div className="space-y-3">
                {students.map((student) => (
                    <div
                        key={student.id}
                        onClick={() => setSelectedStudent(student)}
                        className="flex items-start justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group cursor-pointer hover:border-orange-200 transition-colors"
                    >
                        <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-1">{student.name}</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {student.riskFactors.map((factor, idx) => (
                                    <span key={idx} className="text-[10px] font-medium text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">
                                        {factor}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button className="text-gray-400 hover:text-indigo-600 p-1">
                            <ArrowUpRight size={18} />
                        </button>
                    </div>
                ))}

                {students.length === 0 && (
                    <div className="text-center py-4 text-xs text-gray-400 font-medium">
                        No at-risk students identified. Good job!
                    </div>
                )}
            </div>

            {/* Risk Detail Modal */}
            <AnimatePresence>
                {selectedStudent && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedStudent(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden"
                        >
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-orange-50/50">
                                <div className="flex items-center gap-2 text-orange-700">
                                    <AlertTriangle size={18} />
                                    <h3 className="text-sm font-bold uppercase tracking-wider">Risk Analysis</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedStudent(null)}
                                    className="p-1.5 rounded-full hover:bg-white transition-colors"
                                >
                                    <X size={18} className="text-gray-400" />
                                </button>
                            </div>

                            <div className="p-5">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
                                        <User size={28} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">{selectedStudent.name}</h4>
                                        <p className="text-xs text-gray-500 font-medium">Student ID: {selectedStudent.id}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Identified Risk Factors</label>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedStudent.riskFactors.map((factor, idx) => (
                                                <span key={idx} className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                                                    {factor}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Contact Parent</label>
                                        <div className="flex gap-2">
                                            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors">
                                                <Phone size={14} /> Call
                                            </button>
                                            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors">
                                                <Mail size={14} /> Email
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        alert("Intervention report generated and sent to Principal.");
                                        setSelectedStudent(null);
                                    }}
                                    className="w-full py-3 bg-orange-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 active:scale-[0.98] transition-all"
                                >
                                    Initiate Intervention
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentRiskList;
