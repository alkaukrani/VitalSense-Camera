import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Camera, Mic, Activity, Brain, Heart, Zap, User, FileText, RefreshCw, AlertTriangle, Clock, TrendingUp, Play, Pause, Volume2 } from 'lucide-react';
import { Camera as CameraType } from '../types/camera';
import VideoPlayer from './VideoPlayer';
import AlertPanel from './AlertPanel';
import StatsPanel from './StatsPanel';
import { io, Socket } from 'socket.io-client';

const mockCameras: CameraType[] = [
  {
    id: 'cardiac_emergency',
    name: 'Cardiac Emergency Room',
    location: 'Emergency Department',
    status: 'active',
    alertLevel: 'critical',
    lastEvent: 'Cardiac event detected - monitoring in progress',
    videoUrl: '/videos/vecteezy_asian-tan-man-feel-pain-heart-attack-while-exercise-in_49795837.mp4'
  },
  {
    id: 'fall_incident',
    name: 'Fall Detection Ward',
    location: 'Geriatric Care Unit',
    status: 'active',
    alertLevel: 'critical',
    lastEvent: 'Fall incident detected - immediate response required',
    videoUrl: '/videos/gettyimages-2203918378-640_adpp.mp4'
  }
];

interface MedicalEvent {
  source_id: string;
  timestamp: number;
  detections: any[];
  medical_events: any[];
  reasoning: string;
  risk_level: string;
}

const MedicalAIAgent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [camera, setCamera] = useState<CameraType | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [aiProcessingSpeed, setAiProcessingSpeed] = useState(2.3);
  const [detectionAccuracy, setDetectionAccuracy] = useState(94.2);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [backendConnected, setBackendConnected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const foundCamera = mockCameras.find(c => c.id === id);
    setCamera(foundCamera || null);
  }, [id]);

  // Connect to Python backend
  useEffect(() => {
            const newSocket = io('http://localhost:5001');
    
    newSocket.on('connect', () => {
      console.log('Connected to Python backend');
      setBackendConnected(true);
    });
    
    newSocket.on('disconnect', () => {
      console.log('Disconnected from Python backend');
      setBackendConnected(false);
    });
    
    newSocket.on('medical_event', (event: MedicalEvent) => {
      console.log('Received medical event:', event);
      
      // Convert backend event to frontend format
      const analysis = event.medical_events.map((medicalEvent, index) => ({
        id: index + 1,
        type: 'alert',
        severity: medicalEvent.severity,
        message: medicalEvent.description,
        time: 'Just now',
        confidence: medicalEvent.confidence * 100,
        priority: medicalEvent.severity.toUpperCase(),
        reasoning: event.reasoning,
        details: medicalEvent.details
      }));
      
      setCurrentAnalysis(analysis);
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.close();
    };
  }, []);

  // Simulate real-time AI processing speed updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAiProcessingSpeed(prev => prev + (Math.random() - 0.5) * 0.2);
      setDetectionAccuracy(prev => Math.max(90, Math.min(99, prev + (Math.random() - 0.5) * 0.5)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
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
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                backendConnected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {backendConnected ? 'AI Active' : 'AI Offline'}
              </div>
              
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

            {/* Video Player */}
            <div className="flex-1 bg-gray-800 rounded-lg relative mr-4">
              <VideoPlayer 
                videoRef={videoRef}
                videoUrl={camera.videoUrl}
                isPlaying={isPlaying}
                onTimeUpdate={handleVideoTimeUpdate}
                onTogglePlayPause={togglePlayPause}
              />
            </div>
          </div>

          {/* Right Sidebar - Live Real-time AI Analysis Only */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            {/* Real-time AI Analysis */}
            <div className="flex-1 p-6 overflow-y-auto">
              <AlertPanel analysis={currentAnalysis} />
            </div>

            {/* Stats Panel */}
            <div className="p-6 border-t border-gray-200">
              <StatsPanel 
                processingSpeed={aiProcessingSpeed}
                detectionAccuracy={detectionAccuracy}
                currentTime={currentTime}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalAIAgent; 