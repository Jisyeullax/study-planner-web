import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, BookOpen, Settings, Plus, Minus, Timer, Hourglass } from 'lucide-react';

export default function PomodoroTimer() {
  // --- STATE TAB (POMODORO VS STOPWATCH) ---
  const [activeTab, setActiveTab] = useState<'pomodoro' | 'stopwatch'>('pomodoro');

  // --- STATE POMODORO ---
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break' | 'longBreak'>('work');
  const [sessions, setSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4);

  // --- STATE STOPWATCH ---
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [isStopwatchActive, setIsStopwatchActive] = useState(false);

  // --- EFEK UNTUK POMODORO ---
  useEffect(() => {
    let interval: number | null = null;
    if (isActive) {
      interval = window.setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            if (mode === 'work') {
              const newSessions = sessions + 1;
              setSessions(newSessions);
              if (newSessions % sessionsBeforeLongBreak === 0) {
                setMode('longBreak');
                setMinutes(longBreakDuration);
              } else {
                setMode('break');
                setMinutes(breakDuration);
              }
            } else {
              setMode('work');
              setMinutes(workDuration);
            }
            setSeconds(0);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive, minutes, seconds, mode, sessions, workDuration, breakDuration, longBreakDuration, sessionsBeforeLongBreak]);

  // --- EFEK UNTUK STOPWATCH ---
  useEffect(() => {
    let interval: number | null = null;
    if (isStopwatchActive) {
      interval = window.setInterval(() => {
        setStopwatchSeconds(prev => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isStopwatchActive]);

  // --- FUNGSI POMODORO ---
  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setMode('work');
    setMinutes(workDuration);
    setSeconds(0);
  };
  const switchMode = (newMode: 'work' | 'break' | 'longBreak') => {
    setIsActive(false);
    setMode(newMode);
    setSeconds(0);
    if (newMode === 'work') setMinutes(workDuration);
    else if (newMode === 'break') setMinutes(breakDuration);
    else setMinutes(longBreakDuration);
  };
  const handleQuickEdit = (amount: number) => {
    if (isActive) return;
    const newMinutes = Math.max(1, minutes + amount);
    setMinutes(newMinutes);
    setSeconds(0);
    if (mode === 'work') setWorkDuration(newMinutes);
    else if (mode === 'break') setBreakDuration(newMinutes);
    else setLongBreakDuration(newMinutes);
  };

  const percentage = mode === 'work'
    ? ((workDuration * 60 - (minutes * 60 + seconds)) / (workDuration * 60)) * 100
    : mode === 'break'
    ? ((breakDuration * 60 - (minutes * 60 + seconds)) / (breakDuration * 60)) * 100
    : ((longBreakDuration * 60 - (minutes * 60 + seconds)) / (longBreakDuration * 60)) * 100;

  // --- FORMAT STOPWATCH (HH:MM:SS) ---
  const formatStopwatch = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="mb-2 text-2xl font-bold">Study Timer</h2>
          <p className="text-muted-foreground">Manage your study sessions effectively</p>
        </div>
        
        {/* Toggle Tabs (Pomodoro vs Stopwatch) */}
        <div className="flex bg-secondary p-1 rounded-xl">
          <button
            onClick={() => { setActiveTab('pomodoro'); setIsStopwatchActive(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm ${
              activeTab === 'pomodoro' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Hourglass className="w-4 h-4" /> Pomodoro
          </button>
          <button
            onClick={() => { setActiveTab('stopwatch'); setIsActive(false); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm ${
              activeTab === 'stopwatch' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Timer className="w-4 h-4" /> Stopwatch
          </button>
        </div>
      </div>

      {/* --- POMODORO MODE --- */}
      {activeTab === 'pomodoro' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-end">
            <button onClick={() => setShowSettings(!showSettings)} className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {showSettings && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="mb-4 font-semibold">Timer Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-muted-foreground">Work (minutes)</label>
                  <input type="number" value={workDuration} onChange={(e) => setWorkDuration(Number(e.target.value))} min="1" max="60" className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-muted-foreground">Short Break (minutes)</label>
                  <input type="number" value={breakDuration} onChange={(e) => setBreakDuration(Number(e.target.value))} min="1" max="30" className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-muted-foreground">Long Break (minutes)</label>
                  <input type="number" value={longBreakDuration} onChange={(e) => setLongBreakDuration(Number(e.target.value))} min="1" max="60" className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-muted-foreground">Sessions before Long Break</label>
                  <input type="number" value={sessionsBeforeLongBreak} onChange={(e) => setSessionsBeforeLongBreak(Number(e.target.value))} min="2" max="10" className="w-full px-4 py-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-primary" />
                </div>
              </div>
              <button onClick={() => { setShowSettings(false); resetTimer(); }} className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium">
                Apply Settings
              </button>
            </div>
          )}

          <div className="bg-card border border-border rounded-xl p-8">
            <div className="max-w-md mx-auto space-y-8">
              <div className="flex gap-2">
                <button onClick={() => switchMode('work')} className={`flex-1 px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${mode === 'work' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'}`}>
                  <BookOpen className="w-4 h-4" /> Work
                </button>
                <button onClick={() => switchMode('break')} className={`flex-1 px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${mode === 'break' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'}`}>
                  <Coffee className="w-4 h-4" /> Break
                </button>
              </div>

              <div className="relative">
                <svg className="w-full h-auto -rotate-90" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
                  <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-primary transition-all duration-1000" strokeDasharray={`${2 * Math.PI * 90}`} strokeDashoffset={`${2 * Math.PI * 90 * (1 - percentage / 100)}`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-4 mb-2">
                      {!isActive && (
                        <button onClick={() => handleQuickEdit(-1)} className="p-1.5 bg-secondary hover:bg-secondary/80 rounded-full transition-colors text-muted-foreground hover:text-foreground">
                          <Minus className="w-4 h-4" />
                        </button>
                      )}
                      <div className="text-5xl font-bold tabular-nums">
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                      </div>
                      {!isActive && (
                        <button onClick={() => handleQuickEdit(1)} className="p-1.5 bg-secondary hover:bg-secondary/80 rounded-full transition-colors text-muted-foreground hover:text-foreground">
                          <Plus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                      {mode === 'work' ? 'Focus Time' : mode === 'break' ? 'Short Break' : 'Long Break'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button onClick={toggleTimer} className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md font-medium">
                  {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isActive ? 'Pause' : 'Start'}
                </button>
                <button onClick={resetTimer} className="p-4 bg-secondary text-muted-foreground hover:text-foreground rounded-xl transition-colors">
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- STOPWATCH MODE --- */}
      {activeTab === 'stopwatch' && (
        <div className="bg-card border border-border rounded-xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="max-w-md mx-auto space-y-8 py-4">
            
            <div className="text-center space-y-2">
              <h3 className="font-medium text-lg flex items-center justify-center gap-2">
                <Timer className="w-5 h-5 text-primary" /> Free Study Mode
              </h3>
              <p className="text-sm text-muted-foreground">Count up your study time without limits.</p>
            </div>

            <div className="relative">
              <svg className="w-full h-auto -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
                {/* Lingkaran berputar terus saat stopwatch aktif */}
                {isStopwatchActive && (
                  <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-primary animate-spin origin-center opacity-30" strokeDasharray="140 400" />
                )}
                <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`transition-colors duration-500 ${isStopwatchActive ? 'text-primary' : 'text-transparent'}`} strokeDasharray={`${2 * Math.PI * 90}`} strokeDashoffset="0" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`font-bold tabular-nums transition-all ${stopwatchSeconds >= 3600 ? 'text-4xl' : 'text-5xl'}`}>
                    {formatStopwatch(stopwatchSeconds)}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-2">
                    {isStopwatchActive ? 'Recording...' : 'Paused'}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={() => setIsStopwatchActive(!isStopwatchActive)} 
                className="px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md font-medium"
              >
                {isStopwatchActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {isStopwatchActive ? 'Pause' : 'Start'}
              </button>
              <button 
                onClick={() => { setIsStopwatchActive(false); setStopwatchSeconds(0); }} 
                className="p-4 bg-secondary text-muted-foreground hover:text-foreground rounded-xl transition-colors"
                title="Reset Stopwatch"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* --- INFO CARDS (TETAP MUNCUL DI KEDUA MODE) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <BookOpen className="w-8 h-8 mx-auto mb-3 text-primary" />
          <p className="text-2xl mb-1">{sessions * workDuration}</p>
          <p className="text-sm text-muted-foreground">Pomodoro Minutes</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <Timer className="w-8 h-8 mx-auto mb-3 text-chart-2" />
          <p className="text-2xl mb-1">{Math.floor(stopwatchSeconds / 60)}</p>
          <p className="text-sm text-muted-foreground">Stopwatch Minutes</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <Settings className="w-8 h-8 mx-auto mb-3 text-chart-3" />
          <p className="text-2xl mb-1">{sessions}</p>
          <p className="text-sm text-muted-foreground">Total Sessions</p>
        </div>
      </div>

    </div>
  );
}