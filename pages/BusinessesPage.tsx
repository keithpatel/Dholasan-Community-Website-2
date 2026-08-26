import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { Business } from '../types';
import PageHeader from '../components/PageHeader';

const BusinessCard: React.FC<{ business: Business }> = ({ business }) => {
  const { t, language } = useLanguage();
  const { getLabel } = useContent();

  const cleanPhone = business.contactNumber.replace(/\s+/g, '');

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80 p-7 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group">
      <div>
        <span className="inline-block px-3.5 py-1 bg-orange-500/10 dark:bg-orange-500/20 text-brand-orange rounded-full text-xs font-bold font-display mb-3">
          {t(business.category)}
        </span>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-orange transition-colors font-display">
          {t(business.name)}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5">
          👤 {getLabel('businesses.contact')} <span className="font-semibold text-slate-800 dark:text-slate-200">{business.contactPerson}</span>
        </p>
      </div>

      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <span className="font-mono text-xs text-slate-600 dark:text-slate-400 font-bold">
          {business.contactNumber}
        </span>
        <a
          href={`tel:${cleanPhone}`}
          className="inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-2xl transition-all shadow-md font-display uppercase tracking-wider"
        >
          <span>📞</span>
          <span>{language === 'gu' ? 'કૉલ' : 'Call'}</span>
        </a>
      </div>
    </div>
  );
};

const BusinessesPage: React.FC = () => {
  const { language } = useLanguage();
  const { businesses, getLabel } = useContent();

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Consistent Page Header */}
      <PageHeader
        badge={language === 'gu' ? 'સ્થાનિક બજાર અને સેવાઓ' : 'Local Business Directory'}
        title={getLabel('businesses.title')}
        subtitle={getLabel('businesses.intro')}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((biz) => (
            <BusinessCard key={biz.id} business={biz} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessesPage;