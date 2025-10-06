"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { hybridLogout } from '@/src/lib/logout';
import ActionButton from './actionButton';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8); // small threshold for effect
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const authed = status === 'authenticated';
  const role = (session?.user as { role?: string | null } | undefined)?.role || '';

  async function logout() {
    try {
      setLoggingOut(true);
      await hybridLogout({ redirect: false });
    } finally {
      setLoggingOut(false);
    }
  }

  const baseClasses = 'fixed top-0 left-0 right-0 z-40 transition-all duration-300 will-change-[background-color,backdrop-filter,box-shadow,transform]';
  const styleClasses = scrolled
    ? 'bg-white/70 backdrop-blur-md border-b border-gray-200 shadow-sm'
    : 'bg-white border-b border-transparent backdrop-blur-0';

  return (
    <header className={`${baseClasses} ${styleClasses}`}>    
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <nav className="flex items-center justify-between w-full">
          <Link href="/" className="text-lg font-semibold">
            Dream<span className="text-primary">Home</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/properties" className="hover:text-primary">Properties</Link>
            <Link href="/about" className="hover:text-primary">About</Link>
            <Link href="/contact" className="hover:text-primary">Contact</Link>
            <Link href="/how-it-works" className="hover:text-primary">How It Works</Link>
            {role === 'client' && <Link href="/properties/list" className="text-primary font-medium">List Your Property</Link>}
            {role === 'manager' && <Link href="/manager/properties" className="text-primary font-medium">Manage Properties</Link>}
          </div>

          <div className="hidden md:flex items-center gap-3 text-sm">
            {status === 'loading' ? (
              <span className="text-xs text-gray-400">…</span>
            ) : authed ? (
              <>
                <ActionButton variant="outline" href="/profile" size="sm">Profile</ActionButton>
                <button
                  onClick={logout}
                  disabled={loggingOut}
                  className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  {loggingOut ? '…' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <ActionButton variant="outline" href="/login" size="sm">Login</ActionButton>
                <ActionButton href="/register" size="sm">Register</ActionButton>
              </>
            )}
          </div>

          <button className="md:hidden" aria-label="Toggle menu" onClick={() => setOpen(o => !o)}>
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
              {status === 'loading' ? (
                <span className="text-xs text-gray-400">…</span>
              ) : authed ? (
                <>
                  <ActionButton variant="outline" href="/profile" size="sm" onClick={() => setOpen(false)}>Profile</ActionButton>
                  <button
                    onClick={() => { setOpen(false); logout(); }}
                    disabled={loggingOut}
                    className="px-3 py-1 border rounded text-left disabled:opacity-50"
                  >
                    {loggingOut ? '…' : 'Logout'}
                  </button>
                </>
              ) : (
                <>
                  <ActionButton variant="outline" href="/login" size="sm" onClick={() => setOpen(false)}>Login</ActionButton>
                  <ActionButton href="/register" size="sm" onClick={() => setOpen(false)}>Register</ActionButton>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}