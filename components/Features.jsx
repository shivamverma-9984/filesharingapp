import { Cloud, Shield, Zap, Users, Lock, Download } from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: Cloud,
    title: "Unlimited Storage",
    description: "Store and share files of any size without restrictions.",
    bgColor: "bg-blue-500",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Your files are encrypted end-to-end for maximum protection.",
    bgColor: "bg-green-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Transfer files at maximum speed with our optimized servers.",
    bgColor: "bg-yellow-500",
  },
  {
    icon: Users,
    title: "Easy Collaboration",
    description: "Share with teams and track who accessed your files.",
    bgColor: "bg-purple-500",
  },
  {
    icon: Lock,
    title: "Password Protection",
    description:
      "Add an extra layer of security with password-protected links.",
    bgColor: "bg-red-500",
  },
  {
    icon: Download,
    title: "No Limits",
    description: "Unlimited downloads and shares for all your files.",
    bgColor: "bg-pink-500",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm tracking-wider uppercase bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
            Why Choose Us
          </span>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            Everything you need to <br className="hidden sm:block" /> share
            securely
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Powerful features designed to make file sharing simple, fast, and
            secure for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-white shadow-lg`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
