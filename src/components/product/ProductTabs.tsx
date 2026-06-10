"use client";

import React, { useState } from "react";

interface ProductAccordionProps {
  ritual: string;
  ingredients: string;
  science: string;
}

export function ProductTabs({ ritual, ingredients, science }: ProductAccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>("ritual");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const sections = [
    { id: "ritual", title: "The Ritual", content: ritual },
    { id: "ingredients", title: "The Sourcing", content: ingredients },
    { id: "science", title: "The Science", content: science },
  ];

  return (
    <div className="mt-8 border-t border-zonura-navy/10">
      {sections.map((section) => (
        <div key={section.id} className="border-b border-zonura-navy/10">
          <button 
            onClick={() => toggleSection(section.id)}
            className="w-full py-5 flex items-center justify-between group"
          >
            <span className={`font-sans tracking-widest text-sm uppercase transition-colors ${openSection === section.id ? "text-zonura-gold font-bold" : "text-zonura-navy/80 group-hover:text-zonura-navy"}`}>
              {section.title}
            </span>
            <svg 
              className={`w-5 h-5 text-zonura-navy/50 transition-transform duration-300 ${openSection === section.id ? "rotate-180" : ""}`} 
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ${openSection === section.id ? "max-h-[500px] pb-6 opacity-100" : "max-h-0 opacity-0"}`}>
            <p className="font-sans text-zonura-navy/80 leading-relaxed font-light text-sm">
              {section.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
