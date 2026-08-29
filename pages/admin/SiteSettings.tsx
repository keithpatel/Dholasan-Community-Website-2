import React, { useState, useMemo } from 'react';
import { useContent, normalizeHexColor } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { exportAllData, importAllData, getSiteSettings } from '../../data/contentStore';
import BilingualInput from '../../components/admin/BilingualInput';
import ImagePreview from '../../components/admin/ImagePreview';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

type SettingsTab = 'general' | 'about' | 'community' | 'theme' | 'contact' | 'security';

const TABS: { id: SettingsTab; label: string; icon: string; desc: string }[] = [
  { id: 'general', label: 'General & Branding', icon: '🏷️', desc: 'Site name, taglines, hero banner & footer' },
  { id: 'about', label: 'About & Village Facts', icon: '📜', desc: 'Village history, stats table & connectivity' },
  { id: 'community', label: 'Community & Governance', icon: '👥', desc: 'Panchayat members, gallery categories & info' },
  { id: 'theme', label: 'Theme & Colors', icon: '🎨', desc: 'Visual palette, accent colors & live preview' },
  { id: 'contact', label: 'Contact & Social', icon: '☎️', desc: 'Helplines, address, social links & Google Maps' },
  { id: 'security', label: 'Security & Backup', icon: '🔐', desc: 'Admin password, cloud sync & data snapshots' },
];

const SiteSettings: React.FC = () => {
  const {
    siteSettings,
    updateSiteSettings,
    resetAll,
    refreshAll,
    logActivity,
    syncStatus,
    syncError,
    backups,
    restoreBackup,
    clearBackups,
  } = useContent();

  const { changePassword } = useAuth();

  const [formData, setFormData] = useState(siteSettings);
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Import / Export state
  const [importJson, setImportJson] = useState('');
  const [importMsg, setImportMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Dialogs
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [restoreCandidate, setRestoreCandidate] = useState<string | null>(null);

  const updateField = (updater: (prev: typeof formData) => typeof formData) => {
    setFormData((prev) => {
      const next = updater(prev);
      setIsDirty(true);
      return next;
    });
  };

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const sanitized = {
      ...formData,
      themeColors: {
        primary: normalizeHexColor(formData.themeColors?.primary, '#F97316'),
        secondary: normalizeHexColor(formData.themeColors?.secondary, '#1E3A8A'),
      },
    };
    setFormData(sanitized);
    updateSiteSettings(sanitized);
    logActivity('UPDATE_SETTINGS', 'Settings', 'Saved global site settings');
    setIsDirty(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    const result = await changePassword(currentPassword, newPassword);
    if (result.ok) {
      setPasswordMsg({ type: 'success', text: 'Password successfully updated!' });
      setCurrentPassword('');
      setNewPassword('');
      logActivity('SECURITY', 'Auth', 'Changed admin password');
    } else {
      setPasswordMsg({ type: 'error', text: result.error || 'Current password is incorrect.' });
    }
  };

  const handleExport = () => {
    const jsonStr = exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dholasan_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    logActivity('EXPORT', 'Backup', 'Exported JSON backup');
  };

  const handleImport = () => {
    try {
      importAllData(importJson);
      refreshAll();
      setFormData(getSiteSettings());
      setImportMsg({ type: 'success', text: 'Data imported successfully!' });
      setImportJson('');
      setIsDirty(false);
      logActivity('IMPORT', 'Backup', 'Imported JSON backup');
    } catch (e) {
      setImportMsg({ type: 'error', text: 'Invalid JSON structure.' });
    }
  };

  const handleReset = () => {
    resetAll();
    setFormData(getSiteSettings());
    setIsDirty(false);
    logActivity('RESET', 'System', 'Reset all content to factory defaults');
  };

  // Helper for key facts
  const handleKeyFactChange = (index: number, field: 'label' | 'value', val: { en: string; gu: string }) => {
    const facts = [...formData.aboutKeyFacts];
    facts[index] = { ...facts[index], [field]: val };
    updateField((prev) => ({ ...prev, aboutKeyFacts: facts }));
  };

  const addKeyFact = () => {
    const newFact = {
      label: { en: 'New Fact', gu: 'નવી વિગત' },
      value: { en: 'Value', gu: 'મૂલ્ય' },
    };
    updateField((prev) => ({ ...prev, aboutKeyFacts: [...prev.aboutKeyFacts, newFact] }));
  };

  const removeKeyFact = (index: number) => {
    const facts = formData.aboutKeyFacts.filter((_, i) => i !== index);
    updateField((prev) => ({ ...prev, aboutKeyFacts: facts }));
  };

  // Helper for governance
  const handleGovChange = (index: number, field: 'role' | 'name', val: any) => {
    const members = [...formData.communityGovernance];
    members[index] = { ...members[index], [field]: val };
    updateField((prev) => ({ ...prev, communityGovernance: members }));
  };

  const addGovMember = () => {
    const newMember = {
      role: { en: 'Member', gu: 'સભ્ય' },
      name: 'New Member Name',
    };
    updateField((prev) => ({ ...prev, communityGovernance: [...prev.communityGovernance, newMember] }));
  };

  const removeGovMember = (index: number) => {
    const members = formData.communityGovernance.filter((_, i) => i !== index);
    updateField((prev) => ({ ...prev, communityGovernance: members }));
  };

  // Helper for gallery categories
  const handleCategoryChange = (index: number, val: { en: string; gu: string }) => {
    const cats = [...(formData.galleryCategories || [])];
    cats[index] = { ...cats[index], label: val };
    updateField((prev) => ({ ...prev, galleryCategories: cats }));
  };

  const addCategory = () => {
    const id = 'cat_' + Date.now().toString(36);
    const cats = [...(formData.galleryCategories || []), { id, label: { en: 'New Category', gu: 'નવી શ્રેણી' } }];
    updateField((prev) => ({ ...prev, galleryCategories: cats }));
  };

  const removeCategory = (index: number) => {
    const cats = (formData.galleryCategories || []).filter((_, i) => i !== index);
    updateField((prev) => ({ ...prev, galleryCategories: cats }));
  };

  const handleRestoreBackup = (id: string) => {
    if (restoreBackup(id)) {
      setFormData(getSiteSettings());
      setIsDirty(false);
      logActivity('RESTORE', 'Backup', 'Restored site content from a backup snapshot');
    }
  };

  const isSearchActive = searchQuery.trim().length > 0;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>⚙️</span> Global Site Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Configure site-wide branding, colors, leadership, contact helplines & backup snapshots.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isDirty && (
            <span className="text-xs font-semibold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full animate-pulse">
              ● Unsaved Changes
            </span>
          )}
          <button
            type="button"
            onClick={() => handleSaveAll()}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>{saveSuccess ? '✓' : '💾'}</span>
            <span>{saveSuccess ? 'Saved!' : 'Save All Settings'}</span>
          </button>
        </div>
      </div>

      {/* Cloud Sync Status Banner */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-base">☁️</span>
          <div>
            <span className="font-bold text-slate-900 dark:text-white">Cloud Storage Sync: </span>
            <span
              className={`font-semibold ${
                syncStatus === 'ok'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : syncStatus === 'error'
                  ? 'text-red-500 dark:text-red-400'
                  : 'text-amber-500'
              }`}
            >
              {syncStatus === 'ok'
                ? 'Connected & Syncing to Cloud'
                : syncStatus === 'error'
                ? `Sync issue: ${syncError || 'Local changes kept in offline cache'}`
                : 'Offline mode (saves locally)'}
            </span>
          </div>
        </div>
        <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
          {backups.length} automatic snapshots
        </span>
      </div>

      {/* Navigation Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id && !isSearchActive;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchQuery('');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Search Field */}
        <div className="relative min-w-[200px] sm:w-60">
          <input
            type="text"
            placeholder="Search all settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
          />
          <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1.5 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Settings Body */}
      <div className="space-y-6">
        {/* ========================================================= */}
        {/* TAB: GENERAL & BRANDING */}
        {/* ========================================================= */}
        {(activeTab === 'general' || isSearchActive) && (
          <div className="space-y-6">
            {/* Branding */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🏷️</span> Site Branding & Identity
              </h2>
              <BilingualInput
                label="Site Name (Header + Footer + Title)"
                value={formData.siteName}
                onChange={(val) => updateField((prev) => ({ ...prev, siteName: val }))}
              />
              <BilingualInput
                label="Site Tagline"
                value={formData.siteTagline}
                onChange={(val) => updateField((prev) => ({ ...prev, siteTagline: val }))}
              />
            </div>

            {/* Hero Section */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🏠</span> Default Hero Banner (Home Page)
              </h2>
              <BilingualInput
                label="Hero Title"
                value={formData.heroTitle}
                onChange={(val) => updateField((prev) => ({ ...prev, heroTitle: val }))}
              />
              <BilingualInput
                label="Hero Subtitle"
                value={formData.heroSubtitle}
                onChange={(val) => updateField((prev) => ({ ...prev, heroSubtitle: val }))}
              />
              <ImagePreview
                url={formData.heroImageUrl}
                onChange={(val) => updateField((prev) => ({ ...prev, heroImageUrl: val }))}
                label="Hero Background Image URL"
              />
            </div>

            {/* Footer */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🦶</span> Footer Tagline & Copyright
              </h2>
              <BilingualInput
                label="Footer Tagline"
                value={formData.footerTagline}
                onChange={(val) => updateField((prev) => ({ ...prev, footerTagline: val }))}
                multiline
                rows={2}
              />
              <BilingualInput
                label="Copyright Line"
                value={formData.footerCopyright}
                onChange={(val) => updateField((prev) => ({ ...prev, footerCopyright: val }))}
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: ABOUT & VILLAGE FACTS */}
        {/* ========================================================= */}
        {(activeTab === 'about' || isSearchActive) && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>📜</span> Village History & Background
              </h2>
              <BilingualInput
                label="Village History Text"
                value={formData.aboutHistory}
                onChange={(val) => updateField((prev) => ({ ...prev, aboutHistory: val }))}
                multiline
                rows={5}
              />

              {/* Key Facts Table */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Dholasan Key Facts Table ({formData.aboutKeyFacts.length} rows)
                  </label>
                  <button
                    type="button"
                    onClick={addKeyFact}
                    className="text-xs text-orange-500 font-bold hover:underline"
                  >
                    + Add Fact Row
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.aboutKeyFacts.map((fact, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col md:flex-row gap-3 items-center"
                    >
                      <div className="flex-1 w-full">
                        <BilingualInput
                          label={`Label #${idx + 1}`}
                          value={fact.label}
                          onChange={(val) => handleKeyFactChange(idx, 'label', val)}
                        />
                      </div>
                      <div className="flex-1 w-full">
                        <BilingualInput
                          label={`Value #${idx + 1}`}
                          value={fact.value}
                          onChange={(val) => handleKeyFactChange(idx, 'value', val)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeKeyFact(idx)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg text-xs font-bold self-end md:self-center"
                        title="Delete fact"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <BilingualInput
                label="Connectivity Info Text"
                value={formData.aboutConnectivity}
                onChange={(val) => updateField((prev) => ({ ...prev, aboutConnectivity: val }))}
                multiline
                rows={3}
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: COMMUNITY & GOVERNANCE */}
        {/* ========================================================= */}
        {(activeTab === 'community' || isSearchActive) && (
          <div className="space-y-6">
            {/* Governance */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>👥</span> Gram Panchayat Governance Members
                </h2>
                <button
                  type="button"
                  onClick={addGovMember}
                  className="text-xs text-orange-500 font-bold hover:underline"
                >
                  + Add Member
                </button>
              </div>

              <div className="space-y-3">
                {formData.communityGovernance.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col md:flex-row gap-3 items-center"
                  >
                    <div className="flex-1 w-full">
                      <BilingualInput
                        label="Role / Title"
                        value={member.role}
                        onChange={(val) => handleGovChange(idx, 'role', val)}
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Member Full Name
                      </label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleGovChange(idx, 'name', e.target.value)}
                        className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeGovMember(idx)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg text-xs font-bold"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery Categories */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>🏷️</span> Photo Gallery Categories
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Filter tabs shown on the public gallery page.</p>
                </div>
                <button
                  type="button"
                  onClick={addCategory}
                  className="text-xs text-orange-500 font-bold hover:underline"
                >
                  + Add Category
                </button>
              </div>

              <div className="space-y-3">
                {(formData.galleryCategories || []).map((cat, idx) => (
                  <div
                    key={cat.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3"
                  >
                    <div className="flex-1">
                      <BilingualInput
                        label={`Category #${idx + 1}`}
                        value={cat.label}
                        onChange={(val) => handleCategoryChange(idx, val)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCategory(idx)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg text-xs font-bold"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Healthcare */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🏥</span> Public Facilities & Infrastructure Notes
              </h2>
              <BilingualInput
                label="Education Info Text"
                value={formData.communityEducation}
                onChange={(val) => updateField((prev) => ({ ...prev, communityEducation: val }))}
                multiline
                rows={3}
              />
              <BilingualInput
                label="Healthcare Info Text"
                value={formData.communityHealthcare}
                onChange={(val) => updateField((prev) => ({ ...prev, communityHealthcare: val }))}
                multiline
                rows={3}
              />
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: THEME & COLORS */}
        {/* ========================================================= */}
        {(activeTab === 'theme' || isSearchActive) && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>🎨</span> Site Theme & Brand Colors
            </h2>
            <p className="text-xs text-slate-400">
              Pick a curated color preset or set custom hex values to recolor the entire public website.
            </p>

            {/* Presets */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Popular Color Palettes:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Saffron & Navy', primary: '#EA580C', secondary: '#1E3A8A' },
                  { name: 'Sunset Amber & Slate', primary: '#F59E0B', secondary: '#0F172A' },
                  { name: 'Royal Emerald & Gold', primary: '#059669', secondary: '#D97706' },
                  { name: 'Ruby Crimson & Navy', primary: '#DC2626', secondary: '#1E1B4B' },
                  { name: 'Ocean Cyan & Indigo', primary: '#0284C7', secondary: '#312E81' },
                  { name: 'Royal Purple & Gold', primary: '#7C3AED', secondary: '#B45309' },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      const updatedColors = { primary: preset.primary, secondary: preset.secondary };
                      updateField((prev) => ({ ...prev, themeColors: updatedColors }));
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:scale-105 transition-all"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Primary Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.themeColors?.primary || '#EA580C'}
                    onChange={(e) => {
                      const newPrimary = e.target.value;
                      updateField((prev) => ({
                        ...prev,
                        themeColors: { ...prev.themeColors, primary: newPrimary },
                      }));
                    }}
                    className="w-14 h-11 rounded-xl bg-white border border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.themeColors?.primary || '#EA580C'}
                    onChange={(e) => {
                      const newPrimary = e.target.value;
                      updateField((prev) => ({
                        ...prev,
                        themeColors: { ...prev.themeColors, primary: newPrimary },
                      }));
                    }}
                    className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Secondary Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.themeColors?.secondary || '#1E3A8A'}
                    onChange={(e) => {
                      const newSec = e.target.value;
                      updateField((prev) => ({
                        ...prev,
                        themeColors: { ...prev.themeColors, secondary: newSec },
                      }));
                    }}
                    className="w-14 h-11 rounded-xl bg-white border border-slate-300 dark:border-slate-700 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.themeColors?.secondary || '#1E3A8A'}
                    onChange={(e) => {
                      const newSec = e.target.value;
                      updateField((prev) => ({
                        ...prev,
                        themeColors: { ...prev.themeColors, secondary: newSec },
                      }));
                    }}
                    className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: CONTACT & SOCIAL */}
        {/* ========================================================= */}
        {(activeTab === 'contact' || isSearchActive) && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>☎️</span> Contact Helplines, Address & Social Media
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => updateField((prev) => ({ ...prev, contactEmail: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Contact Phone / Helpline
                </label>
                <input
                  type="text"
                  value={formData.contactPhone}
                  onChange={(e) => updateField((prev) => ({ ...prev, contactPhone: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Physical Address
              </label>
              <input
                type="text"
                value={formData.contactAddress}
                onChange={(e) => updateField((prev) => ({ ...prev, contactAddress: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Facebook URL</label>
                <input
                  type="text"
                  value={formData.socialFacebook}
                  onChange={(e) => updateField((prev) => ({ ...prev, socialFacebook: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Instagram URL</label>
                <input
                  type="text"
                  value={formData.socialInstagram}
                  onChange={(e) => updateField((prev) => ({ ...prev, socialInstagram: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">YouTube URL</label>
                <input
                  type="text"
                  value={formData.socialYoutube}
                  onChange={(e) => updateField((prev) => ({ ...prev, socialYoutube: e.target.value }))}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Google Maps Embed URL (About + Contact pages)
              </label>
              <input
                type="text"
                value={formData.mapEmbedUrl}
                onChange={(e) => updateField((prev) => ({ ...prev, mapEmbedUrl: e.target.value }))}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-xs"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Tip: Google Maps → Share → "Embed a map" → copy the <code>iframe src</code> URL.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB: SECURITY & BACKUP */}
        {/* ========================================================= */}
        {(activeTab === 'security' || isSearchActive) && (
          <div className="space-y-6">
            {/* Password */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🔐</span> Admin Security (Change Password)
              </h2>
              {passwordMsg && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium ${
                    passwordMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {passwordMsg.text}
                </div>
              )}
              <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="py-2.5 px-4 bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-900 font-bold text-xs rounded-xl shadow-xs transition-all"
                >
                  Update Password
                </button>
              </form>
            </div>

            {/* Backup, Import & Export */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>💾</span> Backup, Restore & Data Reset
              </h2>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleExport}
                  className="flex-1 py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 transition-all"
                >
                  <span>📥</span> Export Full Data Backup (JSON)
                </button>
                <button
                  type="button"
                  onClick={() => setIsResetDialogOpen(true)}
                  className="py-3 px-4 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl border border-red-200 dark:border-red-900/60 transition-all"
                >
                  ⚠️ Reset All Data to Defaults
                </button>
              </div>

              {/* Restore from JSON */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Restore Data from Backup JSON
                </label>
                {importMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold ${
                      importMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {importMsg.text}
                  </div>
                )}
                <textarea
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  placeholder="Paste exported JSON string here..."
                  rows={3}
                  className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={!importJson.trim()}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Import JSON Data
                </button>
              </div>

              {/* Automatic Snapshots */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Automatic Snapshots ({backups.length} of 15)
                  </label>
                  {backups.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        clearBackups();
                        logActivity('CLEAR_BACKUPS', 'Backup', 'Cleared all backup snapshots');
                      }}
                      className="px-3 py-1 text-xs font-medium text-slate-400 hover:text-slate-600"
                    >
                      Clear History
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Every time you save news, events, gallery or settings, an automatic snapshot is saved.
                </p>
                {backups.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    No snapshots yet — they appear here automatically as you make changes.
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                    {backups.map((backup) => (
                      <div
                        key={backup.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs"
                      >
                        <div>
                          <div className="text-slate-800 dark:text-slate-200 font-semibold">
                            {new Date(backup.timestamp).toLocaleString()}
                          </div>
                          <div className="text-slate-400 text-[11px]">{backup.label}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setRestoreCandidate(backup.id)}
                          className="px-3 py-1.5 text-xs font-bold bg-slate-900 hover:bg-black text-white dark:bg-white dark:text-slate-900 rounded-lg transition-colors"
                        >
                          Restore
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Save Bar when dirty */}
      {isDirty && (
        <div className="sticky bottom-6 z-40 bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-800 dark:border-slate-200 flex items-center justify-between gap-4 animate-slide-up">
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-amber-400 text-base">⚠️</span>
            <span>You have unsaved changes across settings.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setFormData(getSiteSettings());
                setIsDirty(false);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white dark:hover:text-slate-900"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={() => handleSaveAll()}
              className="px-5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
            >
              Save Now ✓
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={handleReset}
        title="Reset All Site Content"
        message="Are you sure you want to reset all content to original defaults? All customized articles, events, photos and settings will be permanently wiped."
        confirmText="Wipe & Reset"
      />

      <ConfirmDialog
        isOpen={!!restoreCandidate}
        onClose={() => setRestoreCandidate(null)}
        onConfirm={() => {
          if (restoreCandidate) handleRestoreBackup(restoreCandidate);
          setRestoreCandidate(null);
        }}
        title="Restore This Backup?"
        message="All current news, events, gallery, businesses and settings will be replaced with this backup snapshot. You can restore again later if needed."
        confirmText="Restore Backup"
      />
    </div>
  );
};

export default SiteSettings;
