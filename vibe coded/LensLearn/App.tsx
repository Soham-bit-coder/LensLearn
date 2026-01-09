import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import AnalysisResult from './components/AnalysisResult';
import DifficultySelector from './components/DifficultySelector';
import { analyzeImageWithGemini } from './services/gemini';
import { AnalysisStatus, DifficultyLevel } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Intermediate');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (file: File) => {
    // Reset previous states
    setError(null);
    setResult(null);
    setStatus(AnalysisStatus.ANALYZING);

    // Create a local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);

    try {
      // Call Gemini API with selected difficulty
      const analysisText = await analyzeImageWithGemini(file, difficulty);
      setResult(analysisText);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while analyzing the image.");
      setStatus(AnalysisStatus.ERROR);
    }
  }, [difficulty]); // Depend on difficulty so the closure captures the current value

  const handleReset = useCallback(() => {
    setStatus(AnalysisStatus.IDLE);
    setImagePreview(null);
    setResult(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />

      <main className="max-w-3xl mx-auto px-4 pt-8">
        
        {/* Intro Text (only visible when idle) */}
        {status === AnalysisStatus.IDLE && (
          <div className="text-center mb-8 space-y-3 animate-fade-in">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Turn the World into a Classroom
            </h2>
            <p className="text-lg text-slate-600 max-w-xl mx-auto">
              Snap a picture of anything—a plant, a gadget, or a building—and get an instant science lesson tailored just for you.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 animate-shake">
            <AlertCircle className="shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold">Analysis Failed</p>
              <p className="text-sm opacity-90">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="text-xs font-bold mt-2 underline hover:text-red-900"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="space-y-8">
          
          {/* Controls Area: Selector + Uploader */}
          {(status === AnalysisStatus.IDLE || status === AnalysisStatus.ERROR) && (
             <div className="space-y-6 max-w-md mx-auto">
                <DifficultySelector 
                  selected={difficulty} 
                  onChange={setDifficulty}
                  disabled={false}
                />
                <ImageUploader 
                  onImageSelect={handleImageSelect} 
                  isAnalyzing={false}
                />
             </div>
          )}

          {/* Analysis View */}
          {(status === AnalysisStatus.ANALYZING || status === AnalysisStatus.COMPLETED) && (
            <AnalysisResult 
              result={result}
              imagePreview={imagePreview}
              status={status}
              onReset={handleReset}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;