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
  const { isLiveEditMode, setIsLiveEditMode, viewport, setViewport, hasUnsavedChanges, setHasUnsavedChanges } = useLiveEdit();
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { logActivity } = useContent();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // STRICT SECURITY GUARD:
  // If user is not logged in as admin, or Live Edit Mode is OFF, DO NOT RENDER ANYTHING!
  if (!isAuthenticated || !isLiveEditMode) {
    return null;
  }

  // Don't show toolbar on pure admin panel pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePublish = () => {
    setHasUnsavedChanges(false);
    logActivity('UPDATE_SETTINGS', 'VisualEditor', 'Published live visual changes');
    showToast('✨ All visual edits published & synced live!');
  };

  const handleExitLiveEdit = () => {
    setIsLiveEditMode(false);
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-[9999] bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-bold border border-emerald-400/40 animate-bounce">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Live Editor Bar */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[9990] w-auto max-w-[96vw] transition-all duration-300">
        <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl border border-slate-700/80 shadow-2xl rounded-2xl p-2 px-3 flex items-center gap-2 sm:gap-3 text-white text-xs font-medium">
          
          {/* Status Badge */}
          <div className="flex items-center gap-2 pr-2 border-r border-slate-700/80">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-extrabold tracking-tight text-white hidden sm:inline font-display">
              🎨 Live Visual Editor
            </span>
          </div>

          {/* Viewport Device Switcher */}
          <div className="flex items-center bg-slate-800/90 rounded-xl p-0.5 border border-slate-700/60">
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                viewport === 'desktop' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop View (Full)"
            >
              <span>🖥️</span>
              <span className="hidden md:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport('tablet')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                viewport === 'tablet' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet View (768px)"
            >
              <span>📱</span>
              <span className="hidden md:inline">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                viewport === 'mobile' ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View (390px)"
            >
              <span>📱</span>
              <span className="hidden md:inline">Mobile</span>
            </button>
          </div>

          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold transition-colors border border-slate-700/60"
          >
            {language === 'gu' ? '🌐 GU' : '🌐 EN'}
          </button>

          {/* Publish / Save Button */}
          <button
            type="button"
            onClick={handlePublish}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>💾</span>
            <span>Publish</span>
          </button>

          {/* Go to Admin Dashboard */}
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700/80 transition-colors flex items-center gap-1"
          >
            <span>⚙️</span>
            <span className="hidden sm:inline">Admin</span>
          </button>

          {/* Exit Live Edit Mode */}
          <button
            type="button"
            onClick={handleExitLiveEdit}
            className="px-2.5 py-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-xl text-xs font-bold transition-colors"
            title="Exit Live Editor (Preview as normal visitor)"
          >
            ✕ Exit
          </button>
        </div>
      </div>
    </>
  );
};

export default LiveEditToolbar;
