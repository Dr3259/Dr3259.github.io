
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DayBox } from '@/components/DayBox';


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
        const { container } = render(<DayBox {...defaultProps} />);
        expect(screen.queryByLabelText('Has content')).not.toBeInTheDocument();
        const svg = container.querySelector('svg.lucide-calendar-plus');
        expect(svg).toBeTruthy();
    });

    it('shows FileText indicator when dayHasAnyData is true', () => {
        render(<DayBox {...defaultProps} dayHasAnyData={true} />);
        expect(screen.getByLabelText('Has content')).toBeInTheDocument();
    });

    it('does not show rating icons for a future day', () => {
        render(<DayBox {...defaultProps} isFutureDay={true} dayHasAnyData={true} />);
        expect(screen.queryByLabelText('Excellent')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Average')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Terrible')).not.toBeInTheDocument();
    });

    it('shows rating icons for a past day with content', () => {
        render(<DayBox {...defaultProps} isPastDay={true} isFutureDay={false} dayHasAnyData={true} />);
        expect(screen.getByLabelText('Excellent')).toBeInTheDocument();
        expect(screen.getByLabelText('Average')).toBeInTheDocument();
        expect(screen.getByLabelText('Terrible')).toBeInTheDocument();
    });

    it('calls onClick when the card is clicked', () => {
        render(<DayBox {...defaultProps} />);
        fireEvent.click(screen.getByText('Monday'));
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('calls onRatingChange when a rating icon is clicked', () => {
        render(<DayBox {...defaultProps} isPastDay={true} isFutureDay={false} dayHasAnyData={true} />);
        fireEvent.click(screen.getByLabelText('Excellent'));
        expect(mockOnRatingChange).toHaveBeenCalledWith('excellent');
    });

    it('highlights the correct rating icon when a rating is provided', () => {
        render(<DayBox {...defaultProps} isPastDay={true} isFutureDay={false} dayHasAnyData={true} rating="average" />);
        const mehButton = screen.getByLabelText('Average');
        expect(mehButton).toHaveClass('text-primary');
    });

    it('toggles rating off when the same rating icon is clicked again', () => {
        render(<DayBox {...defaultProps} isPastDay={true} isFutureDay={false} dayHasAnyData={true} rating="average" />);
        fireEvent.click(screen.getByLabelText('Average'));
        expect(mockOnRatingChange).toHaveBeenCalledWith(null);
    });
});
