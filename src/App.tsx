import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'offline';
  alertLevel: 'critical' | 'warning' | 'stable';
  lastEvent: string;
  timeAgo: string;
  videoUrl: string;
  thumbnail: string;
}

interface AIAnalysis {
  id: string;
  cameraId: string;
  event: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: number;
  timestamp: string;
  groqAnalysis: string;
  detections: any[];
  medicalEvents: any[];
}

function App() {
  const [cameras] = useState<Camera[]>([
    {
      id: 'cardiac_emergency',
      name: 'ICU Room 101',
      location: 'Intensive Care Unit',
      status: 'active',
      alertLevel: 'critical',
      lastEvent: 'Patient fall detected',
      timeAgo: '2 min ago',
      videoUrl: '/videos/vecteezy_asian-tan-man-feel-pain-heart-attack-while-exercise-in_49795837.mp4',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjMjc0ZTY5Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPklDVSBST09NIDEwMTwvdGV4dD4KPC9zdmc+'
    },
    {
      id: 'fall_incident',
      name: 'Cardiac Unit 203',
      location: 'Emergency Department',
      status: 'active',
      alertLevel: 'warning',
      lastEvent: 'Irregular breathing pattern',
      timeAgo: '8 min ago',
      videoUrl: '/videos/gettyimages-2203918378-640_adpp.mp4',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjZGMyNjM0Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNBUkRJQUMgVU5JVCAyMDM8L3RleHQ+Cjwvc3ZnPg=='
    },
    {
      id: 'neurology_ward',
      name: 'Neurology Ward 305',
      location: 'Neurological Care',
      status: 'active',
      alertLevel: 'critical',
      lastEvent: 'Seizure activity detected',
      timeAgo: '1 min ago',
      videoUrl: '/videos/vecteezy_asian-tan-man-feel-pain-heart-attack-while-exercise-in_49795837.mp4',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjODM2Z2Y5Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5FVVJPU1lXQVJEIDMwNTwvdGV4dD4KPC9zdmc+'
    },
    {
      id: 'recovery_room',
      name: 'Recovery Room 412',
      location: 'Post-Operative Care',
      status: 'active',
      alertLevel: 'stable',
      lastEvent: 'Stable vital signs',
      timeAgo: '15 min ago',
      videoUrl: '/videos/gettyimages-2203918378-640_adpp.mp4',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjMTZhODNhIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlJFQ09WRVJZIFJPT00gNDEyPC90ZXh0Pgo8L3N2Zz4='
    },
    {
      id: 'geriatric_care',
      name: 'Geriatric Care 501',
      location: 'Elderly Care Wing',
      status: 'offline',
      alertLevel: 'stable',
      lastEvent: 'System maintenance - offline',
      timeAgo: '1 hour ago',
      videoUrl: '/videos/vecteezy_asian-tan-man-feel-pain-heart-attack-while-exercise-in_49795837.mp4',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjNmM3NTdkIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkdFUklBVFJJQyBDQVJFIDUwMTwvdGV4dD4KPC9zdmc+'
    },
    {
      id: 'trauma_bay',
      name: 'Emergency Trauma Bay',
      location: 'Trauma Center',
      status: 'active',
      alertLevel: 'stable',
      lastEvent: 'Chest compression detected',
      timeAgo: '15 min ago',
      videoUrl: '/videos/gettyimages-2203918378-640_adpp.mp4',
      thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjZjU5MzM2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlRSQVVNQSBCT1k8L3RleHQ+Cjwvc3ZnPg=='
    }
  ]);

  const navigate = useNavigate();
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis[]>([]);
  const [backendStatus, setBackendStatus] = useState<string>('connecting');
  const [selectedCamera] = useState<string | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const [groqAnalysis, setGroqAnalysis] = useState<string>('Connecting to Groq LLM...');
  const [yoloDetections, setYoloDetections] = useState<any[]>([]);

  // Connect to backend Socket.IO
  useEffect(() => {
    const newSocket = io('http://localhost:5001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to backend');
      setBackendStatus('connected');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from backend');
      setBackendStatus('error');
    });

      // Listen for real-time medical events
    newSocket.on('medical_event', (data) => {
      console.log('Received medical event:', data);
      const newAnalysis: AIAnalysis = {
        id: Date.now().toString(),
        cameraId: data.source_id || 'unknown',
          event: data.event_description || 'Medical event detected',
        riskLevel: data.risk_level?.toUpperCase() || 'MEDIUM',
          confidence: data.confidence || 85,
        timestamp: 'Just now',
          groqAnalysis: data.groq_reasoning || data.reasoning || 'Analyzing with Groq LLM...',
        detections: data.detections || [],
        medicalEvents: data.medical_events || []
      };
      
      setAiAnalysis(prev => [newAnalysis, ...prev.slice(0, 9)]);
        setGroqAnalysis(data.groq_reasoning || data.reasoning || 'Real-time Groq analysis...');
      setYoloDetections(data.detections || []);
    });

    // Listen for YOLO detection updates
    newSocket.on('yolo_detection', (data) => {
      console.log('YOLO detection:', data);
      setYoloDetections(data.detections || []);
    });

    // Listen for Groq analysis updates
    newSocket.on('groq_analysis', (data) => {
      console.log('Groq analysis:', data);
      setGroqAnalysis(data.reasoning || 'Groq LLM analysis...');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Add video sources to backend
  useEffect(() => {
    if (socket && backendStatus === 'connected') {
      // Add the cardiac emergency video
      socket.emit('add_video', {
        source_id: 'cardiac_emergency',
        video_path: 'vecteezy_asian-tan-man-feel-pain-heart-attack-while-exercise-in_49795837.mp4'
      });

      // Add the fall incident video
      socket.emit('add_video', {
        source_id: 'fall_incident',
        video_path: 'gettyimages-2203918378-640_adpp.mp4'
      });

      console.log('Added video sources to backend');
    }
  }, [socket, backendStatus]);

  // Check backend health
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/health');
        if (response.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('error');
        }
      } catch (error) {
        setBackendStatus('error');
      }
    };

    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      case 'stable': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <span className="text-gray-600">localhost</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">System Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">2 Alerts</span>
            </div>
            <span className="text-sm text-gray-600">Active Cameras 5/6</span>
            <span className="text-sm text-gray-600">Events Today 3</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">VitalSense AI</h1>
                  <p className="text-gray-600">Emergency Medical Detection</p>
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mt-2">Camera Dashboard</h2>
              <p className="text-gray-600">Monitor live feeds for emergency medical events</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                backendStatus === 'connected' 
                  ? 'bg-green-100 text-green-800' 
                  : backendStatus === 'connecting'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {backendStatus === 'connected' ? 'AI Active' : 
                 backendStatus === 'connecting' ? 'Connecting...' : 'AI Offline'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Camera Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cameras.map((camera) => (
            <div 
              key={camera.id} 
              className={`bg-white rounded-lg shadow-lg overflow-hidden border-2 ${getAlertColor(camera.alertLevel)} cursor-pointer transition-all duration-200 hover:shadow-xl ${
                selectedCamera === camera.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => navigate(`/camera/${camera.id}`)}
            >
              {/* Video Thumbnail */}
              <div className="relative h-48 bg-gray-200">
                <img 
                  src={camera.thumbnail} 
                  alt={camera.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                  LIVE
                </div>
                <div className="absolute top-2 right-2">
                  {camera.status === 'active' ? (
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  ) : (
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  )}
                </div>
              </div>

              {/* Camera Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{camera.name}</h3>
                  <div className={`w-3 h-3 rounded-full ${getRiskColor(camera.alertLevel)}`}></div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{camera.location}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{camera.lastEvent}</p>
                  <p className="text-xs text-gray-500">{camera.timeAgo}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Real-time AI Analysis Panel */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">🤖 Real-time AI Analysis</h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">LIVE</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live AI Events */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Medical Events</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {aiAnalysis.length > 0 ? (
                  aiAnalysis.map((analysis) => (
                    <div key={analysis.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-red-400">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getRiskColor(analysis.riskLevel)}`}></div>
                          <span className="text-sm font-medium text-gray-900">{analysis.riskLevel}</span>
                        </div>
                        <span className="text-xs text-gray-500">{analysis.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{analysis.event}</p>
                      <p className="text-xs text-gray-500">Confidence: {analysis.confidence}%</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    <p>Waiting for real-time AI analysis...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Groq AI Analysis */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Groq LLM Analysis</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span className="text-sm font-medium text-blue-800">AI Reasoning</span>
                </div>
                <p className="text-sm text-blue-700">
                  {groqAnalysis}
                </p>
                <div className="mt-3 text-xs text-blue-600">
                  Model: meta-llama/llama-4-scout-17b-16e-instruct
                </div>
              </div>

              {/* YOLO Detections */}
              <div className="mt-4 bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-green-800">YOLOv8 Detections</span>
                </div>
                <div className="space-y-2">
                  {yoloDetections.length > 0 ? (
                    yoloDetections.map((detection, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-green-700">{detection.class}</span>
                        <span className="text-green-600">{Math.round(detection.confidence * 100)}%</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-green-600">Waiting for YOLO detections...</p>
                  )}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-600">AI Processing Speed</p>
                  <p className="text-lg font-semibold text-green-800">2.3ms</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-600">Detection Accuracy</p>
                  <p className="text-lg font-semibold text-blue-800">94.2%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;