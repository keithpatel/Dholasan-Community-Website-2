import React from 'react';
import { useLiveEdit } from '../../../context/LiveEditContext';
import { useContent } from '../../../context/ContentContext';
import { useAuth } from '../../../context/AuthContext';
import { BlockPropertyInspectorWithApply } from '../blocks/BlockPropertyEditors';
import BilingualInput from '../BilingualInput';
import ImagePreview from '../ImagePreview';

export const QuickEditDrawer: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { isLiveEditMode, activeTarget, closeEditor, setHasUnsavedChanges } = useLiveEdit();
  const { siteSettings, updateSiteSettings, updateSingleBlock, logActivity } = useContent();

  // STRICT GUARD: Only show drawer if admin is authenticated, in live edit mode, and clicked an edit target
  if (!isAuthenticated || !isLiveEditMode || !activeTarget) {
    return null;
  }

  const handleBlockChange = (updatedBlock: any) => {
    if (activeTarget.pageId) {
      updateSingleBlock(activeTarget.pageId, updatedBlock);
      setHasUnsavedChanges(true);
      logActivity('UPDATE_BLOCK', 'VisualEditor', `Edited block ${updatedBlock.id} live`);
    }
  };

  const handleSettingsChange = (field: string, value: any) => {
    const updated = { ...siteSettings, [field]: value };
    updateSiteSettings(updated);
    setHasUnsavedChanges(true);
    logActivity('UPDATE_SETTINGS', 'VisualEditor', `Edited ${field} live`);
  };

  return (
    <div className="fixed inset-0 z-[9995] flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeEditor}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col z-10 animate-slide-left overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="text-xl">✏️</span>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Edit {activeTarget.title || 'Section'}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Live changes reflect on the page immediately
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeEditor}
            className="w-8 h-8 rounded-full bg-slate-200/60 dark:bg-slate-700 hover:bg-slate-300 text-slate-600 dark:text-slate-200 flex items-center justify-center font-bold text-xs transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Target Type: Block */}
          {activeTarget.type === 'block' && activeTarget.block && (
            <BlockPropertyInspectorWithApply
              block={activeTarget.block}
              onChange={handleBlockChange}
              onSaved={() => {
                closeEditor();
              }}
            />
          )}

          {/* Target Type: Header */}
          {activeTarget.type === 'header' && (
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Header Branding & Titles
              </h4>
              <BilingualInput
                label="Village Site Title"
                value={siteSettings.siteName}
                onChange={(val) => handleSettingsChange('siteName', val)}
              />
              <BilingualInput
                label="Header Tagline"
                value={siteSettings.siteTagline}
                onChange={(val) => handleSettingsChange('siteTagline', val)}
              />
            </div>
          )}

          {/* Target Type: Footer */}
          {activeTarget.type === 'footer' && (
            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Footer Tagline & Helplines
              </h4>
              <BilingualInput
                label="Footer Tagline"
                value={siteSettings.footerTagline}
                onChange={(val) => handleSettingsChange('footerTagline', val)}
                multiline
                rows={2}
              />
              <BilingualInput
                label="Copyright Text"
                value={siteSettings.footerCopyright}
                onChange={(val) => handleSettingsChange('footerCopyright', val)}
              />
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Contact Phone / Helpline
                </label>
                <input
                  type="text"
                  value={siteSettings.contactPhone || ''}
                  onChange={(e) => handleSettingsChange('contactPhone', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-end">
          <button
            type="button"
            onClick={closeEditor}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-xs font-bold shadow-xs transition-all"
          >
            Done Editing ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickEditDrawer;
