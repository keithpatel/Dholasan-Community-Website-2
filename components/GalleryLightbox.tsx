import React, { useEffect } from 'react';
import { GalleryImage } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface GalleryLightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext,
}) => {
  const { t, language } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];
  const imageTitle = t(currentImage.alt);

  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = encodeURIComponent(
      `📸 ${imageTitle} - Dholasan Village Community Website\nCheck it out here: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        className="flex items-center justify-between text-white z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-semibold tracking-wider">
            {currentIndex + 1} / {images.length}
          </span>
          <span className="text-sm font-medium text-gray-300 hidden sm:inline-block">
            {currentImage.category}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg transition-colors"
            title="Share on WhatsApp"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>{language === 'gu' ? 'શેર કરો' : 'Share'}</span>
          </button>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            title="Close (Esc)"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Preview Area */}
      <div
        className="flex-1 flex items-center justify-between gap-4 py-4 max-w-6xl w-full mx-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prev Button */}
        <button
          onClick={onPrev}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white text-xl transition-transform hover:scale-110 flex-shrink-0 z-10"
          title="Previous (Arrow Left)"
        >
          &#10094;
        </button>

        {/* Center Image */}
        <div className="flex-1 flex items-center justify-center max-h-[75vh] relative">
          <img
            src={currentImage.src}
            alt={imageTitle}
            className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl transition-all duration-300"
          />
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white text-xl transition-transform hover:scale-110 flex-shrink-0 z-10"
          title="Next (Arrow Right)"
        >
          &#10095;
        </button>
      </div>

      {/* Bottom Caption */}
      <div
        className="text-center text-white z-10 max-w-2xl mx-auto pb-2"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-lg font-semibold tracking-wide drop-shadow-md">
          {imageTitle}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {language === 'gu'
            ? 'કીબોર્ડ એરો કી (←/→) અથવા સ્વાઇપ દ્વારા આગળ/પાછળ જુઓ'
            : 'Use arrow keys (←/→) to navigate photos'}
        </p>
      </div>
    </div>
  );
};

export default GalleryLightbox;
