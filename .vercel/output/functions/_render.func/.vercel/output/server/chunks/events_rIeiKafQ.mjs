import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { n as $$Image, s as createComponent } from "./_astro_assets_4oEg9Vw_.mjs";
import { b as createAstro, d as maybeRenderHead, f as renderHead, i as renderComponent, p as addAttribute, s as renderSlot, u as renderTemplate, v as unescapeHTML } from "./server_vBFzGkSx.mjs";
//#region src/assets/slaaf-logo.png
var slaaf_logo_default = new Proxy({
	"src": "/_astro/slaaf-logo.C2DC56m5.png",
	"width": 498,
	"height": 240,
	"format": "png"
}, { get(target, name, receiver) {
	if (name === "clone") return structuredClone(target);
	if (name === "fsPath") return "/home/user/slaaf/src/assets/slaaf-logo.png";
	return target[name];
} });
//#endregion
//#region src/components/Header.astro
createAstro("https://www.slaaf.org");
var $$Header = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Header;
	const nav = [
		{
			href: "/about",
			label: "About"
		},
		{
			href: "/get-involved",
			label: "Get involved"
		},
		{
			href: "/events",
			label: "Events"
		},
		{
			href: "/competitions",
			label: "Competitions"
		},
		{
			href: "/news",
			label: "News"
		},
		{
			href: "/support",
			label: "Support"
		}
	];
	const path = Astro.url.pathname;
	return renderTemplate`${maybeRenderHead($$result)}<header class="sticky top-0 z-50 border-b border-ink-900/10 bg-sand-200/90 backdrop-blur"><div class="container-page flex items-center justify-between gap-6 py-3"><a href="/" class="shrink-0" aria-label="Sierra Leone Authority of American Football — home">${renderComponent($$result, "Image", $$Image, {
		"src": slaaf_logo_default,
		"alt": "Sierra Leone Authority of American Football",
		"height": 56,
		"densities": [1, 2],
		"class": "h-11 w-auto sm:h-14"
	})}</a><nav aria-label="Primary" class="hidden lg:block"><ul class="flex items-center gap-7">${nav.map((item) => renderTemplate`<li><a${addAttribute(item.href, "href")}${addAttribute(path.startsWith(item.href) ? "page" : void 0, "aria-current")}${addAttribute(["type-control whitespace-nowrap transition hover:text-leone-600", path.startsWith(item.href) ? "text-leone-600" : "text-ink-800"], "class:list")}>${item.label}</a></li>`)}</ul></nav><details class="lg:hidden [&amp;_svg]:open:rotate-90"><summary class="type-control flex cursor-pointer items-center gap-2 rounded-full border-2 border-ink-900/20 px-4 py-2">Menu<svg class="h-3 w-3 transition-transform" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg></summary><nav aria-label="Primary mobile" class="absolute inset-x-0 top-full border-b border-ink-900/10 bg-sand-100 shadow-lg"><ul class="container-page flex flex-col py-2">${nav.map((item) => renderTemplate`<li><a${addAttribute(item.href, "href")} class="type-control block border-b border-ink-900/5 py-3">${item.label}</a></li>`)}</ul></nav></details></div></header>`;
}, "/home/user/slaaf/src/components/Header.astro", void 0);
//#endregion
//#region src/components/Footer.astro
var $$Footer = createComponent(($$result, $$props, $$slots) => {
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	return renderTemplate`${maybeRenderHead($$result)}<footer class="bg-ink-950 text-sand-100"><div class="container-page py-16"><div class="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]"><div><p class="type-title text-3xl">SLAAF</p><p class="mt-2 max-w-xs text-sm leading-relaxed text-ink-300">Sierra Leone Authority of American Football — the national governing body for tackle and flag football in Sierra Leone.</p></div>${[
		{
			title: "The Authority",
			links: [
				{
					href: "/about",
					label: "About SLAAF"
				},
				{
					href: "/about#governance",
					label: "Governance"
				},
				{
					href: "/contact",
					label: "Contact"
				}
			]
		},
		{
			title: "Football",
			links: [
				{
					href: "/events",
					label: "Upcoming events"
				},
				{
					href: "/competitions",
					label: "Competitions"
				},
				{
					href: "/get-involved",
					label: "Get involved"
				}
			]
		},
		{
			title: "Get behind us",
			links: [
				{
					href: "/support",
					label: "Donate"
				},
				{
					href: "/support#partners",
					label: "Sponsorship"
				},
				{
					href: "/media",
					label: "Press kit"
				}
			]
		}
	].map((col) => renderTemplate`<div><h2 class="type-label text-leone-400">${col.title}</h2><ul class="mt-4 space-y-2">${col.links.map((l) => renderTemplate`<li><a${addAttribute(l.href, "href")} class="text-sm text-ink-200 transition hover:text-white">${l.label}</a></li>`)}</ul></div>`)}</div><div class="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between"><p class="text-xs text-ink-400">&copy; ${year} Sierra Leone Authority of American Football. All rights reserved.</p><p class="type-label text-atlantic-400">Kam join wi</p></div></div></footer>`;
}, "/home/user/slaaf/src/components/Footer.astro", void 0);
//#endregion
//#region src/layouts/Base.astro
createAstro("https://www.slaaf.org");
var $$Base = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Base;
	const { title, description, ogImage = "/og-default.jpg" } = Astro.props;
	const siteName = "Sierra Leone Authority of American Football";
	const fullTitle = title === siteName ? title : `${title} | SLAAF`;
	const canonical = new URL(Astro.url.pathname, Astro.site);
	const ogUrl = new URL(ogImage, Astro.site);
	return renderTemplate`<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${fullTitle}</title><meta name="description"${addAttribute(description, "content")}><link rel="canonical"${addAttribute(canonical, "href")}><link rel="sitemap" href="/sitemap-index.xml"><meta property="og:type" content="website"><meta property="og:site_name"${addAttribute(siteName, "content")}><meta property="og:title"${addAttribute(fullTitle, "content")}><meta property="og:description"${addAttribute(description, "content")}><meta property="og:url"${addAttribute(canonical, "content")}><meta property="og:image"${addAttribute(ogUrl, "content")}><meta name="twitter:card" content="summary_large_image"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..125,400..900&family=Inter:wght@400..700&display=swap"><script type="application/ld+json">${unescapeHTML(JSON.stringify({
		"@context": "https://schema.org",
		"@type": "SportsOrganization",
		name: siteName,
		alternateName: "SLAAF",
		sport: "American football",
		url: Astro.site?.toString()
	}))}<\/script>${renderHead($$result)}</head><body><a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-white">Skip to content</a>${renderComponent($$result, "Header", $$Header, {})}<main id="main">${renderSlot($$result, $$slots["default"])}</main>${renderComponent($$result, "Footer", $$Footer, {})}</body></html>`;
}, "/home/user/slaaf/src/layouts/Base.astro", void 0);
//#endregion
//#region src/components/PageHeader.astro
createAstro("https://www.slaaf.org");
var $$PageHeader = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$PageHeader;
	const { title, lede } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<section class="border-b border-ink-900/10 bg-sand-100"><div class="container-page py-16 sm:py-20"><h1 class="text-4xl sm:text-6xl">${title}</h1>${lede && renderTemplate`<p class="prose-body mt-6">${lede}</p>`}${renderSlot($$result, $$slots["default"])}</div></section>`;
}, "/home/user/slaaf/src/components/PageHeader.astro", void 0);
//#endregion
//#region src/components/Placeholder.astro
createAstro("https://www.slaaf.org");
var $$Placeholder = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Placeholder;
	const { need } = Astro.props;
	return renderTemplate`${maybeRenderHead($$result)}<div class="container-page py-16"><div class="rounded-2xl border-2 border-dashed border-ink-900/25 bg-sand-100 p-8"><p class="type-label text-ink-500">Awaiting content</p><p class="mt-3 text-ink-700">${need}</p>${renderSlot($$result, $$slots["default"])}</div></div>`;
}, "/home/user/slaaf/src/components/Placeholder.astro", void 0);
//#endregion
//#region src/pages/events.astro
var events_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Events,
	file: () => $$file,
	prerender: () => false,
	url: () => $$url
});
var $$Events = createComponent(async ($$result, $$props, $$slots) => {
	const calendarId = void 0;
	const events = null;
	const TZ = "Africa/Freetown";
	new Intl.DateTimeFormat("en-GB", {
		weekday: "short",
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: TZ
	});
	new Intl.DateTimeFormat("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
		timeZone: TZ
	});
	new Intl.DateTimeFormat("en-GB", {
		month: "short",
		timeZone: TZ
	});
	new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		timeZone: TZ
	});
	return renderTemplate`${renderComponent($$result, "Base", $$Base, {
		"title": "Upcoming events",
		"description": "Combines, trials, training sessions and fixtures from the Sierra Leone Authority of American Football."
	}, { "default": ($$result2) => renderTemplate`${renderComponent($$result2, "PageHeader", $$PageHeader, {
		"title": "Upcoming events",
		"lede": "Combines, trials, training sessions and fixtures. All times are Freetown time."
	})}${maybeRenderHead($$result2)}<section class="container-page py-16">${events}${events}${calendarId}</section>${renderTemplate`${renderComponent($$result2, "Placeholder", $$Placeholder, { "need": "No calendar is connected yet. Set GOOGLE_CALENDAR_ID to the ID of a public Google Calendar and events will appear here automatically — see README.md." })}`}${calendarId}` })}`;
}, "/home/user/slaaf/src/pages/events.astro", void 0);
var $$file = "/home/user/slaaf/src/pages/events.astro";
var $$url = "/events";
//#endregion
//#region \0virtual:astro:page:src/pages/events@_@astro
var page = () => events_exports;
//#endregion
export { page };
