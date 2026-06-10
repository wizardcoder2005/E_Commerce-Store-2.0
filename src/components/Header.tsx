"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

export function Header() {
  const { itemCount, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [logoError, setLogoError] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="w-full bg-white z-50 shadow-sm sticky top-0 border-b border-zonura-navy/5">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-6 lg:gap-12">
        
        {/* Left: Logo & Core Navigation */}
        <div className="flex items-center gap-10 shrink-0">
          <Link href="/" className="flex items-center">
            {!logoError ? (
              <img 
                src="/logo.png" 
                alt="ZONURA" 
                className="h-10 object-contain"
                onError={() => setLogoError(true)} 
              />
            ) : (
              <span className="font-serif text-3xl font-bold text-zonura-navy tracking-wide">
                ZONURA
              </span>
            )}
          </Link>
          
          <nav className="hidden xl:flex items-center gap-8 font-sans font-bold text-sm text-zonura-navy tracking-wide">
            <Link href="/collections/men" className="hover:text-zonura-gold transition-colors uppercase border-b-2 border-transparent hover:border-zonura-gold pb-1">Men</Link>
            <Link href="/collections/women" className="hover:text-zonura-gold transition-colors uppercase border-b-2 border-transparent hover:border-zonura-gold pb-1">Women</Link>
            <Link href="/collections/wellness" className="hover:text-zonura-gold transition-colors uppercase border-b-2 border-transparent hover:border-zonura-gold pb-1">Wellness</Link>
            <Link href="/collections/aura" className="hover:text-zonura-gold transition-colors uppercase border-b-2 border-transparent hover:border-zonura-gold pb-1">Aura</Link>
          </nav>
        </div>

        {/* Middle: Pill Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden md:flex items-center bg-zonura-sand/50 rounded-full px-4 border border-zonura-navy/10 focus-within:border-zonura-gold transition-colors focus-within:bg-white">
          <button type="submit" className="text-zonura-navy/50 hover:text-zonura-gold pr-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
          <input 
            type="text" 
            placeholder="Search for products, brands and more"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 bg-transparent outline-none font-sans text-zonura-navy text-sm placeholder:text-zonura-navy/40"
          />
        </form>

        {/* Right: Icon Triad (Profile, Wishlist, Bag) */}
        <div className="flex items-center gap-6 lg:gap-8 text-zonura-navy shrink-0">
          
          {/* Profile */}
          <div className="flex flex-col items-center justify-center cursor-pointer hover:text-zonura-gold transition-colors group">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span className="font-sans text-[11px] font-bold tracking-tight">Profile</span>
          </div>

          {/* Wishlist */}
          <div className="flex flex-col items-center justify-center cursor-pointer hover:text-zonura-gold transition-colors group">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            <span className="font-sans text-[11px] font-bold tracking-tight">Wishlist</span>
          </div>

          {/* Bag (Cart) */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center justify-center cursor-pointer hover:text-zonura-gold transition-colors group relative"
          >
            <div className="relative">
              <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <span className="absolute -top-1 -right-2 bg-zonura-gold text-white text-[10px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center border-2 border-white">
                {itemCount}
              </span>
            </div>
            <span className="font-sans text-[11px] font-bold tracking-tight">Bag</span>
          </button>

        </div>
      </div>
    </header>
  );
}
