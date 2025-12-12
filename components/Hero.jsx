// 'use client';
// import { useAuth } from "../app/_context/AuthContext";
// import { Upload, ArrowRight } from "lucide-react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// export const Hero = () => {
//   const router = useRouter();
//   const { user } = useAuth();

//   const handleClick = () => {
//     if (user) {
//       router.push("/dashboard");
//     } else {
//       router.push("/login");
//     }
//   };

//   return (
//     <section className="relative overflow-hidden py-20 ">
//       {/* Decorative glow */}
//       <div className="absolute inset-0"></div>

//       <div className="container relative z-10 mx-auto px-6">
//         <div className="grid gap-16 lg:grid-cols-2 items-center">
//           {/* Text content */}
//           <div className="space-y-8 animate-fade-in-up">
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
//               Share Files <br />
//               <span className="bg-indigo-500 bg-clip-text text-transparent">
//                 Instantly & Securely
//               </span>
//             </h1>
//             <p className="text-lg md:text-xl max-w-xl">
//               Send files of any size to anyone, anywhere. No signup required.
//               Fast, secure, and simple file sharing for everyone.
//             </p>

//             {/* Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4">
//               <button
//                 onClick={handleClick}
//                 className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-xl text-white bg-gradient-to-r bg-indigo-500 transition-all duration-300 hover:scale-105 hover:shadow-pink-500/50"
//               >
//                 <Upload className="h-5 w-5" />
//                 <span>Start Sharing</span>
//                 <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
//               </button>

//               <button className="group hover:text-white relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold rounded-xl border border-gray-500/40 transition-all duration-300 hover:bg-gray-800/50 hover:scale-105">
//                 <span>Learn More</span>
//               </button>
//             </div>
//           </div>

//           {/* Hero image */}
//           <div className="relative animate-float">
//             <div className="absolute -inset-6 bg-gradient-to-r from-indigo-500/20 to-pink-500/20 blur-3xl rounded-full"></div>
//             <Image
//               height={400}
//               width={400}
//               src="/download.png"
//               alt="File sharing illustration"
//               className="relative w-full h-auto rounded-2xl shadow-2xl border border-gray-700/30"
//             />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };





'use client';
import { useAuth } from "../app/_context/AuthContext";
import { Upload, ArrowRight } from "lucide-react";
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
    <section className="relative overflow-hidden py-10">
      {/* Decorative glow */}
      <div className="absolute inset-0"></div>

      <div className="container relative z-10 mx-auto px-6  flex flex-col items-center">
        {/* Centered content */}
        <div className="flex flex-col items-center text-center space-y-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-4xl lg:text-6xl font-bold leading-tight">
            Share Files <br />
            <span className=" bg-indigo-500 bg-clip-text text-transparent">
              Instantly & Securely
            </span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl -mt-4">
            Send files of any size to anyone, anywhere. No signup required.
            Fast, secure, and simple file sharing for everyone.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <button
              onClick={handleClick}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-2.5 md:py-3.5 text-lg font-semibold rounded-xl text-white bg-gradient-to-r bg-indigo-500 transition-all duration-300 hover:scale-105 hover:shadow-pink-500/50"
            >
              <Upload className="h-5 w-5" />
              <span>Start Sharing</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>

            <button className="group hover:text-white relative inline-flex items-center justify-center gap-2 px-8 py-2 md:py-3.5 text-lg font-semibold rounded-xl border border-gray-500/40 transition-all duration-300 hover:bg-gray-800/50 hover:scale-105">
              <span>Learn More</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};