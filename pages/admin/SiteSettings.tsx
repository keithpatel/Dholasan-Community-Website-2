
import React, { useState } from 'react';
import { useContent, normalizeHexColor } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';
import { exportAllData, importAllData, getSiteSettings } from '../../data/contentStore';
import BilingualInput from '../../components/admin/BilingualInput';
import ImagePreview from '../../components/admin/ImagePreview';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { KeyFact, GovernanceMember, GalleryCategoryItem } from '../../types';

const SiteSettings: React.FC = () => {
  const { siteSettings, updateSiteSettings, resetAll, refreshAll, logActivity, syncStatus, syncError, backups, restoreBackup, clearBackups } = useContent();
  const { changePassword } = useAuth();

  const [formData, setFormData] = useState(siteSettings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Import / Export state
  const [importJson, setImportJson] = useState('');
  const [importMsg, setImportMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Danger reset dialog
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [restoreCandidate, setRestoreCandidate] = useState<string | null>(null);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    // Sanitize colors so invalid/partial hex values never reach the database.
    const sanitized = {
      ...formData,
      themeColors: {
        primary: normalizeHexColor(formData.themeColors?.primary, '#F97316'),
        secondary: normalizeHexColor(formData.themeColors?.secondary, '#1E3A8A'),
      },
    };
    setFormData(sanitized);
    updateSiteSettings(sanitized);
    logActivity('UPDATE_SETTINGS', 'Settings', 'Saved site settings changes');
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
      setFormData(siteSettings);
      setImportMsg({ type: 'success', text: 'Data imported successfully!' });
      setImportJson('');
      logActivity('IMPORT', 'Backup', 'Imported JSON backup');
    } catch (e) {
      setImportMsg({ type: 'error', text: 'Invalid JSON structure.' });
    }
  };

  const handleReset = () => {
    resetAll();
    setFormData(siteSettings);
    logActivity('RESET', 'System', 'Reset all content to factory defaults');
  };

  // Helper for key facts
  const handleKeyFactChange = (index: number, field: 'label' | 'value', val: { en: string; gu: string }) => {
    const facts = [...formData.aboutKeyFacts];
    facts[index] = { ...facts[index], [field]: val };
    setFormData({ ...formData, aboutKeyFacts: facts });
  };

  const addKeyFact = () => {
    const facts = [...formData.aboutKeyFacts, { label: { en: 'New Fact', gu: 'નવી હકીકત' }, value: { en: 'Value', gu: 'મૂલ્ય' } }];
    setFormData({ ...formData, aboutKeyFacts: facts });
  };

  const removeKeyFact = (index: number) => {
    const facts = formData.aboutKeyFacts.filter((_, i) => i !== index);
    setFormData({ ...formData, aboutKeyFacts: facts });
  };

  // Helper for governance
  const handleGovChange = (index: number, field: 'role' | 'name', val: any) => {
    const members = [...formData.communityGovernance];
    members[index] = { ...members[index], [field]: val };
    setFormData({ ...formData, communityGovernance: members });
  };

  const addGovMember = () => {
    const members = [...formData.communityGovernance, { role: { en: 'Member', gu: 'સભ્ય' }, name: 'Name Here' }];
    setFormData({ ...formData, communityGovernance: members });
  };

  const removeGovMember = (index: number) => {
    const members = formData.communityGovernance.filter((_, i) => i !== index);
    setFormData({ ...formData, communityGovernance: members });
  };

  // Helper for gallery categories
  const handleCategoryChange = (index: number, val: { en: string; gu: string }) => {
    const cats = [...formData.galleryCategories];
    cats[index] = { ...cats[index], label: val };
    setFormData({ ...formData, galleryCategories: cats });
  };

  const addCategory = () => {
    const id = 'cat_' + Date.now().toString(36);
    const cats = [...formData.galleryCategories, { id, label: { en: 'New Category', gu: 'નવી શ્રેણી' } }];
    setFormData({ ...formData, galleryCategories: cats });
  };

  const removeCategory = (index: number) => {
    const cats = formData.galleryCategories.filter((_, i) => i !== index);
    setFormData({ ...formData, galleryCategories: cats });
  };

  const handleRestoreBackup = (id: string) => {
    if (restoreBackup(id)) {
      setFormData(getSiteSettings());
      logActivity('RESTORE', 'Backup', 'Restored site content from a backup snapshot');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Global Site Settings</h1>
          <p className="text-sm text-gray-600">Manage hero banners, about page history, contact details, social links & security.</p>
        </div>
        <button
          onClick={handleSaveAll}
          className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2"
        >
          {saveSuccess ? '✓ Saved!' : 'Save All Settings'}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span>☁️</span> Cloud Sync Status
        </h2>
        <div className={`p-3 rounded-xl text-sm font-medium border ${
          syncStatus === 'ok'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : syncStatus === 'error'
            ? 'bg-red-50 text-red-700 border-red-200'
            : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}>
          {syncStatus === 'ok'
            ? 'All changes are being saved to the cloud (Firestore).'
            : syncStatus === 'error'
            ? (
              <>
                Cloud sync failed: {syncError || 'check the browser console (F12) for details'}.
                Changes are kept locally for now.
              </>
            )
            : 'You are offline. Changes are stored locally and will sync when you reconnect.'}
        </div>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-8">
        {/* Section 0: Branding */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span>🏷️</span> Site Branding & Identity
          </h2>
          <BilingualInput
            label="Site Name (header + footer + title)"
            value={formData.siteName}
            onChange={(val) => setFormData({ ...formData, siteName: val })}
          />
          <BilingualInput
            label="Site Tagline"
            value={formData.siteTagline}
            onChange={(val) => setFormData({ ...formData, siteTagline: val })}
          />
        </div>

        {/* Section 1: Hero Banner Settings */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span>🏠</span> Hero Section (Home Page)
          </h2>
          <BilingualInput
            label="Hero Title"
            value={formData.heroTitle}
            onChange={(val) => setFormData({ ...formData, heroTitle: val })}
          />
          <BilingualInput
            label="Hero Subtitle"
            value={formData.heroSubtitle}
            onChange={(val) => setFormData({ ...formData, heroSubtitle: val })}
          />
          <ImagePreview
            url={formData.heroImageUrl}
            onChange={(val) => setFormData({ ...formData, heroImageUrl: val })}
            label="Hero Background Image URL"
          />
        </div>

        {/* Section 2: About Page Settings */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span>📋</span> About Page Configuration
          </h2>
          <BilingualInput
            label="Village History Text"
            value={formData.aboutHistory}
            onChange={(val) => setFormData({ ...formData, aboutHistory: val })}
            multiline
            rows={5}
          />

          {/* Key Facts Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Dholasan Key Facts Table</label>
              <button
                type="button"
                onClick={addKeyFact}
                className="text-xs text-orange-400 hover:underline"
              >
                + Add Fact Row
              </button>
            </div>
            <div className="space-y-3">
              {formData.aboutKeyFacts.map((fact, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-3 items-center">
                  <div className="flex-1 w-full">
                    <BilingualInput label={`Label #${idx + 1}`} value={fact.label} onChange={(val) => handleKeyFactChange(idx, 'label', val)} />
                  </div>
                  <div className="flex-1 w-full">
                    <BilingualInput label={`Value #${idx + 1}`} value={fact.value} onChange={(val) => handleKeyFactChange(idx, 'value', val)} />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeKeyFact(idx)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg self-end md:self-center"
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
            onChange={(val) => setFormData({ ...formData, aboutConnectivity: val })}
            multiline
            rows={3}
          />
        </div>

        {/* Section 3: Community Page Settings */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span>👥</span> Community Page Content
          </h2>

          {/* Governance Members */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Gram Panchayat Governance Members</label>
              <button type="button" onClick={addGovMember} className="text-xs text-orange-400 hover:underline">
                + Add Member
              </button>
            </div>
            <div className="space-y-3">
              {formData.communityGovernance.map((member, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-3 items-center">
                  <div className="flex-1 w-full">
                    <BilingualInput label="Role" value={member.role} onChange={(val) => handleGovChange(idx, 'role', val)} />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Member Name</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleGovChange(idx, 'name', e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGovMember(idx)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>

          <BilingualInput
            label="Education Info Text"
            value={formData.communityEducation}
            onChange={(val) => setFormData({ ...formData, communityEducation: val })}
            multiline
            rows={3}
          />

          <BilingualInput
            label="Healthcare Info Text"
            value={formData.communityHealthcare}
            onChange={(val) => setFormData({ ...formData, communityHealthcare: val })}
            multiline
            rows={3}
          />
        </div>

        {/* Section 3.5: Gallery Categories */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span>🏷️</span> Photo Gallery Categories
          </h2>
          <p className="text-sm text-gray-600">Create your own gallery categories (e.g. Temples, Weddings). They appear as filter tabs on the Gallery page.</p>
          <div className="space-y-3">
            {(formData.galleryCategories || []).map((cat, idx) => (
              <div key={cat.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-3 items-center">
                <div className="flex-1 w-full">
                  <BilingualInput label={`Category #${idx + 1}`} value={cat.label} onChange={(val) => handleCategoryChange(idx, val)} />
                </div>
                <button
                  type="button"
                  onClick={() => removeCategory(idx)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addCategory} className="text-xs text-orange-400 hover:underline">
            + Add Category
          </button>
        </div>

        {/* Section 3.6: Theme Colors */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span>🎨</span> Site Colors (Theme)
              </h2>
              <p className="text-sm text-gray-600">These colors recolor the whole public website live.</p>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
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
                    setFormData({ ...formData, themeColors: updatedColors });
                    const sanitized = {
                      ...formData,
                      themeColors: {
                        primary: normalizeHexColor(preset.primary, '#EA580C'),
                        secondary: normalizeHexColor(preset.secondary, '#1E3A8A'),
                      },
                    };
                    updateSiteSettings(sanitized);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-400 bg-gray-50 text-xs font-medium text-gray-700 transition-all hover:scale-105"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: preset.primary }}
                  ></span>
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Accent Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.themeColors?.primary || '#EA580C'}
                  onChange={(e) => {
                    const newPrimary = e.target.value;
                    const updated = { ...formData, themeColors: { ...formData.themeColors, primary: newPrimary } };
                    setFormData(updated);
                    updateSiteSettings({
                      ...updated,
                      themeColors: {
                        primary: normalizeHexColor(newPrimary, '#EA580C'),
                        secondary: normalizeHexColor(formData.themeColors?.secondary, '#1E3A8A'),
                      },
                    });
                  }}
                  className="w-14 h-11 rounded-lg bg-white border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.themeColors?.primary || '#EA580C'}
                  onChange={(e) => {
                    const newPrimary = e.target.value;
                    const updated = { ...formData, themeColors: { ...formData.themeColors, primary: newPrimary } };
                    setFormData(updated);
                    if (/^#[0-9A-Fa-f]{6}$/.test(newPrimary)) {
                      updateSiteSettings({
                        ...updated,
                        themeColors: {
                          primary: newPrimary,
                          secondary: normalizeHexColor(formData.themeColors?.secondary, '#1E3A8A'),
                        },
                      });
                    }
                  }}
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Accent Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={formData.themeColors?.secondary || '#1E3A8A'}
                  onChange={(e) => {
                    const newSec = e.target.value;
                    const updated = { ...formData, themeColors: { ...formData.themeColors, secondary: newSec } };
                    setFormData(updated);
                    updateSiteSettings({
                      ...updated,
                      themeColors: {
                        primary: normalizeHexColor(formData.themeColors?.primary, '#EA580C'),
                        secondary: normalizeHexColor(newSec, '#1E3A8A'),
                      },
                    });
                  }}
                  className="w-14 h-11 rounded-lg bg-white border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.themeColors?.secondary || '#1E3A8A'}
                  onChange={(e) => {
                    const newSec = e.target.value;
                    const updated = { ...formData, themeColors: { ...formData.themeColors, secondary: newSec } };
                    setFormData(updated);
                    if (/^#[0-9A-Fa-f]{6}$/.test(newSec)) {
                      updateSiteSettings({
                        ...updated,
                        themeColors: {
                          primary: normalizeHexColor(formData.themeColors?.primary, '#EA580C'),
                          secondary: newSec,
                        },
                      });
                    }
                  }}
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3.7: Footer Settings */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span>🦶</span> Footer Settings
          </h2>
          <BilingualInput
            label="Footer Tagline"
            value={formData.footerTagline}
            onChange={(val) => setFormData({ ...formData, footerTagline: val })}
            multiline
            rows={2}
          />
          <BilingualInput
            label="Copyright Line"
            value={formData.footerCopyright}
            onChange={(val) => setFormData({ ...formData, footerCopyright: val })}
          />
        </div>

        {/* Section 4: Contact & Social Settings */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span>📞</span> Contact & Social Media Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Physical Address</label>
            <input
              type="text"
              value={formData.contactAddress}
              onChange={(e) => setFormData({ ...formData, contactAddress: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Facebook URL</label>
              <input
                type="text"
                value={formData.socialFacebook}
                onChange={(e) => setFormData({ ...formData, socialFacebook: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Instagram URL</label>
              <input
                type="text"
                value={formData.socialInstagram}
                onChange={(e) => setFormData({ ...formData, socialInstagram: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">YouTube URL</label>
              <input
                type="text"
                value={formData.socialYoutube}
                onChange={(e) => setFormData({ ...formData, socialYoutube: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs text-gray-900"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Embed URL (About + Contact pages)</label>
            <input
              type="text"
              value={formData.mapEmbedUrl}
              onChange={(e) => setFormData({ ...formData, mapEmbedUrl: e.target.value })}
              placeholder="https://www.google.com/maps/embed?pb=..."
className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 font-mono text-xs"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tip: open Google Maps → Share → "Embed a map" → copy the <code>iframe src</code> URL.
            </p>
          </div>
        </div>
      </form>

      {/* Section 5: Password & Security */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span>🔐</span> Admin Security (Change Password)
        </h2>
        {passwordMsg && (
          <div
            className={`p-3 rounded-xl text-xs font-medium ${
              passwordMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {passwordMsg.text}
          </div>
        )}
        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="py-2.5 px-4 bg-gray-100 hover:bg-orange-500 text-gray-700 hover:text-white font-medium text-sm rounded-lg border border-gray-200 transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Section 6: Data Backup, Import & Export */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span>💾</span> Backup, Restore & Data Reset
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={handleExport}
            className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded-xl border border-gray-200 flex items-center justify-center gap-2 transition-all"
          >
            <span>📥</span> Export All Data as JSON
          </button>
          <button
            type="button"
            onClick={() => setIsResetDialogOpen(true)}
            className="py-3 px-4 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white font-medium text-sm rounded-xl border border-red-500/20 transition-all"
          >
            ⚠️ Reset All Data to Defaults
          </button>
        </div>

        {/* Restore from JSON */}
        <div className="pt-4 border-t border-gray-200 space-y-3">
          <label className="block text-sm font-medium text-gray-700">Restore Data from Backup JSON</label>
          {importMsg && (
            <div
              className={`p-3 rounded-xl text-xs font-medium ${
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
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 font-mono text-xs"
          />
          <button
            type="button"
            onClick={handleImport}
            disabled={!importJson.trim()}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium text-xs rounded-lg transition-colors"
          >
            Import JSON Data
          </button>
        </div>

        {/* Automatic Backups */}
        <div className="pt-4 border-t border-gray-200 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="block text-sm font-medium text-gray-700">Automatic Backups (last {backups.length} of 15)</label>
            {backups.length > 0 && (
              <button
                type="button"
                onClick={() => { clearBackups(); logActivity('CLEAR_BACKUPS', 'Backup', 'Cleared all backup snapshots'); }}
                className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Clear Backups
              </button>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Every time you save news, events, gallery, businesses or settings, a snapshot is stored automatically. Restore any version below.
          </p>
          {backups.length === 0 ? (
            <div className="py-6 text-center text-gray-500 text-sm">No backups yet — they appear here as you make edits.</div>
          ) : (
            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {backups.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                  <div>
                    <div className="text-gray-700 font-medium">{new Date(backup.timestamp).toLocaleString()}</div>
                    <div className="text-gray-500">{backup.label}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRestoreCandidate(backup.id)}
                    className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-orange-500 text-gray-700 hover:text-white rounded-lg transition-colors"
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
