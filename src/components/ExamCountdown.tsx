import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react';
import { differenceInDays, differenceInHours, format } from 'date-fns';

interface Exam {
  id: number;
  subject: string;
  date: string;
  time: string;
  location: string;
  topics: string;
  priority: 'low' | 'medium' | 'high';
}

export default function ExamCountdown() {
  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('study_exams');
    if (saved) return JSON.parse(saved);
    return [];
  });

  useEffect(() => {
    localStorage.setItem('study_exams', JSON.stringify(exams));
  }, [exams]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newExam, setNewExam] = useState({
    subject: '',
    date: '',
    time: '',
    location: '',
    topics: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const addExam = () => {
    if (newExam.subject && newExam.date) {
      const exam: Exam = {
        id: Date.now(),
        ...newExam,
      };
      setExams([...exams, exam].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      setNewExam({
        subject: '',
        date: '',
        time: '',
        location: '',
        topics: '',
        priority: 'medium',
      });
      setShowAddForm(false);
    }
  };

  const deleteExam = (id: number) => {
    setExams(exams.filter(e => e.id !== id));
  };

  const getCountdown = (date: string, time: string) => {
    const examDateTime = new Date(`${date}T${time || '00:00'}`);
    const now = new Date();
    const days = differenceInDays(examDateTime, now);
    const hours = differenceInHours(examDateTime, now) % 24;

    if (days < 0) return { text: 'Past', urgent: false, color: 'text-muted-foreground' };
    if (days === 0 && hours <= 0) return { text: 'Today!', urgent: true, color: 'text-destructive' };
    if (days === 0) return { text: `${hours}h`, urgent: true, color: 'text-destructive' };
    if (days === 1) return { text: 'Tomorrow', urgent: true, color: 'text-chart-4' };
    if (days <= 7) return { text: `${days} days`, urgent: true, color: 'text-chart-4' };
    return { text: `${days} days`, urgent: false, color: 'text-foreground' };
  };

  const upcomingExams = exams
    .filter(e => new Date(e.date) >= new Date())
    .slice(0, 3);

  const nextExam = upcomingExams[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Exam Countdown</h2>
          <p className="text-muted-foreground">Track your upcoming exams and deadlines</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Exam
        </button>
      </div>

      {/* Add Exam Form */}
      {showAddForm && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="mb-4">Add New Exam</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm mb-2">Subject/Title</label>
              <input
                type="text"
                value={newExam.subject}
                onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                placeholder="e.g., Mathematics Final Exam"
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Date</label>
              <input
                type="date"
                value={newExam.date}
                onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Time</label>
              <input
                type="time"
                value={newExam.time}
                onChange={(e) => setNewExam({ ...newExam, time: e.target.value })}
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Location</label>
              <input
                type="text"
                value={newExam.location}
                onChange={(e) => setNewExam({ ...newExam, location: e.target.value })}
                placeholder="e.g., Hall A, Room 301"
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Priority</label>
              <select
                value={newExam.priority}
                onChange={(e) => setNewExam({ ...newExam, priority: e.target.value as 'low' | 'medium' | 'high' })}
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-2">Topics Covered</label>
              <textarea
                value={newExam.topics}
                onChange={(e) => setNewExam({ ...newExam, topics: e.target.value })}
                placeholder="e.g., Calculus, Linear Algebra, Statistics"
                rows={3}
                className="w-full px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={addExam}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Add Exam
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

      {/* Next Exam Highlight */}
      {nextExam && (
        <div className="bg-gradient-to-br from-primary/10 to-chart-2/10 border-2 border-primary/30 rounded-xl p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <AlertCircle className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3>Next Exam</h3>
                <span className={`text-2xl ${getCountdown(nextExam.date, nextExam.time).color}`}>
                  {getCountdown(nextExam.date, nextExam.time).text}
                </span>
              </div>
              <p className="text-2xl mb-4">{nextExam.subject}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{format(new Date(nextExam.date), 'MMMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{nextExam.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">📍</span>
                  <span>{nextExam.location}</span>
                </div>
              </div>
              {nextExam.topics && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-1">Topics:</p>
                  <p className="text-sm">{nextExam.topics}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl mb-1">{exams.length}</p>
          <p className="text-sm text-muted-foreground">Total Exams</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl mb-1">{upcomingExams.length}</p>
          <p className="text-sm text-muted-foreground">Upcoming</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl mb-1">{exams.filter(e => e.priority === 'high').length}</p>
          <p className="text-sm text-muted-foreground">High Priority</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-2xl mb-1">{exams.filter(e => differenceInDays(new Date(e.date), new Date()) <= 7).length}</p>
          <p className="text-sm text-muted-foreground">This Week</p>
        </div>
      </div>

      {/* All Exams */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="mb-4">All Exams ({exams.length})</h3>
        <div className="space-y-3">
          {exams.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No exams scheduled yet</p>
          ) : (
            exams.map(exam => {
              const countdown = getCountdown(exam.date, exam.time);
              return (
                <div
                  key={exam.id}
                  className={`p-4 rounded-lg border transition-all ${
                    countdown.urgent
                      ? 'border-destructive/30 bg-destructive/5'
                      : 'border-border hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4>{exam.subject}</h4>
                        <span className={`text-lg ${countdown.color}`}>
                          {countdown.text}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          exam.priority === 'high'
                            ? 'bg-destructive/10 text-destructive'
                            : exam.priority === 'medium'
                            ? 'bg-chart-4/20 text-chart-4'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {exam.priority}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(exam.date), 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {exam.time || 'Not set'}
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          {exam.location}
                        </div>
                      </div>

                      {exam.topics && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1">Topics:</p>
                          <p className="text-sm">{exam.topics}</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => deleteExam(exam.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Study Tips */}
      <div className="bg-gradient-to-r from-primary/10 to-chart-2/10 border border-border rounded-xl p-6">
        <h3 className="mb-3">Exam Preparation Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Start studying at least 2 weeks before the exam</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Create a study schedule and stick to it</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Review past assignments and practice problems</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Get plenty of rest the night before</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Arrive early and bring all necessary materials</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
