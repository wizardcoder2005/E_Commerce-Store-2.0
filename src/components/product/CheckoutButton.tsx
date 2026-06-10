"use client";

import React from "react";

export const CheckoutButton = ({ price, productId }: { price: string; productId: string }) => {
  return (
    <button 
      className="w-full sm:w-auto px-12 py-4 bg-navy text-sand font-sans uppercase tracking-widest text-sm hover:bg-gold transition-all duration-500 ease-out flex items-center justify-center gap-4"
      onClick={() => {
        // Razorpay Integration Hook Area
        console.log(`Initiating Razorpay checkout for ${productId} at $${price}`);
        // 1. Fetch order ID from Next.js API route (/api/razorpay)
        // 2. Initialize Razorpay options (key, amount, currency, order_id)
        // 3. Open Razorpay instance: const rzp = new window.Razorpay(options); rzp.open();
        alert(`Initiating purchase for $${price}`);
      }}
    >
      <span>Purchase</span>
      <span className="h-4 w-[1px] bg-sand/30 block"></span>
      <span>${price}</span>
    </button>
  );
};
