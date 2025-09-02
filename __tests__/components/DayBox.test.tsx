
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DayBox } from '@/components/DayBox';
import { Smile, Meh, Frown, FileText, CalendarPlus } from 'lucide-react';

// Mock lucide-react icons to make them easily testable
jest.mock('lucide-react', () => {
    const originalModule = jest.requireActual('lucide-react');
    return {
        ...originalModule,
        Smile: () => <svg data-testid="smile-icon" />,
        Meh: () => <svg data-testid="meh-icon" />,
        Frown: () => <svg data-testid="frown-icon" />,
        FileText: () => <svg data-testid="file-text-icon" />,
        CalendarPlus: () => <svg data-testid="calendar-plus-icon" />,
    };
});


describe('DayBox Component', () => {
    const mockOnRatingChange = jest.fn();
    const mockOnClick = jest.fn();
    const mockOnHoverStart = jest.fn();
    const mockOnHoverEnd = jest.fn();
    
    const defaultProps = {
        dayName: 'Monday',
        onClick: mockOnClick,
        notes: 'Some notes',
        dayHasAnyData: false,
        rating: null,
        onRatingChange: mockOnRatingChange,
        isCurrentDay: false,
        isPastDay: false,
        isFutureDay: true,
        isAfter6PMToday: false,
        todayLabel: 'Today',
        selectDayLabel: 'Select Monday',
        contentIndicatorLabel: 'Has content',
        ratingUiLabels: {
            excellent: 'Excellent',
            average: 'Average',
            terrible: 'Terrible',
        },
        onHoverStart: mockOnHoverStart,
        onHoverEnd: mockOnHoverEnd,
        imageHint: 'test hint',
    };

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
    });

    it('renders the day name correctly', () => {
        render(<DayBox {...defaultProps} />);
        expect(screen.getByText('Monday')).toBeInTheDocument();
    });

    it('shows CalendarPlus icon when there is no data', () => {
        render(<DayBox {...defaultProps} />);
        expect(screen.getByTestId('calendar-plus-icon')).toBeInTheDocument();
    });

    it('shows FileText icon when dayHasAnyData is true', () => {
        render(<DayBox {...defaultProps} dayHasAnyData={true} />);
        expect(screen.getByTestId('file-text-icon')).toBeInTheDocument();
    });

    it('does not show rating icons for a future day', () => {
        render(<DayBox {...defaultProps} isFutureDay={true} />);
        expect(screen.queryByTestId('smile-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('meh-icon')).not.toBeInTheDocument();
        expect(screen.queryByTestId('frown-icon')).not.toBeInTheDocument();
    });

    it('shows rating icons for a past day', () => {
        render(<DayBox {...defaultProps} isPastDay={true} isFutureDay={false} />);
        expect(screen.getByTestId('smile-icon')).toBeInTheDocument();
        expect(screen.getByTestId('meh-icon')).toBeInTheDocument();
        expect(screen.getByTestId('frown-icon')).toBeInTheDocument();
    });

    it('calls onClick when the card is clicked', () => {
        render(<DayBox {...defaultProps} />);
        fireEvent.click(screen.getByText('Monday'));
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('calls onRatingChange when a rating icon is clicked', () => {
        render(<DayBox {...defaultProps} isPastDay={true} isFutureDay={false} />);
        fireEvent.click(screen.getByTestId('smile-icon'));
        expect(mockOnRatingChange).toHaveBeenCalledWith('excellent');
    });

    it('highlights the correct rating icon when a rating is provided', () => {
        render(<DayBox {...defaultProps} isPastDay={true} isFutureDay={false} rating="average" />);
        const mehButton = screen.getByTestId('meh-icon').closest('button');
        // Check for a class that indicates it's selected
        expect(mehButton).toHaveClass('text-primary'); 
    });

    it('toggles rating off when the same rating icon is clicked again', () => {
        render(<DayBox {...defaultProps} isPastDay={true} isFutureDay={false} rating="average" />);
        fireEvent.click(screen.getByTestId('meh-icon'));
        expect(mockOnRatingChange).toHaveBeenCalledWith(null);
    });
});
