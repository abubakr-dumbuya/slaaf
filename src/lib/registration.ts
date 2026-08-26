import { z } from 'zod';

export const INTERESTS = ['Playing', 'Coaching', 'Officiating', 'Volunteering'] as const;

export const CONNECTIONS = [
  'Born in Sierra Leone',
  'Parent born in Sierra Leone',
  'Grandparent born in Sierra Leone',
  'Other connection to Sierra Leone',
  'No connection — I want to support the game',
] as const;

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
    fullName: z.string({ message: 'Please enter your full name.' }).trim().min(2, 'Please enter your full name.').max(120),
    email: z.email('Please enter a valid email address.').max(200),
    phone: z.string().trim().max(40).optional().or(z.literal('')),
    country: z.string({ message: 'Please tell us where you live.' }).trim().min(2, 'Please tell us where you live.').max(80),
    dateOfBirth: z.coerce.date({ message: 'Please enter your date of birth.' }),
    connection: z.enum(CONNECTIONS, { message: 'Please choose one option.' }),
    background: z.enum(BACKGROUNDS, { message: 'Please choose one option.' }),
    interests: z.array(z.enum(INTERESTS)).min(1, 'Please choose at least one.'),
    position: z.string().trim().max(120).optional().or(z.literal('')),
    experience: z.string().trim().max(2000).optional().or(z.literal('')),
    filmUrl: z.url('That does not look like a valid link.').max(500).optional().or(z.literal('')),
    guardianName: z.string().trim().max(120).optional().or(z.literal('')),
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
    // Under-18s need a parent or guardian on the record.
    if (age < MINOR_AGE) {
      if (!data.guardianName) {
        ctx.addIssue({
          code: 'custom',
          path: ['guardianName'],
          message: 'Under 18s need a parent or guardian named here.',
        });
      }
      if (!data.guardianEmail) {
        ctx.addIssue({
          code: 'custom',
          path: ['guardianEmail'],
          message: 'Please give a parent or guardian email address.',
        });
      }
    }
  });

export type Registration = z.infer<typeof registrationSchema>;
