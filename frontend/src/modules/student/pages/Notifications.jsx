
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Bell, CheckCircle, AlertTriangle, Info, Calendar, Clock, Check } from 'lucide-react';
import Lenis from 'lenis';

// Data
import { notificationsData } from '../data/notificationsData';

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState(notificationsData);

    // Smooth Scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            smooth: true,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => lenis.destroy();
    }, []);

    const markAllRead = () => {
        const updated = notifications.map(n => ({ ...n, read: true }));
        setNotifications(updated);
    };

    const markRead = (id) => {
        const updated = notifications.map(n => n.id === id ? ({ ...n, read: true }) : n);
        setNotifications(updated);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'alert': return <AlertTriangle size={20} className="text-red-500" />;
            case 'success': return <CheckCircle size={20} className="text-emerald-500" />;
            case 'info': return <Info size={20} className="text-blue-500" />;
            default: return <Bell size={20} className="text-indigo-500" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'alert': return 'bg-red-50';
            case 'success': return 'bg-emerald-50';
            case 'info': return 'bg-blue-50';
            default: return 'bg-indigo-50';
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3">
                <div className="max-w-md mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                        >
                            <ArrowLeft size={22} />
                        </button>
                        <h1 className="text-lg font-bold text-gray-900">Notifications</h1>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="text-xs font-semibold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-full transition-colors"
                        >
                            Mark all read
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <main className="px-4 max-w-md mx-auto space-y-3 pt-6">
                <AnimatePresence>
                    {notifications.length > 0 ? (
                        notifications.map((note, index) => (
                            <motion.div
                                key={note.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => markRead(note.id)}
                                className={`relative p-4 rounded-2xl border transition-all cursor-pointer ${note.read
                                        ? 'bg-white border-gray-100'
                                        : 'bg-white border-indigo-100 shadow-[0_4px_12px_-4px_rgba(99,102,241,0.1)]'
                                    }`}
                            >
                                <div className="flex gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getBgColor(note.type)}`}>
                                        {getIcon(note.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className={`text-sm font-semibold mb-1 ${note.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                                {note.title}
                                            </h3>
                                            <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                                                {note.time}
                                            </span>
                                        </div>
                                        <p className={`text-xs leading-relaxed ${note.read ? 'text-gray-500' : 'text-gray-600'}`}>
                                            {note.message}
                                        </p>
                                    </div>
                                </div>
                                {!note.read && (
                                    <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-500 rounded-full"></div>
                                )}
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-20 opacity-50">
                            <Bell size={40} className="mx-auto mb-2" />
                            <p>No notifications</p>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Notifications;
