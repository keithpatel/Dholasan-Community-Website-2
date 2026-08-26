import React, { useState } from 'react';
import { DevelopmentProject } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';

const formatINR = (val: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
};

const DevelopmentProjectsSection: React.FC = () => {
  const { t, language } = useLanguage();
  const { developmentProjects } = useContent();

  const [activeProjectForDonors, setActiveProjectForDonors] = useState<DevelopmentProject | null>(null);
  const [activeProjectForDonate, setActiveProjectForDonate] = useState<DevelopmentProject | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!developmentProjects || developmentProjects.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-brand-orange text-xs font-extrabold uppercase tracking-widest font-display mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange"></span>
            <span>{language === 'gu' ? 'ગામ ઉત્કર્ષ & વિકાસ યોજના' : 'Village Vikas Initiatives'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white font-display mt-1 tracking-tight">
            {language === 'gu' ? 'ધોળાસણ વિકાસ પ્રોજેક્ટ્સ & દાન પોર્ટલ' : 'Development Projects & Community Fund'}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-4 text-base sm:text-lg leading-relaxed">
            {language === 'gu'
              ? 'ગામના સર્વાંગી વિકાસ માટે સ્થાનિક અને વિદેશ વસતા દાતાઓના સહયોગથી ચાલતા મહત્વના પ્રોજેક્ટ્સ.'
              : 'Empowering Dholasan through community-driven welfare, solar lighting, smart education, and water harvesting projects.'}
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {developmentProjects.map((project) => {
            const pct = Math.min(100, Math.round((project.raisedAmount / (project.targetAmount || 1)) * 100));
            const isCompleted = project.status === 'completed' || pct >= 100;

            return (
              <div
                key={project.id}
                className="bg-white dark:bg-slate-800/90 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80 overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={t(project.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20"></div>

                  <div className="absolute top-3.5 left-3.5 bg-slate-950/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
                    {t(project.category)}
                  </div>
                  <div className="absolute top-3.5 right-3.5">
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full shadow-md font-display ${
                        isCompleted
                          ? 'bg-emerald-500 text-white'
                          : project.status === 'ongoing'
                          ? 'bg-brand-orange text-white'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {isCompleted
                        ? language === 'gu' ? 'પૂર્ણ થયું ✓' : 'Completed ✓'
                        : project.status === 'ongoing'
                        ? language === 'gu' ? 'ચાલુ કાર્ય ⚡' : 'In Progress ⚡'
                        : language === 'gu' ? 'આગામી યોજના' : 'Planned'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-orange transition-colors font-display">
                      {t(project.title)}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-3 leading-relaxed">
                      {t(project.description)}
                    </p>
                  </div>

                  {/* Progress Bar & Stats */}
                  <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700/60">
                    <div className="flex justify-between items-end mb-2.5">
                      <div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block">
                          {language === 'gu' ? 'એકત્રિત ફંડ:' : 'Raised Fund:'}
                        </span>
                        <p className="text-xl font-black text-brand-orange font-display">
                          {formatINR(project.raisedAmount)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider block">
                          {language === 'gu' ? 'લક્ષ્યાંક:' : 'Target:'}
                        </span>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 font-display">
                          {formatINR(project.targetAmount)}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-600/60">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600'
                        }`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 font-semibold font-display">
                      <span>{pct}% {language === 'gu' ? 'પ્રગતિ' : 'Achieved'}</span>
                      <span>{project.donors?.length || 0} {language === 'gu' ? 'દાતાઓ' : 'Donors'}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setActiveProjectForDonors(project)}
                        className="w-full text-xs font-bold py-3 px-3 rounded-2xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-display"
                      >
                        {language === 'gu' ? 'દાતાઓની યાદી' : 'Donor Wall'}
                      </button>
                      <button
                        onClick={() => setActiveProjectForDonate(project)}
                        className="w-full text-xs font-extrabold py-3 px-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] font-display uppercase tracking-wider"
                      >
                        {language === 'gu' ? 'સહયોગ આપો' : 'Support / Donate'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Donors Wall Modal */}
      {activeProjectForDonors && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveProjectForDonors(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl shadow-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 max-h-[85vh] flex flex-col animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-extrabold text-brand-orange uppercase tracking-wider font-display">
                  {language === 'gu' ? 'દાતા સન્માન પત્રિકા' : 'Donor Recognition Wall'}
                </span>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100 font-display mt-0.5">
                  {t(activeProjectForDonors.title)}
                </h3>
              </div>
              <button
                onClick={() => setActiveProjectForDonors(null)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-5 space-y-3">
              {activeProjectForDonors.donors && activeProjectForDonors.donors.length > 0 ? (
                activeProjectForDonors.donors.map((donor, idx) => (
                  <div
                    key={donor.id || idx}
                    className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-700/80"
                  >
                    <div className="space-y-0.5">
                      <p className="font-bold text-sm text-slate-900 dark:text-slate-100 font-display">
                        {donor.name}
                      </p>
                      {donor.location && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          📍 {donor.location}
                        </p>
                      )}
                      {donor.message && (
                        <p className="text-xs italic text-slate-600 dark:text-slate-300 pt-0.5">
                          "{donor.message}"
                        </p>
                      )}
                    </div>
                    <span className="font-black text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 font-display">
                      {formatINR(donor.amount)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-slate-500 py-8">
                  {language === 'gu' ? 'હજી સુધી કોઈ દાતા નોંધાયેલ નથી.' : 'No donors listed yet.'}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                onClick={() => {
                  const proj = activeProjectForDonors;
                  setActiveProjectForDonors(null);
                  setActiveProjectForDonate(proj);
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-2xl font-bold text-sm hover:from-orange-600 hover:to-amber-700 transition-all font-display uppercase tracking-wider shadow-md"
              >
                {language === 'gu' ? 'આ પ્રોજેક્ટમાં ફાળો આપો' : 'Contribute to this Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Donate / Bank Information Modal */}
      {activeProjectForDonate && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveProjectForDonate(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl shadow-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-extrabold text-brand-orange uppercase tracking-wider font-display">
                  {language === 'gu' ? 'સહયોગ માહિતી' : 'Pledge Support & Bank Details'}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display mt-0.5">
                  {t(activeProjectForDonate.title)}
                </h3>
              </div>
              <button
                onClick={() => setActiveProjectForDonate(null)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                &times;
              </button>
            </div>

            <div className="py-5 space-y-4 text-sm">
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                {language === 'gu'
                  ? 'આપ સીધા ગ્રામ પંચાયત અથવા ટ્રસ્ટના અધિકૃત બેંક ખાતા અથવા UPI દ્વારા યોગદાન આપી શકો છો. દાન આપ્યા પછી પંચાયત મંત્રીનો સંપર્ક કરી પહોંચ મેળવી શકો છો.'
                  : 'You can contribute directly to the official village welfare fund via Bank Transfer or UPI. Contact Panchayat authorities to receive an official receipt.'}
              </p>

              {/* UPI ID */}
              {activeProjectForDonate.upiId && (
                <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-brand-orange font-bold uppercase tracking-wider font-display">
                        UPI ID / GPay / PhonePe
                      </span>
                      <p className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                        {activeProjectForDonate.upiId}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopy(activeProjectForDonate.upiId!, 'upi')}
                      className="px-3.5 py-1.5 bg-brand-orange text-white text-xs font-bold rounded-xl hover:bg-orange-600 transition-colors font-display"
                    >
                      {copiedKey === 'upi' ? (language === 'gu' ? 'કોપી થયું ✓' : 'Copied ✓') : (language === 'gu' ? 'કોપી કરો' : 'Copy')}
                    </button>
                  </div>
                </div>
              )}

              {/* Bank Details */}
              {activeProjectForDonate.bankDetails && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider font-display">
                    {language === 'gu' ? 'બેંક વિગતો' : 'Bank Account Details'}
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 mt-1.5 font-medium leading-relaxed">
                    {t(activeProjectForDonate.bankDetails)}
                  </p>
                </div>
              )}

              {/* Contact Help */}
              <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-2xl flex items-center gap-2.5">
                <span className="text-base">📞</span>
                <span>
                  {language === 'gu'
                    ? 'પૂછપરછ માટે સંપર્ક: સરપંચ / તલાટી કાર્યાલય (+91 98250 12345)'
                    : 'For donation receipts or queries: Gram Panchayat (+91 98250 12345)'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveProjectForDonate(null)}
              className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 py-3 rounded-2xl font-bold text-sm hover:opacity-90 transition-opacity font-display"
            >
              {language === 'gu' ? 'બંધ કરો' : 'Close'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default DevelopmentProjectsSection;
