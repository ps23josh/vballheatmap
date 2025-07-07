import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';
import { validateImageFile } from '../utils/imageUtils';
import { generateVolleyballCourt } from '../utils/courtGenerator';

interface ImageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (file: File) => void;
}

export const ImageSelectionModal: React.FC<ImageSelectionModalProps> = ({
  isOpen,
  onClose,
  onImageSelect,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingCourt, setIsGeneratingCourt] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError(null);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setError(null);
    onImageSelect(file);
    onClose();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDefaultImageSelect = async () => {
    setIsGeneratingCourt(true);
    setError(null);

    try {
      const courtFile = await generateVolleyballCourt();
      onImageSelect(courtFile);
      onClose();
    } catch (error) {
      console.error('Error generating volleyball court:', error);
      setError('Failed to generate volleyball court. Please try uploading your own image.');
    } finally {
      setIsGeneratingCourt(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Select Volleyball Court Image</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Default Image Option */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Use Generated Court</h3>
            <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Standard Volleyball Court</p>
                  <p className="text-sm text-gray-600">Programmatically generated court with official dimensions</p>
                </div>
                <button
                  onClick={handleDefaultImageSelect}
                  disabled={isGeneratingCourt}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isGeneratingCourt ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <span>Generate</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Upload Section */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Upload Your Own Image</h3>
            
            {/* Drag and Drop Area */}
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-600" />
                </div>
                
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop your image here, or click to browse
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Supports JPEG, PNG, WebP up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Tips for best results:</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Use the generated court for quick analysis and testing</li>
              <li>For real analysis, use clear overhead views of actual courts</li>
              <li>Ensure good lighting and minimal shadows</li>
              <li>Higher resolution images provide better analysis</li>
              <li>Court lines should be clearly visible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
