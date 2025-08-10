import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, AlertTriangle } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">VitalSense AI</h1>
              <p className="text-sm text-gray-500">Emergency Medical Detection</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">System Active</span>
            </div>
            
            <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 rounded-full">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">2 Alerts</span>
            </div>
            
            <div className="bg-gray-100 px-3 py-1 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Active Cameras 5/6</span>
            </div>
            
            <div className="bg-gray-100 px-3 py-1 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Events Today 3</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;