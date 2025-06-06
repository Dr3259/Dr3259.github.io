
// src/app/day/[dayName]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import type { ParsedUrlQuery } from 'querystring';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft, ListChecks, ClipboardList, Link2 as LinkIconLucide, MessageSquareText,
    Briefcase, BookOpen, ShoppingCart, Archive, Coffee, ChefHat, Baby, CalendarClock,
    Hourglass, CalendarCheck, Sunrise, CalendarRange, ArrowRightToLine, CalendarPlus,
    Star as StarIcon, FileEdit, Trash2
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TodoModal, type TodoItem, type CategoryType } from '@/components/TodoModal';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

// Helper function to extract time range and generate hourly slots
const generateHourlySlots = (intervalLabelWithTime: string): string[] => {
  const match = intervalLabelWithTime.match(/\((\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})\)/);
  if (!match) {
    console.warn(`Could not parse time from: ${intervalLabelWithTime}`);
    return [];
  }

  const startTimeStr = match[1];
  const endTimeStr = match[2];

  const startHour = parseInt(startTimeStr.split(':')[0]);
  let endHour = parseInt(endTimeStr.split(':')[0]);

  if (endTimeStr === "00:00" && startHour !== 0 && endHour === 0) {
      endHour = 24;
  }

  const slots: string[] = [];
  if (startHour > endHour && !(endHour === 0 && startHour > 0) ) {
     if (!(startHour < 24 && endHour === 0)) {
        console.warn(`Start hour ${startHour} is not before end hour ${endHour} for ${intervalLabelWithTime}`);
        return [];
     }
  }

  for (let h = startHour; h < endHour; h++) {
    const currentSlotStart = `${String(h).padStart(2, '0')}:00`;
    const nextHour = h + 1;
    const currentSlotEnd = `${String(nextHour).padStart(2, '0')}:00`;
    slots.push(`${currentSlotStart} - ${currentSlotEnd}`);
  }
  return slots;
};


const translations = {
  'zh-CN': {
    dayDetailsTitle: (dayName: string) => `${dayName} - 详情`,
    backToWeek: '返回周视图',
    notesLabel: '笔记:',
    ratingLabel: '评价:',
    noData: '暂无数据',
    timeIntervalsTitle: '每日安排',
    midnight: '凌晨 (00:00 - 05:00)',
    earlyMorning: '清晨 (05:00 - 09:00)',
    morning: '上午 (09:00 - 12:00)',
    noon: '中午 (12:00 - 14:00)',
    afternoon: '下午 (14:00 - 18:00)',
    evening: '晚上 (18:00 - 24:00)',
    activitiesPlaceholder: (intervalName: string) => `记录${intervalName.split(' ')[0]}的活动...`,
    addTodo: '添加待办事项',
    addMeetingNote: '添加会议记录',
    addLink: '添加分享链接',
    addReflection: '添加个人感悟',
    noItemsForHour: '此时间段暂无记录事项。',
    editItem: '编辑事项',
    deleteItem: '删除事项',
    markComplete: '标记为已完成',
    markIncomplete: '标记为未完成',
    todoModal: {
        modalTitle: (hourSlot: string) => `${hourSlot} - 待办事项`,
        modalDescription: '在此处添加、编辑或删除您的待办事项。',
        addItemPlaceholder: '输入新的待办事项...',
        categoryInputPlaceholder: '例如：处理邮件，购买牛奶 (可选)',
        addButton: '添加',
        updateButton: '更新',
        saveButton: '保存',
        noTodos: '还没有待办事项。',
        markComplete: '标记为已完成',
        markIncomplete: '标记为未完成',
        editTodo: '编辑待办事项',
        deleteTodo: '删除待办事项',
        categoryLabel: '性质:',
        deadlineLabel: '完成时间:',
        importanceLabel: '重要性:',
        selectPlaceholder: '请选择...',
        categories: {
            work: '工作',
            study: '学习',
            shopping: '购物',
            organizing: '整理',
            relaxing: '放松',
            cooking: '做饭',
            childcare: '带娃',
            dating: '约会',
        } as Record<CategoryType, string>,
        deadlines: {
            hour: '一小时内',
            today: '今天',
            tomorrow: '明天',
            thisWeek: '这周内',
            nextWeek: '下周内',
            nextMonth: '下月内',
        },
        importances: {
            important: '重要',
            notImportant: '不重要',
        }
    }
  },
  'en': {
    dayDetailsTitle: (dayName: string) => `${dayName} - Details`,
    backToWeek: 'Back to Week View',
    notesLabel: 'Notes:',
    ratingLabel: 'Rating:',
    noData: 'No data available',
    timeIntervalsTitle: 'Daily Schedule',
    midnight: 'Midnight (00:00 - 05:00)',
    earlyMorning: 'Early Morning (05:00 - 09:00)',
    morning: 'Morning (09:00 - 12:00)',
    noon: 'Noon (12:00 - 14:00)',
    afternoon: 'Afternoon (14:00 - 18:00)',
    evening: 'Evening (18:00 - 24:00)',
    activitiesPlaceholder: (intervalName: string) => `Log activities for ${intervalName.split(' (')[0]}...`,
    addTodo: 'Add To-do',
    addMeetingNote: 'Add Meeting Note',
    addLink: 'Add Link',
    addReflection: 'Add Reflection',
    noItemsForHour: 'No items recorded for this hour.',
    editItem: 'Edit item',
    deleteItem: 'Delete item',
    markComplete: 'Mark as complete',
    markIncomplete: 'Mark as incomplete',
    todoModal: {
        modalTitle: (hourSlot: string) => `${hourSlot} - To-do List`,
        modalDescription: 'Add, edit, or delete your to-do items here.',
        addItemPlaceholder: 'Enter a new to-do item...',
        categoryInputPlaceholder: 'E.g., Process emails, Buy milk (optional)',
        addButton: 'Add',
        updateButton: 'Update',
        saveButton: 'Save',
        noTodos: 'No to-do items yet.',
        markComplete: 'Mark as complete',
        markIncomplete: 'Mark as incomplete',
        editTodo: 'Edit to-do item',
        deleteTodo: 'Delete to-do item',
        categoryLabel: 'Category:',
        deadlineLabel: 'Deadline:',
        importanceLabel: 'Importance:',
        selectPlaceholder: 'Select...',
        categories: {
            work: 'Work',
            study: 'Study',
            shopping: 'Shopping',
            organizing: 'Organizing',
            relaxing: 'Relaxing',
            cooking: 'Cooking',
            childcare: 'Childcare',
            dating: 'Dating/Appointment',
        } as Record<CategoryType, string>,
        deadlines: {
            hour: 'Within the hour',
            today: 'Today',
            tomorrow: 'Tomorrow',
            thisWeek: 'This Week',
            nextWeek: 'Next Week',
            nextMonth: 'Next Month',
        },
        importances: {
            important: 'Important',
            notImportant: 'Not Important',
        }
    }
  }
};

type LanguageKey = keyof typeof translations;

interface SlotDetails {
  dayName: string;
  hourSlot: string;
}

const CategoryIcons: Record<CategoryType, React.ElementType> = {
  work: Briefcase,
  study: BookOpen,
  shopping: ShoppingCart,
  organizing: Archive,
  relaxing: Coffee,
  cooking: ChefHat,
  childcare: Baby,
  dating: CalendarClock,
};

const DeadlineIcons: Record<NonNullable<TodoItem['deadline']>, React.ElementType> = {
  hour: Hourglass,
  today: CalendarCheck,
  tomorrow: Sunrise,
  thisWeek: CalendarRange,
  nextWeek: ArrowRightToLine,
  nextMonth: CalendarPlus,
};


export default function DayDetailPage() {
  const params = useParams();
  const dayName = typeof params.dayName === 'string' ? decodeURIComponent(params.dayName) : "无效日期";

  const [currentLanguage, setCurrentLanguage] = useState<LanguageKey>('en');
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [selectedSlotForTodo, setSelectedSlotForTodo] = useState<SlotDetails | null>(null);
  const [allTodos, setAllTodos] = useState<Record<string, Record<string, TodoItem[]>>>({});
  const [editingTodoItem, setEditingTodoItem] = useState<TodoItem | null>(null);
  const [editingTodoSlotDetails, setEditingTodoSlotDetails] = useState<SlotDetails | null>(null);


  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const browserLang: LanguageKey = navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
      setCurrentLanguage(browserLang);
    }
    // In a real app, you would load 'allTodos' from localStorage or a backend here
    const storedTodos = localStorage.getItem('allWeekTodos');
    if (storedTodos) {
        try {
            setAllTodos(JSON.parse(storedTodos));
        } catch (e) {
            console.error("Failed to parse todos from localStorage", e);
        }
    }
  }, []);

  const saveAllTodosToLocalStorage = (updatedTodos: Record<string, Record<string, TodoItem[]>>) => {
    try {
        localStorage.setItem('allWeekTodos', JSON.stringify(updatedTodos));
    } catch (e) {
        console.error("Failed to save todos to localStorage", e);
    }
  };

  const t = translations[currentLanguage];
  const tTodoModal = translations[currentLanguage].todoModal;

  const notes = "";
  const rating = "";

  const timeIntervals = [
    { key: 'midnight', label: t.midnight },
    { key: 'earlyMorning', label: t.earlyMorning },
    { key: 'morning', label: t.morning },
    { key: 'noon', label: t.noon },
    { key: 'afternoon', label: t.afternoon },
    { key: 'evening', label: t.evening }
  ];

  const handleOpenTodoModal = (hourSlot: string) => {
    setSelectedSlotForTodo({ dayName, hourSlot });
    setEditingTodoItem(null); // Ensure we are not in "specific item edit" mode
    setEditingTodoSlotDetails(null);
    setIsTodoModalOpen(true);
  };

  const handleCloseTodoModal = () => {
    setIsTodoModalOpen(false);
    setSelectedSlotForTodo(null);
    setEditingTodoItem(null);
    setEditingTodoSlotDetails(null);
  };

  const handleSaveTodosFromModal = (day: string, hourSlot: string, updatedTodosInSlot: TodoItem[]) => {
    setAllTodos(prevAllTodos => {
      const newAllTodos = {
        ...prevAllTodos,
        [day]: {
          ...(prevAllTodos[day] || {}),
          [hourSlot]: updatedTodosInSlot,
        },
      };
      saveAllTodosToLocalStorage(newAllTodos);
      return newAllTodos;
    });
  };
  
  const handleToggleTodoCompletionInPage = (targetDay: string, targetHourSlot: string, todoId: string) => {
    setAllTodos(prevAllTodos => {
      const daySlots = prevAllTodos[targetDay] || {};
      const slotTodos = daySlots[targetHourSlot] || [];
      const updatedSlotTodos = slotTodos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      );
      const newAllTodos = {
        ...prevAllTodos,
        [targetDay]: {
          ...daySlots,
          [targetHourSlot]: updatedSlotTodos,
        },
      };
      saveAllTodosToLocalStorage(newAllTodos);
      return newAllTodos;
    });
  };

  const handleDeleteTodoInPage = (targetDay: string, targetHourSlot: string, todoId: string) => {
    setAllTodos(prevAllTodos => {
      const daySlots = prevAllTodos[targetDay] || {};
      const slotTodos = daySlots[targetHourSlot] || [];
      const updatedSlotTodos = slotTodos.filter(todo => todo.id !== todoId);
      const newAllTodos = {
        ...prevAllTodos,
        [targetDay]: {
          ...daySlots,
          [targetHourSlot]: updatedSlotTodos,
        },
      };
      saveAllTodosToLocalStorage(newAllTodos);
      return newAllTodos;
    });
  };

  const handleOpenEditModalInPage = (targetDay: string, targetHourSlot: string, todoToEdit: TodoItem) => {
    setEditingTodoItem(todoToEdit);
    setEditingTodoSlotDetails({ dayName: targetDay, hourSlot: targetHourSlot });
    setSelectedSlotForTodo({ dayName: targetDay, hourSlot: targetHourSlot }); // Modal needs this context
    setIsTodoModalOpen(true);
  };

  const getTodosForSlot = (targetDayName: string, targetHourSlot: string): TodoItem[] => {
    return allTodos[targetDayName]?.[targetHourSlot] || [];
  };

  const getCategoryTooltipText = (category: CategoryType | null) => {
    if (!category || !tTodoModal.categories[category]) return '';
    return `${tTodoModal.categoryLabel} ${tTodoModal.categories[category]}`;
  };

  const getDeadlineTooltipText = (deadline: TodoItem['deadline']) => {
    if (!deadline || !tTodoModal.deadlines[deadline as keyof typeof tTodoModal.deadlines]) return '';
    return `${tTodoModal.deadlineLabel} ${tTodoModal.deadlines[deadline as keyof typeof tTodoModal.deadlines]}`;
  };

  const getImportanceTooltipText = (importance: TodoItem['importance']) => {
    if (importance === 'important') return `${tTodoModal.importanceLabel} ${tTodoModal.importances.important}`;
    return '';
  };


  return (
    <TooltipProvider>
      <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4 sm:p-8">
        <header className="w-full max-w-4xl mb-8">
          <Link href="/" passHref>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.backToWeek}
            </Button>
          </Link>
        </header>

        <main className="w-full max-w-4xl">
          <h1 className="text-3xl font-headline font-semibold text-primary mb-6">
            {t.dayDetailsTitle(dayName)}
          </h1>

          <div className="bg-card p-6 rounded-lg shadow-lg mb-8">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-medium text-foreground mb-2">{t.notesLabel}</h2>
                <div className="p-3 border rounded-md min-h-[100px] bg-background/50">
                  <p className="text-muted-foreground">{notes || t.noData}</p>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-medium text-foreground mb-2">{t.ratingLabel}</h2>
                <div className="p-3 border rounded-md bg-background/50">
                  <p className="text-muted-foreground">{rating || t.noData}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-primary mb-4">{t.timeIntervalsTitle}</h2>
            <div className="grid grid-cols-1 gap-6">
              {timeIntervals.map(interval => {
                const hourlySlots = generateHourlySlots(interval.label);
                const mainTitle = interval.label.split(' (')[0];
                const timeRangeSubtext = interval.label.includes('(') ? `(${interval.label.split(' (')[1]}` : '';

                return (
                  <div key={interval.key} className="bg-card p-4 rounded-lg shadow-lg">
                    <h3 className="text-lg font-medium text-foreground mb-1">{mainTitle}</h3>
                    {timeRangeSubtext && <p className="text-xs text-muted-foreground mb-2">{timeRangeSubtext}</p>}
                    <div className="h-1 w-full bg-primary/30 rounded-full mb-3"></div>

                    {hourlySlots.length > 0 ? (
                      <div className="space-y-3 mt-4">
                        {hourlySlots.map((slot, slotIndex) => {
                          const todosForSlot = getTodosForSlot(dayName, slot);
                          return (
                            <div key={slotIndex} className="p-3 border rounded-md bg-muted/20 shadow-sm">
                              <div className="flex justify-between items-center mb-2">
                                <p className="text-sm font-semibold text-foreground/90">{slot}</p>
                                <div className="flex space-x-1">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => handleOpenTodoModal(slot)}>
                                        <ListChecks className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{t.addTodo}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                                        <ClipboardList className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{t.addMeetingNote}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                                        <LinkIconLucide className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{t.addLink}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                                        <MessageSquareText className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{t.addReflection}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </div>
                              <div className="p-2 border rounded-md bg-background/50 group/todolist">
                                  {todosForSlot.length > 0 ? (
                                    <ul className="space-y-2">
                                      {todosForSlot.map((todo) => {
                                        const CategoryIcon = todo.category ? CategoryIcons[todo.category] : null;
                                        const DeadlineIcon = todo.deadline ? DeadlineIcons[todo.deadline] : null;
                                        return (
                                          <li key={todo.id} className="flex items-center justify-between group/todoitem hover:bg-muted/30 p-1.5 rounded-md transition-colors">
                                            <div className="flex items-center space-x-2 flex-grow min-w-0">
                                              <Checkbox
                                                id={`daypage-todo-${dayName}-${slot}-${todo.id}`}
                                                checked={todo.completed}
                                                onCheckedChange={() => handleToggleTodoCompletionInPage(dayName, slot, todo.id)}
                                                aria-label={todo.completed ? t.markIncomplete : t.markComplete}
                                                className="border-primary/50 shrink-0"
                                              />
                                              <div className="flex items-center space-x-1 shrink-0">
                                                {CategoryIcon && todo.category && (
                                                  <Tooltip>
                                                    <TooltipTrigger asChild><CategoryIcon className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                                                    <TooltipContent><p>{getCategoryTooltipText(todo.category)}</p></TooltipContent>
                                                  </Tooltip>
                                                )}
                                                {DeadlineIcon && todo.deadline && (
                                                  <Tooltip>
                                                    <TooltipTrigger asChild><DeadlineIcon className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger>
                                                    <TooltipContent><p>{getDeadlineTooltipText(todo.deadline)}</p></TooltipContent>
                                                  </Tooltip>
                                                )}
                                                {todo.importance === 'important' && (
                                                  <Tooltip>
                                                    <TooltipTrigger asChild><StarIcon className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /></TooltipTrigger>
                                                    <TooltipContent><p>{getImportanceTooltipText(todo.importance)}</p></TooltipContent>
                                                  </Tooltip>
                                                )}
                                              </div>
                                              <label
                                                htmlFor={`daypage-todo-${dayName}-${slot}-${todo.id}`}
                                                className={cn(
                                                  "text-xs cursor-pointer flex-1 min-w-0",
                                                  todo.completed ? 'line-through text-muted-foreground/80' : 'text-foreground/90'
                                                )}
                                                title={todo.text}
                                              >
                                                {todo.text.length > 25 ? todo.text.substring(0, 25) + '...' : todo.text}
                                              </label>
                                            </div>
                                            <div className="flex items-center space-x-0.5 ml-1 shrink-0 opacity-0 group-hover/todoitem:opacity-100 transition-opacity">
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => handleOpenEditModalInPage(dayName, slot, todo)}>
                                                    <FileEdit className="h-3.5 w-3.5" />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent><p>{t.editItem}</p></TooltipContent>
                                              </Tooltip>
                                              <Tooltip>
                                                <TooltipTrigger asChild>
                                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteTodoInPage(dayName, slot, todo.id)}>
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                  </Button>
                                                </TooltipTrigger>
                                                <TooltipContent><p>{t.deleteItem}</p></TooltipContent>
                                              </Tooltip>
                                            </div>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  ) : (
                                    <p className="text-xs text-muted-foreground italic">
                                      {t.noItemsForHour}
                                    </p>
                                  )}
                                </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-3 border rounded-md bg-background/50 mt-4">
                        <p className="text-sm text-muted-foreground italic">{t.activitiesPlaceholder(interval.label)}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
      {isTodoModalOpen && selectedSlotForTodo && (
        <TodoModal
          isOpen={isTodoModalOpen}
          onClose={handleCloseTodoModal}
          onSaveTodos={handleSaveTodosFromModal}
          dayName={selectedSlotForTodo.dayName}
          hourSlot={selectedSlotForTodo.hourSlot}
          initialTodos={getTodosForSlot(selectedSlotForTodo.dayName, selectedSlotForTodo.hourSlot)}
          translations={tTodoModal}
          defaultEditingTodoId={editingTodoItem && editingTodoSlotDetails?.dayName === selectedSlotForTodo.dayName && editingTodoSlotDetails?.hourSlot === selectedSlotForTodo.hourSlot ? editingTodoItem.id : undefined}
        />
      )}
    </TooltipProvider>
  );
}

