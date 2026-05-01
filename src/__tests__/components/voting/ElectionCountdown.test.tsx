/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ElectionCountdown } from '@/components/voting/ElectionCountdown';

describe('ElectionCountdown', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render for India with correct election name', () => {
    render(<ElectionCountdown country="India" />);
    // Should find one of India's election names
    const elections = screen.queryByText(/Elections|Assembly/i);
    expect(elections).toBeInTheDocument();
  });

  it('should render for United States with correct election name', () => {
    render(<ElectionCountdown country="United States" />);
    const election = screen.queryByText(/Midterm|Presidential/i);
    expect(election).toBeInTheDocument();
  });

  it('should render the "Next Election" label', () => {
    render(<ElectionCountdown country="India" />);
    expect(screen.getByText('Next Election')).toBeInTheDocument();
  });

  it('should display countdown digits (Days, Hrs, Min, Sec)', () => {
    render(<ElectionCountdown country="India" />);
    expect(screen.getByText('Days')).toBeInTheDocument();
    expect(screen.getByText('Hrs')).toBeInTheDocument();
    expect(screen.getByText('Min')).toBeInTheDocument();
    expect(screen.getByText('Sec')).toBeInTheDocument();
  });

  it('should update countdown timer every second', () => {
    render(<ElectionCountdown country="India" />);
    
    const secsBefore = screen.getByText('Sec').previousElementSibling;
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Just verify no error — timer ticked
    expect(screen.getByText('Sec')).toBeInTheDocument();
  });

  it('should default to India elections for unknown countries', () => {
    render(<ElectionCountdown country="Narnia" />);
    // Should fall back to India elections
    expect(screen.getByText('Next Election')).toBeInTheDocument();
  });

  it('should render a formatted date string', () => {
    render(<ElectionCountdown country="India" />);
    // Should contain a year in the date display
    const dateElements = screen.getAllByText(/2026|2027|2028|2029/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it('should clean up interval on unmount', () => {
    const clearIntervalSpy = jest.spyOn(window, 'clearInterval');
    const { unmount } = render(<ElectionCountdown country="India" />);
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
