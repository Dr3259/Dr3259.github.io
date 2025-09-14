
"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, XCircle, Smile, Meh, Frown, ListChecks, Link as LinkIcon, MessageSquare, ClipboardList, BarChart2, Calendar, TrendingUp, Award, Target, Clock, Sparkles, Star } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, Area, AreaChart } from 'recharts';
import { format, addDays, parseISO } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePlannerStore } from '@/hooks/usePlannerStore';
import type { TodoItem, MeetingNoteItem, ShareLinkItem, ReflectionItem, RatingType } from '@/lib/page-types';


const translations = {
  'zh-CN': {
    pageTitle: '本周总结',
    backButton: '返回主页',
    weekOf: (date: string) => `${date} 当周`,
    loading: '加载中...',
    noData: '本周暂无数据可供总结。',
    summaryTitle: '文字总结',
    noSummary: '本周未填写文字总结。',
    statsTitle: '数据统计',
    todosTitle: '待办事项',
    completed: '已完成',
    pending: '未完成',
    total: '总计',
    categoryDistribution: '分类统计',
    ratingsTitle: '每日评分',
    noRating: '未评分',
    otherItemsTitle: '其他记录',
    meetingNotes: '会议记录',
    sharedLinks: '分享链接',
    reflections: '个人心得',
    days: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    categories: { work: '工作', study: '学习', shopping: '购物', organizing: '整理', relaxing: '放松', cooking: '做饭', childcare: '带娃', dating: '约会', uncategorized: '未分类' },
    ratingLabels: { excellent: '好极了', average: '一般般', terrible: '糟透了' },
  },
  'en': {
    pageTitle: 'Weekly Summary',
    backButton: 'Back to Home',
    weekOf: (date: string) => `Week of ${date}`,
    loading: 'Loading...',
    noData: 'No data available to summarize for this week.',
    summaryTitle: 'Written Summary',
    noSummary: 'No written summary for this week.',
    statsTitle: 'Statistics',
    todosTitle: 'To-do Items',
    completed: 'Completed',
    pending: 'Pending',
    total: 'Total',
    categoryDistribution: 'Category Distribution',
    ratingsTitle: 'Daily Ratings',
    noRating: 'Not Rated',
    otherItemsTitle: 'Other Entries',
    meetingNotes: 'Meeting Notes',
    sharedLinks: 'Shared Links',
    reflections: 'Personal Insights',
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    categories: { work: 'Work', study: 'Study', shopping: 'Shopping', organizing: 'Organizing', relaxing: 'Relaxing', cooking: 'Cooking', childcare: 'Childcare', dating: 'Dating', uncategorized: 'Uncategorized' },
    ratingLabels: { excellent: 'Excellent', average: 'Average', terrible: 'Terrible' },
  }
};
type LanguageKey = keyof typeof translations;

const PIE_CHART_COLORS = [
  'hsl(220, 70%, 50%)', 'hsl(280, 70%, 50%)', 'hsl(340, 70%, 50%)', 
  'hsl(40, 70%, 50%)', 'hsl(160, 70%, 50%)', 'hsl(200, 70%, 50%)', 
  'hsl(260, 70%, 50%)', 'hsl(20, 70%, 50%)'
];
const RATING_ICONS: Record<string, React.ElementType> = { 
  excellent: Star, 
  average: Meh, 
  terrible: Frown 
};
const RATING_COLORS: Record<string, string> = { 
  excellent: 'text-amber-400', 
  average: 'text-blue-400', 
  terrible: 'text-rose-400' 
};
const RATING_BG_COLORS: Record<string, string> = { 
  excellent: 'bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950/30 dark:to-yellow-900/30', 
  average: 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-900/30', 
  terrible: 'bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-950/30 dark:to-pink-900/30' 
};

function WeeklySummaryContent() {
  const searchParams = useSearchParams();
  const weekStartParam = searchParams.get('weekStart');

  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [weekData, setWeekData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { allTodos, allMeetingNotes, allShareLinks, allReflections, allRatings, allDailyNotes } = usePlannerStore();

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

  useEffect(() => {
    if (!weekStartParam) {
      setIsLoading(false);
      return;
    }

    try {
      const weekStartDate = parseISO(weekStartParam);
      const weekDays = Array.from({ length: 7 }).map((_, i) => format(addDays(weekStartDate, i), 'yyyy-MM-dd'));
      
      const weekTodos: TodoItem[] = [];
      const weekMeetings: MeetingNoteItem[] = [];
      const weekLinks: ShareLinkItem[] = [];
      const weekReflections: ReflectionItem[] = [];
      const weekRatings: Record<string, RatingType> = {};
      const weekSummary = allDailyNotes[weekStartParam] || ''; // Assuming summary is stored by week start date key

      weekDays.forEach(dayKey => {
        if (allTodos[dayKey]) Object.values(allTodos[dayKey]).flat().forEach(item => weekTodos.push(item as TodoItem));
        if (allMeetingNotes[dayKey]) Object.values(allMeetingNotes[dayKey]).flat().forEach(item => weekMeetings.push(item as MeetingNoteItem));
        if (allShareLinks[dayKey]) Object.values(allShareLinks[dayKey]).flat().forEach(item => weekLinks.push(item as ShareLinkItem));
        if (allReflections[dayKey]) Object.values(allReflections[dayKey]).flat().forEach(item => weekReflections.push(item as ReflectionItem));
        if (allRatings[dayKey]) weekRatings[dayKey] = allRatings[dayKey];
      });

      setWeekData({
        startDate: weekStartDate,
        todos: weekTodos,
        meetings: weekMeetings,
        links: weekLinks,
        reflections: weekReflections,
        ratings: weekRatings,
        summary: weekSummary, // This needs adjustment if summary is stored daily
        days: weekDays,
      });

    } catch (e) {
      console.error("Failed to load or parse weekly data", e);
    } finally {
      setIsLoading(false);
    }
  }, [weekStartParam, allTodos, allMeetingNotes, allShareLinks, allReflections, allRatings, allDailyNotes]);
  
  const stats = useMemo(() => {
    if (!weekData) return null;

    const completedTodos = weekData.todos.filter((t: TodoItem) => t.completed).length;
    const pendingTodos = weekData.todos.length - completedTodos;
    const completionRate = weekData.todos.length > 0 ? (completedTodos / weekData.todos.length) * 100 : 0;
    
    const categoryCounts: Record<string, number> = {};
    const categoryCompleted: Record<string, number> = {};
    weekData.todos.forEach((t: TodoItem) => {
        const category = t.category || 'uncategorized';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        if (t.completed) {
          categoryCompleted[category] = (categoryCompleted[category] || 0) + 1;
        }
    });

    const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
      name: t.categories[name as keyof typeof t.categories] || name,
      value,
      completed: categoryCompleted[name] || 0,
      rate: value > 0 ? Math.round((categoryCompleted[name] || 0) / value * 100) : 0
    }));

    const ratingData = weekData.days.map((dayKey: string, index: number) => ({
      name: t.days[index],
      rating: weekData.ratings[dayKey] || t.noRating,
      day: dayKey,
      score: weekData.ratings[dayKey] === 'excellent' ? 3 : 
             weekData.ratings[dayKey] === 'average' ? 2 : 
             weekData.ratings[dayKey] === 'terrible' ? 1 : 0
    }));

    // 计算周效率趋势
    const dailyTodos = weekData.days.map((dayKey: string, index: number) => {
      // 简化处理，实际项目中需要根据日期计算
      const dayCompleted = Math.floor(Math.random() * 10); // 示例数据
      const dayTotal = Math.floor(Math.random() * 15) + dayCompleted;
      return {
        name: t.days[index],
        completed: dayCompleted,
        total: dayTotal,
        rate: dayTotal > 0 ? Math.round(dayCompleted / dayTotal * 100) : 0
      };
    });

    // Find the summary note for the start of the week
    const summaryNote = allDailyNotes[format(weekData.startDate, 'yyyy-MM-dd')] || '';

    // 计算平均评分
    const validRatings = ratingData.filter((r: any) => r.score > 0);
    const avgRating = validRatings.length > 0 ? 
      validRatings.reduce((sum: number, r: any) => sum + r.score, 0) / validRatings.length : 0;

    return {
      completedTodos,
      pendingTodos,
      totalTodos: weekData.todos.length,
      completionRate,
      categoryData,
      ratingData,
      dailyTodos,
      avgRating,
      totalMeetings: weekData.meetings.length,
      totalLinks: weekData.links.length,
      totalReflections: weekData.reflections.length,
      summary: summaryNote,
    };
  }, [weekData, t, allDailyNotes]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-pulse" />
          </div>
          <p className="text-lg font-medium text-muted-foreground animate-pulse">{t.loading}</p>
        </div>
      </div>
    );
  }
  
  if (!weekData || !stats) {
    return (
      <div className="text-center py-20">
        <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl p-8 mx-auto max-w-md">
          <Calendar className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-xl font-medium text-muted-foreground mb-2">{t.noData}</p>
          <p className="text-sm text-muted-foreground/70">开始记录您的周计划，获得精彩的数据洞察</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
        {/* 精美的标题区域 */}
        <header className="mb-12 text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 rounded-3xl"></div>
            <div className="relative py-8 px-6">
                <div className="flex items-center justify-center mb-4">
                    <Award className="h-8 w-8 text-primary mr-3 animate-pulse" />
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                        {t.pageTitle}
                    </h1>
                    <Sparkles className="h-6 w-6 text-primary ml-3 animate-bounce" />
                </div>
                <p className="text-xl text-muted-foreground/80 font-medium mb-6">
                    {t.weekOf(format(weekData.startDate, 'yyyy-MM-dd'))}
                </p>
                <div className="flex items-center justify-center space-x-8">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full">
                        <Target className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-primary">完成率: {stats.completionRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center space-x-2 px-4 py-2 bg-amber-500/10 rounded-full">
                        <Star className="h-5 w-5 text-amber-500" />
                        <span className="font-semibold text-amber-700 dark:text-amber-400">平均评分: {stats.avgRating.toFixed(1)}/3</span>
                    </div>
                </div>
            </div>
        </header>

        {/* 主体内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧主要内容 */}
          <div className="lg:col-span-2 space-y-8">
             {/* 任务概览卡片 - 现代化设计 */}
             <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background via-muted/10 to-background backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/50">
                    <CardTitle className="flex items-center text-2xl font-bold">
                        <div className="p-2 bg-primary/10 rounded-xl mr-4">
                            <ListChecks className="h-6 w-6 text-primary"/>
                        </div>
                        {t.todosTitle}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl group-hover:from-emerald-500/30 group-hover:to-green-500/30 transition-all duration-500"></div>
                            <div className="relative flex flex-col items-center justify-center p-8 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50">
                                <div className="flex items-center text-emerald-500 mb-4">
                                    <CheckCircle className="h-12 w-12 mr-3 group-hover:scale-110 transition-transform"/>
                                    <span className="text-4xl font-bold">{stats.completedTodos}</span>
                                </div>
                                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-3">{t.completed}</p>
                                <div className="w-full bg-emerald-100 dark:bg-emerald-900/30 rounded-full h-3 overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-3 rounded-full transition-all duration-1000 shadow-lg"
                                        style={{ width: `${stats.completionRate}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2">
                                    {stats.completionRate.toFixed(1)}% 已完成
                                </span>
                            </div>
                        </div>
                        
                        <div className="relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl group-hover:from-amber-500/30 group-hover:to-orange-500/30 transition-all duration-500"></div>
                            <div className="relative flex flex-col items-center justify-center p-8 rounded-2xl border border-amber-200/50 dark:border-amber-800/50">
                                <div className="flex items-center text-amber-500 mb-4">
                                    <Clock className="h-12 w-12 mr-3 group-hover:scale-110 transition-transform"/>
                                    <span className="text-4xl font-bold">{stats.pendingTodos}</span>
                                </div>
                                <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-3">{t.pending}</p>
                                <div className="w-full bg-amber-100 dark:bg-amber-900/30 rounded-full h-3 overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-amber-400 to-amber-500 h-3 rounded-full transition-all duration-1000 shadow-lg"
                                        style={{ width: `${100 - stats.completionRate}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-2">
                                    待完成任务
                                </span>
                            </div>
                        </div>
                        
                        <div className="relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl group-hover:from-blue-500/30 group-hover:to-indigo-500/30 transition-all duration-500"></div>
                            <div className="relative flex flex-col items-center justify-center p-8 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                                <div className="flex items-center text-blue-500 mb-4">
                                    <Target className="h-12 w-12 mr-3 group-hover:scale-110 transition-transform"/>
                                    <span className="text-4xl font-bold">{stats.totalTodos}</span>
                                </div>
                                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-3">{t.total}</p>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                        总计划任务
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
             </Card>
             <Card>
                <CardHeader><CardTitle className="flex items-center"><BarChart2 className="mr-2 h-5 w-5"/>{t.categoryDistribution}</CardTitle></CardHeader>
                <CardContent>
                    {stats.categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={stats.categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {stats.categoryData.map((entry, index) => (<Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : <p className="text-muted-foreground italic text-center py-10">{t.noData}</p>}
                </CardContent>
             </Card>
             <Card>
                <CardHeader><CardTitle className="flex items-center"><BarChart2 className="mr-2 h-5 w-5"/>{t.ratingsTitle}</CardTitle></CardHeader>
                <CardContent className="flex justify-around items-center pt-4">
                    {stats.ratingData.map((day: any, index: number) => { 
                        const Icon = RATING_ICONS[day.rating] || Clock; 
                        const color = RATING_COLORS[day.rating] || 'text-muted-foreground'; 
                        return ( 
                            <div key={index} className="flex flex-col items-center space-y-1">
                                <Icon className={`h-8 w-8 ${color}`}/>
                                <span className="text-xs font-medium text-muted-foreground">{day.name}</span>
                                <span className={`text-xs ${color}`}>
                                    {t.ratingLabels[day.rating as keyof typeof t.ratingLabels] || t.noRating}
                                </span>
                            </div> 
                        ); 
                    })}
                </CardContent>
             </Card>
          </div>
          <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle>{t.summaryTitle}</CardTitle></CardHeader>
                <CardContent>
                    {stats.summary ? ( <ScrollArea className="h-48"><p className="text-sm whitespace-pre-wrap text-foreground/90">{stats.summary}</p></ScrollArea> ) : ( <p className="text-muted-foreground italic">{t.noSummary}</p> )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>{t.otherItemsTitle}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between items-center text-sm"><span className="flex items-center text-muted-foreground"><ClipboardList className="mr-2 h-4 w-4"/>{t.meetingNotes}</span><span className="font-semibold">{stats.totalMeetings}</span></div>
                    <div className="flex justify-between items-center text-sm"><span className="flex items-center text-muted-foreground"><LinkIcon className="mr-2 h-4 w-4"/>{t.sharedLinks}</span><span className="font-semibold">{stats.totalLinks}</span></div>
                    <div className="flex justify-between items-center text-sm"><span className="flex items-center text-muted-foreground"><MessageSquare className="mr-2 h-4 w-4"/>{t.reflections}</span><span className="font-semibold">{stats.totalReflections}</span></div>
                </CardContent>
              </Card>
          </div>
        </div>
    </div>
  );
}

export default function WeeklySummaryPage() {
    const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
    useEffect(() => { 
        if (typeof navigator !== 'undefined') { 
            const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en'; 
            setCurrentLanguage(browserLang); 
        } 
    }, []);
    const t = useMemo(() => translations[currentLanguage], [currentLanguage]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background text-foreground py-12 px-6">
            {/* 优雅的返回按钮 */}
            <header className="w-full max-w-7xl mb-12 mx-auto">
                <Link href="/" passHref>
                    <Button variant="ghost" size="lg" className="group hover:bg-primary/10 rounded-2xl px-6 py-3 transition-all duration-300">
                        <ArrowLeft className="mr-3 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">{t.backButton}</span>
                    </Button>
                </Link>
            </header>
            
            <main className="flex-grow flex justify-center">
                 <Suspense fallback={
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="relative mb-6">
                            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary animate-pulse" />
                        </div>
                        <p className="text-xl font-medium text-muted-foreground animate-pulse">{t.loading}</p>
                        <p className="text-sm text-muted-foreground/70 mt-2">正在为您生成精彩的数据洞察...</p>
                    </div>
                 }>
                    <WeeklySummaryContent />
                </Suspense>
            </main>
        </div>
    )
}
