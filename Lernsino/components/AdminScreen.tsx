
import React, { useState } from 'react';
import { LevelData, LevelType, Question, Flashcard } from '../types';
import { ArrowLeft, Plus, Trash, Save, Edit, Book, HelpCircle, Sword } from 'lucide-react';

interface AdminScreenProps {
  levels: LevelData[];
  setLevels: (levels: LevelData[]) => void;
  onBack: () => void;
}

export const AdminScreen: React.FC<AdminScreenProps> = ({ levels, setLevels, onBack }) => {
  const [selectedLevel, setSelectedLevel] = useState<LevelData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // --- Actions ---

  const handleSaveLevel = () => {
    if (!selectedLevel) return;
    const newLevels = levels.map(l => l.id === selectedLevel.id ? selectedLevel : l);
    setLevels(newLevels);
    setIsEditing(false);
    alert('Level saved!');
  };

  const handleAddQuestion = () => {
    if (!selectedLevel) return;
    const newQ: Question = {
      id: `q_${Date.now()}`,
      text: 'New Question Text',
      options: ['Correct', 'Wrong 1', 'Wrong 2', 'Wrong 3'],
      correctIndex: 0,
      explanation: 'Explanation here.'
    };
    setSelectedLevel({
      ...selectedLevel,
      questions: [...(selectedLevel.questions || []), newQ]
    });
  };

  const handleDeleteQuestion = (idx: number) => {
    if (!selectedLevel || !selectedLevel.questions) return;
    const newQs = [...selectedLevel.questions];
    newQs.splice(idx, 1);
    setSelectedLevel({ ...selectedLevel, questions: newQs });
  };

  const handleAddFlashcard = () => {
    if (!selectedLevel) return;
    const newCard: Flashcard = {
      id: `f_${Date.now()}`,
      front: 'Front Text',
      back: 'Back Text'
    };
    setSelectedLevel({
      ...selectedLevel,
      flashcards: [...(selectedLevel.flashcards || []), newCard]
    });
  };

  const handleDeleteFlashcard = (idx: number) => {
      if(!selectedLevel || !selectedLevel.flashcards) return;
      const newCards = [...selectedLevel.flashcards];
      newCards.splice(idx, 1);
      setSelectedLevel({ ...selectedLevel, flashcards: newCards });
  };

  // --- Render ---

  if (selectedLevel) {
    return (
      <div className="pt-20 px-4 pb-32 min-h-screen bg-gray-900">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setSelectedLevel(null)} className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-black text-white">Edit Level</h2>
        </div>

        {/* Metadata Form */}
        <div className="bg-gray-800 p-4 rounded-xl space-y-4 mb-8 border border-gray-700">
          <div>
            <label className="text-xs text-gray-400 uppercase font-bold">Title</label>
            <input 
              className="w-full bg-black/30 p-2 rounded text-white border border-gray-600"
              value={selectedLevel.title}
              onChange={(e) => setSelectedLevel({...selectedLevel, title: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="text-xs text-gray-400 uppercase font-bold">Type</label>
               <select 
                  className="w-full bg-black/30 p-2 rounded text-white border border-gray-600"
                  value={selectedLevel.type}
                  onChange={(e) => setSelectedLevel({...selectedLevel, type: e.target.value as LevelType})}
               >
                  <option value={LevelType.QUIZ}>Quiz</option>
                  <option value={LevelType.FLASHCARD}>Flashcards</option>
                  <option value={LevelType.BOSS}>Boss</option>
               </select>
            </div>
            <div>
               <label className="text-xs text-gray-400 uppercase font-bold">Difficulty</label>
               <select 
                  className="w-full bg-black/30 p-2 rounded text-white border border-gray-600"
                  value={selectedLevel.difficulty || 'EASY'}
                  onChange={(e) => setSelectedLevel({...selectedLevel, difficulty: e.target.value as any})}
               >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                  <option value="BOSS">Boss</option>
               </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-xs text-gray-400 uppercase font-bold">XP Reward</label>
                <input type="number" className="w-full bg-black/30 p-2 rounded text-white border border-gray-600" value={selectedLevel.xpReward} onChange={e => setSelectedLevel({...selectedLevel, xpReward: parseInt(e.target.value)})} />
             </div>
             <div>
                <label className="text-xs text-gray-400 uppercase font-bold">Coins Reward</label>
                <input type="number" className="w-full bg-black/30 p-2 rounded text-white border border-gray-600" value={selectedLevel.coinReward} onChange={e => setSelectedLevel({...selectedLevel, coinReward: parseInt(e.target.value)})} />
             </div>
          </div>
        </div>

        {/* Questions Editor */}
        {selectedLevel.type !== LevelType.FLASHCARD && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Questions</h3>
              <button onClick={handleAddQuestion} className="bg-green-600 px-3 py-1 rounded text-sm font-bold flex items-center gap-1">
                <Plus size={16} /> Add
              </button>
            </div>
            
            {(selectedLevel.questions || []).map((q, idx) => (
              <div key={q.id} className="bg-gray-800 border border-gray-700 p-4 rounded-xl relative group">
                 <button onClick={() => handleDeleteQuestion(idx)} className="absolute top-2 right-2 text-red-500 opacity-50 hover:opacity-100">
                    <Trash size={16} />
                 </button>
                 
                 <div className="mb-2">
                   <label className="text-[10px] text-gray-500 uppercase">Question Text</label>
                   <textarea 
                     className="w-full bg-black/20 p-2 rounded text-white text-sm" 
                     value={q.text}
                     onChange={(e) => {
                        const newQs = [...(selectedLevel.questions || [])];
                        newQs[idx].text = e.target.value;
                        setSelectedLevel({...selectedLevel, questions: newQs});
                     }}
                   />
                 </div>

                 <div className="space-y-1">
                    {q.options.map((opt, optIdx) => (
                       <div key={optIdx} className="flex items-center gap-2">
                          <input 
                            type="radio" 
                            name={`q_${q.id}`} 
                            checked={q.correctIndex === optIdx}
                            onChange={() => {
                                const newQs = [...(selectedLevel.questions || [])];
                                newQs[idx].correctIndex = optIdx;
                                setSelectedLevel({...selectedLevel, questions: newQs});
                            }}
                          />
                          <input 
                            className="flex-1 bg-black/20 p-1 rounded text-sm text-gray-300"
                            value={opt}
                            onChange={(e) => {
                                const newQs = [...(selectedLevel.questions || [])];
                                newQs[idx].options[optIdx] = e.target.value;
                                setSelectedLevel({...selectedLevel, questions: newQs});
                            }}
                          />
                       </div>
                    ))}
                 </div>
                 
                 <div className="mt-2">
                     <label className="text-[10px] text-gray-500 uppercase">Explanation</label>
                     <input 
                        className="w-full bg-black/20 p-2 rounded text-gray-400 text-xs" 
                        value={q.explanation}
                        onChange={(e) => {
                            const newQs = [...(selectedLevel.questions || [])];
                            newQs[idx].explanation = e.target.value;
                            setSelectedLevel({...selectedLevel, questions: newQs});
                        }}
                     />
                 </div>
              </div>
            ))}
          </div>
        )}

        {/* Flashcards Editor */}
        {selectedLevel.type === LevelType.FLASHCARD && (
          <div className="space-y-4">
             <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Flashcards</h3>
              <button onClick={handleAddFlashcard} className="bg-green-600 px-3 py-1 rounded text-sm font-bold flex items-center gap-1">
                <Plus size={16} /> Add
              </button>
            </div>

            {(selectedLevel.flashcards || []).map((card, idx) => (
                <div key={card.id} className="bg-gray-800 border border-gray-700 p-4 rounded-xl relative">
                     <button onClick={() => handleDeleteFlashcard(idx)} className="absolute top-2 right-2 text-red-500 opacity-50 hover:opacity-100">
                        <Trash size={16} />
                     </button>
                     <div className="grid grid-cols-1 gap-2">
                         <div>
                             <label className="text-[10px] text-gray-500 uppercase">Front</label>
                             <input 
                                className="w-full bg-black/20 p-2 rounded text-white"
                                value={card.front}
                                onChange={(e) => {
                                    const newCs = [...(selectedLevel.flashcards || [])];
                                    newCs[idx].front = e.target.value;
                                    setSelectedLevel({...selectedLevel, flashcards: newCs});
                                }}
                             />
                         </div>
                         <div>
                             <label className="text-[10px] text-gray-500 uppercase">Back</label>
                             <textarea 
                                className="w-full bg-black/20 p-2 rounded text-gray-300 text-sm"
                                value={card.back}
                                onChange={(e) => {
                                    const newCs = [...(selectedLevel.flashcards || [])];
                                    newCs[idx].back = e.target.value;
                                    setSelectedLevel({...selectedLevel, flashcards: newCs});
                                }}
                             />
                         </div>
                     </div>
                </div>
            ))}
          </div>
        )}
        
        <button onClick={handleSaveLevel} className="fixed bottom-6 right-6 w-14 h-14 bg-casino-neon rounded-full shadow-lg flex items-center justify-center text-white z-50 animate-bounce-slight">
            <Save size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="pt-20 px-4 pb-32 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
         <button onClick={onBack} className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700">
            <ArrowLeft size={20} />
         </button>
         <div>
             <h1 className="text-3xl font-black text-white">Admin Panel</h1>
             <p className="text-red-400 font-bold uppercase text-xs tracking-widest">God Mode</p>
         </div>
      </div>

      <div className="grid gap-4">
        {levels.map((level) => {
            let Icon = HelpCircle;
            if (level.type === LevelType.FLASHCARD) Icon = Book;
            if (level.type === LevelType.BOSS) Icon = Sword;

            return (
                <button 
                  key={level.id}
                  onClick={() => setSelectedLevel(level)}
                  className="bg-casino-card border border-white/10 p-4 rounded-xl flex items-center gap-4 hover:bg-white/5 transition-all text-left"
                >
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-casino-neon">
                        <Icon size={20} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-white">{level.title}</h3>
                        <p className="text-xs text-gray-500 uppercase">{level.subjectId} • {level.topic}</p>
                    </div>
                    <div className="text-gray-600">
                        <Edit size={16} />
                    </div>
                </button>
            );
        })}
      </div>
    </div>
  );
};
