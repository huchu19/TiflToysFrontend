import type { Metadata } from 'next';
import { Mail, MapPin, Clock } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the TiflToys team — we’d love to hear from you.',
};

const DETAILS = [
  { icon: Mail, label: 'Email', value: 'hello@tifltoys.com' },
  { icon: Clock, label: 'Hours', value: 'Mon–Fri, 9am–5pm' },
  { icon: MapPin, label: 'Based in', value: 'Canada' },
];

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
      <PageHeader
        title="Get in touch"
        subtitle="Questions about an order, a product, or a wholesale enquiry? We’d love to hear from you."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-5">
          {DETAILS.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-4 rounded-2xl bg-bg-cream p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-purple">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <div>
                <p className="font-fredoka text-sm font-semibold text-brand-purple">{label}</p>
                <p className="text-gray-600">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-gray-100 p-6 shadow-sm sm:p-8">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
