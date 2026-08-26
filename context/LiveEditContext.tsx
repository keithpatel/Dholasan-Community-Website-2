import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PageBlockConfig } from '../types';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export interface EditTarget {
  type: 'block' | 'header' | 'footer' | 'page_header' | 'site_setting' | 'label';
  id: string;
  title: string;
  pageId?: string;
  block?: PageBlockConfig;
  data?: any;
}

interface LiveEditContextType {
  isLiveEditMode: boolean;
  setIsLiveEditMode: (active: boolean) => void;
  toggleLiveEditMode: () => void;
  viewport: ViewportMode;
  setViewport: (v: ViewportMode) => void;
  activeTarget: EditTarget | null;
  openEditor: (target: EditTarget) => void;
  closeEditor: () => void;
  selectedBlockId: string | null;
  setSelectedBlockId: (id: string | null) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (v: boolean) => void;
}

const LiveEditContext = createContext<LiveEditContextType | undefined>(undefined);

export const LiveEditProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLiveEditMode, setIsLiveEditMode] = useState<boolean>(false);
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [activeTarget, setActiveTarget] = useState<EditTarget | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const toggleLiveEditMode = () => {
    setIsLiveEditMode((prev) => {
      const next = !prev;
      if (!next) {
        setActiveTarget(null);
        setSelectedBlockId(null);
      }
      return next;
    });
  };

  const openEditor = (target: EditTarget) => {
    setActiveTarget(target);
    if (target.type === 'block') {
      setSelectedBlockId(target.id);
    }
  };

  const closeEditor = () => {
    setActiveTarget(null);
    setSelectedBlockId(null);
  };

  return (
    <LiveEditContext.Provider
      value={{
        isLiveEditMode,
        setIsLiveEditMode,
        toggleLiveEditMode,
        viewport,
        setViewport,
        activeTarget,
        openEditor,
        closeEditor,
        selectedBlockId,
        setSelectedBlockId,
        hasUnsavedChanges,
        setHasUnsavedChanges,
      }}
    >
      {children}
    </LiveEditContext.Provider>
  );
};

export const useLiveEdit = () => {
  const context = useContext(LiveEditContext);
  if (!context) {
    throw new Error('useLiveEdit must be used within a LiveEditProvider');
  }
  return context;
};
