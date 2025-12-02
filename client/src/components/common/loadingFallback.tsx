import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';


const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
        >
            <Loader2 className="w-12 h-12 animate-spin text-[#2B4E42] mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading...</p>
        </motion.div>
    </div>
);

export default LoadingFallback