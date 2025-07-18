import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations } from '@/lib/doubao-animations';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';

interface AIProgrammingProps {}

type ProgrammingLanguage = 'python' | 'javascript' | 'java' | 'cpp' | 'csharp' | 'go' | 'rust' | 'php' | 'ruby' | 'swift';
type TaskType = 'write' | 'debug' | 'optimize' | 'explain' | 'convert';

const programmingLanguages = [
  { id: 'python', label: 'Python', icon: '🐍', color: 'bg-yellow-500' },
  { id: 'javascript', label: 'JavaScript', icon: '🟨', color: 'bg-yellow-400' },
  { id: 'java', label: 'Java', icon: '☕', color: 'bg-red-600' },
  { id: 'cpp', label: 'C++', icon: '⚡', color: 'bg-blue-600' },
  { id: 'csharp', label: 'C#', icon: '#️⃣', color: 'bg-purple-600' },
  { id: 'go', label: 'Go', icon: '🔷', color: 'bg-cyan-500' },
  { id: 'rust', label: 'Rust', icon: '🦀', color: 'bg-orange-600' },
  { id: 'php', label: 'PHP', icon: '🐘', color: 'bg-indigo-600' },
  { id: 'ruby', label: 'Ruby', icon: '💎', color: 'bg-red-500' },
  { id: 'swift', label: 'Swift', icon: '🦉', color: 'bg-orange-500' },
];

const taskTypes = [
  { 
    id: 'write', 
    label: 'Write Code', 
    icon: '✍️', 
    description: 'Generate code from description',
    placeholder: 'Describe what you want to build...'
  },
  { 
    id: 'debug', 
    label: 'Debug Code', 
    icon: '🐛', 
    description: 'Find and fix bugs in existing code',
    placeholder: 'Paste your code that needs debugging...'
  },
  { 
    id: 'optimize', 
    label: 'Optimize Code', 
    icon: '⚡', 
    description: 'Improve performance and efficiency',
    placeholder: 'Paste code to optimize...'
  },
  { 
    id: 'explain', 
    label: 'Explain Code', 
    icon: '📖', 
    description: 'Get detailed explanations of code',
    placeholder: 'Paste code to explain...'
  },
  { 
    id: 'convert', 
    label: 'Convert Code', 
    icon: '🔄', 
    description: 'Convert between programming languages',
    placeholder: 'Paste code to convert...'
  },
];

export const AIProgramming: React.FC<AIProgrammingProps> = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>('python');
  const [selectedTask, setSelectedTask] = useState<TaskType>('write');
  const [targetLanguage, setTargetLanguage] = useState<ProgrammingLanguage>('javascript');
  const [codeInput, setCodeInput] = useState('');
  const [requirements, setRequirements] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    if (!codeInput.trim() && !requirements.trim()) return;
    
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  const currentTask = taskTypes.find(t => t.id === selectedTask);

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
              variants={doubaoAnimations.messageVariants}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <h1 className="doubao-text-2xl text-doubao-text-primary mb-2">
                💻 AI Programming Assistant
              </h1>
              <p className="doubao-text-base text-doubao-text-secondary">
                Write, debug, optimize, and explain code with AI assistance across multiple programming languages.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Task Selection */}
              <div className="xl:col-span-1">
                <motion.div
                  variants={doubaoAnimations.staggerItem}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="doubao-card-base p-6 sticky top-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Task Type
                  </h3>
                  <div className="space-y-2">
                    {taskTypes.map((task) => (
                      <motion.button
                        key={task.id}
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setSelectedTask(task.id as TaskType)}
                        className={cn(
                          'w-full p-4 rounded-lg border text-left doubao-transition-colors',
                          selectedTask === task.id
                            ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                            : 'border-doubao-border-light hover:border-doubao-border-medium'
                        )}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg">{task.icon}</span>
                          <span className="doubao-text-sm font-medium text-doubao-text-primary">
                            {task.label}
                          </span>
                        </div>
                        <div className="doubao-text-xs text-doubao-text-muted">
                          {task.description}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Main Content */}
              <div className="xl:col-span-3 space-y-6">
                {/* Language Selection */}
                <motion.div
                  variants={doubaoAnimations.staggerItem}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Programming Language
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {programmingLanguages.map((lang) => (
                      <motion.button
                        key={lang.id}
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setSelectedLanguage(lang.id as ProgrammingLanguage)}
                        className={cn(
                          'p-3 rounded-lg border-2 text-center doubao-transition-colors',
                          selectedLanguage === lang.id
                            ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                            : 'border-doubao-border-light hover:border-doubao-border-medium'
                        )}
                      >
                        <div className="text-2xl mb-1">{lang.icon}</div>
                        <div className="doubao-text-xs font-medium text-doubao-text-primary">
                          {lang.label}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Convert Target Language (only for convert task) */}
                {selectedTask === 'convert' && (
                  <motion.div
                    variants={doubaoAnimations.staggerItem}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.25 }}
                    className="doubao-card-base p-6"
                  >
                    <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                      Convert To
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                      {programmingLanguages.filter(lang => lang.id !== selectedLanguage).map((lang) => (
                        <motion.button
                          key={lang.id}
                          variants={doubaoAnimations.buttonVariants}
                          initial="rest"
                          whileHover="hover"
                          whileTap="tap"
                          onClick={() => setTargetLanguage(lang.id as ProgrammingLanguage)}
                          className={cn(
                            'p-3 rounded-lg border-2 text-center doubao-transition-colors',
                            targetLanguage === lang.id
                              ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                              : 'border-doubao-border-light hover:border-doubao-border-medium'
                          )}
                        >
                          <div className="text-2xl mb-1">{lang.icon}</div>
                          <div className="doubao-text-xs font-medium text-doubao-text-primary">
                            {lang.label}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Code Input */}
                <motion.div
                  variants={doubaoAnimations.staggerItem}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    {selectedTask === 'write' ? 'Requirements' : 'Code Input'}
                  </h3>
                  <div className="space-y-4">
                    <textarea
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      placeholder={currentTask?.placeholder}
                      rows={12}
                      className="w-full doubao-input-base font-mono text-sm resize-none"
                    />
                    
                    {selectedTask === 'write' && (
                      <div>
                        <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-2">
                          Additional Requirements
                        </label>
                        <textarea
                          value={requirements}
                          onChange={(e) => setRequirements(e.target.value)}
                          placeholder="Any specific requirements, constraints, or preferences..."
                          rows={4}
                          className="w-full doubao-input-base resize-none"
                        />
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Action Button */}
                <motion.div
                  variants={doubaoAnimations.staggerItem}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                >
                  <motion.button
                    variants={doubaoAnimations.buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleProcess}
                    disabled={(!codeInput.trim() && !requirements.trim()) || isProcessing}
                    className={cn(
                      'w-full doubao-button-primary py-4 text-lg',
                      ((!codeInput.trim() && !requirements.trim()) || isProcessing) && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <>
                        {currentTask?.icon} {currentTask?.label}
                      </>
                    )}
                  </motion.button>
                </motion.div>

                {/* Quick Examples */}
                <motion.div
                  variants={doubaoAnimations.staggerItem}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.5 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Quick Examples
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="doubao-text-sm font-medium text-doubao-text-primary">
                        Code Writing Examples:
                      </h4>
                      <div className="space-y-2">
                        <button 
                          onClick={() => setCodeInput('Create a function to sort an array of numbers')}
                          className="block w-full text-left p-3 bg-doubao-bg-secondary rounded-lg hover:bg-doubao-hover doubao-transition-colors"
                        >
                          <div className="doubao-text-sm text-doubao-text-primary">Sort array function</div>
                        </button>
                        <button 
                          onClick={() => setCodeInput('Build a REST API endpoint for user authentication')}
                          className="block w-full text-left p-3 bg-doubao-bg-secondary rounded-lg hover:bg-doubao-hover doubao-transition-colors"
                        >
                          <div className="doubao-text-sm text-doubao-text-primary">REST API endpoint</div>
                        </button>
                        <button 
                          onClick={() => setCodeInput('Create a class for managing database connections')}
                          className="block w-full text-left p-3 bg-doubao-bg-secondary rounded-lg hover:bg-doubao-hover doubao-transition-colors"
                        >
                          <div className="doubao-text-sm text-doubao-text-primary">Database connection class</div>
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="doubao-text-sm font-medium text-doubao-text-primary">
                        Debug Examples:
                      </h4>
                      <div className="space-y-2">
                        <button 
                          onClick={() => setCodeInput('def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\n# This is too slow for large n')}
                          className="block w-full text-left p-3 bg-doubao-bg-secondary rounded-lg hover:bg-doubao-hover doubao-transition-colors"
                        >
                          <div className="doubao-text-sm text-doubao-text-primary">Slow fibonacci function</div>
                        </button>
                        <button 
                          onClick={() => setCodeInput('for i in range(10):\n    print(f"Number: {j}")\n\n# NameError: name \'j\' is not defined')}
                          className="block w-full text-left p-3 bg-doubao-bg-secondary rounded-lg hover:bg-doubao-hover doubao-transition-colors"
                        >
                          <div className="doubao-text-sm text-doubao-text-primary">Variable name error</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DoubaoMainLayout>
  );
};

export default AIProgramming;