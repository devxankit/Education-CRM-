import admin from "./firebase.js";

/**
 * Send Firebase push notification to one or more device tokens.
 * Silently ignores empty/invalid token lists so it never breaks main flows.
 */
export const sendPushToTokens = async (tokens, payload) => {
    try {
        if (!tokens || tokens.length === 0) return;

        const uniqueTokens = [...new Set(tokens.filter(Boolean))];
        if (uniqueTokens.length === 0) return;

        const message = {
            notification: {
                title: payload.title,
                body: payload.body,
            },
            data: payload.data || {},
            tokens: uniqueTokens,
        };

        await admin.messaging().sendEachForMulticast(message);
    } catch (err) {
        // Log only – never crash main request
        console.error("FCM send error:", err?.message || err);
    }
};

