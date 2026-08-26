export type Language = 'en' | 'gu';

export interface TranslatableString {
  en: string;
  gu: string;
}

export interface NewsArticle {
  id: number;
  title: TranslatableString;
  summary: TranslatableString;
  date: string;
}

export interface Event {
  id: number;
  name: TranslatableString;
  date: TranslatableString;
  time: string;
  location: TranslatableString;
  description: TranslatableString;
  isPast?: boolean;
}

export type GalleryCategory = 'Festivals' | 'Daily Life' | 'Scenery';

export interface GalleryImage {
  id: number;
  src: string;
  alt: TranslatableString;
  category: GalleryCategory;
}

export interface Business {
  id: number;
  name: TranslatableString;
  category: TranslatableString;
  contactPerson: string;
  contactNumber: string;
}

export interface KeyFact {
  label: TranslatableString;
  value: TranslatableString;
}

export interface GovernanceMember {
  role: TranslatableString;
  name: string;
}

export interface Festival {
  id: number;
  name: TranslatableString;
  description: TranslatableString;
  imageUrl: string;
}

export interface SiteSettings {
  heroTitle: TranslatableString;
  heroSubtitle: TranslatableString;
  heroImageUrl: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialFacebook: string;
  socialInstagram: string;
  socialYoutube: string;
  aboutHistory: TranslatableString;
  aboutKeyFacts: KeyFact[];
  aboutConnectivity: TranslatableString;
  communityGovernance: GovernanceMember[];
  communityEducation: TranslatableString;
  communityHealthcare: TranslatableString;
  festivals: Festival[];
}

export interface AdminActivity {
  id: string;
  action: string;
  section: string;
  timestamp: number;
  detail: string;
}
