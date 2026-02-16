import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { colors } from '../../../../theme/colors';

const PLACEHOLDER_AVATAR = "https://api.dicebear.com/7.x/avataaars/svg?seed=avatar";

const ProfileSummaryCard = ({ student }) => {
    const cardRef = useRef(null);
    const avatarRef = useRef(null);
    const [avatarSrc, setAvatarSrc] = React.useState(student?.avatar || PLACEHOLDER_AVATAR);

    useEffect(() => {
        setAvatarSrc(student?.avatar || PLACEHOLDER_AVATAR);
    }, [student?.avatar]);

    const handleAvatarError = () => {
        setAvatarSrc(student?.id ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}` : PLACEHOLDER_AVATAR);
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(cardRef.current, {
                y: 20,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });
            gsap.from(avatarRef.current, {
                scale: 0.8,
                opacity: 0,
                duration: 1,
                delay: 0.2,
                ease: 'elastic.out(1, 0.5)'
            });
        }, cardRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={cardRef} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden text-center mb-6">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/10 to-primary/5"></div>

            {/* Avatar */}
            <div className="relative mb-4 inline-block">
                <div ref={avatarRef} className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100 mx-auto relative z-10">
                    <img
                        src={avatarSrc}
                        alt={student.name}
                        className="w-full h-full object-cover"
                        onError={handleAvatarError}
                    />
                </div>
                {/* Active Status Dot */}
                <div className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white z-20 ${student.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            </div>

            {/* Basic Info */}
            <div className="relative z-10">
                <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
                <p className="text-sm text-gray-500 font-medium mt-1">Class {student.class} - {student.section} • Roll No: {student.rollNumber}</p>

                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                    ID: {student.id}
                </div>
            </div>
        </div>
    );
};

export default ProfileSummaryCard;
