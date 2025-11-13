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

// Track 419 errors to prevent infinite loops
let is419Retrying = false;

// Add response interceptor to handle 419 errors gracefully
window.axios.interceptors.response.use(
    (response) => response,
    (error) => {
        // If 419 and it's a GET request (page load), retry once after a small delay
        if (error.response?.status === 419 && error.config?.method?.toUpperCase() === 'GET' && !is419Retrying) {
            is419Retrying = true;
            
            // Wait a bit for session to settle, then retry
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    axios.request(error.config)
                        .then((response) => {
                            is419Retrying = false;
                            resolve(response);
                        })
                        .catch((retryError) => {
                            is419Retrying = false;
                            reject(retryError);
                        });
                }, 100); // Small delay to allow session to settle
            });
        }
        return Promise.reject(error);
    }
);
