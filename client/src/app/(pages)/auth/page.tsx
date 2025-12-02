"use client";

import React, { lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHomeStore } from '@/store/homeStore';
import LoadingFallback from '@/components/common/loadingFallback';

const LoginComponent = lazy(() => import('@/components/auth/LoginForm'));
const SignUpComponent = lazy(() => import('@/components/auth/SignUpForm'));



const AuthPage: React.FC = () => {
    const { authMode, switchToLogin, switchToSignup } = useHomeStore();
    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center relative overflow-hidden p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-blue-300/30 to-purple-300/30 rounded-full blur-3xl"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
                <motion.div
                    className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-tr from-green-300/30 to-blue-300/30 rounded-full blur-3xl"
                    animate={{
                        x: [0, -30, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {/* Floating Particles */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-blue-400/40 rounded-full"
                        style={{
                            top: `${(i * 17 + 5) % 100}%`,
                            left: `${(i * 23 + 10) % 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.2, 0.6, 0.2],
                        }}
                        transition={{
                            duration: 3 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.4,
                            ease: "easeInOut",
                        }}
                    />
                ))}

                {/* Rotating Rings */}
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

            {/* Main Auth Card */}
            <motion.div
                className="w-full max-w-lg relative z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <AnimatePresence mode="wait">
                    <Suspense fallback={<LoadingFallback />}>
                        {authMode === 'login' ? (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, x: -50, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                                transition={{ duration: 0.35, ease: "easeInOut" }}
                            >
                                <LoginComponent onSwitchToSignup={switchToSignup} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="signup"
                                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                                transition={{ duration: 0.35, ease: "easeInOut" }}
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