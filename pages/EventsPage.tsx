import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { Event } from '../types';
import LiveEventBanner from '../components/LiveEventBanner';
import PageHeader from '../components/PageHeader';

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80 p-7 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-l-4 border-l-brand-orange group">
      <div>
        <span className="inline-block px-3.5 py-1 bg-orange-500/10 dark:bg-orange-500/20 text-brand-orange rounded-full text-xs font-bold font-display mb-2.5">
          {`${t(event.date)} @ ${event.time}`}
        </span>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-orange transition-colors font-display mt-1">
          {t(event.name)}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
          <span>📍</span>
          <span>{t(event.location)}</span>
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-3.5 leading-relaxed">
          {t(event.description)}
        </p>
      </div>
    </div>
  );
};

const FestivalCard: React.FC<{ name: string; description: string; image: string }> = ({
  name,
  description,
  image,
}) => (
  <div className="bg-white dark:bg-slate-800/90 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80 overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group">
    <div className="relative h-52 overflow-hidden">
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
      <h3 className="absolute bottom-4 left-5 text-xl font-bold text-white drop-shadow font-display">
        {name}
      </h3>
    </div>
    <div className="p-6">
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

const EventsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { events, siteSettings, getLabel } = useContent();

  const upcomingEvents = events.filter((e) => !e.isPast);
  const pastEvents = events.filter((e) => e.isPast);
  const festivals = siteSettings.festivals || [];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Consistent Page Header */}
      <PageHeader
        badge={language === 'gu' ? 'ઉત્સવો અને કાર્યક્રમો' : 'Festivals & Celebrations'}
        title={getLabel('events.title')}
        subtitle={
          language === 'gu'
            ? 'ગામના પરંપરાગત તહેવારો, સાંસ્કૃતિક ઉત્સવો અને આગામી કાર્યક્રમોની સંપૂર્ણ માહિતી.'
            : 'Explore upcoming gatherings, annual traditional festivals, and community celebrations in Dholasan.'
        }
      />

      {/* Live Event Banner */}
      <LiveEventBanner />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {/* Upcoming Events Section */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-orange font-display">
                {language === 'gu' ? 'આગામી ઉત્સવો' : 'Calendar'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 font-display mt-1">
                {getLabel('events.upcoming')}
              </h2>
            </div>
            <span className="text-xs font-bold bg-orange-500/10 text-brand-orange px-4 py-1.5 rounded-full font-display">
              {upcomingEvents.length} {language === 'gu' ? 'કાર્યક્રમો' : 'Scheduled'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => <EventCard key={event.id} event={event} />)
            ) : (
              <div className="col-span-full bg-white dark:bg-slate-800/90 p-12 rounded-3xl text-center text-slate-500">
                {getLabel('events.upcomingEmpty')}
              </div>
            )}
          </div>
        </section>

        {/* Annual Festivals Section */}
        <section className="bg-white dark:bg-slate-900/60 p-8 sm:p-12 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-orange font-display">
              {language === 'gu' ? 'પરંપરા અને સંસ્કૃતિ' : 'Cultural Heritage'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 font-display mt-1">
              {getLabel('events.festivals')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
              {language === 'gu'
                ? 'નવરાત્રી, દિવાળી અને ઉત્તરાયણ જેવા ભવ્ય તહેવારોની ગ્રામીણ પરંપરા.'
                : 'Annual cultural highlights celebrated with great joy by villagers and NRIs alike.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {festivals.map((festival) => (
              <FestivalCard
                key={festival.id}
                name={t(festival.name)}
                description={t(festival.description)}
                image={festival.imageUrl}
              />
            ))}
          </div>
        </section>

        {/* Past Events Archive */}
        <section>
          <div className="mb-8">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 font-display">
              {language === 'gu' ? 'આર્કાઇવ' : 'History'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-display mt-1">
              {getLabel('events.past')}
            </h2>
          </div>

          <div className="space-y-3.5">
            {pastEvents.length > 0 ? (
              pastEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white dark:bg-slate-800/90 p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/80 flex justify-between items-center hover:shadow-md transition-all group"
                >
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 font-display group-hover:text-brand-orange transition-colors">
                      {t(event.name)}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      📅 {t(event.date)} · 📍 {t(event.location)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-3.5 py-1.5 rounded-full font-display">
                    {getLabel('events.completed')} ✓
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm">{getLabel('events.pastEmpty')}</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default EventsPage;