import type { Metadata } from 'next';
import LegalPage from '@/components/layout/LegalPage';

export const metadata: Metadata = { title: 'Shipping & Refund Policy' };

export default function RefundsPage() {
  return (
    <LegalPage
      title="Shipping & Refund Policy"
      updated="29 June, 2026"
      intro="We want you and your little ones to love every TiflToys product. Here’s how shipping, returns, and refunds work."
      sections={[
        { heading: 'Shipping & delivery', body: 'We ship across Canada. Orders are processed within 1–2 business days, and delivery typically takes 3–7 business days depending on your location. You’ll receive a tracking link by email once your order ships. Shipping costs are calculated at checkout.' },
        { heading: 'Returns', body: 'You may return most new, unused items within 30 days of delivery for a full refund. Items must be in their original condition and packaging.' },
        { heading: 'Refunds', body: 'Once we receive and inspect your return, we’ll email you to confirm. Approved refunds are issued to your original payment method, typically within 5–10 business days.' },
        { heading: 'Damaged or faulty items', body: 'If your order arrives damaged or faulty, contact us within 14 days with a photo and we’ll arrange a replacement or full refund at no cost to you.' },
        { heading: 'How to start a return', body: 'Email hello@tifltoys.com with your order number and reason for the return, and our team will guide you through the next steps.' },
      ]}
    />
  );
}
