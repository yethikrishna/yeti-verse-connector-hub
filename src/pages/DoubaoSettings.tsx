import React from 'react';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';
import { DoubaoSettingsPanel } from '@/components/doubao/DoubaoSettingsPanel';

const DoubaoSettings: React.FC = () => {
  return (
    <DoubaoMainLayout>
      <DoubaoHeader />
      <DoubaoSettingsPanel />
    </DoubaoMainLayout>
  );
};

export default DoubaoSettings;