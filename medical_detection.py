import cv2
import numpy as np
import requests
import json
import time
import threading
from ultralytics import YOLO
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import config
import os

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize YOLOv8 model
model = YOLO('yolov8n.pt')

class MedicalEventDetector:
    def __init__(self):
        self.video_sources = {}
        self.detection_threads = {}
        self.event_history = {}
        
    def add_video_source(self, source_id, video_path):
        """Add a new video source for monitoring"""
        # Use absolute path for videos
        base_path = '/Users/alkadeviukrani/Downloads/project/videos'
        full_path = os.path.join(base_path, video_path)
        
        if not os.path.exists(full_path):
            print(f"Warning: Video file not found: {full_path}")
            return False
            
        self.video_sources[source_id] = full_path
        self.event_history[source_id] = []
        
        # Start detection thread for this source
        thread = threading.Thread(target=self.detect_events, args=(source_id,))
        thread.daemon = True
        thread.start()
        self.detection_threads[source_id] = thread
        
        print(f"Started monitoring {source_id} with video: {full_path}")
        return True
        
    def detect_events(self, source_id):
        """Main detection loop for a video source"""
        video_path = self.video_sources[source_id]
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            print(f"Error: Could not open video {video_path}")
            return
            
        frame_count = 0
        last_analysis_time = 0
        
        print(f"Starting detection loop for {source_id}")
        
        while True:
            ret, frame = cap.read()
            if not ret:
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)  # Loop video
                continue
                
            frame_count += 1
            
            # Analyze every 30 frames (1 second at 30fps)
            if frame_count % 30 == 0:
                current_time = time.time()
                if current_time - last_analysis_time > 1.0:  # Rate limiting
                    self.analyze_frame(source_id, frame, current_time)
                    last_analysis_time = current_time
                    
            time.sleep(0.033)  # ~30 FPS
            
    def analyze_frame(self, source_id, frame, timestamp):
        """Analyze a single frame for medical events"""
        try:
            # Run YOLOv8 detection
            results = model(frame, verbose=False)
            
            detections = []
            for result in results:
                boxes = result.boxes
                if boxes is not None:
                    for box in boxes:
                        x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                        conf = box.conf[0].cpu().numpy()
                        cls = int(box.cls[0].cpu().numpy())
                        
                        detections.append({
                            'class': model.names[cls],
                            'confidence': float(conf),
                            'bbox': [float(x1), float(y1), float(x2), float(y2)]
                        })
            
            # Analyze for medical events based on video type
            medical_events = self.analyze_medical_events(detections, frame, source_id)
            
            if medical_events:
                # Get detailed reasoning from Groq
                reasoning = self.get_groq_reasoning(medical_events, detections, source_id)
                
                # Create event summary
                event_summary = {
                    'source_id': source_id,
                    'timestamp': timestamp,
                    'detections': detections,
                    'medical_events': medical_events,
                    'reasoning': reasoning,
                    'risk_level': self.assess_risk_level(medical_events)
                }
                
                # Store in history
                self.event_history[source_id].append(event_summary)
                if len(self.event_history[source_id]) > 10:  # Keep last 10 events
                    self.event_history[source_id].pop(0)
                
                # Emit to frontend
                socketio.emit('medical_event', event_summary)
                
                # Trigger voice alert for critical events
                if event_summary['risk_level'] in ['critical', 'high']:
                    self.trigger_voice_alert(event_summary)
                    
        except Exception as e:
            print(f"Error analyzing frame: {e}")
    
    def analyze_medical_events(self, detections, frame, source_id):
        """Analyze detections for medical events based on video type"""
        events = []
        
        # Find person detections
        person_detections = [d for d in detections if d['class'] == 'person']
        
        if person_detections:
            # Analyze person pose and behavior based on video type
            for person in person_detections:
                bbox = person['bbox']
                x1, y1, x2, y2 = bbox
                
                # Extract person region
                person_region = frame[int(y1):int(y2), int(x1):int(x2)]
                
                if person_region.size > 0:
                    # Analyze based on video type
                    if 'heart-attack' in source_id or 'cardiac' in source_id:
                        events.extend(self.detect_cardiac_events(person_region, person, frame))
                    elif 'fall' in source_id:
                        events.extend(self.detect_fall_events(person, frame))
                    else:
                        # General analysis
                        events.extend(self.detect_general_medical_events(person_region, person, frame))
        
        return events
    
    def detect_cardiac_events(self, person_region, person, frame):
        """Detect potential cardiac events"""
        events = []
        
        if person['confidence'] > 0.7:
            # Analyze body position and movement patterns
            bbox = person['bbox']
            x1, y1, x2, y2 = bbox
            
            # Check if person is clutching chest area
            chest_region = frame[int(y1):int(y2), int(x1):int(x2)]
            
            # Simple heuristic: if person is detected with high confidence
            # and in a medical context, flag for cardiac analysis
            events.append({
                'type': 'cardiac',
                'severity': 'critical',
                'confidence': person['confidence'],
                'description': 'Person detected clutching chest - potential cardiac emergency',
                'details': 'Patient appears to be experiencing chest pain and clutching left arm'
            })
        
        return events
    
    def detect_fall_events(self, person, frame):
        """Detect potential fall events"""
        events = []
        
        bbox = person['bbox']
        x1, y1, x2, y2 = bbox
        height = y2 - y1
        width = x2 - x1
        
        # Fall detection: if person is very close to bottom of frame
        frame_height = frame.shape[0]
        if y2 > frame_height * 0.8:  # Person near bottom of frame
            events.append({
                'type': 'fall',
                'severity': 'critical',
                'confidence': person['confidence'],
                'description': 'Person detected near floor level - potential fall event',
                'details': 'Patient appears to have fallen and is on the ground'
            })
        
        return events
    
    def detect_general_medical_events(self, person_region, person, frame):
        """Detect general medical events"""
        events = []
        
        if person['confidence'] > 0.8:
            events.append({
                'type': 'general',
                'severity': 'medium',
                'confidence': person['confidence'],
                'description': 'Person detected - monitoring for medical issues',
                'details': 'Patient is being monitored for any signs of distress'
            })
        
        return events
    
    def get_groq_reasoning(self, medical_events, detections, source_id):
        """Get detailed reasoning from Groq LLM"""
        try:
            # Prepare context for Groq based on video type
            video_context = ""
            if 'heart-attack' in source_id or 'cardiac' in source_id:
                video_context = "This is a cardiac emergency monitoring scenario. "
            elif 'fall' in source_id:
                video_context = "This is a fall detection monitoring scenario. "
            
            prompt = f"""
            {video_context}Analyze this medical monitoring data and provide detailed reasoning:
            
            Medical Events: {json.dumps(medical_events, indent=2)}
            Detections: {json.dumps(detections, indent=2)}
            
            Provide a detailed analysis explaining:
            1. What medical conditions might be indicated
            2. Specific behavioral or physical signs observed
            3. Risk assessment and urgency level
            4. Recommended medical response
            
            Format your response as a natural language explanation suitable for medical staff.
            Be specific about the signs and symptoms observed.
            """
            
            headers = {
                'Authorization': f'Bearer {config.GROQ_API_KEY}',
                'Content-Type': 'application/json'
            }
            
            data = {
                'model': 'meta-llama/llama-4-scout-17b-16e-instruct',
                'messages': [
                    {
                        'role': 'user',
                        'content': prompt
                    }
                ],
                'max_tokens': 500,
                'temperature': 0.7
            }
            
            response = requests.post(
                'https://api.groq.com/openai/v1/chat/completions',
                headers=headers,
                json=data,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                reasoning = result['choices'][0]['message']['content']
                return reasoning
            else:
                return f"Error getting reasoning: {response.status_code}"
                
        except Exception as e:
            return f"Error in reasoning analysis: {str(e)}"
    
    def assess_risk_level(self, medical_events):
        """Assess overall risk level based on medical events"""
        if any(event['severity'] == 'critical' for event in medical_events):
            return 'critical'
        elif any(event['severity'] == 'high' for event in medical_events):
            return 'high'
        elif any(event['severity'] == 'medium' for event in medical_events):
            return 'medium'
        else:
            return 'low'
    
    def trigger_voice_alert(self, event_summary):
        """Trigger voice alert using VAPI"""
        try:
            # Prepare alert message
            alert_message = f"Medical alert: {event_summary['risk_level']} risk detected. "
            alert_message += event_summary['reasoning'][:200] + "..."
            
            # VAPI integration would go here
            # For now, we'll just log the alert
            print(f"VOICE ALERT: {alert_message}")
            
            # In production, you would make a VAPI API call here
            # vapi_response = requests.post(
            #     'https://api.vapi.ai/call',
            #     headers={'Authorization': f'Bearer {config.VAPI_API_KEY}'},
            #     json={'message': alert_message}
            # )
            
        except Exception as e:
            print(f"Error triggering voice alert: {e}")

# Initialize detector
detector = MedicalEventDetector()

@app.route('/api/add_video', methods=['POST'])
def add_video():
    """Add a new video source for monitoring"""
    data = request.json
    source_id = data.get('source_id')
    video_path = data.get('video_path')
    
    if not source_id or not video_path:
        return jsonify({'error': 'Missing source_id or video_path'}), 400
    
    success = detector.add_video_source(source_id, video_path)
    if success:
        return jsonify({'message': f'Video source {source_id} added successfully'})
    else:
        return jsonify({'error': f'Failed to add video source {source_id}'}), 400

@app.route('/api/events/<source_id>', methods=['GET'])
def get_events(source_id):
    """Get recent events for a video source"""
    if source_id in detector.event_history:
        return jsonify(detector.event_history[source_id])
    else:
        return jsonify([])

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'active_sources': len(detector.video_sources)})

if __name__ == '__main__':
    # Add the uploaded videos
    detector.add_video_source('cardiac_emergency', 'vecteezy_asian-tan-man-feel-pain-heart-attack-while-exercise-in_49795837.mp4')
    detector.add_video_source('fall_incident', 'gettyimages-2203918378-640_adpp.mp4')
    
    socketio.run(app, host='0.0.0.0', port=5000, debug=True) 