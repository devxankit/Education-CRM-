/**
 * Central API configuration
 * This file provides the base URL for backend connection
 */

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Example usage:
// fetch(`${API_URL}/institute`)
// axios.get(`${API_URL}/staff`)
