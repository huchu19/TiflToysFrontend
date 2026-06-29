'use server';

// Contact form submission. Validates input, drops bot submissions via a
// honeypot, then sends an email through Resend's REST API (no SDK dependency).
// If RESEND_API_KEY is unset it logs the message server-side instead — a safe
// local/dev default so the form still "works" without external config.

export type ContactState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: Partial<Record<'name' | 'email' | 'message', string>>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: real users never fill this hidden field. Pretend success so bots
  // don't learn they were caught.
  if ((formData.get('company') as string)?.trim()) {
    return { status: 'success' };
  }

  const name = ((formData.get('name') as string) ?? '').trim();
  const email = ((formData.get('email') as string) ?? '').trim();
  const message = ((formData.get('message') as string) ?? '').trim();

  const fieldErrors: ContactState['fieldErrors'] = {};
  if (name.length < 2) fieldErrors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(email)) fieldErrors.email = 'Please enter a valid email address.';
  if (message.length < 10) fieldErrors.message = 'Please add a little more detail (10+ characters).';

  if (Object.keys(fieldErrors).length > 0) {
    return { status: 'error', message: 'Please fix the highlighted fields.', fieldErrors };
  }

  // Default: Web3Forms (reliable headless delivery, one access key, no domain
  // setup — emails submissions to the inbox tied to the key).
  if (process.env.WEB3FORMS_ACCESS_KEY) {
    return sendViaWeb3Forms(name, email, message);
  }

  // Optional Resend override (set RESEND_API_KEY + CONTACT_TO/FROM to use it).
  if (process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.CONTACT_FROM_EMAIL) {
    return sendViaResend(name, email, message);
  }

  // Nothing configured — log and succeed (dev-safe default).
  console.info('[contact] (no email provider configured) message received:', {
    name,
    email,
    message,
  });
  return { status: 'success' };
}

async function sendViaWeb3Forms(
  name: string,
  email: string,
  message: string,
): Promise<ContactState> {
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY,
        subject: `New contact message from ${name}`,
        from_name: 'TiflToys Website',
        // Replies go to the visitor who submitted the form.
        replyto: email,
        name,
        email,
        message,
      }),
      cache: 'no-store',
    });

    const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
    if (res.ok && data.success) {
      return { status: 'success' };
    }

    console.error('[contact] Web3Forms error:', res.status, data.message);
    return {
      status: 'error',
      message: 'Sorry, we couldn’t send your message. Please try again or email us directly.',
    };
  } catch (err) {
    console.error('[contact] Web3Forms submit failed:', err);
    return {
      status: 'error',
      message: 'Sorry, something went wrong sending your message. Please try again.',
    };
  }
}

async function sendViaResend(
  name: string,
  email: string,
  message: string,
): Promise<ContactState> {
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
        reply_to: email,
        subject: `New contact message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('[contact] Resend error:', res.status, await res.text());
      return {
        status: 'error',
        message: 'Sorry, we couldn’t send your message. Please try again or email us directly.',
      };
    }

    return { status: 'success' };
  } catch (err) {
    console.error('[contact] Resend send failed:', err);
    return {
      status: 'error',
      message: 'Sorry, something went wrong sending your message. Please try again.',
    };
  }
}
