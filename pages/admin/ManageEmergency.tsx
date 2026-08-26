import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { EmergencyContact, EmergencyCategory } from '../../types';
import BilingualInput from '../../components/admin/BilingualInput';
import AdminModal from '../../components/admin/AdminModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const ManageEmergency: React.FC = () => {
  const { emergencyContacts, updateEmergencyContacts, logActivity } = useContent();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EmergencyContact | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<EmergencyContact>({
    id: '',
    name: { en: '', gu: '' },
    role: { en: '', gu: '' },
    phone: '',
    whatsapp: '',
    category: 'civic',
    availableHours: { en: '24/7 Available', gu: '૨૪ કલાક ઉપલબ્ધ' },
    address: { en: '', gu: '' },
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      id: 'em-' + Date.now().toString(36),
      name: { en: '', gu: '' },
      role: { en: '', gu: '' },
      phone: '',
      whatsapp: '',
      category: 'civic',
      availableHours: { en: '24/7 Available', gu: '૨૪ કલાક ઉપલબ્ધ' },
      address: { en: '', gu: '' },
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: EmergencyContact) => {
    setEditingItem(item);
    setFormData({
      ...item,
      address: item.address || { en: '', gu: '' },
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      const updated = emergencyContacts.map((c) => (c.id === editingItem.id ? formData : c));
      updateEmergencyContacts(updated);
      logActivity('Update Helpline', 'Emergency Directory', `Updated contact ${formData.name.en}`);
    } else {
      updateEmergencyContacts([formData, ...emergencyContacts]);
      logActivity('Add Helpline', 'Emergency Directory', `Added contact ${formData.name.en}`);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const target = emergencyContacts.find((c) => c.id === deleteId);
    const updated = emergencyContacts.filter((c) => c.id !== deleteId);
    updateEmergencyContacts(updated);
    logActivity('Delete Helpline', 'Emergency Directory', `Deleted contact ${target?.name.en || deleteId}`);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Emergency & Public Helplines</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure village 108 ambulance, police, doctors, Sarpanch, and utility contacts.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-red-500/20 hover:scale-105 transition-all"
        >
          + Add Helpline Contact
        </button>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Name / Title</th>
                <th className="px-6 py-4">Role & Category</th>
                <th className="px-6 py-4">Phone Number</th>
                <th className="px-6 py-4">WhatsApp</th>
                <th className="px-6 py-4">Available Hours</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {emergencyContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">
                    <p>{contact.name.en}</p>
                    <p className="text-xs text-gray-400 font-normal font-gujarati">{contact.name.gu}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-gray-100 text-gray-700">
                      {contact.category}
                    </span>
                    <p className="text-xs text-gray-600 mt-1">{contact.role.en}</p>
                  </td>
                  <td className="px-6 py-4 font-mono font-semibold text-gray-800">{contact.phone}</td>
                  <td className="px-6 py-4 text-xs font-mono text-gray-500">
                    {contact.whatsapp || '—'}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-600">{contact.availableHours.en}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(contact)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(contact.id)}
                      className="text-xs font-semibold text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? 'Edit Helpline Contact' : 'Add Helpline Contact'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <BilingualInput
            label="Contact Name / Service Title"
            value={formData.name}
            onChange={(val) => setFormData({ ...formData, name: val })}
            required
          />

          <BilingualInput
            label="Designation / Role / Purpose"
            value={formData.role}
            onChange={(val) => setFormData({ ...formData, role: val })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as EmergencyCategory })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm outline-none"
              >
                <option value="civic">Civic & Panchayat 🏛️</option>
                <option value="medical">Medical & Hospital 🏥</option>
                <option value="utility">Utility (Electricity/Water) ⚡</option>
                <option value="police">Police & Security 👮</option>
                <option value="veterinary">Veterinary & Gaushala 🐄</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Direct Call Phone Number</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="108 or +91 98250 12345"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp Number (Optional)</label>
              <input
                type="text"
                value={formData.whatsapp || ''}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="+919825012345"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm outline-none"
              />
            </div>

            <BilingualInput
              label="Availability Hours"
              value={formData.availableHours}
              onChange={(val) => setFormData({ ...formData, availableHours: val })}
              required
            />
          </div>

          <BilingualInput
            label="Address / Office Location (Optional)"
            value={formData.address || { en: '', gu: '' }}
            onChange={(val) => setFormData({ ...formData, address: val })}
          />

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
              className="px-5 py-2 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white shadow"
            >
              {editingItem ? 'Save Changes' : 'Add Contact'}
            </button>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Helpline"
        message="Are you sure you want to delete this emergency contact?"
      />
    </div>
  );
};

export default ManageEmergency;
