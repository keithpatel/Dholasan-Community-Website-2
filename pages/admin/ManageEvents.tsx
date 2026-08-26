
import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { Event, TranslatableString } from '../../types';
import DataTable from '../../components/admin/DataTable';
import AdminModal from '../../components/admin/AdminModal';
import BilingualInput from '../../components/admin/BilingualInput';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const ManageEvents: React.FC = () => {
  const { events, updateEvents, logActivity } = useContent();

  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'past'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Event | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Event | null>(null);

  // Form State
  const [name, setName] = useState<TranslatableString>({ en: '', gu: '' });
  const [date, setDate] = useState<TranslatableString>({ en: '', gu: '' });
  const [eventDate, setEventDate] = useState('');
  const [time, setTime] = useState('8:00 PM');
  const [location, setLocation] = useState<TranslatableString>({ en: '', gu: '' });
  const [description, setDescription] = useState<TranslatableString>({ en: '', gu: '' });
  const [isPast, setIsPast] = useState(false);
  const [autoPast, setAutoPast] = useState(true);
  const [formError, setFormError] = useState('');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName({ en: '', gu: '' });
    setDate({ en: '', gu: '' });
    setEventDate('');
    setTime('8:00 PM');
    setLocation({ en: 'Village Square', gu: 'ગામ ચોક' });
    setDescription({ en: '', gu: '' });
    setIsPast(false);
    setAutoPast(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Event) => {
    setEditingItem(item);
    setName(item.name);
    setDate(item.date);
    setEventDate(item.eventDate || '');
    setTime(item.time);
    setLocation(item.location);
    setDescription(item.description);
    setIsPast(!!item.isPast);
    setAutoPast(!!item.eventDate);
    setIsModalOpen(true);
  };

  const handleEventDateChange = (val: string) => {
    setEventDate(val);
    if (val) {
      const past = new Date(val + 'T23:59:59').getTime() < Date.now();
      setIsPast(past);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.en.trim()) {
      setFormError('Please enter an event name in English.');
      return;
    }
    setFormError('');

    const finalIsPast = eventDate && autoPast
      ? new Date(eventDate + 'T23:59:59').getTime() < Date.now()
      : isPast;

    if (editingItem) {
      const updated = events.map((ev) =>
        ev.id === editingItem.id ? { ...ev, name, date, eventDate, time, location, description, isPast: finalIsPast } : ev
      );
      updateEvents(updated);
      logActivity('EDIT', 'Events', `Updated event: ${name.en}`);
    } else {
      const newItem: Event = {
        id: Date.now(),
        name,
        date,
        eventDate,
        time,
        location,
        description,
        isPast: finalIsPast,
      };
      updateEvents([newItem, ...events]);
      logActivity('ADD', 'Events', `Created event: ${name.en}`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteCandidate) return;
    const filtered = events.filter((e) => e.id !== deleteCandidate.id);
    updateEvents(filtered);
    logActivity('DELETE', 'Events', `Deleted event: ${deleteCandidate.name.en}`);
    setDeleteCandidate(null);
  };

  const filteredEvents = events.filter((ev) => {
    if (activeTab === 'upcoming') return !ev.isPast;
    if (activeTab === 'past') return ev.isPast;
    return true;
  });

  const columns = [
    {
      key: 'name',
      label: 'Event Name',
      sortable: true,
      render: (item: Event) => (
        <div>
          <div className="font-semibold text-gray-900">{item.name.en}</div>
          <div className="text-xs text-gray-500 font-gujarati">{item.name.gu}</div>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Date & Time',
      render: (item: Event) => (
        <div className="text-xs text-gray-700">
          <div>{item.date.en}</div>
          <div className="text-gray-500">{item.time}</div>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (item: Event) => (
        <span className="text-xs text-gray-500">{item.location.en}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: Event) => (
        <span
          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
            item.isPast
              ? 'bg-gray-100 text-gray-600 border border-gray-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          {item.isPast ? 'Past' : 'Upcoming'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
          <p className="text-sm text-gray-500">Schedule village events and manage past activity archives.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
        >
          <span className="text-lg font-bold">+</span> Schedule Event
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-3">
        {(['all', 'upcoming', 'past'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === tab
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'bg-gray-100 text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab} ({tab === 'all' ? events.length : events.filter(e => tab === 'past' ? e.isPast : !e.isPast).length})
          </button>
        ))}
      </div>

      <DataTable<Event>
        columns={columns}
        data={filteredEvents}
        keyField="id"
        onEdit={handleOpenEdit}
        onDelete={(item) => setDeleteCandidate(item)}
        searchField={(item, query) =>
          item.name.en.toLowerCase().includes(query) ||
          item.name.gu.toLowerCase().includes(query) ||
          item.location.en.toLowerCase().includes(query)
        }
        searchPlaceholder="Search events..."
        onReorder={(items) => { updateEvents(items); logActivity('REORDER', 'Events', 'Reordered events'); }}
      />

      {/* Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? 'Edit Event' : 'Schedule Event'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <BilingualInput label="Event Name" value={name} onChange={setName} />
          <BilingualInput label="Event Date Text" value={date} onChange={setDate} placeholder="e.g. October 20, 2024" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Real Event Date (optional)</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => handleEventDateChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900"
              />
              <p className="text-xs text-gray-500 mt-1">Used to auto-sort upcoming / past events.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 8:00 PM"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900"
                required
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 pt-1">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={autoPast}
                onChange={(e) => setAutoPast(e.target.checked)}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              Auto mark past/upcoming from real date
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isPast}
                onChange={(e) => setIsPast(e.target.checked)}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              Manually mark as Past Event
            </label>
          </div>

          <BilingualInput label="Location" value={location} onChange={setLocation} />
          <BilingualInput label="Description" value={description} onChange={setDescription} multiline rows={3} />

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
              Save Event
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
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteCandidate?.name.en}"?`}
      />
    </div>
  );
};

export default ManageEvents;
