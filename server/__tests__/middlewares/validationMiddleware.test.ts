// __tests__/middlewares/validationMiddleware.test.ts

import { validate } from '../../middlewares/validationMiddleware';
import { registerSchema, loginSchema } from '../../validators/authValidator';
import { mockRequest, mockResponse, mockNext } from '../helpers';

describe('Validation Middleware', () => {
    let req: any;
    let res: any;
    let next: jest.Mock;

    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();
        next = mockNext;
        jest.clearAllMocks();
    });

    describe('validate with registerSchema', () => {
        it('should pass valid registration data', () => {
            req.body = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'Password123!',
            };

            const middleware = validate(registerSchema);
            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith();        // passes through
            expect(next).toHaveBeenCalledTimes(1);
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should reject invalid email format and send error response', () => {
            req.body = {
                name: 'Test User',
                email: 'invalid-email',
                password: 'Password123!',
            };

            const middleware = validate(registerSchema);
            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Validation failed',
                })
            );
            expect(next).not.toHaveBeenCalled();
        });

        it('should reject short password', () => {
            req.body = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'short',
            };

            const middleware = validate(registerSchema);
            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Validation failed',
                })
            );
        });

        it('should reject missing required fields', () => {
            req.body = { email: 'test@example.com' };

            const middleware = validate(registerSchema);
            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: false })
            );
        });

        it('should reject empty name', () => {
            req.body = {
                name: '',
                email: 'test@example.com',
                password: 'Password123!',
            };

            const middleware = validate(registerSchema);
            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: false })
            );
        });
    });

    describe('validate with loginSchema', () => {
        it('should pass valid login data', () => {
            req.body = {
                email: 'test@example.com',
                password: 'Password123!',
            };

            const middleware = validate(loginSchema);
            middleware(req, res, next);

            expect(next).toHaveBeenCalledWith();
            expect(res.status).not.toHaveBeenCalled();
        });

        it('should reject invalid email', () => {
            req.body = {
                email: 'not-an-email',
                password: 'Password123!',
            };

            const middleware = validate(loginSchema);
            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: false,
                    message: 'Validation failed',
                })
            );
        });

        it('should reject missing password', () => {
            req.body = { email: 'test@example.com' };

            const middleware = validate(loginSchema);
            middleware(req, res, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: false })
            );
        });
    });
});