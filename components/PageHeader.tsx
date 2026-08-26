import React from 'react';

interface PageHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ badge, title, subtitle, children }) => {
  return (
    <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-16 md:py-20 px-4 text-center overflow-hidden border-b border-slate-800/80">
      {/* Decorative ambient gradient blooms */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-gradient-to-b from-orange-500/20 via-amber-500/10 to-transparent blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Hairline Glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {badge && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 backdrop-blur-md mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"></span>
            <span className="text-[11px] md:text-xs font-extrabold uppercase tracking-widest text-orange-300 font-display">
              {badge}
            </span>
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display leading-[1.15] drop-shadow-sm">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-4 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            {subtitle}
          </p>
        )}

        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
