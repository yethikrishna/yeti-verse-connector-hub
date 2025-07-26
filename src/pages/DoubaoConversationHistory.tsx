import React from 'react';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';
import { DoubaoConversationHistory } from '@/components/doubao/DoubaoConversationHistory';

const DoubaoConversationHistoryPage: React.FC = () => {
  const handleSelectConversation = (id: string) => {
    console.log('Selected conversation:', id);
    // Navigate to conversation or open in chat interface
  };

  const handleDeleteConversation = (id: string) => {
    console.log('Delete conversation:', id);
    // Implement delete logic
  };

  const handleExportConversation = (id: string) => {
    console.log('Export conversation:', id);
    // Implement export logic
  };

  const handleArchiveConversation = (id: string) => {
    console.log('Archive conversation:', id);
    // Implement archive logic
  };

  const handleStarConversation = (id: string) => {
    console.log('Star conversation:', id);
    // Implement star/unstar logic
  };

  return (
    <DoubaoMainLayout>
      <DoubaoHeader />
      <DoubaoConversationHistory
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onExportConversation={handleExportConversation}
        onArchiveConversation={handleArchiveConversation}
        onStarConversation={handleStarConversation}
      />
    </DoubaoMainLayout>
  );
};

export default DoubaoConversationHistoryPage;