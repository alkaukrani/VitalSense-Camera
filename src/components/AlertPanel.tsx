import React from 'react';
import { AlertTriangle, Clock, TrendingUp } from 'lucide-react';

interface Alert {
  id: number;
  type: string;
  severity: string;
  message: string;
  time: string;
  confidence: number;
  priority: string;
}

interface AlertPanelProps {
  analysis: Alert[];
}

const AlertPanel: React.FC<AlertPanelProps> = ({ analysis }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityTextColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700';
      case 'high': return 'text-orange-700';
      case 'medium': return 'text-yellow-700';
      case 'low': return 'text-blue-700';
      default: return 'text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Real-time AI Analysis</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 font-medium">LIVE</span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {analysis.map((alert) => (
          <div key={alert.id} className="bg-gray-50 rounded-lg p-3 border-l-4 border-l-red-500">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${getSeverityColor(alert.severity)}`}></div>
                <span className={`text-sm font-medium ${getSeverityTextColor(alert.severity)}`}>
                  {alert.severity.toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                  {alert.priority}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{alert.time}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-900 mb-2">{alert.message}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">
                  Confidence: {alert.confidence}%
                </span>
              </div>
              {alert.severity === 'critical' && (
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3 text-red-600" />
                  <span className="text-xs text-red-600 font-medium">URGENT</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertPanel; 