import { Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-950 text-gray-400 mt-auto">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">BookWormed</h3>
            <p className="text-sm leading-relaxed">
              Your personal space to track, share, and discover new books with friends and fellow readers across the globe.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-3">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <a href="mailto:bookwormed193@gmail.com" className="hover:text-blue-400 transition-colors">
                  bookwormed193@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Hostel A, Thapar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          <p>© 2025 BookWormed. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
