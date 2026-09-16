"use client";

import React from 'react';
import { BoardItem } from '../../../lib/api';

interface TemplateCardProps {
  template: BoardItem;
  onSelect: (template: BoardItem) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => {
  // Determine gradient background based on template coverColor or fallback
  const gradientClass = template.coverColor || 'from-zinc-800 via-zinc-900 to-black';

  return (
    <div
      onClick={() => onSelect(template)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-800 bg-[#18181b] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-zinc-500 hover:shadow-2xl hover:shadow-white/5"
    >
      {/* Cover Image / Gradient */}
      <div className="relative h-28 w-full overflow-hidden">
        {template.coverImage ? (
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${template.coverImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-transparent to-black/20" />
          </div>
        ) : (
          <div className={`h-full w-full bg-gradient-to-br ${gradientClass} transition-transform duration-500 group-hover:scale-105`}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-transparent to-transparent" />
          </div>
        )}

        {/* TEMPLATE Badge */}
        <span className="absolute bottom-2 right-2 rounded bg-zinc-900/90 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md backdrop-blur-md border border-zinc-700/60">
          TEMPLATE
        </span>
      </div>

      {/* Title & Info */}
      <div className="flex flex-1 flex-col justify-between p-3.5">
        <div>
          <h3 className="font-semibold text-sm text-white group-hover:text-zinc-200 transition-colors line-clamp-1">
            {template.name}
          </h3>
          <p className="mt-1 text-xs text-zinc-400 line-clamp-1">
            {template.category || 'General Template'}
          </p>
        </div>

        {template.lists && (
          <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
            <span>📋 {template.lists.length} lists</span>
            <span>•</span>
            <span>{template.lists.reduce((acc, l) => acc + (l.cards?.length || 0), 0)} cards</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateCard;
