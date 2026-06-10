import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProductByHandle } from "@/lib/shopify";
import { BuyBox } from "@/components/product/BuyBox";
import { ProductTabs } from "@/components/product/ProductTabs";

// --- Main Page Component (Server Component) ---
export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const primaryVariant = product.variants.edges[0]?.node;
  if (!primaryVariant) {
    notFound();
  }

  const priceUSD = parseFloat(primaryVariant.price.amount);
  const priceINR = Math.round(priceUSD * 83.5);

  const ritual = "Apply three drops to your palms. Breathe in deeply, acknowledging the present moment. Gently press into cleansed skin, moving upward and outward. Allow the essence to melt into your aura.";
  const ingredients = "Wild-harvested sea kelp, organic cold-pressed rosehip oil, bio-active squalane, and a trace mineral complex sourced from ancient sea beds.";
  const science = "Clinically observed to improve skin barrier retention by 42% over a 28-day cycle. The bio-active compounds communicate directly with cellular receptors to encourage natural regeneration rather than forced turnover.";

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-8 md:py-12">
      
      {/* Fashion 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Myntra-Style 2x2 Image Grid (7 cols) */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            {product.images.edges.map((edge, idx) => (
              <div key={idx} className={`relative aspect-[3/4] bg-zonura-sand/20 ${idx === 0 ? 'col-span-2 aspect-[4/5]' : ''}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={edge.node.url} 
                  alt={edge.node.altText || `Product Image ${idx}`} 
                  className="w-full h-full object-cover" 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Sticky Product Info (5 cols) */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-28 flex flex-col">
            
            {/* Header Info */}
            <h1 className="font-serif text-3xl lg:text-4xl text-zonura-navy leading-tight mb-2">
              {product.title}
            </h1>
            
            <p className="font-sans text-sm tracking-[0.2em] text-zonura-gold uppercase font-bold mb-4">
              ZONURA Exclusive
            </p>

            {/* Ratings & Reviews block */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1 border border-zonura-navy/20 px-2 py-1 rounded-sm bg-white">
                <span className="font-sans text-sm font-bold text-zonura-navy">4.8</span>
                <svg className="w-4 h-4 text-green-700" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              </div>
              <span className="font-sans text-sm text-zonura-navy/60">
                | 428 Ratings
              </span>
            </div>

            <div className="h-[1px] w-full bg-zonura-navy/10 mb-6"></div>

            {/* Price Block */}
            <div className="flex items-end gap-3 mb-2">
              <span className="font-serif text-3xl font-bold text-zonura-navy">
                ₹{priceINR.toLocaleString("en-IN")}
              </span>
              <span className="font-sans text-sm text-zonura-navy/50 line-through mb-1">
                ₹{(priceINR * 1.2).toLocaleString("en-IN")}
              </span>
              <span className="font-sans text-sm font-bold text-orange-500 mb-1">
                (20% OFF)
              </span>
            </div>
            <p className="font-sans text-xs text-green-700 font-bold mb-6">inclusive of all taxes</p>

            {/* Description HTML */}
            <div 
              className="font-sans text-sm text-zonura-navy/80 leading-relaxed font-light mb-2 prose prose-p:mb-4 max-w-none"
              dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
            />

            {/* Buy Box Actions (Refactored to Myntra style transparent actions) */}
            <Suspense fallback={<div className="h-40 bg-zonura-navy/5 animate-pulse rounded-premium mt-8" />}>
              <BuyBox 
                product={{
                  id: product.id,
                  variantId: primaryVariant.id,
                  handle: product.handle,
                  title: product.title,
                  price: priceUSD,
                  image: product.images.edges[0]?.node?.url || "",
                  totalInventory: product.totalInventory || 0
                }}
              />
            </Suspense>

            {/* Product Details Accordion */}
            <ProductTabs 
              ritual={ritual}
              ingredients={ingredients}
              science={science}
            />
            
          </div>
        </div>

      </div>
    </div>
  );
}
