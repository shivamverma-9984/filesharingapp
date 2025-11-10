
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
    <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="animate-fade-in-up space-y-6">
            <h1 className="text-4xl font-bold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
              Share Files
              <br />
              <span className="text-secondary-foreground">
                Instantly & Securely
              </span>
            </h1>
            <p className="text-lg text-primary-foreground/90 md:text-xl max-w-xl">
              Send files of any size to anyone, anywhere. No signup required.
              Fast, secure, and simple file sharing for everyone.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={handleClick}
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold bg-background text-primary rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-primary/50"
              >
                <div className="absolute inset-0 bg-linear-to-r from-background via-background/90 to-background transition-transform duration-300 group-hover:translate-x-full"></div>
                <Upload className="relative z-10 h-5 w-5" />
                <span className="relative z-10">Start Sharing</span>
                <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-primary-foreground rounded-xl border-2 border-primary-foreground/30 overflow-hidden transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-primary-foreground/0 transition-all duration-300 group-hover:bg-primary-foreground/10"></div>
                <span className="relative z-10">Learn More</span>
              </button>
            </div>
          </div>
          <div className="relative animate-float">
            <div className="absolute -inset-4 bg-primary-glow/20 blur-3xl rounded-full"></div>
            <img
              src="/download.png"
              alt="File sharing illustration"
              className="relative w-full h-auto rounded-2xl shadow-medium"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
