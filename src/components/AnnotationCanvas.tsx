import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Circle, X, Undo, RotateCcw, Download, Send } from 'lucide-react';

interface Point {
  x: number;
  y: number;
  type: 'success' | 'failure';
  id: string;
}

interface AnnotationCanvasProps {
  imageFile: File;
  onSubmitAnnotation: (annotatedImageBlob: Blob) => void;
  onCancel: () => void;
}

export const AnnotationCanvas: React.FC<AnnotationCanvasProps> = ({
  imageFile,
  onSubmitAnnotation,
  onCancel
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [currentTool, setCurrentTool] = useState<'success' | 'failure'>('success');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  // Load and draw image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    imageRef.current = img;

    img.onload = () => {
      // Calculate canvas size maintaining aspect ratio
      const maxWidth = 800;
      const maxHeight = 600;
      
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;
      setCanvasSize({ width, height });

      // Draw image
      ctx.drawImage(img, 0, 0, width, height);
      setImageLoaded(true);
    };

    img.src = URL.createObjectURL(imageFile);

    return () => {
      URL.revokeObjectURL(img.src);
    };
  }, [imageFile]);

  // Redraw canvas with points
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and redraw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw points
    points.forEach(point => {
      ctx.save();
      
      // Set style based on point type
      if (point.type === 'success') {
        ctx.strokeStyle = '#10B981'; // Green
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = '#EF4444'; // Red
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.lineWidth = 3;
      }

      // Draw circle
      ctx.beginPath();
      ctx.arc(point.x, point.y, 15, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Draw symbol
      ctx.fillStyle = point.type === 'success' ? '#10B981' : '#EF4444';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(point.type === 'success' ? 'O' : 'X', point.x, point.y);

      ctx.restore();
    });
  }, [points]);

  // Redraw when points change
  useEffect(() => {
    if (imageLoaded) {
      redrawCanvas();
    }
  }, [points, imageLoaded, redrawCanvas]);

  // Handle canvas click
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on existing point to remove it
    const clickedPointIndex = points.findIndex(point => {
      const distance = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2);
      return distance <= 15;
    });

    if (clickedPointIndex !== -1) {
      // Remove clicked point
      setPoints(prev => prev.filter((_, index) => index !== clickedPointIndex));
    } else {
      // Add new point
      const newPoint: Point = {
        x,
        y,
        type: currentTool,
        id: Date.now().toString()
      };
      setPoints(prev => [...prev, newPoint]);
    }
  }, [points, currentTool]);

  // Clear all points
  const clearPoints = useCallback(() => {
    setPoints([]);
  }, []);

  // Undo last point
  const undoLastPoint = useCallback(() => {
    setPoints(prev => prev.slice(0, -1));
  }, []);

  // Generate annotated image and submit
  const handleSubmit = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        onSubmitAnnotation(blob);
      }
    }, 'image/png');
  }, [onSubmitAnnotation]);

  // Download annotated image
  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `annotated-${imageFile.name}`;
    link.href = canvas.toDataURL();
    link.click();
  }, [imageFile.name]);

  const successCount = points.filter(p => p.type === 'success').length;
  const failureCount = points.filter(p => p.type === 'failure').length;
  const totalPoints = successCount + failureCount;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Annotate Volleyball Court
        </h2>
        <p className="text-gray-600">
          Mark successful points with <span className="text-green-600 font-semibold">O</span> and 
          unsuccessful points with <span className="text-red-600 font-semibold">X</span>. 
          Click on existing marks to remove them.
        </p>
      </div>

      {/* Tools */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Tool:</span>
          <button
            onClick={() => setCurrentTool('success')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
              currentTool === 'success'
                ? 'bg-green-100 border-green-300 text-green-800'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Circle className="w-4 h-4" />
            <span>Success (O)</span>
          </button>
          <button
            onClick={() => setCurrentTool('failure')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
              currentTool === 'failure'
                ? 'bg-red-100 border-red-300 text-red-800'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <X className="w-4 h-4" />
            <span>Failure (X)</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={undoLastPoint}
            disabled={points.length === 0}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Undo className="w-4 h-4" />
            <span>Undo</span>
          </button>
          <button
            onClick={clearPoints}
            disabled={points.length === 0}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      {totalPoints > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-green-600 font-medium">
                Successful: {successCount}
              </span>
              <span className="text-red-600 font-medium">
                Unsuccessful: {failureCount}
              </span>
              <span className="text-gray-600">
                Total: {totalPoints}
              </span>
            </div>
            <div className="text-gray-600">
              Success Rate: {totalPoints > 0 ? ((successCount / totalPoints) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="mb-6 flex justify-center">
        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="cursor-crosshair"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownload}
            disabled={points.length === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={points.length === 0}
            className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Analyze with AI</span>
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Instructions:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click on the court to mark successful (O) or unsuccessful (X) points</li>
          <li>• Switch between tools using the buttons above</li>
          <li>• Click on existing marks to remove them</li>
          <li>• Use Undo to remove the last mark or Clear All to start over</li>
          <li>• Click "Analyze with AI" when you're done to get coaching insights</li>
        </ul>
      </div>
    </div>
  );
};
