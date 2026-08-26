import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../../context/ContentContext';
import { useLiveEdit } from '../../context/LiveEditContext';
import StatsCard from '../../components/admin/StatsCard';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { setIsLiveEditMode } = useLiveEdit();
  const {
    newsArticles,
    events,
    galleryImages,
    businesses,
    communityNotices,
    emergencyContacts,
    developmentProjects,
    adminActivity,
    contactMessages,
    syncStatus,
    syncError,
    siteSettings,
  } = useContent();

  const totalContentItems =
    newsArticles.length +
    events.length +
    galleryImages.length +
    businesses.length +
    communityNotices.length +
    emergencyContacts.length +
    developmentProjects.length;

  const unreadMessages = contactMessages.filter((m) => !m.read).length;
  const liveActive = !!(siteSettings.liveEvent && siteSettings.liveEvent.isLive);

  const handleOpenLiveEditor = () => {
    setIsLiveEditMode(true);
    navigate('/');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Minimal Clean */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">
            Admin Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
            Manage your village portal, live layout blocks, notice board, and emergency services.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenLiveEditor}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 ring-2 ring-orange-400/40"
          >
            <span>🎨</span>
            <span>Live Visual Editor</span>
          </button>
          <button
            onClick={() => navigate('/admin/builder')}
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>🧱</span>
            <span>Page Builder</span>
          </button>
          <button
            onClick={() => navigate('/admin/notices')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200/60 dark:border-slate-700 transition-colors"
          >
            + Post Notice
          </button>
          <button
            onClick={() => navigate('/admin/settings')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200/60 dark:border-slate-700 transition-colors"
          >
            Site Settings
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<span>📌</span>}
          label="Community Notices"
          value={communityNotices.length}
          onClick={() => navigate('/admin/notices')}
        />

        <StatsCard
          icon={<span>🏗️</span>}
          label="Vikas Projects"
          value={developmentProjects.length}
          onClick={() => navigate('/admin/projects')}
        />

        <StatsCard
          icon={<span>☎️</span>}
          label="Emergency Helplines"
          value={emergencyContacts.length}
          onClick={() => navigate('/admin/emergency')}
        />

        <StatsCard
          icon={<span>🎉</span>}
          label="Events Scheduled"
          value={events.length}
          onClick={() => navigate('/admin/events')}
        />

        <StatsCard
          icon={<span>📰</span>}
          label="News Articles"
          value={newsArticles.length}
          onClick={() => navigate('/admin/news')}
        />

        <StatsCard
          icon={<span>📸</span>}
          label="Gallery Images"
          value={galleryImages.length}
          onClick={() => navigate('/admin/gallery')}
        />

        <StatsCard
          icon={<span>🏢</span>}
          label="Local Businesses"
          value={businesses.length}
          onClick={() => navigate('/admin/businesses')}
        />


        <StatsCard
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.253-.94L3 20l1.1-3.418A7.992 7.992 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          }
          label="Contact Messages"
          value={contactMessages.length}
          color="#f59e0b"
          badge={unreadMessages > 0 ? `${unreadMessages} new` : undefined}
          onClick={() => navigate('/admin/messages')}
        />
      </div>

      {/* Quick Actions and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Quick Portals</h2>
          <div className="space-y-1.5">
            <button
              onClick={() => navigate('/admin/builder')}
              className="w-full text-left px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
            >
              <span>🧱 Open Modular Page Builder</span>
              <span className="text-slate-400">&rarr;</span>
            </button>
            <button
              onClick={() => navigate('/admin/notices')}
              className="w-full text-left px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
            >
              <span>📢 Manage Notice Board</span>
              <span className="text-slate-400">&rarr;</span>
            </button>
            <button
              onClick={() => navigate('/admin/projects')}
              className="w-full text-left px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
            >
              <span>🌱 Development Projects & Donors</span>
              <span className="text-slate-400">&rarr;</span>
            </button>
            <button
              onClick={() => navigate('/admin/emergency')}
              className="w-full text-left px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
            >
              <span>🚑 Emergency Directory</span>
              <span className="text-slate-400">&rarr;</span>
            </button>
            <button
              onClick={() => navigate('/admin/gallery')}
              className="w-full text-left px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
            >
              <span>📷 Photo Gallery Manager</span>
              <span className="text-slate-400">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Recent Activity Log</h2>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto">
              {adminActivity.length === 0 ? (
                <p className="text-slate-400 text-xs py-8 text-center">No recent activity recorded yet.</p>
              ) : (
                adminActivity.slice(0, 8).map((act) => (
                  <div key={act.id} className="py-2.5 flex items-start justify-between gap-4 text-xs">
                    <div className="space-y-0.5">
                      <span className="font-semibold text-slate-900 dark:text-white">{act.action}</span>
                      <span className="text-slate-400 mx-1.5">·</span>
                      <span className="text-slate-500 font-medium">{act.section}</span>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">{act.detail}</p>
                    </div>
                    <span className="text-slate-400 text-[10px] font-mono flex-shrink-0">
                      {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>{totalContentItems} content items tracked</span>
            <span>Cloud sync: {syncStatus === 'ok' ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

