
import React from 'react';
import useAdminStore from '@/store/adminStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContainer = () => {
    const { toasts, removeToast } = useAdminStore();

    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        className={`
                            pointer-events-auto
                            flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border min-w-[300px]
                            ${toast.type === 'success' ? 'bg-white border-green-100' : 
                              toast.type === 'error' ? 'bg-white border-red-100' : 
                              'bg-white border-blue-100'}
                        `}
                    >
                        <div className={`
                            p-2 rounded-lg
                            ${toast.type === 'success' ? 'bg-green-50 text-green-600' : 
                              toast.type === 'error' ? 'bg-red-50 text-red-600' : 
                              'bg-blue-50 text-blue-600'}
                        `}>
                            {toast.type === 'success' ? <CheckCircle size={18} /> : 
                             toast.type === 'error' ? <AlertCircle size={18} /> : 
                             <Info size={18} />}
                        </div>
                        
                        <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">{toast.message}</p>
                        </div>

                        <button 
                            onClick={() => removeToast(toast.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;
