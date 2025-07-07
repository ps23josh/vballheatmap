import { useState, useCallback } from 'react';
import { AnalysisResult, UploadProgress, ApiError } from '../types';
import { validateImageFile, compressImage, convertToBase64 } from '../utils/imageUtils';
import { analyzeImageWithGemini } from '../services/geminiApi';

export const useImageAnalysis = () => {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [progress, setProgress] = useState<UploadProgress>({
    progress: 0,
    status: 'idle'
  });
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = useCallback(async (file: File, customPrompt?: string) => {
    setError(null);
    setProgress({ progress: 0, status: 'uploading', message: 'Validating file...' });

    try {
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid file');
      }

      setProgress({ progress: 20, status: 'uploading', message: 'Compressing image...' });

      // Compress image if needed - with proper error handling
      let compressedFile: File;
      try {
        compressedFile = file.size > 2 * 1024 * 1024 
          ? await compressImage(file) 
          : file;
      } catch (compressionError) {
        console.warn('Image compression failed, using original file:', compressionError);
        compressedFile = file;
      }

      setProgress({ progress: 40, status: 'uploading', message: 'Converting to base64...' });

      // Convert to base64 with error handling
      let base64Image: string;
      try {
        base64Image = await convertToBase64(compressedFile);
      } catch (conversionError) {
        console.error('Base64 conversion failed:', conversionError);
        throw new Error('Failed to process image. Please try with a different image.');
      }

      setProgress({ progress: 60, status: 'analyzing', message: 'Analyzing with Gemini AI...' });

      // Analyze with Gemini - with enhanced error handling
      let analysis: string;
      try {
        analysis = await analyzeImageWithGemini(base64Image, compressedFile.type, customPrompt);
      } catch (apiError) {
        console.error('Gemini API call failed:', apiError);
        
        if (apiError instanceof ApiError) {
          // Re-throw API errors with their specific messages
          throw apiError;
        } else {
          // Handle unexpected errors
          throw new Error('Failed to analyze image with AI. Please try again.');
        }
      }

      setProgress({ progress: 90, status: 'analyzing', message: 'Processing results...' });

      // Create result
      const result: AnalysisResult = {
        id: Date.now().toString(),
        timestamp: new Date(),
        imageUrl: URL.createObjectURL(file),
        fileName: file.name,
        analysis,
        confidence: Math.random() * 0.2 + 0.8, // Simulated confidence score
        tags: extractTags(analysis)
      };

      setResults(prev => [result, ...prev]);
      setProgress({ progress: 100, status: 'complete', message: 'Analysis complete!' });

      // Reset progress after a delay
      setTimeout(() => {
        setProgress({ progress: 0, status: 'idle' });
      }, 2000);

      return result;
    } catch (err) {
      console.error('Analysis error:', err);
      let errorMessage = 'An unexpected error occurred';
      
      if (err instanceof ApiError) {
        errorMessage = err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setProgress({ progress: 0, status: 'error', message: errorMessage });
      
      return null;
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  const removeResult = useCallback((id: string) => {
    setResults(prev => prev.filter(result => result.id !== id));
  }, []);

  return {
    results,
    progress,
    error,
    analyzeImage,
    clearResults,
    removeResult
  };
};

// Helper function to extract tags from analysis text
const extractTags = (analysis: string): string[] => {
  const commonTags = [
    'portrait', 'landscape', 'nature', 'urban', 'indoor', 'outdoor',
    'people', 'animals', 'architecture', 'food', 'technology', 'art',
    'colorful', 'monochrome', 'bright', 'dark', 'vintage', 'modern'
  ];

  const lowerAnalysis = analysis.toLowerCase();
  return commonTags.filter(tag => lowerAnalysis.includes(tag)).slice(0, 5);
};
