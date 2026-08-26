import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useContent } from '../context/ContentContext';
import GlobalSearchModal from './GlobalSearchModal';
import EditableWrapper from './admin/visual-editor/EditableWrapper';

const Header: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { siteSettings } = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = (siteSettings.navLinks || []).filter((link) => link.enabled);
  const siteName = t(siteSettings.siteName);

  // Global Ctrl+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'text-brand-orange bg-orange-500/10 font-bold shadow-sm'
        : 'text-slate-600 dark:text-slate-300 hover:text-brand-orange hover:bg-slate-100 dark:hover:bg-slate-800/60'
    }`;

  const getMobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-3 rounded-xl text-base font-bold transition-all ${
      isActive
        ? 'text-white bg-gradient-to-r from-orange-500 to-amber-600 shadow-md shadow-orange-500/20'
        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo */}
            <div className="flex-shrink-0">
              <EditableWrapper
                targetId="site_branding"
                targetType="header"
                title="Website Branding"
              >
                <Link
                  to="/"
                  className="flex items-center gap-3 group p-1 rounded-xl"
                >
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-600 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 font-bold text-xl font-display group-hover:scale-105 transition-transform duration-300">
                    {language === 'gu' ? 'ધો' : 'D'}
                  </div>
                  <div>
                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight group-hover:text-brand-orange transition-colors">
                      {siteName}
                    </span>
                    <span className="block text-[10px] uppercase font-bold tracking-widest text-brand-orange">
                      {language === 'gu' ? 'ગુજરાત · ભારત' : 'Gujarat · India'}
                    </span>
                  </div>
                </Link>
              </EditableWrapper>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:block">
              <div className="flex items-center space-x-1 xl:space-x-2">
                {navLinks.map((link) => (
                  <NavLink key={link.id} to={link.path} className={getLinkClass}>
                    {t(link.label)}
                  </NavLink>
                ))}
              </div>
            </nav>

            {/* Desktop Right Controls (Search, Theme, Language) */}
            <div className="hidden md:flex items-center space-x-2.5">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 px-3.5 py-2 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700/80 shadow-xs"
                title="Search website (Ctrl + K)"
              >
                <svg className="w-4 h-4 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>{language === 'gu' ? 'શોધો...' : 'Search'}</span>
                <kbd className="hidden xl:inline-block bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                  Ctrl+K
                </kbd>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 p-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700/80"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
              </button>

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-4 py-2 rounded-xl transition-all font-bold text-xs shadow-md shadow-orange-500/20 hover:scale-105 font-display tracking-wide"
              >
                {language === 'en' ? 'ગુજરાતી' : 'English'}
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700"
                aria-label="Search"
              >
                <svg className="w-5 h-5 text-brand-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-brand-orange hover:text-white transition-colors border border-slate-200 dark:border-slate-700"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                <svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-2 duration-200" id="mobile-menu">
            {navLinks.map((link) => (
              <NavLink
                key={link.id}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={getMobileLinkClass}
              >
                {t(link.label)}
              </NavLink>
            ))}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <button
                onClick={() => {
                  toggleTheme();
                }}
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex justify-center items-center gap-2 text-sm font-semibold"
              >
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
              <button
                onClick={() => {
                  toggleLanguage();
                }}
                className="flex-1 bg-brand-orange text-white py-3 rounded-xl hover:bg-orange-600 transition-colors text-sm font-bold text-center font-display"
              >
                {language === 'en' ? 'ગુજરાતી' : 'English'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600 dark:text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

export default Header;