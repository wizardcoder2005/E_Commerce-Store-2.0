import { getCollectionProducts } from "@/lib/shopify";
import Link from "next/link";

export default async function Home() {
  const products = await getCollectionProducts("frontpage").catch(() => []);

  // Mock Categories for Fashion Pivot
  const categories = [
    { name: "Serums", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300&auto=format&fit=crop" },
    { name: "Oils", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=300&auto=format&fit=crop" },
    { name: "Cleansers", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=300&auto=format&fit=crop" },
    { name: "Masks", image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=300&auto=format&fit=crop" },
    { name: "Tools", image: "https://images.unsplash.com/photo-1615397323281-197282717088?q=80&w=300&auto=format&fit=crop" },
    { name: "Sets", image: "https://images.unsplash.com/photo-1556228720-192b186eb8c4?q=80&w=300&auto=format&fit=crop" },
  ];

  return (
    <div className="w-full flex flex-col pb-24">
      
      {/* Hero Banner (Myntra/Flipkart Style) */}
      <div className="w-full h-[400px] md:h-[500px] bg-zonura-navy text-zonura-sand relative flex items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://images.unsplash.com/photo-1611077544760-496ac7257e5d?q=80&w=2000&auto=format&fit=crop" 
          alt="Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="relative z-10 text-center px-4">
          <h2 className="font-sans text-xs tracking-[0.3em] uppercase mb-4 text-zonura-gold">New Arrivals</h2>
          <h1 className="font-serif text-5xl md:text-7xl mb-6">The Aura Collection</h1>
          <Link href="/collections/all" className="inline-block px-8 py-3 bg-zonura-gold text-zonura-navy font-bold font-sans rounded-full hover:bg-white transition-colors">
            Shop Now
          </Link>
        </div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8">
        
        {/* Circular Categories Row */}
        <div className="py-12 flex items-center gap-8 overflow-x-auto hide-scrollbar">
          {categories.map((cat, idx) => (
            <Link key={idx} href={`/collections/${cat.name.toLowerCase()}`} className="flex flex-col items-center gap-3 shrink-0 group">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-zonura-gold transition-colors shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <span className="font-sans text-sm font-bold text-zonura-navy group-hover:text-zonura-gold transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>

        {/* Product Grid */}
        <div className="mt-8 mb-12 flex justify-between items-end">
          <h2 className="font-serif text-3xl md:text-4xl text-zonura-navy">Trending Now</h2>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map((product) => {
              const minPrice = product.priceRange?.minVariantPrice;
              const priceString = minPrice ? `$${parseFloat(minPrice.amount).toFixed(2)}` : "Price Unavailable";

              return (
                <Link key={product.id} href={`/products/${product.handle}`} className="group flex flex-col gap-3">
                  <div className="relative aspect-[3/4] w-full bg-white shadow-sm transition-colors">
                    {product.images?.edges[0]?.node && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img 
                        src={product.images.edges[0].node.url} 
                        alt={product.images.edges[0].node.altText || product.title}
                        className="object-cover w-full h-full group-hover:opacity-90 transition-opacity"
                      />
                    )}
                  </div>
                  
                  <div className="flex flex-col px-1">
                    <h3 className="font-sans font-bold text-sm text-zonura-navy truncate">
                      ZONURA
                    </h3>
                    <p className="font-sans text-xs text-zonura-navy/60 truncate mt-0.5">
                      {product.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="font-sans text-sm font-bold text-zonura-navy">
                        {priceString}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center font-sans text-zonura-navy/60">
            <p>No products found in the active collection.</p>
          </div>
        )}
      </div>
    </div>
  );
}
