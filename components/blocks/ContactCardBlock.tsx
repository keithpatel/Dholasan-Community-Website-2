import React, { useState } from 'react';
import { ContactCardBlockProps, BlockStyleConfig } from '../../types';
import { useContent } from '../../context/ContentContext';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  props: ContactCardBlockProps;
  style?: BlockStyleConfig;
}

export const ContactCardBlock: React.FC<Props> = ({ props }) => {
  const { siteSettings, submitContactMessage } = useContent();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    submitContactMessage(formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div>
      {(props.title || props.subtitle) && (
        <div className="text-center max-w-3xl mx-auto mb-10">
          {props.title && (
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
              {t(props.title)}
            </h2>
          )}
          {props.subtitle && (
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {t(props.subtitle)}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info Card */}
        <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-xl font-black font-display text-slate-900 dark:text-white">
              Village Panchayat Office
            </h3>

            <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <span className="text-xl">📍</span>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Address</div>
                  <p>{siteSettings.contactAddress || 'Gram Panchayat Office, Dholasan, Mehsana, Gujarat 384001'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">📞</span>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Phone</div>
                  <a href={`tel:${siteSettings.contactPhone}`} className="text-brand-orange font-bold hover:underline">
                    {siteSettings.contactPhone || '+91 98765 43210'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-xl">✉️</span>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Email</div>
                  <a href={`mailto:${siteSettings.contactEmail}`} className="text-brand-orange font-bold hover:underline">
                    {siteSettings.contactEmail || 'panchayat@dholasan.org'}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-4">
            {siteSettings.socialFacebook && (
              <a href={siteSettings.socialFacebook} target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-orange">
                Facebook
              </a>
            )}
            {siteSettings.socialInstagram && (
              <a href={siteSettings.socialInstagram} target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-orange">
                Instagram
              </a>
            )}
            {siteSettings.socialYoutube && (
              <a href={siteSettings.socialYoutube} target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-brand-orange">
                YouTube
              </a>
            )}
          </div>
        </div>

        {/* Message Form */}
        {props.showDirectMessage !== false && (
          <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
            <h3 className="text-xl font-black font-display text-slate-900 dark:text-white mb-4">
              Send a Direct Message
            </h3>

            {submitted ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/30 rounded-2xl text-emerald-800 dark:text-emerald-200 text-sm font-bold">
                ✓ Message sent successfully! The Panchayat team will respond shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-orange outline-none"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email or Phone (Optional)"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-orange outline-none"
                  />
                </div>
                <div>
                  <textarea
                    rows={3}
                    required
                    placeholder="How can we assist you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-brand-orange outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-brand-orange hover:bg-orange-600 text-white font-extrabold rounded-xl shadow-md transition-all font-display text-sm"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactCardBlock;
