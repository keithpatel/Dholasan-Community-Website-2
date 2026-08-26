import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLiveEdit } from '../../../context/LiveEditContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import { useContent } from '../../../context/ContentContext';

export const LiveEditToolbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { isLiveEditMode, toggleLiveEditMode, viewport, setViewport, hasUnsavedChanges, setHasUnsavedChanges } = useLiveEdit();
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { logActivity } = useContent();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // If not logged in as admin and not on edit route, don't show floating toolbar
  if (!isAuthenticated && !isLiveEditMode) {
    return null;
  }

  // Don't show toolbar on pure admin management pages
  if (location.pathname.startsWith('/admin') && location.pathname !== '/admin/live-preview') {
    return null;
  }

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveAndPublish = () => {
    setHasUnsavedChanges(false);
    logActivity('UPDATE_SETTINGS', 'VisualEditor', 'Published live website layout and content edits');
    showToast('✨ All changes successfully published & synced live!');
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[9999] bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce text-sm font-bold border border-emerald-400/40">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Toolbar Container */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[9990] w-auto max-w-[95vw] transition-all duration-300">
        <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl rounded-2xl p-2 px-3 flex items-center gap-2 sm:gap-4 text-white text-xs font-medium">
          
          {/* Brand Badge */}
          <div className="flex items-center gap-2 pr-2 border-r border-slate-700/80">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-extrabold tracking-tight text-white hidden sm:inline font-display">
              🎨 Live Visual Editor
            </span>
          </div>

          {/* Edit Mode Toggle */}
          <button
            onClick={toggleLiveEditMode}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold transition-all ${
              isLiveEditMode
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/30 ring-2 ring-orange-400/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Click to toggle visual click-to-edit overlays"
          >
            <span>{isLiveEditMode ? '✏️ Edit Mode: ON' : '👁️ Preview: OFF'}</span>
          </button>

          {/* Viewport Selector */}
          <div className="hidden md:flex items-center bg-slate-800/90 rounded-xl p-0.5 border border-slate-700/60">
            <button
              onClick={() => setViewport('desktop')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewport === 'desktop' ? 'bg-slate-700 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop View (100%)"
            >
              💻 Desktop
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewport === 'tablet' ? 'bg-slate-700 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet View (768px)"
            >
              📱 Tablet
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                viewport === 'mobile' ? 'bg-slate-700 text-white font-bold shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View (390px)"
            >
              📲 Mobile
            </button>
          </div>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold border border-slate-700/60 transition-colors flex items-center gap-1.5"
            title="Toggle between English and Gujarati display"
          >
            <span>🌐</span>
            <span>{language === 'gu' ? 'ગુજરાતી' : 'English'}</span>
          </button>

          {/* Theme Quick Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700/60 transition-colors"
            title="Toggle Dark / Light theme preview"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Publish / Save Changes */}
          <button
            onClick={handleSaveAndPublish}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            title="Publish all changes to live site"
          >
            <span>💾</span>
            <span className="hidden sm:inline">Publish</span>
          </button>

          {/* Admin Dashboard shortcut */}
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700/60 transition-colors flex items-center gap-1"
            title="Return to full Admin Dashboard"
          >
            <span>⚙️</span>
            <span className="hidden lg:inline">Admin</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default LiveEditToolbar;
