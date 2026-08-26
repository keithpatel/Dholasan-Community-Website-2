import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import GalleryLightbox from '../components/GalleryLightbox';
import PageHeader from '../components/PageHeader';

type CategoryFilter = string | 'All';

const GalleryPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { galleryImages, siteSettings, getLabel } = useContent();
  const [filter, setFilter] = useState<CategoryFilter>('All');

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const categories = siteSettings.galleryCategories || [];
  const categoryFilterIds: CategoryFilter[] = ['All', ...categories.map((c) => c.id)];

  const filteredImages =
    filter === 'All'
      ? galleryImages
      : galleryImages.filter((img) => img.category === filter);

  const categoryLabel: Record<string, string> = {};
  categories.forEach((c) => {
    categoryLabel[c.id] = t(c.label);
  });

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handlePrev = () => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredImages.length - 1));
  };

  const handleNext = () => {
    setLightboxIndex((prev) => (prev < filteredImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Consistent Page Header */}
      <PageHeader
        badge={language === 'gu' ? 'ધોળાસણ ફોટો સંગ્રહ' : 'Visual Village Gallery'}
        title={getLabel('gallery.title')}
        subtitle={getLabel('gallery.intro')}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Buttons */}
        <div className="flex justify-center flex-wrap gap-2.5 mb-12">
          {categoryFilterIds.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all font-display ${
                filter === cat
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/25 scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700'
              }`}
            >
              {cat === 'All' ? getLabel('gallery.all') : categoryLabel[cat] || cat}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              onClick={() => handleOpenLightbox(index)}
              className="group relative overflow-hidden rounded-3xl shadow-sm cursor-pointer aspect-[4/3] bg-slate-200 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={image.src}
                alt={t(image.alt)}
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5">
                <div className="flex justify-end">
                  <span className="bg-slate-950/70 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 font-display">
                    🔍 {language === 'gu' ? 'મોટો જુઓ' : 'View'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-orange-300 uppercase tracking-widest font-display">
                    {image.category}
                  </span>
                  <p className="text-white text-sm font-bold drop-shadow-md line-clamp-2 mt-0.5 font-display">
                    {t(image.alt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400">
            <p className="text-4xl mb-3">📷</p>
            <p className="font-bold font-display text-lg">
              {language === 'gu' ? 'આ કેટેગરીમાં કોઈ ફોટા નથી' : 'No photos found in this category'}
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <GalleryLightbox
        images={filteredImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
};

export default GalleryPage;