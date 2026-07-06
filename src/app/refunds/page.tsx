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
        { heading: 'Shipping', body: 'Currently delivering into Greater Toronto Area (Western Limit: Kitchener, Eastern Limit: Ajax, Northern Limit: King City), only. These deliveries are complimentary with order. Canada wide shipments to begin Fall 2026. Shipping rates TBD.' },
        { heading: 'Refunds, Returns, Exchanges', body: 'All sales are deemed final with the exception of damaged goods received. In the event of damaged deliveries, customers have up to 14 days after receiving item to file a claim and be refunded, upon approval. Please allow 5-10 business days to receive approved refunds.' },
      ]}
    />
  );
}
