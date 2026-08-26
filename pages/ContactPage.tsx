import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import PageHeader from '../components/PageHeader';

const ContactPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { siteSettings, getLabel, submitContactMessage } = useContent();
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContactMessage(formState);
    setSubmitted(true);
    setFormState({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 6000);
  };

  const thanksLabel = getLabel('contact.thanks').replace('{name}', formState.name || 'friend');

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Consistent Page Header */}
      <PageHeader
        badge={language === 'gu' ? 'સંપર્ક અને પ્રશ્નોત્તરી' : 'Get in Touch'}
        title={getLabel('contact.title')}
        subtitle={
          language === 'gu'
            ? 'ગ્રામ પંચાયત, હોદ્દેદારો અથવા વેબસાઇટ ટીમ સાથે સીધો સંપર્ક કરો.'
            : 'Reach out to Gram Panchayat representatives, village administration, or community volunteers.'
        }
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white dark:bg-slate-800/90 p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-2xl text-brand-orange">
                ✉️
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-display">
                  {getLabel('contact.sendMessage')}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {language === 'gu' ? 'અમે ટૂંક સમયમાં સંપર્ક કરીશું' : 'We typically respond within 24 hours'}
                </p>
              </div>
            </div>

            {submitted && (
              <div className="mb-8 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-3 font-display">
                <span className="text-lg">✓</span>
                <span>{thanksLabel}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-sm">
              <div>
                <label htmlFor="name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-display">
                  {getLabel('contact.name')}
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Ramesh Patel"
                  className="block w-full px-4 py-3.5 border border-slate-200 dark:border-slate-600 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange bg-slate-50 dark:bg-slate-700/50 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-display">
                    {getLabel('contact.email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formState.email}
                    onChange={handleInputChange}
                    required
                    placeholder="name@example.com"
                    className="block w-full px-4 py-3.5 border border-slate-200 dark:border-slate-600 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange bg-slate-50 dark:bg-slate-700/50 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-display">
                    {getLabel('contact.subject')}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    value={formState.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Village Water Inquiry"
                    className="block w-full px-4 py-3.5 border border-slate-200 dark:border-slate-600 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange bg-slate-50 dark:bg-slate-700/50 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 font-display">
                  {getLabel('contact.message')}
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={formState.message}
                  onChange={handleInputChange}
                  required
                  placeholder={
                    language === 'gu'
                      ? 'તમારો સંદેશ વિગતવાર લખો...'
                      : 'Write your message in detail...'
                  }
                  className="block w-full px-4 py-3.5 border border-slate-200 dark:border-slate-600 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange bg-slate-50 dark:bg-slate-700/50 dark:text-white"
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-4 px-4 rounded-2xl text-sm font-extrabold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-xl shadow-orange-500/25 transition-all hover:scale-[1.01] font-display uppercase tracking-wider"
                >
                  {getLabel('contact.submit')}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8 flex flex-col justify-between">
            <div className="bg-white dark:bg-slate-800/90 p-8 sm:p-12 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-2xl text-brand-orange">
                  📍
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 font-display">
                  {getLabel('contact.info')}
                </h2>
              </div>
              <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                  <span className="text-xs font-extrabold text-brand-orange uppercase tracking-wider font-display block">
                    {getLabel('contact.addressLabel')}
                  </span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">
                    {siteSettings.contactAddress}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                    <span className="text-xs font-extrabold text-brand-orange uppercase tracking-wider font-display block">
                      {getLabel('contact.emailLabel')}
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {siteSettings.contactEmail}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
                    <span className="text-xs font-extrabold text-brand-orange uppercase tracking-wider font-display block">
                      {getLabel('contact.phoneLabel')}
                    </span>
                    <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {siteSettings.contactPhone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Embed */}
            <div className="bg-white dark:bg-slate-800/90 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80 overflow-hidden">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-inner">
                {siteSettings.mapEmbedUrl ? (
                  <iframe
                    className="dark:invert dark:grayscale w-full h-full"
                    src={siteSettings.mapEmbedUrl}
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                    {t({ en: 'Map not configured yet.', gu: 'નકશો હજી ગોઠવાયેલો નથી.' })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;