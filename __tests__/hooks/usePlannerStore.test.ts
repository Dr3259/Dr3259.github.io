
import { act, renderHook } from '@testing-library/react';
import { usePlannerStore } from '@/hooks/usePlannerStore';
import type { TodoItem, RatingType } from '@/lib/page-types';

describe('usePlannerStore', () => {
    // Reset store before each test
    beforeEach(() => {
        act(() => {
            usePlannerStore.getState().clearAllPlannerData();
        });
    });

    it('should set and get a daily note', () => {
        const { result } = renderHook(() => usePlannerStore());
        const dateKey = '2024-01-01';
        const note = 'This is a test note.';

        act(() => {
            result.current.setDailyNote(dateKey, note);
        });

        expect(result.current.allDailyNotes[dateKey]).toBe(note);
    });

    it('should set and get a rating', () => {
        const { result } = renderHook(() => usePlannerStore());
        const dateKey = '2024-01-01';
        const rating: RatingType = 'excellent';

        act(() => {
            result.current.setRating(dateKey, rating);
        });

        expect(result.current.allRatings[dateKey]).toBe(rating);
    });

    it('should add a new todo item', () => {
        const { result } = renderHook(() => usePlannerStore());
        const dateKey = '2024-01-02';
        const hourSlot = '09:00 - 10:00';
        const newTodo: Omit<TodoItem, 'id'> = {
            text: 'Test todo',
            completed: false,
            category: 'work',
            deadline: null,
            importance: null,
        };

        act(() => {
            result.current.addTodo(dateKey, hourSlot, newTodo);
        });

        const todosInSlot = result.current.allTodos[dateKey][hourSlot];
        expect(todosInSlot).toHaveLength(1);
        expect(todosInSlot[0].text).toBe('Test todo');
        expect(todosInSlot[0].completed).toBe(false);
    });

    it('should overwrite todos for a specific slot', () => {
         const { result } = renderHook(() => usePlannerStore());
        const dateKey = '2024-01-03';
        const hourSlot = '10:00 - 11:00';
        const initialTodos: TodoItem[] = [{ id: '1', text: 'Initial', completed: false, category: null, deadline: null, importance: null }];
        const newTodos: TodoItem[] = [
            { id: '2', text: 'New 1', completed: false, category: null, deadline: null, importance: null },
            { id: '3', text: 'New 2', completed: true, category: null, deadline: null, importance: null },
        ];
        
        act(() => {
            result.current.setTodosForSlot(dateKey, hourSlot, initialTodos);
        });

        expect(result.current.allTodos[dateKey][hourSlot]).toHaveLength(1);

        act(() => {
            result.current.setTodosForSlot(dateKey, hourSlot, newTodos);
        });

        expect(result.current.allTodos[dateKey][hourSlot]).toHaveLength(2);
        expect(result.current.allTodos[dateKey][hourSlot][0].text).toBe('New 1');
    });

    it('should migrate unfinished todos from yesterday to today', () => {
        const { result } = renderHook(() => usePlannerStore());
        const yesterday = '2024-08-20';
        const today = '2024-08-21';
        const targetSlot = '08:00 - 09:00';

        const unfinishedTodo: TodoItem = { id: '100', text: 'Migrate me', completed: false, category: 'work', deadline: null, importance: null };
        const finishedTodo: TodoItem = { id: '101', text: 'Do not migrate', completed: true, category: 'work', deadline: null, importance: null };
        
        act(() => {
            result.current.setTodosForSlot(yesterday, '14:00 - 15:00', [unfinishedTodo, finishedTodo]);
        });
        
        let migratedCount = 0;
        act(() => {
           migratedCount = result.current.addUnfinishedTodosToToday(today, yesterday);
        });
        
        expect(migratedCount).toBe(1);
        
        const todayTodos = result.current.allTodos[today];
        expect(todayTodos).toBeDefined();
        const allSlots = Object.keys(todayTodos || {});
        const found = allSlots.some(slot => (todayTodos[slot] || []).some(t => t.text === 'Migrate me'));
        expect(found).toBe(true);
        // Ensure original ID is changed to avoid duplicates
        const migrated = allSlots.flatMap(slot => todayTodos[slot] || []).find(t => t.text === 'Migrate me');
        expect(migrated?.id).not.toBe('100');
    });

    it('should clear all data', () => {
        const { result } = renderHook(() => usePlannerStore());
        
        act(() => {
            result.current.setDailyNote('2024-01-01', 'note');
            result.current.setRating('2024-01-01', 'excellent');
        });

        expect(result.current.allDailyNotes['2024-01-01']).toBe('note');

        act(() => {
            result.current.clearAllPlannerData();
        });

        expect(result.current.allDailyNotes).toEqual({});
        expect(result.current.allRatings).toEqual({});
        expect(result.current.allTodos).toEqual({});
    });
});
