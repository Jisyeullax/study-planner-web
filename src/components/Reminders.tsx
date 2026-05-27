import { useState } from 'react';
import { Bell, Plus, Trash2, Clock } from 'lucide-react';

interface Reminder {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

export default function Reminders() {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 1,
      title: 'Submit Math Assignment',
      description: 'Complete and submit calculus homework',
      date: '2026-05-06',
      time: '23:59',
      priority: 'high',
      category: 'Assignment',
    },
    {
      id: 2,
      title: 'Study Group Meeting',
      description: 'Physics study group at library',
      date: '2026-05-05',
      time: '15:00',
      priority: 'medium',
      category: 'Event',
    },
    {
      id: 3,
      title: 'Review Notes',
      description: 'Review biology chapter 6',
      date: '2026-05-07',
      time: '18:00',
      priority: 'low',
      category: 'Study',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    category: 'General',
  });

  const categories = ['General', 'Assignment', 'Exam', 'Event', 'Study', 'Other'];

  const addReminder = () => {
    if (newReminder.title && newReminder.date) {
      const reminder: Reminder = {
        id: Date.now(),
        ...newReminder,
      };
      setReminders([...reminders, reminder]);
      setNewReminder({
        title: '',
        description: '',
        date: '',
        time: '',
        priority: 'medium',
        category: 'General',
      });
      setShowAddForm(false);
    }
  };

  const deleteReminder = (id: number) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const upcomingReminders = reminders
    .filter(r => new Date(r.date + ' ' + r.time) >= new Date())
    .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());

  const pastReminders = reminders
    .filter(r => new Date(r.date + ' ' + r.time) < new Date())
    .sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Reminders</h2>
          <p className="text-muted-foreground">Stay on track with deadlines and events</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Reminder
        </button>
      </div>

      {/* Add Reminder Form */}
      {showAddForm && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="mb-4">Create Reminder</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm mb-2">Title</label>
              <input
                type="text"
                value={newReminder.title}
                onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                placeholder="Enter reminder title"
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-2">Description</label>
              <textarea
                value={newReminder.description}
                onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                placeholder="Add details..."
                rows={3}
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Date</label>
              <input
                type="date"
                value={newReminder.date}
                onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Time</label>
              <input
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Category</label>
              <select
                value={newReminder.category}
                onChange={(e) => setNewReminder({ ...newReminder, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2">Priority</label>
              <select
                value={newReminder.priority}
                onChange={(e) => setNewReminder({ ...newReminder, priority: e.target.value as 'low' | 'medium' | 'high' })}
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={addReminder}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Add Reminder
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl mb-1">{upcomingReminders.length}</p>
          <p className="text-sm text-muted-foreground">Upcoming</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl mb-1">{reminders.filter(r => r.priority === 'high').length}</p>
          <p className="text-sm text-muted-foreground">High Priority</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl mb-1">{reminders.filter(r => r.date === new Date().toISOString().split('T')[0]).length}</p>
          <p className="text-sm text-muted-foreground">Today</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl mb-1">{pastReminders.length}</p>
          <p className="text-sm text-muted-foreground">Past</p>
        </div>
      </div>

      {/* Upcoming Reminders */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="mb-4">Upcoming Reminders ({upcomingReminders.length})</h3>
        <div className="space-y-3">
          {upcomingReminders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No upcoming reminders</p>
          ) : (
            upcomingReminders.map(reminder => (
              <div
                key={reminder.id}
                className="p-4 rounded-lg border border-border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Bell className={`w-5 h-5 ${
                        reminder.priority === 'high' ? 'text-destructive' :
                        reminder.priority === 'medium' ? 'text-chart-4' : 'text-muted-foreground'
                      }`} />
                      <h4>{reminder.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        reminder.priority === 'high'
                          ? 'bg-destructive/10 text-destructive'
                          : reminder.priority === 'medium'
                          ? 'bg-chart-4/20 text-chart-4'
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {reminder.priority}
                      </span>
                    </div>
                    {reminder.description && (
                      <p className="text-sm text-muted-foreground mb-3">{reminder.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {reminder.date} at {reminder.time}
                      </span>
                      <span className="px-2 py-0.5 bg-secondary rounded-full text-xs">
                        {reminder.category}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Past Reminders */}
      {pastReminders.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="mb-4">Past Reminders ({pastReminders.length})</h3>
          <div className="space-y-2">
            {pastReminders.map(reminder => (
              <div
                key={reminder.id}
                className="p-3 rounded-lg border border-border bg-secondary/30 flex items-center justify-between gap-4 opacity-60"
              >
                <div className="flex-1">
                  <p className="font-medium mb-1">{reminder.title}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{reminder.date} at {reminder.time}</span>
                    <span className="px-2 py-0.5 bg-background rounded-full text-xs">
                      {reminder.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
