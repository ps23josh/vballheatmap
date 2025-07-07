import React, { useCallback, useState } from 'react';
import { Upload, Camera, AlertCircle, CheckCircle, Edit, Image as ImageIcon } from 'lucide-react';
import { UploadProgress } from '../types';

interface ImageUploadProps {
  onImageSelect: (file: File, customPrompt?: string) => void;
  onImageAnnotate: (file: File) => void;
  onDefaultImageSelect: () => void;
  progress: UploadProgress;
  disabled?: boolean;
}

const DEFAULT_COURT_IMAGE_URL = '/volleyball-court-default.png';

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  onImageAnnotate,
  onDefaultImageSelect,
  progress,
  disabled = false
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showImageChoice, setShowImageChoice] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
      setShowOptions(true);
    }
  }, [disabled]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
      setShowOptions(true);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, []);

  const handleDirectAnalysis = useCallback(() => {
    if (selectedFile) {
      onImageSelect(selectedFile, customPrompt || undefined);
      setShowOptions(false);
      setSelectedFile(null);
    }
  }, [selectedFile, onImageSelect, customPrompt]);

  const handleAnnotateFirst = useCallback(() => {
    if (selectedFile) {
      onImageAnnotate(selectedFile);
      setShowOptions(false);
      setSelectedFile(null);
    }
  }, [selectedFile, onImageAnnotate]);

  const handleGetStarted = useCallback(() => {
    setShowImageChoice(true);
  }, []);

  const handleUseDefault = useCallback(() => {
    onDefaultImageSelect();
    setShowImageChoice(false);
  }, [onDefaultImageSelect]);

  const handleUploadOwn = useCallback(() => {
    setShowImageChoice(false);
    // Trigger file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg,image/png,image/webp';
    fileInput.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files[0]) {
        setSelectedFile(files[0]);
        setShowOptions(true);
      }
    };
    fileInput.click();
  }, []);

  const getProgressColor = () => {
    switch (progress.status) {
      case 'error': return 'bg-red-500';
      case 'complete': return 'bg-green-500';
      case 'analyzing': return 'bg-blue-500';
      default: return 'bg-indigo-500';
    }
  };

  const getStatusIcon = () => {
    switch (progress.status) {
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'complete': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <Camera className="w-5 h-5 text-gray-400" />;
    }
  };

  // Image choice modal
  if (showImageChoice) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Choose Your Volleyball Court Image
            </h3>
            <p className="text-gray-600">
              Select a default court image or upload your own for analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Default Image Option */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-indigo-300 transition-colors">
              <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <img
                  src={DEFAULT_COURT_IMAGE_URL}
                  alt="Default volleyball court"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load default image preview');
                    // Fallback to a placeholder SVG
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDQwMCAyMjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjI1IiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIxMjUiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+CjxsaW5lIHgxPSIyMDAiIHkxPSI1MCIgeDI9IjIwMCIgeTI9IjE3NSIgc3Ryb2tlPSIjNkI3MjgwIiBzdHJva2Utd2lkdGg9IjIiLz4KPHN2ZyB4PSIxNzUiIHk9IjEwMCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjI1Ij4KPHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCA1MCAyNSIgZmlsbD0ibm9uZSI+CjxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSIyNSIgZmlsbD0iIzM3NDE1MSIvPgo8dGV4dCB4PSIyNSIgeT0iMTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvdXJ0PC90ZXh0Pgo8L3N2Zz4KPHN2Zz4KPC9zdmc+';
                  }}
                  onLoad={() => {
                    console.log('Default image loaded successfully');
                  }}
                />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Use Default Court</h4>
              <p className="text-sm text-gray-600 mb-4">
                Professional volleyball court image ready for annotation and analysis
              </p>
              <button
                onClick={handleUseDefault}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <ImageIcon className="w-5 h-5" />
                <span>Use Default Image</span>
              </button>
            </div>

            {/* Upload Own Option */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors">
              <div className="aspect-video bg-gray-50 rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Your court image</p>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Upload Your Own</h4>
              <p className="text-sm text-gray-600 mb-4">
                Upload your own volleyball court image for personalized analysis
              </p>
              <button
                onClick={handleUploadOwn}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Image</span>
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => setShowImageChoice(false)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // File options modal
  if (showOptions && selectedFile) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Image Selected: {selectedFile.name}
            </h3>
            <p className="text-gray-600">
              Choose how you'd like to analyze this volleyball court image
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleAnnotateFirst}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Edit className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Annotate First (Recommended)</div>
                <div className="text-sm text-indigo-200">Mark successful/unsuccessful points on the court</div>
              </div>
            </button>

            <button
              onClick={handleDirectAnalysis}
              className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Camera className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Direct Analysis</div>
                <div className="text-sm text-gray-300">Analyze image without annotation</div>
              </div>
            </button>

            <button
              onClick={() => {
                setShowOptions(false);
                setSelectedFile(null);
              }}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${dragActive 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!disabled ? handleGetStarted : undefined}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          style={{ pointerEvents: 'none' }}
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-gray-100 rounded-full">
              <Upload className="w-8 h-8 text-gray-600" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Start Volleyball Court Analysis
            </h3>
            <p className="text-gray-600 mb-4">
              Choose a default volleyball court or upload your own image
            </p>
            <button
              onClick={handleGetStarted}
              disabled={disabled}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ImageIcon className="w-5 h-5" />
              <span>Get Started</span>
            </button>
          </div>

          <p className="text-sm text-gray-500">
            Or drag and drop your volleyball court image here
          </p>

          {progress.status !== 'idle' && (
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                {getStatusIcon()}
                <span className="text-sm font-medium text-gray-700">
                  {progress.message}
                </span>
              </div>
              
              {progress.status !== 'error' && progress.status !== 'complete' && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
                    style={{ width: `${progress.progress}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Custom Prompt Section */}
      <div className="mt-6 space-y-4">
        <button
          onClick={() => setShowCustomPrompt(!showCustomPrompt)}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          {showCustomPrompt ? 'Hide' : 'Show'} Custom Analysis Prompt
        </button>

        {showCustomPrompt && (
          <div className="space-y-2">
            <label htmlFor="custom-prompt" className="block text-sm font-medium text-gray-700">
              Custom Analysis Instructions
            </label>
            <textarea
              id="custom-prompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter specific instructions for the AI analysis (optional)..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              rows={3}
            />
            <p className="text-xs text-gray-500">
              Example: "Focus on defensive positioning and court coverage patterns"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
