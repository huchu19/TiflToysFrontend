'use server';

// Newsletter sign-up. Same shape and delivery path as the contact form
// (src/app/contact/actions.ts): validates the email, drops bot submissions
// via a honeypot, then notifies through Web3Forms/Resend — or logs it
// server-side in dev when neither is configured. There's no mailing-list
// provider wired up yet, so today this just gets the sign-up to an inbox;
// swapping in a real list (Klaviyo, Mailchimp, etc.) later only touches this
// file.

export type NewsletterState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeToNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  // Honeypot: real users never fill this hidden field.
  if ((formData.get('company') as string)?.trim()) {
    return { status: 'success' };
  }

  const email = ((formData.get('email') as string) ?? '').trim();
  if (!EMAIL_RE.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' };
  }

  if (process.env.WEB3FORMS_ACCESS_KEY) {
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: process.env.WEB3FORMS_ACCESS_KEY,
          subject: 'New newsletter sign-up',
          from_name: 'TiflToys Website',
          email,
          message: `New newsletter sign-up: ${email}`,
        }),
        cache: 'no-store',
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (res.ok && data.success) return { status: 'success' };
      console.error('[newsletter] Web3Forms error:', res.status);
    } catch (err) {
      console.error('[newsletter] Web3Forms submit failed:', err);
    }
    return { status: 'error', message: 'Sorry, something went wrong. Please try again.' };
  }

  if (process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.CONTACT_FROM_EMAIL) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL,
          to: process.env.CONTACT_TO_EMAIL,
          subject: 'New newsletter sign-up',
          text: `New newsletter sign-up: ${email}`,
        }),
        cache: 'no-store',
      });
      if (res.ok) return { status: 'success' };
      console.error('[newsletter] Resend error:', res.status, await res.text());
    } catch (err) {
      console.error('[newsletter] Resend send failed:', err);
    }
    return { status: 'error', message: 'Sorry, something went wrong. Please try again.' };
  }

  // Nothing configured — log and succeed (dev-safe default).
  console.info('[newsletter] (no email provider configured) sign-up received:', email);
  return { status: 'success' };
}
