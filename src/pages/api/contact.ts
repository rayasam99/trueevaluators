import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const name    = data.get('name')?.toString().trim()    ?? '';
  const phone   = data.get('phone')?.toString().trim()   ?? '';
  const email   = data.get('email')?.toString().trim()   ?? '';
  const address = data.get('address')?.toString().trim() ?? '';
  const message = data.get('message')?.toString().trim() ?? '';

  if (!name) {
    return new Response(JSON.stringify({ ok: false, error: 'Name is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const resend = new Resend(import.meta.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: 'True Evaluators <contact@trueevaluators.com>',
    to:   ['contact@trevaluators.com'],
    replyTo: email || undefined,
    subject: `New contact form submission from ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <table cellpadding="6" cellspacing="0">
        <tr><td><strong>Name</strong></td><td>${name}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${phone || '—'}</td></tr>
        <tr><td><strong>Email</strong></td><td>${email || '—'}</td></tr>
        <tr><td><strong>Address</strong></td><td>${address || '—'}</td></tr>
      </table>
      <h3>Message</h3>
      <p>${message.replace(/\n/g, '<br>') || '—'}</p>
    `,
  });

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
