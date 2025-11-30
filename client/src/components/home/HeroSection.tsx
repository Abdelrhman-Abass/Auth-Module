"use client";

import { HiSparkles } from "react-icons/hi2";
import { Button } from "../ui/button";
import Link from "next/link";
import { useHomeStore } from "@/store/homeStore";

const HeroSection = () => {
  const { switchToSignup, switchToLogin } = useHomeStore();

  const handleSignupClick = () => {
    switchToSignup();
  };

  const handleLoginClick = () => {
    switchToLogin();
  };

  return (
    <section className="relative min-h-dvh flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">

      {/* Main Content */}
      <div className="max-w-5xl w-full p-6 sm:p-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-6 py-3 mb-8 bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-md rounded-full shadow-xl border border-blue-100/50 animate-fade-down">
          <div className="relative">
            <HiSparkles className="text-yellow-500 text-lg animate-pulse" />
            <div className="absolute inset-0 bg-yellow-400/30 blur-md rounded-full"></div>
          </div>
          <span className="font-semibold text-base bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            Welcome to Our Auth Module
          </span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>

        <div className="flex justify-center gap-4 items-center mb-10 animate-fade-down delay-100">

          <div className="space-y-1">
            <h1 className="font-bold text-4xl md:text-6xl lg:text-7xl bg-gradient-to-r from-[#2B4E42] via-[#15326C] to-[#2B4E42] bg-clip-text text-transparent animate-gradient drop-shadow-sm">
              Auth Module
            </h1>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>

            </div>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-5 sm:gap-6 mb-12 animate-fade-up delay-500">

          <div className="relative group">
            {/* Button Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#2B4E42] to-[#244238] rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

            <Link href="/auth" onClick={handleSignupClick}>
              <Button className="relative px-8 py-7 w-full sm:w-80 bg-gradient-to-br from-[#2B4E42] to-[#1e3a30] rounded-2xl shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
                {/* Animated Shine */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
                </div>

                <div className="relative flex items-center justify-center gap-4 z-10">
                  <div className="text-left">
                    <span className="block font-inter font-bold text-xl text-white">
                      Create New Account
                    </span>
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-tr-full"></div>
              </Button>
            </Link>
          </div>

          <div className="relative group">
            {/* Button Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#15326C] to-[#102856] rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

            <Link href="/auth" onClick={handleLoginClick}>
              <Button className="relative px-8 py-7 w-full sm:w-80 bg-gradient-to-br from-[#15326C] to-[#0d1e45] rounded-2xl shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden">
                {/* Animated Shine */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
                </div>

                <div className="relative flex items-center justify-center gap-4 z-10">
                  <div className="text-left">
                    <span className="block font-inter font-bold text-xl text-white">
                      Login To Your Account
                    </span>
                  </div>
                </div>

                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-tr-full"></div>
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;