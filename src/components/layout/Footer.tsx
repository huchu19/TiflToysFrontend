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
    // Real, always-live destinations — the old version linked to
    // /collections/{educational,infant,diy,other}, none of which exist in
    // Shopify (only `frontpage` and `featured-collection` do), so every one
    // of those links dead-ended on the "coming soon" collection fallback.
    title: 'Shop & Play',
    links: [
      { label: 'Featured Collection', href: '/collections/featured-collection' },
      { label: 'All Products', href: '/products' },
      { label: 'Colouring Studio', href: '/play/colouring' },
      { label: 'The Hajj Journey', href: '/play/hajj' },
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
// ships brand icons (Facebook / Instagram).
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
              Meaningful toys for curious minds. Keep up with our latest drops, special editions and
              new arrivals.
            </p>
            <div className="mt-5 flex items-center gap-3 text-brand-purple">
              <Link
                href="https://www.facebook.com/profile.php?id=61590778953486"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="transition-opacity hover:opacity-70"
              >
                <FacebookLogo className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/tifl_toys"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="transition-opacity hover:opacity-70"
              >
                <InstagramLogo className="h-5 w-5" />
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
