
export type LanguageKey = 'zh-CN' | 'en';
export type Theme = 'light' | 'dark';

// Copied from page.tsx
export type CategoryType = 'work' | 'study' | 'shopping' | 'organizing' | 'relaxing' | 'cooking' | 'childcare' | 'dating';
export interface TodoItem {
  id: string; text: string; completed: boolean; category: CategoryType | null;
  deadline: 'hour' | 'today' | 'tomorrow' | 'thisWeek' | 'nextWeek' | 'nextMonth' | null;
  importance: 'important' | 'notImportant' | null;
}
export interface MeetingNoteItem { id: string; title: string; notes: string; attendees: string; actionItems: string; }
export interface ShareLinkItem { id: string; url: string; title: string; category: string | null; }
export interface ReflectionItem { 
  id: string; 
  text: string; 
  category?: string; // 改为字符串，支持自定义标签
  timestamp?: string;
}
export interface DraftItem {
  id: string;
  content: string;
  timestamp?: string;
}

export type RatingType = 'excellent' | 'terrible' | 'average' | null;

export interface AllLoadedData {
  ratings: Record<string, RatingType>;
  allDailyNotes: Record<string, string>;
  allTodos: Record<string, Record<string, TodoItem[]>>;
  allMeetingNotes: Record<string, Record<string, MeetingNoteItem[]>>;
  allShareLinks: Record<string, Record<string, ShareLinkItem[]>>;
  allReflections: Record<string, Record<string, ReflectionItem[]>>;
  allDrafts: Record<string, Record<string, DraftItem[]>>;
}

export interface ReceivedShareData {
  title: string;
  text: string;
  url: string;
}

export interface HoverPreviewData {
  dayName: string;
  notes: string;
  imageHint: string;
  altText: string;
}
