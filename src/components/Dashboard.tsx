import { useState, useEffect } from 'react';
import { CheckSquare, BookOpen, Layers, Calendar, ListTodo, TrendingUp, Clock, Square } from 'lucide-react';

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  
  const [dashboardTasks, setDashboardTasks] = useState<any[]>([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('study_tasks') || '[]');
    setTasks(storedTasks);
    setNotes(JSON.parse(localStorage.getItem('study_notes') || '[]'));
    setFlashcards(JSON.parse(localStorage.getItem('study_flashcards') || '[]'));
    setSchedule(JSON.parse(localStorage.getItem('study_schedule') || '[]'));
    setExams(JSON.parse(localStorage.getItem('study_exams') || '[]'));

    const pending = storedTasks.filter((t: any) => !t.completed);
    const done = storedTasks.filter((t: any) => t.completed);
    setDashboardTasks([...pending, ...done].slice(0, 4));

    // Update waktu setiap 1 detik
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleTask = (taskId: number) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('study_tasks', JSON.stringify(updatedTasks));

    setDashboardTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const pendingTasks = tasks.filter(t => !t.completed).length;
  const savedNotes = notes.length;
  const flashcardFolders = new Set(flashcards.map(f => f.folder)).size;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const todaysSchedule = schedule.slice(0, 3);

  // --- MESIN PEMROSESAN TANGGAL & WAKTU (SUPER PRESISI) ---
  const processExamDate = (exam: any) => {
    if (!exam || !exam.date) return new Date();
    
    // Cek apakah tanggal sudah mengandung jam bawaan (ISO format)
    const hasTimeInDate = typeof exam.date === 'string' && exam.date.includes('T');
    let examDate = new Date(exam.date);

    // Memecah "YYYY-MM-DD" agar tidak kena bug UTC (Zona waktu bergeser ke 07:00 pagi)
    if (!hasTimeInDate && typeof exam.date === 'string') {
      const [year, month, day] = exam.date.split('-').map(Number);
      examDate = new Date(year, month - 1, day);
    }

    // Jika user menginput jam terpisah (misal exam.time = "09:30")
    if (exam.time && typeof exam.time === 'string') {
      const [hours, minutes] = exam.time.split(':').map(Number);
      examDate.setHours(hours, minutes, 0, 0);
    } else if (!hasTimeInDate) {
      // Jika tidak ada input jam sama sekali, jadikan jam 23:59 (Tengah Malam)
      examDate.setHours(23, 59, 59, 999);
    }
    
    return examDate;
  };

  // Memfilter & Mengurutkan Ujian
  const upcomingExams = exams
    .map(exam => ({
      ...exam,
      actualDate: processExamDate(exam)
    }))
    .filter(exam => {
      // Tampilkan jika ujian ada di masa depan ATAU masih di hari yang sama dengan hari ini
      return exam.actualDate.getTime() >= now.getTime() || exam.actualDate.toDateString() === now.toDateString();
    })
    .sort((a, b) => a.actualDate.getTime() - b.actualDate.getTime());

  const nearestExam = upcomingExams.length > 0 ? upcomingExams[0] : null;

  const getCountdownData = (actualDate: Date) => {
    const diff = actualDate.getTime() - now.getTime();

    // Jika waktu tersisa 0 atau minus, berarti sudah mulai/lewat
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, isPassed: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);

    return { days, hours, minutes, isPassed: false };
  };

  const countdown = nearestExam ? getCountdownData(nearestExam.actualDate) : null;

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
          Hi there! 👋
        </h2>
        <p className="text-muted-foreground">Here is the summary of your study plan today.</p>
      </div>

      {/* TOP ROW: QUICK STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-center">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <CheckSquare className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{pendingTasks}</p>
          <p className="text-sm text-muted-foreground mt-1">Pending Tasks</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-center">
          <div className="w-10 h-10 bg-chart-2/10 rounded-lg flex items-center justify-center mb-4">
            <BookOpen className="w-5 h-5 text-chart-2" />
          </div>
          <p className="text-3xl font-bold">{savedNotes}</p>
          <p className="text-sm text-muted-foreground mt-1">Saved Notes</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-center">
          <div className="w-10 h-10 bg-chart-4/10 rounded-lg flex items-center justify-center mb-4">
            <Layers className="w-5 h-5 text-chart-4" />
          </div>
          <p className="text-3xl font-bold">{flashcardFolders}</p>
          <p className="text-sm text-muted-foreground mt-1">Flashcard Folders</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-center">
          <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold">{taskCompletionRate}%</p>
          <p className="text-sm text-muted-foreground mt-1">Today's Progress</p>
        </div>
      </div>

      {/* BOTTOM ROW: SCHEDULE, TASKS, EXAM */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Today's Schedule */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> Today's Schedule
            </h3>
          </div>

          <div className="flex-1 flex flex-col">
            {todaysSchedule.length > 0 ? (
              <div className="space-y-3">
                {todaysSchedule.map((item, index) => (
                  <div key={index} className="p-3 bg-secondary rounded-lg border border-border/50">
                    <p className="font-medium text-sm">{item.title || item.subject}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.time || 'Time not set'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center py-8 border border-dashed border-border rounded-xl bg-secondary/30">
                <p className="text-sm text-muted-foreground text-center">
                  No classes scheduled for today ☕
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 2. Upcoming Tasks */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-chart-2" /> Upcoming Tasks
            </h3>
          </div>

          <div className="flex-1 flex flex-col">
            {dashboardTasks.length > 0 ? (
              <div className="space-y-3">
                {dashboardTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`p-3 bg-secondary rounded-lg border border-border/50 flex items-start gap-3 group transition-all duration-300 ${task.completed ? 'opacity-60' : 'hover:border-primary/50'}`}
                  >
                    <button 
                      onClick={() => handleToggleTask(task.id)}
                      className={`mt-0.5 transition-colors focus:outline-none ${task.completed ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                    >
                      {task.completed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                    </button>
                    <div>
                      <p className={`font-medium text-sm transition-all duration-300 ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.title || task.name}
                      </p>
                      <p className={`text-xs mt-0.5 transition-all duration-300 ${task.completed ? 'line-through text-muted-foreground/70' : 'text-muted-foreground'}`}>
                        {task.subject || 'General'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center py-8 border border-dashed border-border rounded-xl bg-secondary/30">
                <p className="text-sm text-muted-foreground text-center">
                  Great! All your tasks are completed 👍
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 3. Nearest Exam Countdown (Super Akurat) */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-destructive" /> Next Exam
            </h3>
          </div>

          <div className="flex-1 flex flex-col">
            {nearestExam && countdown ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-destructive/5 rounded-xl border border-destructive/20 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 text-destructive/5 rotate-12">
                  <Clock className="w-32 h-32" />
                </div>
                
                <div className="relative z-10 w-full">
                  <p className="text-sm font-semibold text-destructive uppercase tracking-widest mb-2">Countdown</p>
                  
                  <div className="h-20 flex items-center justify-center mb-2">
                    {countdown.isPassed ? (
                       <span className="text-3xl sm:text-4xl font-bold text-destructive animate-pulse tracking-tighter">
                         EXAM STARTED!
                       </span>
                    ) : countdown.days > 0 ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-6xl font-bold text-foreground tracking-tighter">
                          {countdown.days}
                        </span>
                        <span className="text-xl font-medium text-muted-foreground">Days</span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-5xl font-bold tracking-tighter text-foreground">
                            {String(countdown.hours).padStart(2, '0')}
                          </span>
                          <span className="text-lg font-medium text-muted-foreground">h</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-5xl font-bold tracking-tighter text-foreground">
                            {String(countdown.minutes).padStart(2, '0')}
                          </span>
                          <span className="text-lg font-medium text-muted-foreground">m</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-background px-4 py-2 rounded-lg border border-border inline-block shadow-sm w-full max-w-[200px] truncate">
                    <p className="font-bold text-foreground text-sm truncate">{nearestExam.subject || nearestExam.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {nearestExam.actualDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {nearestExam.time && ` • ${nearestExam.time}`}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-8 border border-dashed border-border rounded-xl bg-secondary/30 text-center px-4">
                <Clock className="w-8 h-8 text-muted-foreground opacity-20 mb-3" />
                <p className="text-sm font-medium text-foreground">No upcoming exams</p>
                <p className="text-xs text-muted-foreground mt-1">You are all clear. Keep up the good work!</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}