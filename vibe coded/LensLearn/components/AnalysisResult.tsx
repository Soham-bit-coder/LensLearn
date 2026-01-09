import React from 'react';
import ReactMarkdown from 'react-markdown';
import { RefreshCw, BookOpen, Share2 } from 'lucide-react';
import { AnalysisStatus } from '../types';

interface AnalysisResultProps {
  result: string | null;
  imagePreview: string | null;
  status: AnalysisStatus;
  onReset: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, imagePreview, status, onReset }) => {
  if (!imagePreview) return null;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Image Preview Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative group">
        <div className="aspect-video w-full bg-slate-100 flex items-center justify-center overflow-hidden">
           <img 
            src={imagePreview} 
            alt="Analyzed Object" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {status === AnalysisStatus.COMPLETED && (
           <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={onReset}
                className="bg-white/90 backdrop-blur text-slate-700 hover:text-indigo-600 p-2 rounded-full shadow-lg transition-all"
                title="Analyze Another"
              >
                <RefreshCw size={20} />
              </button>
           </div>
        )}
      </div>

      {/* Loading State */}
      {status === AnalysisStatus.ANALYZING && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen size={16} className="text-indigo-600" />
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Examining Object...</h3>
            <p className="text-slate-500 text-sm">Identifying components and retrieving scientific data.</p>
          </div>
        </div>
      )}

      {/* Results State */}
      {status === AnalysisStatus.COMPLETED && result && (
        <div className="bg-white rounded-2xl shadow-xl shadow-indigo-50/50 border border-indigo-100 overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4 flex items-center gap-2">
            <BookOpen className="text-white" size={20} />
            <h2 className="text-lg font-bold text-white">Educational Analysis</h2>
          </div>
          
          <div className="p-6 sm:p-8">
            <div className="prose prose-indigo prose-slate max-w-none markdown-body">
              <ReactMarkdown
                components={{
                  h2: ({node, ...props}) => <h2 className="text-xl font-bold text-indigo-700 mt-6 mb-3 flex items-center gap-2" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 text-slate-700" {...props} />,
                  li: ({node, ...props}) => <li className="pl-1" {...props} />,
                  p: ({node, ...props}) => <p className="text-slate-700 leading-relaxed mb-4" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-slate-900" {...props} />,
                }}
              >
                {result}
              </ReactMarkdown>
            </div>
          </div>
          
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center">
             <p className="text-xs text-slate-500">AI-generated content. Verify important information.</p>
             <button 
                onClick={() => {
                   if (navigator.share) {
                     navigator.share({
                       title: 'LensLearn Analysis',
                       text: result
                     }).catch(console.error);
                   }
                }}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
             >
               <Share2 size={16} /> Share
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;