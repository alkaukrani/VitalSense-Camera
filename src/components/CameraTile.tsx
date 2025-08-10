import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, AlertCircle, CheckCircle, XCircle, MapPin } from 'lucide-react';
import { Camera as CameraType } from '../types/camera';

interface CameraTileProps {
  camera: CameraType;
}

const CameraTile: React.FC<CameraTileProps> = ({ camera }) => {
  const getStatusIcon = () => {
    switch (camera.status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'maintenance':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getBorderColor = () => {
    switch (camera.alertLevel) {
      case 'high':
        return 'border-red-500';
      case 'medium':
        return 'border-yellow-500';
      default:
        return 'border-gray-200';
    }
  };

  return (
    <Link to={`/camera/${camera.id}`}>
      <div className={`relative bg-white rounded-lg shadow-md border-2 hover:shadow-lg transition-all duration-200 overflow-hidden ${getBorderColor()}`}>
        <div className="aspect-video bg-gray-900 relative">
          <video
            src={camera.videoUrl}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          
          <div className="absolute bottom-2 left-2 flex items-center space-x-2">
            <Camera className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-medium">LIVE</span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{camera.name}</h3>
            {getStatusIcon()}
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-3 h-3 mr-1" />
            {camera.location}
          </div>
          
          <div className="text-sm text-gray-500">
            {camera.lastEvent}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CameraTile;