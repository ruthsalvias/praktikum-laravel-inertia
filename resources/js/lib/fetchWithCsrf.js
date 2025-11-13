/**
 * Helper function to get CSRF token
 */
export function getCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
}

/**
 * Helper function to make fetch requests with CSRF token and proper headers
 */
export async function fetchWithCsrf(url, options = {}) {
    const csrfToken = getCsrfToken();
    
    const headers = {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        ...options.headers,
    };
    
    if (csrfToken) {
        headers['X-CSRF-TOKEN'] = csrfToken;
    }

    return fetch(url, {
        ...options,
        headers,
        credentials: 'include',
    });
}
