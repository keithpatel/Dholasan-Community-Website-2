import React from 'react';
import { Link } from 'react-router-dom';
import { QuickLinksBlockProps, BlockStyleConfig } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

const IconMap: Record<string, React.FC<{ className?: string }>> = {
  info: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  calendar: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  newspaper: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6M7 8h6" />
    </svg>
  ),
  camera: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  building: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  users: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  phone: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  heart: (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
};

interface Props {
  props: QuickLinksBlockProps;
  style?: BlockStyleConfig;
}

export const QuickLinksBlock: React.FC<Props> = ({ props }) => {
  const { t } = useLanguage();

  return (
    <div>
      {(props.title || props.subtitle) && (
        <div className="text-center max-w-3xl mx-auto mb-8">
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {props.items.map((item) => {
          const IconComponent = (item.iconName && IconMap[item.iconName]) || IconMap.info;
          return (
            <Link
              key={item.id}
              to={item.to}
              className="group block p-5 bg-white dark:bg-slate-800/90 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-center relative overflow-hidden"
            >
              <div
                className={`flex items-center justify-center h-14 w-14 rounded-2xl ${
                  item.color || 'bg-orange-50 dark:bg-slate-700 text-brand-orange'
                } mx-auto group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-amber-600 group-hover:text-white transition-all duration-300 shadow-xs`}
              >
                <IconComponent className="h-7 w-7 transition-colors duration-300" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-slate-100 font-display group-hover:text-brand-orange transition-colors">
                {t(item.title)}
              </h3>
              {item.subtitle && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  {t(item.subtitle)}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickLinksBlock;
