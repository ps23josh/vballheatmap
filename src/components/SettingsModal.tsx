import React, { useState, useEffect } from 'react';
import { X, Key, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidKey, setIsValidKey] = useState(false);

  useEffect(() => {
    const currentKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (currentKey && currentKey !== 'your_gemini_api_key_here') {
      setApiKey(currentKey);
      setIsValidKey(true);
    }
  }, []);

  const validateApiKey = (key: string) => {
    // Basic validation - Gemini API keys typically start with 'AIza'
    return key.length > 20 && key.startsWith('AIza');
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    setIsValidKey(validateApiKey(value));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* API Key Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Key className="w-5 h-5 text-gray-600" />
              <h3 className="font-medium text-gray-900">Gemini API Key</h3>
            </div>

            <div className="space-y-2">
              <label htmlFor="api-key" className="block text-sm text-gray-700">
                API Key
              </label>
              <div className="relative">
                <input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="Enter your Gemini API key"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {apiKey && (
                    isValidKey ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )
                  )}
                </div>
              </div>
              
              {apiKey && !isValidKey && (
                <p className="text-sm text-red-600">
                  Invalid API key format. Please check your key.
                </p>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">How to get your API key:</h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Visit Google AI Studio</li>
                <li>Sign in with your Google account</li>
                <li>Create a new API key</li>
                <li>Copy and paste it above</li>
              </ol>
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 mt-2 text-sm font-medium"
              >
                <span>Get API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Important:</p>
                  <p>
                    Your API key is stored locally in your browser and never sent to our servers. 
                    Keep it secure and don't share it with others.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rate Limiting Info */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Rate Limiting</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Free tier: 15 requests per minute</p>
              <p>• Paid tier: Higher limits available</p>
              <p>• Large images are automatically compressed</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
