'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const NAV_LINKS = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT US', href: '/about' },
  { label: 'PRODUCTS', href: '/products' },
  { label: 'CONTACT', href: '/contact' },
];

export default function Navbar() {
  const { itemCount, openDrawer } = useCart();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    setMenuOpen(false);
    router.push(`/products?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="w-full bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center" aria-label="TiflToys home">
          <Image
            src="/logo.svg"
            alt="TiflToys"
            width={120}
            height={56}
            priority
            className="h-12 w-auto"
          />
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link, i) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`font-fredoka text-sm font-semibold tracking-wide transition-colors hover:text-brand-purple ${
                  i === 0 ? 'text-brand-purple' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right-side icon group */}
        <div className="flex items-center gap-5">
          <button
            type="button"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
            className="text-gray-800 transition-colors hover:text-brand-purple"
          >
            <Search className="h-6 w-6" strokeWidth={1.5} />
          </button>

          {/* Accounts are deferred to post-launch — shown as "coming soon". */}
          <button
            type="button"
            aria-label="Accounts (coming soon)"
            title="Accounts coming soon"
            disabled
            className="hidden cursor-not-allowed text-gray-300 sm:block"
          >
            <User className="h-6 w-6" strokeWidth={1.5} />
          </button>

          {/* Cart — opens the cart drawer */}
          <button
            type="button"
            onClick={openDrawer}
            aria-label={`Cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`}
            className="relative text-gray-800 transition-colors hover:text-brand-purple"
          >
            <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-orange px-1 text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="text-gray-800 transition-colors hover:text-brand-purple md:hidden"
          >
            {menuOpen ? (
              <X className="h-6 w-6" strokeWidth={1.5} />
            ) : (
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </nav>

      {/* Expandable search bar */}
      {searchOpen && (
        <div className="border-t border-gray-100">
          <form
            onSubmit={submitSearch}
            className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-3 lg:px-8"
          >
            <Search className="h-5 w-5 shrink-0 text-gray-400" strokeWidth={1.5} />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search toys, games, crafts…"
              aria-label="Search products"
              className="w-full bg-transparent py-1 text-sm outline-none placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-brand-purple px-5 py-2 font-fredoka text-xs font-semibold tracking-wide text-white"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="border-t border-gray-100 md:hidden">
          <ul className="flex flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((link, i) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block py-2 font-fredoka text-sm font-semibold tracking-wide transition-colors hover:text-brand-purple ${
                    i === 0 ? 'text-brand-purple' : 'text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
