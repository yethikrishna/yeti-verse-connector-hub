import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';

interface MeetingRecordingProps {}

type RecordingState = 'idle' | 'recording' | 'processing' | 'completed';
type MeetingType = 'general' | 'standup' | 'planning' | 'review' | 'brainstorm';

interface MeetingParticipant {
  id: string;
  name: string;
  role?: string;
  avatar?: string;
}

interface MeetingSegment {
  id: string;
  speaker: string;
  content: string;
  timestamp: Date;
  duration: number;
  isKeyPoint?: boolean;
  category?: 'decision' | 'action' | 'discussion' | 'question';
}

interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  dueDate?: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
}

interface Decision {
  id: string;
  decision: string;
  context: string;
  timestamp: Date;
  participants: string[];
}

interface MeetingSummary {
  title: string;
  date: Date;
  duration: number;
  participants: MeetingParticipant[];
  keyPoints: string[];
  decisions: Decision[];
  actionItems: ActionItem[];
  nextSteps: string[];
  transcript: MeetingSegment[];
}

const meetingTypes = [
  { 
    id: 'general', 
    label: 'General Meeting', 
    icon: '👥', 
    description: 'Standard team or business meeting' 
  },
  { 
    id: 'standup', 
    label: 'Daily Standup', 
    icon: '🏃', 
    description: 'Quick daily team sync meeting' 
  },
  { 
    id: 'planning', 
    label: 'Planning Session', 
    icon: '📋', 
    description: 'Project or sprint planning meeting' 
  },
  { 
    id: 'review', 
    label: 'Review Meeting', 
    icon: '🔍', 
    description: 'Performance or project review' 
  },
  { 
    id: 'brainstorm', 
    label: 'Brainstorming', 
    icon: '💡', 
    description: 'Creative ideation session' 
  },
];

export const MeetingRecording: React.FC<MeetingRecordingProps> = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [meetingType, setMeetingType] = useState<MeetingType>('general');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [participants, setParticipants] = useState<MeetingParticipant[]>([]);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [meetingSegments, setMeetingSegments] = useState<MeetingSegment[]>([]);
  const [meetingSummary, setMeetingSummary] = useState<MeetingSummary | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<Date | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setCurrentTranscript(finalTranscript);
          addMeetingSegment(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recordingState === 'recording' && startTimeRef.current) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current!.getTime()) / 1000);
        setRecordingDuration(elapsed);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [recordingState]);

  const addParticipant = () => {
    if (newParticipantName.trim()) {
      const newParticipant: MeetingParticipant = {
        id: Date.now().toString(),
        name: newParticipantName.trim(),
      };
      setParticipants(prev => [...prev, newParticipant]);
      setNewParticipantName('');
    }
  };

  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.start();
      startTimeRef.current = new Date();
      setRecordingState('recording');
      setRecordingDuration(0);
      
      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    setRecordingState('processing');
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    // Process the meeting data
    setTimeout(() => {
      processMeetingData();
    }, 2000);
  };

  const addMeetingSegment = (transcript: string) => {
    const segment: MeetingSegment = {
      id: Date.now().toString(),
      speaker: 'Unknown Speaker', // In a real implementation, this would use speaker identification
      content: transcript,
      timestamp: new Date(),
      duration: 0,
    };
    
    setMeetingSegments(prev => [...prev, segment]);
    setCurrentTranscript('');
  };

  const processMeetingData = async () => {
    setIsProcessingAI(true);
    
    // Simulate AI processing to extract key points, decisions, and action items
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const summary: MeetingSummary = {
      title: meetingTitle || `${meetingTypes.find(t => t.id === meetingType)?.label} - ${new Date().toLocaleDateString()}`,
      date: startTimeRef.current || new Date(),
      duration: recordingDuration,
      participants,
      keyPoints: extractKeyPoints(meetingSegments),
      decisions: extractDecisions(meetingSegments),
      actionItems: extractActionItems(meetingSegments),
      nextSteps: extractNextSteps(meetingSegments),
      transcript: meetingSegments,
    };
    
    setMeetingSummary(summary);
    setRecordingState('completed');
    setIsProcessingAI(false);
  };

  const extractKeyPoints = (segments: MeetingSegment[]): string[] => {
    // Simulate AI extraction of key points
    const keyPoints = [
      'Discussed Q4 project timeline and deliverables',
      'Identified potential risks in the current development cycle',
      'Reviewed budget allocation for the next quarter',
      'Addressed team capacity and resource planning',
    ];
    return keyPoints.slice(0, Math.min(segments.length, 4));
  };

  const extractDecisions = (segments: MeetingSegment[]): Decision[] => {
    // Simulate AI extraction of decisions
    return [
      {
        id: '1',
        decision: 'Move project deadline to end of Q4',
        context: 'Due to resource constraints and scope changes',
        timestamp: new Date(),
        participants: participants.map(p => p.name),
      },
      {
        id: '2',
        decision: 'Hire additional developer for frontend team',
        context: 'To meet increased workload demands',
        timestamp: new Date(),
        participants: participants.map(p => p.name),
      },
    ];
  };

  const extractActionItems = (segments: MeetingSegment[]): ActionItem[] => {
    // Simulate AI extraction of action items
    return [
      {
        id: '1',
        task: 'Update project timeline documentation',
        assignee: participants[0]?.name || 'Team Lead',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        priority: 'high',
        status: 'pending',
      },
      {
        id: '2',
        task: 'Schedule interviews for frontend developer position',
        assignee: participants[1]?.name || 'HR Manager',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
        priority: 'medium',
        status: 'pending',
      },
      {
        id: '3',
        task: 'Prepare budget proposal for Q1',
        assignee: participants[2]?.name || 'Finance Team',
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
        priority: 'medium',
        status: 'pending',
      },
    ];
  };

  const extractNextSteps = (segments: MeetingSegment[]): string[] => {
    // Simulate AI extraction of next steps
    return [
      'Follow up on action items by next Friday',
      'Schedule follow-up meeting for next week',
      'Share meeting summary with all stakeholders',
      'Begin implementation of approved decisions',
    ];
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const exportSummary = () => {
    if (!meetingSummary) return;
    
    const summaryText = `
MEETING SUMMARY
===============

Title: ${meetingSummary.title}
Date: ${meetingSummary.date.toLocaleDateString()}
Duration: ${formatDuration(meetingSummary.duration)}
Participants: ${meetingSummary.participants.map(p => p.name).join(', ')}

KEY POINTS
----------
${meetingSummary.keyPoints.map(point => `• ${point}`).join('\n')}

DECISIONS MADE
--------------
${meetingSummary.decisions.map(decision => `• ${decision.decision}\n  Context: ${decision.context}`).join('\n\n')}

ACTION ITEMS
------------
${meetingSummary.actionItems.map(item => `• ${item.task}\n  Assignee: ${item.assignee}\n  Due: ${item.dueDate?.toLocaleDateString()}\n  Priority: ${item.priority}`).join('\n\n')}

NEXT STEPS
----------
${meetingSummary.nextSteps.map(step => `• ${step}`).join('\n')}
    `.trim();
    
    const blob = new Blob([summaryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meeting-summary-${meetingSummary.date.toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetMeeting = () => {
    setRecordingState('idle');
    setMeetingTitle('');
    setParticipants([]);
    setMeetingSegments([]);
    setMeetingSummary(null);
    setRecordingDuration(0);
    setCurrentTranscript('');
  };

  return (
    <DoubaoMainLayout>
      <div className="flex flex-col h-full">
        <DoubaoHeader 
          showSidebarToggle={true}
          hasNotifications={false}
        />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <motion.div
              variants={doubaoAnimations.fadeInUp}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <h1 className="doubao-text-2xl text-doubao-text-primary mb-2">
                🎙️ Meeting Recording
              </h1>
              <p className="doubao-text-base text-doubao-text-secondary">
                Record meetings and automatically generate structured summaries with key points, decisions, and action items.
              </p>
            </motion.div>

            {recordingState === 'idle' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Meeting Setup */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Meeting Setup
                  </h3>
                  
                  {/* Meeting Title */}
                  <div className="mb-4">
                    <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-2">
                      Meeting Title
                    </label>
                    <input
                      type="text"
                      value={meetingTitle}
                      onChange={(e) => setMeetingTitle(e.target.value)}
                      placeholder="Enter meeting title..."
                      className="w-full px-3 py-2 border border-doubao-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-doubao-primary-blue focus:border-transparent doubao-transition-colors"
                    />
                  </div>

                  {/* Meeting Type */}
                  <div className="mb-6">
                    <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-3">
                      Meeting Type
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {meetingTypes.map((type) => (
                        <motion.button
                          key={type.id}
                          variants={doubaoAnimations.buttonVariants}
                          initial="rest"
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => setMeetingType(type.id as MeetingType)}
                          className={cn(
                            'p-3 rounded-lg border-2 text-left doubao-transition-colors',
                            meetingType === type.id
                              ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                              : 'border-doubao-border-light hover:border-doubao-border-medium'
                          )}
                        >
                          <div className="text-lg mb-1">{type.icon}</div>
                          <div className="doubao-text-sm font-medium text-doubao-text-primary mb-1">
                            {type.label}
                          </div>
                          <div className="doubao-text-xs text-doubao-text-muted">
                            {type.description}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Start Recording Button */}
                  <motion.button
                    variants={doubaoAnimations.buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={startRecording}
                    className="w-full doubao-button-primary py-3 text-lg"
                  >
                    🎙️ Start Recording
                  </motion.button>
                </motion.div>

                {/* Participants */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Participants
                  </h3>
                  
                  {/* Add Participant */}
                  <div className="mb-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newParticipantName}
                        onChange={(e) => setNewParticipantName(e.target.value)}
                        placeholder="Enter participant name..."
                        className="flex-1 px-3 py-2 border border-doubao-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-doubao-primary-blue focus:border-transparent doubao-transition-colors"
                        onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                      />
                      <motion.button
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={addParticipant}
                        className="px-4 py-2 bg-doubao-primary-blue text-white rounded-lg hover:bg-doubao-primary-blue/90 doubao-transition-colors"
                      >
                        Add
                      </motion.button>
                    </div>
                  </div>

                  {/* Participants List */}
                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <motion.div
                        key={participant.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-3 bg-doubao-bg-secondary rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-doubao-primary-blue text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {participant.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="doubao-text-sm font-medium text-doubao-text-primary">
                            {participant.name}
                          </span>
                        </div>
                        <motion.button
                          variants={doubaoAnimations.buttonVariants}
                          initial="rest"
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => removeParticipant(participant.id)}
                          className="text-red-500 hover:text-red-700 doubao-transition-colors"
                        >
                          ✕
                        </motion.button>
                      </motion.div>
                    ))}
                    
                    {participants.length === 0 && (
                      <div className="text-center py-8 text-doubao-text-muted">
                        <div className="text-4xl mb-2">👥</div>
                        <div className="doubao-text-sm">
                          Add participants to track who attended the meeting
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}

            {recordingState === 'recording' && (
              <motion.div
                variants={doubaoAnimations.fadeInUp}
                initial="hidden"
                animate="visible"
                className="doubao-card-base p-8"
              >
                <div className="text-center">
                  {/* Recording Status */}
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-600 text-sm font-medium">
                      <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                      Recording - {formatDuration(recordingDuration)}
                    </div>
                  </div>

                  {/* Recording Visualization */}
                  <div className="mb-8">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-32 h-32 mx-auto rounded-full bg-red-100 flex items-center justify-center text-4xl"
                    >
                      🎙️
                    </motion.div>
                  </div>

                  {/* Live Transcript */}
                  {currentTranscript && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-doubao-bg-secondary rounded-lg"
                    >
                      <div className="doubao-text-sm text-doubao-text-muted mb-1">
                        Live Transcript:
                      </div>
                      <div className="doubao-text-base text-doubao-text-primary">
                        {currentTranscript}
                      </div>
                    </motion.div>
                  )}

                  {/* Stop Recording Button */}
                  <motion.button
                    variants={doubaoAnimations.buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={stopRecording}
                    className="bg-red-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-600 doubao-transition-colors"
                  >
                    ⏹️ Stop Recording
                  </motion.button>
                </div>
              </motion.div>
            )}

            {recordingState === 'processing' && (
              <motion.div
                variants={doubaoAnimations.fadeInUp}
                initial="hidden"
                animate="visible"
                className="doubao-card-base p-8"
              >
                <div className="text-center">
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-600 text-sm font-medium">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                      Processing Meeting Data...
                    </div>
                  </div>

                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 mx-auto mb-6 border-4 border-doubao-primary-blue border-t-transparent rounded-full"
                  />

                  <div className="doubao-text-base text-doubao-text-secondary">
                    {isProcessingAI ? 'AI is analyzing the meeting content...' : 'Finalizing summary...'}
                  </div>
                </div>
              </motion.div>
            )}

            {recordingState === 'completed' && meetingSummary && (
              <div className="space-y-6">
                {/* Summary Header */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="doubao-card-base p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="doubao-text-xl font-semibold text-doubao-text-primary">
                      Meeting Summary
                    </h2>
                    <div className="flex gap-2">
                      <motion.button
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={exportSummary}
                        className="doubao-button-secondary px-4 py-2"
                      >
                        📄 Export
                      </motion.button>
                      <motion.button
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={resetMeeting}
                        className="doubao-button-primary px-4 py-2"
                      >
                        🆕 New Meeting
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted">Title</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {meetingSummary.title}
                      </div>
                    </div>
                    <div className="p-3 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted">Date</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {meetingSummary.date.toLocaleDateString()}
                      </div>
                    </div>
                    <div className="p-3 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted">Duration</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {formatDuration(meetingSummary.duration)}
                      </div>
                    </div>
                    <div className="p-3 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted">Participants</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {meetingSummary.participants.length}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Key Points */}
                  <motion.div
                    variants={doubaoAnimations.fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.1 }}
                    className="doubao-card-base p-6"
                  >
                    <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4 flex items-center gap-2">
                      🎯 Key Points
                    </h3>
                    <div className="space-y-3">
                      {meetingSummary.keyPoints.map((point, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-3 bg-doubao-bg-secondary rounded-lg"
                        >
                          <div className="w-6 h-6 bg-doubao-primary-blue text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <div className="doubao-text-sm text-doubao-text-primary">
                            {point}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Decisions */}
                  <motion.div
                    variants={doubaoAnimations.fadeInUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                    className="doubao-card-base p-6"
                  >
                    <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4 flex items-center gap-2">
                      ⚖️ Decisions Made
                    </h3>
                    <div className="space-y-4">
                      {meetingSummary.decisions.map((decision, index) => (
                        <motion.div
                          key={decision.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-doubao-bg-secondary rounded-lg"
                        >
                          <div className="doubao-text-sm font-medium text-doubao-text-primary mb-2">
                            {decision.decision}
                          </div>
                          <div className="doubao-text-xs text-doubao-text-muted mb-2">
                            Context: {decision.context}
                          </div>
                          <div className="doubao-text-xs text-doubao-text-muted">
                            {decision.timestamp.toLocaleTimeString()}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Action Items */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4 flex items-center gap-2">
                    ✅ Action Items
                  </h3>
                  <div className="space-y-4">
                    {meetingSummary.actionItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-doubao-bg-secondary rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="doubao-text-sm font-medium text-doubao-text-primary">
                            {item.task}
                          </div>
                          <div className={cn(
                            'px-2 py-1 rounded text-xs font-medium',
                            item.priority === 'high' && 'bg-red-100 text-red-600',
                            item.priority === 'medium' && 'bg-yellow-100 text-yellow-600',
                            item.priority === 'low' && 'bg-green-100 text-green-600'
                          )}>
                            {item.priority}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-doubao-text-muted">
                          <span>Assignee: {item.assignee}</span>
                          <span>Due: {item.dueDate?.toLocaleDateString()}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Next Steps */}
                <motion.div
                  variants={doubaoAnimations.fadeInUp}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4 flex items-center gap-2">
                    🚀 Next Steps
                  </h3>
                  <div className="space-y-2">
                    {meetingSummary.nextSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-3 bg-doubao-bg-secondary rounded-lg"
                      >
                        <div className="w-2 h-2 bg-doubao-primary-blue rounded-full flex-shrink-0" />
                        <div className="doubao-text-sm text-doubao-text-primary">
                          {step}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DoubaoMainLayout>
  );
};

export default MeetingRecording;