import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import EditableWrapper from './admin/visual-editor/EditableWrapper';

const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const { siteSettings, getLabel } = useContent();

  const quickLinks = [
    { to: '/about', label: 'about.title' },
    { to: '/events', label: 'events.title' },
    { to: '/community', label: 'community.title' },
    { to: '/gallery', label: 'gallery.title' },
    { to: '/businesses', label: 'businesses.title' },
    { to: '/contact', label: 'contact.title' },
  ];

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800/80 relative overflow-hidden">
      {/* Top Hairline Glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-black text-white text-lg font-display shadow-lg shadow-orange-500/20">
                {language === 'gu' ? 'ધો' : 'D'}
              </div>
              <h3 className="text-xl font-black tracking-tight font-display">{t(siteSettings.siteName)}</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{getLabel('footer.tagline')}</p>
            <p className="text-xs text-slate-500 font-medium">
              Mahesana District, Gujarat, India - 382732
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-widest font-display mb-4">
              {getLabel('footer.quickLinks')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-slate-400 hover:text-brand-orange transition-colors">
                    {getLabel(link.label)}
                  </Link>
                </li>
              ))}
              <li className="pt-3">
                <Link
                  to="/admin"
                  className="text-orange-400 hover:text-orange-300 font-bold text-xs transition-colors inline-flex items-center gap-1.5 bg-orange-950/60 px-3.5 py-2 rounded-xl border border-orange-900/60 font-display uppercase tracking-wider"
                >
                  <span>🔒</span> {getLabel('footer.admin')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <EditableWrapper
              targetId="site_footer_contact"
              targetType="footer"
              title="Footer Contact Details"
            >
              <div className="p-2 rounded-xl">
                <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-widest font-display mb-4">
                  {getLabel('footer.contactUs')}
                </h3>
                <div className="space-y-2 text-sm text-slate-400">
                  <p className="leading-relaxed">{siteSettings.contactAddress}</p>
                  <p className="pt-1">
                    <span className="font-semibold text-slate-300">Email:</span> {siteSettings.contactEmail}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-300">Phone:</span> {siteSettings.contactPhone}
                  </p>
                </div>
              </div>
            </EditableWrapper>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-widest font-display mb-4">
              {getLabel('footer.followUs')}
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              {language === 'gu'
                ? 'સોશિયલ મીડિયા પર ગામના સમાચાર અને કાર્યક્રમો સાથે જોડાયેલા રહો.'
                : 'Connect with community news and cultural live streams.'}
            </p>
            <div className="flex space-x-3">
              <a
                href={siteSettings.socialFacebook || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-2xl bg-slate-900 hover:bg-brand-orange flex items-center justify-center text-white transition-colors border border-slate-800"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href={siteSettings.socialInstagram || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-2xl bg-slate-900 hover:bg-brand-orange flex items-center justify-center text-white transition-colors border border-slate-800"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.343 2.525c.636-.247 1.363-.416 2.427-.465C9.792 2.013 10.146 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm6.406-11.845a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href={siteSettings.socialYoutube || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-2xl bg-slate-900 hover:bg-brand-orange flex items-center justify-center text-white transition-colors border border-slate-800"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.701V8.113l6.02 3.383-6.02 3.389z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-slate-900 pt-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} {getLabel('footer.copyright')}</p>
          <p className="text-slate-600 text-[11px]">
            Designed with pride for Dholasan Village & Community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;