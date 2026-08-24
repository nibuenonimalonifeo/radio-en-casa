'use client';

import React from 'react';

interface ProjectCardProps {
  title: string;
  category: string;
  year: string;
  colSpan?: string;
  aspectRatio?: string;
}

export default function ProjectCard({
  title,
  category,
  year,
  colSpan = 'md:col-span-6',
  aspectRatio = 'aspect-[16/10]',
}: ProjectCardProps) {
  return (
    // Atributo data-cursor activa el texto en el puntero flotante
    <div className={`group cursor-pointer ${colSpan}`} data-cursor="Ver">
      <div className={`overflow-hidden bg-neutral-900 rounded-lg relative ${aspectRatio} mb-5`}>
        <div className="w-full h-full bg-neutral-800 transition-transform duration-700 ease-out group-hover:scale-105 relative flex items-center justify-center">
          <span className="text-neutral-600 text-sm tracking-widest uppercase">
            [ Proyecto: {title} ]
          </span>
        </div>
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      <div className="flex justify-between items-baseline border-b border-neutral-800 pb-4">
        <div>
          <h3 className="text-xl md:text-2xl font-medium tracking-tight text-[#ececec] group-hover:text-white transition-colors">
            {title}
          </h3>
          <p className="text-sm text-neutral-500 mt-1">{category}</p>
        </div>
        <span className="text-sm text-neutral-500 font-mono">{year}</span>
      </div>
    </div>
  );
}