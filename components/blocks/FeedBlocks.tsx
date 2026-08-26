import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FeedBlockProps, BlockStyleConfig } from '../../types';
import { useContent } from '../../context/ContentContext';
import { useLanguage } from '../../context/LanguageContext';
import GalleryLightbox from '../GalleryLightbox';

interface BlockWrapperProps {
  title?: any;
  subtitle?: any;
  viewAllLink?: string;
  viewAllText?: any;
  defaultTitle: string;
  defaultViewAll: string;
  children: React.ReactNode;
}

const FeedHeader: React.FC<BlockWrapperProps> = ({
  title,
  subtitle,
  viewAllLink,
  viewAllText,
  defaultTitle,
  defaultViewAll,
  children,
}) => {
  const { t } = useLanguage();

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
            {title ? t(title) : defaultTitle}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {t(subtitle)}
            </p>
          )}
        </div>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange hover:text-orange-600 transition-colors self-start md:self-auto font-display"
          >
            {viewAllText ? t(viewAllText) : defaultViewAll}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
      {children}
    </div>
  );
};

export const NewsFeedBlock: React.FC<{ props: FeedBlockProps; style?: BlockStyleConfig }> = ({ props }) => {
  const { newsArticles } = useContent();
  const { t } = useLanguage();
  const limit = props.limit || 3;
  const items = newsArticles.slice(0, limit);

  return (
    <FeedHeader
      title={props.title}
      subtitle={props.subtitle}
      viewAllLink={props.viewAllLink || '/about'}
      viewAllText={props.viewAllText}
      defaultTitle="Latest News & Highlights"
      defaultViewAll="View All News"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((article) => (
          <div
            key={article.id}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-bold text-brand-orange font-display mb-2">{article.date}</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-3 line-clamp-2">
                {t(article.title)}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3 font-normal">
                {t(article.summary)}
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>Dholasan Media</span>
              <span className="text-brand-orange font-semibold">Verified</span>
            </div>
          </div>
        ))}
      </div>
    </FeedHeader>
  );
};

export const EventsFeedBlock: React.FC<{ props: FeedBlockProps; style?: BlockStyleConfig }> = ({ props }) => {
  const { events } = useContent();
  const { t } = useLanguage();
  const limit = props.limit || 3;
  const items = events.slice(0, limit);

  return (
    <FeedHeader
      title={props.title}
      subtitle={props.subtitle}
      viewAllLink={props.viewAllLink || '/events'}
      viewAllText={props.viewAllText}
      defaultTitle="Upcoming Events & Gatherings"
      defaultViewAll="View All Events"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((event) => (
          <div
            key={event.id}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 dark:bg-orange-950/40 text-brand-orange text-xs font-black rounded-full mb-3">
                <span>📅 {t(event.date)}</span>
                {event.time && <span>• {event.time}</span>}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-2">
                {t(event.name)}
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1">
                📍 {t(event.location)}
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3 font-normal">
                {t(event.description)}
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60">
              <Link
                to="/events"
                className="text-xs font-bold text-brand-orange hover:text-orange-600 transition-colors inline-flex items-center gap-1"
              >
                Event Details & Reminders &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </FeedHeader>
  );
};

export const NoticesFeedBlock: React.FC<{ props: FeedBlockProps; style?: BlockStyleConfig }> = ({ props }) => {
  const { communityNotices, likeNotice } = useContent();
  const { t } = useLanguage();
  const limit = props.limit || 3;
  const items = communityNotices.slice(0, limit);

  return (
    <FeedHeader
      title={props.title}
      subtitle={props.subtitle}
      viewAllLink={props.viewAllLink || '/community'}
      viewAllText={props.viewAllText}
      defaultTitle="Community Notice Board"
      defaultViewAll="Open Notice Board"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((notice) => (
          <div
            key={notice.id}
            className={`bg-white dark:bg-slate-800 rounded-3xl p-6 border shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between ${
              notice.pinned
                ? 'border-orange-400 dark:border-orange-500/60 ring-2 ring-orange-400/20'
                : 'border-slate-200/80 dark:border-slate-700/80'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 capitalize">
                  {notice.category}
                </span>
                {notice.pinned && (
                  <span className="text-xs font-black text-brand-orange uppercase tracking-wider">
                    📌 Pinned
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-display mb-2">
                {t(notice.title)}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3 font-normal">
                {t(notice.content)}
              </p>
            </div>
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>By {notice.author}</span>
              <button
                onClick={() => likeNotice(notice.id)}
                className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors font-bold"
              >
                ❤️ {notice.likes || 0}
              </button>
            </div>
          </div>
        ))}
      </div>
    </FeedHeader>
  );
};

export const ProjectsFeedBlock: React.FC<{ props: FeedBlockProps; style?: BlockStyleConfig }> = ({ props }) => {
  const { developmentProjects } = useContent();
  const { t } = useLanguage();
  const limit = props.limit || 3;
  const items = developmentProjects.slice(0, limit);

  return (
    <FeedHeader
      title={props.title}
      subtitle={props.subtitle}
      viewAllLink={props.viewAllLink || '/community'}
      viewAllText={props.viewAllText}
      defaultTitle="Village Vikas Projects"
      defaultViewAll="View All Projects"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((proj) => {
          const percent = Math.min(100, Math.round(((proj.raisedAmount || 0) / (proj.targetAmount || 1)) * 100));
          return (
            <div
              key={proj.id}
              className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              {proj.imageUrl && (
                <div className="h-44 w-full overflow-hidden">
                  <img
                    src={proj.imageUrl}
                    alt={t(proj.title)}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-brand-orange uppercase">{t(proj.category)}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 capitalize">
                      {proj.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-2">
                    {t(proj.title)}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-2 font-normal">
                    {t(proj.description)}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>₹{(proj.raisedAmount || 0).toLocaleString('en-IN')} raised</span>
                    <span>₹{(proj.targetAmount || 0).toLocaleString('en-IN')} goal</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-brand-orange h-2 rounded-full transition-all" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </FeedHeader>
  );
};

export const GalleryGridBlock: React.FC<{ props: FeedBlockProps; style?: BlockStyleConfig }> = ({ props }) => {
  const { galleryImages } = useContent();
  const { t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const limit = props.limit || 6;
  const items = galleryImages.slice(0, limit);

  return (
    <FeedHeader
      title={props.title}
      subtitle={props.subtitle}
      viewAllLink={props.viewAllLink || '/gallery'}
      viewAllText={props.viewAllText}
      defaultTitle="A Glimpse of Dholasan"
      defaultViewAll="View Full Gallery"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {items.map((img, idx) => (
          <div
            key={img.id}
            onClick={() => setSelectedIndex(idx)}
            className="group relative h-40 sm:h-48 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all"
          >
            <img
              src={img.src}
              alt={t(img.alt)}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
              <p className="text-white text-xs font-bold line-clamp-1">{t(img.alt)}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <GalleryLightbox
          images={items}
          currentIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNavigate={(newIdx) => setSelectedIndex(newIdx)}
        />
      )}
    </FeedHeader>
  );
};
