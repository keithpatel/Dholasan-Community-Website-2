import React, { useState, useMemo } from 'react';
import { useContent } from '../../context/ContentContext';
import { SiteSettings, TranslatableString } from '../../types';
import BilingualInput from '../../components/admin/BilingualInput';
import * as store from '../../data/contentStore';

const GROUPS: { id: string; label: string; prefix: string }[] = [
  { id: 'home', label: 'Home Page', prefix: 'home.' },
  { id: 'about', label: 'About Page', prefix: 'about.' },
  { id: 'community', label: 'Community Page', prefix: 'community.' },
  { id: 'events', label: 'Events Page', prefix: 'events.' },
  { id: 'gallery', label: 'Gallery Page', prefix: 'gallery.' },
  { id: 'businesses', label: 'Businesses Page', prefix: 'businesses.' },
  { id: 'contact', label: 'Contact Page', prefix: 'contact.' },
  { id: 'footer', label: 'Footer', prefix: 'footer.' },
];

const ManageLabels: React.FC = () => {
  const { siteSettings, updateSiteSettings, logActivity } = useContent();
  const [formData, setFormData] = useState<SiteSettings>(() => ({
    ...siteSettings,
    labels: { ...store.defaultLabels, ...(siteSettings.labels || {}) },
  }));
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeGroup, setActiveGroup] = useState('home');
  const [query, setQuery] = useState('');

  const labels = { ...store.defaultLabels, ...(formData.labels || {}) };

  const setLabel = (key: string, val: TranslatableString) => {
    setFormData((prev) => ({ ...prev, labels: { ...prev.labels, [key]: val } }));
  };

  const handleSave = () => {
    updateSiteSettings(formData);
    logActivity('UPDATE', 'Page Copy', 'Saved page text labels');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const group = GROUPS.find((g) => g.id === activeGroup) || GROUPS[0];
  const keys = useMemo(() => {
    const all = Object.keys(labels)
      .filter((k) => k.startsWith(group.prefix))
      .sort();
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((k) => (labels[k].en || '').toLowerCase().includes(q) || (labels[k].gu || '').toLowerCase().includes(q) || k.includes(q));
  }, [labels, group, query]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Page Text Content</h1>
          <p className="text-sm text-gray-500">Change every heading, intro paragraph, button and label on the public website (English & Gujarati).</p>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all"
        >
          {saveSuccess ? '✓ Saved!' : 'Save All Text'}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {GROUPS.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGroup(g.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                activeGroup === g.id
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-gray-100 text-gray-500 hover:text-gray-800'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>

        <div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search labels..."
            className="w-full max-w-sm px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="space-y-4">
          {keys.length === 0 && <div className="py-10 text-center text-gray-500">No labels found for "{group.label}"{query ? ` matching "${query}"` : ''}.</div>}
          {keys.map((key) => (
            <div key={key} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
              <code className="text-xs text-orange-600 font-mono block mb-3">{key}</code>
              <BilingualInput label="Text" value={labels[key]} onChange={(val) => setLabel(key, val)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageLabels;