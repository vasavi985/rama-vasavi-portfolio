/**
 * Secure Email Dispatch Service
 * 
 * Supports both Formspree and EmailJS using public client-side identifiers.
 * Never stores or exposes private passwords, SMTP credentials, or secret keys.
 * 
 * Target recipient: Vasavi0908@gmail.com
 */

export async function sendContactEmail({ name, email, message }) {
  const trimmedName = name.trim();
  const trimmedEmail = email.trim();
  const trimmedMessage = message.trim();

  // 1. Check for Formspree configuration (Recommended - easiest setup)
  const formspreeId = import.meta.env.VITE_FORMSPREE_ID;
  const formspreeEndpoint =
    import.meta.env.VITE_FORMSPREE_ENDPOINT ||
    (formspreeId ? `https://formspree.io/f/${formspreeId}` : null);

  if (formspreeEndpoint) {
    const response = await fetch(formspreeEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        name: trimmedName,
        email: trimmedEmail,
        _replyto: trimmedEmail,
        message: trimmedMessage,
        _subject: `New Portfolio Message from ${trimmedName}`
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Formspree request failed with status ${response.status}`);
    }

    return { success: true, provider: 'formspree' };
  }

  // 2. Check for EmailJS configuration (Alternative)
  const emailjsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const emailjsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const emailjsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        service_id: emailjsServiceId,
        template_id: emailjsTemplateId,
        user_id: emailjsPublicKey,
        template_params: {
          name: trimmedName,
          email: trimmedEmail,
          reply_to: trimmedEmail,
          to_email: 'Vasavi0908@gmail.com',
          message: trimmedMessage
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'EmailJS request failed');
      throw new Error(errorText || `EmailJS request failed with status ${response.status}`);
    }

    return { success: true, provider: 'emailjs' };
  }

  // 3. Neither service is configured in .env
  console.warn(
    '[Contact Form] No email service is configured in your .env file.\n' +
    'Please add VITE_FORMSPREE_ID to your .env file (recommended),\n' +
    'or configure EmailJS (VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY).'
  );

  throw new Error('Email service not configured. Please add your Formspree ID or EmailJS keys to .env');
}
