export const generateRandomPassword = () => {
    // Generate a random 6-digit numeric password (000000–999999)
    const num = Math.floor(Math.random() * 1000000);
    return String(num).padStart(6, "0");
};