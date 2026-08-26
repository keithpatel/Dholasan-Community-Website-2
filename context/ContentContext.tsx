import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import {
  NewsArticle,
  Event,
  GalleryImage,
  Business,
  SiteSettings,
  AdminActivity,
  ContactMessage,
  BackupSnapshot,
  CommunityNotice,
  EmergencyContact,
  VillageLandmark,
  DevelopmentProject,
  PageBlockConfig,
  PageLayoutMap,
} from '../types';
import * as store from '../data/contentStore';
import type { SyncStatus } from '../data/contentStore';
import { useLanguage } from './LanguageContext';

interface ContentContextType {
  newsArticles: NewsArticle[];
  events: Event[];
  galleryImages: GalleryImage[];
  businesses: Business[];
  communityNotices: CommunityNotice[];
  emergencyContacts: EmergencyContact[];
  villageLandmarks: VillageLandmark[];
  developmentProjects: DevelopmentProject[];
  siteSettings: SiteSettings;
  pageLayouts: PageLayoutMap;
  themeTriplets: { primary: string; secondary: string };
  adminActivity: AdminActivity[];
  contactMessages: ContactMessage[];
  backups: BackupSnapshot[];
  syncStatus: SyncStatus;
  syncError: string | null;
  getLabel: (key: string) => string;
  updateNews: (articles: NewsArticle[]) => void;
  updateEvents: (events: Event[]) => void;
  updateGallery: (images: GalleryImage[]) => void;
  updateBusinesses: (businesses: Business[]) => void;
  updateNotices: (notices: CommunityNotice[]) => void;
  postNotice: (notice: Omit<CommunityNotice, 'id' | 'likes' | 'createdAt'>) => Promise<CommunityNotice>;
  likeNotice: (id: string) => Promise<number>;
  removeNotice: (id: string) => Promise<boolean>;
  updateEmergencyContacts: (contacts: EmergencyContact[]) => void;
  updateLandmarks: (landmarks: VillageLandmark[]) => void;
  updateDevelopmentProjects: (projects: DevelopmentProject[]) => void;
  updateSiteSettings: (settings: SiteSettings) => void;
  updatePageBlocks: (pageId: string, blocks: PageBlockConfig[]) => void;
  addBlockToPage: (pageId: string, block: PageBlockConfig, insertIndex?: number) => void;
  updateSingleBlock: (pageId: string, block: PageBlockConfig) => void;
  removeBlockFromPage: (pageId: string, blockId: string) => void;
  reorderPageBlocks: (pageId: string, sourceIndex: number, destinationIndex: number) => void;
  toggleBlockVisibility: (pageId: string, blockId: string) => void;
  resetPageLayoutToDefault: (pageId: string) => void;
  logActivity: (action: string, section: string, detail: string) => void;
  submitContactMessage: (msg: { name: string; email: string; subject: string; message: string }) => void;
  markMessageRead: (id: string, read: boolean) => void;
  removeContactMessage: (id: string) => void;
  restoreBackup: (id: string) => boolean;
  clearBackups: () => void;
  resetAll: () => void;
  refreshAll: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const FALLBACK_THEME = { primary: '#F97316', secondary: '#1E3A8A' };

export function normalizeHexColor(input: string | undefined | null, fallback: string): string {
  if (!input) return fallback;
  let hex = input.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return fallback;
  return '#' + hex.toUpperCase();
}

export function hexToRgbTriplet(hex: string): string {
  const clean = hex.replace('#', '').trim();
  if (clean.length !== 6) return '';
  const num = parseInt(clean, 16);
  if (isNaN(num)) return '';
  return `${(num >> 16) & 255} ${(num >> 8) & 255} ${num & 255}`;
}

function resolveThemeTriplets(themeColors?: { primary?: string; secondary?: string }) {
  const defaults = store.defaultSiteSettings?.themeColors || FALLBACK_THEME;
  const primary = normalizeHexColor(themeColors?.primary, defaults.primary);
  const secondary = normalizeHexColor(themeColors?.secondary, defaults.secondary);
  return {
    primary: hexToRgbTriplet(primary),
    secondary: hexToRgbTriplet(secondary),
  };
}

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [newsArticles, setNews] = useState<NewsArticle[]>([]);
  const [events, setEvts] = useState<Event[]>([]);
  const [galleryImages, setGallery] = useState<GalleryImage[]>([]);
  const [businesses, setBiz] = useState<Business[]>([]);
  const [communityNotices, setNotices] = useState<CommunityNotice[]>([]);
  const [emergencyContacts, setEmergency] = useState<EmergencyContact[]>([]);
  const [villageLandmarks, setLandmarks] = useState<VillageLandmark[]>([]);
  const [developmentProjects, setProjects] = useState<DevelopmentProject[]>([]);
  const [siteSettings, setSettings] = useState<SiteSettings>(() => store.getSiteSettings());
  const [pageLayouts, setPageLayoutsState] = useState<PageLayoutMap>(() => store.getPageLayouts());
  const [adminActivity, setActivity] = useState<AdminActivity[]>([]);
  const [contactMessages, setMessages] = useState<ContactMessage[]>([]);
  const [backups, setBackups] = useState<BackupSnapshot[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('ok');
  const [syncError, setSyncError] = useState<string | null>(null);

  const loadAll = useCallback(() => {
    setNews(store.getNewsArticles());
    setEvts(store.getEvents());
    setGallery(store.getGalleryImages());
    setBiz(store.getBusinesses());
    setNotices(store.getCommunityNotices());
    setEmergency(store.getEmergencyContacts());
    setLandmarks(store.getVillageLandmarks());
    setProjects(store.getDevelopmentProjects());
    setSettings(store.getSiteSettings());
    setPageLayoutsState(store.getPageLayouts());
    setActivity(store.getAdminActivity());
    setMessages(store.getContactMessages());
    setBackups(store.getBackups());
    setSyncError(store.getLastSyncError());
  }, []);

  useEffect(() => {
    store.setSyncStatusListener((status) => {
      setSyncStatus(status);
      setSyncError(store.getLastSyncError());
    });
    loadAll();

    const cleanup = store.setupFirestoreListeners({
      onNews: (data) => setNews(data),
      onEvents: (data) => setEvts(data),
      onGallery: (data) => setGallery(data),
      onBusinesses: (data) => setBiz(data),
      onNotices: (data) => setNotices(data),
      onEmergency: (data) => setEmergency(data),
      onLandmarks: (data) => setLandmarks(data),
      onProjects: (data) => setProjects(data),
      onSettings: (data) => setSettings(data),
      onPageLayouts: (data) => setPageLayoutsState(data),
      onActivity: (data) => setActivity(data),
      onMessages: (data) => setMessages(data),
      onBackups: (data) => setBackups(data),
    });

    return () => {
      cleanup();
      store.setSyncStatusListener(null);
    };
  }, [loadAll]);

  useEffect(() => {
    if (siteSettings?.siteName) {
      const name = siteSettings.siteName[language] || siteSettings.siteName.en || 'Dholasan';
      document.title = `${name} · Community Website`;
    }
  }, [siteSettings.siteName, language]);

  const themeTriplets = useMemo(
    () => resolveThemeTriplets(siteSettings.themeColors),
    [siteSettings.themeColors]
  );

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (themeTriplets.primary) {
        root.style.setProperty('--brand-orange', themeTriplets.primary);
      }
      if (themeTriplets.secondary) {
        root.style.setProperty('--brand-blue', themeTriplets.secondary);
      }
    }
  }, [themeTriplets]);

  const getLabel = useCallback(
    (key: string): string => {
      const labels = siteSettings.labels || {};
      const val = labels[key] || store.defaultLabels[key];
      if (!val) return key;
      return val[language] || val.en || key;
    },
    [siteSettings.labels, language]
  );

  const updateNews = useCallback((articles: NewsArticle[]) => {
    store.setNewsArticles(articles);
    setNews(articles);
  }, []);

  const updateEvents = useCallback((ev: Event[]) => {
    store.setEvents(ev);
    setEvts(ev);
  }, []);

  const updateGallery = useCallback((images: GalleryImage[]) => {
    store.setGalleryImages(images);
    setGallery(images);
  }, []);

  const updateBusinesses = useCallback((b: Business[]) => {
    store.setBusinesses(b);
    setBiz(b);
  }, []);

  const updateNotices = useCallback((notices: CommunityNotice[]) => {
    store.setCommunityNotices(notices);
    setNotices(notices);
  }, []);

  const postNotice = useCallback(async (notice: Omit<CommunityNotice, 'id' | 'likes' | 'createdAt'>) => {
    const created = await store.addCommunityNotice(notice);
    setNotices(store.getCommunityNotices());
    return created;
  }, []);

  const likeNotice = useCallback(async (id: string) => {
    const count = await store.likeCommunityNotice(id);
    setNotices(store.getCommunityNotices());
    return count;
  }, []);

  const removeNotice = useCallback(async (id: string) => {
    const ok = await store.deleteCommunityNotice(id);
    setNotices(store.getCommunityNotices());
    return ok;
  }, []);

  const updateEmergencyContacts = useCallback((contacts: EmergencyContact[]) => {
    store.setEmergencyContacts(contacts);
    setEmergency(contacts);
  }, []);

  const updateLandmarks = useCallback((landmarks: VillageLandmark[]) => {
    store.setVillageLandmarks(landmarks);
    setLandmarks(landmarks);
  }, []);

  const updateDevelopmentProjects = useCallback((projects: DevelopmentProject[]) => {
    store.setDevelopmentProjects(projects);
    setProjects(projects);
  }, []);

  const updateSiteSettings = useCallback((s: SiteSettings) => {
    store.setSiteSettings(s);
    setSettings(s);
  }, []);

  const updatePageBlocks = useCallback((pageId: string, blocks: PageBlockConfig[]) => {
    store.savePageBlocks(pageId, blocks);
    setPageLayoutsState((prev) => ({ ...prev, [pageId]: blocks }));
  }, []);

  const addBlockToPage = useCallback(
    (pageId: string, block: PageBlockConfig, insertIndex?: number) => {
      const currentBlocks = pageLayouts[pageId] || store.defaultPageLayouts[pageId] || [];
      const updated = [...currentBlocks];
      if (insertIndex !== undefined && insertIndex >= 0 && insertIndex <= updated.length) {
        updated.splice(insertIndex, 0, block);
      } else {
        updated.push(block);
      }
      updatePageBlocks(pageId, updated);
    },
    [pageLayouts, updatePageBlocks]
  );

  const updateSingleBlock = useCallback(
    (pageId: string, block: PageBlockConfig) => {
      const currentBlocks = pageLayouts[pageId] || store.defaultPageLayouts[pageId] || [];
      const updated = currentBlocks.map((b) => (b.id === block.id ? block : b));
      updatePageBlocks(pageId, updated);
    },
    [pageLayouts, updatePageBlocks]
  );

  const removeBlockFromPage = useCallback(
    (pageId: string, blockId: string) => {
      const currentBlocks = pageLayouts[pageId] || store.defaultPageLayouts[pageId] || [];
      const updated = currentBlocks.filter((b) => b.id !== blockId);
      updatePageBlocks(pageId, updated);
    },
    [pageLayouts, updatePageBlocks]
  );

  const reorderPageBlocks = useCallback(
    (pageId: string, sourceIndex: number, destinationIndex: number) => {
      const currentBlocks = pageLayouts[pageId] || store.defaultPageLayouts[pageId] || [];
      if (
        sourceIndex < 0 ||
        sourceIndex >= currentBlocks.length ||
        destinationIndex < 0 ||
        destinationIndex >= currentBlocks.length
      ) {
        return;
      }
      const updated = [...currentBlocks];
      const [removed] = updated.splice(sourceIndex, 1);
      updated.splice(destinationIndex, 0, removed);
      updatePageBlocks(pageId, updated);
    },
    [pageLayouts, updatePageBlocks]
  );

  const toggleBlockVisibility = useCallback(
    (pageId: string, blockId: string) => {
      const currentBlocks = pageLayouts[pageId] || store.defaultPageLayouts[pageId] || [];
      const updated = currentBlocks.map((b) => (b.id === blockId ? { ...b, enabled: !b.enabled } : b));
      updatePageBlocks(pageId, updated);
    },
    [pageLayouts, updatePageBlocks]
  );

  const resetPageLayoutToDefault = useCallback(
    (pageId: string) => {
      const defaults = store.defaultPageLayouts[pageId] || [];
      updatePageBlocks(pageId, defaults);
    },
    [updatePageBlocks]
  );

  const logActivity = useCallback((action: string, section: string, detail: string) => {
    store.addAdminActivity(action, section, detail);
    setActivity(store.getAdminActivity());
  }, []);

  const submitContactMessage = useCallback((msg: { name: string; email: string; subject: string; message: string }) => {
    store.addContactMessage(msg);
    setMessages(store.getContactMessages());
  }, []);

  const markMessageRead = useCallback(
    (id: string, read: boolean) => {
      const msg = contactMessages.find((m) => m.id === id);
      if (!msg) return;
      const updated = { ...msg, read };
      store.updateContactMessage(updated);
      setMessages(contactMessages.map((m) => (m.id === id ? updated : m)));
    },
    [contactMessages]
  );

  const removeContactMessage = useCallback(
    (id: string) => {
      store.deleteContactMessage(id);
      setMessages(contactMessages.filter((m) => m.id !== id));
    },
    [contactMessages]
  );

  const restoreBackup = useCallback(
    (id: string): boolean => {
      const ok = store.restoreBackup(id);
      if (ok) loadAll();
      return ok;
    },
    [loadAll]
  );

  const clearBackups = useCallback(() => {
    store.clearBackups();
    setBackups([]);
  }, []);

  const resetAll = useCallback(() => {
    store.resetAllData();
    loadAll();
  }, [loadAll]);

  return (
    <ContentContext.Provider
      value={{
        newsArticles,
        events,
        galleryImages,
        businesses,
        communityNotices,
        emergencyContacts,
        villageLandmarks,
        developmentProjects,
        siteSettings,
        pageLayouts,
        themeTriplets,
        adminActivity,
        contactMessages,
        backups,
        syncStatus,
        syncError,
        getLabel,
        updateNews,
        updateEvents,
        updateGallery,
        updateBusinesses,
        updateNotices,
        postNotice,
        likeNotice,
        removeNotice,
        updateEmergencyContacts,
        updateLandmarks,
        updateDevelopmentProjects,
        updateSiteSettings,
        updatePageBlocks,
        addBlockToPage,
        updateSingleBlock,
        removeBlockFromPage,
        reorderPageBlocks,
        toggleBlockVisibility,
        resetPageLayoutToDefault,
        logActivity,
        submitContactMessage,
        markMessageRead,
        removeContactMessage,
        restoreBackup,
        clearBackups,
        resetAll,
        refreshAll: loadAll,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
