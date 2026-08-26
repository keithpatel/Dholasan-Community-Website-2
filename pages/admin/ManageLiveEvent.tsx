
import React, { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import { LiveEvent, TranslatableString } from '../../types';
import BilingualInput from '../../components/admin/BilingualInput';
import ImagePreview from '../../components/admin/ImagePreview';

const PLATFORMS = ['YouTube', 'Facebook', 'Instagram', 'Twitch', 'Other'];

const emptyLiveEvent: LiveEvent = {
  isLive: false,
  name: { en: '', gu: '' },
  url: '',
  platform: 'YouTube',
  thumbnailUrl: '',
};

const ManageLiveEvent: React.FC = () => {
  const { siteSettings, updateSiteSettings, logActivity } = useContent();
  const current = siteSettings.liveEvent || emptyLiveEvent;

  const [isLive, setIsLive] = useState<boolean>(current.isLive);
  const [name, setName] = useState<TranslatableString>(current.name || { en: '', gu: '' });
  const [url, setUrl] = useState<string>(current.url || '');
  const [platform, setPlatform] = useState<string>(current.platform || 'YouTube');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(current.thumbnailUrl || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLive && !url.trim()) {
      setFormError('Please enter the live stream URL before going live.');
      return;
    }
    if (isLive && !name.en.trim() && !name.gu.trim()) {
      setFormError('Please enter a name for the live event.');
      return;
    }
    setFormError('');

    const liveEvent: LiveEvent = {
      isLive,
      name,
      url: url.trim(),
      platform,
      thumbnailUrl: thumbnailUrl.trim(),
    };
    updateSiteSettings({ ...siteSettings, liveEvent });
    logActivity(
      isLive ? 'GO_LIVE' : 'END_LIVE',
      'Live Event',
      `${name.en || name.gu || 'Live event'} ${isLive ? 'is now LIVE' : 'set to offline'} (${platform})`
    );
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const preview = (
    <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-xl shadow-lg overflow-hidden">
      <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex-shrink-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            Live
          </span>
          <div className="min-w-0">
            {(name.en || name.gu) && (
              <h2 className="text-white font-bold text-lg leading-tight truncate">{name.en || name.gu}</h2>
            )}
            <p className="text-white/80 text-sm">{platform || 'Live Stream'}</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 bg-white text-red-600 font-bold px-6 py-2.5 rounded-full flex-shrink-0">
          ▶ Watch Now
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Event Stream</h1>
          <p className="text-sm text-gray-500">Share a live stream link (YouTube, Facebook, etc.) and show visitors what is live right now.</p>
        </div>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2"
        >
          {saveSuccess ? '✓ Saved!' : 'Save Live Event'}
        </button>
      </div>

      {/* Live status banner */}
      <div
        className={`rounded-2xl border p-6 transition-all ${
          isLive
            ? 'bg-red-50 border-red-200'
            : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
              }`}
            />
            <div>
              <h2 className="font-semibold text-gray-900">
                {isLive ? 'This event is currently LIVE' : 'Live event is off'}
              </h2>
              <p className="text-sm text-gray-500">
                {isLive
                  ? 'Visitors can now see the live banner on the website.'
                  : 'Toggle the switch below to broadcast a live event to visitors.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsLive(!isLive)}
            className={`relative inline-flex items-center h-8 w-14 rounded-full transition-colors ${
              isLive ? 'bg-red-500' : 'bg-gray-300'
            }`}
            aria-pressed={isLive}
          >
            <span
              className={`inline-block w-6 h-6 transform bg-white rounded-full shadow transition-transform ${
                isLive ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Live Event Details</h2>

          <BilingualInput
            label="Event Name"
            value={name}
            onChange={setName}
            placeholder="e.g. Navratri Garba Night Live"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">The platform the live stream is hosted on.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Live Stream URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 font-mono text-xs"
              />
              <p className="text-xs text-gray-500 mt-1">
                Visitors click this link to open the stream on YouTube, Facebook, etc.
              </p>
            </div>
          </div>

          <ImagePreview
            url={thumbnailUrl}
            onChange={setThumbnailUrl}
            label="Live Thumbnail Image URL (optional)"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Visitor Preview</h2>
          <p className="text-sm text-gray-600">
            This is exactly what visitors will see at the top of the Home and Events pages while the event is live.
          </p>
          {isLive && url ? (
            preview
          ) : (
            <div className="rounded-xl border-2 border-dashed border-gray-300 py-10 text-center text-gray-400 text-sm">
              {!isLive
                ? 'The banner is hidden — turn the live toggle on to preview it.'
                : 'Enter a stream URL to preview the banner.'}
            </div>
          )}
        </div>

        {formError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm font-medium text-red-600">
            {formError}
          </div>
        )}
      </form>
    </div>
  );
};

export default ManageLiveEvent;
