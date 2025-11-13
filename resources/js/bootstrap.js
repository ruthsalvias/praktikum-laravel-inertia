import axios from 'axios';
window.axios = axios;

// Set default headers for CSRF token and content type
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Get CSRF token from meta tag
const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
}

// Default content type
window.axios.defaults.headers.common['Content-Type'] = 'application/json';

// Ensure credentials are sent with requests
window.axios.defaults.withCredentials = true;

// Add request interceptor to ensure CSRF token is always sent
window.axios.interceptors.request.use(
    (config) => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken && !config.headers['X-CSRF-TOKEN']) {
            config.headers['X-CSRF-TOKEN'] = csrfToken;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle 419 errors gracefully
window.axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 419) {
            // Token expired - refresh the page to get new token
            window.location.reload();
        }
        return Promise.reject(error);
    }
);
