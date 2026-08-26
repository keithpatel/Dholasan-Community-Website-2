import React from 'react';
import { Link } from 'react-router-dom';
import { HeroBlockProps, BlockStyleConfig } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import LiveEventBanner from '../LiveEventBanner';

interface Props {
  props: HeroBlockProps;
  style?: BlockStyleConfig;
}

export const HeroBlock: React.FC<Props> = ({ props }) => {
  const { t } = useLanguage();

  return (
    <div className="relative">
      {props.showLiveBanner !== false && <LiveEventBanner />}
      <section
        className="relative bg-cover bg-center min-h-[480px] md:min-h-[560px] flex items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: `url('${props.imageUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1600&q=80'}')`,
        }}
      >
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
        <div className="absolute inset-0 bg-radial from-transparent via-slate-950/30 to-slate-950/80" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-16">
          {props.tagline && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/20 border border-orange-500/40 backdrop-blur-md rounded-full shadow-lg mb-5 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-widest text-orange-200 font-display">
                {t(props.tagline)}
              </span>
            </div>
          )}

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.15] font-display text-white drop-shadow-md">
            {t(props.title)}
          </h1>

          <p className="mt-4 sm:mt-5 text-base sm:text-xl md:text-2xl text-slate-200 max-w-2xl mx-auto drop-shadow leading-relaxed font-normal">
            {t(props.subtitle)}
          </p>

          {(props.primaryCtaText || props.secondaryCtaText) && (
            <div className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-4">
              {props.primaryCtaText && (
                <Link
                  to={props.primaryCtaLink || '/about'}
                  className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold py-3.5 px-8 rounded-2xl transition-all hover:scale-105 shadow-xl shadow-orange-500/30 font-display tracking-wide text-sm sm:text-base"
                >
                  {t(props.primaryCtaText)}
                </Link>
              )}
              {props.secondaryCtaText && (
                <Link
                  to={props.secondaryCtaLink || '/community'}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 px-8 rounded-2xl backdrop-blur-md border border-white/30 transition-all hover:scale-105 font-display text-sm sm:text-base"
                >
                  {t(props.secondaryCtaText)}
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HeroBlock;
