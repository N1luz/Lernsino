
import React, { useState } from 'react';
import { User, Mail, Lock, ArrowRight, Github, Zap } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface AuthScreenProps {
  onLogin: (username: string, isAdmin: boolean) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.init();
    soundManager.play('click');
    setIsLoading(true);

    // Credentials Check
    const isAdmin = email === 'admin@admin.com' && password === 'lolni3555';
    const finalUsername = username || email.split('@')[0] || 'User';

    setTimeout(() => {
      setIsLoading(false);
      soundManager.play('win');
      onLogin(finalUsername, isAdmin);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-casino-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse-glow" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-casino-gold/5 blur-[100px] rounded-full" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-casino-card border border-casino-neon/50 rounded-2xl mb-4 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <Zap className="w-8 h-8 text-casino-neon fill-casino-neon" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Lern<span className="text-casino-neon">Casino</span>
          </h1>
          <p className="text-gray-400">Bet on your knowledge. Win rewards.</p>
        </div>

        <div className="bg-casino-card/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="flex bg-black/20 p-1 rounded-xl mb-8">
            <button 
              onClick={() => { setIsLogin(true); soundManager.play('click'); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${isLogin ? 'bg-casino-neon text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Log In
            </button>
            <button 
              onClick={() => { setIsLogin(false); soundManager.play('click'); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${!isLogin ? 'bg-casino-neon text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                  <input 
                    type="text" 
                    required 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-casino-neon focus:outline-none focus:ring-1 focus:ring-casino-neon transition-all"
                    placeholder="Choose a username"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-casino-neon focus:outline-none focus:ring-1 focus:ring-casino-neon transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
               <label className="text-xs font-bold text-gray-400 uppercase ml-1">Password</label>
               <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-casino-neon focus:outline-none focus:ring-1 focus:ring-casino-neon transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-casino-gold to-yellow-600 text-yellow-950 font-black py-4 rounded-xl mt-4 shadow-lg shadow-yellow-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-yellow-950/30 border-t-yellow-950 rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Start Playing' : 'Create Account'} <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <span className="relative bg-casino-card px-4 text-xs text-gray-500 uppercase font-bold">Or continue with</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => soundManager.play('click')} className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl transition-all">
                 <Github className="w-5 h-5" />
                 <span className="font-semibold text-sm">Github</span>
              </button>
              <button onClick={() => soundManager.play('click')} className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-3 rounded-xl transition-all">
                 <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black font-bold text-xs">G</div>
                 <span className="font-semibold text-sm">Google</span>
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-center text-gray-500 text-xs mt-8">
          By continuing, you agree to our <a href="#" className="underline hover:text-gray-300">Terms of Service</a> and <a href="#" className="underline hover:text-gray-300">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};
