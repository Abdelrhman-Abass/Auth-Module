export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500
};


export const JWT_CONFIG = {
    ACCESS_TOKEN_EXPIRE: '24h',
    REFRESH_TOKEN_EXPIRE: '30d'
};

export const COOKIE_CONFIG = {
    NAME: 'refresh_token',
    SECURE: process.env['NODE_ENV'] === 'production',
    SAME_SITE: 'lax' as const,
    PATH: '/',
    MAX_AGE: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
};