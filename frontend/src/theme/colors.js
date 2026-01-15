
// ------------------------------------------------------------------
// 🎨 GLOBAL BRAND THEME (Change these hex codes to rebrand the app)
// ------------------------------------------------------------------
const palette = {
    primary: '#3f206c',       // Deep Purple
    primaryLight: '#5d3a9b',  // Lighter shade (for gradients)
    primaryDark: '#2a154c',   // Darker shade (for deep contrast)
};

export const colors = {
    // Brand Colors (Linked to palette above)
    primary: palette.primary,
    primaryLight: palette.primaryLight,
    primaryDark: palette.primaryDark,

    // Neutrals
    secondary: '#F3F4F6', // Page Background
    white: '#FFFFFF',
    black: '#111827',

    // Semantic Status Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Module Specific (Linked to Brand Primary by default)
    student: {
        primary: palette.primary,
        secondary: palette.primaryLight,
        background: '#FFFFFF',
        cardBg: '#F9FAFB',
        text: '#1F2937',
        muted: '#6B7280',
        highlight: '#F3E8FF', // Light tint of primary
    },

    // Other modules (Placeholders)
    teacher: { primary: '#6366F1' },
    parent: { primary: '#10B981' },
    admin: { primary: '#1E293B' },
    staff: { primary: '#8B5CF6' },
};
