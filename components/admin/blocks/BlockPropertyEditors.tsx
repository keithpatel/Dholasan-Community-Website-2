import React, { useState } from 'react';
import { PageBlockConfig, TranslatableString, BlockStyleConfig } from '../../../types';

interface EditorProps<T = any> {
  props: T;
  onChange: (updatedProps: T) => void;
}

// --- Bilingual Field Helper ---
export const TranslatableInput: React.FC<{
  label: string;
  value?: TranslatableString;
  onChange: (val: TranslatableString) => void;
  isTextArea?: boolean;
  rows?: number;
  placeholderEn?: string;
  placeholderGu?: string;
}> = ({ label, value = { en: '', gu: '' }, onChange, isTextArea, rows = 3, placeholderEn, placeholderGu }) => {
  const [activeLang, setActiveLang] = useState<'en' | 'gu'>('en');

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {label}
        </label>
        <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setActiveLang('en')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              activeLang === 'en'
                ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('gu')}
            className={`px-2 py-0.5 rounded-md transition-all ${
              activeLang === 'gu'
                ? 'bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            ગુજરાતી
          </button>
        </div>
      </div>

      {isTextArea ? (
        <textarea
          rows={rows}
          value={activeLang === 'en' ? value.en || '' : value.gu || ''}
          onChange={(e) =>
            onChange({
              ...value,
              [activeLang]: e.target.value,
            })
          }
          placeholder={activeLang === 'en' ? placeholderEn || 'Enter English text...' : placeholderGu || 'ગુજરાતી લખાણ લખો...'}
          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-y"
        />
      ) : (
        <input
          type="text"
          value={activeLang === 'en' ? value.en || '' : value.gu || ''}
          onChange={(e) =>
            onChange({
              ...value,
              [activeLang]: e.target.value,
            })
          }
          placeholder={activeLang === 'en' ? placeholderEn || 'Enter English text...' : placeholderGu || 'ગુજરાતી લખાણ લખો...'}
          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
        />
      )}
    </div>
  );
};

// --- Style Settings Editor ---
export const BlockStyleEditor: React.FC<{
  style?: BlockStyleConfig;
  onChange: (updatedStyle: BlockStyleConfig) => void;
}> = ({ style = {}, onChange }) => {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span>🎨</span> Layout & Visual Appearance
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Background
          </label>
          <select
            value={style.backgroundColor || 'default'}
            onChange={(e) => onChange({ ...style, backgroundColor: e.target.value as any })}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium outline-none text-xs"
          >
            <option value="default">Default (Transparent)</option>
            <option value="muted">Muted Slate</option>
            <option value="brand">Brand Orange Tint</option>
            <option value="warm">Warm Amber Glow</option>
            <option value="gradient">Subtle Gradient</option>
            <option value="dark">Dark Charcoal</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Vertical Padding
          </label>
          <select
            value={style.padding || 'normal'}
            onChange={(e) => onChange({ ...style, padding: e.target.value as any })}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium outline-none text-xs"
          >
            <option value="none">None (0px)</option>
            <option value="compact">Compact (24px)</option>
            <option value="normal">Normal (48px)</option>
            <option value="spacious">Spacious (80px)</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Container Width
          </label>
          <select
            value={style.containerWidth || 'standard'}
            onChange={(e) => onChange({ ...style, containerWidth: e.target.value as any })}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium outline-none text-xs"
          >
            <option value="standard">Standard (7xl / 1280px)</option>
            <option value="narrow">Narrow (4xl / 896px)</option>
            <option value="wide">Wide (1440px)</option>
            <option value="full">Full Bleed (100%)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Corner Radius
          </label>
          <select
            value={style.borderRadius || 'none'}
            onChange={(e) => onChange({ ...style, borderRadius: e.target.value as any })}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium outline-none text-xs"
          >
            <option value="none">Default / Sharp</option>
            <option value="rounded">Rounded Corners (24px)</option>
            <option value="pill">Pill Smooth (40px)</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Shadow / Elevation
          </label>
          <select
            value={style.shadow || 'none'}
            onChange={(e) => onChange({ ...style, shadow: e.target.value as any })}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium outline-none text-xs"
          >
            <option value="none">None</option>
            <option value="subtle">Subtle</option>
            <option value="medium">Medium Shadow</option>
            <option value="elevated">Elevated Deep</option>
            <option value="glow">Orange Ambient Glow</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
            Entrance Animation
          </label>
          <select
            value={style.animation || 'none'}
            onChange={(e) => onChange({ ...style, animation: e.target.value as any })}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium outline-none text-xs"
          >
            <option value="none">None (Instant)</option>
            <option value="fade">Fade In</option>
            <option value="slide-up">Slide Up Entrance</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 text-xs">
        <label className="inline-flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
          <input
            type="checkbox"
            checked={!!style.showDivider}
            onChange={(e) => onChange({ ...style, showDivider: e.target.checked })}
            className="rounded border-slate-300 text-orange-500 focus:ring-orange-400"
          />
          <span>Show Bottom Divider Line</span>
        </label>
      </div>
    </div>
  );
};

// --- Hero Editor ---
export const HeroEditor: React.FC<EditorProps> = ({ props, onChange }) => {
  return (
    <div className="space-y-4">
      <TranslatableInput
        label="Tagline Badge"
        value={props.tagline}
        onChange={(val) => onChange({ ...props, tagline: val })}
        placeholderEn="e.g. A Village of Heritage & Harmony"
      />
      <TranslatableInput
        label="Hero Main Title"
        value={props.title}
        onChange={(val) => onChange({ ...props, title: val })}
        placeholderEn="e.g. Welcome to Dholasan"
      />
      <TranslatableInput
        label="Hero Subtitle"
        value={props.subtitle}
        onChange={(val) => onChange({ ...props, subtitle: val })}
        isTextArea
        rows={2}
      />

      <div>
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1">
          Background Image URL
        </label>
        <input
          type="text"
          value={props.imageUrl || ''}
          onChange={(e) => onChange({ ...props, imageUrl: e.target.value })}
          placeholder="https://..."
          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 outline-none"
        />
        {props.imageUrl && (
          <div className="mt-2 h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <img src={props.imageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
        <div className="space-y-2">
          <TranslatableInput
            label="Primary Button Text"
            value={props.primaryCtaText}
            onChange={(val) => onChange({ ...props, primaryCtaText: val })}
            placeholderEn="e.g. Explore Our Village"
          />
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Link URL</label>
            <input
              type="text"
              value={props.primaryCtaLink || ''}
              onChange={(e) => onChange({ ...props, primaryCtaLink: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
            />
          </div>
        </div>

        <div className="space-y-2">
          <TranslatableInput
            label="Secondary Button Text"
            value={props.secondaryCtaText}
            onChange={(val) => onChange({ ...props, secondaryCtaText: val })}
            placeholderEn="e.g. Community Hub"
          />
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Link URL</label>
            <input
              type="text"
              value={props.secondaryCtaLink || ''}
              onChange={(e) => onChange({ ...props, secondaryCtaLink: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Quick Links Editor ---
export const QuickLinksEditor: React.FC<EditorProps> = ({ props, onChange }) => {
  const items = props.items || [];

  const handleAddItem = () => {
    const newItem = {
      id: `ql_${Date.now()}`,
      title: { en: 'New Link', gu: 'નવી લિંક' },
      subtitle: { en: 'Link description', gu: 'લિંક વર્ણન' },
      to: '/about',
      iconName: 'info' as const,
    };
    onChange({ ...props, items: [...items, newItem] });
  };

  const handleUpdateItem = (index: number, updated: any) => {
    const next = [...items];
    next[index] = updated;
    onChange({ ...props, items: next });
  };

  const handleRemoveItem = (index: number) => {
    onChange({ ...props, items: items.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <TranslatableInput
        label="Section Title (Optional)"
        value={props.title}
        onChange={(val) => onChange({ ...props, title: val })}
      />
      <TranslatableInput
        label="Section Subtitle (Optional)"
        value={props.subtitle}
        onChange={(val) => onChange({ ...props, subtitle: val })}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase text-slate-500">
            Quick Link Cards ({items.length})
          </label>
          <button
            type="button"
            onClick={handleAddItem}
            className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-colors"
          >
            + Add Card
          </button>
        </div>

        {items.map((item: any, idx: number) => (
          <div
            key={item.id || idx}
            className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Card #{idx + 1}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(idx)}
                className="text-xs text-red-500 hover:text-red-700 font-bold"
              >
                Delete
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <TranslatableInput
                label="Card Title"
                value={item.title}
                onChange={(val) => handleUpdateItem(idx, { ...item, title: val })}
              />
              <TranslatableInput
                label="Card Subtitle"
                value={item.subtitle}
                onChange={(val) => handleUpdateItem(idx, { ...item, subtitle: val })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Target Page URL</label>
                <input
                  type="text"
                  value={item.to || ''}
                  onChange={(e) => handleUpdateItem(idx, { ...item, to: e.target.value })}
                  placeholder="/about"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Icon Style</label>
                <select
                  value={item.iconName || 'info'}
                  onChange={(e) => handleUpdateItem(idx, { ...item, iconName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium"
                >
                  <option value="info">ℹ️ Information</option>
                  <option value="calendar">📅 Calendar</option>
                  <option value="newspaper">📰 Newspaper</option>
                  <option value="camera">📷 Camera/Gallery</option>
                  <option value="building">🏢 Building/Projects</option>
                  <option value="users">👥 Community/Users</option>
                  <option value="phone">📞 Phone/Helpline</option>
                  <option value="heart">❤️ Heart/Welfare</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Stats Editor ---
export const StatsEditor: React.FC<EditorProps> = ({ props, onChange }) => {
  const items = props.items || [];

  const handleAddItem = () => {
    const newItem = {
      id: `st_${Date.now()}`,
      number: '100+',
      suffix: '',
      label: { en: 'New Metric', gu: 'નવો આંકડો' },
      sublabel: { en: 'Metric detail', gu: 'વિગત' },
    };
    onChange({ ...props, items: [...items, newItem] });
  };

  const handleUpdateItem = (index: number, updated: any) => {
    const next = [...items];
    next[index] = updated;
    onChange({ ...props, items: next });
  };

  const handleRemoveItem = (index: number) => {
    onChange({ ...props, items: items.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <TranslatableInput
        label="Section Title"
        value={props.title}
        onChange={(val) => onChange({ ...props, title: val })}
      />
      <TranslatableInput
        label="Section Subtitle"
        value={props.subtitle}
        onChange={(val) => onChange({ ...props, subtitle: val })}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase text-slate-500">
            Counter Items ({items.length})
          </label>
          <button
            type="button"
            onClick={handleAddItem}
            className="px-2.5 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-colors"
          >
            + Add Metric
          </button>
        </div>

        {items.map((item: any, idx: number) => (
          <div
            key={item.id || idx}
            className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Metric #{idx + 1}</span>
              <button
                type="button"
                onClick={() => handleRemoveItem(idx)}
                className="text-xs text-red-500 hover:text-red-700 font-bold"
              >
                Delete
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Number Value</label>
                <input
                  type="text"
                  value={item.number || ''}
                  onChange={(e) => handleUpdateItem(idx, { ...item, number: e.target.value })}
                  placeholder="2,500+"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 block mb-1">Suffix (Optional)</label>
                <input
                  type="text"
                  value={item.suffix || ''}
                  onChange={(e) => handleUpdateItem(idx, { ...item, suffix: e.target.value })}
                  placeholder="sq km"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
            </div>

            <TranslatableInput
              label="Metric Label"
              value={item.label}
              onChange={(val) => handleUpdateItem(idx, { ...item, label: val })}
            />
            <TranslatableInput
              label="Sublabel (Optional)"
              value={item.sublabel}
              onChange={(val) => handleUpdateItem(idx, { ...item, sublabel: val })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Rich Text Editor ---
export const RichTextEditor: React.FC<EditorProps> = ({ props, onChange }) => {
  return (
    <div className="space-y-4">
      <TranslatableInput
        label="Top Subtitle / Category"
        value={props.subtitle}
        onChange={(val) => onChange({ ...props, subtitle: val })}
      />
      <TranslatableInput
        label="Main Heading"
        value={props.title}
        onChange={(val) => onChange({ ...props, title: val })}
      />
      <TranslatableInput
        label="Body Content (Markdown / Text)"
        value={props.content}
        onChange={(val) => onChange({ ...props, content: val })}
        isTextArea
        rows={5}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Section Image URL
          </label>
          <input
            type="text"
            value={props.imageUrl || ''}
            onChange={(e) => onChange({ ...props, imageUrl: e.target.value })}
            placeholder="https://..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Image Position
          </label>
          <select
            value={props.imagePosition || 'right'}
            onChange={(e) => onChange({ ...props, imagePosition: e.target.value as any })}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium"
          >
            <option value="right">Right Side</option>
            <option value="left">Left Side</option>
            <option value="top">Top Banner</option>
            <option value="none">No Image</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <TranslatableInput
          label="Button Text (Optional)"
          value={props.buttonText}
          onChange={(val) => onChange({ ...props, buttonText: val })}
        />
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Button Link URL
          </label>
          <input
            type="text"
            value={props.buttonLink || ''}
            onChange={(e) => onChange({ ...props, buttonLink: e.target.value })}
            placeholder="/about or #landmarks"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

// --- Banner Editor ---
export const BannerEditor: React.FC<EditorProps> = ({ props, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TranslatableInput
          label="Badge Pill Text"
          value={props.badge}
          onChange={(val) => onChange({ ...props, badge: val })}
          placeholderEn="e.g. 24/7 HELPLINE"
        />
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Color Variant
          </label>
          <select
            value={props.variant || 'orange'}
            onChange={(e) => onChange({ ...props, variant: e.target.value as any })}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium"
          >
            <option value="orange">Orange (Brand Accent)</option>
            <option value="blue">Blue (Official / Civic)</option>
            <option value="green">Green (Health / Nature)</option>
            <option value="amber">Amber (Notice / Reminder)</option>
            <option value="red">Red (Urgent / Emergency)</option>
          </select>
        </div>
      </div>

      <TranslatableInput
        label="Banner Title"
        value={props.title}
        onChange={(val) => onChange({ ...props, title: val })}
      />
      <TranslatableInput
        label="Banner Message"
        value={props.message}
        onChange={(val) => onChange({ ...props, message: val })}
        isTextArea
        rows={2}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <TranslatableInput
          label="Action Link Text"
          value={props.linkText}
          onChange={(val) => onChange({ ...props, linkText: val })}
        />
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Action URL
          </label>
          <input
            type="text"
            value={props.linkUrl || ''}
            onChange={(e) => onChange({ ...props, linkUrl: e.target.value })}
            placeholder="/community"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm"
          />
        </div>
      </div>
    </div>
  );
};

// --- Feed Editor (News, Events, Notices, Projects, Gallery) ---
export const FeedEditor: React.FC<EditorProps> = ({ props, onChange }) => {
  return (
    <div className="space-y-4">
      <TranslatableInput
        label="Section Title"
        value={props.title}
        onChange={(val) => onChange({ ...props, title: val })}
      />
      <TranslatableInput
        label="Section Subtitle"
        value={props.subtitle}
        onChange={(val) => onChange({ ...props, subtitle: val })}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Max Items to Display
          </label>
          <input
            type="number"
            min={1}
            max={24}
            value={props.limit || 3}
            onChange={(e) => onChange({ ...props, limit: parseInt(e.target.value, 10) || 3 })}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            "View All" Target URL
          </label>
          <input
            type="text"
            value={props.viewAllLink || ''}
            onChange={(e) => onChange({ ...props, viewAllLink: e.target.value })}
            placeholder="/community"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm"
          />
        </div>
      </div>
      <TranslatableInput
        label="Custom 'View All' Label (Optional)"
        value={props.viewAllText}
        onChange={(val) => onChange({ ...props, viewAllText: val })}
      />
    </div>
  );
};

// --- Embed Editor ---
export const CustomEmbedEditor: React.FC<EditorProps> = ({ props, onChange }) => {
  return (
    <div className="space-y-4">
      <TranslatableInput
        label="Section Title (Optional)"
        value={props.title}
        onChange={(val) => onChange({ ...props, title: val })}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Embed Type
          </label>
          <select
            value={props.embedType || 'iframe'}
            onChange={(e) => onChange({ ...props, embedType: e.target.value as any })}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium"
          >
            <option value="iframe">Google Maps / Web Iframe</option>
            <option value="youtube">YouTube Video Embed URL</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
            Height (px)
          </label>
          <input
            type="number"
            value={props.height || 400}
            onChange={(e) => onChange({ ...props, height: parseInt(e.target.value, 10) || 400 })}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
          Iframe / Video URL
        </label>
        <input
          type="text"
          value={props.codeOrUrl || ''}
          onChange={(e) => onChange({ ...props, codeOrUrl: e.target.value })}
          placeholder="https://..."
          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm"
        />
      </div>
    </div>
  );
};

// --- Master Block Property Inspector (auto-saves on change) ---
export const BlockPropertyInspector: React.FC<{
  block: PageBlockConfig;
  onChange: (updatedBlock: PageBlockConfig) => void;
}> = ({ block, onChange }) => {
  const handlePropsChange = (newProps: any) => onChange({ ...block, props: newProps });
  const handleStyleChange = (newStyle: BlockStyleConfig) => onChange({ ...block, style: newStyle });
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
          Block Label (Admin Only)
        </label>
        <input
          type="text"
          value={block.name || ''}
          onChange={(e) => onChange({ ...block, name: e.target.value })}
          placeholder="Give this block a friendly name..."
          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      {block.type === 'hero' && <HeroEditor props={block.props} onChange={handlePropsChange} />}
      {block.type === 'quickLinks' && <QuickLinksEditor props={block.props} onChange={handlePropsChange} />}
      {block.type === 'stats' && <StatsEditor props={block.props} onChange={handlePropsChange} />}
      {block.type === 'richText' && <RichTextEditor props={block.props} onChange={handlePropsChange} />}
      {block.type === 'banner' && <BannerEditor props={block.props} onChange={handlePropsChange} />}
      {(block.type === 'newsFeed' ||
        block.type === 'eventsFeed' ||
        block.type === 'noticesFeed' ||
        block.type === 'projectsFeed' ||
        block.type === 'galleryGrid') && (
        <FeedEditor props={block.props} onChange={handlePropsChange} />
      )}
      {block.type === 'customEmbed' && <CustomEmbedEditor props={block.props} onChange={handlePropsChange} />}
      <BlockStyleEditor style={block.style} onChange={handleStyleChange} />
    </div>
  );
};

// --- Buffered Block Inspector with Apply Changes and collapsible sections ---
export const BlockPropertyInspectorWithApply: React.FC<{
  block: PageBlockConfig;
  onChange: (updatedBlock: PageBlockConfig) => void;
  onSaved?: () => void;
}> = ({ block, onChange, onSaved }) => {
  const [draft, setDraft] = React.useState<PageBlockConfig>(block);
  const [isDirty, setIsDirty] = React.useState(false);
  const [contentOpen, setContentOpen] = React.useState(true);
  const [styleOpen, setStyleOpen] = React.useState(false);

  React.useEffect(() => {
    setDraft(block);
    setIsDirty(false);
  }, [block.id]);

  const handleDraftChange = (updated: PageBlockConfig) => {
    setDraft(updated);
    setIsDirty(true);
  };

  const handleDraftPropsChange = (newProps: any) => {
    handleDraftChange({ ...draft, props: newProps });
  };

  const handleDraftStyleChange = (newStyle: BlockStyleConfig) => {
    handleDraftChange({ ...draft, style: newStyle });
  };

  const handleApply = () => {
    onChange(draft);
    setIsDirty(false);
    onSaved?.();
  };

  const handleDiscard = () => {
    setDraft(block);
    setIsDirty(false);
  };

  return (
    <div className="space-y-4">
      {/* Block Admin Name */}
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
          Block Label (Admin Only)
        </label>
        <input
          type="text"
          value={draft.name || ''}
          onChange={(e) => handleDraftChange({ ...draft, name: e.target.value })}
          placeholder="Give this block a friendly name..."
          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Collapsible: Content Section */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setContentOpen((o) => !o)}
          className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <span>📝</span> Content & Text
          </span>
          <span className={`text-slate-400 text-sm transition-transform duration-200 ${contentOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {contentOpen && (
          <div className="p-4 space-y-4 border-t border-slate-100 dark:border-slate-800">
            {draft.type === 'hero' && <HeroEditor props={draft.props} onChange={handleDraftPropsChange} />}
            {draft.type === 'quickLinks' && <QuickLinksEditor props={draft.props} onChange={handleDraftPropsChange} />}
            {draft.type === 'stats' && <StatsEditor props={draft.props} onChange={handleDraftPropsChange} />}
            {draft.type === 'richText' && <RichTextEditor props={draft.props} onChange={handleDraftPropsChange} />}
            {draft.type === 'banner' && <BannerEditor props={draft.props} onChange={handleDraftPropsChange} />}
            {(draft.type === 'newsFeed' ||
              draft.type === 'eventsFeed' ||
              draft.type === 'noticesFeed' ||
              draft.type === 'projectsFeed' ||
              draft.type === 'galleryGrid') && (
              <FeedEditor props={draft.props} onChange={handleDraftPropsChange} />
            )}
            {draft.type === 'customEmbed' && <CustomEmbedEditor props={draft.props} onChange={handleDraftPropsChange} />}
            {draft.type === 'contactCard' && <p className="text-xs text-slate-400 italic">This block renders live data automatically from your site settings.</p>}
          </div>
        )}
      </div>

      {/* Collapsible: Style Section */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setStyleOpen((o) => !o)}
          className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <span>🎨</span> Style & Appearance
          </span>
          <span className={`text-slate-400 text-sm transition-transform duration-200 ${styleOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>
        {styleOpen && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800">
            <BlockStyleEditor style={draft.style} onChange={handleDraftStyleChange} />
          </div>
        )}
      </div>

      {/* Apply / Discard Buttons */}
      <div className={`flex items-center gap-2 pt-2 transition-all ${isDirty ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
        <button
          type="button"
          onClick={handleApply}
          disabled={!isDirty}
          className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
        >
          <span>✓</span>
          <span>Apply Changes</span>
        </button>
        <button
          type="button"
          onClick={handleDiscard}
          disabled={!isDirty}
          className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-all"
        >
          Discard
        </button>
      </div>
      {isDirty && (
        <p className="text-[11px] text-amber-600 dark:text-amber-400 text-center font-medium">
          ● You have unsaved changes — click Apply to save.
        </p>
      )}
    </div>
  );
};
