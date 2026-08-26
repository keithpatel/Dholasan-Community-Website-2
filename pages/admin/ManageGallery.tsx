
import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { GalleryImage, TranslatableString } from '../../types';
import AdminModal from '../../components/admin/AdminModal';
import BilingualInput from '../../components/admin/BilingualInput';
import ImagePreview from '../../components/admin/ImagePreview';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const ManageGallery: React.FC = () => {
  const { galleryImages, updateGallery, siteSettings, updateSiteSettings, logActivity } = useContent();

  const categories = (siteSettings.galleryCategories || []).map((c) => c.id);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryImage | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<GalleryImage | null>(null);

  // Form State
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState<TranslatableString>({ en: '', gu: '' });
  const [category, setCategory] = useState<string>('Festivals');
  const [formError, setFormError] = useState('');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setSrc(`https://picsum.photos/seed/dholasan${Date.now()}/600/400`);
    setAlt({ en: '', gu: '' });
    setCategory(categories[0] || 'Festivals');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: GalleryImage) => {
    setEditingItem(item);
    setSrc(item.src);
    setAlt(item.alt);
    setCategory(item.category);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!src.trim() || !alt.en.trim()) {
      setFormError('Please enter an image URL and an English caption.');
      return;
    }
    setFormError('');

    if (editingItem) {
      const updated = galleryImages.map((img) =>
        img.id === editingItem.id ? { ...img, src, alt, category } : img
      );
      updateGallery(updated);
      logActivity('EDIT', 'Gallery', `Updated photo: ${alt.en}`);
    } else {
      const newItem: GalleryImage = {
        id: Date.now(),
        src,
        alt,
        category,
      };
      updateGallery([newItem, ...galleryImages]);
      logActivity('ADD', 'Gallery', `Added photo: ${alt.en}`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteCandidate) return;
    const filtered = galleryImages.filter((img) => img.id !== deleteCandidate.id);
    updateGallery(filtered);
    logActivity('DELETE', 'Gallery', `Deleted photo: ${deleteCandidate.alt.en}`);
    setDeleteCandidate(null);
  };

  const moveImage = (imgId: number, dir: -1 | 1) => {
    const idx = galleryImages.findIndex((g) => g.id === imgId);
    const target = idx + dir;
    if (idx < 0 || target < 0 || target >= galleryImages.length) return;
    const next = [...galleryImages];
    [next[idx], next[target]] = [next[target], next[idx]];
    updateGallery(next);
    logActivity('REORDER', 'Gallery', 'Reordered gallery photos');
  };

  const filteredImages = activeCategory === 'All'
    ? galleryImages
    : galleryImages.filter((img) => img.category === activeCategory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Photo Gallery</h1>
          <p className="text-sm text-gray-500">Add, categorize and manage images in the photo gallery.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
        >
          <span className="text-lg font-bold">+</span> Add Image
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 border-b border-gray-200 pb-3">
        {(['All', ...categories] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeCategory === cat
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'bg-gray-100 text-gray-500 hover:text-gray-800'
            }`}
          >
            {cat} ({cat === 'All' ? galleryImages.length : galleryImages.filter(i => i.category === cat).length})
          </button>
        ))}
      </div>

      {/* Image Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredImages.map((img) => (
          <div
            key={img.id}
            className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex flex-col"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                src={img.src}
                alt={img.alt.en}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/10 uppercase">
                {img.category}
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900 truncate">{img.alt.en}</p>
                <p className="text-xs text-gray-500 truncate font-gujarati mt-0.5">{img.alt.gu}</p>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
                <button
                  onClick={() => handleOpenEdit(img)}
                  className="flex-1 py-1.5 bg-gray-100 hover:bg-orange-500 text-gray-700 hover:text-white rounded-lg text-xs font-medium transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteCandidate(img)}
                  className="flex-1 py-1.5 bg-gray-100 hover:bg-red-600 text-gray-700 hover:text-white rounded-lg text-xs font-medium transition-all"
                >
                  Delete
                </button>
              </div>
              <div className="flex gap-2 text-xs">
                <button
                  onClick={() => moveImage(img.id, -1)}
                  disabled={galleryImages.findIndex((g) => g.id === img.id) === 0}
                  className="flex-1 py-1 bg-gray-100/70 hover:bg-gray-200 disabled:opacity-30 text-gray-500 hover:text-gray-900 rounded-lg transition-all"
                >
                  ▲ Move Up
                </button>
                <button
                  onClick={() => moveImage(img.id, 1)}
                  disabled={galleryImages.findIndex((g) => g.id === img.id) === galleryImages.length - 1}
                  className="flex-1 py-1 bg-gray-100/70 hover:bg-gray-200 disabled:opacity-30 text-gray-500 hover:text-gray-900 rounded-lg transition-all"
                >
                  ▼ Move Down
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Image' : 'Add Image to Gallery'}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <ImagePreview url={src} onChange={setSrc} label="Image URL" />

          <BilingualInput label="Caption / Alt Text" value={alt} onChange={setAlt} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as string)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm font-medium text-red-600">
              {formError}
            </div>
          )}

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
              Save Image
            </button>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        isOpen={!!deleteCandidate}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleDelete}
        title="Delete Image"
        message={`Are you sure you want to delete "${deleteCandidate?.alt.en}"?`}
      />
    </div>
  );
};

export default ManageGallery;
