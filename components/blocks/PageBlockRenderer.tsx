import React from 'react';
import { PageBlockConfig, BlockStyleConfig } from '../../types';
import { BlockRegistry } from './BlockRegistry';
import { useLiveEdit } from '../../context/LiveEditContext';

interface Props {
  blocks?: PageBlockConfig[];
  fallbackBlocks?: PageBlockConfig[];
  interactiveMode?: boolean;
  selectedBlockId?: string | null;
  onSelectBlock?: (blockId: string) => void;
  pageId?: string;
}

function resolveStyleClasses(style?: BlockStyleConfig) {
  // Background
  let bgClass = 'bg-transparent';
  if (style?.backgroundColor === 'muted') {
    bgClass = 'bg-slate-100/80 dark:bg-slate-900/60';
  } else if (style?.backgroundColor === 'brand') {
    bgClass = 'bg-orange-500/10 dark:bg-orange-950/30';
  } else if (style?.backgroundColor === 'dark') {
    bgClass = 'bg-slate-950 text-white';
  } else if (style?.backgroundColor === 'gradient') {
    bgClass = 'bg-gradient-to-b from-orange-500/10 via-transparent to-slate-100/60 dark:to-slate-900/80';
  } else if (style?.backgroundColor === 'warm') {
    bgClass = 'bg-amber-500/10 dark:bg-amber-950/20';
  }

  // Padding
  let paddingClass = 'py-12 md:py-16';
  if (style?.padding === 'none') {
    paddingClass = 'py-0';
  } else if (style?.padding === 'compact') {
    paddingClass = 'py-6 md:py-8';
  } else if (style?.padding === 'spacious') {
    paddingClass = 'py-16 md:py-24';
  }

  // Container Width
  let containerClass = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
  if (style?.containerWidth === 'full') {
    containerClass = 'w-full px-0';
  } else if (style?.containerWidth === 'wide') {
    containerClass = 'max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8';
  } else if (style?.containerWidth === 'narrow') {
    containerClass = 'max-w-4xl mx-auto px-4 sm:px-6';
  }

  // Border radius & shadow for inner wrapper if specified
  let extraClass = '';
  if (style?.borderRadius === 'rounded') extraClass += ' rounded-3xl overflow-hidden';
  if (style?.borderRadius === 'pill') extraClass += ' rounded-[2.5rem] overflow-hidden';
  if (style?.shadow === 'subtle') extraClass += ' shadow-xs';
  if (style?.shadow === 'medium') extraClass += ' shadow-md';
  if (style?.shadow === 'elevated') extraClass += ' shadow-xl';
  if (style?.shadow === 'glow') extraClass += ' shadow-2xl shadow-orange-500/20';

  if (style?.animation === 'fade') extraClass += ' animate-fade-in';
  if (style?.animation === 'slide-up') extraClass += ' animate-slide-up';

  return { bgClass, paddingClass, containerClass, extraClass };
}

export const PageBlockRenderer: React.FC<Props> = ({
  blocks,
  fallbackBlocks,
  interactiveMode: propInteractiveMode,
  selectedBlockId: propSelectedBlockId,
  onSelectBlock: propOnSelectBlock,
  pageId = 'home',
}) => {
  const liveEdit = useLiveEdit();
  
  const isInteractive = propInteractiveMode !== undefined ? propInteractiveMode : liveEdit.isLiveEditMode;
  const currentSelectedId = propSelectedBlockId !== undefined ? propSelectedBlockId : liveEdit.selectedBlockId;
  const handleSelect = (id: string, block: PageBlockConfig) => {
    if (propOnSelectBlock) {
      propOnSelectBlock(id);
    } else if (liveEdit.isLiveEditMode) {
      liveEdit.openEditor({
        type: 'block',
        id,
        title: block.name || block.type,
        pageId,
        block,
      });
    }
  };

  const activeBlocks = (blocks && blocks.length > 0 ? blocks : fallbackBlocks || []).filter(
    (b) => b && (isInteractive || b.enabled !== false)
  );

  if (activeBlocks.length === 0) {
    return (
      <div className="py-20 text-center text-slate-400 text-sm">
        No visible blocks on this page.
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {activeBlocks.map((block) => {
        const Component = BlockRegistry[block.type];
        if (!Component) {
          console.warn(`[PageBlockRenderer] Unrecognized block type: ${block.type}`);
          return null;
        }

        const isHero = block.type === 'hero';
        const isSelected = currentSelectedId === block.id;
        const { bgClass, paddingClass, containerClass, extraClass } = resolveStyleClasses(block.style);

        const interactiveWrapperClass = isInteractive
          ? `group relative cursor-pointer transition-all duration-200 ${
              isSelected
                ? 'ring-4 ring-orange-500 ring-offset-2 dark:ring-offset-slate-950 shadow-2xl rounded-2xl'
                : 'hover:ring-2 hover:ring-orange-400/60'
            } ${block.enabled === false ? 'opacity-40 grayscale-[50%]' : ''}`
          : '';

        // Hero renders full-width
        if (isHero && (!block.style?.containerWidth || block.style.containerWidth === 'full' || block.style.containerWidth === 'standard')) {
          return (
            <div
              key={block.id}
              id={block.id}
              onClick={() => isInteractive && handleSelect(block.id, block)}
              className={`w-full ${interactiveWrapperClass} ${extraClass}`}
            >
              {isInteractive && (
                <div className="absolute top-3 left-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5 shadow-xl">
                  <span>✏️ Click to Edit {block.name || block.type}</span>
                  {block.enabled === false && <span className="text-amber-400 font-normal">(Hidden)</span>}
                </div>
              )}
              <Component props={block.props} style={block.style} />
            </div>
          );
        }

        return (
          <section
            key={block.id}
            id={block.id}
            onClick={() => isInteractive && handleSelect(block.id, block)}
            className={`w-full ${bgClass} ${paddingClass} transition-colors duration-300 relative ${interactiveWrapperClass} ${extraClass}`}
          >
            {isInteractive && (
              <div className="absolute top-3 left-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5 shadow-xl">
                <span>✏️ Click to Edit {block.name || block.type}</span>
                {block.enabled === false && <span className="text-amber-400 font-normal">(Hidden)</span>}
              </div>
            )}
            <div className={containerClass}>
              <Component props={block.props} style={block.style} />
            </div>
            {block.style?.showDivider && (
              <div className="max-w-7xl mx-auto px-4 mt-12 border-b border-slate-200/60 dark:border-slate-800/80" />
            )}
          </section>
        );
      })}
    </div>
  );
};

export default PageBlockRenderer;

