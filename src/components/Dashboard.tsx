import { useState, useEffect } from 'react';
import { 
  CheckSquare, BookOpen, Layers, Clock, Calendar, 
  ArrowRight, AlertCircle 
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  // --- 1. AMBIL DATA DARI LOCAL STORAGE (Tanpa Grades) ---
  const [tasks, setTasks] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);

  useEffect(() => {
    setTasks(JSON.parse(localStorage.getItem('study_tasks') || '[]'));
    setNotes(JSON.parse(localStorage.getItem('study_notes') || '[]'));
    setFlashcards(JSON.parse(localStorage.getItem('study_flashcards') || '[]'));
    setClasses(JSON.parse(localStorage.getItem('study_classes') || '[]'));
    setExams(JSON.parse(localStorage.getItem('study_exams') || '[]'));
  }, []);

  // --- 2. FUNGSI UNTUK CHECKLIST TUGAS DARI DASHBOARD ---
  const toggleTask = (id: number) => {
    // Ubah status completed pada task yang diklik
    const updatedTasks = tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    
    // Perbarui state di Dashboard
    setTasks(updatedTasks);
    
    // Simpan langsung ke brankas browser agar halaman TodoList juga ikut terupdate
    localStorage.setItem('study_tasks', JSON.stringify(updatedTasks));
  };

  // --- 3. LOGIKA KALKULASI STATISTIK ---
  const pendingTasks = tasks.filter(t => !t.completed);
  const totalNotes = notes.length;
  const totalFolders = Array.from(new Set(flashcards.map(f => f.folder))).length;
  
  const daysInEnglish = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysInEnglish[new Date().getDay()];
  const todayClasses = classes.filter(c => c.day === todayName);

  return (
    <div className="space-y-8">
      {/* Header Welcome */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1 text-foreground">Halo, Jihan! 👋</h1>
        <p className="text-muted-foreground">Ini adalah ringkasan rencana belajarmu hari ini.</p>
      </div>

      {/* --- GRID STATISTIK UTAMA (Menjadi 3 Kolom) --- */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card Tasks */}
        <div 
          onClick={() => onNavigate('todo')} 
          className="bg-card border border-border p-5 rounded-2xl cursor-pointer hover:border-primary hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary"><CheckSquare className="w-5 h-5" /></div>
            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-2xl font-bold text-foreground">{pendingTasks.length}</div>
          <p className="text-xs text-muted-foreground mt-0.5">Tugas Tertunda</p>
        </div>

        {/* Card Notes */}
        <div 
          onClick={() => onNavigate('notes')} 
          className="bg-card border border-border p-5 rounded-2xl cursor-pointer hover:border-primary hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-chart-3/10 text-chart-3 rounded-xl"><BookOpen className="w-5 h-5" /></div>
          </div>
          <div className="text-2xl font-bold text-foreground">{totalNotes}</div>
          <p className="text-xs text-muted-foreground mt-0.5">Catatan Tersimpan</p>
        </div>

        {/* Card Flashcards */}
        <div 
          onClick={() => onNavigate('flashcards')} 
          className="bg-card border border-border p-5 rounded-2xl cursor-pointer hover:border-primary hover:shadow-sm transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-chart-2/10 text-chart-2 rounded-xl"><Layers className="w-5 h-5" /></div>
          </div>
          <div className="text-2xl font-bold text-foreground">{flashcards.length}</div>
          <p className="text-xs text-muted-foreground mt-0.5">{totalFolders} Folder Flashcard</p>
        </div>
      </div>

      {/* --- KONTEN SPLIT --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Sisi Kiri: Jadwal Hari Ini */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> Jadwal Hari Ini
            </h3>
            <button onClick={() => onNavigate('schedule')} className="text-xs text-primary font-medium hover:underline">Lihat Semua</button>
          </div>

          <div className="space-y-3">
            {todayClasses.length > 0 ? (
              todayClasses.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/50">
                  <div className="w-3 h-10 rounded-full" style={{ backgroundColor: c.color || '#000' }} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-foreground truncate">{c.subject}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {c.time} | {c.room}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 border border-dashed border-border rounded-xl">
                <p className="text-sm text-muted-foreground">Tidak ada jadwal kelas untuk hari ini 🎉</p>
              </div>
            )}
          </div>
        </div>

        {/* Sisi Kanan: Tugas Mendatang (Sekarang Bisa di-Checklist) */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-primary" /> Tugas Mendatang
            </h3>
            <button onClick={() => onNavigate('todo')} className="text-xs text-primary font-medium hover:underline">Kelola Tugas</button>
          </div>

          <div className="space-y-3">
            {pendingTasks.length > 0 ? (
              pendingTasks.slice(0, 4).map((task) => (
                <div key={task.id} className="p-3 bg-muted/10 border border-border rounded-xl flex items-start gap-3 hover:bg-muted/30 transition-colors">
                  {/* Checkbox Interaktif ditambahkan di sini */}
                  <input 
                    type="checkbox" 
                    checked={task.completed} 
                    onChange={() => toggleTask(task.id)} 
                    className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer" 
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-foreground truncate">{task.title}</h4>
                    {task.dueDate && (
                      <span className={`text-[11px] mt-0.5 inline-block px-1.5 py-0.5 rounded ${task.priority === 'high' ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-muted-foreground'}`}>
                        DL: {task.dueDate}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 border border-dashed border-border rounded-xl">
                <p className="text-sm text-muted-foreground">Hebat! Semua tugasmu sudah selesai 👍</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* --- LIVE COUNTDOWN UJIAN --- */}
      {exams.length > 0 && (
        <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
          <div className="flex-1 min-w-0 text-sm">
            <span className="font-semibold text-destructive">Ujian Terdekat: </span>
            <span className="text-foreground font-medium">{exams[0].subject}</span> pada {exams[0].date}
          </div>
          <button onClick={() => onNavigate('exams')} className="text-xs bg-destructive/10 text-destructive px-3 py-1.5 rounded-xl hover:bg-destructive/20 font-medium whitespace-nowrap transition-colors">
            Lihat Detail
          </button>
        </div>
      )}
    </div>
  );
}