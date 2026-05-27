import { useState, useEffect } from 'react';
import { CheckSquare, BookOpen, Layers, Calendar, ListTodo, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  // 1. Mengambil data dari Local Storage
  const [tasks, setTasks] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);

  useEffect(() => {
    setTasks(JSON.parse(localStorage.getItem('study_tasks') || '[]'));
    setNotes(JSON.parse(localStorage.getItem('study_notes') || '[]'));
    setFlashcards(JSON.parse(localStorage.getItem('study_flashcards') || '[]'));
    setSchedule(JSON.parse(localStorage.getItem('study_schedule') || '[]'));
  }, []);

  // 2. Logika Kalkulasi Data
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const savedNotes = notes.length;
  const flashcardFolders = new Set(flashcards.map(f => f.folder)).size;

  // Kalkulasi Progress Tugas Hari Ini
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Batasi tampilan list maksimal 3 item
  const upcomingTasks = tasks.filter(t => !t.completed).slice(0, 3);
  const todaysSchedule = schedule.slice(0, 3);

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-2">
          Hi there! 👋
        </h2>
        <p className="text-muted-foreground">Here is the summary of your study plan today.</p>
      </div>

      {/* TOP ROW: QUICK STATS (Sekarang menjadi 4 Kolom) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* 1. Pending Tasks */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-center">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            <CheckSquare className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{pendingTasks}</p>
          <p className="text-sm text-muted-foreground mt-1">Pending Tasks</p>
        </div>

        {/* 2. Saved Notes */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-center">
          <div className="w-10 h-10 bg-chart-2/10 rounded-lg flex items-center justify-center mb-4">
            <BookOpen className="w-5 h-5 text-chart-2" />
          </div>
          <p className="text-3xl font-bold">{savedNotes}</p>
          <p className="text-sm text-muted-foreground mt-1">Saved Notes</p>
        </div>

        {/* 3. Flashcard Folders */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-center">
          <div className="w-10 h-10 bg-chart-4/10 rounded-lg flex items-center justify-center mb-4">
            <Layers className="w-5 h-5 text-chart-4" />
          </div>
          <p className="text-3xl font-bold">{flashcardFolders}</p>
          <p className="text-sm text-muted-foreground mt-1">Flashcard Folders</p>
        </div>

        {/* 4. Today's Progress (Kolom Baru) */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-center">
          <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold">{taskCompletionRate}%</p>
          <p className="text-sm text-muted-foreground mt-1">Today's Progress</p>
        </div>
      </div>

      {/* BOTTOM ROW: SCHEDULE & TASKS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Today's Schedule */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> Today's Schedule
            </h3>
            <span className="text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              View All
            </span>
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
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  No classes scheduled for today ☕
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-chart-2" /> Upcoming Tasks
            </h3>
            <span className="text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              Manage Tasks
            </span>
          </div>

          <div className="flex-1 flex flex-col">
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map((task, index) => (
                  <div key={index} className="p-3 bg-secondary rounded-lg border border-border/50 flex items-center gap-3">
                    <div className="w-4 h-4 rounded border border-primary/50"></div>
                    <div>
                      <p className="font-medium text-sm">{task.title || task.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{task.subject || 'General'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center py-8 border border-dashed border-border rounded-xl bg-secondary/30">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  Great! All your tasks are completed 👍
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}