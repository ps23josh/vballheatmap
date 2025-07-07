export interface AnalysisResult {
  id: string;
  timestamp: Date;
  imageUrl: string;
  fileName: string;
  analysis: string;
  confidence?: number;
  tags?: string[];
}

export interface UploadProgress {
  progress: number;
  status: 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';
  message?: string;
}

export class ApiError extends Error {
  code?: string;
  details?: string;

  constructor(message: string, code?: string, details?: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}
