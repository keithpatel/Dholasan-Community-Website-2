import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { SiteSettings, NavLinkItem } from '../../types';
import BilingualInput from '../../components/admin/BilingualInput';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const ManageNavigation: React.FC = () => {
  const { siteSettings, updateSiteSettings, logActivity } = useContent();
  const [formData, setFormData] = useState(siteSettings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<NavLinkItem | null>(null);

  const navLinks = formData.navLinks || [];

  const updateNav = (navLinks: NavLinkItem[]) => {
    setFormData((prev: SiteSettings) => ({ ...prev, navLinks }));
  };

  const handleSave = () => {
    updateSiteSettings(formData);
    logActivity('UPDATE', 'Navigation', 'Saved navigation menu changes');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleEdit = (idx: number, field: keyof NavLinkItem, val: any) => {
    const next = [...navLinks];
    next[idx] = { ...next[idx], [field]: val };
    updateNav(next);
  };

  const handleAdd = () => {
    const newItem: NavLinkItem = {
      id: 'nav_' + Date.now().toString(36),
      label: { en: 'New Page', gu: 'નવું પેજ' },
      path: '/new-page',
      enabled: true,
    };
    updateNav([...navLinks, newItem]);
  };

  const handleRemove = () => {
    if (!deleteCandidate) return;
    updateNav(navLinks.filter((l) => l.id !== deleteCandidate.id));
    setDeleteCandidate(null);
  };

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...navLinks];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    updateNav(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Navigation Menu</h1>
          <p className="text-sm text-gray-500">Add, rename, reorder or hide the links shown in the site header.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 transition-all"
          >
            + Add Link
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all"
          >
            {saveSuccess ? '✓ Saved!' : 'Save Menu'}
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="text-sm text-gray-500">
          <span className="font-semibold text-gray-700">Tip:</span> Drag order with the arrows. Use the toggle to show/hide a link without deleting it. Links point to existing pages.
        </div>
        {navLinks.length === 0 && (
          <div className="py-10 text-center text-gray-500">No navigation links yet. Click "Add Link" to create one.</div>
        )}
        <div className="space-y-3">
          {navLinks.map((link, idx) => (
            <div key={link.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0}
                    className="p-1.5 text-gray-500 hover:text-gray-900 disabled:opacity-30 rounded-lg hover:bg-gray-100"
                    title="Move up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    onClick={() => move(idx, 1)}
                    disabled={idx === navLinks.length - 1}
                    className="p-1.5 text-gray-500 hover:text-gray-900 disabled:opacity-30 rounded-lg hover:bg-gray-100"
                    title="Move down"
                  >
                    ▼
                  </button>
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={link.enabled}
                    onChange={(e) => handleEdit(idx, 'enabled', e.target.checked)}
                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  {link.enabled ? 'Visible' : 'Hidden'}
                </label>
                <button
                  type="button"
                  onClick={() => setDeleteCandidate(link)}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                >
                  🗑️
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <BilingualInput label="Menu Label" value={link.label} onChange={(val) => handleEdit(idx, 'label', val)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Page Path</label>
                  <input
                    type="text"
                    value={link.path}
                    onChange={(e) => handleEdit(idx, 'path', e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">e.g. /about, /events, /contact</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteCandidate}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleRemove}
        title="Remove Navigation Link"
        message={`Remove "${deleteCandidate?.label.en}" from the menu?`}
        confirmText="Remove"
      />
    </div>
  );
};

export default ManageNavigation;