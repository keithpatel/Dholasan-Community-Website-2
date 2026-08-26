import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';

const LiveEventBanner: React.FC = () => {
  const { t, language } = useLanguage();
  const { siteSettings } = useContent();
  const live = siteSettings.liveEvent;

  if (!live || !live.isLive) return null;

  const url = live.url?.trim();
  if (!url) return null;

  const name = (live.name && live.name.en) || live.name?.gu || '';
  const platform = live.platform?.trim() || 'Live Stream';

  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-lg border-b border-red-500/40 relative overflow-hidden">
      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250px_250px] animate-[pulse_4s_ease-in-out_infinite] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3.5 min-w-0">
          <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs flex-shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>{language === 'gu' ? 'લાઇવ પ્રસારણ' : 'LIVE NOW'}</span>
          </span>
          <div className="min-w-0">
            {name && (
              <h2 className="text-white font-bold text-sm sm:text-base leading-snug truncate drop-shadow-xs">
                {t(live.name)}
              </h2>
            )}
            <p className="text-white/85 text-xs flex items-center gap-1">
              <span>📡</span>
              <span>{platform}</span>
            </p>
          </div>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white hover:bg-white/95 text-red-700 font-extrabold text-xs px-5 py-2 rounded-full transition-all shadow-md hover:scale-105 flex-shrink-0 font-display uppercase tracking-wider"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>{language === 'gu' ? 'અત્યારે જુઓ' : 'Watch Broadcast'}</span>
        </a>
      </div>
    </div>
  );
};

export default LiveEventBanner;
