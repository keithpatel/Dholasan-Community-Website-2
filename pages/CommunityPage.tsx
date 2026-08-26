import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import { NoticeCategory, EmergencyCategory } from '../types';
import PageHeader from '../components/PageHeader';

const CommunityPage: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    siteSettings,
    communityNotices,
    postNotice,
    likeNotice,
    emergencyContacts,
    getLabel,
  } = useContent();

  const [activeTab, setActiveTab] = useState<'notices' | 'emergency' | 'governance'>('notices');
  const [selectedNoticeCategory, setSelectedNoticeCategory] = useState<NoticeCategory | 'all'>('all');
  const [noticeSearch, setNoticeSearch] = useState('');
  const [selectedEmergencyCategory, setSelectedEmergencyCategory] = useState<EmergencyCategory | 'all'>('all');

  // Modal State for Posting Notice
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [postTitleEn, setPostTitleEn] = useState('');
  const [postTitleGu, setPostTitleGu] = useState('');
  const [postContentEn, setPostContentEn] = useState('');
  const [postContentGu, setPostContentGu] = useState('');
  const [postCategory, setPostCategory] = useState<NoticeCategory>('general');
  const [postAuthor, setPostAuthor] = useState('');
  const [postContact, setPostContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Filtered Notices
  const filteredNotices = useMemo(() => {
    return communityNotices
      .filter((n) => {
        if (selectedNoticeCategory !== 'all' && n.category !== selectedNoticeCategory) return false;
        if (!noticeSearch.trim()) return true;
        const q = noticeSearch.toLowerCase();
        const enTitle = n.title.en.toLowerCase();
        const guTitle = n.title.gu.toLowerCase();
        const enCont = n.content.en.toLowerCase();
        const guCont = n.content.gu.toLowerCase();
        const auth = n.author.toLowerCase();
        return enTitle.includes(q) || guTitle.includes(q) || enCont.includes(q) || guCont.includes(q) || auth.includes(q);
      })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
  }, [communityNotices, selectedNoticeCategory, noticeSearch]);

  // Filtered Emergency Contacts
  const filteredEmergency = useMemo(() => {
    if (selectedEmergencyCategory === 'all') return emergencyContacts;
    return emergencyContacts.filter((c) => c.category === selectedEmergencyCategory);
  }, [emergencyContacts, selectedEmergencyCategory]);

  const handleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await likeNotice(id);
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postAuthor.trim() || (!postTitleEn.trim() && !postTitleGu.trim())) return;

    setIsSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await postNotice({
        title: {
          en: postTitleEn.trim() || postTitleGu.trim(),
          gu: postTitleGu.trim() || postTitleEn.trim(),
        },
        content: {
          en: postContentEn.trim() || postContentGu.trim(),
          gu: postContentGu.trim() || postContentEn.trim(),
        },
        category: postCategory,
        author: postAuthor.trim(),
        contact: postContact.trim(),
        date: today,
        pinned: false,
        approved: true,
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setIsPostModalOpen(false);
        setSubmitSuccess(false);
        setPostTitleEn('');
        setPostTitleGu('');
        setPostContentEn('');
        setPostContentGu('');
        setPostAuthor('');
        setPostContact('');
      }, 1200);
    } catch (err) {
      console.error('Failed to post notice', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNoticeBadge = (cat: NoticeCategory) => {
    switch (cat) {
      case 'emergency':
        return {
          bg: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30',
          label: language === 'gu' ? 'મદદ / રક્તદાન 🆘' : 'Help & Emergency 🆘',
        };
      case 'achievement':
        return {
          bg: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
          label: language === 'gu' ? 'સિદ્ધિ & ગૌરવ 🏆' : 'Achievement 🏆',
        };
      case 'announcement':
        return {
          bg: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30',
          label: language === 'gu' ? 'ગ્રામ જાહેરાત 📢' : 'Announcement 📢',
        };
      default:
        return {
          bg: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
          label: language === 'gu' ? 'સામાન્ય 💬' : 'General 💬',
        };
    }
  };

  const getEmergencyIcon = (cat: EmergencyCategory) => {
    switch (cat) {
      case 'medical':
        return '🏥';
      case 'police':
        return '👮';
      case 'civic':
        return '🏛️';
      case 'utility':
        return '⚡';
      case 'veterinary':
        return '🐄';
      default:
        return '📞';
    }
  };

  const getTabLabel = (key: string, fallbackEn: string, fallbackGu: string) => {
    const res = getLabel(key);
    if (!res || res === key || res.includes('.')) {
      return language === 'gu' ? fallbackGu : fallbackEn;
    }
    return res;
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Consistent Page Header */}
      <PageHeader
        badge={language === 'gu' ? 'ગામ સહયોગ અને સેવા મંચ' : 'Village Community Portal'}
        title={getTabLabel('community.title', 'Our Vibrant Community', 'આપણો જીવંત સમુદાય')}
        subtitle={getTabLabel(
          'community.subtitle',
          'Stay connected with village notices, achievements, governance, and public services.',
          'ગામની સૂચનાઓ, સિદ્ધિઓ, શાસન અને જાહેર સેવાઓ સાથે જોડાયેલા રહો.'
        )}
      />

      {/* Main Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Tabs */}
        <div className="flex justify-center border-b border-slate-200 dark:border-slate-800 mb-12 overflow-x-auto pb-1">
          <div className="flex space-x-2 sm:space-x-4">
            <button
              onClick={() => setActiveTab('notices')}
              className={`flex items-center gap-2.5 py-3.5 px-6 text-sm md:text-base font-bold rounded-2xl transition-all font-display ${
                activeTab === 'notices'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>📢</span>
              <span>{getTabLabel('community.noticesTab', 'Notice Board', 'સૂચના પત્રક')}</span>
              <span className="ml-1 text-xs bg-white/25 px-2 py-0.5 rounded-full">
                {communityNotices.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('emergency')}
              className={`flex items-center gap-2.5 py-3.5 px-6 text-sm md:text-base font-bold rounded-2xl transition-all font-display ${
                activeTab === 'emergency'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>🚑</span>
              <span>{getTabLabel('community.emergencyTab', 'Emergency Directory', 'ઇમરજન્સી સેવાઓ')}</span>
            </button>

            <button
              onClick={() => setActiveTab('governance')}
              className={`flex items-center gap-2.5 py-3.5 px-6 text-sm md:text-base font-bold rounded-2xl transition-all font-display ${
                activeTab === 'governance'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/25'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>🏛️</span>
              <span>{getTabLabel('community.governanceTab', 'Panchayat & Public Services', 'ગ્રામ પંચાયત અને સેવાઓ')}</span>
            </button>
          </div>
        </div>

        {/* TAB 1: COMMUNITY NOTICE BOARD */}
        {activeTab === 'notices' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Filter & Action Toolbar */}
            <div className="bg-white dark:bg-slate-800/90 p-5 sm:p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80 flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {[
                  { id: 'all', label: getTabLabel('community.filterAll', 'All Notices', 'બધી સૂચનાઓ') },
                  { id: 'announcement', label: getTabLabel('community.filterAnnouncements', 'Announcements 📢', 'જાહેરાતો 📢') },
                  { id: 'achievement', label: getTabLabel('community.filterAchievements', 'Achievements 🏆', 'સિદ્ધિઓ 🏆') },
                  { id: 'emergency', label: getTabLabel('community.filterEmergency', 'Help & Blood 🆘', 'મદદ & રક્તદાન 🆘') },
                  { id: 'general', label: getTabLabel('community.filterGeneral', 'General 💬', 'સામાન્ય ચર્ચા 💬') },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedNoticeCategory(tab.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all font-display ${
                      selectedNoticeCategory === tab.id
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search & Post Button */}
              <div className="flex gap-3 w-full md:w-auto">
                <input
                  type="text"
                  value={noticeSearch}
                  onChange={(e) => setNoticeSearch(e.target.value)}
                  placeholder={language === 'gu' ? 'સૂચનાઓમાં શોધો...' : 'Search notices...'}
                  className="w-full md:w-48 bg-slate-50 dark:bg-slate-700 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-orange"
                />
                <button
                  onClick={() => setIsPostModalOpen(true)}
                  className="flex-shrink-0 flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:scale-105 font-display uppercase tracking-wider"
                >
                  <span>✏️</span>
                  <span>{getTabLabel('community.postNotice', 'Post a Notice', 'સૂચના મોકલો')}</span>
                </button>
              </div>
            </div>

            {/* Notices List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredNotices.length === 0 ? (
                <div className="col-span-full py-20 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800/90 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="font-bold text-lg font-display">
                    {language === 'gu' ? 'કોઈ સૂચનાઓ મળી નથી' : 'No notices found'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {language === 'gu'
                      ? 'પ્રથમ સૂચના અથવા સંદેશ પોસ્ટ કરનાર બનો!'
                      : 'Be the first to post an announcement or update for the village!'}
                  </p>
                </div>
              ) : (
                filteredNotices.map((notice) => {
                  const badge = getNoticeBadge(notice.category);
                  return (
                    <div
                      key={notice.id}
                      className={`bg-white dark:bg-slate-800/90 rounded-3xl p-7 shadow-sm hover:shadow-2xl transition-all duration-300 border flex flex-col justify-between relative group ${
                        notice.pinned
                          ? 'border-brand-orange ring-1 ring-brand-orange/40'
                          : 'border-slate-100 dark:border-slate-700/80'
                      }`}
                    >
                      {notice.pinned && (
                        <div className="absolute -top-3 right-6 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md font-display">
                          📌 {language === 'gu' ? 'પીન કરેલ' : 'Pinned'}
                        </div>
                      )}

                      <div>
                        {/* Meta Top */}
                        <div className="flex items-center justify-between gap-2 mb-3.5">
                          <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${badge.bg} font-display`}>
                            {badge.label}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {notice.date}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug font-display group-hover:text-brand-orange transition-colors">
                          {t(notice.title)}
                        </h3>

                        {/* Content */}
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed whitespace-pre-line">
                          {t(notice.content)}
                        </p>
                      </div>

                      {/* Footer & Interactions */}
                      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800 dark:text-slate-200 font-display">
                            👤 {notice.author}
                          </p>
                          {notice.contact && (
                            <p className="text-slate-500 dark:text-slate-400">
                              📞 {notice.contact}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={(e) => handleLike(notice.id, e)}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500/10 text-brand-orange hover:bg-orange-500/20 transition-colors font-black font-display"
                          title="Appreciate this post"
                        >
                          <span>❤️</span>
                          <span>{notice.likes || 0}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: EMERGENCY DIRECTORY */}
        {activeTab === 'emergency' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {[
                { id: 'all', label: language === 'gu' ? 'તમામ સેવાઓ' : 'All Services' },
                { id: 'civic', label: language === 'gu' ? 'ગ્રામ પંચાયત / વહીવટ' : 'Panchayat & Civic' },
                { id: 'medical', label: language === 'gu' ? 'તબીબી અને ૧૦૮' : 'Medical & 108' },
                { id: 'utility', label: language === 'gu' ? 'વીજળી અને પાણી' : 'Electricity & Water' },
                { id: 'police', label: language === 'gu' ? 'પોલીસ & સુરક્ષા' : 'Police & Security' },
                { id: 'veterinary', label: language === 'gu' ? 'પશુ દવાખાનું / ગૌશાળા' : 'Veterinary' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedEmergencyCategory(tab.id as any)}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all font-display ${
                    selectedEmergencyCategory === tab.id
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                      : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-100 dark:border-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Emergency Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmergency.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-white dark:bg-slate-800/90 rounded-3xl p-7 shadow-sm border border-slate-100 dark:border-slate-700/80 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="text-3xl p-3.5 bg-red-500/10 text-red-600 rounded-2xl">
                        {getEmergencyIcon(contact.category)}
                      </div>
                      <span className="text-[11px] font-bold px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full font-display">
                        {t(contact.availableHours)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4 font-display group-hover:text-red-600 transition-colors">
                      {t(contact.name)}
                    </h3>
                    <p className="text-xs font-semibold text-brand-orange mt-0.5 font-display">
                      {t(contact.role)}
                    </p>
                    {contact.address && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                        📍 {t(contact.address)}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-3">
                    <a
                      href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                      className="flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-3 px-3 rounded-2xl transition-colors shadow-sm font-display uppercase tracking-wider"
                    >
                      <span>📞</span>
                      <span>{language === 'gu' ? 'કૉલ કરો' : 'Call Now'}</span>
                    </a>

                    {contact.whatsapp ? (
                      <a
                        href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-3 rounded-2xl transition-colors shadow-sm font-display uppercase tracking-wider"
                      >
                        <span>💬</span>
                        <span>WhatsApp</span>
                      </a>
                    ) : (
                      <div className="flex items-center justify-center text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-700 py-3 px-3 rounded-2xl font-mono">
                        {contact.phone}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: GOVERNANCE & SERVICES */}
        {activeTab === 'governance' && (
          <div className="space-y-10 animate-in fade-in duration-200">
            {/* Gram Panchayat Section */}
            <div className="bg-white dark:bg-slate-800/90 p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-2xl text-brand-orange">
                  🏛️
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-display">
                    {getLabel('community.governance')}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Gram Panchayat Office · Dholasan
                  </p>
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                {getLabel('community.governanceIntro')}
              </p>

              <h3 className="font-bold text-slate-900 dark:text-slate-100 mt-8 mb-4 text-base font-display">
                {getLabel('community.currentMembers')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {siteSettings.communityGovernance.map((mem, i) => (
                  <div
                    key={i}
                    className="p-5 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-700"
                  >
                    <span className="text-xs font-extrabold text-brand-orange uppercase font-display tracking-wider">
                      {t(mem.role)}
                    </span>
                    <p className="font-bold text-base text-slate-900 dark:text-slate-100 mt-1 font-display">
                      {mem.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Healthcare */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800/90 p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">📚</span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display">
                    {getLabel('community.education')}
                  </h2>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {t(siteSettings.communityEducation)}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800/90 p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/80">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🩺</span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display">
                    {getLabel('community.healthcare')}
                  </h2>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {t(siteSettings.communityHealthcare)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* POST NOTICE MODAL */}
      {isPostModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsPostModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl shadow-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 font-display">
                  {language === 'gu' ? 'નવી સૂચના અથવા સંદેશ પોસ્ટ કરો' : 'Post a Community Notice'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {language === 'gu'
                    ? 'સમગ્ર ગામ પરિવારો સાથે માહિતી શેર કરો'
                    : 'Share announcements, achievements, or emergency requests'}
                </p>
              </div>
              <button
                onClick={() => setIsPostModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                &times;
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-12 text-center space-y-2">
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                  ✓
                </div>
                <p className="font-bold text-slate-900 dark:text-slate-100 text-lg font-display">
                  {language === 'gu' ? 'સૂચના સફળતાપૂર્વક પોસ્ટ થઈ ગઈ!' : 'Notice successfully posted!'}
                </p>
              </div>
            ) : (
              <form onSubmit={handlePostSubmit} className="space-y-4 pt-5 text-xs sm:text-sm">
                {/* Category Picker */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-display">
                    {language === 'gu' ? 'કેટેગરી પસંદ કરો:' : 'Category:'}
                  </label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value as NoticeCategory)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl p-3 text-slate-900 dark:text-slate-100 outline-none font-medium"
                  >
                    <option value="announcement">Announcement 📢 (જાહેરાત)</option>
                    <option value="achievement">Achievement 🏆 (સિદ્ધિ/ગૌરવ)</option>
                    <option value="emergency">Emergency / Blood 🆘 (ઇમરજન્સી/રક્તદાન)</option>
                    <option value="general">General Discussion 💬 (સામાન્ય સંદેશ)</option>
                  </select>
                </div>

                {/* Title Inputs */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-display">
                    {language === 'gu' ? 'શીર્ષક (Title):' : 'Title (English / Gujarati):'}
                  </label>
                  <input
                    type="text"
                    required
                    value={language === 'gu' ? postTitleGu : postTitleEn}
                    onChange={(e) => {
                      if (language === 'gu') {
                        setPostTitleGu(e.target.value);
                        if (!postTitleEn) setPostTitleEn(e.target.value);
                      } else {
                        setPostTitleEn(e.target.value);
                        if (!postTitleGu) setPostTitleGu(e.target.value);
                      }
                    }}
                    placeholder={
                      language === 'gu'
                        ? 'દા.ત. રક્તદાન શિબિર અથવા ક્રિકેટ મેચ'
                        : 'e.g. Blood Donation Camp or Meeting Notice'
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl p-3 text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-display">
                    {language === 'gu' ? 'સંદેશ વિગત (Message Details):' : 'Message Details:'}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={language === 'gu' ? postContentGu : postContentEn}
                    onChange={(e) => {
                      if (language === 'gu') {
                        setPostContentGu(e.target.value);
                        if (!postContentEn) setPostContentEn(e.target.value);
                      } else {
                        setPostContentEn(e.target.value);
                        if (!postContentGu) setPostContentGu(e.target.value);
                      }
                    }}
                    placeholder={
                      language === 'gu'
                        ? 'સંપૂર્ણ વિગત, તારીખ, સમય અને સ્થળ લખો...'
                        : 'Write full details, date, time, and instructions...'
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl p-3 text-slate-900 dark:text-slate-100 outline-none"
                  ></textarea>
                </div>

                {/* Author & Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-display">
                      {language === 'gu' ? 'તમારું નામ / મંડળ:' : 'Your Name / Mandal:'}
                    </label>
                    <input
                      type="text"
                      required
                      value={postAuthor}
                      onChange={(e) => setPostAuthor(e.target.value)}
                      placeholder="e.g. Ramesh Patel / Yuvak Mandal"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl p-3 text-slate-900 dark:text-slate-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5 font-display">
                      {language === 'gu' ? 'સંપર્ક નંબર (Phone):' : 'Contact Phone (Optional):'}
                    </label>
                    <input
                      type="text"
                      value={postContact}
                      onChange={(e) => setPostContact(e.target.value)}
                      placeholder="+91 98XXX XXXXX"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-2xl p-3 text-slate-900 dark:text-slate-100 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPostModalOpen(false)}
                    className="w-1/2 py-3 rounded-2xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold font-display"
                  >
                    {language === 'gu' ? 'રદ કરો' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-1/2 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-extrabold transition-all shadow-md font-display uppercase tracking-wider"
                  >
                    {isSubmitting
                      ? language === 'gu'
                        ? 'મોકલાઈ રહ્યું છે...'
                        : 'Posting...'
                      : language === 'gu'
                      ? 'સૂચના પોસ્ટ કરો'
                      : 'Post Notice'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;