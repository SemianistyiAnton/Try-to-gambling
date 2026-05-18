export class AuthProxy {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.token = null;
    }

    setToken(token) {
        this.token = token;
    }

    async request(endpoint, options = {}) {
        const headers = new Headers(options.headers || {});
        
        if (this.token) {
            headers.set('Authorization', `Bearer ${this.token}`);
        }
        
        if (options.body && typeof options.body === 'string') {
            headers.set('Content-Type', 'application/json');
        }

        const config = {
            ...options,
            headers
        };

        console.log(`[AuthProxy] work ${options.method || 'GET'} request ${endpoint}`);

        const response = await fetch(`${this.baseUrl}${endpoint}`, config);
        
        if (response.status === 401) {
            console.error('[AuthProxy]miss login');
        }

        return response;
    }

    get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    post(endpoint, body, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: typeof body === 'string' ? body : JSON.stringify(body)
        });
    }
}