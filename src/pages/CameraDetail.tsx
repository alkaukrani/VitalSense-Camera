import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Camera, Mic, Activity, Brain, Heart, Zap, User, FileText, RefreshCw, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { Camera as CameraType } from '../types/camera';

const mockCameras: CameraType[] = [
  {
    id: '1',
    name: 'ICU Room 101',
    location: 'Intensive Care Unit',
    status: 'active',
    alertLevel: 'high',
    lastEvent: 'Patient fall detected - 2 min ago',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: '2',
    name: 'Cardiac Unit 203',
    location: 'Emergency Department',
    status: 'active',
    alertLevel: 'medium',
    lastEvent: 'Irregular breathing pattern - 8 min ago',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
  },
  {
    id: '3',
    name: 'Neurology Ward 305',
    location: 'Neurological Care',
    status: 'active',
    alertLevel: 'high',
    lastEvent: 'Seizure activity detected - 1 min ago',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  }
];

// Mock real-time AI analysis data
const aiAnalysisData = {
  '1': [
    { type: 'alert', severity: 'high', message: 'Patient attempting to get up from bed', time: '2 seconds ago', confidence: 94 },
    { type: 'warning', severity: 'medium', message: 'Irregular movement pattern detected', time: '5 seconds ago', confidence: 87 },
    { type: 'info', severity: 'low', message: 'Patient showing signs of restlessness', time: '10 seconds ago', confidence: 76 }
  ],
  '2': [
    { type: 'alert', severity: 'high', message: 'Patient having difficulty breathing', time: '1 second ago', confidence: 96 },
    { type: 'warning', severity: 'medium', message: 'Rapid breathing pattern detected', time: '3 seconds ago', confidence: 89 },
    { type: 'info', severity: 'low', message: 'Oxygen levels fluctuating', time: '8 seconds ago', confidence: 82 }
  ],
  '3': [
    { type: 'alert', severity: 'critical', message: 'Patient fall detected!', time: 'Just now', confidence: 98 },
    { type: 'alert', severity: 'high', message: 'Sudden movement detected', time: '2 seconds ago', confidence: 92 },
    { type: 'warning', severity: 'medium', message: 'Unusual positioning detected', time: '5 seconds ago', confidence: 85 }
  ]
};

const CameraDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [camera, setCamera] = useState<CameraType | null>(null);
  const [showVideoAnalysis, setShowVideoAnalysis] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<any[]>([]);

  useEffect(() => {
    const foundCamera = mockCameras.find(c => c.id === id);
    setCamera(foundCamera || null);
    if (foundCamera && aiAnalysisData[foundCamera.id as keyof typeof aiAnalysisData]) {
      setCurrentAnalysis(aiAnalysisData[foundCamera.id as keyof typeof aiAnalysisData]);
    }
  }, [id]);

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

  if (!camera) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Camera Not Found</h2>
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-16 bg-gray-800 flex flex-col items-center py-4">
        {/* Navigation icons would go here */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg">
                <ArrowLeft className="w-4 h-4 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-2">
                <Activity className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Medical AI Agent</h1>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                Life-Saving Camera System
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 flex items-center space-x-2">
                <Mic className="w-4 h-4" />
                <span>Voice Command</span>
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>Live AI Monitoring</span>
              </button>
            </div>
          </div>
          
          <div className="mt-3 text-sm text-gray-600 flex items-center space-x-2">
            <span>To exit full screen, press</span>
            <RefreshCw className="w-4 h-4" />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Center Column */}
          <div className="flex-1 flex flex-col p-6">
            {/* Patient Context */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Context</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Name</label>
                  <div className="text-gray-900 font-medium">-</div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Age</label>
                  <div className="text-gray-900 font-medium">-</div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Room</label>
                  <div className="text-gray-900 font-medium">-</div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Conditions</label>
                  <div className="text-gray-900 font-medium">-</div>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm text-gray-600">Risk Level</label>
                <div className="text-gray-900 font-medium">-</div>
              </div>
            </div>

            {/* Main Display with Video Analysis */}
            <div className="flex-1 flex">
              {/* Video Area */}
              <div className="flex-1 bg-gray-800 rounded-lg relative mr-4">
                <div 
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  onClick={() => setShowVideoAnalysis(!showVideoAnalysis)}
                >
                  <div className="text-center">
                    <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                      <FileText className="w-8 h-8 text-gray-600" />
                    </button>
                    <div className="mt-2 text-white text-sm">Click to view AI analysis</div>
                  </div>
                </div>
                
                {/* Detection Overlay */}
                <div className="absolute bottom-4 left-4">
                  <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
                    person (95%)
                  </div>
                </div>
              </div>

              {/* Real-time AI Analysis Panel */}
              {showVideoAnalysis && (
                <div className="w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Real-time AI Analysis</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-600 font-medium">LIVE</span>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {currentAnalysis.map((analysis, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 border-l-4 border-l-red-500">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getSeverityColor(analysis.severity)}`}></div>
                            <span className={`text-sm font-medium ${getSeverityTextColor(analysis.severity)}`}>
                              {analysis.severity.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{analysis.time}</span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-900 mb-2">{analysis.message}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3 text-blue-600" />
                            <span className="text-xs text-blue-600 font-medium">
                              Confidence: {analysis.confidence}%
                            </span>
                          </div>
                          {analysis.severity === 'critical' && (
                            <div className="flex items-center space-x-1">
                              <AlertTriangle className="w-3 h-3 text-red-600" />
                              <span className="text-xs text-red-600 font-medium">URGENT</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>AI Processing Speed</span>
                      <span className="font-medium">2.3ms</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Detection Accuracy</span>
                      <span className="font-medium">94.2%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Medical AI Nodes */}
          <div className="w-80 bg-white border-l border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Medical AI Nodes</h2>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Detection</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <span className="text-gray-900 font-medium">Fall Detection</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <Heart className="w-5 h-5 text-red-600" />
                  <span className="text-gray-900 font-medium">Cardiac Event Detection</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <Activity className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-900 font-medium">Seizure Detection</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-900 font-medium">Behavioral Crisis</span>
                </button>
              </div>

              <div className="pt-6">
                <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">Reasoning</h3>
                <div className="space-y-3 mt-3">
                  <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <Brain className="w-5 h-5 text-indigo-600" />
                    <span className="text-gray-900 font-medium">Medical AI Reasoning</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <FileText className="w-5 h-5 text-green-600" />
                    <span className="text-gray-900 font-medium">Risk Assessment</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraDetail;