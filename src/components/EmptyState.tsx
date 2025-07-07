import React from 'react';
import { FileImage, Edit, Brain, ImageIcon } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <div className="flex justify-center space-x-4 mb-6">
            <div className="p-3 bg-indigo-100 rounded-full">
              <ImageIcon className="w-8 h-8 text-indigo-600" />
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Edit className="w-8 h-8 text-green-600" />
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Ready to Analyze Volleyball Performance
          </h3>
          <p className="text-gray-600 mb-6">
            Choose a default volleyball court image or upload your own to get started. 
            You can annotate the court with successful/unsuccessful points or analyze directly.
          </p>
        </div>

        <div className="space-y-4 text-left">
          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <div>
              <h4 className="font-medium text-gray-900">Choose Image</h4>
              <p className="text-sm text-gray-600">Select default volleyball court or upload your own</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <div>
              <h4 className="font-medium text-gray-900">Annotate (Recommended)</h4>
              <p className="text-sm text-gray-600">Mark successful (O) and unsuccessful (X) points on the court</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <div>
              <h4 className="font-medium text-gray-900">Get AI Analysis</h4>
              <p className="text-sm text-gray-600">Receive detailed coaching insights and gameplay feedback</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
