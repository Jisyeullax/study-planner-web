import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, Timer as TimerIcon, Clock } from 'lucide-react';

export default function PomodoroTimer() {
  const [timerType, setTimerType] = useState<'pomodoro' | 'stopwatch'>('pomodoro');
  const [isActive, setIsActive] = useState(false);
  
  // State untuk Pomodoro
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  
  // State untuk Timer Biasa (Stopwatch)
  const [stopwatchTime, setStopwatchTime] = useState(0);

  useEffect(() => {
    let interval: number | null = null;
    if (isActive) {
      interval = window.setInterval(() => {
        if (timerType === 'stopwatch') {
          setStopwatchTime(prev => prev + 1);
        } else {
          // Logika Pomodoro
          if (seconds === 0) {
            if (minutes === 0) {
              setIsActive(false);
              setMode(mode === 'work' ? 'break' : 'work');
              setMinutes(mode === 'work' ? 5 : 25);
            } else {
              setMinutes(m => m - 1);
              setSeconds(59);
            }
          } else {
            setSeconds(s => s - 1);
          }
        }
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isActive, minutes, seconds, mode, timerType]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    if (timerType === 'pomodoro') {
      setMode('work');
      setMinutes(25);
      setSeconds(0);
    } else {
      setStopwatchTime(0);
    }
  };

  // Format Stopwatch Time
  const formatStopwatch = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto text-center">
      
      {/* Switch Mode */}
      <div className="flex bg-secondary p-1 rounded-xl w-full mx-auto">
        <button onClick={() => { setTimerType('pomodoro'); setIsActive(false); }} className={`flex-1 py-2 text-sm font-medium rounded-lg flex justify-center items-center gap-2 ${timerType === 'pomodoro' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground'}`}>
          <Clock className="w-4 h-4"/> Pomodoro
        </button>
        <button onClick={() => { setTimerType('stopwatch'); setIsActive(false); }} className={`flex-1 py-2 text-sm font-medium rounded-lg flex justify-center items-center gap-2 ${timerType === 'stopwatch' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground'}`}>
          <TimerIcon className="w-4 h-4"/> Regular Timer
        </button>
      </div>

      {/* Timer Display */}
      <div className="bg-card border border-border rounded-[2rem] p-12 shadow-sm flex flex-col items-center justify-center aspect-square max-w-sm mx-auto">
        <div className="text-7xl font-bold font-mono tracking-tight text-foreground mb-4">
          {timerType === 'pomodoro' 
            ? `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            : formatStopwatch(stopwatchTime)}
        </div>
        <p className="text-muted-foreground font-medium uppercase tracking-widest text-sm mb-8">
          {timerType === 'pomodoro' ? (mode === 'work' ? 'Focus Session' : 'Break Time') : 'Stopwatch Running'}
        </p>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button onClick={resetTimer} className="p-4 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
            <RotateCcw className="w-6 h-6" />
          </button>
          <button onClick={toggleTimer} className={`p-6 rounded-full transition-all transform hover:scale-105 ${isActive ? 'bg-chart-4/20 text-chart-4' : 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'}`}>
            {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
          </button>
        </div>
      </div>
    </div>
  );
}