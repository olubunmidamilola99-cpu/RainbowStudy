export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Fast-Track';

export type UserRole = 'student' | 'teacher';

export type ThemePreset = 'starlight' | 'sunset' | 'emerald' | 'daylight' | 'twilight';

export type FontFamilyChoice = 'sans' | 'serif' | 'mono' | 'dyslexic' | 'display' | 'rounded' | 'handwriting' | 'modern';

export type FontScaleChoice = 'compact' | 'standard' | 'large';

export type AccentColorChoice = 'indigo' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'purple' | 'violet' | 'teal' | 'fuchsia' | 'orange';

export type ChatCharacterChoice = 
  | 'rainbow' 
  | 'socrates' 
  | 'buddy' 
  | 'coach' 
  | 'einstein' 
  | 'storyteller' 
  | 'questmaster' 
  | 'calming' 
  | 'detective' 
  | 'timetraveler' 
  | 'cybercoder' 
  | 'wiseowl';

export interface UserPreferences {
  userName: string;
  userRole: UserRole;
  themePreset: ThemePreset;
  fontFamily: FontFamilyChoice;
  fontScale: FontScaleChoice;
  accentColor: AccentColorChoice;
  chatCharacter?: ChatCharacterChoice;
  enableAnimations: boolean;
  hasOnboarded: boolean;
}

export type LearningStyle = 'Balanced' | 'Practical Code/Cases' | 'Visual & Mental Models' | 'Bite-sized Quizzes';

export type FragmentType = 'concept' | 'quiz' | 'challenge' | 'analogy' | 'case_study';

export type FragmentStatus = 'locked' | 'in_progress' | 'completed' | 'mastered';

export interface QuizOption {
  id: string;
  text: string;
  explanation: string;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  conceptSummary: string;
}

export interface PracticeChallenge {
  title: string;
  prompt: string;
  hint?: string;
  sampleAnswer?: string;
}

export interface LearningFragment {
  id: string;
  title: string;
  estimatedMinutes: number;
  type: FragmentType;
  status: FragmentStatus;
  order: number;
  phaseId: string;
  prerequisiteIds: string[];
  summary: string;
  takeaways: string[];
  keyTerms: { term: string; definition: string }[];
  analogy?: string;
  codeSnippet?: string;
  quiz?: QuizQuestion;
  challenge?: PracticeChallenge;
  isBookmarked?: boolean;
  notes?: string;
  lastReviewedAt?: string;
}

export interface ModulePhase {
  id: string;
  title: string;
  description: string;
  order: number;
  estimatedMinutes: number;
  fragmentIds: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  targetGoal: string;
  category: string;
  dailyMinutes: number;
  skillLevel: SkillLevel;
  learningStyle: LearningStyle;
  createdAt: string;
  updatedAt: string;
  phases: ModulePhase[];
  fragments: LearningFragment[];
  totalMinutes: number;
  iconName?: string;
}

export interface UserStats {
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  completedFragmentsCount: number;
  masteredFragmentsCount: number;
  totalTimeMinutesSpent: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface SavedBookmark {
  id: string;
  pathId: string;
  pathTitle: string;
  fragmentId: string;
  fragmentTitle: string;
  takeaways: string[];
  savedAt: string;
}

export interface ExplainResponse {
  mode: 'eli5' | 'analogy' | 'code' | 'deep_dive';
  content: string;
  keyHighlights: string[];
}

export interface ScoreRecord {
  id: string;
  subject: string;
  topic: string;
  testScore: number;
  examScore: number;
  maxScore: number;
  notes?: string;
  date: string;
}

export interface PracticeQuestionItem {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  proTip?: string;
}

export interface ExamTipsResult {
  performanceSummary: string;
  examHacks: { title: string; description: string }[];
  commonPitfalls: { pitfall: string; solution: string }[];
  revisionChecklist: string[];
  mnemonics: { mnemonic: string; meaning: string }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  audioBase64?: string;
}

