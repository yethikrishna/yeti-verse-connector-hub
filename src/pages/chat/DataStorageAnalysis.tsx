import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';

interface DataStorageAnalysisProps {}

type FileType = 'document' | 'image' | 'audio' | 'video' | 'data';
type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'date' | 'size' | 'type';

interface StoredFile {
  id: string;
  name: string;
  type: FileType;
  size: number;
  uploadDate: Date;
  analysisResults?: {
    wordCount?: number;
    imageLabels?: string[];
    audioLength?: number;
    videoLength?: number;
    dataRows?: number;
  };
  thumbnail?: string;
  tags: string[];
}

const fileTypes = [
  { id: 'document', label: 'Documents', icon: '📄', color: 'bg-blue-500', extensions: ['.pdf', '.doc', '.docx', '.txt'] },
  { id: 'image', label: 'Images', icon: '🖼️', color: 'bg-green-500', extensions: ['.jpg', '.png', '.gif', '.svg'] },
  { id: 'audio', label: 'Audio', icon: '🎵', color: 'bg-purple-500', extensions: ['.mp3', '.wav', '.m4a'] },
  { id: 'video', label: 'Video', icon: '🎬', color: 'bg-red-500', extensions: ['.mp4', '.avi', '.mov'] },
  { id: 'data', label: 'Data Files', icon: '📊', color: 'bg-yellow-500', extensions: ['.csv', '.json', '.xlsx'] },
];

// Sample data
const sampleFiles: StoredFile[] = [
  {
    id: '1',
    name: 'Project Proposal.pdf',
    type: 'document',
    size: 2048000,
    uploadDate: new Date('2024-01-15'),
    analysisResults: { wordCount: 3420 },
    tags: ['business', 'proposal', 'project'],
  },
  {
    id: '2',
    name: 'Marketing Banner.png',
    type: 'image',
    size: 1024000,
    uploadDate: new Date('2024-01-14'),
    analysisResults: { imageLabels: ['banner', 'marketing', 'design', 'colorful'] },
    tags: ['marketing', 'design', 'banner'],
  },
  {
    id: '3',
    name: 'Meeting Recording.mp3',
    type: 'audio',
    size: 15360000,
    uploadDate: new Date('2024-01-13'),
    analysisResults: { audioLength: 1800 },
    tags: ['meeting', 'recording', 'business'],
  },
  {
    id: '4',
    name: 'Sales Data Q1.csv',
    type: 'data',
    size: 512000,
    uploadDate: new Date('2024-01-12'),
    analysisResults: { dataRows: 1250 },
    tags: ['sales', 'data', 'q1', 'analytics'],
  },
  {
    id: '5',
    name: 'Product Demo.mp4',
    type: 'video',
    size: 52428800,
    uploadDate: new Date('2024-01-11'),
    analysisResults: { videoLength: 300 },
    tags: ['demo', 'product', 'video'],
  },
  {
    id: '6',
    name: 'Research Notes.docx',
    type: 'document',
    size: 768000,
    uploadDate: new Date('2024-01-10'),
    analysisResults: { wordCount: 2150 },
    tags: ['research', 'notes', 'academic'],
  },
];

export const DataStorageAnalysis: React.FC<DataStorageAnalysisProps> = () => {
  const [files, setFiles] = useState<StoredFile[]>(sampleFiles);
  const [selectedType, setSelectedType] = useState<FileType | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const filteredFiles = files.filter(file => {
    const matchesType = selectedType === 'all' || file.type === selectedType;
    const matchesSearch = searchQuery === '' || 
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesType && matchesSearch;
  });

  const sortedFiles = [...filteredFiles].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return b.uploadDate.getTime() - a.uploadDate.getTime();
      case 'size':
        return b.size - a.size;
      case 'type':
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    setIsUploading(true);
    
    // Simulate file upload and analysis
    setTimeout(() => {
      const newFiles: StoredFile[] = Array.from(uploadedFiles).map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        name: file.name,
        type: getFileType(file.name),
        size: file.size,
        uploadDate: new Date(),
        analysisResults: generateMockAnalysis(file.name, file.size),
        tags: generateMockTags(file.name),
      }));

      setFiles(prev => [...newFiles, ...prev]);
      setIsUploading(false);
    }, 2000);
  };

  const getFileType = (fileName: string): FileType => {
    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    
    if (['.pdf', '.doc', '.docx', '.txt'].includes(extension)) return 'document';
    if (['.jpg', '.jpeg', '.png', '.gif', '.svg'].includes(extension)) return 'image';
    if (['.mp3', '.wav', '.m4a'].includes(extension)) return 'audio';
    if (['.mp4', '.avi', '.mov'].includes(extension)) return 'video';
    if (['.csv', '.json', '.xlsx'].includes(extension)) return 'data';
    
    return 'document';
  };

  const generateMockAnalysis = (fileName: string, fileSize: number) => {
    const type = getFileType(fileName);
    
    switch (type) {
      case 'document':
        return { wordCount: Math.floor(fileSize / 100) + Math.floor(Math.random() * 1000) };
      case 'image':
        return { imageLabels: ['object', 'scene', 'color', 'composition'] };
      case 'audio':
        return { audioLength: Math.floor(fileSize / 10000) + Math.floor(Math.random() * 300) };
      case 'video':
        return { videoLength: Math.floor(fileSize / 100000) + Math.floor(Math.random() * 600) };
      case 'data':
        return { dataRows: Math.floor(fileSize / 500) + Math.floor(Math.random() * 1000) };
      default:
        return {};
    }
  };

  const generateMockTags = (fileName: string): string[] => {
    const baseTags = ['uploaded', 'new'];
    const name = fileName.toLowerCase();
    
    if (name.includes('project')) baseTags.push('project');
    if (name.includes('meeting')) baseTags.push('meeting');
    if (name.includes('report')) baseTags.push('report');
    if (name.includes('data')) baseTags.push('data');
    if (name.includes('image') || name.includes('photo')) baseTags.push('visual');
    
    return baseTags;
  };

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleBulkDelete = () => {
    setFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)));
    setSelectedFiles([]);
  };

  const getFileIcon = (type: FileType) => {
    return fileTypes.find(ft => ft.id === type)?.icon || '📄';
  };

  const getTotalStats = () => {
    const totalFiles = files.length;
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    const typeStats = fileTypes.map(type => ({
      ...type,
      count: files.filter(file => file.type === type.id).length
    }));

    return { totalFiles, totalSize, typeStats };
  };

  const stats = getTotalStats();

  return (
    <DoubaoMainLayout>
      <div className="flex flex-col h-full">
        <DoubaoHeader 
          showSidebarToggle={true}
          hasNotifications={false}
        />
        
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <motion.div
              variants={doubaoAnimations.pageVariants}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <h1 className="doubao-text-2xl text-doubao-text-primary mb-2">
                💾 Data Storage & Analysis
              </h1>
              <p className="doubao-text-base text-doubao-text-secondary">
                Manage your files, analyze content, and organize your data with AI-powered insights.
              </p>
            </motion.div>

            {/* Stats Overview */}
            <motion.div
              variants={doubaoAnimations.pageVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            >
              <div className="doubao-card-base p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📁</div>
                  <div>
                    <div className="doubao-text-lg font-semibold text-doubao-text-primary">
                      {stats.totalFiles}
                    </div>
                    <div className="doubao-text-sm text-doubao-text-muted">Total Files</div>
                  </div>
                </div>
              </div>
              
              <div className="doubao-card-base p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">💽</div>
                  <div>
                    <div className="doubao-text-lg font-semibold text-doubao-text-primary">
                      {formatFileSize(stats.totalSize)}
                    </div>
                    <div className="doubao-text-sm text-doubao-text-muted">Total Size</div>
                  </div>
                </div>
              </div>
              
              <div className="doubao-card-base p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🔍</div>
                  <div>
                    <div className="doubao-text-lg font-semibold text-doubao-text-primary">
                      {files.filter(f => f.analysisResults).length}
                    </div>
                    <div className="doubao-text-sm text-doubao-text-muted">Analyzed</div>
                  </div>
                </div>
              </div>
              
              <div className="doubao-card-base p-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">⭐</div>
                  <div>
                    <div className="doubao-text-lg font-semibold text-doubao-text-primary">
                      {selectedFiles.length}
                    </div>
                    <div className="doubao-text-sm text-doubao-text-muted">Selected</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Controls */}
            <motion.div
              variants={doubaoAnimations.pageVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
              className="doubao-card-base p-6 mb-6"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Upload */}
                <div className="flex gap-4">
                  <label className="doubao-button-primary px-4 py-2 cursor-pointer">
                    {isUploading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Uploading...
                      </div>
                    ) : (
                      <>📤 Upload Files</>
                    )}
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                  
                  {selectedFiles.length > 0 && (
                    <button
                      onClick={handleBulkDelete}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 doubao-transition-colors"
                    >
                      🗑️ Delete Selected ({selectedFiles.length})
                    </button>
                  )}
                </div>

                {/* Search */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search files by name or tags..."
                    className="w-full doubao-input-base"
                  />
                </div>

                {/* View Controls */}
                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="doubao-input-base"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="name">Sort by Name</option>
                    <option value="size">Sort by Size</option>
                    <option value="type">Sort by Type</option>
                  </select>
                  
                  <div className="flex border border-doubao-border-light rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        'px-3 py-2 doubao-transition-colors',
                        viewMode === 'grid'
                          ? 'bg-doubao-primary-blue text-white'
                          : 'bg-white hover:bg-doubao-hover'
                      )}
                    >
                      ⊞
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn(
                        'px-3 py-2 doubao-transition-colors',
                        viewMode === 'list'
                          ? 'bg-doubao-primary-blue text-white'
                          : 'bg-white hover:bg-doubao-hover'
                      )}
                    >
                      ☰
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* File Type Filters */}
            <motion.div
              variants={doubaoAnimations.pageVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <div className="flex flex-wrap gap-3">
                <motion.button
                  variants={doubaoAnimations.buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setSelectedType('all')}
                  className={cn(
                    'px-4 py-2 rounded-full border doubao-transition-colors',
                    selectedType === 'all'
                      ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10 text-doubao-primary-blue'
                      : 'border-doubao-border-light hover:border-doubao-border-medium text-doubao-text-secondary'
                  )}
                >
                  All Files ({files.length})
                </motion.button>
                {stats.typeStats.map((type) => (
                  <motion.button
                    key={type.id}
                    variants={doubaoAnimations.buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setSelectedType(type.id as FileType)}
                    className={cn(
                      'px-4 py-2 rounded-full border doubao-transition-colors flex items-center gap-2',
                      selectedType === type.id
                        ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10 text-doubao-primary-blue'
                        : 'border-doubao-border-light hover:border-doubao-border-medium text-doubao-text-secondary'
                    )}
                  >
                    <span>{type.icon}</span>
                    <span>{type.label} ({type.count})</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Files Display */}
            <motion.div
              variants={doubaoAnimations.pageVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.4 }}
            >
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sortedFiles.map((file, index) => (
                    <motion.div
                      key={file.id}
                      variants={doubaoAnimations.staggerItem}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.05 * index }}
                      className={cn(
                        'doubao-card-base p-4 cursor-pointer hover:shadow-lg doubao-transition-all',
                        selectedFiles.includes(file.id) && 'ring-2 ring-doubao-primary-blue'
                      )}
                      onClick={() => handleFileSelect(file.id)}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3">{getFileIcon(file.type)}</div>
                        <h3 className="doubao-text-sm font-medium text-doubao-text-primary mb-2 truncate">
                          {file.name}
                        </h3>
                        <div className="doubao-text-xs text-doubao-text-muted mb-3">
                          {formatFileSize(file.size)} • {file.uploadDate.toLocaleDateString()}
                        </div>
                        
                        {/* Analysis Results */}
                        {file.analysisResults && (
                          <div className="bg-doubao-bg-secondary rounded-lg p-3 mb-3">
                            <div className="doubao-text-xs font-medium text-doubao-text-primary mb-1">
                              Analysis
                            </div>
                            {file.analysisResults.wordCount && (
                              <div className="doubao-text-xs text-doubao-text-muted">
                                📝 {file.analysisResults.wordCount.toLocaleString()} words
                              </div>
                            )}
                            {file.analysisResults.imageLabels && (
                              <div className="doubao-text-xs text-doubao-text-muted">
                                🏷️ {file.analysisResults.imageLabels.slice(0, 2).join(', ')}
                              </div>
                            )}
                            {file.analysisResults.audioLength && (
                              <div className="doubao-text-xs text-doubao-text-muted">
                                🎵 {formatDuration(file.analysisResults.audioLength)}
                              </div>
                            )}
                            {file.analysisResults.videoLength && (
                              <div className="doubao-text-xs text-doubao-text-muted">
                                🎬 {formatDuration(file.analysisResults.videoLength)}
                              </div>
                            )}
                            {file.analysisResults.dataRows && (
                              <div className="doubao-text-xs text-doubao-text-muted">
                                📊 {file.analysisResults.dataRows.toLocaleString()} rows
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 justify-center">
                          {file.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-doubao-bg-secondary text-doubao-text-muted text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="doubao-card-base overflow-hidden">
                  <div className="divide-y divide-doubao-border-light">
                    {sortedFiles.map((file, index) => (
                      <motion.div
                        key={file.id}
                        variants={doubaoAnimations.staggerItem}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.02 * index }}
                        className={cn(
                          'p-4 cursor-pointer hover:bg-doubao-hover doubao-transition-colors',
                          selectedFiles.includes(file.id) && 'bg-doubao-secondary-blue/10'
                        )}
                        onClick={() => handleFileSelect(file.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">{getFileIcon(file.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="doubao-text-sm font-medium text-doubao-text-primary truncate">
                                {file.name}
                              </h3>
                              {selectedFiles.includes(file.id) && (
                                <span className="text-doubao-primary-blue">✓</span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 doubao-text-xs text-doubao-text-muted">
                              <span>{formatFileSize(file.size)}</span>
                              <span>{file.uploadDate.toLocaleDateString()}</span>
                              {file.analysisResults && (
                                <span className="text-doubao-primary-blue">Analyzed</span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {file.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-doubao-bg-secondary text-doubao-text-muted text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {sortedFiles.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📁</div>
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-2">
                    No files found
                  </h3>
                  <p className="doubao-text-base text-doubao-text-secondary mb-4">
                    Upload some files or adjust your search filters
                  </p>
                  <label className="doubao-button-primary px-6 py-3 cursor-pointer">
                    📤 Upload Your First File
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </DoubaoMainLayout>
  );
};

export default DataStorageAnalysis;