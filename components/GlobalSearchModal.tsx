import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResultItem {
  id: string;
  type: 'news' | 'event' | 'business' | 'notice' | 'landmark' | 'emergency';
  typeLabel: { en: string; gu: string };
  title: string;
  subtitle: string;
  path: string;
}

const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const {
    newsArticles,
    events,
    businesses,
    communityNotices,
    villageLandmarks,
    emergencyContacts,
  } = useContent();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Ctrl+K / Cmd+K / Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset query on close
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: SearchResultItem[] = [];

    // News
    newsArticles.forEach((n) => {
      const enTitle = n.title.en.toLowerCase();
      const guTitle = n.title.gu.toLowerCase();
      const enSum = n.summary.en.toLowerCase();
      const guSum = n.summary.gu.toLowerCase();
      if (enTitle.includes(q) || guTitle.includes(q) || enSum.includes(q) || guSum.includes(q)) {
        results.push({
          id: `news-${n.id}`,
          type: 'news',
          typeLabel: { en: 'News & Announcement', gu: 'સમાચાર' },
          title: t(n.title),
          subtitle: `${n.date} · ${t(n.summary)}`,
          path: '/community',
        });
      }
    });

    // Events
    events.forEach((ev) => {
      const enName = ev.name.en.toLowerCase();
      const guName = ev.name.gu.toLowerCase();
      const enDesc = ev.description.en.toLowerCase();
      const guDesc = ev.description.gu.toLowerCase();
      const enLoc = ev.location.en.toLowerCase();
      const guLoc = ev.location.gu.toLowerCase();
      if (
        enName.includes(q) ||
        guName.includes(q) ||
        enDesc.includes(q) ||
        guDesc.includes(q) ||
        enLoc.includes(q) ||
        guLoc.includes(q)
      ) {
        results.push({
          id: `event-${ev.id}`,
          type: 'event',
          typeLabel: { en: 'Event', gu: 'કાર્યક્રમ' },
          title: t(ev.name),
          subtitle: `${t(ev.date)} @ ${ev.time} · ${t(ev.location)}`,
          path: '/events',
        });
      }
    });

    // Community Notices
    communityNotices.forEach((not) => {
      const enTitle = not.title.en.toLowerCase();
      const guTitle = not.title.gu.toLowerCase();
      const enCont = not.content.en.toLowerCase();
      const guCont = not.content.gu.toLowerCase();
      const author = not.author.toLowerCase();
      if (
        enTitle.includes(q) ||
        guTitle.includes(q) ||
        enCont.includes(q) ||
        guCont.includes(q) ||
        author.includes(q)
      ) {
        results.push({
          id: not.id,
          type: 'notice',
          typeLabel: { en: 'Community Notice', gu: 'સૂચના' },
          title: t(not.title),
          subtitle: `${not.author} · ${t(not.content)}`,
          path: '/community',
        });
      }
    });

    // Businesses
    businesses.forEach((b) => {
      const enName = b.name.en.toLowerCase();
      const guName = b.name.gu.toLowerCase();
      const enCat = b.category.en.toLowerCase();
      const guCat = b.category.gu.toLowerCase();
      const person = b.contactPerson.toLowerCase();
      if (
        enName.includes(q) ||
        guName.includes(q) ||
        enCat.includes(q) ||
        guCat.includes(q) ||
        person.includes(q)
      ) {
        results.push({
          id: `biz-${b.id}`,
          type: 'business',
          typeLabel: { en: 'Local Business', gu: 'વ્યવસાય' },
          title: t(b.name),
          subtitle: `${t(b.category)} · ${b.contactPerson} (${b.contactNumber})`,
          path: '/businesses',
        });
      }
    });

    // Landmarks
    villageLandmarks.forEach((lm) => {
      const enName = lm.name.en.toLowerCase();
      const guName = lm.name.gu.toLowerCase();
      const enDesc = lm.description.en.toLowerCase();
      const guDesc = lm.description.gu.toLowerCase();
      if (enName.includes(q) || guName.includes(q) || enDesc.includes(q) || guDesc.includes(q)) {
        results.push({
          id: lm.id,
          type: 'landmark',
          typeLabel: { en: 'Village Landmark', gu: 'ઐતિહાસિક સ્થળ' },
          title: t(lm.name),
          subtitle: t(lm.description),
          path: '/about',
        });
      }
    });

    // Emergency
    emergencyContacts.forEach((em) => {
      const enName = em.name.en.toLowerCase();
      const guName = em.name.gu.toLowerCase();
      const enRole = em.role.en.toLowerCase();
      const guRole = em.role.gu.toLowerCase();
      if (enName.includes(q) || guName.includes(q) || enRole.includes(q) || guRole.includes(q)) {
        results.push({
          id: em.id,
          type: 'emergency',
          typeLabel: { en: 'Emergency Helpline', gu: 'ઇમરજન્સી' },
          title: t(em.name),
          subtitle: `${t(em.role)} · Phone: ${em.phone}`,
          path: '/community',
        });
      }
    });

    return results.slice(0, 10);
  }, [query, newsArticles, events, businesses, communityNotices, villageLandmarks, emergencyContacts, t]);

  if (!isOpen) return null;

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  const getTypeBadgeColor = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'emergency':
        return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
      case 'notice':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300';
      case 'event':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300';
      case 'landmark':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300';
      case 'business':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
      default:
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div
        className="relative bg-white dark:bg-gray-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
          <svg className="w-6 h-6 text-brand-orange flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === 'gu'
                ? 'ધોળાસણ સાઇટમાં શોધો... (દા.ત. નવરાત્રી, સરપંચ, સમાચાર, દવાખાનું)'
                : 'Search Dholasan... (e.g. Navratri, Sarpanch, Clinic, News, School)'
            }
            className="w-full bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 text-lg outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p className="text-sm font-medium">
                {language === 'gu'
                  ? 'સમાચાર, આગામી કાર્યક્રમો, વ્યવસાયો, સ્થાનિક ડિરેક્ટરી અને સ્થળો શોધો.'
                  : 'Type anything to search news, upcoming events, businesses, landmarks, and helplines.'}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['Navratri', 'Sarpanch', 'School', 'Medical Camp', 'Panchayat', 'Dairy'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 rounded-full hover:bg-brand-orange hover:text-white transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <svg className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                {language === 'gu' ? 'કોઈ પરિણામ મળ્યું નથી' : 'No matching results found'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {language === 'gu' ? 'કૃપા કરીને અન્ય કીવર્ડ સાથે પ્રયાસ કરો' : 'Try searching with different keywords'}
              </p>
            </div>
          ) : (
            searchResults.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item.path)}
                className="group flex items-start justify-between p-3 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-800/80 cursor-pointer transition-colors"
              >
                <div className="space-y-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeBadgeColor(item.type)}`}>
                      {t(item.typeLabel)}
                    </span>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-brand-orange transition-colors">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                    {item.subtitle}
                  </p>
                </div>
                <div className="text-gray-400 group-hover:text-brand-orange group-hover:translate-x-1 transition-all pt-1">
                  &rarr;
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{searchResults.length} {language === 'gu' ? 'પરિણામો' : 'results'}</span>
          <span>Dholasan Village Portal</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
