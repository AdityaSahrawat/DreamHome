import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ActionButton from "./actionButton";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            <span className="text-primary">Dream</span>Home
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/properties" className="nav-link">
              Properties
            </a>
            <a href="/about" className="nav-link">
              About
            </a>
            <a href="/contact" className="nav-link">
              Contact
            </a>
            <a href="/how-it-works" className="nav-link">
              How It Works
            </a>
            <a href="/application-status" className="nav-link">
              Application Status
            </a>
          </div>

          {/* Authentication Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ActionButton variant="outline" href="/login" size="sm">
              Sign In
            </ActionButton>
            <ActionButton href="/register" size="sm">
              Register
            </ActionButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-xl shadow-lg animate-slide-down">
            <div className="flex flex-col space-y-4 px-6">
              <a
                href="/properties"
                className="py-2 text-foreground hover:text-primary transition-colors"
              >
                Properties
              </a>
              <a
                href="/about"
                className="py-2 text-foreground hover:text-primary transition-colors"
              >
                About
              </a>
              <a
                href="/contact"
                className="py-2 text-foreground hover:text-primary transition-colors"
              >
                Contact
              </a>
              <a
                href="/how-it-works"
                className="py-2 text-foreground hover:text-primary transition-colors"
              >
                How It Works
              </a>
              <a
                href="/application-status"
                className="py-2 text-foreground hover:text-primary transition-colors"
              >
                Application Status
              </a>
              <div className="flex flex-col space-y-3 pt-3 border-t">
                <ActionButton variant="outline" href="/login">
                  Sign In
                </ActionButton>
                <ActionButton href="/register">
                  Register
                </ActionButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;