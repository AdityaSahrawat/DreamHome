"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from '@/src/lib/axios';
import ActionButton from './actionButton';
import { signOut } from 'next-auth/react';
import { Menu, X } from 'lucide-react';

// Minimal, no scroll effects, no modal, no caching.
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/auth/status');
        if (res.data?.authenticated) {
          setAuthed(true);
          setRole(res.data.user?.role || '');
        } else {
          setAuthed(false);
        }
      } catch {
        setAuthed(false);
      } finally {
        setAuthLoading(false);
      }
    })();
  }, []);

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      await signOut({ redirect: false });
    } catch {}
    setAuthed(false);
    setRole('');
    window.location.href = '/';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <nav className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link href="/" className="text-lg font-semibold">
            Dream<span className="text-primary">Home</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/properties" className="hover:text-primary">Properties</Link>
            <Link href="/about" className="hover:text-primary">About</Link>
            <Link href="/contact" className="hover:text-primary">Contact</Link>
            <Link href="/how-it-works" className="hover:text-primary">How It Works</Link>
            {role === 'client' && <Link href="/properties/list" className="text-primary font-medium">List</Link>}
            {role === 'manager' && <Link href="/manager/properties" className="text-primary font-medium">Manage</Link>}
          </div>

          {/* Authentication Buttons / Profile */}
          <div className="hidden md:flex items-center gap-3 text-sm">
            {authLoading ? (
              <span className="text-xs text-gray-400">…</span>
            ) : authed ? (
              <>
                <ActionButton variant="outline" href="/profile" size="sm">Profile</ActionButton>
                <button onClick={logout} className="px-3 py-1 border rounded hover:bg-gray-50">Logout</button>
              </>
            ) : (
              <>
                <ActionButton variant="outline" href="/login" size="sm">Login</ActionButton>
                <ActionButton href="/register" size="sm">Register</ActionButton>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setOpen(o => !o)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
        {open && (
          <div className="md:hidden absolute top-14 left-0 right-0 bg-white border-b px-4 pb-4 flex flex-col gap-2 text-sm">
            <Link href="/properties" onClick={() => setOpen(false)} className="py-1">Properties</Link>
            <Link href="/about" onClick={() => setOpen(false)} className="py-1">About</Link>
            <Link href="/contact" onClick={() => setOpen(false)} className="py-1">Contact</Link>
            <Link href="/how-it-works" onClick={() => setOpen(false)} className="py-1">How It Works</Link>
            {role === 'client' && <Link href="/properties/list" onClick={() => setOpen(false)} className="py-1">List Property</Link>}
            {role === 'manager' && <Link href="/manager/properties" onClick={() => setOpen(false)} className="py-1">Manage</Link>}
            <div className="pt-2 border-t flex flex-col gap-2">
              {authLoading ? (
                <span className="text-xs text-gray-400">…</span>
              ) : authed ? (
                <>
                  <ActionButton variant="outline" href="/profile" size="sm">Profile</ActionButton>
                  <button onClick={logout} className="px-3 py-1 border rounded text-left">Logout</button>
                </>
              ) : (
                <>
                  <ActionButton variant="outline" href="/login" size="sm">Login</ActionButton>
                  <ActionButton href="/register" size="sm">Register</ActionButton>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;