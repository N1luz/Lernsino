
export enum GameView {
  AUTH = 'AUTH',
  SUBJECT_SELECTION = 'SUBJECT_SELECTION',
  HOME = 'HOME',
  QUIZ = 'QUIZ',
  FLASHCARDS = 'FLASHCARDS',
  LEADERBOARD = 'LEADERBOARD',
  SHOP = 'SHOP', // Includes Marketplace now
  CASINO = 'CASINO', // Crash & Plinko Hub
  SOCIAL = 'SOCIAL', // Friends & Chat
  PROFILE = 'PROFILE',
  ADMIN = 'ADMIN' // New Admin View
}

export enum LevelType {
  QUIZ = 'QUIZ',
  FLASHCARD = 'FLASHCARD',
  BOSS = 'BOSS'
}

export enum LevelStatus {
  LOCKED = 'LOCKED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED'
}

export enum Rarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY'
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  colorFrom: string;
  colorTo: string;
}

export interface Skin {
  id: string;
  name: string;
  image: string;
  rarity: Rarity;
  cost: number; // Shop price (if applicable)
  estimatedValue: number; // Market value for trading/gambling
}

export interface Case {
  id: string;
  name: string;
  cost: number;
  image: string;
  contains: string[];
}

export interface UserStats {
  xp: number;
  coins: number;
  streak: number;
  hearts: number;
  maxHearts: number;
  level: number; // Player Rank Level
  inventory: string[]; // Array of Skin IDs
  equippedSkin: string; 
  weakTopics: string[]; // IDs of topics/subjects the user struggled with (Spaced Repetition)
  isAdmin?: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface LevelData {
  id: string;
  subjectId: string;
  topic: string;
  title: string;
  type: LevelType;
  status: LevelStatus;
  xpReward: number;
  coinReward: number;
  questions?: Question[];
  flashcards?: Flashcard[];
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'BOSS';
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  type: 'heart_refill' | 'streak_freeze' | 'xp_boost';
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  xp: number;
  avatar: string;
  isCurrentUser: boolean;
}

// --- SOCIAL & TRADE TYPES ---

export enum FriendStatus {
  PENDING = 'PENDING', // Sent by me, waiting for them
  INCOMING = 'INCOMING', // Sent by them, waiting for me
  ACCEPTED = 'ACCEPTED' // Real friend
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  status: FriendStatus;
  inventory: string[]; // Mock inventory for trading
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isSystem?: boolean;
}

export interface MarketListing {
  id: string;
  sellerName: string;
  skinId: string;
  price: number;
  timestamp: number;
}

export interface TradeOffer {
  coins: number;
  items: string[]; // Skin IDs
  isLocked: boolean; // "Ready" state
}

export interface TradeSession {
  partnerId: string;
  myOffer: TradeOffer;
  partnerOffer: TradeOffer;
  status: 'OPEN' | 'ACCEPTED' | 'CANCELLED' | 'COMPLETED';
}
