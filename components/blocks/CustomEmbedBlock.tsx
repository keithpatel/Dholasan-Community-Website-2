import React from 'react';
import { CustomEmbedBlockProps, BlockStyleConfig } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  props: CustomEmbedBlockProps;
  style?: BlockStyleConfig;
}

export const CustomEmbedBlock: React.FC<Props> = ({ props }) => {
  const { t } = useLanguage();
  const height = props.height || 400;

  return (
    <div>
      {props.title && (
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
            {t(props.title)}
          </h2>
        </div>
      )}

      <div className="rounded-3xl overflow-hidden shadow-md border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900">
        {props.embedType === 'youtube' ? (
          <iframe
            src={props.codeOrUrl}
            title={props.title ? t(props.title) : 'Embedded Video'}
            className="w-full"
            style={{ height: `${height}px` }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <iframe
            src={props.codeOrUrl}
            title={props.title ? t(props.title) : 'Custom Embed'}
            className="w-full border-0"
            style={{ height: `${height}px` }}
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
};

export default CustomEmbedBlock;
