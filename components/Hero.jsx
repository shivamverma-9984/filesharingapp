"use client";
import { useAuth } from "../app/_context/AuthContext";
import { Upload, ArrowRight, Shield, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export const Hero = () => {
  const router = useRouter();
  const { user } = useAuth();

  const handleClick = () => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Modern Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-white dark:bg-gray-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>
        <div className="absolute right-0 bottom-0 -z-10 h-[310px] w-[310px] rounded-full bg-violet-500 opacity-20 blur-[100px]"></div>
      </div>

      <div className="container relative z-10 mx-auto px-6 flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-8 ring-1 ring-inset ring-indigo-100 dark:ring-indigo-800 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Secure File Sharing Reimagined
        </div>

        {/* Centered content */}
        <div className="flex flex-col items-center text-center space-y-8 animate-fade-in-up max-w-4xl mx-auto">
          <h1 className="text-[35px] md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
            Share Files <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Instantly & Securely
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Send files of any size to anyone, anywhere. No complex signup
            required. Experience lightning-fast, bank-level secure file sharing
            for everyone.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
            <button
              onClick={handleClick}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-full text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              <Upload className="h-5 w-5" />
              <span>Start Sharing</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>

            <button className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-full text-gray-700 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:-translate-y-0.5">
              <span>How it works</span>
            </button>
          </div>

          {/* Stats/Trust indicators */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-3 gap-8 text-center border-t border-gray-200 dark:border-gray-800 w-full max-w-3xl mt-8">
            <div>
              <div className="flex items-center justify-center gap-2 text-gray-900 dark:text-white font-bold text-2xl">
                <Shield className="h-6 w-6 text-indigo-500" />
                <span>E2E</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Encrypted</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 text-gray-900 dark:text-white font-bold text-2xl">
                <Zap className="h-6 w-6 text-indigo-500" />
                <span>1GB/s</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Transfer Speeds</p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center justify-center gap-2 text-gray-900 dark:text-white font-bold text-2xl">
                <span>10k+</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Active Users</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
