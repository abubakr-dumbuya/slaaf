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

/** Shopify marks presale items in the title; the page says it once instead. */
export function cleanTitle(title: string): string {
  return title.replace(/\s*\*?\s*presale\s*\*?\s*/gi, ' ').replace(/\s{2,}/g, ' ').trim();
}

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
