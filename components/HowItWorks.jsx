import { Upload, Link2, Share2 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Files",
    description: "Drag and drop or select files from your device. No size limits.",
  },
  {
    icon: Link2,
    step: "02",
    title: "Get a Secure Link",
    description: "Receive a unique, encrypted link to your files instantly.",
  },
  {
    icon: Share2,
    step: "03",
    title: "Share Anywhere",
    description: "Send the link via email, chat, or any platform you prefer.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-foreground md:text-4xl mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Share files in three simple steps. It's that easy.
          </p>
        </div>
        <div className="grid gap-12 md:grid-cols-3 max-w-5xl mx-auto">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="relative text-center animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="mb-6 relative inline-block">
                  <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full"></div>
                  <div className="relative bg-gradient-hero rounded-full p-6 shadow-medium">
                    <Icon className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm shadow-soft">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};


