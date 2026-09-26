export type FontSizeOption = 'normal' | 'large' | 'xlarge';

export interface InspectionItem {
  id: string;
  label: string;
  details?: string;
  spokenScript?: string;
  physicalAction?: string;
  critical?: boolean;
  videoTutorialId?: string;
  tutorialTitle?: string;
  tutorialDescription?: string;
  componentLocation?: string;
  pointsToInspect?: string[];
  keySpecs?: string;
}

export interface InspectionSection {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: 'exterior' | 'engine' | 'suspension' | 'side' | 'coupling' | 'trailer' | 'incab' | 'airbrake' | 'final';
  vehicleLocation: 'front' | 'engine_pass' | 'engine_driver' | 'steer_axle' | 'side' | 'coupling' | 'trailer_body' | 'tandems' | 'rear' | 'cab' | 'brakes';
  truckCoordinates: { x: number; y: number }; // Percentage on truck walk-around diagram
  criticalRule?: string;
  items: InspectionItem[];
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  schoolOrCompany: string;
  targetTestDate?: string;
  avatarUrl: string;
  coverPhotoUrl: string;
  biometricsEnabled: boolean;
  pinCode?: string;
  totalInspectionsRun: number;
  bestAccuracyScore: number;
  lastInspectionDate?: string;
}

export interface InspectionLog {
  id: string;
  date: string;
  completedAt: string;
  mode: 'practice' | 'test' | 'otr';
  passed: boolean;
  score: number;
  totalItems: number;
  checkedItemIds: string[];
  speechAccuracyAverage: number;
  notes?: string;
  syncedOffline: boolean;
}

export interface SpeechVerificationResult {
  spokenText: string;
  targetScript: string;
  accuracyScore: number; // 0 - 100
  matchedWords: string[];
  missingWords: string[];
  feedback: string;
}
