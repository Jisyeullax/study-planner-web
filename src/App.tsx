import { useState } from 'react';
import {
  Calendar, CheckSquare, BookOpen, Timer, TrendingUp, Layers,
  Calculator, FolderOpen, Clock, MessageCircle, Home,
  Play, FileText, Users
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import TodoList from './components/TodoList';
import ClassSchedule from './components/ClassSchedule';
import Notes from './components/Notes';
import PomodoroTimer from './components/PomodoroTimer';
import ProgressTracker from './components/ProgressTracker';
import Flashcards from './components/Flashcards';
import FileVault from './components/FileVault';
import ExamCountdown from './components/ExamCountdown';

type ViewType = 'dashboard' | 'todo' | 'schedule' | 'notes' | 'timer' | 'progress' | 'flashcards' | 'files' | 'exams';

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'todo', name: 'Tasks', icon: CheckSquare },
  { id: 'schedule', name: 'Schedule', icon: Calendar },
  { id: 'notes', name: 'Notes', icon: BookOpen },
  { id: 'timer', name: 'Pomodoro', icon: Timer },
  { id: 'progress', name: 'Progress', icon: TrendingUp },
  { id: 'flashcards', name: 'Flashcards', icon: Layers },
  { id: 'files', name: 'Files', icon: FolderOpen },
  { id: 'exams', name: 'Exams', icon: Clock },
];

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onNavigate={(view) => setCurrentView(view as ViewType)} />;
      case 'todo': return <TodoList />;
      case 'schedule': return <ClassSchedule />;
      case 'notes': return <Notes />;
      case 'timer': return <PomodoroTimer />;
      case 'progress': return <ProgressTracker />;
      case 'flashcards': return <Flashcards />;
      case 'files': return <FileVault />;
      case 'exams': return <ExamCountdown />;
      default: return <Dashboard onNavigate={(view) => setCurrentView(view as ViewType)} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-32">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          {renderView()}
        </div>
      </main>

      {/* Bottom Navigation & Quick Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between sm:justify-center gap-1 p-2 overflow-x-auto no-scrollbar">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as ViewType)}
                className={`
                  flex flex-col items-center justify-center min-w-[72px] p-2 rounded-xl transition-colors
                  ${isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}
                `}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}