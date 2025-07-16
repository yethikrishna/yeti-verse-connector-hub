import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/doubao-utils';
import { doubaoAnimations, createSlideAnimation } from '@/lib/doubao-animations';
import { DoubaoMainLayout } from '@/components/doubao/DoubaoMainLayout';
import { DoubaoHeader } from '@/components/doubao/DoubaoHeader';
import { Calculator, Atom, FlaskConical, BookOpen, Clock, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react';

interface QuestionsAnswersProps {}

type Subject = 'math' | 'physics' | 'chemistry' | 'history' | 'biology' | 'literature';
type DifficultyLevel = 'elementary' | 'middle' | 'high' | 'college';
type QuestionType = 'multiple-choice' | 'short-answer' | 'essay' | 'calculation';

const subjects = [
  { id: 'math', label: 'Mathematics', icon: <Calculator size={24} />, color: 'bg-blue-100 text-blue-800', description: 'Algebra, Calculus, Geometry, Statistics' },
  { id: 'physics', label: 'Physics', icon: <Atom size={24} />, color: 'bg-purple-100 text-purple-800', description: 'Mechanics, Thermodynamics, Electromagnetism' },
  { id: 'chemistry', label: 'Chemistry', icon: <FlaskConical size={24} />, color: 'bg-green-100 text-green-800', description: 'Organic, Inorganic, Physical Chemistry' },
  { id: 'history', label: 'History', icon: <BookOpen size={24} />, color: 'bg-amber-100 text-amber-800', description: 'World History, Ancient Civilizations, Modern Era' },
  { id: 'biology', label: 'Biology', icon: <Lightbulb size={24} />, color: 'bg-emerald-100 text-emerald-800', description: 'Cell Biology, Genetics, Ecology, Evolution' },
  { id: 'literature', label: 'Literature', icon: <BookOpen size={24} />, color: 'bg-rose-100 text-rose-800', description: 'Poetry, Novels, Literary Analysis, Writing' },
];

const difficultyLevels = [
  { id: 'elementary', label: 'Elementary', description: 'Grades 1-5', color: 'bg-green-100 text-green-800' },
  { id: 'middle', label: 'Middle School', description: 'Grades 6-8', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'high', label: 'High School', description: 'Grades 9-12', color: 'bg-orange-100 text-orange-800' },
  { id: 'college', label: 'College', description: 'University Level', color: 'bg-red-100 text-red-800' },
];

const questionTypes = [
  { id: 'multiple-choice', label: 'Multiple Choice', description: 'Select the correct answer' },
  { id: 'short-answer', label: 'Short Answer', description: 'Brief written response' },
  { id: 'essay', label: 'Essay', description: 'Detailed explanation' },
  { id: 'calculation', label: 'Calculation', description: 'Step-by-step problem solving' },
];

const sampleQuestions = {
  math: {
    elementary: "If Sarah has 15 apples and gives away 7 apples, how many apples does she have left?",
    middle: "Solve for x: 3x + 7 = 22",
    high: "Find the derivative of f(x) = 3x² + 2x - 5",
    college: "Evaluate the integral ∫(2x³ - 4x + 1)dx from 0 to 2"
  },
  physics: {
    elementary: "Why do objects fall down instead of up?",
    middle: "A ball is thrown upward with an initial velocity of 20 m/s. How high will it go?",
    high: "Calculate the force needed to accelerate a 5kg object at 3 m/s²",
    college: "Derive the wave equation for electromagnetic radiation in vacuum"
  },
  chemistry: {
    elementary: "What happens when you mix baking soda and vinegar?",
    middle: "Balance the equation: H₂ + O₂ → H₂O",
    high: "Calculate the molarity of a solution containing 58.5g of NaCl in 500mL of water",
    college: "Explain the mechanism of SN2 nucleophilic substitution reactions"
  },
  history: {
    elementary: "Who was the first President of the United States?",
    middle: "What were the main causes of World War I?",
    high: "Analyze the impact of the Industrial Revolution on society",
    college: "Compare and contrast the political philosophies of Locke and Rousseau"
  }
};

interface SolutionStep {
  step: number;
  title: string;
  content: string;
  formula?: string;
}

export const QuestionsAnswers: React.FC<QuestionsAnswersProps> = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject>('math');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('middle');
  const [selectedQuestionType, setSelectedQuestionType] = useState<QuestionType>('calculation');
  const [question, setQuestion] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [solution, setSolution] = useState<{
    answer: string;
    steps: SolutionStep[];
    explanation: string;
  } | null>(null);

  const handleAnalyze = async () => {
    if (!question.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      const mockSolution = generateMockSolution(question, selectedSubject, selectedDifficulty);
      setSolution(mockSolution);
      setIsAnalyzing(false);
    }, 2500);
  };

  const generateMockSolution = (q: string, subject: Subject, difficulty: DifficultyLevel) => {
    // Generate mock solution based on subject
    const solutions = {
      math: {
        answer: "x = 5",
        steps: [
          { step: 1, title: "Start with the equation", content: "3x + 7 = 22", formula: "3x + 7 = 22" },
          { step: 2, title: "Subtract 7 from both sides", content: "Isolate the term with x", formula: "3x = 22 - 7 = 15" },
          { step: 3, title: "Divide both sides by 3", content: "Solve for x", formula: "x = 15 ÷ 3 = 5" },
        ],
        explanation: "This is a linear equation. We use inverse operations to isolate the variable x."
      },
      physics: {
        answer: "F = 15 N",
        steps: [
          { step: 1, title: "Identify given values", content: "Mass (m) = 5 kg, Acceleration (a) = 3 m/s²" },
          { step: 2, title: "Apply Newton's Second Law", content: "Force equals mass times acceleration", formula: "F = ma" },
          { step: 3, title: "Calculate the force", content: "Substitute the values", formula: "F = 5 kg × 3 m/s² = 15 N" },
        ],
        explanation: "Newton's Second Law states that the force acting on an object is equal to its mass multiplied by its acceleration."
      },
      chemistry: {
        answer: "2H₂ + O₂ → 2H₂O",
        steps: [
          { step: 1, title: "Count atoms on each side", content: "Left: 2H, 2O | Right: 2H, 1O" },
          { step: 2, title: "Balance hydrogen atoms", content: "Add coefficient 2 to H₂O", formula: "H₂ + O₂ → 2H₂O" },
          { step: 3, title: "Balance oxygen atoms", content: "Add coefficient 2 to H₂", formula: "2H₂ + O₂ → 2H₂O" },
        ],
        explanation: "Chemical equations must be balanced to follow the law of conservation of mass."
      },
      history: {
        answer: "Multiple interconnected causes led to WWI",
        steps: [
          { step: 1, title: "Imperialism", content: "European powers competed for colonies and resources globally" },
          { step: 2, title: "Alliance System", content: "Complex web of alliances created opposing blocs (Triple Alliance vs Triple Entente)" },
          { step: 3, title: "Nationalism", content: "Ethnic tensions and independence movements, especially in the Balkans" },
          { step: 4, title: "Immediate Trigger", content: "Assassination of Archduke Franz Ferdinand in Sarajevo (June 28, 1914)" },
        ],
        explanation: "World War I resulted from a combination of long-term structural causes and immediate triggers that escalated a regional conflict into a global war."
      }
    };

    return solutions[subject] || solutions.math;
  };

  const handleUseSample = () => {
    const samples = sampleQuestions[selectedSubject];
    if (samples) {
      const sampleQuestion = samples[selectedDifficulty];
      if (sampleQuestion) {
        setQuestion(sampleQuestion);
      }
    }
  };

  const currentSubject = subjects.find(s => s.id === selectedSubject);

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
                ❓ Questions & Answers
              </h1>
              <p className="doubao-text-base text-doubao-text-secondary">
                Get step-by-step solutions for math, science, and humanities problems with detailed explanations.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
              {/* Main Content */}
              <div className="xl:col-span-3 space-y-6">
                {/* Subject Selection */}
                <motion.div
                  variants={createSlideAnimation('up')}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.1 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Select Subject
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {subjects.map((subject) => (
                      <motion.button
                        key={subject.id}
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setSelectedSubject(subject.id as Subject)}
                        className={cn(
                          'p-4 rounded-lg border-2 text-left doubao-transition-colors',
                          selectedSubject === subject.id
                            ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                            : 'border-doubao-border-light hover:border-doubao-border-medium'
                        )}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={cn('p-2 rounded-lg', subject.color)}>
                            {subject.icon}
                          </div>
                          <div className="doubao-text-base font-medium text-doubao-text-primary">
                            {subject.label}
                          </div>
                        </div>
                        <div className="doubao-text-sm text-doubao-text-muted">
                          {subject.description}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Difficulty and Question Type */}
                <motion.div
                  variants={createSlideAnimation('up')}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.2 }}
                  className="doubao-card-base p-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Difficulty Level */}
                    <div>
                      <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                        Difficulty Level
                      </h3>
                      <div className="space-y-2">
                        {difficultyLevels.map((level) => (
                          <motion.button
                            key={level.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setSelectedDifficulty(level.id as DifficultyLevel)}
                            className={cn(
                              'w-full p-3 rounded-lg border text-left doubao-transition-colors',
                              selectedDifficulty === level.id
                                ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                                : 'border-doubao-border-light hover:border-doubao-border-medium'
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="doubao-text-sm font-medium text-doubao-text-primary">
                                  {level.label}
                                </div>
                                <div className="doubao-text-xs text-doubao-text-muted">
                                  {level.description}
                                </div>
                              </div>
                              <span className={cn('px-2 py-1 rounded text-xs font-medium', level.color)}>
                                {level.id.toUpperCase()}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Question Type */}
                    <div>
                      <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                        Question Type
                      </h3>
                      <div className="space-y-2">
                        {questionTypes.map((type) => (
                          <motion.button
                            key={type.id}
                            variants={doubaoAnimations.buttonVariants}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={() => setSelectedQuestionType(type.id as QuestionType)}
                            className={cn(
                              'w-full p-3 rounded-lg border text-left doubao-transition-colors',
                              selectedQuestionType === type.id
                                ? 'border-doubao-primary-blue bg-doubao-secondary-blue/10'
                                : 'border-doubao-border-light hover:border-doubao-border-medium'
                            )}
                          >
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
                  </div>
                </motion.div>

                {/* Question Input */}
                <motion.div
                  variants={createSlideAnimation('up')}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.3 }}
                  className="doubao-card-base p-6"
                >
                  <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                    Enter Your Question
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block doubao-text-sm font-medium text-doubao-text-primary mb-2">
                        Question *
                      </label>
                      <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder={`Enter your ${currentSubject?.label.toLowerCase()} question here...`}
                        rows={4}
                        className="w-full doubao-input-base resize-none"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <motion.button
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={handleUseSample}
                        className="doubao-text-sm text-doubao-primary-blue hover:text-doubao-primary-blue/80 doubao-transition-colors"
                      >
                        Use sample question
                      </motion.button>
                      <motion.button
                        variants={doubaoAnimations.buttonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        onClick={handleAnalyze}
                        disabled={!question.trim() || isAnalyzing}
                        className={cn(
                          'doubao-button-primary px-6 py-3',
                          (!question.trim() || isAnalyzing) && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        {isAnalyzing ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Analyzing...
                          </div>
                        ) : (
                          '🔍 Analyze & Solve'
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* Solution Display */}
                {solution && (
                  <motion.div
                    variants={createSlideAnimation('up')}
                    initial="hidden"
                    animate="visible"
                    className="doubao-card-base p-6"
                  >
                    <h3 className="doubao-text-lg font-semibold text-doubao-text-primary mb-4">
                      Step-by-Step Solution
                    </h3>
                    
                    {/* Answer */}
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="text-green-600" size={20} />
                        <span className="doubao-text-base font-semibold text-green-800">Answer</span>
                      </div>
                      <div className="doubao-text-lg font-mono text-green-900">
                        {solution.answer}
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-4 mb-6">
                      <h4 className="doubao-text-base font-semibold text-doubao-text-primary">
                        Solution Steps:
                      </h4>
                      {solution.steps.map((step, index) => (
                        <motion.div
                          key={step.step}
                          variants={createSlideAnimation('up')}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: index * 0.1 }}
                          className="flex gap-4 p-4 bg-doubao-bg-secondary rounded-lg"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-doubao-primary-blue text-white rounded-full flex items-center justify-center doubao-text-sm font-semibold">
                            {step.step}
                          </div>
                          <div className="flex-1">
                            <div className="doubao-text-base font-medium text-doubao-text-primary mb-1">
                              {step.title}
                            </div>
                            <div className="doubao-text-sm text-doubao-text-secondary mb-2">
                              {step.content}
                            </div>
                            {step.formula && (
                              <div className="p-2 bg-white border rounded font-mono doubao-text-sm text-doubao-text-primary">
                                {step.formula}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Explanation */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="text-blue-600" size={20} />
                        <span className="doubao-text-base font-semibold text-blue-800">Explanation</span>
                      </div>
                      <div className="doubao-text-sm text-blue-900">
                        {solution.explanation}
                      </div>
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
                    Current Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Subject</div>
                      <div className="flex items-center gap-2">
                        <div className={cn('p-1 rounded', currentSubject?.color)}>
                          {currentSubject?.icon}
                        </div>
                        <div className="doubao-text-base font-medium text-doubao-text-primary">
                          {currentSubject?.label}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Difficulty</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {difficultyLevels.find(d => d.id === selectedDifficulty)?.label}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Question Type</div>
                      <div className="doubao-text-base font-medium text-doubao-text-primary">
                        {questionTypes.find(t => t.id === selectedQuestionType)?.label}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-doubao-bg-secondary rounded-lg">
                      <div className="doubao-text-sm text-doubao-text-muted mb-2">Features</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <ArrowRight size={14} />
                          <span className="doubao-text-sm text-doubao-text-primary">Step-by-step solutions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight size={14} />
                          <span className="doubao-text-sm text-doubao-text-primary">Detailed explanations</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight size={14} />
                          <span className="doubao-text-sm text-doubao-text-primary">Formula breakdowns</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowRight size={14} />
                          <span className="doubao-text-sm text-doubao-text-primary">Sample questions</span>
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

export default QuestionsAnswers;