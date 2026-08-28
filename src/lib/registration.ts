import { z } from 'zod';
import { normaliseCountry } from './countries';

/**
 * Grouped so the select can use optgroups. Covers both codes SLAAF governs:
 * some are flag-specific (rusher, blitzer), some tackle-specific (offensive
 * and defensive line), and the rest are common to both.
 */
export const POSITION_GROUPS = [
  {
    label: 'Offence',
    options: ['Quarterback', 'Running back', 'Wide receiver', 'Tight end', 'Centre', 'Offensive line'],
  },
  {
    label: 'Defence',
    options: ['Rusher', 'Blitzer', 'Defensive line', 'Linebacker', 'Cornerback', 'Safety'],
  },
  { label: 'Special teams', options: ['Kicker', 'Punter', 'Returner'] },
  { label: 'Other', options: ['Not sure yet', 'Coach or official, not a player'] },
] as const;

export const POSITIONS = POSITION_GROUPS.flatMap((g) => g.options as readonly string[]);

export const INTERESTS = ['Playing', 'Coaching', 'Officiating', 'Volunteering'] as const;

/** The interest that unlocks the position question. */
export const INTEREST_PLAYING = INTERESTS[0];

export const CONNECTIONS = [
  'Born in Sierra Leone',
  'Parent born in Sierra Leone',
  'Grandparent born in Sierra Leone',
  'Other connection to Sierra Leone',
  'No connection — I want to support the game',
] as const;

/**
 * Competition category. Federations set eligibility for international play by
 * sex rather than gender identity, and there is no "prefer not to say" option
 * because a category has to be determined before anyone can be selected.
 */
export const SEXES = ['Male', 'Female'] as const;

/**
 * Citizenship and residency are two questions, not one.
 *
 * They used to be a single field whose options all began "Sierra Leone only"
 * or "citizen of another country" — which quietly assumed every applicant
 * already holds Sierra Leone citizenship. Two common cases do not fit that: a
 * player with Sierra Leonean parents who has never held a passport, and a
 * player who is a citizen of another country and not of Sierra Leone at all.
 * Asking separately also records the third case worth knowing about — someone
 * eligible for citizenship who has not claimed it — which is actionable rather
 * than a dead end.
 */
export const CITIZENSHIP = [
  'Yes',
  'Not yet — I believe I am eligible',
  'No',
] as const;

/**
 * "Both citizen and legal resident" is deliberately absent. Citizenship does
 * not imply residency — a German citizen living in Freetown is not a German
 * resident — but the combination is already recoverable: someone who picks
 * "Citizen of another country" and gives that same country under "Country
 * where you live" is both. Offering it as a fourth option only made the
 * choice between it and "Citizen" ambiguous.
 */
export const RESIDENCY = [
  'None',
  'Citizen of another country',
  'Legal resident of another country',
] as const;

/** The option that means no country outside Sierra Leone applies. */
export const RESIDENCY_NONE = RESIDENCY[0];

/**
 * Whether the applicant is in full-time education. Schools and universities
 * are one of the pathways in the Constitution, so this decides who a combine
 * invitation has to be routed through.
 */
export const ENROLMENT = ['High school', 'College or university', 'No'] as const;

/** The option that means no school or college applies. */
export const ENROLMENT_NONE = ENROLMENT[2];

/** Asked only of those still in education. */
export const SCHOOL_SPORT = ['Yes', 'No'] as const;

export const BACKGROUNDS = [
  'American football (tackle)',
  'Flag football',
  'Football (soccer)',
  'Athletics / track',
  'Basketball',
  'Rugby',
  'Other sport',
  'New to sport',
] as const;

/** Age below which a parent or guardian must countersign. */
export const MINOR_AGE = 18;
/** The Mini Combine targets athletes aged 15 and over. */
export const MIN_AGE = 15;

export function ageOn(dob: Date, on = new Date()): number {
  let age = on.getFullYear() - dob.getFullYear();
  const m = on.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && on.getDate() < dob.getDate())) age--;
  return age;
}

export const registrationSchema = z
  .object({
    firstName: z.string({ message: 'Please enter your first name.' }).trim().min(1, 'Please enter your first name.').max(60),
    lastName: z.string({ message: 'Please enter your last name.' }).trim().min(1, 'Please enter your last name.').max(60),
    email: z.email('Please enter a valid email address.').max(200),
    phone: z.string().trim().max(40).optional().or(z.literal('')),
    country: z.string({ message: 'Please tell us where you live.' }).trim().min(2, 'Please tell us where you live.').max(80),
    dateOfBirth: z.coerce.date({ message: 'Please enter your date of birth.' }),
    sex: z.enum(SEXES, { message: 'Please choose one option.' }),
    connection: z.enum(CONNECTIONS, { message: 'Please choose one option.' }),
    citizenship: z.enum(CITIZENSHIP, { message: 'Please choose one option.' }),
    residency: z.enum(RESIDENCY, { message: 'Please choose one option.' }),
    residencyCountry: z.string().trim().max(80).optional().or(z.literal('')),
    enrolment: z.enum(ENROLMENT, { message: 'Please choose one option.' }),
    schoolSport: z.enum(SCHOOL_SPORT).optional().or(z.literal('')),
    background: z.enum(BACKGROUNDS, { message: 'Please choose one option.' }),
    interests: z.array(z.enum(INTERESTS)).min(1, 'Please choose at least one.'),
    position: z.string().trim().max(120).optional().or(z.literal('')),

    experience: z.string().trim().max(2000).optional().or(z.literal('')),
    filmUrl: z.url('That does not look like a valid link.').max(500).optional().or(z.literal('')),
    guardianName: z.string().trim().max(120).optional().or(z.literal('')),
    guardianPhone: z.string().trim().max(40).optional().or(z.literal('')),
    guardianEmail: z.email('Please enter a valid email address.').max(200).optional().or(z.literal('')),
    consent: z.literal('on', { message: 'We need your consent to hold these details.' }),
    // Honeypot: a real person never sees this field, so anything in it is a bot.
    // Deliberately permissive — the handler accepts and discards rather than
    // returning an error, so a bot learns nothing about why it failed.
    website: z.string().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    const age = ageOn(data.dateOfBirth);
    if (Number.isNaN(age)) return;
    if (age < MIN_AGE) {
      ctx.addIssue({
        code: 'custom',
        path: ['dateOfBirth'],
        message: `You must be at least ${MIN_AGE} to register.`,
      });
      return;
    }
    if (age > 100) {
      ctx.addIssue({ code: 'custom', path: ['dateOfBirth'], message: 'Please check this date.' });
      return;
    }
    // Under-18s need a contactable parent or guardian on the record.
    if (age < MINOR_AGE) {
      if (!data.guardianName) {
        ctx.addIssue({
          code: 'custom',
          path: ['guardianName'],
          message: 'Under 18s need a parent or guardian named here.',
        });
      }
      if (!data.guardianPhone) {
        ctx.addIssue({
          code: 'custom',
          path: ['guardianPhone'],
          message: 'Please give a parent or guardian phone number.',
        });
      }
    }
  })
  .superRefine((data, ctx) => {
    // The school-sport question only exists for those still in education.
    if (data.enrolment !== ENROLMENT_NONE && !data.schoolSport) {
      ctx.addIssue({
        code: 'custom',
        path: ['schoolSport'],
        message: 'Please choose one option.',
      });
    }
  })
  .superRefine((data, ctx) => {
    // Naming a country outside Sierra Leone only makes sense if one applies.
    if (data.residency !== RESIDENCY_NONE && !data.residencyCountry) {
      ctx.addIssue({
        code: 'custom',
        path: ['residencyCountry'],
        message: 'Please tell us which country.',
      });
      return;
    }
  })
  .superRefine((data, ctx) => {
    // The country inputs are searchable rather than true selects, so the
    // server is what actually constrains them to the ISO list.
    if (data.country && !normaliseCountry(data.country)) {
      ctx.addIssue({
        code: 'custom',
        path: ['country'],
        message: 'Please choose a country from the list.',
      });
    }
    if (data.residencyCountry && !normaliseCountry(data.residencyCountry)) {
      ctx.addIssue({
        code: 'custom',
        path: ['residencyCountry'],
        message: 'Please choose a country from the list.',
      });
    }
    if (data.position && !data.interests.includes(INTEREST_PLAYING)) {
      ctx.addIssue({
        code: 'custom',
        path: ['position'],
        message: 'Positions are only for people interested in playing.',
      });
    } else if (data.position && !POSITIONS.includes(data.position)) {
      ctx.addIssue({
        code: 'custom',
        path: ['position'],
        message: 'Please choose a position from the list.',
      });
    }
  });

export type Registration = z.infer<typeof registrationSchema>;

/** Everything the endpoint forwards on for one registration. */
export interface RegistrationPayload {
  submittedAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  dateOfBirth: string;
  age: number;
  sex: string;
  isMinor: boolean;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  connection: string;
  citizenship: string;
  residency: string;
  residencyCountry: string;
  enrolment: string;
  schoolSport: string;
  background: string;
  interests: string[];
  position: string;
  experience: string;
  filmUrl: string;
}

/** The two name fields as one string, for a subject line or a table row. */
export const displayName = (p: Pick<RegistrationPayload, 'firstName' | 'lastName'>) =>
  `${p.firstName} ${p.lastName}`.trim();

/**
 * Subject lines are written to be scannable in a shared inbox: who, where,
 * and — prefixed, because it changes who must be contacted first — whether
 * the applicant is a child.
 */
export function emailSubject(p: RegistrationPayload): string {
  const prefix = p.isMinor ? '[Under 18] ' : '';
  return `${prefix}New registration: ${displayName(p)} — ${p.country}`;
}

/** ISO timestamps are unreadable in an inbox. */
function formatSubmitted(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.valueOf())) return iso;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC',
  }).format(d) + ' UTC';
}

const escapeHtml = (v: string) =>
  v.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );

function rows(p: RegistrationPayload): Array<[string, string]> {
  const out: Array<[string, string]> = [
    ['Name', displayName(p)],
    ['Email', p.email],
    ['Phone', p.phone || '—'],
    ['Country', p.country],
    ['Date of birth', `${p.dateOfBirth} (age ${p.age})`],
    ['Sex (competition category)', p.sex],
  ];
  if (p.isMinor) {
    out.push(
      ['Parent or guardian', p.guardianName],
      ['Guardian phone', p.guardianPhone],
      ['Guardian email', p.guardianEmail || '—'],
    );
  }
  out.push(
    ['Connection to Sierra Leone', p.connection],
    ['Sierra Leone citizen', p.citizenship],
    ['Elsewhere', p.residencyCountry ? `${p.residency} (${p.residencyCountry})` : p.residency],
    ['In education', p.schoolSport ? `${p.enrolment} (plays for a school team: ${p.schoolSport})` : p.enrolment],
    ['Sporting background', p.background],
    ['Interested in', p.interests.join(', ')],
    ['Position', p.position || '—'],
    ['Experience', p.experience || '—'],
    ['Highlight film', p.filmUrl || '—'],
  );
  return out;
}

export function emailText(p: RegistrationPayload): string {
  const head = p.isMinor
    ? 'This applicant is under 18. Contact the parent or guardian before any follow-up.\n\n'
    : '';
  return (
    `${head}${rows(p)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n')}\n\nSubmitted ${formatSubmitted(p.submittedAt)}\nReply to this email to answer the applicant directly.`
  );
}

export function emailHtml(p: RegistrationPayload): string {
  const notice = p.isMinor
    ? `<p style="margin:0 0 20px;padding:12px 16px;background:#eff8ff;border-left:4px solid #0072c6;color:#1e4472;font-size:14px">
         <strong>This applicant is under 18.</strong> Contact the parent or guardian before any follow-up.
       </p>`
    : '';
  const body = rows(p)
    .map(
      ([k, v]) => `<tr>
        <td style="padding:8px 16px 8px 0;color:#57564d;font-size:13px;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;vertical-align:top">${escapeHtml(k)}</td>
        <td style="padding:8px 0;color:#1f2119;font-size:15px">${escapeHtml(v)}</td>
      </tr>`,
    )
    .join('');
  return `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px">
    <h1 style="margin:0 0 4px;font-size:20px;color:#1f2119">New registration</h1>
    <p style="margin:0 0 20px;color:#6f6e63;font-size:14px">Sierra Leone Authority of American Football</p>
    ${notice}
    <table style="border-collapse:collapse;width:100%">${body}</table>
    <p style="margin:24px 0 0;color:#8a897e;font-size:12px">
      Submitted ${escapeHtml(formatSubmitted(p.submittedAt))}. Reply to this email to answer the applicant directly.
    </p>
  </div>`;
}
