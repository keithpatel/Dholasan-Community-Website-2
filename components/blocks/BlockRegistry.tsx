import React from 'react';
import { BlockType, PageBlockConfig } from '../../types';
import HeroBlock from './HeroBlock';
import QuickLinksBlock from './QuickLinksBlock';
import StatsCounterBlock from './StatsCounterBlock';
import RichTextBlock from './RichTextBlock';
import BannerBlock from './BannerBlock';
import FeaturesBlock from './FeaturesBlock';
import {
  NewsFeedBlock,
  EventsFeedBlock,
  NoticesFeedBlock,
  ProjectsFeedBlock,
  GalleryGridBlock,
} from './FeedBlocks';
import ContactCardBlock from './ContactCardBlock';
import CustomEmbedBlock from './CustomEmbedBlock';

export const BlockRegistry: Record<BlockType, React.FC<{ props: any; style?: any }>> = {
  hero: HeroBlock,
  quickLinks: QuickLinksBlock,
  stats: StatsCounterBlock,
  richText: RichTextBlock,
  banner: BannerBlock,
  features: FeaturesBlock,
  newsFeed: NewsFeedBlock,
  eventsFeed: EventsFeedBlock,
  noticesFeed: NoticesFeedBlock,
  projectsFeed: ProjectsFeedBlock,
  galleryGrid: GalleryGridBlock,
  contactCard: ContactCardBlock,
  customEmbed: CustomEmbedBlock,
};

export interface BlockMeta {
  type: BlockType;
  label: string;
  description: string;
  icon: string;
  defaultProps: any;
}

export const BLOCK_METADATA: BlockMeta[] = [
  {
    type: 'hero',
    label: 'Hero Banner',
    description: 'Cinematic hero header with background photo, title, subtitle & CTA buttons.',
    icon: '🖼️',
    defaultProps: {
      title: { en: 'Welcome to Dholasan', gu: 'ધોળાસણમાં આપનું સ્વાગત છે' },
      subtitle: { en: 'A village of heritage, harmony and progress.', gu: 'વારસો, સંવાદિતા અને પ્રગતિનું ગામ.' },
      tagline: { en: 'Pavitra Bhumi', gu: 'પવિત્ર ભૂમિ' },
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1600&q=80',
      primaryCtaText: { en: 'Explore Village', gu: 'ગામનું અન્વેષણ કરો' },
      primaryCtaLink: '/about',
      secondaryCtaText: { en: 'Community Hub', gu: 'સમુદાય મંચ' },
      secondaryCtaLink: '/community',
      showLiveBanner: true,
    },
  },
  {
    type: 'quickLinks',
    label: 'Quick Action Links',
    description: 'Grid of icon action cards linking to important village pages.',
    icon: '⚡',
    defaultProps: {
      title: { en: 'Explore Dholasan', gu: 'ધોળાસણનું અન્વેષણ કરો' },
      subtitle: { en: 'Quick navigation to key services', gu: 'મુખ્ય સેવાઓની ઝડપી ઍક્સેસ' },
      items: [
        { id: 'ql_1', title: { en: 'About Us', gu: 'અમારા વિશે' }, subtitle: { en: 'Village History', gu: 'ગામનો ઇતિહાસ' }, to: '/about', iconName: 'info' },
        { id: 'ql_2', title: { en: 'Events', gu: 'કાર્યક્રમો' }, subtitle: { en: 'Festivals', gu: 'ઉત્સવો' }, to: '/events', iconName: 'calendar' },
        { id: 'ql_3', title: { en: 'Notice Board', gu: 'સૂચના પત્રક' }, subtitle: { en: 'Community updates', gu: 'સમાચાર' }, to: '/community', iconName: 'users' },
      ],
    },
  },
  {
    type: 'stats',
    label: 'Stats Counter',
    description: 'Showcase key metrics like population, area, literacy, and temples.',
    icon: '📊',
    defaultProps: {
      title: { en: 'Dholasan Highlights', gu: 'ધોળાસણના મુખ્ય આંકડા' },
      subtitle: { en: 'Key demographic indicators', gu: 'વસ્તી અને વિકાસ' },
      items: [
        { id: 'st_1', number: '2,500+', suffix: '', label: { en: 'Population', gu: 'કુલ વસ્તી' }, sublabel: { en: 'Warm families', gu: 'પરિવારો' } },
        { id: 'st_2', number: '82%', suffix: '', label: { en: 'Literacy Rate', gu: 'સાક્ષરતા દર' }, sublabel: { en: 'High education', gu: 'શિક્ષણ' } },
        { id: 'st_3', number: '4.8', suffix: ' sq km', label: { en: 'Total Area', gu: 'વિસ્તાર' }, sublabel: { en: 'Farms & lakes', gu: 'ખેતરો' } },
        { id: 'st_4', number: '7+', suffix: '', label: { en: 'Temples', gu: 'મંદિરો' }, sublabel: { en: 'Spiritual roots', gu: 'ધાર્મિક વારસો' } },
      ],
    },
  },
  {
    type: 'richText',
    label: 'Rich Text Section',
    description: 'Editorial article section with custom image, bilingual body text, and CTA.',
    icon: '📝',
    defaultProps: {
      title: { en: 'New Feature Story', gu: 'નવી વિશેષ કથા' },
      subtitle: { en: 'Community Story', gu: 'ગામની કથા' },
      content: {
        en: 'Write your story details here. You can include paragraphs about village history, news, or announcements.',
        gu: 'અહીં તમારી વિગતવાર માહિતી લખો. તમે ગામના ઇતિહાસ, સમાચાર કે વાર્તાઓ વિશે લખી શકો છો.',
      },
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
      imagePosition: 'right',
      buttonText: { en: 'Learn More', gu: 'વધુ જાણો' },
      buttonLink: '/about',
    },
  },
  {
    type: 'banner',
    label: 'Callout Banner',
    description: 'Highlighted announcement or emergency callout box with accent colors.',
    icon: '📢',
    defaultProps: {
      badge: { en: 'ANNOUNCEMENT', gu: 'મહત્વપૂર્ણ જાહેરાત' },
      title: { en: 'Important Notice for Villagers', gu: 'ગ્રામજનો માટે અગત્યની સૂચના' },
      message: { en: 'Stay tuned for upcoming community development meetings.', gu: 'આગામી ગ્રામ સભા અને વિકાસ બેઠક માટે તૈયાર રહો.' },
      linkText: { en: 'Read Notice', gu: 'સૂચના વાંચો' },
      linkUrl: '/community',
      variant: 'orange',
    },
  },
  {
    type: 'features',
    label: 'Feature Cards Grid',
    description: 'Multi-column cards highlighting village facilities, governance or services.',
    icon: '✨',
    defaultProps: {
      title: { en: 'Village Public Services', gu: 'ગામની જાહેર સેવાઓ' },
      subtitle: { en: 'Modern civic infrastructure available in Dholasan', gu: 'ધોળાસણમાં ઉપલબ્ધ આધુનિક સુવિધાઓ' },
      columns: 3,
      features: [
        { id: 'f_1', title: { en: 'Digital Panchayat', gu: 'ડિજિટલ પંચાયત' }, description: { en: 'Online certificates & revenue portal.', gu: 'ઓનલાઇન દાખલા અને સેવાઓ.' } },
        { id: 'f_2', title: { en: 'Primary Healthcare', gu: 'પ્રાથમિક આરોગ્ય કેન્દ્ર' }, description: { en: '24/7 medical staff and ambulance support.', gu: '24 કલાક તબીબી સ્ટાફ અને એમ્બ્યુલન્સ સુવિધા.' } },
        { id: 'f_3', title: { en: 'Pure RO Water Plant', gu: 'આર.ઓ. ફિલ્ટર પાણી પ્લાન્ટ' }, description: { en: 'Clean drinking water network to every household.', gu: 'દરેક ઘરે શુદ્ધ પીવાનું પાણી પૂરું પાડતી સિસ્ટમ.' } },
      ],
    },
  },
  {
    type: 'noticesFeed',
    label: 'Notices Feed',
    description: 'Live community notice board feed showing latest approved announcements.',
    icon: '📌',
    defaultProps: {
      title: { en: 'Community Notice Board', gu: 'સમુદાય સૂચના પત્રક' },
      subtitle: { en: 'Verified announcements and alerts from villagers', gu: 'ગ્રામજનો તરફથી ચકાસાયેલી સૂચનાઓ' },
      limit: 3,
      viewAllLink: '/community',
    },
  },
  {
    type: 'projectsFeed',
    label: 'Vikas Projects Feed',
    description: 'Live development projects showcase with target and raised amounts.',
    icon: '🏗️',
    defaultProps: {
      title: { en: 'Village Vikas Projects', gu: 'ગામ વિકાસ પ્રોજેક્ટ્સ' },
      subtitle: { en: 'Join hands to modernize our village infrastructure', gu: 'આપણા ગામના વિકાસમાં સહભાગી બનો' },
      limit: 3,
      viewAllLink: '/community',
    },
  },
  {
    type: 'newsFeed',
    label: 'Latest News Feed',
    description: 'Shows recent articles and press releases from the village.',
    icon: '📰',
    defaultProps: {
      title: { en: 'Latest News & Highlights', gu: 'નવીનતમ સમાચાર અને જાહેરાતો' },
      subtitle: { en: 'Stay informed on the latest happenings', gu: 'બધી નવી ઘટનાઓથી માહિતગાર રહો' },
      limit: 3,
      viewAllLink: '/about',
    },
  },
  {
    type: 'eventsFeed',
    label: 'Events Feed',
    description: 'Shows upcoming village festivals, assemblies, and celebrations.',
    icon: '🎉',
    defaultProps: {
      title: { en: 'Upcoming Events & Gatherings', gu: 'આગામી ઉત્સવો અને કાર્યક્રમો' },
      subtitle: { en: 'Celebrate festivals and community gatherings together', gu: 'ગામના તહેવારો અને મેળાવડાઓમાં જોડાઓ' },
      limit: 3,
      viewAllLink: '/events',
    },
  },
  {
    type: 'galleryGrid',
    label: 'Gallery Photo Grid',
    description: 'Curated photo showcase with full-screen lightbox preview.',
    icon: '📸',
    defaultProps: {
      title: { en: 'A Glimpse of Dholasan', gu: 'ધોળાસણની એક ઝલક' },
      subtitle: { en: 'Visual memories and scenic views of our village', gu: 'ગામના સુંદર દ્રશ્યો અને સ્મૃતિઓ' },
      limit: 6,
      viewAllLink: '/gallery',
    },
  },
  {
    type: 'contactCard',
    label: 'Contact & Helpline Card',
    description: 'Official panchayat address, phone, email, and direct message box.',
    icon: '☎️',
    defaultProps: {
      title: { en: 'Get in Touch with Dholasan', gu: 'ધોળાસણ ગ્રામ પંચાયતનો સંપર્ક કરો' },
      subtitle: { en: 'Direct communication portal', gu: 'સીધો સંપર્ક પોર્ટલ' },
      showHelplines: true,
      showDirectMessage: true,
      showMap: true,
    },
  },
  {
    type: 'customEmbed',
    label: 'Custom Map / Embed',
    description: 'Embed Google Maps, YouTube video, or custom iframe.',
    icon: '🗺️',
    defaultProps: {
      title: { en: 'Location Map', gu: 'નકશો' },
      embedType: 'iframe',
      codeOrUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3659.123456789!2d72.3!3d23.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDM2JzAwLjAiTiA3MsKwMTgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin',
      height: 400,
    },
  },
];
