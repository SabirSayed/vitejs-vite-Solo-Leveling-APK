// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  { id: 1, name: 'Song Jinwoo', tier: 'Rookie Hunter', requirement: '3-day streak • 40% clear • power 2000+', threshold: { streak: 3, weeklyPercent: 40, power: 2000 } },
  { id: 2, name: 'Yoo Jinho', tier: 'Loyal Raider', requirement: '7-day streak • 55% clear • power 2200+', threshold: { streak: 7, weeklyPercent: 55, power: 2200 } },
  { id: 3, name: 'Cha Hae-In', tier: 'S-Rank Grace', requirement: '10-day streak • 70% clear • power 2350+', threshold: { streak: 10, weeklyPercent: 70, power: 2350 } },
  { id: 4, name: 'Baek Yoonho', tier: 'Beast Authority', requirement: '14-day streak • 80% clear • power 2500+', threshold: { streak: 14, weeklyPercent: 80, power: 2500 } },
  { id: 5, name: 'Thomas Andre', tier: 'Nation Level', requirement: '18-day streak • 90% clear • power 2650+', threshold: { streak: 18, weeklyPercent: 90, power: 2650 } },
  { id: 6, name: 'Ashborn', tier: 'Shadow Monarch', requirement: '21-day streak • 100% clear • power 2800+', threshold: { streak: 21, weeklyPercent: 100, power: 2800 } },
];

const STORAGE_KEY = 'solo-training-system-v2';

const defaultState = {
  playerName: 'Sabir',
  title: 'Shadow Monarch of Seoul',
  level: 27,
  xp: 64,
  streak: 12,
  completed: { Mon: true, Tue: true, Wed: false, Thu: false, Fri: false, Sat: false },
  selectedDay: 'Mon',
  claimedTrophies: [1, 2],
  liftStats: { bench: 95, squat: 135, deadlift: 170, overhead: 60, pullups: 17 },
  activeTab: 'today',
  openedBefore: false,
};

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
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
    S: 'text-[#c8d8ff] border-[#536b96] bg-[#0f1724]',
    A: 'text-[#bdd2ff] border-[#41577b] bg-[#0d141f]',
    B: 'text-[#adc7ff] border-[#33496c] bg-[#0c121c]',
    C: 'text-[#9fc7ff] border-[#2b3a56] bg-[#0b1018]',
    D: 'text-[#91b8f3] border-[#243149] bg-[#0a0e15]',
    E: 'text-[#7f9cc7] border-[#1e293b] bg-[#090c12]',
  }[rank];
}

function loadState() {
  if (typeof window === 'undefined') return defaultState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

function Card({ className = '', children }) {
  return <div className={cn('rounded-[22px] border border-[#121824] bg-[#050608]', className)}>{children}</div>;
}

function CardContent({ className = '', children }) {
  return <div className={cn('p-4', className)}>{children}</div>;
}

function CardHeader({ className = '', children }) {
  return <div className={cn('p-4 pb-2', className)}>{children}</div>;
}

function CardTitle({ className = '', children }) {
  return <div className={cn('text-white', className)}>{children}</div>;
}

function Button({ className = '', children, variant = 'default', size = 'default', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-[14px] transition disabled:opacity-40 disabled:cursor-not-allowed';
  const variants = {
    default: 'border border-[#26324a] bg-[#0e1520] text-[#d9e6ff] hover:bg-[#131c2a]',
    secondary: 'border border-[#1a2130] bg-[#0a0d13] text-white/80 hover:bg-[#11161f]',
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

function Progress({ value }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#11151c]">
      <motion.div
        className="h-full rounded-full bg-[#9fc7ff]"
        animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}

function Tabs({ value, onValueChange, children, className = '' }) {
  const items = React.Children.toArray(children);
  const list = items.find((child) => child?.type?.displayName === 'TabsList');
  const contents = items.filter((child) => child?.type?.displayName === 'TabsContent');
  return (
    <div className={className}>
      {list && React.cloneElement(list, { value, onValueChange })}
      {contents.map((content) => (content.props.value === value ? content : null))}
    </div>
  );
}

function TabsList({ children, className = '', value, onValueChange }) {
  return <div className={className}>{React.Children.map(children, (child) => React.cloneElement(child, { value, onValueChange }))}</div>;
}
TabsList.displayName = 'TabsList';

function TabsTrigger({ children, className = '', value: activeValue, onValueChange, value }) {
  const active = activeValue === value;
  return (
    <button
      onClick={() => onValueChange?.(value)}
      className={cn(className, active ? 'bg-[#101722] text-[#dbe7ff] shadow-[0_0_20px_rgba(120,160,255,0.08)]' : 'text-white/55')}
    >
      {children}
    </button>
  );
}

function TabsContent({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}
TabsContent.displayName = 'TabsContent';

function SectionCard({ title, icon: Icon, children, subtitle, className = '' }) {
  return (
    <Card className={cn('rounded-[28px] border-white/6 bg-[rgba(8,8,10,0.96)] shadow-[0_24px_60px_rgba(0,0,0,0.45)]', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="rounded-2xl border border-[#273247] bg-[#10151d] p-2 text-[#9fc7ff] shadow-[0_0_18px_rgba(122,162,255,0.08)]">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <div>{title}</div>
            {subtitle ? <div className="mt-1 text-xs font-normal tracking-wide text-white/45">{subtitle}</div> : null}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function ShadowAura() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]">
      <motion.div
        className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-[#5476b8]/10 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute -right-12 bottom-4 h-44 w-44 rounded-full bg-[#7da6ff]/10 blur-3xl"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
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

  const todayPlan = useMemo(() => weeklyPlan.find((d) => d.day === selectedDay) || weeklyPlan[0], [selectedDay]);
  const completedCount = useMemo(() => Object.values(completed).filter(Boolean).length, [completed]);
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
      })
    );
  }, [playerName, title, level, xp, streak, completed, selectedDay, claimedTrophies, liftStats, activeTab]);

  useEffect(() => {
    if (!showIntro) return;
    const timer = setTimeout(() => setShowIntro(false), 2400);
    return () => clearTimeout(timer);
  }, [showIntro]);

  useEffect(() => {
    if (!showLevelUp) return;
    const timer = setTimeout(() => setShowLevelUp(false), 1800);
    return () => clearTimeout(timer);
  }, [showLevelUp]);

  const addXp = (amount) => {
    setXp((current) => {
      const nextXp = current + amount;
      if (nextXp >= 100) {
        setLevel((prevLevel) => {
          const newLevel = prevLevel + 1;
          setLevelFlash(newLevel);
          setShowLevelUp(true);
          return newLevel;
        });
        return nextXp - 100;
      }
      return nextXp;
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

  return (
    <div className="min-h-screen bg-[#020202] text-white">
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#020202]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative text-center"
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-[#8fb6ff]/10 blur-3xl"
                animate={{ scale: [0.8, 1.3, 1], opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              <p className="relative text-[12px] uppercase tracking-[0.55em] text-[#7fa3dd]">System Awakening</p>
              <motion.h1
                className="relative mt-4 text-5xl font-black tracking-[0.3em] text-[#dce8ff]"
                animate={{ textShadow: ['0 0 0px rgba(143,182,255,0.2)', '0 0 18px rgba(143,182,255,0.55)', '0 0 0px rgba(143,182,255,0.2)'] }}
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
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/45 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 16, scale: 0.92, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              className="rounded-[28px] border border-[#324769] bg-[#070b11] px-8 py-7 text-center shadow-[0_0_50px_rgba(120,160,255,0.18)]"
            >
              <p className="text-[11px] uppercase tracking-[0.38em] text-[#88a9dd]">Level Up</p>
              <p className="mt-3 text-4xl font-black text-[#dbe7ff]">LEVEL {levelFlash}</p>
              <p className="mt-2 text-sm text-white/55">Your shadow grows stronger.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto min-h-screen w-full max-w-sm bg-[#020202] px-4 pb-28 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-[32px] border border-[#121824] bg-[#050608] px-4 pb-5 pt-5 shadow-[0_20px_60px_rgba(0,0,0,0.65)]"
        >
          <ShadowAura />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(122,162,255,0.13),transparent_34%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),transparent_30%,transparent_70%,rgba(122,162,255,0.03))]" />
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-[#89a9d8]">Personal System</p>
                <h1 className="mt-2 text-[28px] font-black leading-[1.05] text-white">
                  SOLO <span className="text-[#a9c5ff]">TRAINING</span>
                </h1>
              </div>
              <div className="rounded-[20px] border border-[#1c2638] bg-[#0a0d13] px-3 py-2 text-right shadow-[0_0_22px_rgba(96,132,190,0.06)]">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">Level</p>
                <motion.p key={level} initial={{ scale: 1.2, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} className="mt-1 text-2xl font-bold text-[#d9e6ff]">{level}</motion.p>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#141b28] bg-[#080b11] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/35">Hunter</p>
                  <p className="mt-2 text-xl font-semibold text-white">{playerName}</p>
                  <p className="mt-1 text-xs text-[#96add8]">{title}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className="border-[#243149] bg-[#0c1118] text-[#a9c5ff]">PPL x2</Badge>
                  <Badge className={cn('text-[11px] font-bold', rankColors(rank))}>RANK {rank}</Badge>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs text-white/55">
                  <span>Ascension progress</span>
                  <motion.span key={xp} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}>{xp}%</motion.span>
                </div>
                <Progress value={xp} />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-[18px] border border-[#151b26] bg-[#06080c] p-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Streak</p>
                  <p className="mt-2 text-lg font-bold text-[#cfe0ff]">{streak}</p>
                </div>
                <div className="rounded-[18px] border border-[#151b26] bg-[#06080c] p-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Power</p>
                  <p className="mt-2 text-lg font-bold text-[#cfe0ff]">{powerScore}</p>
                </div>
                <div className="rounded-[18px] border border-[#151b26] bg-[#06080c] p-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Lift</p>
                  <p className="mt-2 text-lg font-bold text-[#cfe0ff]">{totalLiftCapacity}</p>
                </div>
              </div>

              <Button onClick={() => { setStreak((s) => s + 1); addXp(5); }} className="mt-4 w-full">
                <Zap className="mr-2 h-4 w-4" /> Claim Discipline Bonus
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Card className="shadow-none"><CardContent className="p-3"><p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Split</p><p className="mt-2 text-lg font-bold text-white">PPL</p><p className="text-xs text-white/45">x2 cycle</p></CardContent></Card>
          <Card className="shadow-none"><CardContent className="p-3"><p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Clear</p><p className="mt-2 text-lg font-bold text-white">{weeklyPercent}%</p><p className="text-xs text-white/45">week</p></CardContent></Card>
          <Card className="shadow-none"><CardContent className="p-3"><p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Rank</p><p className="mt-2 text-lg font-bold text-white">{rank}</p><p className="text-xs text-white/45">hunter</p></CardContent></Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-5">
          <TabsList className="grid w-full grid-cols-4 rounded-[18px] border border-[#121824] bg-[#050608] p-1">
            <TabsTrigger value="today" className="rounded-[14px] text-[11px]">Today</TabsTrigger>
            <TabsTrigger value="week" className="rounded-[14px] text-[11px]">Week</TabsTrigger>
            <TabsTrigger value="trophies" className="rounded-[14px] text-[11px]">Trophies</TabsTrigger>
            <TabsTrigger value="rules" className="rounded-[14px] text-[11px]">Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="mt-4 space-y-4">
            <SectionCard title={`${todayPlan.fullDay}`} icon={Swords} subtitle={`${todayPlan.phase} ${todayPlan.split} protocol`}>
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                {weeklyPlan.map((item) => (
                  <button
                    key={item.day}
                    onClick={() => setSelectedDay(item.day)}
                    className={`min-w-[60px] rounded-[16px] border px-3 py-2 text-xs transition ${selectedDay === item.day ? 'border-[#2b3a56] bg-[#101722] text-[#dbe7ff]' : 'border-[#151b26] bg-[#07090d] text-white/55'}`}
                  >
                    {item.day}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <div className="rounded-[22px] border border-[#151b26] bg-[#06080c] p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm text-[#a9c5ff]"><Sunrise className="h-4 w-4" /> Morning practice</div>
                  <div className="space-y-2">
                    {todayPlan.morning.map((task) => (
                      <div key={task} className="flex items-start gap-2 text-sm text-white/75"><CheckCircle2 className="mt-0.5 h-4 w-4 text-[#87a8db]" /><span>{task}</span></div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[22px] border border-[#151b26] bg-[#06080c] p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm text-[#d9e6ff]"><Dumbbell className="h-4 w-4" /> Gym only</div>
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
          </TabsContent>

          <TabsContent value="week" className="mt-4 space-y-4">
            <SectionCard title="Weekly Schedule" icon={CalendarRange} subtitle="Heavy first half • light second half">
              <div className="space-y-3">
                {weeklyPlan.map((item) => (
                  <div key={item.day} className="rounded-[22px] border border-[#151b26] bg-[#06080c] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-base font-semibold text-white">{item.fullDay}</p>
                        <p className="mt-1 text-sm text-white/45">{item.split} day</p>
                      </div>
                      <Badge className={cn(item.phase === 'Heavy' ? 'border-[rgba(111,182,255,0.18)] bg-[rgba(15,22,34,0.96)] text-[#9fc7ff]' : 'border-[rgba(188,203,255,0.12)] bg-[rgba(11,14,20,0.96)] text-[#cfd8ff]')}>
                        {item.phase}
                      </Badge>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" onClick={() => setSelectedDay(item.day)}>View</Button>
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
                  <label key={key} className="rounded-[18px] border border-[#151b26] bg-[#06080c] p-3 text-white/70">
                    <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/35">{label}</div>
                    <input
                      type="number"
                      value={liftStats[key]}
                      onChange={(e) => updateLift(key, e.target.value)}
                      className="w-full rounded-[12px] border border-[#1b2330] bg-[#0b1018] px-3 py-2 text-sm text-white outline-none"
                    />
                  </label>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Push-up Missions" icon={Flame} subtitle="Allowed only 6 AM–12 PM and 6 PM–12 AM">
              <div className="grid grid-cols-1 gap-2">
                {pushupMissions.map((mission) => (
                  <div key={mission} className="rounded-[18px] border border-[#151b26] bg-[#06080c] p-3 text-sm text-white/75">{mission}</div>
                ))}
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="trophies" className="mt-4">
            <SectionCard title="Trophy Path" icon={Crown} subtitle="Weak to strongest">
              <div className="space-y-3">
                {trophyPath.map((trophy) => {
                  const unlocked = canClaimTrophy(trophy.threshold);
                  const claimed = claimedTrophies.includes(trophy.id);
                  return (
                    <div key={trophy.id} className={`rounded-[22px] border p-4 ${claimed ? 'border-[#2d3b22] bg-[#0b0f09]' : unlocked ? 'border-[#253349] bg-[#0a0f16] shadow-[0_0_18px_rgba(125,166,255,0.07)]' : 'border-[#151b26] bg-[#06080c]'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-base font-semibold text-white">{trophy.name}</p>
                          <p className="mt-1 text-xs text-[#a9c5ff]">{trophy.tier}</p>
                          <p className="mt-2 text-xs text-white/45">{trophy.requirement}</p>
                        </div>
                        {claimed ? <Star className="h-5 w-5 text-[#c2d58f]" /> : unlocked ? <Gem className="h-5 w-5 text-[#a9c5ff]" /> : <Lock className="h-5 w-5 text-white/25" />}
                      </div>
                      <Button
                        disabled={!unlocked || claimed}
                        onClick={() => claimTrophy(trophy.id, trophy.threshold)}
                        className={cn('mt-3 w-full', claimed && 'border-[#2d3b22] bg-[#1b2214] text-[#c2d58f] hover:bg-[#1b2214]')}
                      >
                        {claimed ? 'Claimed' : 'Claim Trophy'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="rules" className="mt-4 space-y-4">
            <SectionCard title="System Rules" icon={Shield}>
              <div className="space-y-2 text-sm text-white/75">
                <div className="rounded-[18px] border border-[#151b26] bg-[#06080c] p-3">Monday to Wednesday = heavy strength.</div>
                <div className="rounded-[18px] border border-[#151b26] bg-[#06080c] p-3">Thursday to Saturday = lighter volume.</div>
                <div className="rounded-[18px] border border-[#151b26] bg-[#06080c] p-3">Morning session happens before gym.</div>
                <div className="rounded-[18px] border border-[#151b26] bg-[#06080c] p-3">No push-ups from 12 PM to 6 PM and 12 AM to 6 AM.</div>
              </div>
            </SectionCard>

            <SectionCard title="Mission Status" icon={Sparkles} subtitle="Current limits">
              <div className="space-y-2 text-sm text-white/75">
                <div className="rounded-[18px] border border-[#151b26] bg-[#06080c] p-3">Morning is only stretching + calisthenics practice.</div>
                <div className="rounded-[18px] border border-[#151b26] bg-[#06080c] p-3">Gym session is lifting only.</div>
                <div className="rounded-[18px] border border-[#151b26] bg-[#06080c] p-3">Trophies depend on streaks, clears, and lift capacity.</div>
                <div className="rounded-[18px] border border-[#151b26] bg-[#06080c] p-3">Progress auto-saves on your device.</div>
              </div>
            </SectionCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
