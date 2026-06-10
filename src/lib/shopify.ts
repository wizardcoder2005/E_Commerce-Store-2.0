export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: {
    amount: string;
  };
}

export interface ShopifyImage {
  url: string;
  altText: string;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  descriptionHtml: string;
  totalInventory: number;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: {
      node: ShopifyImage;
    }[];
  };
  variants: {
    edges: {
      node: ProductVariant;
    }[];
  };
}

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_DOMAIN || "zonura-demo.myshopify.com";
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "mock_access_token";
const endpoint = `https://${domain}/api/2024-01/graphql.json`;

/**
 * Helper function to execute GraphQL queries against the Shopify Storefront API.
 */
async function shopifyFetch<T>({ query, variables }: { query: string; variables?: any }): Promise<{ status: number; body: T } | null> {
  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      next: { revalidate: 3600 }, 
    });

    const body = await result.json();

    if (body.errors) {
      console.warn("Shopify GraphQL Error:", body.errors);
      return null;
    }

    return {
      status: result.status,
      body,
    };
  } catch (error) {
    console.warn("Shopify fetch connection error. Using fallback data.", error);
    return null;
  }
}

// Fallback Mock Data for UI Preview
const mockProduct: ShopifyProduct = {
  id: "gid://shopify/Product/1",
  handle: "aura-glow-serum",
  title: "Botanical Restorative Essence",
  descriptionHtml: "<p>A deeply nourishing formula designed to harmonize with your body's natural rhythms. Crafted with intention to restore balance and vitality without harsh interventions.</p>",
  totalInventory: 42,
  priceRange: {
    minVariantPrice: { amount: "85.00", currencyCode: "USD" }
  },
  images: {
    edges: [
      { node: { url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop", altText: "Essence Bottle" } },
      { node: { url: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1200&auto=format&fit=crop", altText: "Essence Texture" } },
      { node: { url: "https://images.unsplash.com/photo-1615397323281-197282717088?q=80&w=1200&auto=format&fit=crop", altText: "Ingredients" } }
    ]
  },
  variants: {
    edges: [
      { node: { id: "gid://shopify/ProductVariant/1", title: "50ml", availableForSale: true, price: { amount: "85.00" } } }
    ]
  }
};

/**
 * Fetches products for a specific collection.
 */
export async function getCollectionProducts(collectionHandle: string): Promise<ShopifyProduct[]> {
  const query = `
    query getCollectionProducts($handle: String!) {
      collection(handle: $handle) {
        products(first: 20) {
          edges {
            node {
              id
              title
              handle
              descriptionHtml
              totalInventory
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    price {
                      amount
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ data: { collection: { products: { edges: { node: ShopifyProduct }[] } } | null } }>({
    query,
    variables: { handle: collectionHandle },
  });

  if (!response || !response.body.data.collection) {
    return [mockProduct]; // Return fallback for UI preview
  }

  return response.body.data.collection.products.edges.map((edge) => edge.node);
}

/**
 * Fetches a single product by its handle.
 */
export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    query getProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        descriptionHtml
        totalInventory
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
              }
            }
          }
        }
      }
    }
  `;

  const response = await shopifyFetch<{ data: { product: ShopifyProduct | null } }>({
    query,
    variables: { handle },
  });

  if (!response || !response.body.data.product) {
    return mockProduct; // Return fallback for UI preview
  }

  return response.body.data.product;
}
