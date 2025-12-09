import { Upload, Link2, Share2 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Files",
    description: "Drag and drop or select files from your device. No size limits.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Link2,
    step: "02",
    title: "Get a Secure Link",
    description: "Receive a unique, encrypted link to your files instantly.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Share2,
    step: "03",
    title: "Share Anywhere",
    description: "Send the link via email, chat, or any platform you prefer.",
    color: "from-pink-500 to-purple-500",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-20">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Share files in three simple steps. It's fast, secure, and effortless.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 text-center transform transition hover:-translate-y-2 hover:shadow-xl"
              >
                {/* Icon */}
                <div
                  className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r ${item.color} text-white shadow-md`}
                >
                  <Icon className="h-10 w-10" />
                </div>

                {/* Step badge */}
                <span className="inline-block mb-3 px-4 py-1 text-sm font-semibold text-white bg-gray-900 rounded-full">
                  Step {item.step}
                </span>

                {/* Title + Description */}
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};