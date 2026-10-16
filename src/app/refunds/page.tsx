import type { Metadata } from 'next';
import LegalPage from '@/components/layout/LegalPage';

export const metadata: Metadata = { title: 'Shipping & Refund Policy' };

export default function RefundsPage() {
  return (
    <LegalPage
      title="Shipping & Refund Policy"
      updated="16 October, 2026"
      intro="We want you and your little ones to love every TiflToys product. Here’s how shipping, returns, and refunds work."
      sections={[
        { heading: 'Shipping rates', body: 'We ship Canada wide for a flat $4.50 CAD, and orders of $40.00 CAD or more ship free. We also ship to the United States for a flat $10.00 USD, and US orders of $30.00 USD or more ship free. Free shipping is applied automatically at checkout, so there is no code to enter.' },
        { heading: 'Delivery times', body: 'Ontario and Quebec: 2–3 business days. Everywhere else in Canada: 7–10 business days. Estimates run from the day your order is dispatched and exclude weekends and statutory holidays.' },
        { heading: 'Refunds, Returns, Exchanges', body: 'All sales are deemed final with the exception of damaged goods received. In the event of damaged deliveries, customers have up to 14 days after receiving item to file a claim and be refunded, upon approval. Please allow 5-10 business days to receive approved refunds.' },
      ]}
    />
  );
}
