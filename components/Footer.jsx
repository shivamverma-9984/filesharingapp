 import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (

    <footer className="bg-linear-to-tr from-blue-50 to-white border-t border-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-700">
        {/* Branding */}
        <div>
          <h2 className="text-2xl font-bold text-blue-600">ShareIt</h2>
          <p className="mt-2 text-sm text-gray-600">
            Fast, secure file sharing for teams and individuals.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-blue-600 transition">Home</a></li>
            <li><a href="#" className="hover:text-blue-600 transition">Features</a></li>
            <li><a href="#" className="hover:text-blue-600 transition">Pricing</a></li>
            <li><a href="#" className="hover:text-blue-600 transition">Support</a></li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Connect</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: <a href="mailto:support@shareit.com" className="text-blue-600 hover:underline">support@shareit.com</a></li>
            <li>Twitter: <a href="#" className="text-blue-600 hover:underline">@ShareItApp</a></li>
            <li>GitHub: <a href="#" className="text-blue-600 hover:underline">github.com/shareit</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="text-center text-sm text-gray-500 py-3 border-t border-blue-100">
        © {new Date().getFullYear()} ShareIt. All rights reserved.
      </div>
    </footer>


  );
}