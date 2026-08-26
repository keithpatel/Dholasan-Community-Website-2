import React from 'react';
import { FeaturesBlockProps, BlockStyleConfig } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  props: FeaturesBlockProps;
  style?: BlockStyleConfig;
}

export const FeaturesBlock: React.FC<Props> = ({ props }) => {
  const { t } = useLanguage();
  const cols = props.columns || 3;
  const colClass =
    cols === 2
      ? 'md:grid-cols-2'
      : cols === 4
      ? 'sm:grid-cols-2 lg:grid-cols-4'
      : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div>
      {(props.title || props.subtitle) && (
        <div className="text-center max-w-3xl mx-auto mb-10">
          {props.title && (
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
              {t(props.title)}
            </h2>
          )}
          {props.subtitle && (
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {t(props.subtitle)}
            </p>
          )}
        </div>
      )}

      <div className={`grid ${colClass} gap-6`}>
        {props.features.map((feature, idx) => (
          <div
            key={feature.id || idx}
            className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-brand-orange flex items-center justify-center font-bold text-lg mb-4">
              {idx + 1}
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-2">
              {t(feature.title)}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {t(feature.description)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesBlock;
