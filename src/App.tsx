// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CalendarRange,
  CheckCircle2,
  ChevronRight,
  Crown,
  Dumbbell,
  Flame,
  Gem,
  Lock,
  Shield,
  Sparkles,
  Star,
  Sunrise,
  Swords,
  Zap,
} from 'lucide-react';

const weeklyPlan = [
  {
    day: 'Mon',
    fullDay: 'Monday',
    phase: 'Heavy',
    split: 'Push',
    morning: ['Shoulder mobility', 'Hip flexor stretch', 'Wrist mobility', 'Handstand practice 10 min', 'L-sit 5 sets', 'Hanging knee raises 3×15'],
    gym: ['Bench Press 5×5', 'Overhead Press 4×6', 'Incline DB Press 4×6', 'Weighted Dips 4×8', 'Triceps Pushdown 3×10'],
  },
  {
    day: 'Tue',
    fullDay: 'Tuesday',
    phase: 'Heavy',
    split: 'Pull',
    morning: ['Hamstring stretch', 'Thoracic rotation', 'Ankle mobility', 'Pull-up practice 5×max', 'Dips 4×10', 'Plank 3×1 min'],
    gym: ['Deadlift 5×5', 'Pull-ups 5×max', 'Barbell Row 4×6', 'Lat Pulldown 4×8', 'Barbell Curl 4×8'],
  },
  {
    day: 'Wed',
    fullDay: 'Wednesday',
    phase: 'Heavy',
    split: 'Legs',
    morning: ['Hip opener flow', 'Hamstring stretch', 'Ankle mobility', 'Handstand balance 10 min', 'L-sit 5 sets', 'Core raises 3×15'],
    gym: ['Back Squat 5×5', 'Romanian Deadlift 4×6', 'Leg Press 4×8', 'Walking Lunges 3×20', 'Standing Calf Raise 5×12'],
  },
  {
    day: 'Thu',
    fullDay: 'Thursday',
    phase: 'Light',
    split: 'Push',
    morning: ['Shoulder mobility', 'Chest opener', 'Wrist mobility', 'Pull-up technique 5×submax', 'Dips 4×10', 'Plank 3×1 min'],
    gym: ['Incline Bench 4×10', 'DB Shoulder Press 4×10', 'Cable Fly 4×12', 'Lateral Raises 4×15', 'Rope Pushdown 4×12'],
  },
  {
    day: 'Fri',
    fullDay: 'Friday',
    phase: 'Light',
    split: 'Pull',
    morning: ['Thoracic rotation', 'Lat stretch', 'Ankle mobility', 'Handstand line work 10 min', 'L-sit 5 sets', 'Hanging knee raises 3×15'],
    gym: ['Lat Pulldown 4×12', 'Seated Cable Row 4×12', 'DB Row 4×10', 'Face Pull 4×15', 'Hammer Curl 4×12'],
  },
  {
    day: 'Sat',
    fullDay: 'Saturday',
    phase: 'Light',
    split: 'Legs',
    morning: ['Hip flexor stretch', 'Hamstring stretch', 'Ankle mobility', 'Pull-up practice 5×submax', 'Dips 4×10', 'Core plank 3×1 min'],
    gym: ['Front Squat 4×10', 'Leg Curl 4×12', 'Bulgarian Split Squat 3×12', 'Leg Extension 4×12', 'Seated Calf Raise 5×15'],
  },
];

const pushupMissions = ['15 standard push-ups', '20 push-ups', '10 explosive push-ups', '25 slow push-ups', '20 diamond push-ups'];

const trophyPath = [
  { id: 1, name: 'Song Jinwoo', tier: 'Week 2', requirement: '2-week streak • 40% clear • power 2000+', threshold: { streak: 2, weeklyPercent: 40, power: 2000 } },
  { id: 2, name: 'Yoo Jinho', tier: 'Week 4', requirement: '4-week streak • 55% clear • power 2200+', threshold: { streak: 4, weeklyPercent: 55, power: 2200 } },
  { id: 3, name: 'Cha Hae-In', tier: 'Week 6', requirement: '6-week streak • 70% clear • power 2350+', threshold: { streak: 6, weeklyPercent: 70, power: 2350 } },
  { id: 4, name: 'Baek Yoonho', tier: 'Week 8', requirement: '8-week streak • 80% clear • power 2500+', threshold: { streak: 8, weeklyPercent: 80, power: 2500 } },
  { id: 5, name: 'Thomas Andre', tier: 'Week 10', requirement: '10-week streak • 90% clear • power 2650+', threshold: { streak: 10, weeklyPercent: 90, power: 2650 } },
  { id: 6, name: 'Ashborn', tier: 'Week 12', requirement: '12-week streak • 100% clear • power 2800+', threshold: { streak: 12, weeklyPercent: 100, power: 2800 } },
];

const STORAGE_KEY = 'solo-training-system-v3';

const defaultState = {
  playerName: 'Sabir',
  title: 'Shadow Monarch',
  level: 1,
  xp: 0,
  streak: 0,
  completed: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false },
  selectedDay: 'Mon',
  claimedTrophies: [],
  liftStats: { bench: 0, squat: 0, deadlift: 0, overhead: 0, pullups: 0 },
  activeTab: 'today',
  openedBefore: false,
  weekKey: getWeekKey(),
};

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
function getWeekKey() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - start.getTime()) / 86400000);
  const week = Math.ceil((days + start.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${week}`;
}
function getRank(level) {
  if (level >= 50) return 'S';
  if (level >= 42) return 'A';
  if (level >= 34) return 'B';
  if (level >= 26) return 'C';
  if (level >= 18) return 'D';
  return 'E';
}

function rankColors(rank) {
  return {
    S: 'text-[#e9ddff] border-[#7c3aed] bg-[#130a1e]',
    A: 'text-[#dccbff] border-[#6d28d9] bg-[#120a1b]',
    B: 'text-[#ceb7ff] border-[#5b21b6] bg-[#100916]',
    C: 'text-[#c4b5fd] border-[#4c1d95] bg-[#0e0814]',
    D: 'text-[#bda4ff] border-[#3b146f] bg-[#0c0711]',
    E: 'text-[#ad8cff] border-[#2d0f54] bg-[#09060d]',
  }[rank];
}

function loadState() {
  if (typeof window === 'undefined') return defaultState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;

    const saved = { ...defaultState, ...JSON.parse(raw) };
    const currentWeek = getWeekKey();

    if (saved.weekKey !== currentWeek) {
      return {
        ...saved,
        completed: { Mon: false, Tue: false, Wed: false, Thu: false, Fri: false, Sat: false },
        selectedDay: 'Mon',
        weekKey: currentWeek,
      };
    }

    return saved;
  } catch {
    return defaultState;
  }
}

const injectedStyles = `
@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:opsz,wght@6..96,700;6..96,800&family=Orbitron:wght@700;800&display=swap');
.solo-logo {
  font-family: 'Bodoni Moda', serif;
  letter-spacing: 0.12em;
  color: #f3ecff;
  font-weight: 800;
  text-shadow:
    0 0 1px rgba(255,255,255,0.22),
    0 0 14px rgba(139,92,246,0.14);
}
.solo-subsystem {
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 0.28em;
}
.solo-panel {
  background:
    radial-gradient(circle at 50% 35%, rgba(168,85,247,0.18), transparent 45%),
    radial-gradient(circle at 8% 20%, rgba(236,72,153,0.08), transparent 25%),
    linear-gradient(180deg, rgba(20,8,34,0.96), rgba(4,2,10,0.98));
  border: 1px solid rgba(196,181,253,0.18);
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.03),
    inset 0 0 60px rgba(168,85,247,0.08),
    0 0 35px rgba(124,58,237,0.14);
  position: relative;
}
.solo-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(125deg, transparent 0%, rgba(255,255,255,0.035) 18%, transparent 30%),
    linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.05) 50%, transparent 100%);
  mix-blend-mode: screen;
}
.solo-panel::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    repeating-linear-gradient(135deg, rgba(168,85,247,0.04) 0 1px, transparent 1px 10px),
    repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 14px);
  opacity: 0.35;
}
.solo-meter {
  background: linear-gradient(90deg, #5b21b6 0%, #8b5cf6 45%, #c084fc 75%, #f5d0fe 100%);
  box-shadow: 0 0 10px rgba(168,85,247,0.45), 0 0 24px rgba(168,85,247,0.18);
}
.solo-outline {
  box-shadow: 0 0 0 1px rgba(196,181,253,0.15), 0 0 20px rgba(168,85,247,0.12);
}
`;

if (typeof document !== 'undefined' && !document.getElementById('solo-leveling-style')) {
  const style = document.createElement('style');
  style.id = 'solo-leveling-style';
  style.innerHTML = injectedStyles;
  document.head.appendChild(style);
}

function Card({ className = '', children }) {
  return <div className={cn('rounded-[22px] border border-[#1a1026] bg-[#050307]', className)}>{children}</div>;
}

function Button({ className = '', children, variant = 'default', size = 'default', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-[14px] transition disabled:opacity-40 disabled:cursor-not-allowed';
  const variants = {
    default: 'border border-[#4c1d95] bg-[#130a1e] text-[#efe8ff] hover:bg-[#1a0f28]',
    secondary: 'border border-[#261335] bg-[#0b0710] text-white/80 hover:bg-[#120a1a]',
  };
  const sizes = {
    default: 'h-11 px-4 text-sm',
    sm: 'h-8 px-3 text-xs',
  };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props}>{children}</button>;
}

function Badge({ className = '', children }) {
  return <span className={cn('inline-flex items-center rounded-full border px-3 py-1 text-[10px]', className)}>{children}</span>;
}

function SectionCard({ title, icon: Icon, subtitle, children }) {
  return (
    <Card className="solo-panel shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
      <div className="p-4 pb-3">
        <div className="flex items-center gap-3 text-white">
          <div className="rounded-2xl border border-[#4c1d95] bg-[#120918] p-2 text-[#c4b5fd]">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <div className="text-lg font-semibold">{title}</div>
            {subtitle ? <div className="mt-1 text-xs tracking-wide text-white/45">{subtitle}</div> : null}
          </div>
        </div>
      </div>
      <div className="p-4 pt-0">{children}</div>
    </Card>
  );
}

function ShadowAura() {
  const particles = [
    { left: '8%', top: '18%', size: 8, delay: 0 },
    { left: '18%', top: '60%', size: 6, delay: 0.7 },
    { left: '34%', top: '28%', size: 10, delay: 1.2 },
    { left: '56%', top: '14%', size: 6, delay: 0.4 },
    { left: '72%', top: '48%', size: 8, delay: 1.5 },
    { left: '84%', top: '24%', size: 6, delay: 0.9 },
    { left: '64%', top: '74%', size: 10, delay: 1.8 },
    { left: '24%', top: '82%', size: 6, delay: 0.2 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]">
      <motion.div
        className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-[#6d28d9]/12 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.28, 0.62, 0.28] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute -right-12 bottom-4 h-44 w-44 rounded-full bg-[#8b5cf6]/12 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.24, 0.5, 0.24] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      {particles.map((particle, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full bg-[#c4b5fd]/75 shadow-[0_0_10px_rgba(196,181,253,0.65)]"
          style={{ left: particle.left, top: particle.top, width: `${particle.size}px`, height: `${particle.size}px` }}
          animate={{ y: [0, -12, 0], opacity: [0.15, 0.95, 0.15], scale: [0.85, 1.15, 0.85] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: particle.delay }}
        />
      ))}
    </div>
  );
}

export default function SoloLevelingGymSystem() {
  const initial = useMemo(() => loadState(), []);
  const [playerName] = useState(initial.playerName);
  const [title] = useState(initial.title);
  const [level, setLevel] = useState(initial.level);
  const [xp, setXp] = useState(initial.xp);
  const [streak, setStreak] = useState(initial.streak);
  const [completed, setCompleted] = useState(initial.completed);
  const [selectedDay, setSelectedDay] = useState(initial.selectedDay);
  const [claimedTrophies, setClaimedTrophies] = useState(initial.claimedTrophies);
  const [liftStats, setLiftStats] = useState(initial.liftStats);
  const [activeTab, setActiveTab] = useState(initial.activeTab);
  const [showIntro, setShowIntro] = useState(!initial.openedBefore);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelFlash, setLevelFlash] = useState(initial.level);

  const todayPlan = weeklyPlan.find((d) => d.day === selectedDay) || weeklyPlan[0];
  const completedCount = Object.values(completed).filter(Boolean).length;
  const weeklyPercent = Math.round((completedCount / 6) * 100);
  const totalLiftCapacity = liftStats.bench + liftStats.squat + liftStats.deadlift + liftStats.overhead + liftStats.pullups * 2;
  const powerScore = 1380 + completedCount * 45 + streak * 20 + level * 14 + totalLiftCapacity;
  const rank = getRank(level);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        playerName,
        title,
        level,
        xp,
        streak,
        completed,
        selectedDay,
        claimedTrophies,
        liftStats,
        activeTab,
        openedBefore: true,
        weekKey: getWeekKey(),
      })
    );
  }, [playerName, title, level, xp, streak, completed, selectedDay, claimedTrophies, liftStats, activeTab]);

  useEffect(() => {
    if (!showIntro) return;
    const timer = setTimeout(() => setShowIntro(false), 2200);
    return () => clearTimeout(timer);
  }, [showIntro]);

  useEffect(() => {
    if (!showLevelUp) return;
    const timer = setTimeout(() => setShowLevelUp(false), 1700);
    return () => clearTimeout(timer);
  }, [showLevelUp]);

  const addXp = (amount) => {
    setXp((current) => {
      const next = current + amount;
      if (next >= 100) {
        setLevel((prev) => {
          const newLevel = prev + 1;
          setLevelFlash(newLevel);
          setShowLevelUp(true);
          return newLevel;
        });
        return next - 100;
      }
      return next;
    });
  };

  const toggleComplete = (day) => {
    const next = !completed[day];
    setCompleted((prev) => ({ ...prev, [day]: next }));
    if (next) addXp(10);
  };

  const canClaimTrophy = (threshold) => streak >= threshold.streak && weeklyPercent >= threshold.weeklyPercent && powerScore >= threshold.power;

  const claimTrophy = (id, threshold) => {
    if (!canClaimTrophy(threshold) || claimedTrophies.includes(id)) return;
    setClaimedTrophies((prev) => [...prev, id]);
    addXp(12);
  };

  const updateLift = (key, value) => {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return;
    setLiftStats((prev) => ({ ...prev, [key]: numeric }));
  };

  const tabButton = (key, label) => (
    <button
      key={key}
      onClick={() => setActiveTab(key)}
      className={cn(
        'rounded-[14px] px-3 py-2 text-[11px] transition-all duration-200',
        activeTab === key
          ? 'border border-[#6d28d9] bg-[#181022] text-white shadow-[0_0_18px_rgba(139,92,246,0.35)]'
          : 'border border-transparent text-white/55'
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <AnimatePresence>
        {showIntro && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.84, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative text-center">
              <motion.div
                className="absolute inset-0 rounded-full bg-[#8b5cf6]/10 blur-3xl"
                animate={{ scale: [0.8, 1.25, 1], opacity: [0.2, 0.55, 0.2] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <p className="relative text-[12px] uppercase tracking-[0.55em] text-[#bda4ff]">System Awakening</p>
              <motion.h1
                className="relative mt-4 text-5xl font-black tracking-[0.32em] text-[#f1ecff]"
                animate={{ textShadow: ['0 0 0px rgba(139,92,246,0.2)', '0 0 18px rgba(139,92,246,0.55)', '0 0 0px rgba(139,92,246,0.2)'] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                ARISE
              </motion.h1>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLevelUp && (
          <motion.div className="fixed inset-0 z-40 flex items-center justify-center bg-black/45" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ y: 16, scale: 0.92, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="rounded-[28px] border border-[#6d28d9] bg-[#07040b] px-8 py-7 text-center shadow-[0_0_50px_rgba(139,92,246,0.18)]">
              <p className="text-[11px] uppercase tracking-[0.38em] text-[#bda4ff]">Level Up</p>
              <p className="mt-3 text-4xl font-black text-[#f1ecff]">LEVEL {levelFlash}</p>
              <p className="mt-2 text-sm text-white/55">Your shadow grows stronger.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto min-h-screen w-full max-w-sm bg-black px-4 pb-28 pt-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="relative overflow-hidden rounded-[32px] border border-[#1d1029] bg-[#040205] px-4 pb-5 pt-5 shadow-[0_20px_60px_rgba(0,0,0,0.65)]">
          <ShadowAura />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.16),transparent_34%)]" />
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="solo-subsystem text-[10px] uppercase text-[#d7c2ff]">Personal System</p>
                <h1 className="solo-logo mt-2 text-[28px] font-black leading-[1.05]">SOLO LEVELING</h1>
              </div>
              <div className="rounded-[20px] border border-[#2a163a] bg-[#0a060f] px-3 py-2 text-right">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">Level</p>
                <motion.p key={level} initial={{ scale: 1.12, opacity: 0.7 }} animate={{ scale: 1, opacity: 1 }} className="mt-1 text-2xl font-bold text-[#efe8ff]">{level}</motion.p>
              </div>
            </div>

            <div className="solo-panel rounded-[24px] border border-[#241233] bg-[#09050d] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/35">Hunter</p>
                  <p className="mt-2 text-xl font-semibold text-white">{playerName}</p>
                  <p className="mt-1 text-xs text-[#c4b5fd]">{title}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className="border-[#4c1d95] bg-[#120918] text-[#c4b5fd]">PPL x2</Badge>
                  <Badge className={cn('text-[11px] font-bold', rankColors(rank))}>RANK {rank}</Badge>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs text-white/55">
                  <span>Ascension progress</span>
                  <motion.span key={xp} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}>{xp}%</motion.span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#170d22] solo-outline">
                  <motion.div className="h-full rounded-full solo-meter" animate={{ width: `${Math.max(0, Math.min(100, xp))}%` }} transition={{ duration: 0.5 }} />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-12 gap-3">
                <div className="col-span-4 rounded-[20px] border border-[#1d1228] bg-[#060309] p-3">
                  <p className="text-[9px] uppercase tracking-[0.24em] text-white/28">12 Week Streak</p>
                  <p className="mt-3 text-[28px] font-black leading-none text-[#efe8ff]">{streak}<span className="text-sm text-white/35">/12</span></p>
                  <p className="mt-2 text-[11px] text-white/42">Current arc</p>
                </div>
                <div className="col-span-4 rounded-[20px] border border-[#1d1228] bg-[#060309] p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.24em] text-white/28">Power</p>
                      <p className="mt-3 text-[18px] font-black leading-none text-[#efe8ff]">{powerScore}</p>
                    </div>
                  </div>
                  
                </div>
                <div className="col-span-4 rounded-[20px] border border-[#1d1228] bg-[#060309] p-3">
                  <p className="text-[9px] uppercase tracking-[0.24em] text-white/28">Lift Capacity</p>
                  <p className="mt-3 text-[28px] font-black leading-none text-[#efe8ff]">{totalLiftCapacity}</p>
                  
                </div>
              </div>

              <Button onClick={() => { setStreak((s) => s + 1); addXp(5); }} className="mt-4 w-full h-12 rounded-[18px] text-[16px] font-medium">
                <Zap className="mr-2 h-4 w-4" /> Claim Weekly Discipline
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          <Card><div className="p-3"><p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Split</p><p className="mt-2 text-lg font-bold text-white">PPL</p><p className="text-xs text-white/45">x2 cycle</p></div></Card>
          <Card><div className="p-3"><p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Clear</p><p className="mt-2 text-lg font-bold text-white">{weeklyPercent}%</p><p className="text-xs text-white/45">week</p></div></Card>
          <Card><div className="p-3"><p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Rank</p><p className="mt-2 text-lg font-bold text-white">{rank}</p><p className="text-xs text-white/45">hunter</p></div></Card>
          <Card><div className="p-3"><p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Goal</p><p className="mt-2 text-lg font-bold text-white">12</p><p className="text-xs text-white/45">weeks</p></div></Card>
        </div>

        <div className="mt-5 rounded-[18px] border border-[#1a1026] bg-[#050307] p-1 grid grid-cols-4">
          {tabButton('today', 'Today')}
          {tabButton('week', 'Week')}
          {tabButton('trophies', 'Trophies')}
          {tabButton('rules', 'Rules')}
        </div>

        {activeTab === 'today' && (
          <div className="mt-4 space-y-4">
            <SectionCard title={todayPlan.fullDay} icon={Swords} subtitle={`${todayPlan.phase} ${todayPlan.split} protocol`}>
              <div className="mb-3 flex flex-wrap gap-2 pb-1">
                {weeklyPlan.map((item) => (
                  <button
                    key={item.day}
                    onClick={() => setSelectedDay(item.day)}
                    className={cn(
                      'min-w-[60px] rounded-[16px] border px-3 py-2 text-xs transition',
                      selectedDay === item.day ? 'border-[#6d28d9] bg-[#181022] text-[#efe8ff]' : 'border-[#1d1228] bg-[#07040b] text-white/55'
                    )}
                  >
                    {item.day}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div className="rounded-[22px] border border-[#1d1228] bg-[#060309] p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm text-[#c4b5fd]"><Sunrise className="h-4 w-4" /> Morning practice</div>
                  <div className="space-y-2">
                    {todayPlan.morning.map((task) => (
                      <div key={task} className="flex items-start gap-2 text-sm text-white/75"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[#c4b5fd]" /><span>{task}</span></div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[22px] border border-[#1d1228] bg-[#060309] p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm text-[#efe8ff]"><Dumbbell className="h-4 w-4" /> Gym only</div>
                  <div className="space-y-2">
                    {todayPlan.gym.map((lift) => (
                      <div key={lift} className="flex items-start gap-2 text-sm text-white/75"><ChevronRight className="mt-0.5 h-4 w-4 text-white/35" /><span>{lift}</span></div>
                    ))}
                  </div>
                </div>

                <Button className="w-full" onClick={() => toggleComplete(todayPlan.day)}>
                  {completed[todayPlan.day] ? 'Session Cleared' : 'Complete Today'}
                </Button>
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === 'week' && (
          <div className="mt-4 space-y-4">
            <SectionCard title="Weekly Schedule" icon={CalendarRange} subtitle="Heavy first half • light second half">
              <div className="space-y-3">
                {weeklyPlan.map((item) => (
                  <div key={item.day} className="rounded-[22px] border border-[#1d1228] bg-[#060309] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-white">{item.fullDay}</p>
                        <p className="mt-1 text-sm text-white/45">{item.split} day</p>
                      </div>
                      <Badge className={item.phase === 'Heavy' ? 'border-[#6d28d9] bg-[#130a1e] text-[#c4b5fd]' : 'border-[#2a163f] bg-[#0b0710] text-[#e9ddff]'}>{item.phase}</Badge>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" onClick={() => { setSelectedDay(item.day); setActiveTab('today'); }}>View</Button>
                      <Button size="sm" variant="secondary" onClick={() => toggleComplete(item.day)}>
                        {completed[item.day] ? 'Done' : 'Mark'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Lift Capacity" icon={Dumbbell} subtitle="Auto-saved shadow stats">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ['bench', 'Bench'],
                  ['squat', 'Squat'],
                  ['deadlift', 'Deadlift'],
                  ['overhead', 'OHP'],
                  ['pullups', 'Pull-ups'],
                ].map(([key, label]) => (
                  <label key={key} className="rounded-[18px] border border-[#1d1228] bg-[#060309] p-3 text-white/70">
                    <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/35">{label}</div>
                    <input
                      type="number"
                      value={liftStats[key]}
                      onChange={(e) => updateLift(key, e.target.value)}
                      className="w-full rounded-[12px] border border-[#2a163f] bg-[#0b0710] px-3 py-2 text-sm text-white outline-none"
                    />
                  </label>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Push-up Missions" icon={Flame} subtitle="Allowed only 6 AM–12 PM and 6 PM–12 AM">
              <div className="grid grid-cols-1 gap-2">
                {pushupMissions.map((mission) => (
                  <div key={mission} className="rounded-[18px] border border-[#1d1228] bg-[#060309] p-3 text-sm text-white/75">{mission}</div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === 'trophies' && (
          <div className="mt-4">
            <SectionCard title="12 Week Trophy Path" icon={Crown} subtitle="3 month ascension arc">
              <div className="space-y-3">
                {trophyPath.map((trophy) => {
                  const unlocked = canClaimTrophy(trophy.threshold);
                  const claimed = claimedTrophies.includes(trophy.id);
                  return (
                    <div key={trophy.id} className={cn('rounded-[22px] border p-4', claimed ? 'border-[#3f2a12] bg-[#0e0a05]' : unlocked ? 'border-[#4c1d95] bg-[#0d0813]' : 'border-[#1d1228] bg-[#060309]')}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-white">{trophy.name}</p>
                          <p className="mt-1 text-xs text-[#c4b5fd]">{trophy.tier}</p>
                          <p className="mt-2 text-xs text-white/45">{trophy.requirement}</p>
                        </div>
                        {claimed ? <Star className="h-5 w-5 text-[#d8b36a]" /> : unlocked ? <Gem className="h-5 w-5 text-[#c4b5fd]" /> : <Lock className="h-5 w-5 text-white/25" />}
                      </div>
                      <Button
                        disabled={!unlocked || claimed}
                        onClick={() => claimTrophy(trophy.id, trophy.threshold)}
                        className={cn('mt-3 w-full', claimed && 'border-[#3f2a12] bg-[#201507] text-[#d8b36a] hover:bg-[#201507]')}
                      >
                        {claimed ? 'Claimed' : 'Claim Trophy'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="mt-4 space-y-4">
            <SectionCard title="System Rules" icon={Shield}>
              <div className="space-y-2 text-sm text-white/75">
                <div className="rounded-[18px] border border-[#1d1228] bg-[#060309] p-3">Monday to Wednesday = heavy strength.</div>
                <div className="rounded-[18px] border border-[#1d1228] bg-[#060309] p-3">Thursday to Saturday = lighter volume.</div>
                <div className="rounded-[18px] border border-[#1d1228] bg-[#060309] p-3">Morning session happens before gym.</div>
                <div className="rounded-[18px] border border-[#1d1228] bg-[#060309] p-3">No push-ups from 12 PM to 6 PM and 12 AM to 6 AM.</div>
              </div>
            </SectionCard>

            <SectionCard title="Mission Status" icon={Sparkles} subtitle="Current limits">
              <div className="space-y-2 text-sm text-white/75">
                <div className="rounded-[18px] border border-[#1d1228] bg-[#060309] p-3">Morning is only stretching + calisthenics practice.</div>
                <div className="rounded-[18px] border border-[#1d1228] bg-[#060309] p-3">Gym session is lifting only.</div>
                <div className="rounded-[18px] border border-[#1d1228] bg-[#060309] p-3">Trophies depend on streaks, clears, and lift capacity.</div>
                <div className="rounded-[18px] border border-[#1d1228] bg-[#060309] p-3">Progress auto-saves on your device across the full 12 week arc.</div>
              </div>
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
}
