import React, { useEffect, useRef } from 'react';
import { colors } from '../../../../theme/colors';
import gsap from 'gsap';

const OverallAttendanceCard = ({ attendance }) => {
    const { percentage, present, total, status, lastUpdated } = attendance;
    const circleRef = useRef(null);
    const textRef = useRef(null);

    // Determine colors
    const getStatusColor = (val) => {
        if (val >= 75) return colors.success; // Green
        if (val >= 70) return colors.warning; // Yellow
        return colors.error; // Red
    };

    const statusColor = getStatusColor(percentage);

    // Circular Progress Logic
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    useEffect(() => {
        // Animate the circle
        gsap.to(circleRef.current, {
            strokeDashoffset: strokeDashoffset,
            duration: 1.5,
            ease: 'power3.out',
            delay: 0.2
        });

        // Animate the number
        gsap.fromTo(textRef.current,
            { innerText: 0 },
            {
                innerText: percentage,
                duration: 1.5,
                snap: { innerText: 1 },
                ease: "power3.out",
                delay: 0.2,
                onUpdate: function () {
                    const val = Math.ceil(this.targets()[0].innerText);
                    textRef.current.innerHTML = `${val}<span class="text-2xl text-gray-500">%</span>`;
                }
            }
        );
    }, [percentage, strokeDashoffset]);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 opacity-50"></div>

            <div className="flex flex-col items-center justify-center relative z-10">
                <div className="relative w-40 h-40 mb-4">
                    {/* Background Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="80"
                            cy="80"
                            r={radius}
                            stroke="#F3F4F6"
                            strokeWidth="12"
                            fill="transparent"
                        />
                        {/* Progress Circle */}
                        <circle
                            ref={circleRef}
                            cx="80"
                            cy="80"
                            r={radius}
                            stroke={statusColor}
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={circumference} // Start full offset
                            strokeLinecap="round"
                        />
                    </svg>

                    {/* Centered Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span
                            ref={textRef}
                            className="text-4xl font-bold text-gray-900"
                        >
                            0<span className="text-2xl text-gray-500">%</span>
                        </span>
                    </div>
                </div>

                <div className="text-center space-y-1">
                    <h3 className="text-gray-900 font-semibold text-lg">Overall Attendance</h3>
                    <p className="text-gray-500 text-sm">
                        Total {total} Classes • Present {present}
                    </p>
                </div>

                {/* Status Badge */}
                <div
                    className="mt-4 px-4 py-1.5 rounded-full text-sm font-medium border"
                    style={{
                        backgroundColor: `${statusColor}15`, // 15 = 10% opacity hex
                        color: statusColor,
                        borderColor: `${statusColor}30`
                    }}
                >
                    Status: {status}
                </div>

                <p className="mt-4 text-xs text-gray-400">
                    Last updated: {new Date(lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
        </div>
    );
};

export default OverallAttendanceCard;
