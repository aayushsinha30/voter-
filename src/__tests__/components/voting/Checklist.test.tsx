/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checklist } from '@/components/voting/Checklist';

// Mock the user context
jest.mock('@/app/lib/user-store', () => ({
  useUserContext: jest.fn(),
}));

import { useUserContext } from '@/app/lib/user-store';

const mockUseUserContext = useUserContext as jest.MockedFunction<typeof useUserContext>;

describe('Checklist', () => {
  beforeEach(() => {
    mockUseUserContext.mockReturnValue({
      user: {
        country: 'India',
        location: 'Mumbai',
        age: 25,
        voterStatus: 'registered',
        onboarded: true,
      },
      saveUser: jest.fn(),
      resetUser: jest.fn(),
      loading: false,
    });
  });

  it('should render India-specific checklist items', () => {
    render(<Checklist />);
    expect(screen.getByText(/EPIC Card/i)).toBeInTheDocument();
    expect(screen.getByText(/Voter Information Slip/i)).toBeInTheDocument();
    expect(screen.getByText(/Polling Station/i)).toBeInTheDocument();
  });

  it('should render the "Readiness Checklist" title', () => {
    render(<Checklist />);
    expect(screen.getByText('Readiness Checklist')).toBeInTheDocument();
  });

  it('should display the "Required" label for critical unchecked items', () => {
    render(<Checklist />);
    const requiredLabels = screen.getAllByText('Required');
    expect(requiredLabels.length).toBeGreaterThan(0);
  });

  it('should toggle item checked state on click', () => {
    render(<Checklist />);
    const firstItem = screen.getByText(/EPIC Card/i);
    fireEvent.click(firstItem);
    // After clicking, should show "Done"
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('should update progress counter when items are checked', () => {
    render(<Checklist />);
    // Initially 0/5
    expect(screen.getByText('0/5')).toBeInTheDocument();
    
    const firstItem = screen.getByText(/EPIC Card/i);
    fireEvent.click(firstItem);
    expect(screen.getByText('1/5')).toBeInTheDocument();
  });

  it('should render default checklist for non-India countries', () => {
    mockUseUserContext.mockReturnValue({
      user: {
        country: 'United States',
        location: 'Austin',
        age: 30,
        voterStatus: 'registered',
        onboarded: true,
      },
      saveUser: jest.fn(),
      resetUser: jest.fn(),
      loading: false,
    });

    render(<Checklist />);
    expect(screen.getByText(/Valid Photo ID/i)).toBeInTheDocument();
    expect(screen.getByText(/Proof of Residence/i)).toBeInTheDocument();
  });

  it('should show country context in description', () => {
    render(<Checklist />);
    expect(screen.getByText(/India/i)).toBeInTheDocument();
  });
});
