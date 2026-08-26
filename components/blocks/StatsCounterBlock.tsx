import React from 'react';
import { StatsBlockProps, BlockStyleConfig } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  props: StatsBlockProps;
  style?: BlockStyleConfig;
}

export const StatsCounterBlock: React.FC<Props> = ({ props }) => {
  const { t } = useLanguage();

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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {props.items.map((item) => (
          <div
            key={item.id}
            className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-lg transition-all text-center"
          >
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-orange font-display">
              {item.number}
              {item.suffix && <span className="text-2xl text-slate-500 font-bold">{item.suffix}</span>}
            </div>
            <h3 className="mt-3 text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 font-display">
              {t(item.label)}
            </h3>
            {item.sublabel && (
              <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {t(item.sublabel)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsCounterBlock;
