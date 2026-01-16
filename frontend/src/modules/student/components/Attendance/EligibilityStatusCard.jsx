import React from 'react';
import { colors } from '../../../../theme/colors';

const EligibilityStatusCard = ({ eligibility }) => {
    const { isEligible, requiredPercentage, classesNeeded } = eligibility;

    // Derived state
    const borderColor = isEligible ? colors.success : colors.warning;
    const bgColor = isEligible ? '#F0FDF4' : '#FFFBEB'; // green-50 : amber-50
    const textColor = isEligible ? '#166534' : '#B45309'; // green-800 : amber-700
    const icon = isEligible ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    );

    return (
        <div
            className="rounded-xl p-4 border flex items-start gap-4"
            style={{
                backgroundColor: bgColor,
                borderColor: `${borderColor}40`
            }}
        >
            <div style={{ color: borderColor }}>
                {icon}
            </div>

            <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1" style={{ color: textColor }}>
                    {isEligible ? "Exam Eligibility: Eligible" : "Exam Eligibility: Risk"}
                </h4>

                <p className="text-sm text-gray-700 leading-relaxed">
                    {isEligible
                        ? `You have maintained above ${requiredPercentage}% attendance. Great job!`
                        : `You are currently below the ${requiredPercentage}% threshold.`
                    }
                </p>

                {!isEligible && classesNeeded > 0 && (
                    <div className="mt-2 text-sm font-medium" style={{ color: textColor }}>
                        Action: Attend the next <span className="underline">{classesNeeded} classes</span> to reach {requiredPercentage}%.
                    </div>
                )}
            </div>
        </div>
    );
};

export default EligibilityStatusCard;
