import React, { useState } from 'react';
import { BlockType, PageBlockConfig } from '../../../types';
import { BLOCK_METADATA, BlockMeta } from '../../blocks/BlockRegistry';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectBlock: (block: PageBlockConfig) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Components' },
  { id: 'headers', label: 'Banners & Hero', types: ['hero', 'banner'] },
  { id: 'content', label: 'Text & Content', types: ['richText', 'features', 'stats', 'quickLinks'] },
  { id: 'feeds', label: 'Live Feeds', types: ['noticesFeed', 'projectsFeed', 'newsFeed', 'eventsFeed'] },
  { id: 'media', label: 'Media & Embeds', types: ['galleryGrid', 'customEmbed', 'contactCard'] },
];

export const AddBlockModal: React.FC<Props> = ({ isOpen, onClose, onSelectBlock }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  if (!isOpen) return null;

  const filteredBlocks = BLOCK_METADATA.filter((meta) => {
    const matchesSearch =
      meta.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meta.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meta.type.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (activeCategory === 'all') return true;

    const cat = CATEGORIES.find((c) => c.id === activeCategory);
    return cat?.types?.includes(meta.type) || false;
  });

  const handleChoose = (meta: BlockMeta) => {
    const newBlock: PageBlockConfig = {
      id: `blk_${meta.type}_${Date.now().toString(36)}`,
      type: meta.type,
      name: meta.label,
      enabled: true,
      props: JSON.parse(JSON.stringify(meta.defaultProps)),
      style: {
        backgroundColor: 'default',
        padding: 'normal',
        containerWidth: 'standard',
        borderRadius: 'none',
        shadow: 'none',
      },
    };
    onSelectBlock(newBlock);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scale-in">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                <span>🧱</span> Add Component Block
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Select a building block to insert into this page.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors font-bold"
            >
              ✕
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search components (e.g., hero, notices, banner)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
              />
              <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
            </div>

            <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Block Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
          {filteredBlocks.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs">
              No components match "{searchTerm}". Try a different search term.
            </div>
          ) : (
            filteredBlocks.map((meta) => (
              <div
                key={meta.type}
                onClick={() => handleChoose(meta)}
                className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-orange-500 dark:hover:border-orange-500 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-orange-50/30 dark:hover:bg-orange-950/20 cursor-pointer transition-all flex flex-col justify-between group hover:shadow-lg hover:-translate-y-0.5"
              >
                <div>
                  <div className="text-3xl mb-3">{meta.icon}</div>
                  <h3 className="font-bold text-slate-900 dark:text-white font-display group-hover:text-brand-orange transition-colors">
                    {meta.label}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {meta.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {meta.type}
                  </span>
                  <span className="text-xs font-bold text-brand-orange group-hover:underline">
                    + Add Block
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBlockModal;

