import type { Metadata } from 'next';
import LegalPage from '@/components/layout/LegalPage';

export const metadata: Metadata = { title: 'Terms & Conditions' };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="29 June, 2026"
      intro="By using the TiflToys website and placing an order, you agree to the following terms."
      sections={[
        { heading: 'Use of our site', body: 'You may browse and shop our store for personal, non-commercial use. You agree not to misuse the site or attempt to disrupt its operation.' },
        { heading: 'Orders & pricing', body: 'All orders are subject to acceptance and availability. Prices are listed in CAD and may change without notice. We reserve the right to cancel any order due to errors or stock issues.' },
        { heading: 'Payment', body: 'Payment is processed securely at checkout. By providing payment details you confirm you are authorised to use the chosen payment method.' },
        { heading: 'Intellectual property', body: 'All content, designs, and product imagery on this site are the property of TiflToys and may not be reproduced without permission.' },
        { heading: 'Limitation of liability', body: 'TiflToys is not liable for any indirect or incidental damages arising from the use of our products or website, to the fullest extent permitted by law.' },
      ]}
    />
  );
}
