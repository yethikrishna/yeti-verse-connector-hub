import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations, createSlideAnimation } from '@/lib/doubao-animations';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';
import { ArrowLeftRight, Copy, Volume2, BookOpen, FileText, Zap } from 'lucide-react';

interface TranslationProps {}

type TranslationMode = 'full-text' | 'phrase';
type LanguagePair = 'zh-en' | 'en-zh' | 'zh-ja' | 'ja-zh' | 'en-ja' | 'ja-en' | 'zh-ko' | 'ko-zh' | 'en-fr' | 'fr-en' | 'en-es' | 'es-en';
type SpecialtyType = 'general' | 'technical' | 'legal' | 'medical' | 'business' | 'academic';

const languagePairs = [
  { id: 'zh-en', from: 'Chinese', to: 'English', flag: '🇨🇳→🇺🇸' },
  { id: 'en-zh', from: 'English', to: 'Chinese', flag: '🇺🇸→🇨🇳' },
  { id: 'zh-ja', from: 'Chinese', to: 'Japanese', flag: '🇨🇳→🇯🇵' },
  { id: 'ja-zh', from: 'Japanese', to: 'Chinese', flag: '🇯🇵→🇨🇳' },
  { id: 'en-ja', from: 'English', to: 'Japanese', flag: '🇺🇸→🇯🇵' },
  { id: 'ja-en', from: 'Japanese', to: 'English', flag: '🇯🇵→🇺🇸' },
  { id: 'zh-ko', from: 'Chinese', to: 'Korean', flag: '🇨🇳→🇰🇷' },
  { id: 'ko-zh', from: 'Korean', to: 'Chinese', flag: '🇰🇷→🇨🇳' },
  { id: 'en-fr', from: 'English', to: 'French', flag: '🇺🇸→🇫🇷' },
  { id: 'fr-en', from: 'French', to: 'English', flag: '🇫🇷→🇺🇸' },
  { id: 'en-es', from: 'English', to: 'Spanish', flag: '🇺🇸→🇪🇸' },
  { id: 'es-en', from: 'Spanish', to: 'English', flag: '🇪🇸→🇺🇸' },
];

const specialtyTypes = [
  { id: 'general', label: 'General', icon: '💬', description: 'Everyday language and common phrases' },
  { id: 'technical', label: 'Technical', icon: '⚙️', description: 'Engineering, IT, and technical terminology' },
  { id: 'legal', label: 'Legal', icon: '⚖️', description: 'Legal documents and juridical terms' },
  { id: 'medical', label: 'Medical', icon: '🏥', description: 'Medical and healthcare terminology' },
  { id: 'business', label: 'Business', icon: '💼', description: 'Corporate and financial language' },
  { id: 'academic', label: 'Academic', icon: '🎓', description: 'Scholarly and research terminology' },
];

const translationModes = [
  { id: 'full-text', label: 'Full Text', icon: '📄', description: 'Translate entire documents or paragraphs' },
  { id: 'phrase', label: 'Phrase', icon: '💭', description: 'Translate individual words or short phrases' },
];

const sampleTexts = {
  'zh-en': {
    general: '你好，今天天气很好。',
    technical: '这个算法的时间复杂度是O(n log n)。',
    legal: '根据合同条款，甲方有义务按时履行协议。',
    medical: '患者出现急性心肌梗死的症状。',
    business: '我们需要制定一个全面的市场营销策略。',
    academic: '这项研究采用了定量分析方法。'
  },
  'en-zh': {
    general: 'Hello, the weather is very nice today.',
    technical: 'The time complexity of this algorithm is O(n log n).',
    legal: 'According to the contract terms, Party A is obligated to fulfill the agreement on time.',
    medical: 'The patient shows symptoms of acute myocardial infarction.',
    business: 'We need to develop a comprehensive marketing strategy.',
    academic: 'This research employed quantitative analysis methods.'
  }
};

export const Translation: React.FC<TranslationProps> = () => {
  const [selectedLanguagePair, setSelectedLanguagePair] = useState<LanguagePair>('zh-en');
  const [selectedMode, setSelectedMode] = useState<TranslationMode>('full-text');
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyType>('general');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationHistory, setTranslationHistory] = useState<Array<{
    id: string;
    source: string;
    target: string;
    languagePair: LanguagePair;
    specialty: SpecialtyType;
    timestamp: Date;
  }>>([]);

  const handleLanguageSwap = () => {
    const currentPair = languagePairs.find(pair => pair.id === selectedLanguagePair);
    if (!currentPair) return;

    // Find the reverse language pair
    const reversePairId = `${selectedLanguagePair.split('-')[1]}-${selectedLanguagePair.split('-')[0]}` as LanguagePair;
    const reversePair = languagePairs.find(pair => pair.id === reversePairId);
    
    if (reversePair) {
      setSelectedLanguagePair(reversePairId);
      // Swap the text content
      setSourceText(translatedText);
      setTranslatedText(sourceText);
    }
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    setIsTranslating(true);
    
    // Simulate translation process
    setTimeout(() => {
      // In a real implementation, this would call a translation API
      const mockTranslation = generateMockTranslation(sourceText, selectedLanguagePair, selectedSpecialty);
      setTranslatedText(mockTranslation);
      
      // Add to history
      const newTranslation = {
        id: Date.now().toString(),
        source: sourceText,
        target: mockTranslation,
        languagePair: selectedLanguagePair,
        specialty: selectedSpecialty,
        timestamp: new Date(),
      };
      setTranslationHistory(prev => [newTranslation, ...prev.slice(0, 9)]); // Keep last 10
      
      setIsTranslating(false);
    }, 1500);
  };

  const generateMockTranslation = (text: string, langPair: LanguagePair, specialty: SpecialtyType): string => {
    // Simple mock translation logic
    const translations: Record<string, string> = {
      '你好': 'Hello',
      '今天': 'today',
      '天气': 'weather',
      '很好': 'very good',
      'Hello': '你好',
      'today': '今天',
      'weather': '天气',
      'very good': '很好',
    };

    // For demo purposes, return a mock translation
    if (langPair === 'zh-en') {
      return text.includes('你好') ? 'Hello, the weather is very nice today.' : `[${specialty.toUpperCase()}] Translated: ${text}`;
    } else if (langPair === 'en-zh') {
      return text.includes('Hello') ? '你好，今天天气很好。' : `[${specialty.toUpperCase()}] 翻译：${text}`;
    }
    
    return `[${specialty.toUpperCase()}] Translation of: ${text}`;
  };

  const handleCopyTranslation = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
    }
  };

  const handleUseSample = () => {
    const samples = sampleTexts[selectedLanguagePair as keyof typeof sampleTexts];
    if (samples) {
      const sampleText = samples[selectedSpecialty as keyof typeof samples];
      if (sampleText) {
        setSourceText(sampleText);
      }
    }
  };

  const handleSpeakText = (text: string, isSource: boolean = true) => {
    if ('speechSynthesis' in window && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      const langPair = selectedLanguagePair.split('-');
      const lang = isSource ? langPair[0] : langPair[1];
      
      // Map language codes to speech synthesis language codes
      const langMap: Record<string, string> = {
        'zh': 'zh-CN',
        'en': 'en-US',
        'ja': 'ja-JP',
        'ko': 'ko-KR',
        'fr': 'fr-FR',
        'es': 'es-ES',
      };
      
      utterance.lang = langMap[lang] || 'en-US';
      speechSynthesis.speak(utterance);
    }
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
              variants={createSlideAnimation('up')}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <h1 className="doubao-text-2xl text-doubao-text-primary mb-2">
                🌐 Translation
              </h1>
              <p className="doubao-text-base text-doubao-text-secondary">
                Professional translation service supporting multiple languages and specialized terminology.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Main Translation Panel */}
              <div className="xl:col-span-3 space-y-6">
                {/* Language Selection and Mode */}
                <motion.div
                  variants={createSlideAnimation('up')}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="doubao-card-base p-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Language Pair Selection */}
                    <div>
                      <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                        Language Pair
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                        {languagePairs.map((pair) => (
                          <motion.button
                            key={pair.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setSelectedLanguagePair(pair.id as LanguagePair)}
                            className={cn(
                              'p-3 rounded-lg border text-left doubao-transition-colors',
                              selectedLanguagePair === pair.id
                                ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                                : 'border-doubao-border-light hover:border-doubao-border-medium'
                            )}
                          >
                            <div className="doubao-text-sm font-medium text-doubao-text-primary">
                              {pair.flag} {pair.from} → {pair.to}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                      
                      <motion.button
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={handleLanguageSwap}
                        className="w-full p-2 rounded-lg border border-doubao-border-light hover:border-doubao-border-medium doubao-transition-colors flex items-center justify-center gap-2"
                      >
                        <ArrowLeftRight size={16} />
                        <span className="doubao-text-sm">Swap Languages</span>
                      </motion.button>
                    </div>

                    {/* Translation Mode and Specialty */}
                    <div>
                      <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                        Translation Mode
                      </h3>
                      <div className="space-y-2 mb-4">
                        {translationModes.map((mode) => (
                          <motion.button
                            key={mode.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setSelectedMode(mode.id as TranslationMode)}
                            className={cn(
                              'w-full p-3 rounded-lg border text-left doubao-transition-colors',
                              selectedMode === mode.id
                                ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                                : 'border-doubao-border-light hover:border-doubao-border-medium'
                            )}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{mode.icon}</span>
                              <span className="doubao-text-sm font-medium text-doubao-text-primary">
                                {mode.label}
                              </span>
                            </div>
                            <div className="doubao-text-xs text-doubao-text-muted">
                              {mode.description}
                            </div>
                          </motion.button>
                        ))}
                      </div>

                      <h4 className="doubao-text-base font-semibold text-doubao-text-primary mb-3">
                        Specialty
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {specialtyTypes.map((specialty) => (
                          <motion.button
                            key={specialty.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setSelectedSpecialty(specialty.id as SpecialtyType)}
                            className={cn(
                              'p-2 rounded-lg border text-center doubao-transition-colors',
                              selectedSpecialty === specialty.id
                                ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                                : 'border-doubao-border-light hover:border-doubao-border-medium'
                            )}
                          >
                            <div className="text-sm mb-1">{specialty.icon}</div>
                            <div className="doubao-text-xs font-medium text-doubao-text-primary">
                              {specialty.label}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Translation Interface */}
                <motion.div
                  variants={createSlideAnimation('up')}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="doubao-card-base p-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Source Text */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="doubao-text-lg font-semibold text-doubao-text-primary">
                          {languagePairs.find(p => p.id === selectedLanguagePair)?.from}
                        </h3>
                        <div className="flex gap-2">
                          <motion.button
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={handleUseSample}
                            className="p-2 rounded-lg border border-doubao-border-light hover:border-doubao-border-medium doubao-transition-colors"
                            title="Use Sample Text"
                          >
                            <Zap size={16} />
                          </motion.button>
                          <motion.button
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => handleSpeakText(sourceText, true)}
                            disabled={!sourceText}
                            className="p-2 rounded-lg border border-doubao-border-light hover:border-doubao-border-medium doubao-transition-colors disabled:opacity-50"
                            title="Speak Text"
                          >
                            <Volume2 size={16} />
                          </motion.button>
                        </div>
                      </div>
                      <textarea
                        value={sourceText}
                        onChange={(e) => setSourceText(e.target.value)}
                        placeholder={`Enter text in ${languagePairs.find(p => p.id === selectedLanguagePair)?.from}...`}
                        rows={selectedMode === 'phrase' ? 3 : 8}
                        className="w-full doubao-input-base resize-none"
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className="doubao-text-xs text-doubao-text-muted">
                          {sourceText.length} characters
                        </span>
                        <motion.button
                          variants={doubaoAnimations.buttonVariants}
                          initial="rest"
                          whileHover="hover"
                          whileTap="tap"
                          onClick={handleTranslate}
                          disabled={!sourceText.trim() || isTranslating}
                          className={cn(
                            'doubao-button-primary px-4 py-2',
                            (!sourceText.trim() || isTranslating) && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          {isTranslating ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Translating...
                            </div>
                          ) : (
                            'Translate'
                          )}
                        </motion.button>
                      </div>
                    </div>

                    {/* Translated Text */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="doubao-text-lg font-semibold text-doubao-text-primary">
                          {languagePairs.find(p => p.id === selectedLanguagePair)?.to}
                        </h3>
                        <div className="flex gap-2">
                          <motion.button
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={handleCopyTranslation}
                            disabled={!translatedText}
                            className="p-2 rounded-lg border border-doubao-border-light hover:border-doubao-border-medium doubao-transition-colors disabled:opacity-50"
                            title="Copy Translation"
                          >
                            <Copy size={16} />
                          </motion.button>
                          <motion.button
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => handleSpeakText(translatedText, false)}
                            disabled={!translatedText}
                            className="p-2 rounded-lg border border-doubao-border-light hover:border-doubao-border-medium doubao-transition-colors disabled:opacity-50"
                            title="Speak Translation"
                          >
                            <Volume2 size={16} />
                          </motion.button>
                        </div>
                      </div>
                      <div className={cn(
                        'w-full min-h-[200px] p-4 rounded-lg border bg-doubao-bg-secondary',
                        selectedMode === 'phrase' ? 'min-h-[120px]' : 'min-h-[200px]'
                      )}>
                        {translatedText ? (
                          <div className="doubao-text-base text-doubao-text-primary whitespace-pre-wrap">
                            {translatedText}
                          </div>
                        ) : (
                          <div className="doubao-text-base text-doubao-text-muted italic">
                            Translation will appear here...
                          </div>
                        )}
                      </div>
                      {translatedText && (
                        <div className="flex justify-between items-center mt-2">
                          <span className="doubao-text-xs text-doubao-text-muted">
                            {translatedText.length} characters
                          </span>
                          <span className="doubao-text-xs text-doubao-text-muted">
                            {selectedSpecialty.charAt(0).toUpperCase() + selectedSpecialty.slice(1)} Translation
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Translation History */}
                {translationHistory.length > 0 && (
                  <motion.div
                    variants={createSlideAnimation('up')}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.3 }}
                    className="doubao-card-base p-6"
                  >
                    <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                      Recent Translations
                    </h3>
                    <div className="space-y-3">
                      {translationHistory.slice(0, 5).map((item) => (
                        <div key={item.id} className="p-4 bg-doubao-bg-secondary rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="doubao-text-sm font-medium text-doubao-text-primary">
                              {languagePairs.find(p => p.id === item.languagePair)?.flag} {item.specialty}
                            </span>
                            <span className="doubao-text-xs text-doubao-text-muted">
                              {item.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <div className="doubao-text-xs text-doubao-text-muted mb-1">Source</div>
                              <div className="doubao-text-sm text-doubao-text-primary">
                                {item.source.length > 100 ? `${item.source.substring(0, 100)}...` : item.source}
                              </div>
                            </div>
                            <div>
                              <div className="doubao-text-xs text-doubao-text-muted mb-1">Translation</div>
                              <div className="doubao-text-sm text-doubao-text-primary">
                                {item.target.length > 100 ? `${item.target.substring(0, 100)}...` : item.target}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Settings Panel */}
              <div className="xl:col-span-1">
                <motion.div
                  variants={createSlideAnimation('up')}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4 }}
                  className="doubao-card-base p-6 sticky top-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Translation Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Language Pair</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {languagePairs.find(p => p.id === selectedLanguagePair)?.flag}
                      </div>
                      <div className="doubao-text-sm text-doubao-text-primary">
                        {languagePairs.find(p => p.id === selectedLanguagePair)?.from} → {languagePairs.find(p => p.id === selectedLanguagePair)?.to}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Mode</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {translationModes.find(m => m.id === selectedMode)?.label}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Specialty</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {specialtyTypes.find(s => s.id === selectedSpecialty)?.label}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Features</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Volume2 size={14} />
                          <span className="doubao-text-sm text-doubao-text-primary">Text-to-Speech</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Copy size={14} />
                          <span className="doubao-text-sm text-doubao-text-primary">Copy Translation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen size={14} />
                          <span className="doubao-text-sm text-doubao-text-primary">Translation History</span>
                        </div>
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

export default Translation;