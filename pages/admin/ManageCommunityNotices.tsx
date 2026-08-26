import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { CommunityNotice, NoticeCategory } from '../../types';
import BilingualInput from '../../components/admin/BilingualInput';
import AdminModal from '../../components/admin/AdminModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const ManageCommunityNotices: React.FC = () => {
  const { communityNotices, updateNotices, logActivity } = useContent();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<NoticeCategory | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<CommunityNotice | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Omit<CommunityNotice, 'id' | 'createdAt'>>({
    title: { en: '', gu: '' },
    content: { en: '', gu: '' },
    category: 'announcement',
    author: 'Gram Panchayat Dholasan',
    contact: '',
    date: new Date().toISOString().split('T')[0],
    pinned: false,
    likes: 0,
    approved: true,
  });

  const filteredNotices = communityNotices.filter((n) => {
    if (categoryFilter !== 'all' && n.category !== categoryFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      n.title.en.toLowerCase().includes(q) ||
      n.title.gu.toLowerCase().includes(q) ||
      n.author.toLowerCase().includes(q) ||
      n.content.en.toLowerCase().includes(q) ||
      n.content.gu.toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setEditingNotice(null);
    setFormData({
      title: { en: '', gu: '' },
      content: { en: '', gu: '' },
      category: 'announcement',
      author: 'Gram Panchayat Dholasan',
      contact: '+91 98250 12345',
      date: new Date().toISOString().split('T')[0],
      pinned: false,
      likes: 0,
      approved: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (notice: CommunityNotice) => {
    setEditingNotice(notice);
    setFormData({
      title: { ...notice.title },
      content: { ...notice.content },
      category: notice.category,
      author: notice.author,
      contact: notice.contact || '',
      date: notice.date,
      pinned: !!notice.pinned,
      likes: notice.likes || 0,
      approved: notice.approved !== false,
    });
    setModalOpen(true);
  };

  const handleTogglePin = (id: string) => {
    const updated = communityNotices.map((n) =>
      n.id === id ? { ...n, pinned: !n.pinned } : n
    );
    updateNotices(updated);
    logActivity('Toggle Pin', 'Community Notices', `Toggled pin for notice ID ${id}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNotice) {
      const updated = communityNotices.map((n) =>
        n.id === editingNotice.id
          ? {
              ...n,
              ...formData,
            }
          : n
      );
      updateNotices(updated);
      logActivity('Update Notice', 'Community Notices', `Updated notice: ${formData.title.en}`);
    } else {
      const newNotice: CommunityNotice = {
        ...formData,
        id: 'n-' + Date.now().toString(36),
        createdAt: Date.now(),
      };
      updateNotices([newNotice, ...communityNotices]);
      logActivity('Create Notice', 'Community Notices', `Created notice: ${formData.title.en}`);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteConfirmId) return;
    const item = communityNotices.find((n) => n.id === deleteConfirmId);
    const updated = communityNotices.filter((n) => n.id !== deleteConfirmId);
    updateNotices(updated);
    logActivity('Delete Notice', 'Community Notices', `Deleted notice: ${item?.title.en || deleteConfirmId}`);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Community Notices</h1>
          <p className="text-sm text-gray-500 mt-1">
            Moderate, pin, add, and update public notices & announcements.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
        >
          <span>+</span>
          <span>Post Official Notice</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {['all', 'announcement', 'achievement', 'emergency', 'general'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                categoryFilter === cat
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notices..."
          className="w-full sm:w-64 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Notices Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Title / Category</th>
                <th className="px-6 py-4">Author & Contact</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Likes</th>
                <th className="px-6 py-4">Pin Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredNotices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No notices found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredNotices.map((notice) => (
                  <tr key={notice.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                            notice.category === 'emergency'
                              ? 'bg-red-100 text-red-700'
                              : notice.category === 'achievement'
                              ? 'bg-purple-100 text-purple-700'
                              : notice.category === 'announcement'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {notice.category}
                        </span>
                        {notice.pinned && (
                          <span className="text-xs bg-orange-100 text-orange-700 font-bold px-1.5 py-0.5 rounded">
                            📌 Pinned
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-gray-900 mt-1">{notice.title.en}</p>
                      <p className="text-xs text-gray-500 font-gujarati">{notice.title.gu}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{notice.author}</p>
                      {notice.contact && <p className="text-xs text-gray-500">{notice.contact}</p>}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">{notice.date}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 rounded-md text-xs font-semibold text-gray-700">
                        ❤️ {notice.likes || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePin(notice.id)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                          notice.pinned
                            ? 'bg-orange-50 text-orange-600 border-orange-200'
                            : 'text-gray-500 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {notice.pinned ? 'Unpin' : 'Pin to Top'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(notice)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 p-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(notice.id)}
                        className="text-xs font-semibold text-red-600 hover:text-red-800 p-1"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingNotice ? 'Edit Community Notice' : 'Post Official Community Notice'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <BilingualInput
            label="Notice Title"
            value={formData.title}
            onChange={(val) => setFormData({ ...formData, title: val })}
            required
          />

          <BilingualInput
            label="Notice Content / Description"
            value={formData.content}
            onChange={(val) => setFormData({ ...formData, content: val })}
            multiline
            rows={4}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as NoticeCategory })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm outline-none"
              >
                <option value="announcement">Announcement 📢</option>
                <option value="achievement">Achievement 🏆</option>
                <option value="emergency">Help & Emergency 🆘</option>
                <option value="general">General Discussion 💬</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2 text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Author / Authority</label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="e.g. Gram Panchayat Dholasan"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Contact (Phone/Email)</label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="+91 98250 12345"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={formData.pinned}
                onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-400"
              />
              <span>Pin this notice to top of board</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-300 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow"
            >
              {editingNotice ? 'Save Changes' : 'Publish Notice'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Community Notice"
        message="Are you sure you want to delete this notice? This action cannot be undone."
      />
    </div>
  );
};

export default ManageCommunityNotices;
