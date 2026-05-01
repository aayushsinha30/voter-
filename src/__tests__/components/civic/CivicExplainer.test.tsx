/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CivicExplainer } from '@/components/civic/CivicExplainer';

jest.mock('@/ai/flows/civic-concept-explainer-flow', () => ({
  explainCivicConcept: jest.fn(),
}));

jest.mock('@/app/lib/user-store', () => ({
  useUserContext: () => ({
    user: { country: 'India', location: 'Delhi', age: 25, voterStatus: 'registered', onboarded: true },
    saveUser: jest.fn(), resetUser: jest.fn(), loading: false,
  }),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

import { explainCivicConcept } from '@/ai/flows/civic-concept-explainer-flow';
const mockExplain = explainCivicConcept as jest.MockedFunction<typeof explainCivicConcept>;

describe('CivicExplainer', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should render the AI Civic Explainer title', () => {
    render(<CivicExplainer />);
    expect(screen.getByText('AI Civic Explainer')).toBeInTheDocument();
  });

  it('should render search input', () => {
    render(<CivicExplainer />);
    expect(screen.getByPlaceholderText(/Lok Sabha|Electoral/i)).toBeInTheDocument();
  });

  it('should show India-specific suggested topics', () => {
    render(<CivicExplainer />);
    expect(screen.getByText('Lok Sabha')).toBeInTheDocument();
    expect(screen.getByText('Rajya Sabha')).toBeInTheDocument();
    expect(screen.getByText('NOTA')).toBeInTheDocument();
  });

  it('should render comprehension level tabs', () => {
    render(<CivicExplainer />);
    expect(screen.getByText('Simple')).toBeInTheDocument();
    expect(screen.getByText('Detailed')).toBeInTheDocument();
    expect(screen.getByText('Expert')).toBeInTheDocument();
  });

  it('should call AI when a suggested topic is clicked', async () => {
    mockExplain.mockResolvedValue({
      explanation: 'Lok Sabha is the lower house of Parliament.',
      relatedTerms: ['Parliament', 'Rajya Sabha'],
    });

    render(<CivicExplainer />);
    fireEvent.click(screen.getByText('Lok Sabha'));

    expect(mockExplain).toHaveBeenCalledWith(
      expect.objectContaining({ concept: 'Lok Sabha', country: 'India' })
    );
  });

  it('should display explanation after AI responds', async () => {
    mockExplain.mockResolvedValue({
      explanation: 'The Lok Sabha is the lower house.',
      relatedTerms: ['Parliament'],
    });

    render(<CivicExplainer />);
    fireEvent.click(screen.getByText('Lok Sabha'));

    const explanation = await screen.findByText(/lower house/i);
    expect(explanation).toBeInTheDocument();
  });

  it('should display related terms after explanation', async () => {
    mockExplain.mockResolvedValue({
      explanation: 'NOTA allows voters to reject all candidates.',
      relatedTerms: ['ECI', 'Ballot'],
    });

    render(<CivicExplainer />);
    fireEvent.click(screen.getByText('NOTA'));

    const related = await screen.findByText('ECI');
    expect(related).toBeInTheDocument();
  });

  it('should show country context in description', () => {
    render(<CivicExplainer />);
    expect(screen.getByText(/India/i)).toBeInTheDocument();
  });
});
