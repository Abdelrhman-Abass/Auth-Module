"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    AlertCircle,
    Loader2,
    Sparkles,
} from 'lucide-react';
import { FaCheck } from 'react-icons/fa6';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { createLoginSchema, LoginFormData } from '@/schemas/loginSchema';
import { postServerRequest } from '@/utils/generalServerRequest';
import { useAuthStore } from '@/store/authStore';

interface LoginComponentProps {
    onSwitchToSignup: () => void;
}

const LoginForm: React.FC<LoginComponentProps> = ({ onSwitchToSignup }) => {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuthStore();

    const form = useForm<LoginFormData>({
        resolver: zodResolver(createLoginSchema()),
        mode: 'onTouched',
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const loginMutation = useMutation({
        mutationFn: (data: LoginFormData) =>
            postServerRequest('/api/auth/login', data),
        onSuccess: (response) => {
            if (response.success && response.data?.data) {
                const { user, accessToken, refreshToken } = response.data.data;
                login(user, accessToken, refreshToken);
                form.reset();
                router.push(`/profile/${user.id}`);
            } else {
                form.setError('root', {
                    message: response.message || 'Login failed. Please try again.',
                });
            }
        },
        onError: (error: any) => {
            const message =
                error?.response?.data?.message ||
                'Network error. Please check your connection and try again.';
            form.setError('root', { message });
        },
    });

    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutate(data);
    };

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/auth/google`;
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 max-w-md w-full">
            {/* Header */}
            <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-[#2B4E42] to-[#15326C] rounded-2xl mb-4 shadow-lg">
                    <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-[#2B4E42] to-[#15326C] bg-clip-text text-transparent mb-2">
                    Welcome Back
                </h1>
                <p className="text-gray-600">Login to continue your journey</p>
            </motion.div>

            {/* Global Error Alert */}
            <AnimatePresence>
                {form.formState.errors.root && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-red-700 text-sm">
                            {form.formState.errors.root.message}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    {/* Email Field */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field, fieldState }) => {
                            const isValid =
                                !fieldState.error &&
                                fieldState.isTouched &&
                                (field.value ?? '').trim().length > 0;

                            return (
                                <FormItem>
                                    <FormLabel className="text-gray-700 font-semibold text-sm">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <Input
                                                type="email"
                                                placeholder="you@example.com"
                                                className={`pl-11 h-12 rounded-xl transition-all ${fieldState.error
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                        : isValid
                                                            ? 'border-green-400 focus:border-green-500 focus:ring-green-500 pr-11'
                                                            : 'border-gray-300 focus:border-[#2B4E42] focus:ring-[#2B4E42]'
                                                    }`}
                                                {...field}
                                            />
                                            <AnimatePresence>
                                                {isValid && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0 }}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"
                                                    >
                                                        <FaCheck className="w-3 h-3 text-green-600" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    {/* Password Field */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field, fieldState }) => {
                            const isValid =
                                !fieldState.error &&
                                fieldState.isTouched &&
                                (field.value ?? '').length >= 6;

                            return (
                                <FormItem>
                                    <FormLabel className="text-gray-700 font-semibold text-sm">
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                className={`pl-11 pr-20 h-12 rounded-xl transition-all ${fieldState.error
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                                        : isValid
                                                            ? 'border-green-400 focus:border-green-500 focus:ring-green-500'
                                                            : 'border-gray-300 focus:border-[#2B4E42] focus:ring-[#2B4E42]'
                                                    }`}
                                                {...field}
                                            />

                                            {/* Checkmark */}
                                            <AnimatePresence>
                                                {isValid && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0 }}
                                                        className="absolute right-12 top-1/2 -translate-y-1/2 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"
                                                    >
                                                        <FaCheck className="w-3 h-3 text-green-600" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Toggle Password */}
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(p => !p)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loginMutation.isPending || !form.formState.isValid}
                        className="w-full h-12 bg-linear-to-r from-[#2B4E42] to-[#15326C] hover:from-[#204739] hover:to-[#0d1e45] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    >
                        {loginMutation.isPending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Signing in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </Button>
                </form>
            </Form>

            {/* Divider */}
            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                    <span className="px-4 bg-white/80 text-sm text-gray-500">OR</span>
                </div>
            </div>

            {/* Google Login */}
            <Button
                type="button"
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full h-12 border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-xl flex items-center justify-center gap-3 font-medium"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25h-11.2v4.26h6.13c-.27 1.47-1.09 2.72-2.33 3.55v2.93h3.76c2.2-2.03 3.47-5.02 3.47-8.55z" fill="#4285F4" />
                    <path d="M12.16 24c3.24 0 5.96-1.08 7.95-2.92l-3.76-2.93c-1.04.7-2.38 1.11-3.98 1.11-3.06 0-5.65-2.06-6.58-4.84h-3.96v3.06c2.04 4.03 6.23 6.63 10.33 6.63z" fill="#34A853" />
                    <path d="M5.58 14.07c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27v-3.06h-3.96c-.99 2.01-1.56 4.29-1.56 6.68s.57 4.67 1.56 6.68l3.96-3.06z" fill="#FBBC05" />
                    <path d="M12.16 5.56c1.7 0 3.23.58 4.43 1.74l3.31-3.31c-2-1.89-4.63-3.06-7.74-3.06-4.1 0-7.61 2.25-9.38 5.52l4.02 3.12c.93-2.78 3.52-4.72 6.36-4.72z" fill="#EA4335" />
                </svg>
                Continue with Google
            </Button>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
                <span className="text-gray-600">Don&apos;t have an account? </span>
                <button
                    type="button"
                    onClick={onSwitchToSignup}
                    className="text-[#2B4E42] hover:text-[#1e3a32] font-semibold transition-colors"
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
};

export default LoginForm;