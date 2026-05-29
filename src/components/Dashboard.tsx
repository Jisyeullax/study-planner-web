import { useState, useEffect } from 'react';
import { CheckSquare, BookOpen, Layers, Calendar, ListTodo, TrendingUp, Clock, Square } from 'lucide-react';

export default function Dashboard() {
  // 1. Mengambil data dari Local Storage
  const [tasks, setTasks] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]); // Tambahan state untuk Ujian

  useEffect(() => {
    setTasks(JSON.parse(localStorage.getItem('study_tasks') || '[]'));
    setNotes(JSON.parse(localStorage.getItem('study_notes') || '[]'));
    setFlashcards(JSON.parse(localStorage.getItem('study_flashcards') || '[]'));
    setSchedule(JSON.parse(localStorage.getItem('study_schedule') || '[]'));
    setExams(JSON.parse(localStorage.getItem('study_exams') || '[]'));
  }, []);

  // --- FUNGSI INTERAKTIF ---
  // Fungsi untuk menandai tugas selesai langsung dari Dashboard
  const handleToggleTask = (taskId: number) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem('study_tasks', JSON.stringify(updatedTasks));
  };

  // --- KALKULASI DATA ---
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const savedNotes = notes.length;
  const flashcardFolders = new Set(flashcards.map(f => f.folder)).size;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Batasi tampilan list maksimal 3-4 item
  const upcomingTasks = tasks.filter(t => !t.completed).slice(0, 4);
  const todaysSchedule = schedule.slice(0, 3);

  // --- KALKULASI EXAM COUNTDOWN ---
  // Mencari ujian yang belum lewat dari hari ini
  const upcomingExams = exams
    .filter(exam => {
      const examDate = new Date(exam.date);
      const today = new Date();
      examDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      return examDate.getTime() >= today.getTime();
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Mengambil 1 ujian terdekat
  const nearestExam = upcomingExams.length > 0 ? upcomingExams[0] : null;

  const getDaysLeft = (dateString: string) => {
    const examDate = new Date(dateString);
    const today = new Date();
    examDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = examDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

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

      {/* BOTTOM ROW: SCHEDULE, TASKS, EXAM (Menjadi 3 Kolom) */}
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

        {/* 2. Upcoming Tasks (Sekarang Interaktif) */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-chart-2" /> Upcoming Tasks
            </h3>
          </div>

          <div className="flex-1 flex flex-col">
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="p-3 bg-secondary rounded-lg border border-border/50 flex items-start gap-3 group transition-colors hover:border-primary/50">
                    <button 
                      onClick={() => handleToggleTask(task.id)}
                      className="mt-0.5 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                    >
                      <Square className="w-5 h-5" />
                    </button>
                    <div>
                      <p className="font-medium text-sm text-foreground">{task.title || task.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{task.subject || 'General'}</p>
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

        {/* 3. Nearest Exam Countdown (Modul Baru) */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-destructive" /> Next Exam
            </h3>
          </div>

          <div className="flex-1 flex flex-col">
            {nearestExam ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-destructive/5 rounded-xl border border-destructive/20 relative overflow-hidden">
                {/* Latar Belakang Dekoratif */}
                <div className="absolute -right-6 -top-6 text-destructive/5 rotate-12">
                  <Clock className="w-32 h-32" />
                </div>
                
                <div className="relative z-10">
                  <p className="text-sm font-semibold text-destructive uppercase tracking-widest mb-2">Countdown</p>
                  <div className="flex items-baseline justify-center gap-1 mb-4">
                    <span className="text-6xl font-bold text-foreground tracking-tighter">
                      {getDaysLeft(nearestExam.date)}
                    </span>
                    <span className="text-xl font-medium text-muted-foreground">Days</span>
                  </div>
                  <div className="bg-background px-4 py-2 rounded-lg border border-border inline-block shadow-sm">
                    <p className="font-bold text-foreground text-sm">{nearestExam.subject || nearestExam.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(nearestExam.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
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