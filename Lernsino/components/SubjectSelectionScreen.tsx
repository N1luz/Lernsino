
import React from 'react';
import { SUBJECTS } from '../constants';
import { Calculator, Megaphone, Scale, Sigma, ArrowRight } from 'lucide-react';

// Helper to map string icon names to Lucide components
const IconMap: Record<string, React.FC<any>> = {
  'Calculator': Calculator,
  'Megaphone': Megaphone,
  'Scale': Scale,
  'Sigma': Sigma
};

interface SubjectSelectionScreenProps {
  onSelect: (subjectId: string) => void;
}

export const SubjectSelectionScreen: React.FC<SubjectSelectionScreenProps> = ({ onSelect }) => {
  return (
    <div className="pt-24 pb-32 px-4 relative flex flex-col items-center min-h-full">
      
      {/* Background Ambience */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[500px] bg-casino-neon/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="text-center max-w-md mb-8 z-10">
        <h1 className="text-3xl font-black text-white mb-3">Choose your Subject</h1>
        <p className="text-gray-400">Select a subject to start your winning streak.</p>
      </div>

      <div className="w-full max-w-md grid grid-cols-1 gap-4 z-10">
        {SUBJECTS.map((subject) => {
          const Icon = IconMap[subject.icon] || Calculator;
          
          return (
            <button
              key={subject.id}
              onClick={() => onSelect(subject.id)}
              className="group relative w-full bg-casino-card hover:bg-casino-card/80 border border-white/5 hover:border-casino-neon/50 rounded-3xl p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
            >
              {/* Hover Glow Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-r ${subject.colorFrom} ${subject.colorTo} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`} />
              
              <div className="flex items-center gap-5">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${subject.colorFrom} ${subject.colorTo} flex items-center justify-center shadow-lg shadow-black/30 group-hover:scale-110 transition-transform duration-300`}>
                   <Icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-casino-neon transition-colors">{subject.name}</h3>
                  <p className="text-sm text-gray-400 mt-1 leading-tight">{subject.description}</p>
                </div>

                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-casino-neon group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
