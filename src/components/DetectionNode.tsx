import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface DetectionNodeProps {
  icon: React.ReactNode;
  title: string;
  status: 'active' | 'inactive' | 'error';
  confidence: number;
}

const DetectionNode: React.FC<DetectionNodeProps> = ({
  icon,
  title,
  status,
  confidence
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'inactive': return 'text-gray-400';
      case 'error': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 90) return 'text-green-600';
    if (conf >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
      <div className="flex items-center justify-center w-8 h-8">
        {icon}
      </div>
      
      <div className="flex-1 text-left">
        <div className="flex items-center justify-between">
          <span className="text-gray-900 font-medium text-sm">{title}</span>
          <div className="flex items-center space-x-2">
            {status === 'active' ? (
              <CheckCircle className={`w-4 h-4 ${getStatusColor()}`} />
            ) : (
              <AlertCircle className={`w-4 h-4 ${getStatusColor()}`} />
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Active</span>
          </div>
          <span className={`text-xs font-medium ${getConfidenceColor(confidence)}`}>
            {confidence}%
          </span>
        </div>
      </div>
    </button>
  );
};

export default DetectionNode; 