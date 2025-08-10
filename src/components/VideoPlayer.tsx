import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, Maximize } from 'lucide-react';
import YOLOv8DetectionService, { Detection, MedicalEvent } from '../services/YOLOv8Detection';

interface VideoPlayerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoUrl: string;
  isPlaying: boolean;
  onTimeUpdate: () => void;
  onTogglePlayPause: () => void;
  onDetectionsUpdate?: (detections: Detection[]) => void;
  onMedicalEventsUpdate?: (events: MedicalEvent[]) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoRef,
  videoUrl,
  isPlaying,
  onTimeUpdate,
  onTogglePlayPause,
  onDetectionsUpdate,
  onMedicalEventsUpdate
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [medicalEvents, setMedicalEvents] = useState<MedicalEvent[]>([]);
  const [isDetectionActive, setIsDetectionActive] = useState(true);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize YOLOv8 detection service
    const initializeDetection = async () => {
      await YOLOv8DetectionService.initialize();
    };
    initializeDetection();
  }, []);

  useEffect(() => {
    if (isPlaying && isDetectionActive) {
      startDetection();
    } else {
      stopDetection();
    }

    return () => stopDetection();
  }, [isPlaying, isDetectionActive]);

  const startDetection = () => {
    if (detectionIntervalRef.current) return;

    detectionIntervalRef.current = setInterval(async () => {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        try {
          const newDetections = await YOLOv8DetectionService.detectFromVideo(videoRef.current);
          const newMedicalEvents = YOLOv8DetectionService.analyzeMedicalEvents(newDetections);
          
          setDetections(newDetections);
          setMedicalEvents(newMedicalEvents);
          
          if (onDetectionsUpdate) {
            onDetectionsUpdate(newDetections);
          }
          if (onMedicalEventsUpdate) {
            onMedicalEventsUpdate(newMedicalEvents);
          }
        } catch (error) {
          console.error('Detection error:', error);
        }
      }
    }, 1000); // Run detection every second
  };

  const stopDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  };

  const drawDetections = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw detections
    detections.forEach(detection => {
      const [x, y, width, height] = detection.bbox;
      
      // Draw bounding box
      ctx.strokeStyle = detection.class === 'person' ? '#ff0000' : '#00ff00';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      
      // Draw label
      ctx.fillStyle = detection.class === 'person' ? '#ff0000' : '#00ff00';
      ctx.font = '14px Arial';
      ctx.fillText(
        `${detection.class} ${(detection.confidence * 100).toFixed(1)}%`,
        x, y - 5
      );
    });
  };

  useEffect(() => {
    drawDetections();
  }, [detections]);

  return (
    <div className="relative w-full h-full">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onTimeUpdate={onTimeUpdate}
        muted
        loop
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Detection Overlay Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 10 }}
      />

      {/* Video Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onTogglePlayPause}
              className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white" />
              )}
            </button>
            
            <button className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
              <Volume2 className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={() => setIsDetectionActive(!isDetectionActive)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                isDetectionActive 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-600 text-white'
              }`}
            >
              {isDetectionActive ? 'AI ON' : 'AI OFF'}
            </button>
          </div>
          
          <button className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
            <Maximize className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Live Indicator */}
      <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span>LIVE</span>
      </div>

      {/* Detection Status */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        {detections.length > 0 && (
          <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
            {detections.length} objects detected
          </div>
        )}
        {medicalEvents.length > 0 && (
          <div className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm">
            {medicalEvents.length} medical events
          </div>
        )}
      </div>

      {/* Detection Overlay */}
      <div className="absolute bottom-4 left-4">
        <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
          {detections.find(d => d.class === 'person') 
            ? `person (${(detections.find(d => d.class === 'person')!.confidence * 100).toFixed(0)}%)`
            : 'No person detected'
          }
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer; 