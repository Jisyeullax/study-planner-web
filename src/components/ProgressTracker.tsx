import { useState } from 'react';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function ProgressTracker() {
  const weeklyData = [
    { day: 'Mon', hours: 3.5, tasks: 8 },
    { day: 'Tue', hours: 4.2, tasks: 10 },
    { day: 'Wed', hours: 2.8, tasks: 6 },
    { day: 'Thu', hours: 5.0, tasks: 12 },
    { day: 'Fri', hours: 3.8, tasks: 9 },
    { day: 'Sat', hours: 4.5, tasks: 11 },
    { day: 'Sun', hours: 2.0, tasks: 5 },
  ];

  const monthlyData = [
    { week: 'Week 1', hours: 22, tasks: 45 },
    { week: 'Week 2', hours: 26, tasks: 52 },
    { week: 'Week 3', hours: 24, tasks: 48 },
    { week: 'Week 4', hours: 28, tasks: 56 },
  ];

  const subjectProgress = [
    { subject: 'Mathematics', completed: 45, total: 60, grade: 92 },
    { subject: 'Physics', completed: 38, total: 50, grade: 88 },
    { subject: 'English', completed: 52, total: 60, grade: 95 },
    { subject: 'Chemistry', completed: 30, total: 45, grade: 85 },
    { subject: 'History', completed: 42, total: 50, grade: 90 },
  ];

  const achievements = [
    { id: 1, title: '7-Day Streak', description: 'Studied for 7 consecutive days', icon: '🔥', earned: true },
    { id: 2, title: 'Early Bird', description: 'Started studying before 8 AM', icon: '🌅', earned: true },
    { id: 3, title: 'Task Master', description: 'Completed 50 tasks', icon: '✅', earned: true },
    { id: 4, title: 'Speed Reader', description: 'Finished 10 chapters', icon: '📚', earned: false },
    { id: 5, title: 'Perfectionist', description: 'Scored 100% on 5 tests', icon: '💯', earned: false },
    { id: 6, title: 'Marathon', description: 'Study for 5 hours straight', icon: '⏱️', earned: true },
  ];

  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const totalHours = weeklyData.reduce((sum, day) => sum + day.hours, 0);
  const totalTasks = weeklyData.reduce((sum, day) => sum + day.tasks, 0);
  const avgHours = (totalHours / 7).toFixed(1);
  const completedTasks = Math.floor(totalTasks * 0.75);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Progress Tracker</h2>
        <p className="text-muted-foreground">Monitor your study progress and achievements</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl mb-1">{totalHours.toFixed(1)}h</p>
          <p className="text-sm text-muted-foreground">This Week</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-chart-2/20 rounded-lg">
              <Calendar className="w-5 h-5 text-chart-2" />
            </div>
          </div>
          <p className="text-2xl mb-1">{avgHours}h</p>
          <p className="text-sm text-muted-foreground">Daily Average</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-chart-3/20 rounded-lg">
              <Target className="w-5 h-5 text-chart-3" />
            </div>
          </div>
          <p className="text-2xl mb-1">{completedTasks}/{totalTasks}</p>
          <p className="text-sm text-muted-foreground">Tasks Done</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-chart-4/20 rounded-lg">
              <Award className="w-5 h-5 text-chart-4" />
            </div>
          </div>
          <p className="text-2xl mb-1">{achievements.filter(a => a.earned).length}/{achievements.length}</p>
          <p className="text-sm text-muted-foreground">Achievements</p>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3>Study Activity</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                viewMode === 'week'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                viewMode === 'month'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              Month
            </button>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'week' ? (
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="hours" fill="#8b6f47" radius={[8, 8, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="hours" stroke="#8b6f47" strokeWidth={3} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject Progress */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="mb-6">Subject Progress</h3>
        <div className="space-y-4">
          {subjectProgress.map((subject) => {
            const percentage = Math.round((subject.completed / subject.total) * 100);
            return (
              <div key={subject.subject}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h4>{subject.subject}</h4>
                    <span className="text-sm text-muted-foreground">
                      {subject.completed}/{subject.total} tasks
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded-full">
                      {subject.grade}%
                    </span>
                  </div>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{percentage}% complete</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="mb-6">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-xl border transition-all ${
                achievement.earned
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-secondary/30 opacity-50'
              }`}
            >
              <div className="text-4xl mb-3 text-center">{achievement.icon}</div>
              <h4 className="text-center mb-2">{achievement.title}</h4>
              <p className="text-sm text-muted-foreground text-center">{achievement.description}</p>
              {achievement.earned && (
                <div className="mt-3 text-center">
                  <span className="text-xs px-3 py-1 bg-primary text-primary-foreground rounded-full">
                    Earned
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Card */}
      <div className="bg-gradient-to-r from-primary/10 to-chart-2/10 border border-border rounded-xl p-6 text-center">
        <Award className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h3 className="mb-2">Keep Up the Great Work!</h3>
        <p className="text-muted-foreground mb-4">
          You've studied {totalHours.toFixed(1)} hours this week. You're on track to reach your goals!
        </p>
        <div className="flex items-center justify-center gap-6 text-sm">
          <div>
            <p className="text-2xl mb-1">7</p>
            <p className="text-muted-foreground">Day Streak</p>
          </div>
          <div className="w-px h-12 bg-border" />
          <div>
            <p className="text-2xl mb-1">85%</p>
            <p className="text-muted-foreground">Goal Progress</p>
          </div>
          <div className="w-px h-12 bg-border" />
          <div>
            <p className="text-2xl mb-1">Top 10%</p>
            <p className="text-muted-foreground">Performance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
