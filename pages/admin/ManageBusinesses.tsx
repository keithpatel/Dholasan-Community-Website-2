
import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { Business, TranslatableString } from '../../types';
import DataTable from '../../components/admin/DataTable';
import AdminModal from '../../components/admin/AdminModal';
import BilingualInput from '../../components/admin/BilingualInput';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const ManageBusinesses: React.FC = () => {
  const { businesses, updateBusinesses, logActivity } = useContent();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Business | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Business | null>(null);

  // Form State
  const [name, setName] = useState<TranslatableString>({ en: '', gu: '' });
  const [category, setCategory] = useState<TranslatableString>({ en: '', gu: '' });
  const [contactPerson, setContactPerson] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [formError, setFormError] = useState('');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName({ en: '', gu: '' });
    setCategory({ en: 'Grocery', gu: 'કરિયાણું' });
    setContactPerson('');
    setContactNumber('+91 ');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Business) => {
    setEditingItem(item);
    setName(item.name);
    setCategory(item.category);
    setContactPerson(item.contactPerson);
    setContactNumber(item.contactNumber);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.en.trim()) {
      setFormError('Please enter a business name in English.');
      return;
    }
    setFormError('');

    if (editingItem) {
      const updated = businesses.map((b) =>
        b.id === editingItem.id ? { ...b, name, category, contactPerson, contactNumber } : b
      );
      updateBusinesses(updated);
      logActivity('EDIT', 'Businesses', `Updated business: ${name.en}`);
    } else {
      const newItem: Business = {
        id: Date.now(),
        name,
        category,
        contactPerson,
        contactNumber,
      };
      updateBusinesses([...businesses, newItem]);
      logActivity('ADD', 'Businesses', `Added business: ${name.en}`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteCandidate) return;
    const filtered = businesses.filter((b) => b.id !== deleteCandidate.id);
    updateBusinesses(filtered);
    logActivity('DELETE', 'Businesses', `Deleted business: ${deleteCandidate.name.en}`);
    setDeleteCandidate(null);
  };

  const columns = [
    {
      key: 'name',
      label: 'Business Name',
      sortable: true,
      render: (item: Business) => (
        <div>
          <div className="font-semibold text-gray-900">{item.name.en}</div>
          <div className="text-xs text-gray-500 font-gujarati">{item.name.gu}</div>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (item: Business) => (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-600 border border-orange-500/20">
          {item.category.en}
        </span>
      ),
    },
    {
      key: 'contactPerson',
      label: 'Contact Person',
      render: (item: Business) => (
        <span className="text-xs text-gray-700">{item.contactPerson}</span>
      ),
    },
    {
      key: 'contactNumber',
      label: 'Contact Number',
      render: (item: Business) => (
        <span className="font-mono text-xs text-gray-500">{item.contactNumber}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Local Businesses</h1>
          <p className="text-sm text-gray-500">Directory of shops, services and local enterprise in Dholasan.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
        >
          <span className="text-lg font-bold">+</span> Add Business
        </button>
      </div>

      <DataTable<Business>
        columns={columns}
        data={businesses}
        keyField="id"
        onEdit={handleOpenEdit}
        onDelete={(item) => setDeleteCandidate(item)}
        searchField={(item, query) =>
          item.name.en.toLowerCase().includes(query) ||
          item.name.gu.toLowerCase().includes(query) ||
          item.category.en.toLowerCase().includes(query) ||
          item.contactPerson.toLowerCase().includes(query)
        }
        searchPlaceholder="Search business directory..."
        onReorder={(items) => { updateBusinesses(items); logActivity('REORDER', 'Businesses', 'Reordered businesses'); }}
      />

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Business Listing' : 'Add Business Listing'}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <BilingualInput label="Business Name" value={name} onChange={setName} />
          <BilingualInput label="Category" value={category} onChange={setCategory} placeholder="e.g. Grocery, Agriculture..." />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="e.g. Ramesh Patel"
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 font-mono"
              required
            />
          </div>

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
              Save Business
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
        title="Delete Business"
        message={`Are you sure you want to delete "${deleteCandidate?.name.en}"?`}
      />
    </div>
  );
};

export default ManageBusinesses;
