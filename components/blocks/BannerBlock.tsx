import React from 'react';
import { Link } from 'react-router-dom';
import { BannerBlockProps, BlockStyleConfig } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  props: BannerBlockProps;
  style?: BlockStyleConfig;
}

const variantStyles: Record<string, { bg: string; border: string; badge: string; text: string; button: string }> = {
  orange: {
    bg: 'bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-orange-500/5 dark:from-orange-950/40 dark:via-amber-950/20 dark:to-orange-950/10',
    border: 'border-orange-300 dark:border-orange-500/30',
    badge: 'bg-orange-500 text-white',
    text: 'text-orange-950 dark:text-orange-100',
    button: 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20',
  },
  blue: {
    bg: 'bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-blue-500/5 dark:from-blue-950/40 dark:via-indigo-950/20 dark:to-blue-950/10',
    border: 'border-blue-300 dark:border-blue-500/30',
    badge: 'bg-blue-600 text-white',
    text: 'text-blue-950 dark:text-blue-100',
    button: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20',
  },
  green: {
    bg: 'bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/5 dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-emerald-950/10',
    border: 'border-emerald-300 dark:border-emerald-500/30',
    badge: 'bg-emerald-600 text-white',
    text: 'text-emerald-950 dark:text-emerald-100',
    button: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
  },
  red: {
    bg: 'bg-gradient-to-r from-red-500/15 via-rose-500/10 to-red-500/5 dark:from-red-950/40 dark:via-rose-950/20 dark:to-red-950/10',
    border: 'border-red-300 dark:border-red-500/30',
    badge: 'bg-red-600 text-white',
    text: 'text-red-950 dark:text-red-100',
    button: 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20',
  },
  amber: {
    bg: 'bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/5 dark:from-amber-950/40 dark:via-yellow-950/20 dark:to-amber-950/10',
    border: 'border-amber-300 dark:border-amber-500/30',
    badge: 'bg-amber-600 text-white',
    text: 'text-amber-950 dark:text-amber-100',
    button: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20',
  },
};

export const BannerBlock: React.FC<Props> = ({ props }) => {
  const { t } = useLanguage();
  const theme = variantStyles[props.variant || 'orange'] || variantStyles.orange;

  return (
    <div className={`rounded-3xl p-6 sm:p-8 border ${theme.bg} ${theme.border} transition-all`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          {props.badge && (
            <span className={`inline-block px-3 py-1 text-xs font-black rounded-full uppercase tracking-wider ${theme.badge}`}>
              {t(props.badge)}
            </span>
          )}
          <h3 className={`text-xl sm:text-2xl font-black font-display ${theme.text}`}>
            {t(props.title)}
          </h3>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {t(props.message)}
          </p>
        </div>

        {props.linkText && props.linkUrl && (
          <div className="flex-shrink-0">
            <Link
              to={props.linkUrl}
              className={`inline-flex items-center gap-2 font-bold py-3 px-6 rounded-2xl shadow-md transition-all hover:scale-105 font-display text-sm ${theme.button}`}
            >
              {t(props.linkText)}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerBlock;
