export interface AnalysisState {
  isLoading: boolean;
  result: string | null;
  error: string | null;
  imagePreview: string | null;
}

export interface FileUploadHandler {
  (file: File): void;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';