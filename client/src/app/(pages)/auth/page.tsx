"use client";

import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useHomeStore } from '@/store/homeStore';

// Lazy load components for code splitting
const LoginComponent = lazy(() => import('@/components/auth/LoginForm'));
const SignUpComponent = lazy(() => import('@/components/auth/SignUpForm'));

// Loading component
const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
        >
            <Loader2 className="w-12 h-12 animate-spin text-[#2B4E42] mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
        </motion.div>
    </div>
);

const AuthPage: React.FC = () => {
    const searchParams = useSearchParams();
    const { authMode, switchToLogin, switchToSignup } = useHomeStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // // Check URL params on mount
    // useEffect(() => {
    //     const mode = searchParams.get('mode');
    //     if (mode === 'signup') {
    //         switchToSignup();
    //     } else {
    //         switchToLogin();
    //     }
    // }, [searchParams, switchToLogin, switchToSignup]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center relative overflow-hidden p-4">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Floating gradient orbs */}
                <motion.div
                    className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300/30 to-purple-300/30 rounded-full blur-3xl"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-green-300/30 to-blue-300/30 rounded-full blur-3xl"
                    animate={{
                        x: [0, -30, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Floating particles - Deterministic rendering */}
                {mounted && [...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-blue-400/40 rounded-full"
                        style={{
                            top: `${(i * 17 + 5) % 100}%`,
                            left: `${(i * 23 + 10) % 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: 3 + i,
                            repeat: Infinity,
                            delay: i * 0.5,
                        }}
                    />
                ))}

                {/* Rotating circles */}
                <motion.div
                    className="absolute top-1/4 right-1/4 w-32 h-32 border-2 border-blue-200/30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute bottom-1/3 left-1/3 w-24 h-24 border-2 border-green-200/30 rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Auth Form Container */}
            <motion.div
                className="w-full max-w-lg relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <AnimatePresence mode="wait">
                    <Suspense fallback={<LoadingFallback />}>
                        {authMode === 'login' ? (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <LoginComponent onSwitchToSignup={switchToSignup} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="signup"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <SignUpComponent onSwitchToLogin={switchToLogin} />
                            </motion.div>
                        )}
                    </Suspense>
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default AuthPage;