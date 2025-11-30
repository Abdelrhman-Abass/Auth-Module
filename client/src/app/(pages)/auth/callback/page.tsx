"use client";

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const AuthCallback: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    const refresh = searchParams.get('refresh');
    const error = searchParams.get('error');

    // Handle error from OAuth
    if (error) {
      console.error('OAuth error:', error);
      router.push(`/auth?error=${encodeURIComponent(error)}`);
      return;
    }

    if (token && userParam && refresh) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userParam));
        console.log('Received user from OAuth:', parsedUser);

        // Use the login function from authStore
        login(parsedUser, token, refresh);

        // Redirect to profile
        const redirectPath = `/profile/${parsedUser.id}`;
        router.push(redirectPath);
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.push(`/auth?error=Invalid authentication data`);
      }
    } else {
      console.error('Missing required parameters in callback URL');
      router.push(`/auth?error=Missing authentication data`);
    }
  }, [searchParams, router, login]);

  return (
    <motion.div
      className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#2B4E42]" />
        <p className="text-[#0D1E41] font-medium">Authenticating...</p>
      </div>
    </motion.div>
  );
};

export default AuthCallback;