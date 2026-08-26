import React, { useState } from 'react';

interface ImagePreviewProps {
  url: string;
  onChange: (url: string) => void;
  label?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ url, onChange, label = 'Image URL' }) => {
  const [error, setError] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="url"
        value={url}
        onChange={(e) => {
          onChange(e.target.value);
          setError(false);
        }}
        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
        placeholder="https://example.com/image.jpg"
      />

      {url && (
        <div className="mt-2 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
          {error ? (
            <div className="h-40 flex items-center justify-center text-gray-500 text-sm">
              <svg className="w-8 h-8 mr-2 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Failed to load image
            </div>
          ) : (
            <img
              src={url}
              alt="Preview"
              className="w-full h-40 object-cover"
              onError={() => setError(true)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ImagePreview;