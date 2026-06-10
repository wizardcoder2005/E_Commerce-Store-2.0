"use client";

import React from "react";
import { useCart } from "@/context/CartContext";

interface BuyBoxProps {
  product: {
    id: string;
    variantId: string;
    handle: string;
    title: string;
    price: number;
    image: string;
    totalInventory: number;
  };
}

export function BuyBox({ product }: BuyBoxProps) {
  const { addToCart } = useCart();
  
  const priceUSD = product.price;
  const priceINR = Math.round(priceUSD * 83.5); // Approximation for INR

  const handleAddToCart = () => {
    addToCart({
      variantId: product.variantId,
      handle: product.handle,
      title: product.title,
      price: priceUSD,
      quantity: 1,
      imageUrl: product.image,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    
    const options = {
      key: "rzp_test_xxxxxx", 
      amount: priceINR * 100, 
      currency: "INR",
      name: "ZONURA Wellness",
      description: `Purchase ${product.title}`,
      image: "/icon.png", 
      handler: function (response: any) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: "Aura Seeker",
        email: "seeker@zonura.com",
        contact: "9999999999"
      },
      theme: {
        color: "#0E1E2E" 
      }
    };

    if (typeof window !== "undefined" && (window as any).Razorpay) {
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } else {
      console.error("Razorpay SDK not loaded");
      alert("Payment gateway is currently initializing. Please try again in a moment.");
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-8">
      {/* Actions */}
      <div className="flex items-center gap-4">
        <button 
          onClick={handleAddToCart}
          disabled={product.totalInventory <= 0}
          className="flex-1 py-4 flex items-center justify-center gap-2 rounded-premium bg-zonura-navy text-zonura-sand font-bold font-sans text-sm tracking-wide hover:bg-zonura-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          ADD TO BAG
        </button>
        
        <button 
          className="flex-1 py-4 flex items-center justify-center gap-2 rounded-premium border-2 border-zonura-navy/10 text-zonura-navy font-bold font-sans text-sm tracking-wide hover:border-zonura-navy transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          WISHLIST
        </button>
      </div>

      <div className="flex flex-col gap-3 pt-2">
        <button 
          onClick={handleBuyNow}
          disabled={product.totalInventory <= 0}
          className="w-full py-4 rounded-premium bg-zonura-gold text-zonura-navy font-bold font-sans tracking-wide hover:bg-[#b5952f] transition-colors shadow-md shadow-zonura-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          BUY NOW WITH RAZORPAY
        </button>
      </div>

      {/* Security Info */}
      <div className="flex items-center gap-4 text-xs text-zonura-navy/60 font-sans mt-2">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          Secure Checkout
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          100% Genuine
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" /></svg>
          Easy Returns
        </div>
      </div>
    </div>
  );
}
