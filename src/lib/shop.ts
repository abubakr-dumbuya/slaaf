/**
 * Reads a Shopify collection through the storefront's public products.json
 * endpoint and renders it in the site's own design.
 *
 * No API token is involved: products.json is public on any store with an
 * online storefront. Checkout is never handled here — every product links out
 * to Shopify, so card details, PCI scope and fraud liability stay with them.
 */
export interface ShopProduct {
  id: number;
  title: string;
  handle: string;
  url: string;
  image: { src: string; width: number; height: number } | null;
  /** Lowest variant price, as a number. */
  price: number;
  /** True when at least one variant is in stock. */
  available: boolean;
  /** "Presale", "Hoodie" etc. — Shopify's product_type, where set. */
  type: string;
  /** One-line garment description, empty when none is written for it. */
  blurb: string;
}

export interface ShopConfig {
  /** Storefront domain, e.g. "by.fambul.com". */
  domain: string;
  /** Collection handle, e.g. "slaaf". */
  collection: string;
  currency: string;
}

export const SHOP: ShopConfig = {
  domain: 'by.fambul.com',
  collection: 'slaaf',
  currency: 'USD',
};

export const collectionUrl = (shop: ShopConfig) =>
  `https://${shop.domain}/collections/${shop.collection}`;

/**
 * Shopify titles repeat context this page already provides: every item is
 * marked *PRESALE* (stated once above the grid) and prefixed "SLAAF American
 * Football" (which is the whole site). Stripping both leaves the garment —
 * "Reversible Bucket Hat" rather than "SLAAF American Football Reversible
 * Bucket Hat *PRESALE*" — which matters most in a half-width mobile card.
 */
export function cleanTitle(title: string): string {
  return title
    .replace(/\s*\*?\s*presale\s*\*?\s*/gi, ' ')
    .replace(/^\s*SLAAF\s+/i, '')
    .replace(/^\s*American\s+Football\s+/i, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Short garment lines for the collection grid.
 *
 * These are condensed from FAMBUL's own product copy rather than parsed out of
 * it: every description on Shopify opens with the same two paragraphs — what
 * SLAAF is, and the presale shipping date — both of which this page already
 * states, and what remains is a bare "T-shirt details:" or a sizing chart
 * rather than a sentence. A product with no entry here simply shows no line.
 */
const BLURBS: Record<string, string> = {
  'slaaf-american-football-hoodie':
    'Super-soft 10 oz ring-spun cotton blend, with the Sierra Leone football logo embroidered across the front.',
  'slaaf-american-football-sleeveless-hoodie':
    'The same 10 oz ring-spun cotton blend, cut sleeveless, logo embroidered across the front.',
  'slaaf-american-football-t-shirt':
    'Lightweight 90% polyester and 10% elastane — moisture-wicking, quick-drying, with four-way stretch.',
  'slaaf-american-football-reversible-bucket-hat':
    'Reversible, in three sizes — cut to fit braids, locs and twists as well as shorter styles.',
};

export const blurbFor = (handle: string): string => BLURBS[handle] ?? '';

export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

interface RawVariant { price: string; available: boolean }
interface RawImage { src: string; width: number; height: number }
interface RawProduct {
  id: number;
  title: string;
  handle: string;
  product_type?: string;
  variants?: RawVariant[];
  images?: RawImage[];
}

export function parseProducts(raw: unknown, shop: ShopConfig): ShopProduct[] {
  const products = (raw as { products?: RawProduct[] })?.products;
  if (!Array.isArray(products)) return [];

  return products.flatMap((p) => {
    const variants = p.variants ?? [];
    const prices = variants.map((v) => Number(v.price)).filter((n) => Number.isFinite(n));
    if (!p.title || !p.handle || prices.length === 0) return [];
    const image = p.images?.[0];
    return [{
      id: p.id,
      title: cleanTitle(p.title),
      handle: p.handle,
      url: `https://${shop.domain}/products/${p.handle}`,
      image: image ? { src: image.src, width: image.width, height: image.height } : null,
      price: Math.min(...prices),
      available: variants.some((v) => v.available),
      type: p.product_type ?? '',
      blurb: blurbFor(p.handle),
    }];
  });
}

export async function fetchCollection(shop: ShopConfig = SHOP): Promise<ShopProduct[] | null> {
  const url = `https://${shop.domain}/collections/${shop.collection}/products.json?limit=50`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      console.error(`Shopify collection responded ${res.status}`);
      return null;
    }
    return parseProducts(await res.json(), shop);
  } catch (err) {
    console.error('Could not read the Shopify collection:', err);
    return null;
  }
}
