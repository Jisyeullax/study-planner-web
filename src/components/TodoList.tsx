import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  time?: string;
  category: string;
}

export default function TodoList() {
  // 1. Baca data dari Local Storage saat komponen pertama kali dimuat
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('study_tasks');
    if (savedTasks) return JSON.parse(savedTasks);
    return [];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({ priority: 'medium', category: 'Study' });

  // 2. Simpan ke Local Storage setiap kali array 'tasks' berubah
  useEffect(() => {
    localStorage.setItem('study_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.title?.trim()) {
      setTasks([...tasks, { ...newTask, id: Date.now(), completed: false } as Task]);
      setNewTask({ priority: 'medium', category: 'Study', title: '', description: '', dueDate: '', time: '' });
      setShowAddForm(false);
    }
  };

  const toggleTask = (id: number) => setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask = (id: number) => setTasks(tasks.filter(t => t.id !== id));

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold">Tasks & Reminders</h2>
        <p className="text-muted-foreground">Manage your tasks and reminders in one place</p>
      </div>

      {/* Pending Tasks */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" /> Pending
        </h3>
        
        {pendingTasks.map((task) => (
          <div key={task.id} className="bg-card border border-border rounded-xl p-4 flex items-start gap-4 hover:shadow-md transition-shadow">
            <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary" />
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{task.title}</h4>
              {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
              
              <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                {task.dueDate && (
                  <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                    <CalendarIcon className="w-3 h-3" />
                    {task.dueDate} {task.time && <><Clock className="w-3 h-3 ml-1"/> {task.time}</>}
                  </div>
                )}
              </div>
            </div>
            <button onClick={() => deleteTask(task.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Small Add Task Form */}
        <div className="mt-4 border border-dashed border-border rounded-xl p-4 bg-muted/20">
          {!showAddForm ? (
            <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors w-full p-2">
              <Plus className="w-5 h-5" /> Add Task or Reminder...
            </button>
          ) : (
            <div className="space-y-3">
              <input type="text" placeholder="Task title..." autoFocus value={newTask.title || ''} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-1 font-medium" />
              <textarea placeholder="Add description..." value={newTask.description || ''} onChange={(e) => setNewTask({...newTask, description: e.target.value})} className="w-full bg-transparent border-b border-border focus:border-primary outline-none py-1 text-sm resize-none" rows={2} />
              
              <div className="flex gap-3 flex-wrap text-sm">
                <input type="date" value={newTask.dueDate || ''} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} className="bg-background border border-border rounded-md px-2 py-1 outline-none focus:border-primary" />
                <input type="time" value={newTask.time || ''} onChange={(e) => setNewTask({...newTask, time: e.target.value})} className="bg-background border border-border rounded-md px-2 py-1 outline-none focus:border-primary" />
                <select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})} className="bg-background border border-border rounded-md px-2 py-1 outline-none focus:border-primary">
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowAddForm(false)} className="px-4 py-1.5 text-sm hover:bg-secondary rounded-lg transition-colors">Cancel</button>
                <button onClick={addTask} className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">Add Task</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-border">
          <h3 className="text-lg font-semibold text-muted-foreground">Completed</h3>
          {completedTasks.map((task) => (
            <div key={task.id} className="bg-card/50 border border-border rounded-xl p-4 flex items-start gap-4 opacity-75">
              <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} className="mt-1 w-5 h-5 rounded border-border text-primary focus:ring-primary" />
              <div className="flex-1 line-through text-muted-foreground">
                <h4 className="font-medium">{task.title}</h4>
              </div>
              <button onClick={() => deleteTask(task.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}