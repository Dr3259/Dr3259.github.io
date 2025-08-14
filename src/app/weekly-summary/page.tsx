
"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, XCircle, Smile, Meh, Frown, ListChecks, Link as LinkIcon, MessageSquare, ClipboardList, BarChart2 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from 'recharts';
import { format, addDays, parseISO } from 'date-fns';
import { enUS, zhCN } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';

// Data types (should match what's used in other pages)
type CategoryType = 'work' | 'study' | 'shopping' | 'organizing' | 'relaxing' | 'cooking' | 'childcare' | 'dating';
interface TodoItem {
  id: string; text: string; completed: boolean; category: CategoryType | null;
  deadline: 'hour' | 'today' | 'tomorrow' | 'thisWeek' | 'nextWeek' | 'nextMonth' | null;
  importance: 'important' | 'notImportant' | null;
}
interface MeetingNoteItem { id: string; title: string; notes: string; attendees: string; actionItems: string; }
interface ShareLinkItem { id: string; url: string; title: string; }
interface ReflectionItem { id: string; text: string; }
type RatingType = 'excellent' | 'terrible' | 'average' | null;

// Local storage keys
const LOCAL_STORAGE_KEY_ALL_TODOS = 'allWeekTodos_v2';
const LOCAL_STORAGE_KEY_ALL_MEETING_NOTES = 'allWeekMeetingNotes_v2';
const LOCAL_STORAGE_KEY_ALL_SHARE_LINKS = 'allWeekShareLinks_v2';
const LOCAL_STORAGE_KEY_ALL_REFLECTIONS = 'allWeekReflections_v2';
const LOCAL_STORAGE_KEY_RATINGS = 'weekGlanceRatings_v2';
const LOCAL_STORAGE_KEY_SUMMARY = 'weekGlanceSummary_v2';

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

const PIE_CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#d0ed57'];
const RATING_ICONS: Record<string, React.ElementType> = { excellent: Smile, average: Meh, terrible: Frown };
const RATING_COLORS: Record<string, string> = { excellent: 'text-green-500', average: 'text-yellow-500', terrible: 'text-red-500' };

function WeeklySummaryContent() {
  const searchParams = useSearchParams();
  const weekStartParam = searchParams.get('weekStart');

  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [weekData, setWeekData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
  }, []);

  const t = useMemo(() => translations[currentLanguage], [currentLanguage]);
  const dateLocale = useMemo(() => (currentLanguage === 'zh-CN' ? zhCN : enUS), [currentLanguage]);

  useEffect(() => {
    if (!weekStartParam) {
      setIsLoading(false);
      return;
    }

    try {
      const weekStartDate = parseISO(weekStartParam);
      const weekDays = Array.from({ length: 7 }).map((_, i) => format(addDays(weekStartDate, i), 'yyyy-MM-dd'));
      
      const allTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_TODOS) || '{}');
      const allMeetings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_MEETING_NOTES) || '{}');
      const allLinks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_SHARE_LINKS) || '{}');
      const allReflections = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_ALL_REFLECTIONS) || '{}');
      const allRatings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_RATINGS) || '{}');
      const weeklySummary = localStorage.getItem(LOCAL_STORAGE_KEY_SUMMARY) || '';

      const weekTodos: TodoItem[] = [];
      const weekMeetings: MeetingNoteItem[] = [];
      const weekLinks: ShareLinkItem[] = [];
      const weekReflections: ReflectionItem[] = [];
      const weekRatings: Record<string, RatingType> = {};

      weekDays.forEach(dayKey => {
        if (allTodos[dayKey]) Object.values(allTodos[dayKey]).flat().forEach(item => weekTodos.push(item as TodoItem));
        if (allMeetings[dayKey]) Object.values(allMeetings[dayKey]).flat().forEach(item => weekMeetings.push(item as MeetingNoteItem));
        if (allLinks[dayKey]) Object.values(allLinks[dayKey]).flat().forEach(item => weekLinks.push(item as ShareLinkItem));
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
        summary: weeklySummary,
        days: weekDays,
      });

    } catch (e) {
      console.error("Failed to load or parse weekly data", e);
    } finally {
      setIsLoading(false);
    }
  }, [weekStartParam]);
  
  const stats = useMemo(() => {
    if (!weekData) return null;

    const completedTodos = weekData.todos.filter((t: TodoItem) => t.completed).length;
    const pendingTodos = weekData.todos.length - completedTodos;
    
    const categoryCounts: Record<string, number> = {};
    weekData.todos.forEach((t: TodoItem) => {
        const category = t.category || 'uncategorized';
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

    const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({
      name: t.categories[name as keyof typeof t.categories] || name,
      value
    }));

    const ratingData = weekData.days.map((dayKey: string, index: number) => ({
      name: t.days[index],
      rating: weekData.ratings[dayKey] || t.noRating,
    }));

    return {
      completedTodos,
      pendingTodos,
      totalTodos: weekData.todos.length,
      categoryData,
      ratingData,
      totalMeetings: weekData.meetings.length,
      totalLinks: weekData.links.length,
      totalReflections: weekData.reflections.length,
    };
  }, [weekData, t]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>{t.loading}</p>
      </div>
    );
  }

  if (!weekData || !stats) {
    return (
       <div className="text-center">
        <p className="text-lg text-muted-foreground">{t.noData}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
        <header className="mb-8">
            <h1 className="text-3xl font-headline font-bold text-primary mb-2">{t.pageTitle}</h1>
            <p className="text-muted-foreground">{t.weekOf(format(weekData.startDate, 'yyyy-MM-dd'))}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><ListChecks className="mr-2 h-5 w-5"/>{t.todosTitle}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center text-green-500 mb-2">
                           <CheckCircle className="h-8 w-8 mr-2"/>
                           <span className="text-3xl font-bold">{stats.completedTodos}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{t.completed}</p>
                    </div>
                     <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center text-yellow-500 mb-2">
                           <XCircle className="h-8 w-8 mr-2"/>
                           <span className="text-3xl font-bold">{stats.pendingTodos}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{t.pending}</p>
                    </div>
                </CardContent>
             </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><BarChart2 className="mr-2 h-5 w-5"/>{t.categoryDistribution}</CardTitle>
                </CardHeader>
                <CardContent>
                    {stats.categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={stats.categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {stats.categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : <p className="text-muted-foreground italic text-center py-10">{t.noData}</p>}
                </CardContent>
             </Card>
             
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><BarChart2 className="mr-2 h-5 w-5"/>{t.ratingsTitle}</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-around items-center pt-4">
                    {stats.ratingData.map((day, index) => {
                       const Icon = RATING_ICONS[day.rating] || 'span';
                       const color = RATING_COLORS[day.rating] || 'text-muted-foreground';
                       return (
                           <div key={index} className="flex flex-col items-center space-y-1">
                               <Icon className={`h-8 w-8 ${color}`}/>
                               <span className="text-xs font-medium text-muted-foreground">{day.name}</span>
                               <span className={`text-xs ${color}`}>{t.ratingLabels[day.rating as keyof typeof t.ratingLabels] || t.noRating}</span>
                           </div>
                       );
                    })}
                </CardContent>
             </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
              <Card>
                <CardHeader>
                    <CardTitle>{t.summaryTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                    {weekData.summary ? (
                        <ScrollArea className="h-48">
                          <p className="text-sm whitespace-pre-wrap text-foreground/90">{weekData.summary}</p>
                        </ScrollArea>
                    ) : (
                        <p className="text-muted-foreground italic">{t.noSummary}</p>
                    )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                    <CardTitle>{t.otherItemsTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center text-muted-foreground"><ClipboardList className="mr-2 h-4 w-4"/>{t.meetingNotes}</span>
                        <span className="font-semibold">{stats.totalMeetings}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center text-muted-foreground"><LinkIcon className="mr-2 h-4 w-4"/>{t.sharedLinks}</span>
                        <span className="font-semibold">{stats.totalLinks}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center text-muted-foreground"><MessageSquare className="mr-2 h-4 w-4"/>{t.reflections}</span>
                        <span className="font-semibold">{stats.totalReflections}</span>
                    </div>
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
        <div className="flex flex-col min-h-screen bg-background text-foreground py-10 px-4 sm:px-8">
            <header className="w-full max-w-4xl mb-8 self-center">
                <Link href="/" passHref>
                <Button variant="outline" size="sm">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t.backButton}
                </Button>
                </Link>
            </header>
            <main className="flex-grow flex justify-center">
                 <Suspense fallback={<div className="text-center">{t.loading}</div>}>
                    <WeeklySummaryContent />
                </Suspense>
            </main>
        </div>
    )
}
