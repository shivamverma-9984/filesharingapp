import Image from "next/image";
import UploadForm from '../components/UploadForm';

export default function Home() {
  return (
          <section className="relative bg-gradient-to-br from-blue-100 via-white to-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        {/* Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Seamless <span className="text-blue-600">File Sharing</span><br />
            Built for Speed & Simplicity
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Upload, share, and access your files from anywhere — securely and instantly.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
              Upload Now
            </button>
            <button className="text-blue-600 font-semibold hover:underline">
              Explore Features
            </button>
          </div>
        </div>

        {/* Illustration */}
        <div className="md:w-1/2">
          <img
            src="imageLogo.png"
            alt="File sharing illustration"
            className="w-full max-w-md mx-auto"
          />
        </div>
      </div>

      {/* Decorative Blur Circles */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-blue-200 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-[-80px] right-[-80px] w-72 h-72 bg-purple-200 rounded-full opacity-30 blur-3xl"></div>
    </section>




  );
}
