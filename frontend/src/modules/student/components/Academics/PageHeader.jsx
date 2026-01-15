import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PageHeader = ({ title }) => {
    const navigate = useNavigate();

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)]"
        >
            <button
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 rounded-full hover:bg-gray-50 active:scale-95 transition-all text-gray-600"
            >
                <ArrowLeft size={22} />
            </button>
            <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        </motion.header>
    );
};

export default PageHeader;
