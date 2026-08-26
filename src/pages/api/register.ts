import type { APIRoute } from 'astro';
import {
  registrationSchema,
  ageOn,
  MINOR_AGE,
  emailSubject,
  emailText,
  emailHtml,
  type RegistrationPayload,
} from '../../lib/registration';
import { normaliseCountry } from '../../lib/countries';

/** Registrations go here unless overridden. */
const DEFAULT_NOTIFY_EMAIL = 'info@slaaf.org';
const DEFAULT_FROM = 'SLAAF Registrations <registrations@slaaf.org>';

export const prerender = false;

/**
 * Delivery is deliberately pluggable and fails loudly.
 *
 * A registration form that accepts a submission and quietly drops it is worse
 * than no form at all, so if neither destination is configured the endpoint
 * returns 503 and the applicant is told to email instead — we never show a
 * success message for data we did not store.
 *
 *   SLAAF_WEBHOOK_URL  POST target (e.g. a Google Apps Script writing to a Sheet)
 *   RESEND_API_KEY     + SLAAF_NOTIFY_EMAIL to deliver by email
 */
async function deliver(payload: RegistrationPayload): Promise<boolean> {
  const webhook = import.meta.env.SLAAF_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return true;
  }

  const key = import.meta.env.RESEND_API_KEY;
  if (key) {
    const to = import.meta.env.SLAAF_NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL;
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: import.meta.env.SLAAF_FROM_EMAIL || DEFAULT_FROM,
        to: [to],
        // So the board can answer the applicant straight from the inbox.
        reply_to: payload.email,
        subject: emailSubject(payload),
        text: emailText(payload),
        html: emailHtml(payload),
      }),
    });
    if (!res.ok) {
      throw new Error(`Resend responded ${res.status}: ${await res.text().catch(() => '')}`);
    }
    return true;
  }

  return false;
}

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

export const POST: APIRoute = async ({ request }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, message: 'Could not read that submission.' }, 400);
  }

  const raw = {
    ...Object.fromEntries(form),
    interests: form.getAll('interests').map(String),
  };

  const parsed = registrationSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      errors[key] ??= issue.message;
    }
    return json({ ok: false, errors }, 400);
  }

  // Honeypot tripped — accept silently so the bot does not learn anything.
  if (parsed.data.website) return json({ ok: true }, 200);

  const d = parsed.data;
  const age = ageOn(d.dateOfBirth);
  const payload: RegistrationPayload = {
    submittedAt: new Date().toISOString(),
    fullName: d.fullName,
    email: d.email,
    phone: d.phone || '',
    country: normaliseCountry(d.country) ?? d.country,
    dateOfBirth: d.dateOfBirth.toISOString().slice(0, 10),
    age,
    isMinor: age < MINOR_AGE,
    guardianName: d.guardianName || '',
    guardianPhone: d.guardianPhone || '',
    guardianEmail: d.guardianEmail || '',
    connection: d.connection,
    residency: d.residency,
    residencyCountry: d.residencyCountry ? (normaliseCountry(d.residencyCountry) ?? d.residencyCountry) : '',
    background: d.background,
    interests: d.interests,
    position: d.position || '',
    experience: d.experience || '',
    filmUrl: d.filmUrl || '',
  };

  try {
    const delivered = await deliver(payload);
    if (!delivered) {
      console.error('Registration received but no delivery destination is configured.');
      return json(
        {
          ok: false,
          message:
            'We could not record your registration right now. Please email us and we will add you manually.',
        },
        503,
      );
    }
  } catch (err) {
    console.error('Registration delivery failed:', err);
    return json(
      { ok: false, message: 'Something went wrong sending your registration. Please try again shortly.' },
      502,
    );
  }

  return json({ ok: true }, 200);
};
