
import React, { useState } from 'react';
import { Question, LevelData } from '../types';
import { CheckCircle, XCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface QuizGameProps {
  level: LevelData;
  onComplete: (score: number) => void;
  onExit: () => void;
  onWrongAnswer: () => void; // Deduct heart
  hearts: number;
}

export const QuizGame: React.FC<QuizGameProps> = ({ level, onComplete, onExit, onWrongAnswer, hearts }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  const questions = level.questions || [];
  const currentQuestion = questions[currentQIndex];

  const handleCheck = () => {
    if (selectedOption === null) return;

    const correct = selectedOption === currentQuestion.correctIndex;
    setIsChecked(true);
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 1);
      soundManager.play('correct');
    } else {
      soundManager.play('wrong');
      onWrongAnswer();
    }
  };

  const handleNext = () => {
    soundManager.play('click');
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsChecked(false);
      setIsCorrect(false);
    } else {
      onComplete(score + (isCorrect ? 1 : 0)); // Add point for last question if correct
    }
  };

  if (hearts <= 0) {
    return (
      <div className="fixed inset-0 z-50 bg-casino-bg flex flex-col items-center justify-center p-6 text-center">
         <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <AlertTriangle className="w-12 h-12 text-red-500" />
         </div>
         <h2 className="text-3xl font-black text-white mb-2">Out of Hearts!</h2>
         <p className="text-gray-400 mb-8">You made too many mistakes. Go to the shop to refill or wait.</p>
         <button 
          onClick={onExit}
          className="w-full max-w-xs bg-gray-700 text-white py-4 rounded-2xl font-bold hover:bg-gray-600 transition"
         >
           Back to Map
         </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-casino-bg flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between bg-casino-card/50 backdrop-blur border-b border-white/5">
        <button onClick={onExit} className="text-gray-400 hover:text-white">
          <XCircle className="w-6 h-6" />
        </button>
        <div className="flex-1 mx-4 h-3 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-casino-neon transition-all duration-500 ease-out"
            style={{ width: `${((currentQIndex) / questions.length) * 100}%` }}
          />
        </div>
        <span className="text-red-500 font-bold flex items-center gap-1">
          {hearts} <span className="text-lg">❤️</span>
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center max-w-2xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">
          {currentQuestion.text}
        </h2>

        <div className="w-full space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let btnClass = "bg-casino-card border-2 border-white/5 hover:border-white/20 text-gray-200";
            
            // Logic for button styling during check state
            if (isChecked) {
              if (idx === currentQuestion.correctIndex) {
                btnClass = "bg-green-500/20 border-green-500 text-green-400"; // Show correct
              } else if (idx === selectedOption && !isCorrect) {
                btnClass = "bg-red-500/20 border-red-500 text-red-400"; // Show wrong selection
              } else {
                btnClass = "opacity-50 border-transparent"; // Dim others
              }
            } else if (selectedOption === idx) {
              btnClass = "bg-casino-neon/20 border-casino-neon text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]";
            }

            return (
              <button
                key={idx}
                onClick={() => {
                   if (!isChecked) {
                       soundManager.play('click');
                       setSelectedOption(idx);
                   }
                }}
                disabled={isChecked}
                className={`w-full p-4 rounded-2xl text-left font-semibold text-lg transition-all duration-200 ${btnClass}`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isChecked && idx === currentQuestion.correctIndex && <CheckCircle className="w-6 h-6 text-green-500" />}
                  {isChecked && idx === selectedOption && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Sheet / Feedback */}
      <div className={`p-6 border-t border-white/10 transition-colors duration-300 pb-safe-bottom ${
        isChecked ? (isCorrect ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30') : 'bg-casino-bg'
      }`}>
        {!isChecked ? (
          <button
            onClick={handleCheck}
            disabled={selectedOption === null}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
              selectedOption !== null 
              ? 'bg-casino-neon text-white shadow-lg shadow-purple-500/25 hover:scale-[1.02]' 
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            Check Answer
          </button>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                {isCorrect ? <CheckCircle className="w-6 h-6 text-white" /> : <XCircle className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h3 className={`font-bold text-lg ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrect ? 'Excellent!' : 'Not quite...'}
                </h3>
                <p className="text-sm text-gray-300 mt-1">{currentQuestion.explanation}</p>
              </div>
            </div>
            <button
              onClick={handleNext}
              className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-lg hover:scale-[1.02] transition-all ${
                isCorrect ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'
              }`}
            >
              Continue <ArrowRight className="inline w-5 h-5 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
