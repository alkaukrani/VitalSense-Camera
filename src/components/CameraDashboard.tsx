import React, { useEffect, useState } from 'react';
import CameraTile from './CameraTile';
import { Camera } from '../types/camera';

const mockCameras: Camera[] = [
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

const CameraDashboard: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>(mockCameras);
  const [backendStatus, setBackendStatus] = useState<string>('connecting');

  useEffect(() => {
    // Check backend health
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
        console.error('Backend connection failed:', error);
      }
    };

    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Emergency Medical Detection</h2>
          <p className="text-gray-600 mt-1">Real-time monitoring of medical emergency videos</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cameras.map((camera) => (
          <CameraTile key={camera.id} camera={camera} />
        ))}
      </div>
    </div>
  );
};

export default CameraDashboard;