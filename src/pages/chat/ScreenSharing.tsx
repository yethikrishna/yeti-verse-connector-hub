import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';

type SharingState = 'idle' | 'connecting' | 'sharing' | 'paused' | 'ended';
type SharingMode = 'screen' | 'application' | 'document' | 'tutorial';
type ParticipantRole = 'host' | 'viewer' | 'collaborator';

interface Participant {
  id: string;
  name: string;
  role: ParticipantRole;
  isOnline: boolean;
  avatar?: string;
  cursor?: { x: number; y: number };
}

interface SharedDocument {
  id: string;
  name: string;
  type: 'doc' | 'pdf' | 'ppt' | 'sheet';
  url: string;
  isEditable: boolean;
  lastModified: Date;
}

interface AnnotationTool {
  id: string;
  name: string;
  icon: string;
  color: string;
  active: boolean;
}

const sharingModes = [
  { 
    id: 'screen', 
    label: 'Full Screen', 
    icon: '🖥️', 
    description: 'Share your entire screen for complete visibility' 
  },
  { 
    id: 'application', 
    label: 'Application', 
    icon: '📱', 
    description: 'Share a specific application window' 
  },
  { 
    id: 'document', 
    label: 'Document', 
    icon: '📄', 
    description: 'Collaborate on documents with real-time editing' 
  },
  { 
    id: 'tutorial', 
    label: 'Tutorial Mode', 
    icon: '🎓', 
    description: 'Guided software operation explanations' 
  },
];

const annotationTools: AnnotationTool[] = [
  { id: 'pointer', name: 'Pointer', icon: '👆', color: '#4A90E2', active: false },
  { id: 'pen', name: 'Pen', icon: '✏️', color: '#E74C3C', active: false },
  { id: 'highlighter', name: 'Highlighter', icon: '🖍️', color: '#F1C40F', active: false },
  { id: 'text', name: 'Text', icon: '📝', color: '#2ECC71', active: false },
  { id: 'arrow', name: 'Arrow', icon: '➡️', color: '#9B59B6', active: false },
  { id: 'rectangle', name: 'Rectangle', icon: '⬜', color: '#34495E', active: false },
];

const mockParticipants: Participant[] = [
  { id: '1', name: 'You', role: 'host', isOnline: true, avatar: '👤' },
  { id: '2', name: 'Alice Chen', role: 'collaborator', isOnline: true, avatar: '👩' },
  { id: '3', name: 'Bob Wilson', role: 'viewer', isOnline: true, avatar: '👨' },
  { id: '4', name: 'Carol Davis', role: 'viewer', isOnline: false, avatar: '👩‍💼' },
];

const mockDocuments: SharedDocument[] = [
  {
    id: '1',
    name: 'Project Proposal.docx',
    type: 'doc',
    url: '#',
    isEditable: true,
    lastModified: new Date('2024-01-15T10:30:00')
  },
  {
    id: '2',
    name: 'Budget Analysis.xlsx',
    type: 'sheet',
    url: '#',
    isEditable: true,
    lastModified: new Date('2024-01-15T09:15:00')
  },
  {
    id: '3',
    name: 'Presentation.pptx',
    type: 'ppt',
    url: '#',
    isEditable: false,
    lastModified: new Date('2024-01-14T16:45:00')
  },
];

export const ScreenSharing: React.FC = () => {
  const [sharingState, setSharingState] = useState<SharingState>('idle');
  const [selectedMode, setSelectedMode] = useState<SharingMode>('screen');
  const [participants, setParticipants] = useState<Participant[]>(mockParticipants);
  const [documents, setDocuments] = useState<SharedDocument[]>(mockDocuments);
  const [activeTools, setActiveTools] = useState<AnnotationTool[]>(annotationTools);
  const [selectedApplication, setSelectedApplication] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const applications = [
    { id: 'chrome', name: 'Google Chrome', icon: '🌐' },
    { id: 'vscode', name: 'Visual Studio Code', icon: '💻' },
    { id: 'excel', name: 'Microsoft Excel', icon: '📊' },
    { id: 'powerpoint', name: 'PowerPoint', icon: '📽️' },
    { id: 'word', name: 'Microsoft Word', icon: '📄' },
  ];

  const tutorialSteps = [
    'Welcome to Screen Sharing Tutorial',
    'Select your sharing mode',
    'Choose application or document',
    'Start collaboration session',
    'Use annotation tools',
    'Manage participants',
    'End session and save'
  ];

  useEffect(() => {
    if (sharingState === 'sharing' && videoRef.current) {
      // Simulate screen sharing stream
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#333';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Screen Sharing Active', canvas.width / 2, canvas.height / 2);
        
        canvas.toBlob((blob) => {
          if (blob && videoRef.current) {
            const url = URL.createObjectURL(blob);
            videoRef.current.src = url;
          }
        });
      }
    }
  }, [sharingState]);

  const handleStartSharing = async () => {
    setSharingState('connecting');
    
    // Simulate connection delay
    setTimeout(() => {
      setSharingState('sharing');
    }, 2000);
  };

  const handleStopSharing = () => {
    setSharingState('ended');
    setTimeout(() => {
      setSharingState('idle');
    }, 1000);
  };

  const handleToolSelect = (toolId: string) => {
    setActiveTools(prev => prev.map(tool => ({
      ...tool,
      active: tool.id === toolId ? !tool.active : false
    })));
  };

  const handleParticipantRoleChange = (participantId: string, newRole: ParticipantRole) => {
    setParticipants(prev => prev.map(p => 
      p.id === participantId ? { ...p, role: newRole } : p
    ));
  };

  const handleDocumentEdit = (docId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, lastModified: new Date() } : doc
    ));
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'doc': return '📄';
      case 'pdf': return '📕';
      case 'ppt': return '📽️';
      case 'sheet': return '📊';
      default: return '📄';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <DoubaoMainLayout>
      <div className="flex flex-col h-full bg-white">
        <DoubaoHeader />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Control Panel */}
            <div className="bg-gray-50 border-b border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-gray-900">Screen Sharing</h1>
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsRecording(!isRecording)}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium transition-colors",
                      isRecording 
                        ? "bg-red-500 text-white hover:bg-red-600" 
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    )}
                  >
                    {isRecording ? '⏹️ Stop Recording' : '🔴 Start Recording'}
                  </motion.button>
                  
                  {sharingState === 'idle' ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleStartSharing}
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                    >
                      Start Sharing
                    </motion.button>
                  ) : sharingState === 'sharing' ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleStopSharing}
                      className="bg-red-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                      Stop Sharing
                    </motion.button>
                  ) : (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                      <span>Connecting...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sharing Mode Selection */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                {sharingModes.map((mode) => (
                  <motion.div
                    key={mode.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedMode(mode.id as SharingMode)}
                    className={cn(
                      "p-4 rounded-lg border-2 cursor-pointer transition-all",
                      selectedMode === mode.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    )}
                  >
                    <div className="text-2xl mb-2">{mode.icon}</div>
                    <h3 className="font-medium text-gray-900 mb-1">{mode.label}</h3>
                    <p className="text-sm text-gray-600">{mode.description}</p>
                  </motion.div>
                ))}
              </div>

              {/* Application Selection (when application mode is selected) */}
              {selectedMode === 'application' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-4"
                >
                  <h3 className="font-medium text-gray-900 mb-2">Select Application</h3>
                  <div className="flex flex-wrap gap-2">
                    {applications.map((app) => (
                      <motion.button
                        key={app.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedApplication(app.id)}
                        className={cn(
                          "flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors",
                          selectedApplication === app.id
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        )}
                      >
                        <span>{app.icon}</span>
                        <span className="text-sm">{app.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tutorial Steps (when tutorial mode is selected) */}
              {selectedMode === 'tutorial' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mb-4"
                >
                  <h3 className="font-medium text-gray-900 mb-2">Tutorial Progress</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    {tutorialSteps.map((_, index) => (
                      <div
                        key={index}
                        className={cn(
                          "w-3 h-3 rounded-full transition-colors",
                          index <= tutorialStep ? "bg-blue-500" : "bg-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Step {tutorialStep + 1} of {tutorialSteps.length}: {tutorialSteps[tutorialStep]}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setTutorialStep(Math.max(0, tutorialStep - 1))}
                      disabled={tutorialStep === 0}
                      className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setTutorialStep(Math.min(tutorialSteps.length - 1, tutorialStep + 1))}
                      disabled={tutorialStep === tutorialSteps.length - 1}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sharing Area */}
            <div className="flex-1 flex">
              {/* Main Sharing View */}
              <div className="flex-1 bg-gray-900 relative">
                {sharingState === 'sharing' ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="bg-gray-800 rounded-lg p-8 text-center">
                      <div className="text-6xl mb-4">🖥️</div>
                      <h3 className="text-white text-xl mb-2">Screen Sharing Active</h3>
                      <p className="text-gray-400">
                        {selectedMode === 'screen' && 'Sharing entire screen'}
                        {selectedMode === 'application' && `Sharing ${applications.find(app => app.id === selectedApplication)?.name || 'application'}`}
                        {selectedMode === 'document' && 'Document collaboration mode'}
                        {selectedMode === 'tutorial' && 'Tutorial mode active'}
                      </p>
                      <div className="mt-4 flex items-center justify-center space-x-2 text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm">Live</span>
                      </div>
                    </div>
                  </div>
                ) : sharingState === 'connecting' ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                      <p className="text-white">Connecting to sharing session...</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">📺</div>
                      <h3 className="text-white text-xl mb-2">Ready to Share</h3>
                      <p className="text-gray-400">Select your sharing preferences and click "Start Sharing"</p>
                    </div>
                  </div>
                )}

                {/* Annotation Toolbar */}
                {sharingState === 'sharing' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 flex space-x-2"
                  >
                    {activeTools.map((tool) => (
                      <motion.button
                        key={tool.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleToolSelect(tool.id)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          tool.active
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                        title={tool.name}
                      >
                        <span className="text-lg">{tool.icon}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Document Collaboration Panel */}
              {selectedMode === 'document' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-80 bg-white border-l border-gray-200 flex flex-col"
                >
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-2">Shared Documents</h3>
                    <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                      + Upload Document
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4">
                    {documents.map((doc) => (
                      <motion.div
                        key={doc.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gray-50 rounded-lg p-3 mb-3 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => handleDocumentEdit(doc.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">{getDocumentIcon(doc.type)}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{doc.name}</h4>
                            <p className="text-sm text-gray-600">
                              Modified {formatTime(doc.lastModified)}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              {doc.isEditable ? (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  Editable
                                </span>
                              ) : (
                                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                  View Only
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Participants Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-64 bg-gray-50 border-l border-gray-200 flex flex-col"
          >
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-900 mb-2">
                Participants ({participants.filter(p => p.isOnline).length})
              </h3>
              <button className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm">
                + Invite Others
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {participants.map((participant) => (
                <motion.div
                  key={participant.id}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white transition-colors mb-2"
                >
                  <div className="relative">
                    <span className="text-2xl">{participant.avatar}</span>
                    <div className={cn(
                      "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white",
                      participant.isOnline ? "bg-green-500" : "bg-gray-400"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{participant.name}</p>
                    <div className="flex items-center space-x-2">
                      <select
                        value={participant.role}
                        onChange={(e) => handleParticipantRoleChange(participant.id, e.target.value as ParticipantRole)}
                        className="text-xs bg-transparent border-none text-gray-600 focus:outline-none"
                        disabled={participant.id === '1'}
                      >
                        <option value="host">Host</option>
                        <option value="collaborator">Collaborator</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Session Duration:</span>
                  <span>15:32</span>
                </div>
                <div className="flex justify-between">
                  <span>Quality:</span>
                  <span className="text-green-600">HD</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DoubaoMainLayout>
  );
};

export default ScreenSharing;