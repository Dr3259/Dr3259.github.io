
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
    Star as StarIcon
} from 'lucide-react';
import { CategoryIcons, DeadlineIcons, type TodoItem, type MeetingNoteItem, type ShareLinkItem, type ReflectionItem, type CategoryType } from '@/app/day/[dayName]/page';

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
    onOpenEditTodoModal: (dateKey: string, hourSlot: string, todo: TodoItem) => void;
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
    onToggleTodoCompletion, onDeleteTodo, onOpenEditTodoModal, onOpenMeetingNoteModal,
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
                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => onOpenMeetingNoteModal(slot, undefined)} disabled={isAddingDisabledForThisSlot}><ListChecks className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>{t.addTodo}</p></TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => onOpenMeetingNoteModal(slot)} disabled={isAddingDisabledForThisSlot}><ClipboardList className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>{t.addMeetingNote}</p></TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => onOpenShareLinkModal(slot)} disabled={isAddingDisabledForThisSlot}><LinkIconLucide className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>{t.addLink}</p></TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary" onClick={() => onOpenReflectionModal(slot)} disabled={isAddingDisabledForThisSlot}><MessageSquareText className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>{t.addReflection}</p></TooltipContent></Tooltip>
                </div>
            </div>

            {todos.length > 0 && (() => { sectionsRenderedInSlotCount++; return (
                <ul className="space-y-2 p-px mb-3 group/todolist">
                    {todos.map((todo) => {
                        const CategoryIcon = todo.category ? CategoryIcons[todo.category] : null;
                        const DeadlineIcon = todo.deadline ? DeadlineIcons[todo.deadline] : null;
                        return (
                            <li key={todo.id} className="flex items-center justify-between group/todoitem hover:bg-muted/30 p-1.5 rounded-md transition-colors">
                                <div className="flex items-center space-x-2 flex-grow min-w-0">
                                    <Checkbox id={`todo-${dateKey}-${slot}-${todo.id}`} checked={todo.completed} onCheckedChange={() => onToggleTodoCompletion(dateKey, slot, todo.id)} aria-label={todo.completed ? t.markIncomplete : t.markComplete} className="border-primary/50 shrink-0" disabled={isPastDay} />
                                    <div className="flex items-center space-x-1 shrink-0">
                                        {CategoryIcon && todo.category && (<Tooltip><TooltipTrigger asChild><CategoryIcon className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>{getCategoryTooltipText(todo.category)}</p></TooltipContent></Tooltip>)}
                                        {DeadlineIcon && todo.deadline && (<Tooltip><TooltipTrigger asChild><DeadlineIcon className="h-3.5 w-3.5 text-muted-foreground" /></TooltipTrigger><TooltipContent><p>{getDeadlineTooltipText(todo.deadline)}</p></TooltipContent></Tooltip>)}
                                        {todo.importance === 'important' && (<Tooltip><TooltipTrigger asChild><StarIcon className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /></TooltipTrigger><TooltipContent><p>{getImportanceTooltipText(todo.importance)}</p></TooltipContent></Tooltip>)}
                                    </div>
                                    <label htmlFor={`todo-${dateKey}-${slot}-${todo.id}`} onMouseDown={(e) => e.preventDefault()} className={cn("text-xs flex-1 min-w-0 truncate", todo.completed ? 'line-through text-muted-foreground/80' : 'text-foreground/90', !isPastDay && "cursor-pointer")} title={todo.text}>{todo.text}</label>
                                </div>
                                {!isPastDay && <div className="flex items-center space-x-0.5 ml-1 shrink-0 opacity-0 group-hover/todoitem:opacity-100 transition-opacity"><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => onOpenEditTodoModal(dateKey, slot, todo)}><FileEdit className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.editItem}</p></TooltipContent></Tooltip><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => onDeleteTodo(dateKey, slot, todo.id)}><Trash2 className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.deleteItem}</p></TooltipContent></Tooltip></div>}
                            </li>
                        );
                    })}
                </ul>
            );})()}
            
            {meetingNotes.length > 0 && (() => { const isFirst = sectionsRenderedInSlotCount === 0; sectionsRenderedInSlotCount++; return (
                <><h4 className={cn("text-xs font-semibold text-muted-foreground mb-2 pl-1", !isFirst && "mt-4")}>{t.meetingNotesSectionTitle}</h4><ul className="space-y-2 p-px mb-3">{meetingNotes.map((note) => (<li key={note.id} className="flex items-center justify-between group/noteitem hover:bg-muted/30 p-1.5 rounded-md transition-colors"><span className="text-xs text-foreground/90 flex-1 min-w-0 truncate" title={note.title}>{note.title || t.noData}</span>{!isPastDay && <div className="flex items-center space-x-0.5 ml-1 shrink-0 opacity-0 group-hover/noteitem:opacity-100 transition-opacity"><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => onOpenMeetingNoteModal(slot, note)}><FileEdit className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.editMeetingNote}</p></TooltipContent></Tooltip><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => onDeleteMeetingNote(dateKey, slot, note.id)}><Trash2 className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.deleteMeetingNote}</p></TooltipContent></Tooltip></div>}</li>))}</ul></>
            );})()}

            {shareLinks.length > 0 && (() => { const isFirst = sectionsRenderedInSlotCount === 0; sectionsRenderedInSlotCount++; return (
                <><h4 className={cn("text-xs font-semibold text-muted-foreground mb-2 pl-1", !isFirst && "mt-4")}>{t.linksSectionTitle}</h4><ul className="space-y-2 p-px mb-3">{shareLinks.map((link) => (<li key={link.id} className="flex items-center justify-between group/linkitem hover:bg-muted/30 p-1.5 rounded-md transition-colors"><div className="flex-1 min-w-0 flex items-center"><a href={link.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate" title={link.title || link.url}>{link.title || link.url}</a>{link.category && (<span className="text-xs rounded-full px-2 py-0.5 ml-2 shrink-0" style={{ backgroundColor: getTagColor(link.category) }}>{link.category}</span>)}</div>{!isPastDay && <div className="flex items-center space-x-0.5 ml-1 shrink-0 opacity-0 group-hover/linkitem:opacity-100 transition-opacity"><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => onOpenShareLinkModal(slot, link)}><FileEdit className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.editLink}</p></TooltipContent></Tooltip><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => onDeleteShareLink(dateKey, slot, link.id)}><Trash2 className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.deleteLink}</p></TooltipContent></Tooltip></div>}</li>))}</ul></>
            );})()}
            
            {reflections.length > 0 && (() => { const isFirst = sectionsRenderedInSlotCount === 0; sectionsRenderedInSlotCount++; return (
                <><h4 className={cn("text-xs font-semibold text-muted-foreground mb-2 pl-1", !isFirst && "mt-4")}>{t.reflectionsSectionTitle}</h4><ul className="space-y-2 p-px">{reflections.map((reflection) => (<li key={reflection.id} className="flex items-start justify-between group/reflectionitem hover:bg-muted/30 p-1.5 rounded-md transition-colors"><ScrollArea className="max-h-20 w-full mr-2"><p className="text-xs text-foreground/90 whitespace-pre-wrap break-words" title={reflection.text}>{reflection.text}</p></ScrollArea>{!isPastDay && <div className="flex items-center space-x-0.5 ml-1 shrink-0 opacity-0 group-hover/reflectionitem:opacity-100 transition-opacity"><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => onOpenReflectionModal(slot, reflection)}><FileEdit className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.editReflection}</p></TooltipContent></Tooltip><Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => onDeleteReflection(dateKey, slot, reflection.id)}><Trash2 className="h-3.5 w-3.5" /></Button></TooltipTrigger><TooltipContent><p>{t.deleteReflection}</p></TooltipContent></Tooltip></div>}</li>))}</ul></>
            );})()}

        </div>
    );
};
