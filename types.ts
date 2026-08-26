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
  eventDate?: string;
}

export type GalleryCategory = string;

export interface GalleryImage {
  id: number;
  src: string;
  alt: TranslatableString;
  category: GalleryCategory;
}

export interface GalleryCategoryItem {
  id: string;
  label: TranslatableString;
}

export interface NavLinkItem {
  id: string;
  label: TranslatableString;
  path: string;
  enabled: boolean;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: number;
}

export type NoticeCategory = 'announcement' | 'achievement' | 'emergency' | 'general';

export interface CommunityNotice {
  id: string;
  title: TranslatableString;
  content: TranslatableString;
  category: NoticeCategory;
  author: string;
  contact?: string;
  date: string;
  pinned?: boolean;
  likes: number;
  approved?: boolean;
  createdAt: number;
}

export type EmergencyCategory = 'medical' | 'civic' | 'police' | 'utility' | 'veterinary';

export interface EmergencyContact {
  id: string;
  name: TranslatableString;
  role: TranslatableString;
  phone: string;
  whatsapp?: string;
  category: EmergencyCategory;
  availableHours: TranslatableString;
  address?: TranslatableString;
}

export interface VillageLandmark {
  id: string;
  name: TranslatableString;
  category: TranslatableString;
  description: TranslatableString;
  imageUrl: string;
  locationQuery?: string;
  timing?: TranslatableString;
}

export interface DonorItem {
  id: string;
  name: string;
  amount: number;
  location?: string;
  message?: string;
}

export interface DevelopmentProject {
  id: string;
  title: TranslatableString;
  description: TranslatableString;
  category: TranslatableString;
  targetAmount: number;
  raisedAmount: number;
  status: 'ongoing' | 'completed' | 'planned';
  imageUrl: string;
  donors: DonorItem[];
  upiId?: string;
  bankDetails?: TranslatableString;
}

export interface BackupSnapshot {
  id: string;
  timestamp: number;
  label: string;
  data: {
    news: NewsArticle[];
    events: Event[];
    gallery: GalleryImage[];
    businesses: Business[];
    notices?: CommunityNotice[];
    emergencyContacts?: EmergencyContact[];
    landmarks?: VillageLandmark[];
    developmentProjects?: DevelopmentProject[];
    siteSettings: SiteSettings;
  };
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

export interface LiveEvent {
  isLive: boolean;
  name: TranslatableString;
  url: string;
  platform: string;
  thumbnailUrl: string;
}

export interface Festival {
  id: number;
  name: TranslatableString;
  description: TranslatableString;
  imageUrl: string;
}

export interface SiteSettings {
  siteName: TranslatableString;
  siteTagline: TranslatableString;
  navLinks: NavLinkItem[];
  heroTitle: TranslatableString;
  heroSubtitle: TranslatableString;
  heroImageUrl: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialFacebook: string;
  socialInstagram: string;
  socialYoutube: string;
  mapEmbedUrl: string;
  galleryCategories: GalleryCategoryItem[];
  aboutHistory: TranslatableString;
  aboutKeyFacts: KeyFact[];
  aboutConnectivity: TranslatableString;
  communityGovernance: GovernanceMember[];
  communityEducation: TranslatableString;
  communityHealthcare: TranslatableString;
  festivals: Festival[];
  liveEvent: LiveEvent;
  labels: Record<string, TranslatableString>;
  footerTagline: TranslatableString;
  footerCopyright: TranslatableString;
  themeColors: ThemeColors;
}

export interface AdminActivity {
  id: string;
  action: string;
  section: string;
  timestamp: number;
  detail: string;
}

export type BlockType =
  | 'hero'
  | 'quickLinks'
  | 'stats'
  | 'richText'
  | 'banner'
  | 'features'
  | 'newsFeed'
  | 'eventsFeed'
  | 'galleryGrid'
  | 'noticesFeed'
  | 'projectsFeed'
  | 'contactCard'
  | 'customEmbed';

export interface BlockStyleConfig {
  backgroundColor?: 'default' | 'muted' | 'brand' | 'dark' | 'gradient' | 'warm';
  padding?: 'none' | 'compact' | 'normal' | 'spacious';
  containerWidth?: 'standard' | 'narrow' | 'wide' | 'full';
  align?: 'left' | 'center' | 'right';
  borderRadius?: 'none' | 'rounded' | 'pill';
  shadow?: 'none' | 'subtle' | 'medium' | 'elevated' | 'glow';
  animation?: 'none' | 'fade' | 'slide-up' | 'zoom-in';
  showDivider?: boolean;
  customCssClass?: string;
}


export interface HeroBlockProps {
  title: TranslatableString;
  subtitle: TranslatableString;
  tagline?: TranslatableString;
  imageUrl: string;
  primaryCtaText?: TranslatableString;
  primaryCtaLink?: string;
  secondaryCtaText?: TranslatableString;
  secondaryCtaLink?: string;
  showLiveBanner?: boolean;
}

export interface QuickLinkItem {
  id: string;
  title: TranslatableString;
  subtitle?: TranslatableString;
  to: string;
  iconName?: 'info' | 'calendar' | 'newspaper' | 'camera' | 'building' | 'heart' | 'phone' | 'users';
  color?: string;
}

export interface QuickLinksBlockProps {
  title?: TranslatableString;
  subtitle?: TranslatableString;
  items: QuickLinkItem[];
}

export interface StatItem {
  id: string;
  number: string;
  suffix?: string;
  label: TranslatableString;
  sublabel?: TranslatableString;
}

export interface StatsBlockProps {
  title?: TranslatableString;
  subtitle?: TranslatableString;
  items: StatItem[];
}

export interface RichTextBlockProps {
  title: TranslatableString;
  subtitle?: TranslatableString;
  content: TranslatableString;
  imageUrl?: string;
  imagePosition?: 'left' | 'right' | 'top' | 'none';
  buttonText?: TranslatableString;
  buttonLink?: string;
}

export interface BannerBlockProps {
  badge?: TranslatableString;
  title: TranslatableString;
  message: TranslatableString;
  linkText?: TranslatableString;
  linkUrl?: string;
  variant?: 'orange' | 'blue' | 'green' | 'amber' | 'red';
}

export interface FeatureItem {
  id: string;
  title: TranslatableString;
  description: TranslatableString;
  iconName?: string;
}

export interface FeaturesBlockProps {
  title?: TranslatableString;
  subtitle?: TranslatableString;
  columns?: 2 | 3 | 4;
  features: FeatureItem[];
}

export interface FeedBlockProps {
  title?: TranslatableString;
  subtitle?: TranslatableString;
  limit?: number;
  viewAllLink?: string;
  viewAllText?: TranslatableString;
}

export interface ContactCardBlockProps {
  title?: TranslatableString;
  subtitle?: TranslatableString;
  showHelplines?: boolean;
  showDirectMessage?: boolean;
  showMap?: boolean;
}

export interface CustomEmbedBlockProps {
  title?: TranslatableString;
  embedType?: 'iframe' | 'youtube' | 'html';
  codeOrUrl: string;
  height?: number;
}

export type BlockPropsMap = {
  hero: HeroBlockProps;
  quickLinks: QuickLinksBlockProps;
  stats: StatsBlockProps;
  richText: RichTextBlockProps;
  banner: BannerBlockProps;
  features: FeaturesBlockProps;
  newsFeed: FeedBlockProps;
  eventsFeed: FeedBlockProps;
  galleryGrid: FeedBlockProps;
  noticesFeed: FeedBlockProps;
  projectsFeed: FeedBlockProps;
  contactCard: ContactCardBlockProps;
  customEmbed: CustomEmbedBlockProps;
};

export interface PageBlockConfig<T extends BlockType = BlockType> {
  id: string;
  type: T;
  name?: string;
  enabled: boolean;
  props: BlockPropsMap[T];
  style?: BlockStyleConfig;
}

export type PageLayoutMap = Record<string, PageBlockConfig[]>;

