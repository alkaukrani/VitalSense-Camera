import React, { useState, useEffect } from 'react';
import { Camera } from '../types/camera';

interface DetectionOverlayProps {
  camera: Camera;
}

interface Detection {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  confidence: number;
  color: string;
}

const DetectionOverlay: React.FC<DetectionOverlayProps> = ({ camera }) => {
  const [detections, setDetections] = useState<Detection[]>([]);

  useEffect(() => {
    // Simulate real-time detection updates
    const interval = setInterval(() => {
      const mockDetections: Detection[] = [];
      
      if (camera.alertLevel === 'high') {
        mockDetections.push({
          id: '1',
          x: 30,
          y: 40,
          width: 25,
          height: 35,
          label: 'Patient (Critical Fall)',
          confidence: 0.94,
          color: 'border-red-500 bg-red-500'
        });
      } else if (camera.alertLevel === 'medium') {
        mockDetections.push({
          id: '2',
          x: 45,
          y: 35,
          width: 20,
          height: 30,
          label: 'Patient (Abnormal Breathing)',
          confidence: 0.87,
          color: 'border-yellow-500 bg-yellow-500'
        });
      } else {
        mockDetections.push({
          id: '3',
          x: 40,
          y: 45,
          width: 18,
          height: 28,
          label: 'Patient (Stable)',
          confidence: 0.98,
          color: 'border-green-500 bg-green-500'
        });
      }

      // Add medical equipment detection
      mockDetections.push({
        id: '4',
        x: 10,
        y: 60,
        width: 15,
        height: 12,
        label: 'Hospital Bed',
        confidence: 0.99,
        color: 'border-blue-500 bg-blue-500'
      });

      // Add vital signs monitor
      mockDetections.push({
        id: '5',
        x: 75,
        y: 20,
        width: 12,
        height: 8,
        label: 'Vital Monitor',
        confidence: 0.95,
        color: 'border-purple-500 bg-purple-500'
      });

      setDetections(mockDetections);
    }, 2000);

    return () => clearInterval(interval);
  }, [camera.alertLevel]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {detections.map((detection) => (
        <div
          key={detection.id}
          className={`absolute border-2 ${detection.color} bg-opacity-10`}
          style={{
            left: `${detection.x}%`,
            top: `${detection.y}%`,
            width: `${detection.width}%`,
            height: `${detection.height}%`,
          }}
        >
          <div className={`absolute -top-6 left-0 px-2 py-1 text-xs font-medium text-white rounded ${detection.color.replace('border-', 'bg-').replace('bg-opacity-10', '')}`}>
            {detection.label} ({Math.round(detection.confidence * 100)}%)
          </div>
        </div>
      ))}
      
      {/* YOLOv8 Status Indicator */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
        YOLOv8 Active • {detections.length} objects
      </div>
    </div>
  );
};

export default DetectionOverlay;