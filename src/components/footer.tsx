import { Mail, MapPin, Phone } from "lucide-react";
import { Separator } from "./ui/seperator";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              <span className="text-primary">Dream</span>Home
            </h3>
            <p className="text-gray-400 max-w-xs">
              Making property rental and management simple, transparent, and stress-free since 2023.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-4-9a1 1 0 110-2 1 1 0 010 2zm8 0a1 1 0 110-2 1 1 0 010 2zm-4 4a4 4 0 01-3.773-2.666 1 1 0 111.881-.668A2 2 0 0012 13a2 2 0 001.892-1.334 1 1 0 111.881.668A4 4 0 0112 15z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/properties" className="text-gray-400 hover:text-primary transition-colors">Properties</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact</a></li>
              <li><a href="/how-it-works" className="text-gray-400 hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="/application-status" className="text-gray-400 hover:text-primary transition-colors">Application Status</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Renter's Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Property Owner Resources</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">FAQs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-gray-400">123 Property Lane, Suite 400<br />San Francisco, CA 94103</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                <a href="tel:+14155555555" className="text-gray-400 hover:text-primary">(415) 555-5555</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <a href="mailto:info@dreamhome.com" className="text-gray-400 hover:text-primary">info@dreamhome.com</a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} DreamHome. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 text-sm hover:text-primary">Privacy Policy</a>
            <a href="#" className="text-gray-400 text-sm hover:text-primary">Terms of Service</a>
            <a href="#" className="text-gray-400 text-sm hover:text-primary">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;