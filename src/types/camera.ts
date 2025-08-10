export interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
  alertLevel: 'normal' | 'medium' | 'high' | 'critical';
  lastEvent: string;
  videoUrl: string;
}

export interface DetectionEvent {
  id: string;
  cameraId: string;
  timestamp: Date;
  type: 'fall' | 'seizure' | 'unresponsive' | 'breathing_abnormal' | 'cardiac_event' | 'normal';
  confidence: number;
  description: string;
  boundingBoxes: BoundingBox[];
  actionTaken: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  confidence: number;
}

export interface AIReasoning {
  analysis: string;
  riskFactors: string[];
  recommendations: string[];
  confidence: number;
  timestamp: Date;
}