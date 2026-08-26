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
import {
  newsArticles as defaultNews,
  events as defaultEvents,
  galleryImages as defaultGallery,
  businesses as defaultBusinesses,
  communityNotices as defaultNotices,
  emergencyContacts as defaultEmergencies,
  villageLandmarks as defaultLandmarks,
  developmentProjects as defaultProjects,
} from './content';
import { db } from '../firebase';
import { doc, setDoc, onSnapshot, getDocs, collection, deleteDoc } from 'firebase/firestore';

const STORAGE_KEYS = {
  NEWS: 'dholasan_news',
  EVENTS: 'dholasan_events',
  GALLERY: 'dholasan_gallery',
  BUSINESSES: 'dholasan_businesses',
  NOTICES: 'dholasan_community_notices',
  EMERGENCY: 'dholasan_emergency_contacts',
  LANDMARKS: 'dholasan_village_landmarks',
  PROJECTS: 'dholasan_development_projects',
  SITE_SETTINGS: 'dholasan_site_settings',
  ADMIN_ACTIVITY: 'dholasan_admin_activity',
  MESSAGES: 'dholasan_contact_messages',
  BACKUPS: 'dholasan_backups',
  PAGE_LAYOUTS: 'dholasan_page_layouts',
};

export const defaultPageLayouts: PageLayoutMap = {
  home: [
    {
      id: 'blk_home_hero',
      type: 'hero',
      name: 'Cinematic Hero Banner',
      enabled: true,
      props: {
        title: { en: 'Welcome to Dholasan', gu: 'ધોળાસણમાં આપનું સ્વાગત છે' },
        subtitle: {
          en: 'A progressive, culturally rich village in Mehsana district, Gujarat, embracing heritage and modern development.',
          gu: 'ગુજરાતના મહેસાણા જિલ્લામાં આવેલું એક પ્રગતિશીલ, સાંસ્કૃતિક અને સમૃદ્ધ ગામ.',
        },
        tagline: { en: 'A Village of Heritage & Harmony', gu: 'વારસો અને સંવાદિતાનું ગામ' },
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1600&q=80',
        primaryCtaText: { en: 'Explore Our Village', gu: 'આપણું ગામ શોધો' },
        primaryCtaLink: '/about',
        secondaryCtaText: { en: 'Community Hub', gu: 'સમુદાય મંચ' },
        secondaryCtaLink: '/community',
        showLiveBanner: true,
      },
      style: { backgroundColor: 'default', padding: 'none' },
    },
    {
      id: 'blk_home_quick',
      type: 'quickLinks',
      name: 'Quick Navigation Links',
      enabled: true,
      props: {
        title: { en: 'Explore Dholasan', gu: 'ધોળાસણનું અન્વેષણ કરો' },
        subtitle: {
          en: 'Quick access to all village portals and community resources',
          gu: 'ગામના તમામ પોર્ટલ અને સમુદાય સંસાધનોની ઝડપી ઍક્સેસ',
        },
        items: [
          {
            id: 'ql_about',
            title: { en: 'About Dholasan', gu: 'ધોળાસણ વિશે' },
            subtitle: { en: 'History, heritage & connectivity', gu: 'ઇતિહાસ, વારસો & માહિતી' },
            to: '/about',
            iconName: 'info',
            color: 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400',
          },
          {
            id: 'ql_events',
            title: { en: 'Upcoming Events', gu: 'આગામી કાર્યક્રમો' },
            subtitle: { en: 'Festivals & celebrations', gu: 'તહેવારો અને ઉત્સવો' },
            to: '/events',
            iconName: 'calendar',
            color: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
          },
          {
            id: 'ql_community',
            title: { en: 'Community & Notices', gu: 'સમાચાર & સૂચનાઓ' },
            subtitle: { en: 'Notice board & emergency help', gu: 'સૂચના પત્રક & હેલ્પલાઇન' },
            to: '/community',
            iconName: 'users',
            color: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
          },
          {
            id: 'ql_gallery',
            title: { en: 'Photo Gallery', gu: 'ફોટો ગેલેરી' },
            subtitle: { en: 'Village photos & memories', gu: 'ગામની તસવીરો અને સ્મૃતિઓ' },
            to: '/gallery',
            iconName: 'camera',
            color: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400',
          },
          {
            id: 'ql_projects',
            title: { en: 'Development Projects', gu: 'ગામ વિકાસ પ્રોજેક્ટ' },
            subtitle: { en: 'Vikas initiatives & donations', gu: 'વિકાસ કાર્યો અને દાન' },
            to: '/community',
            iconName: 'building',
            color: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
          },
          {
            id: 'ql_emergency',
            title: { en: 'Emergency Helplines', gu: 'ઇમરજન્સી હેલ્પલાઇન' },
            subtitle: { en: '24/7 medical & utility contacts', gu: '24/7 તાત્કાલિક સેવાઓ' },
            to: '/community',
            iconName: 'phone',
            color: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400',
          },
        ],
      },
      style: { backgroundColor: 'default', padding: 'normal' },
    },
    {
      id: 'blk_home_notices',
      type: 'noticesFeed',
      name: 'Community Notices Board',
      enabled: true,
      props: {
        title: { en: 'Community Notice Board', gu: 'સમુદાય સૂચના પત્રક' },
        subtitle: {
          en: 'Stay updated with verified announcements, blood requirements, and alerts from villagers.',
          gu: 'ગામલોકો તરફથી ચકાસાયેલી જાહેરાતો, રક્તદાન અને ચેતવણીઓથી માહિતગાર રહો.',
        },
        limit: 3,
        viewAllLink: '/community',
        viewAllText: { en: 'View All Notices & Post Message', gu: 'બધી સૂચનાઓ જુઓ અને સંદેશ મોકલો' },
      },
      style: { backgroundColor: 'muted', padding: 'normal' },
    },
    {
      id: 'blk_home_projects',
      type: 'projectsFeed',
      name: 'Vikas Development Projects',
      enabled: true,
      props: {
        title: { en: 'Village Vikas Projects', gu: 'ગામ વિકાસ પ્રોજેક્ટ્સ' },
        subtitle: {
          en: 'Support our village transformation initiatives through transparency and community donations.',
          gu: 'પારદર્શિતા અને સમુદાય દાન દ્વારા અમારા ગામ પરિવર્તન પ્રોજેક્ટ્સને સમર્થન આપો.',
        },
        limit: 3,
        viewAllLink: '/community',
        viewAllText: { en: 'View All Projects & Contribute', gu: 'બધા પ્રોજેક્ટ્સ જુઓ અને સહયોગ કરો' },
      },
      style: { backgroundColor: 'default', padding: 'normal' },
    },
    {
      id: 'blk_home_news',
      type: 'newsFeed',
      name: 'Latest News Section',
      enabled: true,
      props: {
        title: { en: 'Latest News & Highlights', gu: 'નવીનતમ સમાચાર અને જાહેરાતો' },
        subtitle: {
          en: 'Read the latest updates and achievements happening around Dholasan.',
          gu: 'ધોળાસણમાં બની રહેલી તમામ નવીનતમ ઘટનાઓ અને સિદ્ધિઓ વાંચો.',
        },
        limit: 3,
        viewAllLink: '/about',
        viewAllText: { en: 'Read All Stories', gu: 'બધા સમાચારો વાંચો' },
      },
      style: { backgroundColor: 'muted', padding: 'normal' },
    },
    {
      id: 'blk_home_events',
      type: 'eventsFeed',
      name: 'Upcoming Events & Celebrations',
      enabled: true,
      props: {
        title: { en: 'Upcoming Events & Gatherings', gu: 'આગામી ઉત્સવો અને કાર્યક્રમો' },
        subtitle: {
          en: 'Join in our vibrant festivals, yagnas, cricket tournaments, and community assemblies.',
          gu: 'અમારા ઉત્સાહપૂર્ણ તહેવારો, યજ્ઞો, ક્રિકેટ ટૂર્નામેન્ટ અને સભાઓમાં જોડાઓ.',
        },
        limit: 3,
        viewAllLink: '/events',
        viewAllText: { en: 'View All Celebrations', gu: 'બધા ઉત્સવો જુઓ' },
      },
      style: { backgroundColor: 'default', padding: 'normal' },
    },
    {
      id: 'blk_home_gallery',
      type: 'galleryGrid',
      name: 'Village Photo Showcase',
      enabled: true,
      props: {
        title: { en: 'A Glimpse of Dholasan', gu: 'ધોળાસણની એક ઝલક' },
        subtitle: {
          en: 'Explore the beauty, architecture, farms, and cultural festivities of our village.',
          gu: 'અમારા ગામની સુંદરતા, સ્થાપત્ય, ખેતરો અને સાંસ્કૃતિક ઉત્સવો નિહાળો.',
        },
        limit: 6,
        viewAllLink: '/gallery',
        viewAllText: { en: 'View Full Gallery', gu: 'સંપૂર્ણ ફોટો ગેલેરી જુઓ' },
      },
      style: { backgroundColor: 'muted', padding: 'normal' },
    },
    {
      id: 'blk_home_banner',
      type: 'banner',
      name: 'Emergency Support Banner',
      enabled: true,
      props: {
        badge: { en: '24/7 HELPLINE', gu: '24/7 સહાયતા' },
        title: { en: 'Need Assistance in Dholasan?', gu: 'ધોળાસણમાં સહાયતાની જરૂર છે?' },
        message: {
          en: 'Direct emergency telephone numbers for health centers, 108 ambulance, power grid, and sarpanch office.',
          gu: 'આરોગ્ય કેન્દ્ર, 108 એમ્બ્યુલન્સ, વીજળી બોર્ડ અને સરપંચ કાર્યાલયના સીધા સંપર્ક નંબરો.',
        },
        linkText: { en: 'Access Emergency Directory', gu: 'ઇમરજન્સી હેલ્પલાઇન જુઓ' },
        linkUrl: '/community',
        variant: 'orange',
      },
      style: { backgroundColor: 'default', padding: 'compact' },
    },
  ],
  about: [
    {
      id: 'blk_about_rich_1',
      type: 'richText',
      name: 'Heritage & History Section',
      enabled: true,
      props: {
        title: { en: 'Our Heritage & History', gu: 'આપણો ઇતિહાસ અને વારસો' },
        subtitle: { en: 'Centuries of tradition, agriculture, and unity', gu: 'પરંપરા, કૃષિ અને એકતાનો સમૃદ્ધ વારસો' },
        content: {
          en: 'Dholasan is a historic and progressive village situated in the Mehsana district of Gujarat, India. Rooted in rich Gujarati culture and strong community bonds, Dholasan is renowned for its lush agricultural fields, historical temples, and hospitable people.',
          gu: 'ધોળાસણ ભારત દેશના પશ્ચિમ ભાગમાં આવેલા ગુજરાત રાજ્યના ઉત્તર ભાગમાં આવેલા મહેસાણા જિલ્લામાં આવેલું એક સુંદર અને પ્રગતિશીલ ગામ છે. સમૃદ્ધ ગુજરાતી સંસ્કૃતિ અને મજબૂત સામાજિક એકતા સાથે ધોળાસણ તેના લીલાછમ ખેતરો, પવિત્ર મંદિરો અને પ્રેમાળ ગ્રામજનો માટે જાણીતું છે.',
        },
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80',
        imagePosition: 'right',
        buttonText: { en: 'View Landmarks', gu: 'દર્શનીય સ્થળો જુઓ' },
        buttonLink: '#landmarks',
      },
      style: { backgroundColor: 'default', padding: 'normal' },
    },
    {
      id: 'blk_about_stats_1',
      type: 'stats',
      name: 'Village Key Statistics',
      enabled: true,
      props: {
        title: { en: 'Dholasan at a Glance', gu: 'એક નજરમાં ધોળાસણ' },
        subtitle: { en: 'Key facts and demographic milestones of our village', gu: 'આપણા ગામના મુખ્ય તથ્યો અને આંકડા' },
        items: [
          { id: 'st_pop', number: '2,500+', suffix: '', label: { en: 'Total Population', gu: 'કુલ વસ્તી' }, sublabel: { en: 'Warm & united families', gu: 'સંગઠિત પરિવારો' } },
          { id: 'st_lit', number: '82%', suffix: '', label: { en: 'Literacy Rate', gu: 'સાક્ષરતા દર' }, sublabel: { en: 'Focus on higher education', gu: 'ઉચ્ચ શિક્ષણ પર ભાર' } },
          { id: 'st_area', number: '4.8', suffix: ' sq km', label: { en: 'Total Area', gu: 'કુલ વિસ્તાર' }, sublabel: { en: 'Farms, lakes & green covers', gu: 'ખેતરો, તળાવો અને વસાહત' } },
          { id: 'st_temples', number: '7+', suffix: '', label: { en: 'Sacred Temples', gu: 'પવિત્ર મંદિરો' }, sublabel: { en: 'Spiritual roots & peace', gu: 'આધ્યાત્મિક વારસો' } },
        ],
      },
      style: { backgroundColor: 'muted', padding: 'normal' },
    },
  ],
  contact: [
    {
      id: 'blk_contact_card_1',
      type: 'contactCard',
      name: 'Contact & Helpline Card',
      enabled: true,
      props: {
        title: { en: 'Get in Touch with Dholasan', gu: 'ધોળાસણ ગ્રામ પંચાયતનો સંપર્ક કરો' },
        subtitle: { en: 'Reach out for inquiries, certificates, assistance, or village visits.', gu: 'પૂછપરછ, પ્રમાણપત્રો, સહાય અથવા ગામની મુલાકાત માટે સંપર્ક કરો.' },
        showHelplines: true,
        showDirectMessage: true,
        showMap: true,
      },
      style: { backgroundColor: 'default', padding: 'normal' },
    },
  ],
};


export const defaultLabels: Record<string, { en: string; gu: string }> = {
  'home.heroCta': { en: 'Explore Our Village', gu: 'આપણું ગામ શોધો' },
  'home.quick.about': { en: 'About Dholasan', gu: 'ધોળાસણ વિશે' },
  'home.quick.events': { en: 'Upcoming Events', gu: 'આગામી કાર્યક્રમો' },
  'home.quick.community': { en: 'Community & Notices', gu: 'સમાચાર & સૂચનાઓ' },
  'home.quick.gallery': { en: 'Photo Gallery', gu: 'ફોટો ગેલેરી' },
  'home.quick.emergency': { en: 'Emergency Contacts', gu: 'ઇમરજન્સી હેલ્પલાઇન' },
  'home.quick.projects': { en: 'Development Projects', gu: 'ગામ વિકાસ પ્રોજેક્ટ' },
  'home.latestNews': { en: 'Latest News & Announcements', gu: 'નવીનતમ સમાચાર અને જાહેરાતો' },
  'home.readMore': { en: 'Read More', gu: 'વધુ વાંચો' },
  'home.upcomingEvents': { en: 'Upcoming Events', gu: 'આગામી કાર્યક્રમો' },
  'home.glimpse': { en: 'A Glimpse of Dholasan', gu: 'ધોળાસણની એક ઝલક' },
  'home.viewGallery': { en: 'View Full Gallery', gu: 'સંપૂર્ણ ગેલેરી જુઓ' },
  'about.title': { en: 'About Dholasan Village', gu: 'ધોળાસણ ગામ વિશે' },
  'about.historyTitle': { en: 'Our Heritage & History', gu: 'આપણો ઇતિહાસ અને વારસો' },
  'about.glance': { en: 'Dholasan at a Glance', gu: 'એક નજરમાં ધોળાસણ' },
  'about.landmarks': { en: 'Key Landmarks & Heritage', gu: 'ઐતિહાસિક સ્થળો અને દર્શનીય સ્થાનો' },
  'about.landmarksSubtitle': { en: 'Explore the religious, educational, and natural heritage of Dholasan.', gu: 'ધોળાસણના ધાર્મિક, શૈક્ષણિક અને કુદરતી વારસાના દર્શન કરો.' },
  'about.findUs': { en: 'Find Us Here', gu: 'અમને અહીં શોધો' },
  'about.connectivity': { en: 'Connectivity & Transport', gu: 'વાહનવ્યવહાર અને કનેક્ટિવિટી' },
  'community.title': { en: 'Community Hub & Notices', gu: 'સમુદાય મંચ અને સૂચના પત્રક' },
  'community.subtitle': { en: 'Stay connected with village notices, achievements, governance, and public services.', gu: 'ગામની સૂચનાઓ, સિદ્ધિઓ, શાસન અને જાહેર સેવાઓ સાથે જોડાયેલા રહો.' },
  'community.noticesTab': { en: 'Notice Board', gu: 'સૂચના પત્રક' },
  'community.emergencyTab': { en: 'Emergency Directory', gu: 'ઇમરજન્સી સેવાઓ' },
  'community.governanceTab': { en: 'Panchayat & Public Services', gu: 'ગ્રામ પંચાયત અને સેવાઓ' },
  'community.projectsTab': { en: 'Development Projects', gu: 'ગામ વિકાસ પ્રોજેક્ટ્સ' },
  'community.postNotice': { en: 'Post a Notice / Message', gu: 'સૂચના / સંદેશ મોકલો' },
  'community.filterAll': { en: 'All Notices', gu: 'બધી સૂચનાઓ' },
  'community.filterAnnouncements': { en: 'Announcements 📢', gu: 'જાહેરાતો 📢' },
  'community.filterAchievements': { en: 'Achievements 🏆', gu: 'સિદ્ધિઓ 🏆' },
  'community.filterEmergency': { en: 'Help & Blood 🆘', gu: 'મદદ & રક્તદાન 🆘' },
  'community.filterGeneral': { en: 'General 💬', gu: 'સામાન્ય ચર્ચા 💬' },
  'community.governance': { en: 'Local Governance (Gram Panchayat)', gu: 'સ્થાનિક શાસન (ગ્રામ પંચાયત)' },
  'community.governanceIntro': { en: 'Dholasan is managed by its own Gram Panchayat, responsible for village infrastructure, digital administration, and welfare.', gu: 'ધોળાસણનું સંચાલન ગ્રામ પંચાયત દ્વારા કરવામાં આવે છે, જે ગ્રામીણ વિકાસ, ડિજિટલ સેવાઓ અને સુખાકારી માટે સમર્પિત છે.' },
  'community.currentMembers': { en: 'Current Representatives:', gu: 'વર્તમાન પ્રતિનિધિઓ:' },
  'community.education': { en: 'Education & Schools', gu: 'શિક્ષણ અને શાળાઓ' },
  'community.healthcare': { en: 'Healthcare & Wellness', gu: 'આરોગ્ય અને સુખાકારી' },
  'events.title': { en: 'Celebrations and Events', gu: 'ઉજવણી અને કાર્યક્રમો' },
  'events.upcoming': { en: 'Upcoming Events', gu: 'આગામી કાર્યક્રમો' },
  'events.upcomingEmpty': { en: 'No upcoming events scheduled at the moment.', gu: 'હાલમાં કોઈ આગામી કાર્યક્રમો નિર્ધારિત નથી.' },
  'events.festivals': { en: 'Annual Festivals', gu: 'વાર્ષિક તહેવારો' },
  'events.past': { en: 'Past Events Archive', gu: 'ભૂતકાળના કાર્યક્રમોનો આર્કાઇવ' },
  'events.completed': { en: 'Completed', gu: 'પૂર્ણ થયું' },
  'events.pastEmpty': { en: 'No past events to show.', gu: 'બતાવવા માટે કોઈ ભૂતકાળના કાર્યક્રમો નથી.' },
  'gallery.title': { en: 'A Glimpse of Dholasan', gu: 'ધોળાસણની એક ઝલક' },
  'gallery.intro': { en: 'Explore the beauty of our village, the vibrancy of our culture, and the warmth of our people through these photographs.', gu: 'આ તસવીરો દ્વારા અમારા ગામની સુંદરતા, અમારી સંસ્કૃતિની જીવંતતા અને અમારા લોકોની ઉષ્માનું અન્વેષણ કરો.' },
  'gallery.all': { en: 'All Photos', gu: 'બધા ફોટા' },
  'gallery.shareWhatsapp': { en: 'Share on WhatsApp', gu: 'વોટ્સએપ પર શેર કરો' },
  'businesses.title': { en: 'Local Businesses & Services', gu: 'સ્થાનિક વ્યવસાય અને સેવાઓ' },
  'businesses.intro': { en: 'Supporting our local businesses strengthens our community. Here is a directory of services available in and around Dholasan.', gu: 'આપણા સ્થાનિક વ્યવસાયોને ટેકો આપવાથી આપણો સમુદાય મજબૂત બને છે. અહીં ધોળાસણમાં અને તેની આસપાસ ઉપલબ્ધ સેવાઓની સૂચિ છે.' },
  'businesses.contact': { en: 'Contact:', gu: 'સંપર્ક:' },
  'contact.title': { en: 'Get in Touch', gu: 'સંપર્કમાં રહો' },
  'contact.sendMessage': { en: 'Send us a Message', gu: 'અમને સંદેશ મોકલો' },
  'contact.name': { en: 'Your Name', gu: 'તમારું નામ' },
  'contact.email': { en: 'Email Address', gu: 'ઈમેલ એડ્રેસ' },
  'contact.subject': { en: 'Subject', gu: 'વિષય' },
  'contact.message': { en: 'Message', gu: 'સંદેશ' },
  'contact.submit': { en: 'Send Message', gu: 'સંદેશ મોકલો' },
  'contact.info': { en: 'Contact Information', gu: 'સંપર્ક માહિતી' },
  'contact.addressLabel': { en: 'Address:', gu: 'સરનામું:' },
  'contact.emailLabel': { en: 'Email:', gu: 'ઈમેલ:' },
  'contact.phoneLabel': { en: 'Phone:', gu: 'ફોન:' },
  'contact.thanks': { en: 'Thank you, {name}! Your message has been received. We will get back to you soon.', gu: 'આભાર, {name}! તમારો સંદેશ મળી ગયો છે. અમે ટૂંક સમયમાં તમારો સંપર્ક કરીશું.' },
  'footer.title': { en: 'Dholasan Village', gu: 'ધોળાસણ ગામ' },
  'footer.tagline': { en: 'A vibrant community in the heart of Gujarat.', gu: 'ગુજરાતના હૃદયમાં એક જીવંત સમુદાય.' },
  'footer.quickLinks': { en: 'Quick Links', gu: 'ઝડપી લિંક્સ' },
  'footer.contactUs': { en: 'Contact Us', gu: 'અમારો સંપર્ક કરો' },
  'footer.followUs': { en: 'Follow Us', gu: 'અમને અનુસરો' },
  'footer.copyright': { en: 'Dholasan Community. All Rights Reserved.', gu: 'ધોળાસણ સમુદાય. સર્વાધિકાર સુરક્ષિત.' },
  'footer.admin': { en: 'Admin Panel', gu: 'એડમિન પેનલ' },
  'search.placeholder': { en: 'Search news, events, businesses, notices...', gu: 'સમાચાર, કાર્યક્રમો, વ્યવસાયો, સૂચનાઓ શોધો...' },
  'search.noResults': { en: 'No results found', gu: 'કોઈ પરિણામ મળ્યા નથી' },
};

export const defaultSiteSettings: SiteSettings = {
  siteName: { en: 'Dholasan', gu: 'ધોળાસણ' },
  siteTagline: { en: 'Dholasan Community Website', gu: 'ધોળાસણ સમુદાય વેબસાઇટ' },
  navLinks: [
    { id: 'home', label: { en: 'Home', gu: 'મુખ્ય પૃષ્ઠ' }, path: '/', enabled: true },
    { id: 'about', label: { en: 'About', gu: 'વિશે' }, path: '/about', enabled: true },
    { id: 'community', label: { en: 'Community', gu: 'સમુદાય' }, path: '/community', enabled: true },
    { id: 'events', label: { en: 'Events', gu: 'કાર્યક્રમો' }, path: '/events', enabled: true },
    { id: 'gallery', label: { en: 'Gallery', gu: 'ગેલેરી' }, path: '/gallery', enabled: true },
    { id: 'businesses', label: { en: 'Businesses', gu: 'વ્યવસાયો' }, path: '/businesses', enabled: true },
    { id: 'contact', label: { en: 'Contact', gu: 'સંપર્ક' }, path: '/contact', enabled: true },
  ],
  heroTitle: { en: 'Welcome to Dholasan', gu: 'ધોળાસણ માં આપનું સ્વાગત છે' },
  heroSubtitle: { en: 'A vibrant, forward-looking village in Mahesana, Gujarat.', gu: 'મહેસાણા, ગુજરાતનું એક જીવંત અને પ્રગતિશીલ ગામ.' },
  heroImageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&auto=format&fit=crop&q=80',
  contactEmail: 'contact@dholasan.com',
  contactPhone: '+91 98250 12345',
  contactAddress: 'Gram Panchayat Bhavan, Dholasan Village, Mahesana - 382732, Gujarat',
  socialFacebook: 'https://facebook.com',
  socialInstagram: 'https://instagram.com',
  socialYoutube: 'https://youtube.com',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14638.65171790409!2d72.44199992928096!3d23.472714588526526!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395c45d153282b0f%3A0x1d374f638510a79!2sDholasan%2C%20Gujarat%20382732!5e0!3m2!1sen!2sin!4v1689254311029!5m2!1sen!2sin',
  galleryCategories: [
    { id: 'Festivals', label: { en: 'Festivals', gu: 'તહેવારો' } },
    { id: 'Daily Life', label: { en: 'Daily Life', gu: 'દૈનિક જીવન' } },
    { id: 'Scenery', label: { en: 'Scenery & Nature', gu: 'કુદરતી દ્રશ્યો' } },
  ],
  aboutHistory: {
    en: 'The story of Dholasan is rich and deep, dating back several generations in the Mahesana district of Gujarat. Known for its industrious farming families, strong community bonds, and cultural pride, Dholasan has nurtured doctors, engineers, educators, and leaders serving both locally and abroad across the globe.',
    gu: 'ધોળાસણનો ઇતિહાસ ગૌરવશાળી અને સમૃદ્ધ છે. મહેસાણા જિલ્લામાં આવેલું આ ગામ તેની મહેનતુ ખેતી, સામાજિક એકતા અને સંસ્કારો માટે જાણીતું છે. ધોળાસણે દેશ-વિદેશમાં સેવા આપતા અસંખ્ય તબીબો, ઇજનેરો, શિક્ષકો અને ઉદ્યોગસાહસિકોનું ઘડતર કર્યું છે.',
  },
  aboutKeyFacts: [
    { label: { en: 'District & State', gu: 'જિલ્લો અને રાજ્ય' }, value: { en: 'Mahesana, Gujarat, India', gu: 'મહેસાણા, ગુજરાત, ભારત' } },
    { label: { en: 'Approx. Population', gu: 'અંદાજિત વસ્તી' }, value: { en: '~4,850+', gu: '~૪,૮૫૦+' } },
    { label: { en: 'Literacy Rate', gu: 'સાક્ષરતા દર' }, value: { en: '82%+', gu: '૮૨%+' } },
    { label: { en: 'Pincode', gu: 'પિનકોડ' }, value: { en: '382732', gu: '૩૮૨૭૩૨' } },
    { label: { en: 'Gram Panchayat', gu: 'ગ્રામ પંચાયત' }, value: { en: 'Active e-Panchayat', gu: 'ડિજિટલ ઈ-પંચાયત' } },
    { label: { en: 'Primary Occupation', gu: 'મુખ્ય વ્યવસાય' }, value: { en: 'Agriculture & Dairy', gu: 'ખેતી અને પશુપાલન / ડેરી' } },
    { label: { en: 'Nearest City', gu: 'નજીકનું શહેર' }, value: { en: 'Kadi (12 km) & Mahesana (25 km)', gu: 'કડી (૧૨ કિમી) & મહેસાણા (૨૫ કિમી)' } },
  ],
  aboutConnectivity: {
    en: 'Dholasan enjoys asphalt road connectivity linked to state highways. Regular Gujarat ST buses and shared transit connect the village to Kadi, Kalol, Ahmedabad, and Mahesana. Nearest railway hubs include Ambliyasan and Mahesana Junction.',
    gu: 'ધોળાસણ પાકા ડામર રોડથી સ્ટેટ હાઇવે સાથે જોડાયેલું છે. કડી, કલોલ, અમદાવાદ અને મહેસાણા માટે નિયમિત એસ.ટી. બસ અને ખાનગી વાહન વ્યવહાર ઉપલબ્ધ છે. નજીકના રેલ્વે સ્ટેશન આંબલિયાસણ અને મહેસાણા જંક્શન છે.',
  },
  communityGovernance: [
    { role: { en: 'Sarpanch', gu: 'સરપંચ' }, name: 'Ramesh Patel' },
    { role: { en: 'Up-Sarpanch', gu: 'ઉપ-સરપંચ' }, name: 'Maheshbhai Desai' },
    { role: { en: 'Talati-cum-Mantri', gu: 'તલાટી-કમ-મંત્રી' }, name: 'Pankajbhai Prajapati' },
  ],
  communityEducation: {
    en: 'Dholasan Primary and High School provides modern foundational education equipped with smart boards, computer labs, and midday meal facilities. Nearby colleges in Kadi and Mahesana offer higher degree programs.',
    gu: 'ધોળાસણ પ્રાથમિક અને હાઇસ્કૂલ સ્માર્ટ બોર્ડ, કમ્પ્યુટર લેબ અને રમતગમતના સાધનોથી સજ્જ છે. ઉચ્ચ અભ્યાસ માટે કડી અને મહેસાણાની અગ્રણી કોલેજો નજીકમાં આવેલી છે.',
  },
  communityHealthcare: {
    en: 'Primary Health Centre (PHC) in Dholasan offers free daily outpatient consultation, maternal care, and immunization. Specialized multispecialty hospitals in Kadi and Mahesana are accessible in 20-30 minutes.',
    gu: 'ધોળાસણ પ્રાથમિક આરોગ્ય કેન્દ્ર (PHC) દૈનિક નિઃશુલ્ક તપાસ, રસીકરણ અને પ્રાથમિક સારવાર પૂરી પાડે છે. વધુ સારવાર માટે કડી અને મહેસાણાની મલ્ટીસ્પેશ્યાલિટી હોસ્પિટલો ૨૦ મિનિટના અંતરે છે.',
  },
  festivals: [
    { id: 1, name: { en: 'Navratri Mahotsav', gu: 'નવરાત્રી મહોત્સવ' }, description: { en: 'Nine nights of divine devotion, Garba, and folk music bringing families together.', gu: 'ગરબા, દાંડિયા રાસ અને ભક્તિભાવથી ભરપૂર નવ દિવસીય ભવ્ય મહોત્સવ.' }, imageUrl: 'https://images.unsplash.com/photo-1599827556779-d5c21b3fa1e4?w=800&auto=format&fit=crop&q=80' },
    { id: 2, name: { en: 'Diwali & Sneh Milan', gu: 'દિવાળી અને સ્નેહ મિલન' }, description: { en: 'Illumination of every home with earthen lamps, sweets, and community blessings.', gu: 'દીપ પ્રાગટ્ય, રંગોળી, મીઠાઈઓ અને નૂતન વર્ષાભિનંદન સ્નેહ મિલન.' }, imageUrl: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=800&auto=format&fit=crop&q=80' },
    { id: 3, name: { en: 'Uttarayan & Kite Flying', gu: 'ઉત્તરાયણ પતંગોત્સવ' }, description: { en: 'Vibrant skies full of colorful kites, sweet Undhiyu, and Chikki celebrations.', gu: 'આકાશમાં રંગબેરંગી પતંગો, ઊંધિયું અને જલેબીની મિજબાની સાથે ઉત્સાહભરી ઉજવણી.' }, imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80' },
  ],
  liveEvent: {
    isLive: false,
    name: { en: '', gu: '' },
    url: '',
    platform: 'YouTube',
    thumbnailUrl: '',
  },
  labels: defaultLabels,
  footerTagline: { en: 'A vibrant community in the heart of Gujarat.', gu: 'ગુજરાતના હૃદયમાં એક જીવંત સમુદાય.' },
  footerCopyright: { en: 'Dholasan Community. All Rights Reserved.', gu: 'ધોળાસણ સમુદાય. સર્વાધિકાર સુરક્ષિત.' },
  themeColors: { primary: '#F97316', secondary: '#1E3A8A' },
};

function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
  }
  return defaultValue;
}

function setToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

// --- Cloud Firestore Write Helpers ---
export type SyncStatus = 'ok' | 'error' | 'offline';

let onSyncStatusChange: ((status: SyncStatus) => void) | null = null;
let lastSyncError: string | null = null;

export function setSyncStatusListener(fn: ((status: SyncStatus) => void) | null): void {
  onSyncStatusChange = fn;
}

export function getLastSyncError(): string | null {
  return lastSyncError;
}

function reportSync(status: SyncStatus): void {
  if (status === 'ok') lastSyncError = null;
  if (onSyncStatusChange) {
    onSyncStatusChange(status);
  }
}

export function describeFirestoreError(err: unknown): string {
  if (!err) return 'Unknown error';
  const e = err as any;
  const code: string | undefined = e?.code;
  const msg: string | undefined = e?.message;
  if (!code) return msg || 'Unknown error';
  switch (code) {
    case 'permission-denied':
      return 'Firestore write rejected (permission-denied). Check rules in Firebase console.';
    case 'unauthenticated':
      return 'Please sign in to update content.';
    case 'not-found':
      return 'Firestore database or document not found.';
    default:
      return `${code}${msg ? `: ${msg}` : ''}`;
  }
}

async function pushToCloud(docName: string, data: any): Promise<boolean> {
  try {
    await setDoc(doc(db, 'content', docName), { data, updatedAt: Date.now() });
    reportSync('ok');
    if (
      (['news', 'events', 'gallery', 'businesses', 'notices', 'emergency', 'landmarks', 'projects', 'siteSettings'] as string[]).includes(
        docName
      )
    ) {
      createBackup(docName, data);
    }
    return true;
  } catch (err) {
    console.error(`Firestore sync FAILED for ${docName}:`, err);
    lastSyncError = describeFirestoreError(err);
    reportSync('error');
    return false;
  }
}

// --- News ---
export function getNewsArticles(): NewsArticle[] {
  return getFromStorage(STORAGE_KEYS.NEWS, defaultNews);
}
export async function setNewsArticles(articles: NewsArticle[]): Promise<boolean> {
  setToStorage(STORAGE_KEYS.NEWS, articles);
  return pushToCloud('news', articles);
}

// --- Events ---
export function getEvents(): Event[] {
  return getFromStorage(STORAGE_KEYS.EVENTS, defaultEvents);
}
export async function setEvents(ev: Event[]): Promise<boolean> {
  setToStorage(STORAGE_KEYS.EVENTS, ev);
  return pushToCloud('events', ev);
}

// --- Gallery ---
export function getGalleryImages(): GalleryImage[] {
  return getFromStorage(STORAGE_KEYS.GALLERY, defaultGallery);
}
export async function setGalleryImages(images: GalleryImage[]): Promise<boolean> {
  setToStorage(STORAGE_KEYS.GALLERY, images);
  return pushToCloud('gallery', images);
}

// --- Businesses ---
export function getBusinesses(): Business[] {
  return getFromStorage(STORAGE_KEYS.BUSINESSES, defaultBusinesses);
}
export async function setBusinesses(biz: Business[]): Promise<boolean> {
  setToStorage(STORAGE_KEYS.BUSINESSES, biz);
  return pushToCloud('businesses', biz);
}

// --- Community Notices ---
export function getCommunityNotices(): CommunityNotice[] {
  return getFromStorage(STORAGE_KEYS.NOTICES, defaultNotices);
}
export async function setCommunityNotices(notices: CommunityNotice[]): Promise<boolean> {
  setToStorage(STORAGE_KEYS.NOTICES, notices);
  return pushToCloud('notices', notices);
}
export async function addCommunityNotice(
  notice: Omit<CommunityNotice, 'id' | 'likes' | 'createdAt'>
): Promise<CommunityNotice> {
  const full: CommunityNotice = {
    ...notice,
    id: 'n-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    likes: 0,
    createdAt: Date.now(),
  };
  const list = [full, ...getCommunityNotices()];
  await setCommunityNotices(list);
  return full;
}
export async function likeCommunityNotice(id: string): Promise<number> {
  const list = getCommunityNotices();
  let count = 0;
  const updated = list.map((n) => {
    if (n.id === id) {
      count = (n.likes || 0) + 1;
      return { ...n, likes: count };
    }
    return n;
  });
  await setCommunityNotices(updated);
  return count;
}
export async function deleteCommunityNotice(id: string): Promise<boolean> {
  const list = getCommunityNotices().filter((n) => n.id !== id);
  return setCommunityNotices(list);
}

// --- Emergency Contacts ---
export function getEmergencyContacts(): EmergencyContact[] {
  return getFromStorage(STORAGE_KEYS.EMERGENCY, defaultEmergencies);
}
export async function setEmergencyContacts(contacts: EmergencyContact[]): Promise<boolean> {
  setToStorage(STORAGE_KEYS.EMERGENCY, contacts);
  return pushToCloud('emergency', contacts);
}

// --- Village Landmarks ---
export function getVillageLandmarks(): VillageLandmark[] {
  return getFromStorage(STORAGE_KEYS.LANDMARKS, defaultLandmarks);
}
export async function setVillageLandmarks(landmarks: VillageLandmark[]): Promise<boolean> {
  setToStorage(STORAGE_KEYS.LANDMARKS, landmarks);
  return pushToCloud('landmarks', landmarks);
}

// --- Development Projects ---
export function getDevelopmentProjects(): DevelopmentProject[] {
  return getFromStorage(STORAGE_KEYS.PROJECTS, defaultProjects);
}
export async function setDevelopmentProjects(projects: DevelopmentProject[]): Promise<boolean> {
  setToStorage(STORAGE_KEYS.PROJECTS, projects);
  return pushToCloud('projects', projects);
}

// --- Site Settings ---
export function getSiteSettings(): SiteSettings {
  const stored = getFromStorage<Partial<SiteSettings>>(STORAGE_KEYS.SITE_SETTINGS, {});
  return mergeSettings(defaultSiteSettings, stored);
}

function normalizeHex(input: string | undefined, fallback: string): string {
  if (!input) return fallback;
  let hex = input.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(hex)) hex = hex.split('').map((c) => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return fallback;
  return '#' + hex.toUpperCase();
}

function mergeSettings(defaults: SiteSettings, stored: Partial<SiteSettings>): SiteSettings {
  return {
    ...defaults,
    ...stored,
    labels: { ...defaultLabels, ...(stored.labels || {}) },
    navLinks: Array.isArray(stored.navLinks) ? stored.navLinks : defaults.navLinks,
    galleryCategories: Array.isArray(stored.galleryCategories)
      ? stored.galleryCategories
      : defaults.galleryCategories,
    themeColors: {
      primary: normalizeHex(stored.themeColors?.primary, defaults.themeColors.primary),
      secondary: normalizeHex(stored.themeColors?.secondary, defaults.themeColors.secondary),
    },
  };
}
export async function setSiteSettings(settings: SiteSettings): Promise<boolean> {
  setToStorage(STORAGE_KEYS.SITE_SETTINGS, settings);
  return pushToCloud('siteSettings', settings);
}

// --- Activity Log ---
export function getAdminActivity(): AdminActivity[] {
  return getFromStorage(STORAGE_KEYS.ADMIN_ACTIVITY, []);
}
export async function addAdminActivity(action: string, section: string, detail: string): Promise<boolean> {
  const activities = getAdminActivity();
  activities.unshift({
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    action,
    section,
    timestamp: Date.now(),
    detail,
  });
  const trimmed = activities.slice(0, 50);
  setToStorage(STORAGE_KEYS.ADMIN_ACTIVITY, trimmed);
  return pushToCloud('activity', trimmed);
}

// --- Contact Messages ---
export function getContactMessages(): ContactMessage[] {
  return getFromStorage(STORAGE_KEYS.MESSAGES, []);
}

export async function addContactMessage(msg: { name: string; email: string; subject: string; message: string }): Promise<boolean> {
  const full: ContactMessage = {
    ...msg,
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    read: false,
    createdAt: Date.now(),
  };
  setToStorage(STORAGE_KEYS.MESSAGES, [full, ...getContactMessages()]);
  try {
    await setDoc(doc(db, 'contactMessages', full.id), full);
    reportSync('ok');
    return true;
  } catch (err) {
    console.warn('Contact message sync failed (kept locally):', err);
    return false;
  }
}

export async function updateContactMessage(updated: ContactMessage): Promise<boolean> {
  const list = getContactMessages().map((m) => (m.id === updated.id ? updated : m));
  setToStorage(STORAGE_KEYS.MESSAGES, list);
  try {
    await setDoc(doc(db, 'contactMessages', updated.id), updated);
    return true;
  } catch (err) {
    console.warn('Message update sync failed:', err);
    return false;
  }
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  setToStorage(STORAGE_KEYS.MESSAGES, getContactMessages().filter((m) => m.id !== id));
  try {
    await deleteDoc(doc(db, 'contactMessages', id));
    return true;
  } catch (err) {
    console.warn('Message delete sync failed:', err);
    return false;
  }
}

export async function setupMessagesListener(onMessages: (data: ContactMessage[]) => void): Promise<(() => void) | null> {
  try {
    return onSnapshot(
      collection(db, 'contactMessages'),
      (snapshot) => {
        const list = snapshot.docs
          .map((d) => d.data() as ContactMessage)
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setToStorage(STORAGE_KEYS.MESSAGES, list);
        onMessages(list);
      },
      (err) => {
        console.warn('Messages listener error (offline?):', err);
      }
    );
  } catch (e) {
    console.warn('Failed to listen to messages:', e);
    return null;
  }
}

// --- Backups ---
const MAX_BACKUPS = 15;
let backupQueue: Promise<void> = Promise.resolve();

export function getBackups(): BackupSnapshot[] {
  return getFromStorage(STORAGE_KEYS.BACKUPS, []);
}

async function createBackup(docName: string, data: any): Promise<void> {
  backupQueue = backupQueue.then(async () => {
    try {
      const current = getBackups();
      const snapshot: BackupSnapshot = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        timestamp: Date.now(),
        label: `${docName} · ${new Date().toLocaleString()}`,
        data: {
          news: docName === 'news' ? data : getNewsArticles(),
          events: docName === 'events' ? data : getEvents(),
          gallery: docName === 'gallery' ? data : getGalleryImages(),
          businesses: docName === 'businesses' ? data : getBusinesses(),
          notices: docName === 'notices' ? data : getCommunityNotices(),
          emergencyContacts: docName === 'emergency' ? data : getEmergencyContacts(),
          landmarks: docName === 'landmarks' ? data : getVillageLandmarks(),
          developmentProjects: docName === 'projects' ? data : getDevelopmentProjects(),
          siteSettings: docName === 'siteSettings' ? data : getSiteSettings(),
        },
      };
      current.unshift(snapshot);
      setToStorage(STORAGE_KEYS.BACKUPS, current.slice(0, MAX_BACKUPS));
      await setDoc(doc(db, 'content', 'backups'), {
        data: current.slice(0, MAX_BACKUPS),
        updatedAt: Date.now(),
      }).catch(() => {});
    } catch (e) {
      console.warn('Backup creation failed:', e);
    }
  });
  await backupQueue;
}

export function restoreBackup(id: string): boolean {
  const backup = getBackups().find((b) => b.id === id);
  if (!backup) return false;
  if (backup.data.news) setNewsArticles(backup.data.news);
  if (backup.data.events) setEvents(backup.data.events);
  if (backup.data.gallery) setGalleryImages(backup.data.gallery);
  if (backup.data.businesses) setBusinesses(backup.data.businesses);
  if (backup.data.notices) setCommunityNotices(backup.data.notices);
  if (backup.data.emergencyContacts) setEmergencyContacts(backup.data.emergencyContacts);
  if (backup.data.landmarks) setVillageLandmarks(backup.data.landmarks);
  if (backup.data.developmentProjects) setDevelopmentProjects(backup.data.developmentProjects);
  if (backup.data.siteSettings) setSiteSettings(backup.data.siteSettings);
  return true;
}

// --- Page Layouts (Modular Block Builder) ---
export function getPageLayouts(): PageLayoutMap {
  const stored = getFromStorage<PageLayoutMap | null>(STORAGE_KEYS.PAGE_LAYOUTS, null);
  if (!stored) return defaultPageLayouts;
  // Merge missing pages from defaultPageLayouts
  return {
    ...defaultPageLayouts,
    ...stored,
  };
}

export async function setPageLayouts(layouts: PageLayoutMap): Promise<boolean> {
  setToStorage(STORAGE_KEYS.PAGE_LAYOUTS, layouts);
  return pushToCloud('pageLayouts', layouts);
}

export function getPageBlocks(pageId: string): PageBlockConfig[] {
  const layouts = getPageLayouts();
  return layouts[pageId] || defaultPageLayouts[pageId] || [];
}

export async function savePageBlocks(pageId: string, blocks: PageBlockConfig[]): Promise<boolean> {
  const layouts = getPageLayouts();
  layouts[pageId] = blocks;
  return setPageLayouts(layouts);
}

export async function resetPageLayout(pageId: string): Promise<PageBlockConfig[]> {
  const defaultBlocks = defaultPageLayouts[pageId] || [];
  await savePageBlocks(pageId, defaultBlocks);
  return defaultBlocks;
}

export function clearBackups(): void {
  localStorage.removeItem(STORAGE_KEYS.BACKUPS);
  setDoc(doc(db, 'content', 'backups'), { data: [], updatedAt: Date.now() }).catch(() => {});
}

// --- Reset ---
export function resetAllData(): void {
  const contentKeys = [
    STORAGE_KEYS.NEWS,
    STORAGE_KEYS.EVENTS,
    STORAGE_KEYS.GALLERY,
    STORAGE_KEYS.BUSINESSES,
    STORAGE_KEYS.NOTICES,
    STORAGE_KEYS.EMERGENCY,
    STORAGE_KEYS.LANDMARKS,
    STORAGE_KEYS.PROJECTS,
    STORAGE_KEYS.SITE_SETTINGS,
    STORAGE_KEYS.ADMIN_ACTIVITY,
    STORAGE_KEYS.PAGE_LAYOUTS,
  ];
  contentKeys.forEach((key) => localStorage.removeItem(key));
  pushToCloud('news', defaultNews);
  pushToCloud('events', defaultEvents);
  pushToCloud('gallery', defaultGallery);
  pushToCloud('businesses', defaultBusinesses);
  pushToCloud('notices', defaultNotices);
  pushToCloud('emergency', defaultEmergencies);
  pushToCloud('landmarks', defaultLandmarks);
  pushToCloud('projects', defaultProjects);
  pushToCloud('siteSettings', defaultSiteSettings);
  pushToCloud('pageLayouts', defaultPageLayouts);
}

// --- Export / Import ---
export function exportAllData(): string {
  return JSON.stringify(
    {
      news: getNewsArticles(),
      events: getEvents(),
      gallery: getGalleryImages(),
      businesses: getBusinesses(),
      notices: getCommunityNotices(),
      emergencyContacts: getEmergencyContacts(),
      landmarks: getVillageLandmarks(),
      developmentProjects: getDevelopmentProjects(),
      siteSettings: getSiteSettings(),
      pageLayouts: getPageLayouts(),
      activity: getAdminActivity(),
      messages: getContactMessages(),
      backups: getBackups(),
    },
    null,
    2
  );
}

export function importAllData(jsonString: string): void {
  const data = JSON.parse(jsonString);
  if (data.news) setNewsArticles(data.news);
  if (data.events) setEvents(data.events);
  if (data.gallery) setGalleryImages(data.gallery);
  if (data.businesses) setBusinesses(data.businesses);
  if (data.notices) setCommunityNotices(data.notices);
  if (data.emergencyContacts) setEmergencyContacts(data.emergencyContacts);
  if (data.landmarks) setVillageLandmarks(data.landmarks);
  if (data.developmentProjects) setDevelopmentProjects(data.developmentProjects);
  if (data.siteSettings) setSiteSettings(data.siteSettings);
  if (data.pageLayouts) setPageLayouts(data.pageLayouts);
  if (data.activity) {
    setToStorage(STORAGE_KEYS.ADMIN_ACTIVITY, data.activity);
    pushToCloud('activity', data.activity);
  }
  if (data.messages) {
    const msgs: ContactMessage[] = data.messages;
    setToStorage(STORAGE_KEYS.MESSAGES, msgs);
    msgs.forEach((m) => {
      if (m.id) setDoc(doc(db, 'contactMessages', m.id), m).catch(() => {});
    });
  }
  if (data.backups) {
    setToStorage(STORAGE_KEYS.BACKUPS, data.backups);
    pushToCloud('backups', data.backups);
  }
}

// --- Firestore Realtime Listener Setup ---
export function setupFirestoreListeners(callbacks: {
  onNews: (data: NewsArticle[]) => void;
  onEvents: (data: Event[]) => void;
  onGallery: (data: GalleryImage[]) => void;
  onBusinesses: (data: Business[]) => void;
  onNotices?: (data: CommunityNotice[]) => void;
  onEmergency?: (data: EmergencyContact[]) => void;
  onLandmarks?: (data: VillageLandmark[]) => void;
  onProjects?: (data: DevelopmentProject[]) => void;
  onSettings: (data: SiteSettings) => void;
  onPageLayouts?: (data: PageLayoutMap) => void;
  onActivity: (data: AdminActivity[]) => void;
  onMessages?: (data: ContactMessage[]) => void;
  onBackups?: (data: BackupSnapshot[]) => void;
}) {
  const unsubs: (() => void)[] = [];

  const docs = [
    { name: 'news', cb: (d: any) => { setToStorage(STORAGE_KEYS.NEWS, d); callbacks.onNews(d); } },
    { name: 'events', cb: (d: any) => { setToStorage(STORAGE_KEYS.EVENTS, d); callbacks.onEvents(d); } },
    { name: 'gallery', cb: (d: any) => { setToStorage(STORAGE_KEYS.GALLERY, d); callbacks.onGallery(d); } },
    { name: 'businesses', cb: (d: any) => { setToStorage(STORAGE_KEYS.BUSINESSES, d); callbacks.onBusinesses(d); } },
    ...(callbacks.onNotices ? [{ name: 'notices', cb: (d: any) => { setToStorage(STORAGE_KEYS.NOTICES, d); callbacks.onNotices!(d); } }] : []),
    ...(callbacks.onEmergency ? [{ name: 'emergency', cb: (d: any) => { setToStorage(STORAGE_KEYS.EMERGENCY, d); callbacks.onEmergency!(d); } }] : []),
    ...(callbacks.onLandmarks ? [{ name: 'landmarks', cb: (d: any) => { setToStorage(STORAGE_KEYS.LANDMARKS, d); callbacks.onLandmarks!(d); } }] : []),
    ...(callbacks.onProjects ? [{ name: 'projects', cb: (d: any) => { setToStorage(STORAGE_KEYS.PROJECTS, d); callbacks.onProjects!(d); } }] : []),
    { name: 'siteSettings', cb: (d: any) => { setToStorage(STORAGE_KEYS.SITE_SETTINGS, d); callbacks.onSettings(d); } },
    ...(callbacks.onPageLayouts ? [{ name: 'pageLayouts', cb: (d: any) => { setToStorage(STORAGE_KEYS.PAGE_LAYOUTS, d); callbacks.onPageLayouts!(d); } }] : []),
    { name: 'activity', cb: (d: any) => { setToStorage(STORAGE_KEYS.ADMIN_ACTIVITY, d); callbacks.onActivity(d); } },
    ...(callbacks.onBackups ? [{ name: 'backups', cb: (d: any) => { setToStorage(STORAGE_KEYS.BACKUPS, d); callbacks.onBackups!(d); } }] : []),
  ];

  docs.forEach(({ name, cb }) => {
    try {
      const unsub = onSnapshot(
        doc(db, 'content', name),
        (snapshot) => {
          if (snapshot.exists()) {
            const val = snapshot.data();
            if (val && val.data) {
              cb(val.data);
            }
          }
        },
        (err) => {
          console.error(`Firestore listener error for ${name}:`, err);
          lastSyncError = describeFirestoreError(err);
          reportSync('error');
        }
      );
      unsubs.push(unsub);
    } catch (e) {
      console.error(`Failed to listen to ${name}:`, e);
      lastSyncError = describeFirestoreError(e);
      reportSync('error');
    }
  });

  let messagesUnsub: (() => void) | null = null;
  if (callbacks.onMessages) {
    const promise = setupMessagesListener(callbacks.onMessages);
    promise.then((unsub) => {
      if (unsub) messagesUnsub = unsub;
    });
  }

  return () => {
    unsubs.forEach((unsub) => unsub());
    if (messagesUnsub) messagesUnsub();
  };
}