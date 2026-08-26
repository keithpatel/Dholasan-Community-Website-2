import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import PageHeader from '../components/PageHeader';

const FactCard: React.FC<{ icon: React.ReactElement; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-start p-6 bg-white dark:bg-slate-800/90 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="flex-shrink-0 mr-4 text-brand-orange p-3.5 bg-orange-500/10 dark:bg-orange-500/20 rounded-2xl">
      {icon}
    </div>
    <div>
      <p className="text-[11px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-widest font-display">{label}</p>
      <p className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1 font-display">{value}</p>
    </div>
  </div>
);

const AboutPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { siteSettings, villageLandmarks, getLabel } = useContent();

  const iconsMap: Record<number, React.ReactElement> = {
    0: <LocationIcon />,
    1: <UsersIcon />,
    2: <BookOpenIcon />,
    3: <HomeIcon />,
    4: <OfficeBuildingIcon />,
    5: <MailIcon />,
    6: <BuildingLibraryIcon />,
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Consistent Page Header */}
      <PageHeader
        badge={language === 'gu' ? 'ધોળાસણ ગ્રામ પરિચય' : 'Heritage & Overview'}
        title={getLabel('about.title')}
        subtitle={
          language === 'gu'
            ? 'સંસ્કૃતિ, સંસ્કાર અને આધુનિક વિકાસનું અનોખું સંગમ ધરાવતું ગામ.'
            : 'A rich legacy of agrarian pride, communal harmony, and cultural heritage in Gujarat.'
        }
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {/* History Section */}
        <section className="bg-white dark:bg-slate-800/90 p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center text-2xl">
              📜
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-display">
              {getLabel('about.historyTitle')}
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
            {t(siteSettings.aboutHistory)}
          </p>
        </section>

        {/* Key Facts Section */}
        <section>
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-brand-orange font-display">
              {language === 'gu' ? 'મુખ્ય આંકડાકીય વિગતો' : 'Key Statistics'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mt-1 font-display">
              {getLabel('about.glance')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {siteSettings.aboutKeyFacts.map((fact, idx) => (
              <FactCard
                key={idx}
                icon={iconsMap[idx % 7]}
                label={t(fact.label)}
                value={t(fact.value)}
              />
            ))}
          </div>
        </section>

        {/* Landmarks & Heritage Section */}
        {villageLandmarks && villageLandmarks.length > 0 && (
          <section>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-extrabold uppercase tracking-widest text-brand-orange font-display">
                {language === 'gu' ? 'દર્શનીય સ્થળો' : 'Historical & Civic Places'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mt-1 font-display">
                {getLabel('about.landmarks')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-3 leading-relaxed">
                {getLabel('about.landmarksSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {villageLandmarks.map((landmark) => (
                <div
                  key={landmark.id}
                  className="bg-white dark:bg-slate-800/90 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700/80 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group"
                >
                  <div>
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={landmark.imageUrl}
                        alt={t(landmark.name)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20"></div>

                      <div className="absolute top-3.5 left-3.5 bg-slate-950/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                        {t(landmark.category)}
                      </div>
                      {landmark.timing && (
                        <div className="absolute bottom-3.5 right-3.5 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 text-xs font-bold px-3 py-1 rounded-xl shadow-md backdrop-blur-md font-display">
                          🕒 {t(landmark.timing)}
                        </div>
                      )}
                    </div>

                    <div className="p-7">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-orange transition-colors font-display">
                        {t(landmark.name)}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                        {t(landmark.description)}
                      </p>
                    </div>
                  </div>

                  <div className="p-7 pt-0">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        landmark.locationQuery || `${t(landmark.name)}, Dholasan, Gujarat`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-brand-orange hover:text-white dark:hover:bg-brand-orange text-slate-800 dark:text-slate-200 text-xs font-bold py-3 px-4 rounded-2xl transition-all font-display"
                    >
                      <span>📍</span>
                      <span>{language === 'gu' ? 'નકશામાં જુઓ / દિશા' : 'View on Google Maps'}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Map and Connectivity */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map */}
            <div className="bg-white dark:bg-slate-800/90 p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🗺️</span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display">
                    {getLabel('about.findUs')}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  Dholasan, Mahesana District, Gujarat - 382732
                </p>
              </div>

              {siteSettings.mapEmbedUrl ? (
                <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700">
                  <iframe
                    className="dark:invert dark:grayscale w-full h-full"
                    src={siteSettings.mapEmbedUrl}
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              ) : (
                <p className="text-slate-500 dark:text-slate-400">Map not configured yet.</p>
              )}
            </div>

            {/* Connectivity */}
            <div className="bg-white dark:bg-slate-800/90 p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🛣️</span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display">
                    {getLabel('about.connectivity')}
                  </h2>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                  {t(siteSettings.aboutConnectivity)}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 space-y-3 font-display">
                <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-700/50 p-3.5 rounded-2xl">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    🚌 {language === 'gu' ? 'નજીકનું બસ સ્ટેશન' : 'Nearest Bus Station'}
                  </span>
                  <span className="font-bold text-brand-orange">Kadi / Dholasan Chowk</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-700/50 p-3.5 rounded-2xl">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    🚆 {language === 'gu' ? 'નજીકનું રેલ્વે સ્ટેશન' : 'Nearest Railway'}
                  </span>
                  <span className="font-bold text-brand-orange">Ambliyasan (10 km) / Mahesana</span>
                </div>
                <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-700/50 p-3.5 rounded-2xl">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    ✈️ {language === 'gu' ? 'નજીકનું એરપોર્ટ' : 'Nearest Airport'}
                  </span>
                  <span className="font-bold text-brand-orange">SVP Intl Airport, Ahmedabad (60 km)</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Icons
const LocationIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const UsersIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.274-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.274.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const BookOpenIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const HomeIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const OfficeBuildingIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const MailIcon = () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const BuildingLibraryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l-3 3m0 0l-3-3m3 3v-6" /></svg>;

export default AboutPage;