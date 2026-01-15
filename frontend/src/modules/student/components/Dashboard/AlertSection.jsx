import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Clock, CreditCard } from 'lucide-react';

const AlertSection = ({ alerts = [] }) => {
    return (
        <div className="pt-4 pb-2 px-4 max-w-md mx-auto overflow-hidden">
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
                {alerts.length > 0 ? (
                    alerts.map((alert, index) => {
                        // Map string icons to components
                        let Icon = AlertCircle;
                        if (alert.icon === 'Clock') Icon = Clock;
                        if (alert.icon === 'CreditCard') Icon = CreditCard;

                        return (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`snap-center flex-shrink-0 w-[85%] sm:w-[300px] p-4 rounded-2xl border ${alert.color} shadow-sm flex items-start gap-3`}
                            >
                                <div className="p-2 bg-white/50 rounded-full shrink-0">
                                    <Icon size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">{alert.title}</h3>
                                    <p className="text-xs opacity-90 mt-0.5">{alert.message}</p>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 flex items-center gap-3"
                    >
                        <div className="p-2 bg-white/60 rounded-full text-emerald-600">
                            <CheckCircle size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-emerald-800">All caught up! 🎉</h3>
                            <p className="text-xs text-emerald-600">No pending alerts for today.</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AlertSection;
