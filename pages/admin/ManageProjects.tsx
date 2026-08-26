import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { DevelopmentProject } from '../../types';
import BilingualInput from '../../components/admin/BilingualInput';
import AdminModal from '../../components/admin/AdminModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const ManageProjects: React.FC = () => {
  const { developmentProjects, updateDevelopmentProjects, logActivity } = useContent();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProj, setEditingProj] = useState<DevelopmentProject | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Donor Sub-Modal state
  const [donorModalOpen, setDonorModalOpen] = useState(false);
  const [selectedProjForDonor, setSelectedProjForDonor] = useState<DevelopmentProject | null>(null);
  const [newDonorName, setNewDonorName] = useState('');
  const [newDonorAmount, setNewDonorAmount] = useState('');
  const [newDonorLocation, setNewDonorLocation] = useState('');
  const [newDonorMsg, setNewDonorMsg] = useState('');

  const [formData, setFormData] = useState<DevelopmentProject>({
    id: '',
    title: { en: '', gu: '' },
    description: { en: '', gu: '' },
    category: { en: '', gu: '' },
    targetAmount: 100000,
    raisedAmount: 0,
    status: 'ongoing',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
    donors: [],
    upiId: 'dholasantrust@sbi',
    bankDetails: {
      en: 'State Bank of India, Dholasan Branch | A/C: 38472910482 | IFSC: SBIN0001234',
      gu: 'સ્ટેટ બેંક ઓફ ઇન્ડિયા, ધોળાસણ શાખા | ખાતા નં: 38472910482 | IFSC: SBIN0001234',
    },
  });

  const handleOpenAdd = () => {
    setEditingProj(null);
    setFormData({
      id: 'proj-' + Date.now().toString(36),
      title: { en: '', gu: '' },
      description: { en: '', gu: '' },
      category: { en: 'Infrastructure', gu: 'માળખાકીય સુવિધા' },
      targetAmount: 200000,
      raisedAmount: 0,
      status: 'ongoing',
      imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
      donors: [],
      upiId: 'dholasantrust@sbi',
      bankDetails: {
        en: 'State Bank of India, Dholasan Branch | A/C: 38472910482 | IFSC: SBIN0001234',
        gu: 'સ્ટેટ બેંક ઓફ ઇન્ડિયા, ધોળાસણ શાખા | ખાતા નં: 38472910482 | IFSC: SBIN0001234',
      },
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (proj: DevelopmentProject) => {
    setEditingProj(proj);
    setFormData({ ...proj });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProj) {
      const updated = developmentProjects.map((p) => (p.id === editingProj.id ? formData : p));
      updateDevelopmentProjects(updated);
      logActivity('Update Project', 'Development Projects', `Updated project ${formData.title.en}`);
    } else {
      updateDevelopmentProjects([formData, ...developmentProjects]);
      logActivity('Add Project', 'Development Projects', `Added project ${formData.title.en}`);
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    const target = developmentProjects.find((p) => p.id === deleteId);
    const updated = developmentProjects.filter((p) => p.id !== deleteId);
    updateDevelopmentProjects(updated);
    logActivity('Delete Project', 'Development Projects', `Deleted project ${target?.title.en || deleteId}`);
    setDeleteId(null);
  };

  const handleAddDonor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjForDonor || !newDonorName.trim() || !newDonorAmount) return;

    const amountNum = Number(newDonorAmount);
    const newDonor = {
      id: 'd-' + Date.now().toString(36),
      name: newDonorName.trim(),
      amount: amountNum,
      location: newDonorLocation.trim(),
      message: newDonorMsg.trim(),
    };

    const updated = developmentProjects.map((p) => {
      if (p.id === selectedProjForDonor.id) {
        const donorsList = [newDonor, ...(p.donors || [])];
        const newRaised = (p.raisedAmount || 0) + amountNum;
        return {
          ...p,
          donors: donorsList,
          raisedAmount: newRaised,
        };
      }
      return p;
    });

    updateDevelopmentProjects(updated);
    logActivity('Add Donor', 'Development Projects', `Added donor ${newDonor.name} (₹${amountNum}) to ${selectedProjForDonor.title.en}`);
    setNewDonorName('');
    setNewDonorAmount('');
    setNewDonorLocation('');
    setNewDonorMsg('');
    setDonorModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Village Development Projects</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track infrastructure projects, funding targets, and donor recognition wall.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
        >
          + Create Development Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {developmentProjects.map((proj) => {
          const pct = Math.min(100, Math.round((proj.raisedAmount / (proj.targetAmount || 1)) * 100));
          return (
            <div key={proj.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
              <div className="flex items-start gap-4">
                <img src={proj.imageUrl} alt={proj.title.en} className="w-24 h-24 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-orange-100 text-orange-700">
                      {proj.category.en}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        proj.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {proj.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-gray-900 mt-1 truncate">{proj.title.en}</h3>
                  <p className="text-xs text-gray-400 font-gujarati truncate">{proj.title.gu}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-orange-600">₹{proj.raisedAmount.toLocaleString()} raised</span>
                  <span className="text-gray-500">Goal: ₹{proj.targetAmount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                </div>
              </div>

              {/* Donors Count & Actions */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">
                  {proj.donors?.length || 0} Donors registered
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedProjForDonor(proj);
                      setDonorModalOpen(true);
                    }}
                    className="text-xs font-bold bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg hover:bg-orange-100"
                  >
                    + Add Donor
                  </button>
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 p-1.5"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(proj.id)}
                    className="text-xs font-semibold text-red-600 hover:text-red-800 p-1.5"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Edit Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProj ? 'Edit Development Project' : 'Create Development Project'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <BilingualInput
            label="Project Title"
            value={formData.title}
            onChange={(val) => setFormData({ ...formData, title: val })}
            required
          />

          <BilingualInput
            label="Project Description"
            value={formData.description}
            onChange={(val) => setFormData({ ...formData, description: val })}
            multiline
            rows={3}
            required
          />

          <BilingualInput
            label="Category"
            value={formData.category}
            onChange={(val) => setFormData({ ...formData, category: val })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Target Amount (₹)</label>
              <input
                type="number"
                required
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: Number(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Raised Amount (₹)</label>
              <input
                type="number"
                required
                value={formData.raisedAmount}
                onChange={(e) => setFormData({ ...formData, raisedAmount: Number(e.target.value) })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm outline-none"
              >
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="planned">Planned</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Project Photo URL</label>
            <input
              type="text"
              required
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">UPI ID (GPay / PhonePe)</label>
              <input
                type="text"
                value={formData.upiId || ''}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                placeholder="dholasantrust@sbi"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm outline-none"
              />
            </div>
            <BilingualInput
              label="Bank Account Information"
              value={formData.bankDetails || { en: '', gu: '' }}
              onChange={(val) => setFormData({ ...formData, bankDetails: val })}
            />
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
              {editingProj ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Add Donor Sub-Modal */}
      <AdminModal
        isOpen={donorModalOpen}
        onClose={() => setDonorModalOpen(false)}
        title={`Add Donor to "${selectedProjForDonor?.title.en}"`}
      >
        <form onSubmit={handleAddDonor} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Donor Name / Family</label>
            <input
              type="text"
              required
              value={newDonorName}
              onChange={(e) => setNewDonorName(e.target.value)}
              placeholder="e.g. Shree Kantilal Patel (USA)"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Donation Amount (₹)</label>
              <input
                type="number"
                required
                value={newDonorAmount}
                onChange={(e) => setNewDonorAmount(e.target.value)}
                placeholder="50000"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Location / City</label>
              <input
                type="text"
                value={newDonorLocation}
                onChange={(e) => setNewDonorLocation(e.target.value)}
                placeholder="e.g. Chicago, USA or Ahmedabad"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Donor Note / Blessings (Optional)</label>
            <input
              type="text"
              value={newDonorMsg}
              onChange={(e) => setNewDonorMsg(e.target.value)}
              placeholder="e.g. In memory of parents"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-sm outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setDonorModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-300 text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow"
            >
              Record Donation
            </button>
          </div>
        </form>
      </AdminModal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="Are you sure you want to delete this development project?"
      />
    </div>
  );
};

export default ManageProjects;
