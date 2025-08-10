import React from 'react';
import { Activity, Target, Clock } from 'lucide-react';

interface StatsPanelProps {
  processingSpeed: number;
  detectionAccuracy: number;
  currentTime: number;
}

const StatsPanel: React.FC<StatsPanelProps> = ({
  processingSpeed,
  detectionAccuracy,
  currentTime
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide mb-4">System Stats</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600">AI Processing Speed</span>
          </div>
          <span className="text-sm font-medium text-gray-900">{processingSpeed.toFixed(1)}ms</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600">Detection Accuracy</span>
          </div>
          <span className="text-sm font-medium text-gray-900">{detectionAccuracy.toFixed(1)}%</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-gray-600">Video Time</span>
          </div>
          <span className="text-sm font-medium text-gray-900">{formatTime(currentTime)}</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">System Status</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 font-medium">Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel; 