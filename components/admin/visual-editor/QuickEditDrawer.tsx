import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLiveEdit } from '../../../context/LiveEditContext';
import { useContent } from '../../../context/ContentContext';
import { BlockPropertyInspector, TranslatableInput } from '../blocks/BlockPropertyEditors';
import { PageBlockConfig } from '../../../types';
import { defaultPageLayouts } from '../../../data/contentStore';

export const QuickEditDrawer: React.FC = () => {
  const location = useLocation();
  const { activeTarget, closeEditor, isLiveEditMode, setHasUnsavedChanges } = useLiveEdit();
  const { pageLayouts, updateSingleBlock, siteSettings, updateSiteSettings, logActivity } = useContent();

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isLiveEditMode || !activeTarget) {
    return null;
  }

  // Determine current page ID from path
  const getPageIdFromPath = () => {
    const path = location.pathname;
    if (path === '/' || path === '') return 'home';
    const clean = path.replace('/', '');
    return clean;
  };

  const pageId = activeTarget.pageId || getPageIdFromPath();
  const currentBlocks: PageBlockConfig[] = pageLayouts[pageId] || defaultPageLayouts[pageId] || [];
  const currentBlock = activeTarget.type === 'block' ? currentBlocks.find((b) => b.id === activeTarget.id) : null;

  const handleBlockChange = (updatedBlock: PageBlockConfig) => {
    updateSingleBlock(pageId, updatedBlock);
    setHasUnsavedChanges(true);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleHeaderSave = (field: 'siteName' | 'siteTagline', val: any) => {
    const updated = {
      ...siteSettings,
      [field]: val,
    };
    updateSiteSettings(updated);
    setHasUnsavedChanges(true);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleFooterSave = (field: string, val: any) => {
    const updated = {
      ...siteSettings,
      [field]: val,
    };
    updateSiteSettings(updated);
    setHasUnsavedChanges(true);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleSocialLinkSave = (platform: 'facebook' | 'instagram' | 'youtube', url: string) => {
    const updated = {
      ...siteSettings,
      socialLinks: {
        ...siteSettings.socialLinks,
        [platform]: url,
      },
    };
    updateSiteSettings(updated);
    setHasUnsavedChanges(true);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-[9995] w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 animate-slide-left">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center text-lg font-bold">
            ✏️
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white font-display">
              {activeTarget.title || 'Edit Section'}
            </h3>
            <p className="text-[11px] font-semibold text-slate-400">
              Live updates preview immediately
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-[11px] font-bold text-emerald-500 animate-fade-in">
              ✓ Saved!
            </span>
          )}
          <button
            onClick={closeEditor}
            className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-sm transition-colors"
            title="Close editor"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Block Editor */}
        {activeTarget.type === 'block' && currentBlock && (
          <BlockPropertyInspector
            block={currentBlock}
            onChange={handleBlockChange}
          />
        )}

        {activeTarget.type === 'block' && !currentBlock && (
          <div className="text-center py-10 text-slate-400 text-sm">
            Block config not found or removed.
          </div>
        )}

        {/* Header Branding Editor */}
        {activeTarget.type === 'header' && (
          <div className="space-y-5">
            <TranslatableInput
              label="Website Name / Logo Text"
              value={siteSettings.siteName}
              onChange={(val) => handleHeaderSave('siteName', val)}
            />
            <TranslatableInput
              label="Tagline / Village Subtitle"
              value={siteSettings.siteTagline}
              onChange={(val) => handleHeaderSave('siteTagline', val)}
            />
          </div>
        )}

        {/* Footer Editor */}
        {activeTarget.type === 'footer' && (
          <div className="space-y-5">
            <TranslatableInput
              label="Village / Panchayat Address"
              value={siteSettings.contactAddress}
              isTextArea
              rows={2}
              onChange={(val) => handleFooterSave('contactAddress', val)}
            />
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={siteSettings.contactEmail || ''}
                onChange={(e) => handleFooterSave('contactEmail', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
                Contact Phone / Helpline
              </label>
              <input
                type="text"
                value={siteSettings.contactPhone || ''}
                onChange={(e) => handleFooterSave('contactPhone', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Social Media Links
              </h4>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={siteSettings.socialLinks?.facebook || ''}
                  onChange={(e) => handleSocialLinkSave('facebook', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={siteSettings.socialLinks?.instagram || ''}
                  onChange={(e) => handleSocialLinkSave('instagram', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  YouTube Channel URL
                </label>
                <input
                  type="url"
                  value={siteSettings.socialLinks?.youtube || ''}
                  onChange={(e) => handleSocialLinkSave('youtube', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium">
          Changes sync automatically
        </span>
        <button
          onClick={closeEditor}
          className="px-4 py-2 bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          Done Editing
        </button>
      </div>
    </div>
  );
};

export default QuickEditDrawer;
