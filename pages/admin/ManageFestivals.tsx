
import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { Festival, TranslatableString } from '../../types';
import AdminModal from '../../components/admin/AdminModal';
import BilingualInput from '../../components/admin/BilingualInput';
import ImagePreview from '../../components/admin/ImagePreview';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const ManageFestivals: React.FC = () => {
  const { siteSettings, updateSiteSettings, logActivity } = useContent();
  const festivals = siteSettings.festivals || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Festival | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Festival | null>(null);

  // Form State
  const [name, setName] = useState<TranslatableString>({ en: '', gu: '' });
  const [description, setDescription] = useState<TranslatableString>({ en: '', gu: '' });
  const [imageUrl, setImageUrl] = useState('');
  const [formError, setFormError] = useState('');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName({ en: '', gu: '' });
    setDescription({ en: '', gu: '' });
    setImageUrl('https://picsum.photos/seed/festival/400/300');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Festival) => {
    setEditingItem(item);
    setName(item.name);
    setDescription(item.description);
    setImageUrl(item.imageUrl);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.en.trim()) {
      setFormError('Please enter a festival name in English.');
      return;
    }
    setFormError('');

    let updatedList: Festival[];
    if (editingItem) {
      updatedList = festivals.map((f) =>
        f.id === editingItem.id ? { ...f, name, description, imageUrl } : f
      );
      logActivity('EDIT', 'Festivals', `Updated festival: ${name.en}`);
    } else {
      const newItem: Festival = {
        id: Date.now(),
        name,
        description,
        imageUrl,
      };
      updatedList = [...festivals, newItem];
      logActivity('ADD', 'Festivals', `Added festival: ${name.en}`);
    }

    updateSiteSettings({ ...siteSettings, festivals: updatedList });
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteCandidate) return;
    const updatedList = festivals.filter((f) => f.id !== deleteCandidate.id);
    updateSiteSettings({ ...siteSettings, festivals: updatedList });
    logActivity('DELETE', 'Festivals', `Deleted festival: ${deleteCandidate.name.en}`);
    setDeleteCandidate(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Annual Festivals</h1>
          <p className="text-sm text-gray-500">Configure major cultural festivals displayed on the Events page.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
        >
          <span className="text-lg font-bold">+</span> Add Festival
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {festivals.map((fest) => (
          <div
            key={fest.id}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="h-44 overflow-hidden bg-gray-100">
                <img
                  src={fest.imageUrl}
                  alt={fest.name.en}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5 space-y-2">
                <h3 className="text-lg font-bold text-gray-900">{fest.name.en}</h3>
                <p className="text-xs text-orange-600 font-gujarati">{fest.name.gu}</p>
                <p className="text-xs text-gray-500 leading-relaxed pt-2">{fest.description.en}</p>
              </div>
            </div>

            <div className="p-4 pt-0 flex gap-2 border-t border-gray-200 mt-4">
              <button
                onClick={() => handleOpenEdit(fest)}
                className="flex-1 py-2 bg-gray-100 hover:bg-orange-500 text-gray-700 hover:text-white rounded-xl text-xs font-medium transition-all"
              >
                Edit Festival
              </button>
              <button
                onClick={() => setDeleteCandidate(fest)}
                className="flex-1 py-2 bg-gray-100 hover:bg-red-600 text-gray-700 hover:text-white rounded-xl text-xs font-medium transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Festival' : 'Add Annual Festival'}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <BilingualInput label="Festival Name" value={name} onChange={setName} />
          <BilingualInput label="Description" value={description} onChange={setDescription} multiline rows={3} />
          <ImagePreview url={imageUrl} onChange={setImageUrl} label="Festival Banner Image URL" />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600"
            >
              Save Festival
            </button>
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm font-medium text-red-600">
              {formError}
            </div>
          )}
        </form>
      </AdminModal>

      <ConfirmDialog
        isOpen={!!deleteCandidate}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleDelete}
        title="Delete Festival"
        message={`Are you sure you want to delete "${deleteCandidate?.name.en}"?`}
      />
    </div>
  );
};

export default ManageFestivals;
