
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { getTagColor } from '@/lib/utils';
import {
    ListChecks, ClipboardList, Link2 as LinkIconLucide, MessageSquareText, FileEdit, Trash2,
    Star as StarIcon, ArrowRight
} from 'lucide-react';
import { CategoryIcons, DeadlineIcons } from '@/components/TodoModal';
import type { TodoItem, MeetingNoteItem, ShareLinkItem, ReflectionItem, CategoryType } from '@/lib/page-types';

interface ItemListsProps {
    dateKey: string;
    slot: string;
    isPastDay: boolean;
    isAddingDisabledForThisSlot: boolean;
    hasAnyContentForThisSlot: boolean;
    todos: TodoItem[];
    meetingNotes: MeetingNoteItem[];
    shareLinks: ShareLinkItem[];
    reflections: ReflectionItem[];
    translations: any;
    onToggleTodoCompletion: (dateKey: string, hourSlot: string, todoId: string) => void;
    onDeleteTodo: (dateKey: string, hourSlot: string, todoId: string) => void;
    onOpenTodoModal: (hourSlot: string) => void;
    onOpenEditTodoModal: (dateKey: string, hourSlot: string, todo: TodoItem) => void;
    onMoveTodoModal: (dateKey: string, hourSlot: string, todo: TodoItem) => void;
    onOpenMeetingNoteModal: (hourSlot: string, note?: MeetingNoteItem) => void;
    onDeleteMeetingNote: (dateKey: string, hourSlot: string, noteId: string) => void;
    onOpenShareLinkModal: (hourSlot: string, link?: ShareLinkItem) => void;
    onDeleteShareLink: (dateKey: string, hourSlot: string, linkId: string) => void;
    onOpenReflectionModal: (hourSlot: string, reflection?: ReflectionItem) => void;
    onDeleteReflection: (dateKey: string, hourSlot: string, reflectionId: string) => void;
}

export const ItemLists: React.FC<ItemListsProps> = ({
    dateKey, slot, isPastDay, isAddingDisabledForThisSlot, hasAnyContentForThisSlot,
    todos, meetingNotes, shareLinks, reflections, translations: t,
    onToggleTodoCompletion, onDeleteTodo, onOpenTodoModal, onOpenEditTodoModal, onMoveTodoModal, onOpenMeetingNoteModal,
    onDeleteMeetingNote, onOpenShareLinkModal, onDeleteShareLink, onOpenReflectionModal, onDeleteReflection
}) => {
    
    let sectionsRenderedInSlotCount = 0;

    const getCategoryTooltipText = (category: CategoryType | null) => {
        if (!category || !t.todoModal.categories[category]) return '';
        return `${t.todoModal.categoryLabel} ${t.todoModal.categories[category]}`;
    };
    const getDeadlineTooltipText = (deadline: TodoItem['deadline']) => {
        if (!deadline || !t.todoModal.deadlines[deadline as keyof typeof t.todoModal.deadlines]) return '';
        return `${t.todoModal.deadlineLabel} ${t.todoModal.deadlines[deadline as keyof typeof t.todoModal.deadlines]}`;
    };
    const getImportanceTooltipText = (importance: TodoItem['importance']) => {
        if (importance === 'important') return `${t.todoModal.importanceLabel} ${t.todoModal.importances.important}`;
        return '';
    };

    return (
        <div className="p-3 border rounded-md bg-muted/20 shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-baseline">
                    <p className="text-sm font-semibold text-foreground/90">{slot}</p>
                    {!hasAnyContentForThisSlot && (
                        <p className="text-xs text-muted-foreground italic ml-2">
                            {t.noItemsForHour}
                        </p>
                    )}
                </div>
                <div className="flex space-x-1">
                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => onOpenTodoModal(slot)} disabled={isAddingDisabledForThisSlot}><ListChecks className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>{t.addTodo}</p></TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => onOpenMeetingNoteModal(slot)} disabled={isAddingDisabledForThisSlot}><ClipboardList className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>{t.addMeetingNote}</p></TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => onOpenShareLinkModal(slot)} disabled={isAddingDisabledForThisSlot}><LinkIconLucide className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>{t.addLink}</p></TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => onOpenReflectionModal(slot)} disabled={isAddingDisabledForThisSlot}><MessageSquareText className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>{t.addReflection}</p></TooltipContent></Tooltip>
                </div>
            </div>

            {todos.length > 0 && (() => { sectionsRenderedInSlotCount++; return (
                <div className="mb-3">
                    <div className="flex items-center gap-1 mb-2">
                        <ListChecks className="h-3.5 w-3.5 text-purple-500" />
                        <span className="text-xs font-medium text-purple-600 dark:text-purple-400">待办事项</span>
                    </div>
                    <ul className="space-y-2 p-px group/todolist border-l-2 border-purple-200 pl-3">
                        {todos.map((todo) => {
                            const CategoryIcon = todo.category ? CategoryIcons[todo.category] : null;
                            const DeadlineIcon = todo.deadline ? DeadlineIcons[todo.deadline] : null;
                            return (
                                <li key={todo.id} className="flex items-center justify-between group/todoitem hover:bg-purple-50 dark:hover:bg-purple-950/20 p-1.5 rounded-md transition-colors">
                                    <div className="flex items-center space-x-2 flex-grow min-w-0">
                                        <Checkbox id={`todo-${dateKey}-${slot}-${todo.id}`} checked={todo.completed} onCheckedChange={() => onToggleTodoCompletion(dateKey, slot, todo.id)} aria-label={todo.completed ? t.markIncomplete : t.markComplete} className="border-primary/50 shrink-0" disabled={isPastDay} />
                                        <div className="flex items-center space-x-1 shrink-0">
                                            {CategoryIcon && todo.category && (<Tooltip><TooltipTrigger asChild><CategoryIcon className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>{getCategoryTooltipText(todo.category)}</p></TooltipContent></Tooltip>)}
                                            {DeadlineIcon && todo.deadline && (<Tooltip><TooltipTrigger asChild><DeadlineIcon className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>{getDeadlineTooltipText(todo.deadline)}</p></TooltipContent></Tooltip>)}
                                            {todo.importance === 'important' && (<Tooltip><TooltipTrigger asChild><StarIcon className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /></TooltipTrigger><TooltipContent><p>{getImportanceTooltipText(todo.importance)}</p></TooltipContent></Tooltip>)}
                                        </div>
                                        <label htmlFor={`todo-${dateKey}-${slot}-${todo.id}`} onMouseDown={(e) => e.preventDefault()} className={cn("text-xs flex-1 min-w-0 truncate", todo.completed ? 'line-through text-muted-foreground/80' : 'text-foreground/90', !isPastDay && "cursor-pointer")} title={todo.text}>{todo.text}</label>
                                    </div>
                                    {!isPastDay && <div className="flex items-center space-x-0.5 ml-1 shrink-0 opacity-0 group-hover/todoitem:opacity-100 transition-opacity">
                                        {isAddingDisabledForThisSlot ? (
                                            // 过去的时间段：只有未完成的待办事项才显示移动按钮
                                            !todo.completed && (
                                                <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-purple-500" onClick={() => onMoveTodoModal(dateKey, slot, todo)}><ArrowRight className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.moveTodo}</p></TooltipContent></Tooltip>
                                            )
                                        ) : (
                                            // 当前和未来的时间段：显示编辑按钮
                                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => onOpenEditTodoModal(dateKey, slot, todo)}><FileEdit className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.editItem}</p></TooltipContent></Tooltip>
                                        )}
                                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => onDeleteTodo(dateKey, slot, todo.id)}><Trash2 className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.deleteItem}</p></TooltipContent></Tooltip>
                                    </div>}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            );})()}
            
            {meetingNotes.length > 0 && (() => { const isFirst = sectionsRenderedInSlotCount === 0; sectionsRenderedInSlotCount++; return (
                <div className={cn("mb-3", !isFirst && "mt-4")}>
                    <div className="flex items-center gap-1 mb-2">
                        <ClipboardList className="h-3.5 w-3.5 text-amber-500" />
                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400">会议记录</span>
                    </div>
                    <ul className="space-y-2 p-px border-l-2 border-amber-200 pl-3">
                        {meetingNotes.map((note) => (
                            <li key={note.id} className="flex items-center justify-between group/noteitem hover:bg-amber-50 dark:hover:bg-amber-950/20 p-1.5 rounded-md transition-colors">
                                <span className="text-xs text-foreground/90 flex-1 min-w-0 truncate" title={note.title}>{note.title || t.noData}</span>
                                {!isPastDay && <div className="flex items-center space-x-0.5 ml-1 shrink-0 opacity-0 group-hover/noteitem:opacity-100 transition-opacity">
                                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => onOpenMeetingNoteModal(slot, note)}><FileEdit className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.editMeetingNote}</p></TooltipContent></Tooltip>
                                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => onDeleteMeetingNote(dateKey, slot, note.id)}><Trash2 className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.deleteMeetingNote}</p></TooltipContent></Tooltip>
                                </div>}
                            </li>
                        ))}
                    </ul>
                </div>
            );})()}

            {shareLinks.length > 0 && (() => { const isFirst = sectionsRenderedInSlotCount === 0; sectionsRenderedInSlotCount++; return (
                <div className={cn("mb-3", !isFirst && "mt-4")}>
                    <div className="flex items-center gap-1 mb-2">
                        <LinkIconLucide className="h-3.5 w-3.5 text-blue-500" />
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">链接</span>
                    </div>
                    <ul className="space-y-2 p-px border-l-2 border-blue-200 pl-3">
                        {shareLinks.map((link) => (
                            <li key={link.id} className="flex items-center justify-between group/linkitem hover:bg-blue-50 dark:hover:bg-blue-950/20 p-1.5 rounded-md transition-colors">
                                <div className="flex-1 min-w-0 flex items-center">
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate" title={link.title || link.url}>{link.title || link.url}</a>
                                    {link.category && (<span className="text-xs rounded-full px-2 py-0.5 ml-2 shrink-0" style={{ backgroundColor: getTagColor(link.category) }}>{link.category}</span>)}
                                </div>
                                {!isPastDay && <div className="flex items-center space-x-0.5 ml-1 shrink-0 opacity-0 group-hover/linkitem:opacity-100 transition-opacity">
                                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => onOpenShareLinkModal(slot, link)}><FileEdit className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.editLink}</p></TooltipContent></Tooltip>
                                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => onDeleteShareLink(dateKey, slot, link.id)}><Trash2 className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.deleteLink}</p></TooltipContent></Tooltip>
                                </div>}
                            </li>
                        ))}
                    </ul>
                </div>
            );})()}
            
            {reflections.length > 0 && (() => { const isFirst = sectionsRenderedInSlotCount === 0; sectionsRenderedInSlotCount++; return (
                <div className={cn("mb-3", !isFirst && "mt-4")}>
                    <div className="flex items-center gap-1 mb-2">
                        <MessageSquareText className="h-3.5 w-3.5 text-green-500" />
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">思维灵感</span>
                    </div>
                    <ul className="space-y-2 p-px border-l-2 border-green-200 pl-3">
                        {reflections.map((reflection) => (
                            <li key={reflection.id} className="flex items-start justify-between group/reflectionitem hover:bg-green-50 dark:hover:bg-green-950/20 p-1.5 rounded-md transition-colors">
                                <ScrollArea className="max-h-20 w-full mr-2">
                                    <p className="text-xs text-foreground/90 whitespace-pre-wrap break-words" title={reflection.text}>{reflection.text}</p>
                                </ScrollArea>
                                {!isPastDay && <div className="flex items-center space-x-0.5 ml-1 shrink-0 opacity-0 group-hover/reflectionitem:opacity-100 transition-opacity">
                                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => onOpenReflectionModal(slot, reflection)}><FileEdit className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.editReflection}</p></TooltipContent></Tooltip>
                                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => onDeleteReflection(dateKey, slot, reflection.id)}><Trash2 className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.deleteReflection}</p></TooltipContent></Tooltip>
                                </div>}
                            </li>
                        ))}
                    </ul>
                </div>
            );})()}

        </div>
    );
};
