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
    description: "Add an extra layer of security with password-protected links.",
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
  
      <section class=" px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="text-center mb-12">
            <span class="text-blue-600 font-semibold text-lg">
              WHY CHOOSE US
            </span>
            <h2 class="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
              Our Key Features
            </h2>
            <p class="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Discover what makes our product stand out from the competition.
            </p>
          </div>

          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div class="bg-white p-8 rounded-xl shadow-md hover:shadow-lg  transition-shadow duration-300">
                  <div class={`w-14 h-14 ${feature.bgColor} rounded-lg flex items-center justify-center mb-6`}>
                    <Icon className="h-8 w-8 text-white" />{" "}
                  </div>
                  <h3 class="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p class="text-gray-600">{feature.description} </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

  );
};
