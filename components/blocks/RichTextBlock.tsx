import React from 'react';
import { Link } from 'react-router-dom';
import { RichTextBlockProps, BlockStyleConfig } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  props: RichTextBlockProps;
  style?: BlockStyleConfig;
}

export const RichTextBlock: React.FC<Props> = ({ props, style }) => {
  const { t } = useLanguage();
  const hasImage = Boolean(props.imageUrl);
  const isImageLeft = props.imagePosition === 'left';
  const isImageTop = props.imagePosition === 'top';

  return (
    <div>
      {isImageTop && hasImage && (
        <div className="mb-8 rounded-3xl overflow-hidden shadow-lg max-h-[420px]">
          <img
            src={props.imageUrl}
            alt={t(props.title)}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className={`grid ${hasImage && !isImageTop ? 'lg:grid-cols-2 gap-10 items-center' : 'grid-cols-1'}`}>
        {hasImage && isImageLeft && !isImageTop && (
          <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-700/80">
            <img
              src={props.imageUrl}
              alt={t(props.title)}
              className="w-full h-[360px] object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}

        <div className="space-y-5">
          {props.subtitle && (
            <div className="text-xs font-extrabold uppercase tracking-widest text-brand-orange font-display">
              {t(props.subtitle)}
            </div>
          )}

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-display leading-tight">
            {t(props.title)}
          </h2>

          <div className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed whitespace-pre-line font-normal">
            {t(props.content)}
          </div>

          {props.buttonText && props.buttonLink && (
            <div className="pt-3">
              {props.buttonLink.startsWith('#') ? (
                <a
                  href={props.buttonLink}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-2xl shadow-md transition-all hover:scale-105 font-display text-sm"
                >
                  {t(props.buttonText)}
                </a>
              ) : (
                <Link
                  to={props.buttonLink}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-2xl shadow-md transition-all hover:scale-105 font-display text-sm"
                >
                  {t(props.buttonText)}
                </Link>
              )}
            </div>
          )}
        </div>

        {hasImage && !isImageLeft && !isImageTop && (
          <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-700/80">
            <img
              src={props.imageUrl}
              alt={t(props.title)}
              className="w-full h-[360px] object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextBlock;
