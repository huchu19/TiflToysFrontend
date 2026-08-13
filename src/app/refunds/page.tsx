import type { Metadata } from 'next';
import LegalPage from '@/components/layout/LegalPage';

export const metadata: Metadata = { title: 'Shipping & Refund Policy' };

export default function RefundsPage() {
  return (
    <LegalPage
      title="Shipping & Refund Policy"
      updated="13 August, 2026"
      intro="We want you and your little ones to love every TiflToys product. Here’s how shipping, returns, and refunds work."
      sections={[
        { heading: 'Shipping rates', body: 'We ship Canada wide for a flat $3.00 CAD. Orders over $30.00 CAD ship free — the discount is applied automatically at checkout, so there is no code to enter.' },
        { heading: 'Delivery times', body: 'Ontario and Quebec: 2–3 business days. Everywhere else in Canada: 7–10 business days. Estimates run from the day your order is dispatched and exclude weekends and statutory holidays. Pre-order items ship once the pre-order window opens (Fall 2026) — the delivery estimate applies from that dispatch date, not the date you order.' },
        { heading: 'Refunds, Returns, Exchanges', body: 'All sales are deemed final with the exception of damaged goods received. In the event of damaged deliveries, customers have up to 14 days after receiving item to file a claim and be refunded, upon approval. Please allow 5-10 business days to receive approved refunds.' },
      ]}
    />
  );
}
