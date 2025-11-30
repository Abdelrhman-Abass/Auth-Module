"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 flex items-center justify-center relative overflow-hidden p-4">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
            </div>

            {/* Content */}
            <motion.div
                className="relative z-10 text-center max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* 404 Number */}
                <motion.div
                    className="mb-8"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-[#2B4E42] via-[#15326C] to-[#2B4E42] bg-clip-text text-transparent leading-none">
                        404
                    </h1>
                </motion.div>

                {/* Icon */}
                <motion.div
                    className="flex justify-center mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-[#2B4E42] to-[#15326C] rounded-full flex items-center justify-center shadow-xl">
                        <Search className="w-10 h-10 text-white" />
                    </div>
                </motion.div>

                {/* Text */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-lg text-gray-600 mb-2">
                        Oops! The page you're looking for doesn't exist.
                    </p>
                    <p className="text-gray-500">
                        It might have been moved or deleted.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <Link href="/">
                        <Button className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-[#2B4E42] to-[#15326C] hover:from-[#204739] hover:to-[#0d1e45] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                            <Home className="w-5 h-5" />
                            Go Home
                        </Button>
                    </Link>
                    <Button
                        onClick={() => window.history.back()}
                        variant="outline"
                        className="w-full sm:w-auto h-12 px-8 border-2 border-[#2B4E42] text-[#2B4E42] hover:bg-[#2B4E42] hover:text-white font-semibold rounded-xl transition-all flex items-center gap-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}