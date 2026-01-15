import { colors } from './colors';
// Import other theme files when created: typography, spacing, scenarios, etc.

export const theme = {
    colors,
    // placeholders for others
    typography: {
        fontFamily: '"Inter", sans-serif',
    },
    spacing: (factor) => `${factor * 4}px`,
};
