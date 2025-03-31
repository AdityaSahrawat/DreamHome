"use client"

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ActionButton from "./actionButton";
import axios from "axios";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (token) {
          const res = await axios.get('/api/auth', {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log("response : ", res.data);
          setUser(res.data.authResult);
          setIsAuthenticated(true);
          setUserRole(res.data.authResult.role);
        }
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [token]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
    setIsAuthenticated(false);
    setShowLogoutConfirm(false);
    // Optional: Redirect to home page after logout
    window.location.href = '/';
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  if (loading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center justify-between">
            <div className="text-2xl font-bold tracking-tight text-foreground">
              <span className="text-primary">Dream</span>Home
            </div>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-medium mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm rounded-md bg-primary text-white hover:bg-primary/90"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="text-2xl font-bold tracking-tight text-foreground">
            <span className="text-primary">Dream</span>Home
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/properties" className="nav-link">Properties</a>
            <a href="/about" className="nav-link">About</a>
            <a href="/contact" className="nav-link">Contact</a>
            <a href="/how-it-works" className="nav-link">How It Works</a>
            {userRole === "client" && (
              <a href="/properties/list" className="nav-link font-medium text-primary">
                List Your Property
              </a>
            )}
            {userRole === "manager" && (
              <a href="/manager/properties" className="nav-link font-medium text-primary">
                Listed Properties
              </a>
            )}
          </div>

          {/* Authentication Buttons / Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <ActionButton variant="outline" href="/profile" size="sm">
                  Profile
                </ActionButton>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <ActionButton variant="outline" href="/login" size="sm">
                  Sign In
                </ActionButton>
                <ActionButton href="/register" size="sm">
                  Register
                </ActionButton>
              </>
            )}
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
              <a href="/properties" className="py-2 text-foreground hover:text-primary transition-colors">
                Properties
              </a>
              <a href="/about" className="py-2 text-foreground hover:text-primary transition-colors">
                About
              </a>
              <a href="/contact" className="py-2 text-foreground hover:text-primary transition-colors">
                Contact
              </a>
              <a href="/how-it-works" className="py-2 text-foreground hover:text-primary transition-colors">
                How It Works
              </a>
              {userRole === "client" && (
                <a href="/properties/list" className="py-2 text-primary font-medium transition-colors">
                  List Your Property
                </a>
              )}
              {userRole === "manager" && (
                <a href="/manager/properties" className="py-2 text-primary font-medium transition-colors">
                  Listed Properties
                </a>
              )}
              <div className="flex flex-col space-y-3 pt-3 border-t">
                {isAuthenticated ? (
                  <>
                    <ActionButton variant="outline" href="/profile">
                      Profile
                    </ActionButton>
                    <button
                      onClick={handleLogout}
                      className="w-full py-2 px-4 text-left text-foreground hover:text-primary transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <ActionButton variant="outline" href="/login">
                      Sign In
                    </ActionButton>
                    <ActionButton href="/register">
                      Register
                    </ActionButton>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;