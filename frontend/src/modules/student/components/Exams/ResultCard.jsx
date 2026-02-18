import React, { useRef, useEffect } from 'react';
import { ChevronRight, Award, CheckCircle, XCircle } from 'lucide-react';
import gsap from 'gsap';

const ResultCard = ({ result, index, onClick }) => {
    const cardRef = useRef(null);
    const progressRef = useRef(null);

    const isPass = result.status === 'Pass';
    const borderColor = isPass ? 'border-emerald-100 hover:border-emerald-200' : 'border-red-100 hover:border-red-200';
    const bgColor = isPass ? 'bg-emerald-50' : 'bg-red-50';
    const textColor = isPass ? 'text-emerald-700' : 'text-red-700';

    useEffect(() => {
        // Entrance
        gsap.fromTo(cardRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, delay: index * 0.1, ease: 'power2.out' }
        );

        // Progress Bar Fill
        gsap.fromTo(progressRef.current,
            { width: "0%" },
            { width: `${result.percentage}%`, duration: 1.2, delay: 0.3 + (index * 0.1), ease: 'power2.out' }
        );
    }, [index, result.percentage]);

    return (
        <div
            ref={cardRef}
            onClick={() => onClick(result)}
            className={`bg-white rounded-2xl p-5 border ${borderColor} shadow-sm relative overflow-hidden cursor-pointer group mb-4 transition-all active:scale-[0.98]`}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-base font-bold text-gray-900">{result.examName}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                        Published on {new Date(result.date || result.publishedDate || result.updatedAt).toLocaleDateString()}
                    </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${bgColor} ${textColor}`}>
                    {isPass ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {result.status}
                </div>
            </div>

            <div className="flex items-end justify-between mb-2">
                <div>
                    <span className="text-3xl font-extrabold text-gray-900">{result.percentage}%</span>
                    <span className="text-xs text-gray-400 font-medium ml-1">Overall</span>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 font-medium">Marks Obtained</p>
                    <p className="text-sm font-bold text-gray-800">
                        {result.obtainedMarks || (result.subjects?.reduce((sum, s) => sum + (s.marks || 0), 0) || 0)} 
                        <span className="text-gray-400 text-xs font-normal"> / {result.totalMarks || (result.subjects?.reduce((sum, s) => sum + (s.total || 0), 0) || 0)}</span>
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                <div
                    ref={progressRef}
                    className={`h-full rounded-full ${isPass ? 'bg-emerald-500' : 'bg-red-500'}`}
                ></div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <Award size={14} className="text-yellow-500" />
                    Grade: <span className="text-gray-900 font-bold">{result.grade}</span>
                </div>
                <div className="text-primary text-xs font-bold flex items-center hover:translate-x-1 transition-transform">
                    View Report <ChevronRight size={14} />
                </div>
            </div>
        </div>
    );
};

export default ResultCard;
