import React, { useState } from 'react';
import { Brain, Phone, AlertTriangle, CheckCircle, Clock, User, Activity } from 'lucide-react';
import { Camera } from '../types/camera';

interface AIPanelProps {
  camera: Camera;
}

const mockEvents = [
  {
    id: '1',
    timestamp: '14:32:15',
    type: 'fall',
    confidence: 0.94,
    description: 'Critical fall event - patient collapsed near bed',
    action: 'Emergency medical team alerted'
  },
  {
    id: '2',
    timestamp: '14:25:08',
    type: 'breathing_abnormal',
    confidence: 0.87,
    description: 'Abnormal breathing pattern - possible respiratory distress',
    action: 'Respiratory therapist notified'
  },
  {
    id: '3',
    timestamp: '14:18:45',
    type: 'seizure',
    confidence: 0.91,
    description: 'Seizure activity detected - tonic-clonic movements',
    action: 'Neurologist and nursing staff alerted'
  }
];

const mockReasoning = {
  analysis: "Critical medical emergency detected: Patient experienced a sudden fall with high impact force. Analysis indicates potential loss of consciousness prior to fall. Vital sign monitoring shows irregular patterns. Immediate medical intervention required to assess for head trauma, fractures, and underlying cardiac events.",
  riskFactors: [
    "Patient age: 78 years - high fall risk demographic",
    "Recent cardiac procedure - 2 days post-surgery",
    "History of arrhythmia and syncope episodes",
    "Medication regimen includes blood thinners",
    "No medical staff present during incident"
  ],
  recommendations: [
    "Immediate trauma assessment - check for head injury",
    "Cardiac monitoring - assess for arrhythmia or MI",
    "Neurological evaluation for loss of consciousness",
    "CT scan recommended to rule out intracranial bleeding",
    "Increase patient monitoring to 1:1 supervision"
  ]
};

const AIPanel: React.FC<AIPanelProps> = ({ camera }) => {
  const [isCallActive, setIsCallActive] = useState(false);

  const handleEmergencyCall = () => {
    setIsCallActive(true);
    // Simulate call duration
    setTimeout(() => setIsCallActive(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* AI Reasoning Panel */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Analysis</h3>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Current Assessment</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {mockReasoning.analysis}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Risk Factors</h4>
            <ul className="space-y-1">
              {mockReasoning.riskFactors.map((factor, index) => (
                <li key={index} className="flex items-center text-sm text-gray-700">
                  <AlertTriangle className="w-3 h-3 text-yellow-500 mr-2 flex-shrink-0" />
                  {factor}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
            <ul className="space-y-1">
              {mockReasoning.recommendations.map((rec, index) => (
                <li key={index} className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Emergency Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Actions</h3>
        
        <div className="space-y-3">
          <button
            onClick={handleEmergencyCall}
            disabled={isCallActive}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
              isCallActive
                ? 'bg-green-600 text-white'
                : camera.alertLevel === 'high'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>
              {isCallActive ? 'Calling Emergency...' : 'Call Emergency'}
            </span>
          </button>

          <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <User className="w-4 h-4" />
            <span>Alert Staff</span>
          </button>

          <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <Activity className="w-4 h-4" />
            <span>View Vitals</span>
          </button>
        </div>
      </div>

      {/* Event Log */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
        
        <div className="space-y-3">
          {mockEvents.map((event) => (
            <div key={event.id} className="border-l-4 border-gray-200 pl-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-sm font-mono text-gray-600">{event.timestamp}</span>
                </div>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {Math.round(event.confidence * 100)}%
                </span>
              </div>
              <p className="text-sm text-gray-900 mb-1">{event.description}</p>
              <p className="text-xs text-gray-500">{event.action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIPanel;