import { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle, Target, Clock, Trophy, Star, Flame, Medal, BookOpen, CalendarDays } from 'lucide-react';

export default function ProgressTracker() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'year'>('week');
  
  // Data dikosongkan (0) untuk memulai dari awal
  const studyData = {
    week: [
      { label: 'Mon', value: 0, max: 240 },
      { label: 'Tue', value: 0, max: 240 },
      { label: 'Wed', value: 0, max: 240 },
      { label: 'Thu', value: 0, max: 240 },
      { label: 'Fri', value: 0, max: 240 },
      { label: 'Sat', value: 0, max: 240 },
      { label: 'Sun', value: 0, max: 240 },
    ],
    month: [
      { label: 'Week 1', value: 0, max: 1500 },
      { label: 'Week 2', value: 0, max: 1500 },
      { label: 'Week 3', value: 0, max: 1500 },
      { label: 'Week 4', value: 0, max: 1500 },
    ],
    year: [
      { label: 'Jan', value: 0, max: 6000 },
      { label: 'Feb', value: 0, max: 6000 },
      { label: 'Mar', value: 0, max: 6000 },
      { label: 'Apr', value: 0, max: 6000 },
      { label: 'May', value: 0, max: 6000 },
      { label: 'Jun', value: 0, max: 6000 },
      { label: 'Jul', value: 0, max: 6000 },
      { label: 'Aug', value: 0, max: 6000 },
      { label: 'Sep', value: 0, max: 6000 },
      { label: 'Oct', value: 0, max: 6000 },
      { label: 'Nov', value: 0, max: 6000 },
      { label: 'Dec', value: 0, max: 6000 },
    ]
  };

  const currentChartData = studyData[timeFilter];

  useEffect(() => {
    setTasks(JSON.parse(localStorage.getItem('study_tasks') || '[]'));
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const totalStudyHours = Math.round(studyData.week.reduce((acc, curr) => acc + curr.value, 0) / 60);

  const subjectsProgress = tasks.reduce((acc: any, task: any) => {
    const subjectName = task.subject || task.category || 'General';
    if (!acc[subjectName]) {
      acc[subjectName] = { total: 0, completed: 0 };
    }
    acc[subjectName].total += 1;
    if (task.completed) acc[subjectName].completed += 1;
    return acc;
  }, {});

  const subjectArray = Object.keys(subjectsProgress).map(key => {
    const data = subjectsProgress[key];
    return {
      name: key,
      percentage: Math.round((data.completed / data.total) * 100),
      ...data
    };
  });

  const achievements = [
    {
      id: 1,
      title: "First Step",
      description: "Complete your first task",
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      isUnlocked: completedTasks >= 1
    },
    {
      id: 2,
      title: "Task Master",
      description: "Complete 10 tasks",
      icon: Medal,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      isUnlocked: completedTasks >= 10
    },
    {
      id: 3,
      title: "On Fire",
      description: "Reach 100% completion rate",
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      isUnlocked: taskCompletionRate === 100 && totalTasks > 0
    },
    {
      id: 4,
      title: "Scholar",
      description: "Study for more than 5 hours",
      icon: BookOpen,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      isUnlocked: totalStudyHours >= 5
    }
  ];

  const formatTimeHover = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold mb-2">My Progress & Analytics</h2>
        <p className="text-muted-foreground">Track your study time, subject mastery, and achievements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-full"><CheckCircle className="w-8 h-8 text-primary" /></div>
          <div>
            <p className="text-sm text-muted-foreground">Completed Tasks</p>
            <p className="text-3xl font-bold">{completedTasks}</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
          <div className="p-4 bg-chart-2/10 rounded-full"><TrendingUp className="w-8 h-8 text-chart-2" /></div>
          <div>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
            <p className="text-3xl font-bold">{taskCompletionRate}%</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
          <div className="p-4 bg-chart-4/10 rounded-full"><Clock className="w-8 h-8 text-chart-4" /></div>
          <div>
            <p className="text-sm text-muted-foreground">Total Study Time</p>
            <p className="text-3xl font-bold">{totalStudyHours} <span className="text-lg font-medium text-muted-foreground">hrs</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" /> Study Analytics
            </h3>
            <div className="flex bg-secondary p-1 rounded-lg">
              <button 
                onClick={() => setTimeFilter('week')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeFilter === 'week' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Week
              </button>
              <button 
                onClick={() => setTimeFilter('month')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeFilter === 'month' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Month
              </button>
              <button 
                onClick={() => setTimeFilter('year')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeFilter === 'year' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Year
              </button>
            </div>
          </div>

          <div className="h-48 flex items-end justify-between gap-1 sm:gap-2 mt-auto">
            {currentChartData.map((data, index) => {
              const heightPercent = Math.min((data.value / data.max) * 100, 100);
              return (
                <div key={`${timeFilter}-${index}`} className="flex flex-col items-center flex-1 gap-2 group h-full justify-end">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-[10px] px-2 py-1 rounded absolute -mt-8 pointer-events-none z-10 whitespace-nowrap">
                    {formatTimeHover(data.value)}
                  </div>
                  <div className="w-full bg-secondary rounded-t-md flex items-end overflow-hidden relative">
                    <div 
                      className="w-full bg-primary/80 group-hover:bg-primary transition-all duration-700 ease-out rounded-t-md"
                      style={{ height: `${heightPercent}%`, minHeight: data.value > 0 ? '10%' : '0%' }}
                    />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground truncate w-full text-center">
                    {timeFilter === 'year' ? data.label[0] : data.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-chart-2" /> Subject Progress
          </h3>
          <div className="space-y-5 overflow-y-auto max-h-[240px] pr-2 no-scrollbar">
            {subjectArray.length > 0 ? (
              subjectArray.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-foreground">{subject.name}</span>
                    <span className="text-muted-foreground">{subject.completed}/{subject.total} ({subject.percentage}%)</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-chart-2 transition-all duration-1000 ease-out rounded-full"
                      style={{ width: `${subject.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground text-sm border border-dashed border-border rounded-xl">
                No tasks available yet. Add tasks with subjects to see progress!
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-bold flex items-center gap-2 mb-6">
          <Trophy className="w-5 h-5 text-yellow-500" /> Achievements
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((badge) => {
            const Icon = badge.icon;
            return (
              <div 
                key={badge.id} 
                className={`
                  p-4 rounded-xl border flex flex-col items-center text-center transition-all duration-300
                  ${badge.isUnlocked 
                    ? `bg-card border-border shadow-sm hover:scale-[1.02]` 
                    : 'bg-muted/30 border-dashed border-border opacity-60 grayscale hover:grayscale-0'
                  }
                `}
              >
                <div className={`p-3 rounded-full mb-3 transition-colors ${badge.isUnlocked ? badge.bgColor : 'bg-muted'}`}>
                  <Icon className={`w-6 h-6 ${badge.isUnlocked ? badge.color : 'text-muted-foreground'}`} />
                </div>
                <h4 className={`font-semibold text-sm ${badge.isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {badge.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {badge.description}
                </p>
                
                {badge.isUnlocked ? (
                  <span className="mt-3 text-[10px] font-bold text-green-500 uppercase tracking-wider bg-green-500/10 px-2 py-1 rounded">Unlocked</span>
                ) : (
                  <span className="mt-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider bg-secondary px-2 py-1 rounded">Locked</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}