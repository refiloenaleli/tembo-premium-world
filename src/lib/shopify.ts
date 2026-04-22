import type { CartItem } from "@/context/CartContext";

type ShopifyVariantMap = Record<
  string,
  {
    full?: string;
    mini?: string;
  }
>;

type ShopifyCheckoutResult =
  | {
      ok: true;
      url: string;
      missingProducts: [];
    }
  | {
      ok: false;
      url: null;
      missingProducts: string[];
    };

export function normalizeShopifyDomain(value: string | undefined) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  const withoutProtocol = raw.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
  return withoutProtocol;
}

export function parseShopifyVariantMap(value: string | undefined): ShopifyVariantMap {
  const raw = String(value || "").trim();
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as ShopifyVariantMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function getShopifySetupStatus(settings: Record<string, string | undefined>) {
  const domain = normalizeShopifyDomain(settings.shopify_store_domain);
  const variantMap = parseShopifyVariantMap(settings.shopify_variant_map);

  return {
    domain,
    variantMap,
    isConfigured: Boolean(domain) && Object.keys(variantMap).length > 0,
  };
}

export function buildShopifyCheckoutUrl(
  settings: Record<string, string | undefined>,
  items: CartItem[],
  customerEmail?: string | null,
) : ShopifyCheckoutResult {
  const { domain, variantMap } = getShopifySetupStatus(settings);

  if (!domain) {
    return {
      ok: false,
      url: null,
      missingProducts: items.map((item) => item.product.name),
    };
  }

  const lines: string[] = [];
  const missingProducts: string[] = [];

  items.forEach((item) => {
    const variantId = variantMap[item.product.slug]?.[item.size];

    if (!variantId) {
      missingProducts.push(`${item.product.name} (${item.size === "full" ? "750ml" : "50ml"})`);
      return;
    }

    lines.push(`${variantId}:${item.quantity}`);
  });

  if (missingProducts.length > 0 || lines.length === 0) {
    return {
      ok: false,
      url: null,
      missingProducts,
    };
  }

  const params = new URLSearchParams({
    note: "Tembo website checkout",
    ref: "tembo-website",
    payment: "shop_pay",
  });

  if (customerEmail) {
    params.set("checkout[email]", customerEmail);
  }

  return {
    ok: true,
    url: `https://${domain}/cart/${lines.join(",")}?${params.toString()}`,
    missingProducts: [],
  };
}
