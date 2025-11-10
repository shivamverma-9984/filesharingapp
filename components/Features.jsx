import { Cloud, Shield, Zap, Users, Lock, Download } from "lucide-react";

const features = [
  {
    icon: Cloud,
    title: "Unlimited Storage",
    description: "Store and share files of any size without restrictions.",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Your files are encrypted end-to-end for maximum protection.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Transfer files at maximum speed with our optimized servers.",
  },
  {
    icon: Users,
    title: "Easy Collaboration",
    description: "Share with teams and track who accessed your files.",
  },
  {
    icon: Lock,
    title: "Password Protection",
    description: "Add an extra layer of security with password-protected links.",
  },
  {
    icon: Download,
    title: "No Limits",
    description: "Unlimited downloads and shares for all your files.",
  },
];

export const Features = () => {
  return (
    <section className="bg-gradient-feature py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features that make file sharing simple, secure, and efficient.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative rounded-2xl p-8 glass-effect transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="mb-6 inline-flex rounded-xl bg-gradient-to-br from-primary to-primary-glow p-4 shadow-lg">
                    <Icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};


