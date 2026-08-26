import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { z } from "zod";
//#region src/lib/countries.ts
/**
* ISO 3166-1 country names, generated from Intl.DisplayNames.
* Used to populate the country datalists and to validate what comes back,
* so the searchable inputs behave like constrained dropdowns.
*/
var COUNTRIES = [
	"Afghanistan",
	"Åland Islands",
	"Albania",
	"Algeria",
	"American Samoa",
	"Andorra",
	"Angola",
	"Anguilla",
	"Antigua & Barbuda",
	"Argentina",
	"Armenia",
	"Aruba",
	"Australia",
	"Austria",
	"Azerbaijan",
	"Bahamas",
	"Bahrain",
	"Bangladesh",
	"Barbados",
	"Belarus",
	"Belgium",
	"Belize",
	"Benin",
	"Bermuda",
	"Bhutan",
	"Bolivia",
	"Bosnia & Herzegovina",
	"Botswana",
	"Brazil",
	"British Indian Ocean Territory",
	"British Virgin Islands",
	"Brunei",
	"Bulgaria",
	"Burkina Faso",
	"Burundi",
	"Cambodia",
	"Cameroon",
	"Canada",
	"Cape Verde",
	"Caribbean Netherlands",
	"Cayman Islands",
	"Central African Republic",
	"Chad",
	"Chile",
	"China",
	"Colombia",
	"Comoros",
	"Congo - Brazzaville",
	"Congo - Kinshasa",
	"Cook Islands",
	"Costa Rica",
	"Côte d’Ivoire",
	"Croatia",
	"Cuba",
	"Curaçao",
	"Cyprus",
	"Czechia",
	"Denmark",
	"Djibouti",
	"Dominica",
	"Dominican Republic",
	"Ecuador",
	"Egypt",
	"El Salvador",
	"Equatorial Guinea",
	"Eritrea",
	"Estonia",
	"Eswatini",
	"Ethiopia",
	"Faroe Islands",
	"Fiji",
	"Finland",
	"France",
	"French Guiana",
	"French Polynesia",
	"Gabon",
	"Gambia",
	"Georgia",
	"Germany",
	"Ghana",
	"Gibraltar",
	"Greece",
	"Greenland",
	"Grenada",
	"Guadeloupe",
	"Guam",
	"Guatemala",
	"Guernsey",
	"Guinea",
	"Guinea-Bissau",
	"Guyana",
	"Haiti",
	"Honduras",
	"Hong Kong SAR China",
	"Hungary",
	"Iceland",
	"India",
	"Indonesia",
	"Iran",
	"Iraq",
	"Ireland",
	"Isle of Man",
	"Israel",
	"Italy",
	"Jamaica",
	"Japan",
	"Jersey",
	"Jordan",
	"Kazakhstan",
	"Kenya",
	"Kiribati",
	"Kuwait",
	"Kyrgyzstan",
	"Laos",
	"Latvia",
	"Lebanon",
	"Lesotho",
	"Liberia",
	"Libya",
	"Liechtenstein",
	"Lithuania",
	"Luxembourg",
	"Macao SAR China",
	"Madagascar",
	"Malawi",
	"Malaysia",
	"Maldives",
	"Mali",
	"Malta",
	"Marshall Islands",
	"Martinique",
	"Mauritania",
	"Mauritius",
	"Mayotte",
	"Mexico",
	"Micronesia",
	"Moldova",
	"Monaco",
	"Mongolia",
	"Montenegro",
	"Montserrat",
	"Morocco",
	"Mozambique",
	"Myanmar (Burma)",
	"Namibia",
	"Nauru",
	"Nepal",
	"Netherlands",
	"New Caledonia",
	"New Zealand",
	"Nicaragua",
	"Niger",
	"Nigeria",
	"Niue",
	"Norfolk Island",
	"North Korea",
	"North Macedonia",
	"Northern Mariana Islands",
	"Norway",
	"Oman",
	"Pakistan",
	"Palau",
	"Palestinian Territories",
	"Panama",
	"Papua New Guinea",
	"Paraguay",
	"Peru",
	"Philippines",
	"Poland",
	"Portugal",
	"Puerto Rico",
	"Qatar",
	"Réunion",
	"Romania",
	"Russia",
	"Rwanda",
	"Samoa",
	"San Marino",
	"São Tomé & Príncipe",
	"Saudi Arabia",
	"Senegal",
	"Serbia",
	"Seychelles",
	"Sierra Leone",
	"Singapore",
	"Sint Maarten",
	"Slovakia",
	"Slovenia",
	"Solomon Islands",
	"Somalia",
	"South Africa",
	"South Korea",
	"South Sudan",
	"Spain",
	"Sri Lanka",
	"St. Barthélemy",
	"St. Helena",
	"St. Kitts & Nevis",
	"St. Lucia",
	"St. Martin",
	"St. Pierre & Miquelon",
	"St. Vincent & Grenadines",
	"Sudan",
	"Suriname",
	"Sweden",
	"Switzerland",
	"Syria",
	"Taiwan",
	"Tajikistan",
	"Tanzania",
	"Thailand",
	"Timor-Leste",
	"Togo",
	"Tokelau",
	"Tonga",
	"Trinidad & Tobago",
	"Tunisia",
	"Türkiye",
	"Turkmenistan",
	"Turks & Caicos Islands",
	"Tuvalu",
	"U.S. Virgin Islands",
	"Uganda",
	"Ukraine",
	"United Arab Emirates",
	"United Kingdom",
	"United States",
	"Uruguay",
	"Uzbekistan",
	"Vanuatu",
	"Vatican City",
	"Venezuela",
	"Vietnam",
	"Wallis & Futuna",
	"Western Sahara",
	"Yemen",
	"Zambia",
	"Zimbabwe"
];
var LOOKUP = new Set(COUNTRIES.map((c) => c.toLowerCase()));
/** Case-insensitive match, returning the canonical spelling. */
function normaliseCountry(value) {
	const v = value.trim();
	if (!LOOKUP.has(v.toLowerCase())) return null;
	return COUNTRIES.find((c) => c.toLowerCase() === v.toLowerCase()) ?? null;
}
var POSITIONS = [
	{
		label: "Offence",
		options: [
			"Quarterback",
			"Running back",
			"Wide receiver",
			"Tight end",
			"Centre",
			"Offensive line"
		]
	},
	{
		label: "Defence",
		options: [
			"Rusher",
			"Blitzer",
			"Defensive line",
			"Linebacker",
			"Cornerback",
			"Safety"
		]
	},
	{
		label: "Special teams",
		options: [
			"Kicker",
			"Punter",
			"Returner"
		]
	},
	{
		label: "Other",
		options: ["Not sure yet", "Coach or official, not a player"]
	}
].flatMap((g) => g.options);
var INTERESTS = [
	"Playing",
	"Coaching",
	"Officiating",
	"Volunteering"
];
var CONNECTIONS = [
	"Born in Sierra Leone",
	"Parent born in Sierra Leone",
	"Grandparent born in Sierra Leone",
	"Other connection to Sierra Leone",
	"No connection — I want to support the game"
];
/**
* Competition category. Federations set eligibility for international play by
* sex rather than gender identity, and there is no "prefer not to say" option
* because a category has to be determined before anyone can be selected.
*/
var SEXES = ["Male", "Female"];
var RESIDENCY = [
	"No — Sierra Leone only",
	"Yes — citizen of another country",
	"Yes — legal resident of another country",
	"Yes — both citizen and legal resident"
];
/** The option that means no country outside Sierra Leone applies. */
var RESIDENCY_NONE = RESIDENCY[0];
var BACKGROUNDS = [
	"American football (tackle)",
	"Flag football",
	"Football (soccer)",
	"Athletics / track",
	"Basketball",
	"Rugby",
	"Other sport",
	"New to sport"
];
function ageOn(dob, on = /* @__PURE__ */ new Date()) {
	let age = on.getFullYear() - dob.getFullYear();
	const m = on.getMonth() - dob.getMonth();
	if (m < 0 || m === 0 && on.getDate() < dob.getDate()) age--;
	return age;
}
var registrationSchema = z.object({
	fullName: z.string({ message: "Please enter your full name." }).trim().min(2, "Please enter your full name.").max(120),
	email: z.email("Please enter a valid email address.").max(200),
	phone: z.string().trim().max(40).optional().or(z.literal("")),
	country: z.string({ message: "Please tell us where you live." }).trim().min(2, "Please tell us where you live.").max(80),
	dateOfBirth: z.coerce.date({ message: "Please enter your date of birth." }),
	sex: z.enum(SEXES, { message: "Please choose one option." }),
	connection: z.enum(CONNECTIONS, { message: "Please choose one option." }),
	residency: z.enum(RESIDENCY, { message: "Please choose one option." }),
	residencyCountry: z.string().trim().max(80).optional().or(z.literal("")),
	background: z.enum(BACKGROUNDS, { message: "Please choose one option." }),
	interests: z.array(z.enum(INTERESTS)).min(1, "Please choose at least one."),
	position: z.string().trim().max(120).optional().or(z.literal("")),
	experience: z.string().trim().max(2e3).optional().or(z.literal("")),
	filmUrl: z.url("That does not look like a valid link.").max(500).optional().or(z.literal("")),
	guardianName: z.string().trim().max(120).optional().or(z.literal("")),
	guardianPhone: z.string().trim().max(40).optional().or(z.literal("")),
	guardianEmail: z.email("Please enter a valid email address.").max(200).optional().or(z.literal("")),
	consent: z.literal("on", { message: "We need your consent to hold these details." }),
	website: z.string().max(500).optional()
}).superRefine((data, ctx) => {
	const age = ageOn(data.dateOfBirth);
	if (Number.isNaN(age)) return;
	if (age < 15) {
		ctx.addIssue({
			code: "custom",
			path: ["dateOfBirth"],
			message: `You must be at least 15 to register.`
		});
		return;
	}
	if (age > 100) {
		ctx.addIssue({
			code: "custom",
			path: ["dateOfBirth"],
			message: "Please check this date."
		});
		return;
	}
	if (age < 18) {
		if (!data.guardianName) ctx.addIssue({
			code: "custom",
			path: ["guardianName"],
			message: "Under 18s need a parent or guardian named here."
		});
		if (!data.guardianPhone) ctx.addIssue({
			code: "custom",
			path: ["guardianPhone"],
			message: "Please give a parent or guardian phone number."
		});
	}
}).superRefine((data, ctx) => {
	if (data.residency !== RESIDENCY_NONE && !data.residencyCountry) {
		ctx.addIssue({
			code: "custom",
			path: ["residencyCountry"],
			message: "Please tell us which country."
		});
		return;
	}
}).superRefine((data, ctx) => {
	if (data.country && !normaliseCountry(data.country)) ctx.addIssue({
		code: "custom",
		path: ["country"],
		message: "Please choose a country from the list."
	});
	if (data.residencyCountry && !normaliseCountry(data.residencyCountry)) ctx.addIssue({
		code: "custom",
		path: ["residencyCountry"],
		message: "Please choose a country from the list."
	});
	if (data.position && !POSITIONS.includes(data.position)) ctx.addIssue({
		code: "custom",
		path: ["position"],
		message: "Please choose a position from the list."
	});
});
//#endregion
//#region src/pages/api/register.ts
var register_exports = /* @__PURE__ */ __exportAll({
	POST: () => POST,
	prerender: () => false
});
async function deliver(payload) {
	return false;
}
var json = (body, status) => new Response(JSON.stringify(body), {
	status,
	headers: { "content-type": "application/json" }
});
var POST = async ({ request }) => {
	let form;
	try {
		form = await request.formData();
	} catch {
		return json({
			ok: false,
			message: "Could not read that submission."
		}, 400);
	}
	const raw = {
		...Object.fromEntries(form),
		interests: form.getAll("interests").map(String)
	};
	const parsed = registrationSchema.safeParse(raw);
	if (!parsed.success) {
		const errors = {};
		for (const issue of parsed.error.issues) {
			const key = String(issue.path[0] ?? "form");
			errors[key] ??= issue.message;
		}
		return json({
			ok: false,
			errors
		}, 400);
	}
	if (parsed.data.website) return json({ ok: true }, 200);
	const d = parsed.data;
	const age = ageOn(d.dateOfBirth);
	const payload = {
		submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
		fullName: d.fullName,
		email: d.email,
		phone: d.phone || "",
		country: normaliseCountry(d.country) ?? d.country,
		dateOfBirth: d.dateOfBirth.toISOString().slice(0, 10),
		age,
		sex: d.sex,
		isMinor: age < 18,
		guardianName: d.guardianName || "",
		guardianPhone: d.guardianPhone || "",
		guardianEmail: d.guardianEmail || "",
		connection: d.connection,
		residency: d.residency,
		residencyCountry: d.residencyCountry ? normaliseCountry(d.residencyCountry) ?? d.residencyCountry : "",
		background: d.background,
		interests: d.interests,
		position: d.position || "",
		experience: d.experience || "",
		filmUrl: d.filmUrl || ""
	};
	try {
		if (!await deliver(payload)) {
			console.error("Registration received but no delivery destination is configured.");
			return json({
				ok: false,
				message: "We could not record your registration right now. Please email us and we will add you manually."
			}, 503);
		}
	} catch (err) {
		console.error("Registration delivery failed:", err);
		return json({
			ok: false,
			message: "Something went wrong sending your registration. Please try again shortly."
		}, 502);
	}
	return json({ ok: true }, 200);
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/register@_@ts
var page = () => register_exports;
//#endregion
export { page };
