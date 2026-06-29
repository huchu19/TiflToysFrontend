import Link from 'next/link';
import Image from 'next/image';
import { DottedBg } from '@/components/ui/DottedBg';

const COLUMNS = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Our Sectors', href: '/sectors' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'All Collection',
    links: [
      { label: 'Educational Toys', href: '/collections/educational' },
      { label: 'Infant Toys', href: '/collections/infant' },
      { label: 'DIY Toys', href: '/collections/diy' },
      { label: 'Other Toys', href: '/collections/other' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Refunds', href: '/refunds' },
      { label: 'T&Cs', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
];

const PAYMENTS = [
  { label: 'Visa', className: 'bg-[#1a1f71] text-white' },
  { label: 'MC', className: 'bg-[#eb001b] text-white' },
  { label: 'Amex', className: 'bg-[#2e77bc] text-white' },
  { label: 'PayPal', className: 'bg-[#003087] text-white' },
];

// Social brand glyphs as inline SVG — this lucide-react version no longer
// ships brand icons (Facebook / Instagram / X).
function FacebookLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function InstagramLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** X (formerly Twitter) brand glyph. */
function XLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M18.9 2.5h3.3l-7.2 8.2 8.5 11.3h-6.7l-5.2-6.9-6 6.9H1.6l7.7-8.8L1 2.5h6.8l4.7 6.3zm-1.2 17.5h1.8L7.4 4.4H5.5z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mx-auto max-w-7xl px-6 pb-10 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-bg-yellow px-8 py-12 sm:px-12">
        <DottedBg color="#EAD06A" />

        <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" aria-label="TiflToys home" className="inline-block">
              <Image src="/logo.svg" alt="TiflToys" width={110} height={50} className="h-11 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-600">
              Increase savings up to 20% off your first purchase and keep up with our latest drops, special
              editions and member-only sales.
            </p>
            <div className="mt-5 flex items-center gap-3 text-brand-purple">
              <Link href="#" aria-label="Facebook" className="transition-opacity hover:opacity-70">
                <FacebookLogo className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Instagram" className="transition-opacity hover:opacity-70">
                <InstagramLogo className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="X" className="transition-opacity hover:opacity-70">
                <XLogo className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="font-fredoka text-sm font-bold uppercase tracking-wide text-brand-purple">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-gray-600 transition-colors hover:text-brand-purple">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom row */}
        <div className="relative mt-10 flex flex-col items-center justify-between gap-4 border-t border-amber-200/70 pt-6 sm:flex-row">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} TiflToys. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {PAYMENTS.map((pay) => (
              <span
                key={pay.label}
                className={`flex h-6 w-10 items-center justify-center rounded text-[9px] font-bold ${pay.className}`}
              >
                {pay.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
