/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MisinfoChecker } from '@/components/safety/MisinfoChecker';

// Mock the AI flow
jest.mock('@/ai/flows/misinformation-checker-flow', () => ({
  checkMisinformation: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

import { checkMisinformation } from '@/ai/flows/misinformation-checker-flow';
const mockCheck = checkMisinformation as jest.MockedFunction<typeof checkMisinformation>;

describe('MisinfoChecker', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should render the AI Fact Checker title', () => {
    render(<MisinfoChecker />);
    expect(screen.getByText('AI Fact Checker')).toBeInTheDocument();
  });

  it('should render textarea for input', () => {
    render(<MisinfoChecker />);
    expect(screen.getByPlaceholderText(/fact-check/i)).toBeInTheDocument();
  });

  it('should render the Analyze button', () => {
    render(<MisinfoChecker />);
    expect(screen.getByText('Analyze Information')).toBeInTheDocument();
  });

  it('should disable button when input is empty', () => {
    render(<MisinfoChecker />);
    const btn = screen.getByText('Analyze Information').closest('button');
    expect(btn).toBeDisabled();
  });

  it('should enable button when text is entered', () => {
    render(<MisinfoChecker />);
    const textarea = screen.getByPlaceholderText(/fact-check/i);
    fireEvent.change(textarea, { target: { value: 'Some claim to check' } });
    const btn = screen.getByText('Analyze Information').closest('button');
    expect(btn).not.toBeDisabled();
  });

  it('should call AI when Analyze is clicked', async () => {
    mockCheck.mockResolvedValue({
      isMisinformation: false,
      confidenceScore: 90,
      explanation: 'This appears accurate.',
    });

    render(<MisinfoChecker />);
    const textarea = screen.getByPlaceholderText(/fact-check/i);
    fireEvent.change(textarea, { target: { value: 'The Earth is round' } });
    fireEvent.click(screen.getByText('Analyze Information'));

    expect(mockCheck).toHaveBeenCalledWith({ information: 'The Earth is round' });
  });

  it('should display results after analysis completes', async () => {
    mockCheck.mockResolvedValue({
      isMisinformation: true,
      confidenceScore: 85,
      explanation: 'This claim contains inaccuracies.',
    });

    render(<MisinfoChecker />);
    const textarea = screen.getByPlaceholderText(/fact-check/i);
    fireEvent.change(textarea, { target: { value: 'False claim' } });
    fireEvent.click(screen.getByText('Analyze Information'));

    const result = await screen.findByText(/inaccuracies/i);
    expect(result).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('should show misinformation warning for flagged content', async () => {
    mockCheck.mockResolvedValue({
      isMisinformation: true,
      confidenceScore: 92,
      explanation: 'Misleading content detected.',
    });

    render(<MisinfoChecker />);
    const textarea = screen.getByPlaceholderText(/fact-check/i);
    fireEvent.change(textarea, { target: { value: 'Fake news' } });
    fireEvent.click(screen.getByText('Analyze Information'));

    const warning = await screen.findByText(/Potential Misinformation/i);
    expect(warning).toBeInTheDocument();
  });

  it('should show accurate label for verified content', async () => {
    mockCheck.mockResolvedValue({
      isMisinformation: false,
      confidenceScore: 95,
      explanation: 'This is accurate.',
    });

    render(<MisinfoChecker />);
    fireEvent.change(screen.getByPlaceholderText(/fact-check/i), { target: { value: 'True fact' } });
    fireEvent.click(screen.getByText('Analyze Information'));

    const label = await screen.findByText(/Likely Accurate/i);
    expect(label).toBeInTheDocument();
  });
});
