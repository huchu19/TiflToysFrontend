import type { Metadata } from 'next';
import LegalPage from '@/components/layout/LegalPage';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="29 June, 2026"
      intro="Your privacy matters to us. This policy explains what information we collect and how we use it."
      sections={[
        { heading: 'Information we collect', body: 'We collect the details you provide at checkout or sign-up — such as your name, email, shipping address and order history — as well as basic analytics about how you use our site.' },
        { heading: 'How we use it', body: 'We use your information to process orders, provide support, send updates you’ve opted into, and improve our products and store experience.' },
        { heading: 'Sharing', body: 'We never sell your data. We only share information with trusted providers (such as payment and shipping partners) as needed to fulfil your order.' },
        { heading: 'Your rights', body: 'You can request access to, correction of, or deletion of your personal data at any time by emailing hello@tifltoys.com.' },
        { heading: 'Cookies', body: 'We use cookies to keep your cart, remember preferences, and understand site usage. You can control cookies through your browser settings.' },
      ]}
    />
  );
}
