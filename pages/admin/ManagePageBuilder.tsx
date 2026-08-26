import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../../context/ContentContext';
import { PageBlockConfig } from '../../types';
import AddBlockModal from '../../components/admin/blocks/AddBlockModal';
import { BlockPropertyInspector } from '../../components/admin/blocks/BlockPropertyEditors';
import PageBlockRenderer from '../../components/blocks/PageBlockRenderer';
import { defaultPageLayouts } from '../../data/contentStore';

const BASE_PAGES = [
  { id: 'home', label: 'Home Page', icon: '🏠' },
  { id: 'about', label: 'About Village', icon: '📜' },
  { id: 'community', label: 'Community & Notices', icon: '👥' },
  { id: 'events', label: 'Events & Festivals', icon: '🎉' },
  { id: 'contact', label: 'Contact & Helplines', icon: '☎️' },
];

const BlockTypeIcons: Record<string, string> = {
  hero: '🖼️',
  quickLinks: '⚡',
  stats: '📊',
  richText: '📝',
  banner: '📢',
  features: '✨',
  newsFeed: '📰',
  eventsFeed: '🎉',
  noticesFeed: '📌',
  projectsFeed: '🏗️',
  galleryGrid: '📸',
  contactCard: '☎️',
  customEmbed: '🗺️',
};

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

export const ManagePageBuilder: React.FC = () => {
  const {
    pageLayouts,
    updatePageBlocks,
    addBlockToPage,
    updateSingleBlock,
    removeBlockFromPage,
    reorderPageBlocks,
    toggleBlockVisibility,
    resetPageLayoutToDefault,
    logActivity,
  } = useContent();

  const [activePageId, setActivePageId] = useState<string>('home');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'canvas' | 'json'>('editor');
  const [viewport, setViewport] = useState<ViewportSize>('desktop');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<Record<string, PageBlockConfig[][]>>({});
  const [historyIndex, setHistoryIndex] = useState<Record<string, number>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentBlocks: PageBlockConfig[] = pageLayouts[activePageId] || defaultPageLayouts[activePageId] || [];
  const selectedBlock = currentBlocks.find((b) => b.id === selectedBlockId) || null;

  // Initialize history
  const pushHistory = (pageId: string, blocks: PageBlockConfig[]) => {
    const pageHistory = history[pageId] || [blocks];
    const currentIndex = historyIndex[pageId] ?? 0;
    const newHistory = [...pageHistory.slice(0, currentIndex + 1), blocks];
    setHistory((prev) => ({ ...prev, [pageId]: newHistory }));
    setHistoryIndex((prev) => ({ ...prev, [pageId]: newHistory.length - 1 }));
  };

  const handleUndo = () => {
    const currentIndex = historyIndex[activePageId] ?? 0;
    const pageHistory = history[activePageId];
    if (pageHistory && currentIndex > 0) {
      const prevBlocks = pageHistory[currentIndex - 1];
      setHistoryIndex((prev) => ({ ...prev, [activePageId]: currentIndex - 1 }));
      updatePageBlocks(activePageId, prevBlocks);
      showToast('Undo successful');
    }
  };

  const handleRedo = () => {
    const currentIndex = historyIndex[activePageId] ?? 0;
    const pageHistory = history[activePageId];
    if (pageHistory && currentIndex < pageHistory.length - 1) {
      const nextBlocks = pageHistory[currentIndex + 1];
      setHistoryIndex((prev) => ({ ...prev, [activePageId]: currentIndex + 1 }));
      updatePageBlocks(activePageId, nextBlocks);
      showToast('Redo successful');
    }
  };

  const canUndo = (historyIndex[activePageId] ?? 0) > 0;
  const canRedo =
    history[activePageId] &&
    (historyIndex[activePageId] ?? 0) < history[activePageId].length - 1;

  const handleAddBlock = (newBlock: PageBlockConfig) => {
    addBlockToPage(activePageId, newBlock);
    setSelectedBlockId(newBlock.id);
    pushHistory(activePageId, [...currentBlocks, newBlock]);
    logActivity('Added Block', 'Page Builder', `Added ${newBlock.type} to ${activePageId}`);
    showToast(`Added ${newBlock.name || newBlock.type}`);
  };

  const handleDuplicateBlock = (block: PageBlockConfig) => {
    const duplicated: PageBlockConfig = {
      ...JSON.parse(JSON.stringify(block)),
      id: `blk_${block.type}_${Date.now().toString(36)}`,
      name: `${block.name || block.type} (Copy)`,
    };
    addBlockToPage(activePageId, duplicated);
    setSelectedBlockId(duplicated.id);
    pushHistory(activePageId, [...currentBlocks, duplicated]);
    logActivity('Duplicated Block', 'Page Builder', `Duplicated ${block.id}`);
    showToast('Block duplicated');
  };

  const handleDeleteBlock = (blockId: string) => {
    if (window.confirm('Delete this block from the page?')) {
      removeBlockFromPage(activePageId, blockId);
      if (selectedBlockId === blockId) setSelectedBlockId(null);
      pushHistory(activePageId, currentBlocks.filter((b) => b.id !== blockId));
      logActivity('Deleted Block', 'Page Builder', `Removed ${blockId}`);
      showToast('Block removed');
    }
  };

  const handleResetPage = () => {
    if (window.confirm(`Reset ${activePageId.toUpperCase()} page layout to factory defaults?`)) {
      resetPageLayoutToDefault(activePageId);
      setSelectedBlockId(null);
      logActivity('Reset Layout', 'Page Builder', `Reset ${activePageId} to defaults`);
      showToast('Page reset to defaults');
    }
  };

  // Open JSON tab
  const handleOpenJson = () => {
    setJsonText(JSON.stringify(currentBlocks, null, 2));
    setJsonError(null);
    setActiveTab('json');
  };

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) throw new Error('Schema must be an array of blocks.');
      updatePageBlocks(activePageId, parsed);
      pushHistory(activePageId, parsed);
      setJsonError(null);
      showToast('Custom layout applied!');
      setActiveTab('editor');
    } catch (e: any) {
      setJsonError(e.message || 'Invalid JSON syntax');
    }
  };

  // Viewport widths
  const viewportWidthClass =
    viewport === 'mobile'
      ? 'max-w-[390px]'
      : viewport === 'tablet'
      ? 'max-w-[768px]'
      : 'max-w-full';

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 dark:border-slate-200 text-xs font-semibold animate-fade-in">
          <span>✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Action Bar (Minimalist) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold">
            🧱
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              Page Builder Studio
            </h1>
            <p className="text-xs text-slate-400">
              {currentBlocks.length} active blocks on /{activePageId === 'home' ? '' : activePageId}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Undo / Redo */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200/60 dark:border-slate-700/60">
            <button
              type="button"
              disabled={!canUndo}
              onClick={handleUndo}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 transition-all"
              title="Undo change"
            >
              ↩ Undo
            </button>
            <button
              type="button"
              disabled={!canRedo}
              onClick={handleRedo}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 transition-all"
              title="Redo change"
            >
              ↪ Redo
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200/60 dark:border-slate-700/60 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'editor'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Studio
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('canvas')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'canvas'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Interactive Canvas
            </button>
            <button
              type="button"
              onClick={handleOpenJson}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'json'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              JSON Schema
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetPage}
            className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-red-600 dark:hover:text-red-400 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 shadow-sm transition-all"
          >
            + Add Block
          </button>
        </div>
      </div>

      {/* Page Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {BASE_PAGES.map((page) => {
          const isActive = activePageId === page.id;
          return (
            <button
              key={page.id}
              onClick={() => {
                setActivePageId(page.id);
                setSelectedBlockId(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <span className="mr-1.5">{page.icon}</span>
              {page.label}
            </button>
          );
        })}
      </div>

      {/* --- TAB 1: STUDIO (List + Inspector) --- */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Blocks Manager */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="flex items-center justify-between px-1 text-xs text-slate-400 font-medium">
              <span>Section Hierarchy</span>
              <span>Reorder with ↑↓</span>
            </div>

            {currentBlocks.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                <p className="text-xs text-slate-500 font-medium">No sections added yet.</p>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-3 py-1.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold rounded-xl"
                >
                  + Add First Section
                </button>
              </div>
            ) : (
              currentBlocks.map((block, index) => {
                const isSelected = selectedBlockId === block.id;
                const icon = BlockTypeIcons[block.type] || '🧩';

                return (
                  <div
                    key={block.id}
                    className={`group p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-orange-50/40 dark:bg-orange-950/20 border-orange-500 dark:border-orange-500 shadow-xs'
                        : block.enabled === false
                        ? 'bg-slate-100/40 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 opacity-50'
                        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div
                        onClick={() => setSelectedBlockId(block.id)}
                        className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                      >
                        <span className="text-lg">{icon}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                              {block.name || block.type}
                            </span>
                            {block.enabled === false && (
                              <span className="text-[10px] font-bold text-amber-500">
                                (Hidden)
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                            {block.type}
                          </span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => reorderPageBlocks(activePageId, index, index - 1)}
                          className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-20 text-[10px] flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold"
                          title="Move Up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          disabled={index === currentBlocks.length - 1}
                          onClick={() => reorderPageBlocks(activePageId, index, index + 1)}
                          className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-20 text-[10px] flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold"
                          title="Move Down"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleBlockVisibility(activePageId, block.id)}
                          className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] flex items-center justify-center"
                          title={block.enabled !== false ? 'Hide' : 'Show'}
                        >
                          {block.enabled !== false ? '👁️' : '🙈'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicateBlock(block)}
                          className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] flex items-center justify-center text-slate-600 dark:text-slate-300"
                          title="Duplicate"
                        >
                          📑
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBlock(block.id)}
                          className="w-6 h-6 rounded bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-500 text-[10px] flex items-center justify-center"
                          title="Delete"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="w-full py-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-slate-400 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              + Add Component
            </button>
          </div>

          {/* Right Column: Inspector */}
          <div className="lg:col-span-7 sticky top-20">
            {selectedBlock ? (
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{BlockTypeIcons[selectedBlock.type] || '🧩'}</span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {selectedBlock.name || selectedBlock.type}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {selectedBlock.id}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedBlockId(null)}
                    className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
                  >
                    Close ✕
                  </button>
                </div>

                <BlockPropertyInspector
                  block={selectedBlock}
                  onChange={(updated) => {
                    updateSingleBlock(activePageId, updated);
                    showToast('Saved');
                  }}
                />
              </div>
            ) : (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="text-3xl">👈</div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Select a section to inspect
                </h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Click any block on the left to edit its bilingual text, imagery, links, and styling options.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 2: INTERACTIVE LIVE CANVAS --- */}
      {activeTab === 'canvas' && (
        <div className="space-y-4">
          {/* Viewport bar */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Viewport:</span>
              <button
                type="button"
                onClick={() => setViewport('desktop')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  viewport === 'desktop'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                🖥️ Desktop (100%)
              </button>
              <button
                type="button"
                onClick={() => setViewport('tablet')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  viewport === 'tablet'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                📱 Tablet (768px)
              </button>
              <button
                type="button"
                onClick={() => setViewport('mobile')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  viewport === 'mobile'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                📱 Mobile (390px)
              </button>
            </div>

            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Tip: Click any section in canvas to edit its properties
            </span>
          </div>

          {/* Interactive Frame */}
          <div className="flex justify-center bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-x-auto min-h-[600px]">
            <div
              className={`w-full ${viewportWidthClass} bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-300/80 dark:border-slate-800 overflow-hidden transition-all duration-300`}
            >
              <PageBlockRenderer
                blocks={currentBlocks}
                interactiveMode={true}
                selectedBlockId={selectedBlockId}
                onSelectBlock={(blockId) => {
                  setSelectedBlockId(blockId);
                  setActiveTab('editor');
                  showToast('Opened block inspector');
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 3: JSON SCHEMA --- */}
      {activeTab === 'json' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                JSON Layout Schema
              </h3>
              <p className="text-xs text-slate-400">
                Directly export or import the layout configuration for {activePageId}.
              </p>
            </div>
            <button
              type="button"
              onClick={handleApplyJson}
              className="px-4 py-1.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold rounded-xl"
            >
              Apply Schema
            </button>
          </div>

          {jsonError && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 text-xs font-semibold border border-red-200 dark:border-red-900">
              ⚠️ {jsonError}
            </div>
          )}

          <textarea
            rows={18}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      )}

      {/* Add Block Modal */}
      <AddBlockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSelectBlock={handleAddBlock}
      />
    </div>
  );
};

export default ManagePageBuilder;
