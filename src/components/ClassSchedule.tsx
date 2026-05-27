import { useState, useEffect } from 'react';
import { Clock, MapPin, Plus, Trash2 } from 'lucide-react';

interface ClassItem {
  id: number;
  subject: string;
  time: string;
  room: string;
  professor: string;
  day: string;
  color: string;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const colorOptions = [
  { name: 'Brown', value: '#8b6f47' },
  { name: 'Tan', value: '#a68968' },
  { name: 'Peach', value: '#c9a87c' },
  { name: 'Beige', value: '#d4c4b0' },
  { name: 'Coral', value: '#e89b7c' },
];

export default function ClassSchedule() {
  const [classes, setClasses] = useState<ClassItem[]>(() => {
    const saved = localStorage.getItem('study_classes');
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem('study_classes', JSON.stringify(classes));
  }, [classes]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newClass, setNewClass] = useState({
    subject: '',
    time: '',
    room: '',
    professor: '',
    day: 'Monday',
    color: '#8b6f47',
  });

  const addClass = () => {
    if (newClass.subject && newClass.time) {
      const classItem: ClassItem = {
        id: Date.now(),
        ...newClass,
      };
      setClasses([...classes, classItem]);
      setNewClass({
        subject: '',
        time: '',
        room: '',
        professor: '',
        day: 'Monday',
        color: '#8b6f47',
      });
      setShowAddForm(false);
    }
  };

  const deleteClass = (id: number) => {
    setClasses(classes.filter(c => c.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Class Schedule</h2>
          <p className="text-muted-foreground">View and manage your weekly class schedule</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Class
        </button>
      </div>

      {/* Add Class Form */}
      {showAddForm && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="mb-4">Add New Class</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Subject</label>
              <input
                type="text"
                value={newClass.subject}
                onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                placeholder="e.g., Mathematics"
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Time</label>
              <input
                type="text"
                value={newClass.time}
                onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                placeholder="e.g., 09:00 - 10:30"
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Room</label>
              <input
                type="text"
                value={newClass.room}
                onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                placeholder="e.g., Room 301"
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Professor</label>
              <input
                type="text"
                value={newClass.professor}
                onChange={(e) => setNewClass({ ...newClass, professor: e.target.value })}
                placeholder="e.g., Dr. Smith"
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Day</label>
              <select
                value={newClass.day}
                onChange={(e) => setNewClass({ ...newClass, day: e.target.value })}
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {daysOfWeek.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-2">Color</label>
              <div className="flex gap-2">
                {colorOptions.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setNewClass({ ...newClass, color: color.value })}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      newClass.color === color.value ? 'border-primary scale-110' : 'border-border'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={addClass}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Add Class
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

      {/* Weekly Schedule Grid */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="mb-6">Weekly Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {daysOfWeek.map(day => (
            <div key={day} className="space-y-3">
              <h4 className="text-center pb-3 border-b border-border">{day}</h4>
              <div className="space-y-2 min-h-[200px]">
                {classes
                  .filter(c => c.day === day)
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(classItem => (
                    <div
                      key={classItem.id}
                      className="p-3 rounded-lg border border-border hover:shadow-md transition-shadow relative group"
                      style={{ backgroundColor: `${classItem.color}15` }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-medium text-sm leading-snug" style={{ color: classItem.color }}>
                          {classItem.subject}
                        </p>
                        <button
                          onClick={() => deleteClass(classItem.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all"
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {classItem.time}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {classItem.room}
                        </p>
                        <p className="text-xs text-muted-foreground">{classItem.professor}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Classes List */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="mb-4">All Classes ({classes.length})</h3>
        <div className="space-y-2">
          {classes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No classes added yet</p>
          ) : (
            classes.map(classItem => (
              <div
                key={classItem.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
              >
                <div
                  className="w-1 h-12 rounded-full"
                  style={{ backgroundColor: classItem.color }}
                />
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <p className="font-medium">{classItem.subject}</p>
                    <p className="text-sm text-muted-foreground">{classItem.day}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {classItem.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {classItem.room}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {classItem.professor}
                  </div>
                </div>
                <button
                  onClick={() => deleteClass(classItem.id)}
                  className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
