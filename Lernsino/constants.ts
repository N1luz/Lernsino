
import { LevelData, LevelType, LevelStatus, ShopItem, LeaderboardEntry, Subject, Skin, Rarity, Case, Friend, MarketListing, FriendStatus } from './types';

export const INITIAL_STATS = {
  xp: 1250,
  coins: 1500,
  streak: 3,
  hearts: 5,
  maxHearts: 5,
  level: 4,
  inventory: ['skin_novice_student', 'skin_freshman_lily'], // Updated defaults
  equippedSkin: 'skin_novice_student',
  weakTopics: [] // For spaced repetition
};

export const SUBJECTS: Subject[] = [
  {
    id: 'accounting',
    name: 'Bilanzierung',
    description: 'HGB, IFRS & Jahresabschluss',
    icon: 'Calculator',
    colorFrom: 'from-blue-600',
    colorTo: 'to-cyan-500'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: '4 Ps, Strategie & Marktforschung',
    icon: 'Megaphone',
    colorFrom: 'from-pink-600',
    colorTo: 'to-rose-500'
  },
  {
    id: 'tax',
    name: 'Steuerrecht',
    description: 'AO, EStG, UStG & Gewerbesteuer',
    icon: 'Scale',
    colorFrom: 'from-yellow-600',
    colorTo: 'to-orange-500'
  },
  {
    id: 'math',
    name: 'Wirtschaftsmathe',
    description: 'Analysis, Lineare Algebra & Statistik',
    icon: 'Sigma',
    colorFrom: 'from-emerald-600',
    colorTo: 'to-green-500'
  }
];

// --- 100 SKINS IMPLEMENTATION ---

export const SKINS: Skin[] = [
  // 🟦 COMMON (20 Skins) - Simple, Students, Rookies
  { id: 'skin_novice_student', name: 'Novice Student', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Novice&clothing=hoodie', rarity: Rarity.COMMON, cost: 0, estimatedValue: 10 },
  { id: 'skin_freshman_lily', name: 'Freshman Lily', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily&clothing=overall', rarity: Rarity.COMMON, cost: 0, estimatedValue: 15 },
  { id: 'skin_accounting_rookie', name: 'Accounting Rookie', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rookie&accessories=glasses', rarity: Rarity.COMMON, cost: 0, estimatedValue: 20 },
  { id: 'skin_cafe_worker', name: 'Cafe Worker Tom', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom&clothing=shirtCrewNeck', rarity: Rarity.COMMON, cost: 0, estimatedValue: 20 },
  { id: 'skin_broke_student', name: 'Broke Student', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Broke&eyes=cry', rarity: Rarity.COMMON, cost: 0, estimatedValue: 25 },
  { id: 'skin_intern_max', name: 'Intern Max', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max&clothing=collarAndSweater', rarity: Rarity.COMMON, cost: 0, estimatedValue: 30 },
  { id: 'skin_library_nerd', name: 'Library Nerd', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Library&glasses=round', rarity: Rarity.COMMON, cost: 0, estimatedValue: 30 },
  { id: 'skin_latenight_coder', name: 'Late-Night Coder', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Coder&top=winterHat1', rarity: Rarity.COMMON, cost: 0, estimatedValue: 35 },
  { id: 'skin_exam_survivor', name: 'Exam Survivor', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Survivor&eyebrows=raisedExcited', rarity: Rarity.COMMON, cost: 0, estimatedValue: 35 },
  { id: 'skin_lazy_accountant', name: 'Lazy Accountant', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lazy&eyes=sleepy', rarity: Rarity.COMMON, cost: 0, estimatedValue: 40 },
  { id: 'skin_spreadsheet_beg', name: 'Spreadsheet Beginner', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sheet&clothing=graphicShirt', rarity: Rarity.COMMON, cost: 0, estimatedValue: 40 },
  { id: 'skin_trainee_sophie', name: 'Trainee Sophie', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie', rarity: Rarity.COMMON, cost: 0, estimatedValue: 45 },
  { id: 'skin_budget_baker', name: 'Budget Baker', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Baker&top=hat', rarity: Rarity.COMMON, cost: 0, estimatedValue: 45 },
  { id: 'skin_basic_analyst', name: 'Basic Analyst', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Analyst', rarity: Rarity.COMMON, cost: 0, estimatedValue: 50 },
  { id: 'skin_junior_observer', name: 'Junior Observer', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Observer&accessories=prescription02', rarity: Rarity.COMMON, cost: 0, estimatedValue: 50 },
  { id: 'skin_homework_henry', name: 'Homework Henry', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henry', rarity: Rarity.COMMON, cost: 0, estimatedValue: 55 },
  { id: 'skin_sales_boy', name: 'Simple Sales Boy', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sales', rarity: Rarity.COMMON, cost: 0, estimatedValue: 55 },
  { id: 'skin_tired_finance', name: 'Tired Finance Girl', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tired&eyes=closed', rarity: Rarity.COMMON, cost: 0, estimatedValue: 60 },
  { id: 'skin_paperwork_starter', name: 'Paperwork Starter', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Paper', rarity: Rarity.COMMON, cost: 0, estimatedValue: 60 },
  { id: 'skin_rookie_auditor', name: 'Rookie Auditor', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AuditRookie', rarity: Rarity.COMMON, cost: 0, estimatedValue: 65 },

  // 🟩 UNCOMMON (20 Skins) - Better outfits, themed
  { id: 'skin_cashflow_kid', name: 'Cashflow Kid', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cashflow&facialHair=beardMedium', rarity: Rarity.COMMON, cost: 200, estimatedValue: 120 }, // Marked common in list but feels uncommon
  { id: 'skin_economy_enthusiast', name: 'Economy Enthusiast', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Economy&clothing=blazerAndShirt', rarity: Rarity.COMMON, cost: 220, estimatedValue: 130 },
  { id: 'skin_mini_auditor', name: 'Mini Auditor', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MiniAudit&clothing=collarAndSweater', rarity: Rarity.COMMON, cost: 250, estimatedValue: 150 },
  { id: 'skin_finance_nerd', name: 'Finance Nerd', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=FinNerd&glasses=round', rarity: Rarity.COMMON, cost: 250, estimatedValue: 150 },
  { id: 'skin_tax_trainee', name: 'Tax Trainee', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TaxTrainee', rarity: Rarity.COMMON, cost: 280, estimatedValue: 160 },
  { id: 'skin_crypto_student', name: 'Crypto Student', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoStu&top=shortHairFrizzle', rarity: Rarity.COMMON, cost: 300, estimatedValue: 180 },
  { id: 'skin_marketing_bro', name: 'Marketing Bro', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarketBro&accessories=sunglasses', rarity: Rarity.COMMON, cost: 320, estimatedValue: 190 },
  { id: 'skin_risk_manager', name: 'Risk Manager', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Risk&clothing=overall', rarity: Rarity.COMMON, cost: 350, estimatedValue: 200 },
  { id: 'skin_supply_andy', name: 'Supply Chain Andy', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andy&facialHair=beardMajestic', rarity: Rarity.COMMON, cost: 350, estimatedValue: 200 },
  { id: 'skin_nerdy_treasurer', name: 'Nerdy Treasurer', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Treasurer&top=winterHat03', rarity: Rarity.COMMON, cost: 380, estimatedValue: 220 },
  { id: 'skin_smart_budget', name: 'Smart Budget Girl', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SmartBud', rarity: Rarity.COMMON, cost: 400, estimatedValue: 240 },
  { id: 'skin_biz_casual_tom', name: 'Business Casual Tom', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BizTom&clothing=shirtVNeck', rarity: Rarity.COMMON, cost: 420, estimatedValue: 250 },
  { id: 'skin_sheet_samurai', name: 'Sheet Samurai', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Samurai&top=longHairBun', rarity: Rarity.COMMON, cost: 450, estimatedValue: 260 },
  { id: 'skin_memo_master', name: 'Memo Master', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Memo', rarity: Rarity.COMMON, cost: 450, estimatedValue: 260 },
  { id: 'skin_audit_kitten', name: 'Audit Kitten Lover', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kitten&top=longHairCurvy', rarity: Rarity.COMMON, cost: 480, estimatedValue: 280 },
  { id: 'skin_coffee_addict', name: 'Coffee Addict', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Coffee&eyes=surprised', rarity: Rarity.COMMON, cost: 500, estimatedValue: 300 },
  { id: 'skin_finance_dancer', name: 'Finance Dancer', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dance&top=longHairDreads', rarity: Rarity.COMMON, cost: 520, estimatedValue: 310 },
  { id: 'skin_pen_collector', name: 'Pen Collector', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pen', rarity: Rarity.COMMON, cost: 550, estimatedValue: 320 },
  { id: 'skin_quiet_accountant', name: 'Quiet Accountant', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Quiet', rarity: Rarity.COMMON, cost: 580, estimatedValue: 340 },
  { id: 'skin_ust_hero', name: 'USt Hero', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hero&clothing=graphicShirt', rarity: Rarity.COMMON, cost: 600, estimatedValue: 350 },

  // 🔵 RARE (25 Skins) - Job specific, standout
  { id: 'skin_audit_ninja', name: 'Audit Ninja', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ninja&clothing=collarAndSweater&top=turban', rarity: Rarity.RARE, cost: 800, estimatedValue: 600 },
  { id: 'skin_tax_samurai', name: 'Tax Samurai', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TaxSam&facialHair=beardMajestic', rarity: Rarity.RARE, cost: 850, estimatedValue: 650 },
  { id: 'skin_balance_warrior', name: 'Balance Warrior', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Warrior&eyebrows=angry', rarity: Rarity.RARE, cost: 900, estimatedValue: 700 },
  { id: 'skin_depreciation_knight', name: 'Depreciation Knight', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Afa&colors=grey', rarity: Rarity.RARE, cost: 950, estimatedValue: 750 },
  { id: 'skin_pl_prodigy', name: 'P&L Prodigy', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prodigy&glasses=sunglasses', rarity: Rarity.RARE, cost: 1000, estimatedValue: 800 },
  { id: 'skin_vat_viking', name: 'VAT Viking', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Viking&facialHair=beardMedium&top=longHairShavedSides', rarity: Rarity.RARE, cost: 1100, estimatedValue: 850 },
  { id: 'skin_excel_wizard', name: 'Excel Wizard', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wizard&top=hat', rarity: Rarity.RARE, cost: 1200, estimatedValue: 900 },
  { id: 'skin_crypto_analyst', name: 'Crypto Analyst', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoAna&accessories=sunglasses', rarity: Rarity.RARE, cost: 1250, estimatedValue: 950 },
  { id: 'skin_revision_pirate', name: 'Revision Pirate', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pirate&accessories=eyepatch', rarity: Rarity.RARE, cost: 1300, estimatedValue: 1000 },
  { id: 'skin_gob_guardian', name: 'GoB Guardian', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Guardian', rarity: Rarity.RARE, cost: 1350, estimatedValue: 1100 },
  { id: 'skin_inventory_scout', name: 'Inventory Scout', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Scout&clothing=overall', rarity: Rarity.RARE, cost: 1400, estimatedValue: 1200 },
  { id: 'skin_cost_killer', name: 'Cost Killer', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Killer&eyebrows=angry', rarity: Rarity.RARE, cost: 1500, estimatedValue: 1300 },
  { id: 'skin_investment_dude', name: 'Investment Dude', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Invest&accessories=sunglasses&clothing=blazerAndShirt', rarity: Rarity.RARE, cost: 1600, estimatedValue: 1400 },
  { id: 'skin_cash_cow', name: 'Cash Cow Farmer', image: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cow', rarity: Rarity.RARE, cost: 1700, estimatedValue: 1500 },
  { id: 'skin_capital_knight', name: 'Capital Knight', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Capital&colors=amber', rarity: Rarity.RARE, cost: 1800, estimatedValue: 1600 },
  { id: 'skin_lifo_lord', name: 'LIFO Lord', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lifo&facialHair=beardMajestic', rarity: Rarity.RARE, cost: 1900, estimatedValue: 1700 },
  { id: 'skin_fifo_fighter', name: 'FIFO Fighter', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fifo', rarity: Rarity.RARE, cost: 1900, estimatedValue: 1700 },
  { id: 'skin_breakeven_boxer', name: 'Break-Even Boxer', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Boxer&clothing=hoodie', rarity: Rarity.RARE, cost: 2000, estimatedValue: 1800 },
  { id: 'skin_audit_elf', name: 'Audit Elf', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elf&top=winterHat02', rarity: Rarity.RARE, cost: 2100, estimatedValue: 1900 },
  { id: 'skin_bond_broker', name: 'Bond Broker', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bond&clothing=blazerAndShirt', rarity: Rarity.RARE, cost: 2200, estimatedValue: 2000 },
  { id: 'skin_revenue_ranger', name: 'Revenue Ranger', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ranger&top=hat', rarity: Rarity.RARE, cost: 2300, estimatedValue: 2100 },
  { id: 'skin_payroll_panther', name: 'Payroll Panther', image: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Panther', rarity: Rarity.RARE, cost: 2400, estimatedValue: 2200 },
  { id: 'skin_risk_prophet', name: 'Risk Prophet', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prophet&facialHair=beardMedium', rarity: Rarity.RARE, cost: 2500, estimatedValue: 2300 },
  { id: 'skin_treasury_tiger', name: 'Treasury Tiger', image: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Tiger', rarity: Rarity.RARE, cost: 2600, estimatedValue: 2400 },
  { id: 'skin_journal_jedi', name: 'Journal Jedi', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jedi&clothing=hoodie', rarity: Rarity.RARE, cost: 2700, estimatedValue: 2500 },

  // 🟪 EPIC (20 Skins) - Neon, Animated vibes
  { id: 'skin_neon_auditor', name: 'Neon Auditor', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=NeonAudit&colors=purple', rarity: Rarity.EPIC, cost: 3000, estimatedValue: 3500 },
  { id: 'skin_ledger_master', name: 'Golden Ledger', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ledger&hairColor=blondeGolden&clothingColor=gold', rarity: Rarity.EPIC, cost: 3200, estimatedValue: 3800 },
  { id: 'skin_crypto_cyborg', name: 'Crypto Cyborg', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Cyborg&colors=cyan', rarity: Rarity.EPIC, cost: 3500, estimatedValue: 4000 },
  { id: 'skin_ai_accountant', name: 'AI Accountant', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=AI&colors=emerald', rarity: Rarity.EPIC, cost: 3800, estimatedValue: 4200 },
  { id: 'skin_future_cfo', name: 'Future CFO', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Future&accessories=sunglasses&hairColor=platinum', rarity: Rarity.EPIC, cost: 4000, estimatedValue: 4500 },
  { id: 'skin_tax_angel', name: 'Tax Angel', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Angel&hairColor=blonde&skinColor=pale', rarity: Rarity.EPIC, cost: 4200, estimatedValue: 4800 },
  { id: 'skin_profit_prophet', name: 'Profit Prophet', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Profit&facialHair=beardMajestic&hairColor=silverGray', rarity: Rarity.EPIC, cost: 4500, estimatedValue: 5000 },
  { id: 'skin_robo_revisor', name: 'Robo Revisor', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Revisor&colors=pink', rarity: Rarity.EPIC, cost: 4800, estimatedValue: 5200 },
  { id: 'skin_digital_mage', name: 'Digital Mage', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Mage&colors=indigo', rarity: Rarity.EPIC, cost: 5000, estimatedValue: 5500 },
  { id: 'skin_cashflow_monk', name: 'Cashflow Monk', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Monk&clothing=collarAndSweater&skinColor=tanned', rarity: Rarity.EPIC, cost: 5200, estimatedValue: 5800 },
  { id: 'skin_neon_risk', name: 'Neon Risk', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=RiskNeon&colors=orange', rarity: Rarity.EPIC, cost: 5500, estimatedValue: 6000 },
  { id: 'skin_quantum_auditor', name: 'Quantum Auditor', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Quantum&colors=blue', rarity: Rarity.EPIC, cost: 5800, estimatedValue: 6200 },
  { id: 'skin_dark_warrior', name: 'Dark Mode Warrior', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dark&skinColor=black&clothingColor=black', rarity: Rarity.EPIC, cost: 6000, estimatedValue: 6500 },
  { id: 'skin_ledger_samurai', name: 'Ledger Samurai', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LedgerSam&top=longHairBun', rarity: Rarity.EPIC, cost: 6200, estimatedValue: 6800 },
  { id: 'skin_audit_hacker', name: 'Audit Hacker', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hacker&top=winterHat04&accessories=sunglasses', rarity: Rarity.EPIC, cost: 6500, estimatedValue: 7000 },
  { id: 'skin_time_value', name: 'Time Value Master', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Time&colors=teal', rarity: Rarity.EPIC, cost: 6800, estimatedValue: 7200 },
  { id: 'skin_fair_value', name: 'Fair Value Phantom', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Phantom&colors=zinc', rarity: Rarity.EPIC, cost: 7000, estimatedValue: 7500 },
  { id: 'skin_inventory_ill', name: 'Inventory Illusion', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Illusion&colors=violet', rarity: Rarity.EPIC, cost: 7200, estimatedValue: 7800 },
  { id: 'skin_balance_zerk', name: 'Sheet Berserker', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Berserk&eyebrows=angryNatural', rarity: Rarity.EPIC, cost: 7500, estimatedValue: 8000 },
  { id: 'skin_div_duke', name: 'Dividenden Duke', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Duke&top=hat&clothing=blazerAndShirt', rarity: Rarity.EPIC, cost: 7800, estimatedValue: 8500 },

  // 🟡 LEGENDARY (15 Skins) - Ultimate
  { id: 'skin_grand_auditor', name: 'The Grand Auditor', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grand&clothingColor=gold&hairColor=blondeGolden', rarity: Rarity.LEGENDARY, cost: 0, estimatedValue: 12000 },
  { id: 'skin_cfo_emperor', name: 'CFO Emperor', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emperor&top=hat&accessories=sunglasses', rarity: Rarity.LEGENDARY, cost: 0, estimatedValue: 13000 },
  { id: 'skin_sheet_dragon', name: 'Balance Dragon', image: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Dragon', rarity: Rarity.LEGENDARY, cost: 0, estimatedValue: 14000 },
  { id: 'skin_gold_crypto', name: 'Golden Crypto', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=GoldCrypto&colors=amber', rarity: Rarity.LEGENDARY, cost: 0, estimatedValue: 15000 },
  { id: 'skin_excel_archmage', name: 'Excel Archmage', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Archmage&colors=purple', rarity: Rarity.LEGENDARY, cost: 0, estimatedValue: 16000 },
  { id: 'skin_tax_overlord', name: 'Tax Overlord', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Overlord&colors=red', rarity: Rarity.LEGENDARY, cost: 0, estimatedValue: 17000 },
  { id: 'skin_divine_revisor', name: 'Divine Revisor', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Divine&hairColor=white&skinColor=light', rarity: Rarity.LEGENDARY, cost: 0, estimatedValue: 18000 },
  { id: 'skin_shadow_acc', name: 'Shadow Accountant', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shadow&skinColor=black&top=hat', rarity: Rarity.LEGENDARY, cost: 0, estimatedValue: 19000 },
  { id: 'skin_profit_god', name: 'Profit God', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=God&clothing=blazerAndShirt&accessories=sunglasses', rarity: Rarity.LEGENDARY, cost: 0, estimatedValue: 20000 },
  { id: 'skin_ledger_king', name: 'Ledger King', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KingLedger&top=hat', rarity: Rarity.LEGENDARY, cost: 0, estimatedValue: 22000 },
  { id: 'skin_crypto_pharaoh', name: 'Crypto Pharaoh', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pharaoh&skinColor=yellow&top=turban', rarity: Rarity.LEGENDARY, cost: 0, estimatedValue: 25000 },
  { id: 'skin_supreme_auditor', name: 'Supreme Auditor', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Supreme&colors=lime', rarity: Rarity.LEGENDARY, cost: 0, estimatedValue: 28000 },
  { id: 'skin_neon_cfo', name: 'Neon CFO Titan', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=Titan&colors=pink', rarity: Rarity.LEGENDARY, cost: 0, estimatedValue: 30000 },
  { id: 'skin_market_master', name: 'Master of Markets', image: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Bull', rarity: Rarity.LEGENDARY, cost: 0, estimatedValue: 35000 },
  { id: 'skin_final_boss', name: 'Jahresabschluss-Gott', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=FinalBoss&colors=amber', rarity: Rarity.LEGENDARY, cost: 0, estimatedValue: 50000 },

  // EXCLUSIVE EVENT SKINS
  { id: 'skin_santa_auditor', name: 'Santa Auditor', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Santa&top=winterHat1&hairColor=white&facialHair=beardMajestic', rarity: Rarity.EPIC, cost: 0, estimatedValue: 6000 },
  { id: 'skin_holiday_elf', name: 'Holiday Elf', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HolidayElf&top=winterHat02', rarity: Rarity.RARE, cost: 0, estimatedValue: 3000 },
  { id: 'skin_frozen_cfo', name: 'Frozen CFO', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frozen&skinColor=pale&top=hat', rarity: Rarity.LEGENDARY, cost: 0, estimatedValue: 15000 },
];

// --- 5 LOOT BOXES ---

export const CASES: Case[] = [
    {
        id: 'case_starter',
        name: 'Starter Box',
        cost: 400,
        image: '📦',
        contains: SKINS.filter(s => s.rarity === Rarity.COMMON || s.rarity === Rarity.RARE).map(s => s.id)
    },
    {
        id: 'case_elite',
        name: 'Elite Briefcase',
        cost: 900,
        image: '💼',
        contains: SKINS.filter(s => s.rarity !== Rarity.LEGENDARY).map(s => s.id) // Common, Rare, Epic
    },
    {
        id: 'case_treasury',
        name: 'Treasury Vault',
        cost: 2000,
        image: '🏦',
        contains: SKINS.filter(s => s.rarity !== Rarity.COMMON).map(s => s.id) // Rare, Epic, Legendary
    },
    {
        id: 'case_audit',
        name: 'Audit Vault',
        cost: 4500,
        image: '🛡️',
        contains: SKINS.filter(s => s.rarity === Rarity.EPIC || s.rarity === Rarity.LEGENDARY).map(s => s.id) // Epic, Legendary ONLY
    },
    {
        id: 'case_event',
        name: 'Limited Event Box',
        cost: 3000,
        image: '🎁',
        contains: [
            'skin_santa_auditor', 'skin_holiday_elf', 'skin_frozen_cfo', // Exclusives
            ...SKINS.filter(s => s.rarity === Rarity.EPIC).map(s => s.id) // Plus regular Epics as filler
        ]
    }
];

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'heart_refill',
    name: 'Refill Hearts',
    description: 'Restore all your hearts to max.',
    cost: 350,
    icon: '❤️',
    type: 'heart_refill'
  },
  {
    id: 'streak_freeze',
    name: 'Streak Freeze',
    description: 'Protect your streak for one day.',
    cost: 500,
    icon: '🧊',
    type: 'streak_freeze'
  },
  {
    id: 'xp_boost',
    name: 'Double XP',
    description: 'Get 2x XP for the next 30 minutes.',
    cost: 200,
    icon: '⚡',
    type: 'xp_boost'
  }
];

// Simulates a real user database with inventory for search preview
export const MOCK_USER_DB = [
    { 
        id: 'u1', 
        name: 'SarahStonk', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        level: 12,
        inventory: ['skin_profit_god', 'skin_ledger_king', 'skin_neon_auditor', 'skin_tax_samurai', 'skin_audit_ninja']
    },
    { 
        id: 'u2', 
        name: 'AlexCrypto', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        level: 8,
        inventory: ['skin_crypto_pharaoh', 'skin_gold_crypto', 'skin_crypto_cyborg', 'skin_crypto_student']
    },
    { 
        id: 'u3', 
        name: 'TaxWizard', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wizard',
        level: 5,
        inventory: ['skin_tax_overlord', 'skin_tax_angel', 'skin_tax_trainee']
    },
    { 
        id: 'u4', 
        name: 'HedgeFundHank', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hank',
        level: 15,
        inventory: ['skin_market_master', 'skin_capital_knight', 'skin_bond_broker', 'skin_investment_dude']
    },
    { 
        id: 'u5', 
        name: 'AuditAnna', 
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
        level: 9,
        inventory: ['skin_supreme_auditor', 'skin_audit_hacker', 'skin_audit_elf', 'skin_mini_auditor']
    }
];

// Initial Friends including the Trading Bot
export const FRIENDS: Friend[] = [
    {
        id: 'bot_trader',
        name: 'TradingBot 🤖',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=TradeBot',
        isOnline: true,
        status: FriendStatus.ACCEPTED,
        inventory: ['skin_ledger_king', 'skin_profit_god', 'skin_neon_cfo', 'skin_audit_ninja', 'skin_cashflow_kid']
    }
]; 

export const MOCK_LISTINGS: MarketListing[] = [
  { id: 'm1', sellerName: 'TraderJoe', skinId: 'skin_audit_ninja', price: 400, timestamp: Date.now() },
  { id: 'm2', sellerName: 'WhaleAlert', skinId: 'skin_profit_god', price: 25000, timestamp: Date.now() - 100000 },
  { id: 'm3', sellerName: 'Newbie123', skinId: 'skin_novice_student', price: 5, timestamp: Date.now() - 500000 },
];

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { id: '1', name: 'AlexCrypto', xp: 15400, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', isCurrentUser: false },
  { id: '2', name: 'SarahStonk', xp: 12350, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', isCurrentUser: false },
  { id: '3', name: 'You', xp: INITIAL_STATS.xp, avatar: SKINS[0].image, isCurrentUser: true },
  { id: '4', name: 'HansMüller', xp: 900, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hans', isCurrentUser: false },
  { id: '5', name: 'TaxWizard', xp: 850, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wizard', isCurrentUser: false },
];

export const LEVELS: LevelData[] = [
  // ⭐ LEVEL 1 – Grundlagen GoB (Basics)
  { id: 'acc_1_1', subjectId: 'accounting', topic: 'Grundlagen GoB', title: 'Bilanz & JA', type: LevelType.QUIZ, status: LevelStatus.ACTIVE, xpReward: 100, coinReward: 50, difficulty: 'EASY' },
  { id: 'acc_1_2', subjectId: 'accounting', topic: 'Grundlagen GoB', title: 'Inventur & Inventar', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 100, coinReward: 50, difficulty: 'EASY' },
  { id: 'acc_1_3', subjectId: 'accounting', topic: 'Grundlagen GoB', title: 'GoB Basics', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 120, coinReward: 60, difficulty: 'EASY' },
  { id: 'acc_1_4', subjectId: 'accounting', topic: 'Grundlagen GoB', title: 'Vorsicht & Realisation', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 120, coinReward: 60, difficulty: 'EASY' },

  // ⭐ LEVEL 2 – Ansatz & Bewertung
  { id: 'acc_2_1', subjectId: 'accounting', topic: 'Ansatz & Bewertung', title: 'Periodisierung', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 150, coinReward: 70, difficulty: 'MEDIUM' },
  { id: 'acc_2_2', subjectId: 'accounting', topic: 'Ansatz & Bewertung', title: 'AK vs. HK', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 150, coinReward: 70, difficulty: 'MEDIUM' },
  { id: 'acc_2_3', subjectId: 'accounting', topic: 'Ansatz & Bewertung', title: 'Abschreibungen', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 180, coinReward: 80, difficulty: 'MEDIUM' },

  // ⭐ LEVEL 3 – Immaterielle Vermögenswerte
  { id: 'acc_3_1', subjectId: 'accounting', topic: 'Immaterielle VG', title: 'Selbst geschaffene VG', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 200, coinReward: 90, difficulty: 'HARD' },
  { id: 'acc_3_2', subjectId: 'accounting', topic: 'Immaterielle VG', title: 'Entwicklungskosten', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 200, coinReward: 90, difficulty: 'HARD' },

  // ⭐ LEVEL 4 – Firmenwert (GoF)
  { id: 'acc_4_1', subjectId: 'accounting', topic: 'Firmenwert (GoF)', title: 'Ansatz GoF', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 220, coinReward: 100, difficulty: 'HARD' },
  { id: 'acc_4_2', subjectId: 'accounting', topic: 'Firmenwert (GoF)', title: 'Folgebewertung', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 220, coinReward: 100, difficulty: 'HARD' },
  { id: 'acc_4_3', subjectId: 'accounting', topic: 'Firmenwert (GoF)', title: 'Latente Steuern I', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 250, coinReward: 120, difficulty: 'HARD' },

  // ⭐ LEVEL 5 – Vorräte & Bewertungsvereinfachung
  { id: 'acc_5_1', subjectId: 'accounting', topic: 'Vorräte', title: 'Vereinfachungen', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 150, coinReward: 70, difficulty: 'MEDIUM' },
  { id: 'acc_5_2', subjectId: 'accounting', topic: 'Vorräte', title: 'FIFO vs. LIFO', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 180, coinReward: 80, difficulty: 'MEDIUM' },

  // ⭐ LEVEL 6 – Passivseite & Rückstellungen
  { id: 'acc_6_1', subjectId: 'accounting', topic: 'Passivseite', title: 'Passivformen', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 200, coinReward: 90, difficulty: 'HARD' },
  { id: 'acc_6_2', subjectId: 'accounting', topic: 'Passivseite', title: 'Drohverlust RSt', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 250, coinReward: 110, difficulty: 'HARD' },
  { id: 'acc_6_3', subjectId: 'accounting', topic: 'Passivseite', title: 'Abzinsung', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 200, coinReward: 90, difficulty: 'HARD' },
  { id: 'acc_6_4', subjectId: 'accounting', topic: 'Passivseite', title: 'Prozessrückstellungen', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 220, coinReward: 100, difficulty: 'HARD' },

  // ⭐ LEVEL 7 – Latente Steuern (Advanced)
  { id: 'acc_7_1', subjectId: 'accounting', topic: 'Latente Steuern', title: 'Konzept & Differenzen', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 300, coinReward: 150, difficulty: 'HARD' },
  { id: 'acc_7_2', subjectId: 'accounting', topic: 'Latente Steuern', title: 'Advanced Cases', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 350, coinReward: 180, difficulty: 'HARD' },

  // ⭐ LEVEL 8 – GuV, Anhang, Lagebericht
  { id: 'acc_8_1', subjectId: 'accounting', topic: 'Jahresabschluss', title: 'GKV vs UKV', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 150, coinReward: 70, difficulty: 'MEDIUM' },
  { id: 'acc_8_2', subjectId: 'accounting', topic: 'Jahresabschluss', title: 'Anhang', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 150, coinReward: 70, difficulty: 'MEDIUM' },
  { id: 'acc_8_3', subjectId: 'accounting', topic: 'Jahresabschluss', title: 'Lagebericht', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 150, coinReward: 70, difficulty: 'MEDIUM' },
  { id: 'acc_8_4', subjectId: 'accounting', topic: 'Jahresabschluss', title: 'Prüfung & Offenlegung', type: LevelType.QUIZ, status: LevelStatus.LOCKED, xpReward: 200, coinReward: 100, difficulty: 'HARD' },

  // ⭐ BONUS-LEVEL – BILANZ-BOSSFIGHT
  { id: 'acc_boss_final', subjectId: 'accounting', topic: 'FINAL EXAM', title: 'BILANZ BOSS', type: LevelType.BOSS, status: LevelStatus.LOCKED, xpReward: 1000, coinReward: 1500, difficulty: 'BOSS' },
];
