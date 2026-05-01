/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Onboarding } from '@/components/voting/Onboarding';

describe('Onboarding', () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    mockOnComplete.mockClear();
  });

  it('should render step 1 (country selection) initially', () => {
    render(<Onboarding onComplete={mockOnComplete} />);
    expect(screen.getByText('Select your country')).toBeInTheDocument();
    expect(screen.getAllByText(/Country/i)[0]).toBeInTheDocument();
  });

  it('should show step indicators (1-4)', () => {
    render(<Onboarding onComplete={mockOnComplete} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('should have a Continue button on step 1', () => {
    render(<Onboarding onComplete={mockOnComplete} />);
    expect(screen.getByText('Continue')).toBeInTheDocument();
  });

  it('should not show Back button on step 1', () => {
    render(<Onboarding onComplete={mockOnComplete} />);
    expect(screen.queryByText('Back')).not.toBeInTheDocument();
  });

  it('should navigate to step 2 when Continue is clicked', () => {
    render(<Onboarding onComplete={mockOnComplete} />);
    fireEvent.click(screen.getByText('Continue'));
    expect(screen.getByText('Where do you live?')).toBeInTheDocument();
  });

  it('should show Back button on step 2', () => {
    render(<Onboarding onComplete={mockOnComplete} />);
    fireEvent.click(screen.getByText('Continue'));
    expect(screen.getByText('Back')).toBeInTheDocument();
  });

  it('should go back to step 1 when Back is clicked on step 2', () => {
    render(<Onboarding onComplete={mockOnComplete} />);
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.click(screen.getByText('Back'));
    expect(screen.getByText('Select your country')).toBeInTheDocument();
  });

  it('should disable Continue on step 2 when location is empty', () => {
    render(<Onboarding onComplete={mockOnComplete} />);
    fireEvent.click(screen.getByText('Continue'));
    // Continue should be disabled when location is empty
    const continueBtn = screen.getByText('Continue');
    expect(continueBtn.closest('button')).toBeDisabled();
  });

  it('should render the step descriptions', () => {
    render(<Onboarding onComplete={mockOnComplete} />);
    expect(screen.getByText(/Voting rules vary/i)).toBeInTheDocument();
  });

  it('should show Launch My Roadmap button on step 4', () => {
    render(<Onboarding onComplete={mockOnComplete} />);
    
    // Step 1 -> 2
    fireEvent.click(screen.getByText('Continue'));
    
    // Step 2: fill location
    const locationInput = screen.getByPlaceholderText(/Mumbai|Austin/i);
    fireEvent.change(locationInput, { target: { value: 'Delhi' } });
    fireEvent.click(screen.getByText('Continue'));
    
    // Step 3 -> 4
    fireEvent.click(screen.getByText('Continue'));
    
    // Should show final step
    expect(screen.getByText('Launch My Roadmap')).toBeInTheDocument();
  });
});
