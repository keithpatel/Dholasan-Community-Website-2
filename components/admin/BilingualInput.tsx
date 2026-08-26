
import React, { useState } from 'react';
import { TranslatableString } from '../../types';

interface BilingualInputProps {
  label: string;
  value: TranslatableString;
  onChange: (value: TranslatableString) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
}

const BilingualInput: React.FC<BilingualInputProps> = ({ label, value, onChange, multiline = false, rows = 3, placeholder }) => {
  const [activeTab, setActiveTab] = useState<'en' | 'gu'>('en');

  const handleChange = (text: string) => {
    onChange({ ...value, [activeTab]: text });
  };

  const inputClasses = "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all";

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-1 mb-2">
        <button
          type="button"
          onClick={() => setActiveTab('en')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
            activeTab === 'en'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-500 hover:text-gray-800'
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('gu')}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
            activeTab === 'gu'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-500 hover:text-gray-800'
          }`}
        >
          ગુજરાતી
        </button>
      </div>
      {multiline ? (
        <textarea
          value={value[activeTab]}
          onChange={(e) => handleChange(e.target.value)}
          rows={rows}
          className={inputClasses}
          placeholder={placeholder || `Enter ${activeTab === 'en' ? 'English' : 'Gujarati'} text...`}
        />
      ) : (
        <input
          type="text"
          value={value[activeTab]}
          onChange={(e) => handleChange(e.target.value)}
          className={inputClasses}
          placeholder={placeholder || `Enter ${activeTab === 'en' ? 'English' : 'Gujarati'} text...`}
        />
      )}
      {/* Show preview of the other language */}
      {value[activeTab === 'en' ? 'gu' : 'en'] && (
        <p className="text-xs text-gray-500 mt-1 truncate">
          {activeTab === 'en' ? 'ગુજરાતી' : 'English'}: {value[activeTab === 'en' ? 'gu' : 'en']}
        </p>
      )}
    </div>
  );
};

export default BilingualInput;
