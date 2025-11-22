
import React from 'react';
import { Home, ShoppingBag, User, Users, Gamepad2 } from 'lucide-react';
import { GameView } from '../types';

interface BottomNavProps {
  currentView: GameView;
  setView: (view: GameView) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const navItems = [
    { view: GameView.HOME, icon: Home, label: 'Map' },
    { view: GameView.CASINO, icon: Gamepad2, label: 'Casino' },
    { view: GameView.SOCIAL, icon: Users, label: 'Social' },
    { view: GameView.SHOP, icon: ShoppingBag, label: 'Shop' },
    { view: GameView.PROFILE, icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-casino-bg border-t border-white/10 pb-safe-bottom">
      <div className="max-w-md mx-auto h-16 flex items-center justify-around px-1">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-200 ${
              currentView === item.view 
                ? 'text-casino-neon' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <item.icon 
              className={`w-6 h-6 mb-1 ${currentView === item.view ? 'fill-current opacity-100' : 'opacity-70'}`} 
              strokeWidth={2.5}
            />
            <span className="text-[9px] font-semibold tracking-wide uppercase">{item.label}</span>
            {currentView === item.view && (
              <span className="absolute bottom-1 w-1 h-1 bg-casino-neon rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
