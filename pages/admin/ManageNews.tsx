
import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { NewsArticle, TranslatableString } from '../../types';
import DataTable from '../../components/admin/DataTable';
import AdminModal from '../../components/admin/AdminModal';
import BilingualInput from '../../components/admin/BilingualInput';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const ManageNews: React.FC = () => {
  const { newsArticles, updateNews, logActivity } = useContent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsArticle | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<NewsArticle | null>(null);

  // Form State
  const [title, setTitle] = useState<TranslatableString>({ en: '', gu: '' });
  const [summary, setSummary] = useState<TranslatableString>({ en: '', gu: '' });
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [formError, setFormError] = useState('');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setTitle({ en: '', gu: '' });
    setSummary({ en: '', gu: '' });
    setDate(new Date().toISOString().split('T')[0]);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: NewsArticle) => {
    setEditingItem(item);
    setTitle(item.title);
    setSummary(item.summary);
    setDate(item.date);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.en.trim()) {
      setFormError('Please enter a title in English.');
      return;
    }
    setFormError('');

    if (editingItem) {
      const updated = newsArticles.map((art) =>
        art.id === editingItem.id ? { ...art, title, summary, date } : art
      );
      updateNews(updated);
      logActivity('EDIT', 'News', `Updated article: ${title.en}`);
    } else {
      const newItem: NewsArticle = {
        id: Date.now(),
        title,
        summary,
        date,
      };
      updateNews([newItem, ...newsArticles]);
      logActivity('ADD', 'News', `Created article: ${title.en}`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteCandidate) return;
    const filtered = newsArticles.filter((a) => a.id !== deleteCandidate.id);
    updateNews(filtered);
    logActivity('DELETE', 'News', `Deleted article: ${deleteCandidate.title.en}`);
    setDeleteCandidate(null);
  };

  const handleBulkDelete = (items: NewsArticle[]) => {
    const idsToDelete = new Set(items.map((i) => i.id));
    const filtered = newsArticles.filter((a) => !idsToDelete.has(a.id));
    updateNews(filtered);
    logActivity('BULK_DELETE', 'News', `Deleted ${items.length} articles`);
  };

  const columns = [
    {
      key: 'title',
      label: 'Title (EN / GU)',
      sortable: true,
      render: (item: NewsArticle) => (
        <div>
          <div className="font-semibold text-gray-900">{item.title.en}</div>
          <div className="text-xs text-gray-500 font-gujarati">{item.title.gu}</div>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Publish Date',
      sortable: true,
      render: (item: NewsArticle) => (
        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
          {item.date}
        </span>
      ),
    },
    {
      key: 'summary',
      label: 'Summary',
      render: (item: NewsArticle) => (
        <p className="text-xs text-gray-500 max-w-xs truncate">{item.summary.en}</p>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage News & Announcements</h1>
          <p className="text-sm text-gray-500">Add, edit or remove news articles published on the site.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
        >
          <span className="text-lg font-bold">+</span> Add Article
        </button>
      </div>

      <DataTable<NewsArticle>
        columns={columns}
        data={newsArticles}
        keyField="id"
        onEdit={handleOpenEdit}
        onDelete={(item) => setDeleteCandidate(item)}
        searchField={(item, query) =>
          item.title.en.toLowerCase().includes(query) ||
          item.title.gu.toLowerCase().includes(query) ||
          item.summary.en.toLowerCase().includes(query)
        }
        searchPlaceholder="Search news articles..."
        bulkDelete
        onBulkDelete={handleBulkDelete}
        onReorder={(items) => { updateNews(items); logActivity('REORDER', 'News', 'Reordered news articles'); }}
      />

      {/* Add / Edit Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit News Article' : 'Add News Article'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <BilingualInput
            label="Article Title"
            value={title}
            onChange={setTitle}
            placeholder="Enter headline..."
          />

          <BilingualInput
            label="Article Summary"
            value={summary}
            onChange={setSummary}
            multiline
            rows={4}
            placeholder="Enter short description..."
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Publish Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600"
            >
              Save Article
            </button>
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm font-medium text-red-600">
              {formError}
            </div>
          )}
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteCandidate}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleDelete}
        title="Delete News Article"
        message={`Are you sure you want to delete "${deleteCandidate?.title.en}"? This cannot be undone.`}
      />
    </div>
  );
};

export default ManageNews;
