 import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
  <footer className="bg-linear-to-tr from-blue-100 to-indigo-600 py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Branding */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-1">FileHub</h2>
          <p className="">
            Seamless, secure file sharing for teams and creators. Built for speed, designed for trust.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-1">Quick Links</h3>
          <ul className="space-y-1">
            <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
            <li><a href="/upload" className="hover:text-white">Upload Files</a></li>
            <li><a href="/files" className="hover:text-white">My Files</a></li>
            <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
          </ul>
        </div>

        {/* Social & Legal */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-1">Connect</h3>
          <div className="flex space-x-3 mb-1">
            <a href="#" className="hover:text-white">Twitter</a>
            <a href="#" className="hover:text-white">LinkedIn</a>
            <a href="#" className="hover:text-white">GitHub</a>
          </div>
          <p className="">
            © {new Date().getFullYear()} FileHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>

  );
}