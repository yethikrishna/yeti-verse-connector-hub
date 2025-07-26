import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Calendar, 
  MessageSquare, 
  Archive, 
  Download, 
  Trash2, 
  Star,
  Clock,
  Filter,
  MoreHorizontal,
  Eye,
  Edit3
} from 'lucide-react';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  isStarred: boolean;
  tags: string[];
  model: string;
  tokenCount: number;
}

export interface DoubaoConversationHistoryProps {
  className?: string;
  conversations?: Conversation[];
  onSelectConversation?: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
  onExportConversation?: (id: string) => void;
  onArchiveConversation?: (id: string) => void;
  onStarConversation?: (id: string) => void;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'React Component Architecture',
    preview: 'How to structure React components for better maintainability...',
    messageCount: 15,
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T11:45:00'),
    isArchived: false,
    isStarred: true,
    tags: ['react', 'architecture'],
    model: 'gpt-4',
    tokenCount: 2450
  },
  {
    id: '2',
    title: 'Python Data Analysis',
    preview: 'Working with pandas and matplotlib for data visualization...',
    messageCount: 8,
    createdAt: new Date('2024-01-14T14:20:00'),
    updatedAt: new Date('2024-01-14T15:10:00'),
    isArchived: false,
    isStarred: false,
    tags: ['python', 'data-analysis'],
    model: 'gpt-3.5-turbo',
    tokenCount: 1820
  },
  {
    id: '3',
    title: 'API Design Best Practices',
    preview: 'RESTful API design principles and GraphQL considerations...',
    messageCount: 22,
    createdAt: new Date('2024-01-13T09:15:00'),
    updatedAt: new Date('2024-01-13T10:30:00'),
    isArchived: true,
    isStarred: false,
    tags: ['api', 'backend'],
    model: 'claude-3',
    tokenCount: 3200
  },
  {
    id: '4',
    title: 'Machine Learning Basics',
    preview: 'Introduction to supervised and unsupervised learning...',
    messageCount: 12,
    createdAt: new Date('2024-01-12T16:45:00'),
    updatedAt: new Date('2024-01-12T17:20:00'),
    isArchived: false,
    isStarred: true,
    tags: ['ml', 'ai'],
    model: 'gpt-4',
    tokenCount: 2890
  }
];

export const DoubaoConversationHistory: React.FC<DoubaoConversationHistoryProps> = ({
  className,
  conversations = mockConversations,
  onSelectConversation,
  onDeleteConversation,
  onExportConversation,
  onArchiveConversation,
  onStarConversation
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'messages'>('date');
  const [filterBy, setFilterBy] = useState<'all' | 'starred' | 'archived'>('all');
  const [selectedConversations, setSelectedConversations] = useState<string[]>([]);

  const filteredAndSortedConversations = useMemo(() => {
    let filtered = conversations.filter(conv => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status filter
      const matchesFilter = filterBy === 'all' || 
        (filterBy === 'starred' && conv.isStarred) ||
        (filterBy === 'archived' && conv.isArchived);

      return matchesSearch && matchesFilter;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.updatedAt.getTime() - a.updatedAt.getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'messages':
          return b.messageCount - a.messageCount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [conversations, searchQuery, sortBy, filterBy]);

  const handleConversationAction = (action: string, conversationId: string) => {
    switch (action) {
      case 'view':
        onSelectConversation?.(conversationId);
        break;
      case 'star':
        onStarConversation?.(conversationId);
        toast({
          title: "Conversation starred",
          description: "Added to your starred conversations.",
        });
        break;
      case 'archive':
        onArchiveConversation?.(conversationId);
        toast({
          title: "Conversation archived",
          description: "Moved to archived conversations.",
        });
        break;
      case 'export':
        onExportConversation?.(conversationId);
        toast({
          title: "Conversation exported",
          description: "Downloaded as JSON file.",
        });
        break;
      case 'delete':
        onDeleteConversation?.(conversationId);
        toast({
          title: "Conversation deleted",
          description: "Conversation has been permanently deleted.",
          variant: "destructive"
        });
        break;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getModelBadgeColor = (model: string) => {
    switch (model) {
      case 'gpt-4': return 'bg-blue-100 text-blue-800';
      case 'gpt-3.5-turbo': return 'bg-green-100 text-green-800';
      case 'claude-3': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={cn("h-full overflow-auto bg-doubao-bg-secondary", className)}>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <motion.div
          variants={doubaoAnimations.fadeInUp}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-semibold text-doubao-text-primary">Conversation History</h1>
            <p className="text-doubao-text-muted mt-1">
              {filteredAndSortedConversations.length} of {conversations.length} conversations
            </p>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          variants={doubaoAnimations.fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-doubao-text-muted" />
            <Input
              placeholder="Search conversations, tags, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value: 'date' | 'title' | 'messages') => setSortBy(value)}>
              <SelectTrigger className="w-32 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Recent</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="messages">Messages</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterBy} onValueChange={(value: 'all' | 'starred' | 'archived') => setFilterBy(value)}>
              <SelectTrigger className="w-32 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="starred">Starred</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Conversations List */}
        <motion.div
          variants={doubaoAnimations.fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <AnimatePresence>
            {filteredAndSortedConversations.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                variants={doubaoAnimations.fadeInUp}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ delay: index * 0.05 }}
                layout
              >
                <Card className={cn(
                  "hover:shadow-md transition-all duration-200 cursor-pointer",
                  conversation.isArchived && "opacity-60"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 
                            className="font-medium text-doubao-text-primary truncate hover:text-doubao-accent cursor-pointer"
                            onClick={() => handleConversationAction('view', conversation.id)}
                          >
                            {conversation.title}
                          </h3>
                          {conversation.isStarred && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                          {conversation.isArchived && (
                            <Archive className="h-4 w-4 text-doubao-text-muted" />
                          )}
                        </div>
                        
                        <p className="text-sm text-doubao-text-muted mb-3 line-clamp-2">
                          {conversation.preview}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-doubao-text-muted">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {conversation.messageCount} messages
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(conversation.updatedAt)}
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={cn("text-xs", getModelBadgeColor(conversation.model))}
                          >
                            {conversation.model}
                          </Badge>
                          <span>{conversation.tokenCount.toLocaleString()} tokens</span>
                        </div>
                        
                        {conversation.tags.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {conversation.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleConversationAction('view', conversation.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => handleConversationAction('star', conversation.id)}
                            >
                              <Star className="h-4 w-4 mr-2" />
                              {conversation.isStarred ? 'Unstar' : 'Star'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleConversationAction('archive', conversation.id)}
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              {conversation.isArchived ? 'Unarchive' : 'Archive'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleConversationAction('export', conversation.id)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleConversationAction('delete', conversation.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredAndSortedConversations.length === 0 && (
            <motion.div
              variants={doubaoAnimations.fadeInUp}
              initial="hidden"
              animate="visible"
              className="text-center py-12"
            >
              <MessageSquare className="h-12 w-12 text-doubao-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-doubao-text-primary mb-2">
                No conversations found
              </h3>
              <p className="text-doubao-text-muted">
                {searchQuery ? 'Try adjusting your search terms' : 'Start a new conversation to see it here'}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DoubaoConversationHistory;