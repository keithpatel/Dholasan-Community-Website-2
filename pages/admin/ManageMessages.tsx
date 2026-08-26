import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { ContactMessage } from '../../types';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const ManageMessages: React.FC = () => {
  const { contactMessages, markMessageRead, removeContactMessage, logActivity } = useContent();
  const [deleteCandidate, setDeleteCandidate] = useState<ContactMessage | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const unreadCount = contactMessages.filter((m) => !m.read).length;

  const toggleRead = (msg: ContactMessage) => {
    markMessageRead(msg.id, !msg.read);
  };

  const handleDelete = () => {
    if (!deleteCandidate) return;
    removeContactMessage(deleteCandidate.id);
    logActivity('DELETE', 'Messages', `Deleted message from ${deleteCandidate.email}`);
    setDeleteCandidate(null);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(contactMessages, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contact_messages_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    logActivity('EXPORT', 'Messages', 'Exported contact messages');
  };

  const markAllRead = () => {
    contactMessages.filter((m) => !m.read).forEach((m) => markMessageRead(m.id, true));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Form Messages</h1>
          <p className="text-sm text-gray-500">
            Messages sent by visitors through the Contact page.
            {unreadCount > 0 && <span className="ml-2 text-orange-600 font-semibold">{unreadCount} unread</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 transition-all"
          >
            Mark All Read
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 transition-all"
          >
            Export JSON
          </button>
        </div>
      </div>

      {contactMessages.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-gray-500">No messages yet. When visitors use the Contact form, their messages appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contactMessages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white border rounded-2xl overflow-hidden transition-colors shadow-sm ${
                msg.read ? 'border-gray-200' : 'border-orange-300'
              }`}
            >
              <button
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-gray-50"
                onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${
                      msg.read ? 'bg-gray-300' : 'bg-orange-500 animate-pulse'
                    }`}
                  />
                  <div className="min-w-0">
                    <p className={`truncate ${msg.read ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>
                      {msg.name} · {msg.subject}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{msg.email} · {new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleRead(msg)}
                    className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    {msg.read ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={() => setDeleteCandidate(msg)}
                    className="px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-red-600 text-gray-700 hover:text-white rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </button>
              {expandedId === msg.id && (
                <div className="px-6 pb-5 pt-1 border-t border-gray-200">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                  <p className="text-xs text-gray-500 mt-3">From: {msg.name} &lt;{msg.email}&gt;</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteCandidate}
        onClose={() => setDeleteCandidate(null)}
        onConfirm={handleDelete}
        title="Delete Message"
        message={`Delete the message from "${deleteCandidate?.email}"? This cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
};

export default ManageMessages;