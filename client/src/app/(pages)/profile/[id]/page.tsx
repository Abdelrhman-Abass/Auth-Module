"use client";

import React, { useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import {
    User,
    Mail,
    Calendar,
    LogOut,
    Sparkles,
    Star,
    Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { postServerRequest } from '@/utils/generalServerRequest';
import LoadingFallback from '@/components/common/loadingFallback';

const ProfilePage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const { user, isAuthenticated, logout, setUser } = useAuthStore();

    const particles = useMemo(() => {
        return Array.from({ length: 8 }, (_, i) => ({
            top: `${(i * 137) % 97 + 1}%`,
            left: `${(i * 89) % 93 + 3}%`,
            duration: 4 + (i % 4),
            delay: i * 0.5,
        }));
    }, []);

    const getProfileMutation = useMutation({
        mutationFn: (userId: string) =>
            postServerRequest('/api/auth/get-profile', { id: userId }),
        onSuccess: (response) => {
            if (response.success && response.data) {
                setUser(response.data);
            }
        },
        onError: () => {
            router.push('/auth');
        },
    });

    const logoutMutation = useMutation({
        mutationFn: () => postServerRequest('/api/auth/logout', {}),
        onSuccess: () => {
            logout();
            router.push('/auth');
        },
        onError: () => {
            logout(); // Force logout even on error
            router.push('/auth');
        },
    });

    useEffect(() => {
        if (!isAuthenticated || !user) {
            if (id) {
                getProfileMutation.mutate(id);
            } else {
                router.push('/auth');
            }
        }
    }, [isAuthenticated, user, id, router, getProfileMutation]);

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    if (!user) {
        return <LoadingFallback />;
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Recently';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };



    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-green-50 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-blue-300/30 to-purple-300/30 rounded-full blur-3xl"
                    animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-tr from-green-300/30 to-blue-300/30 rounded-full blur-3xl"
                    animate={{ x: [0, -30, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />

                {particles.map((p, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-blue-400/40 rounded-full"
                        style={{ top: p.top, left: p.left }}
                        animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            delay: p.delay,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12">
                <motion.div
                    className="flex justify-end mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Button
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        variant="outline"
                        className="bg-white/80 backdrop-blur-sm border-2 border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 rounded-xl px-6 h-11 font-semibold shadow-md hover:shadow-lg transition-all"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                    </Button>
                </motion.div>

                <motion.div
                    className="max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/50">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
                            <motion.div
                                className="relative"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            >
                                <div className="absolute inset-0 bg-linear-to-br from-[#2B4E42] to-[#15326C] rounded-full blur-xl opacity-50 scale-110" />
                                <div className="relative w-32 h-32 rounded-full bg-linear-to-br from-[#2B4E42] to-[#15326C] flex items-center justify-center border-4 border-white shadow-2xl">
                                    <User className="w-16 h-16 text-white" />
                                </div>
                                <motion.div
                                    className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 border-4 border-white shadow-lg"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
                                >
                                    <Shield className="w-5 h-5 text-white" />
                                </motion.div>
                            </motion.div>

                            <div className="flex-1 text-center md:text-left">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-linear-to-r from-blue-50 to-green-50 rounded-full shadow-md border border-blue-100"
                                >
                                    <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                                    <span className="text-sm font-medium text-gray-700">Welcome Back!</span>
                                    <Star className="w-4 h-4 text-yellow-500 animate-pulse" />
                                </motion.div>

                                <motion.h1
                                    className="text-4xl md:text-5xl font-bold mb-3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <span className="bg-linear-to-r from-[#2B4E42] to-[#15326C] bg-clip-text text-transparent">
                                        Hello, {user.name}!
                                    </span>
                                </motion.h1>

                                <motion.p
                                    className="text-gray-600 text-lg"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    Great to see you today! Ready to explore?
                                </motion.p>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 my-10" />

                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <div className="bg-linear-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200/50 shadow-md hover:shadow-lg transition-all">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-500 rounded-xl shadow-md">
                                        <Mail className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-600 mb-1">Email Address</h3>
                                        <p className="text-gray-900 font-medium break-all">{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            {user.createdAt && (
                                <div className="bg-linear-to-br from-green-50 to-green-100/50 rounded-2xl p-6 border border-green-200/50 shadow-md hover:shadow-lg transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-green-500 rounded-xl shadow-md">
                                            <Calendar className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-600 mb-1">Member Since</h3>
                                            <p className="text-gray-900 font-medium">{formatDate(user.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;