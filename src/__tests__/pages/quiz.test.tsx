/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizPage from '@/app/quiz/page';

jest.mock('@/app/lib/user-store', () => ({
  useUserContext: () => ({
    user: { country: 'India', location: 'Delhi', age: 25, voterStatus: 'registered', onboarded: true },
    saveUser: jest.fn(), resetUser: jest.fn(), loading: false,
  }),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

describe('QuizPage', () => {
  it('should render Civic Quiz heading', () => {
    render(<QuizPage />);
    expect(screen.getByText('Civic Quiz')).toBeInTheDocument();
  });

  it('should show first question for India', () => {
    render(<QuizPage />);
    expect(screen.getByText(/minimum voting age in India/i)).toBeInTheDocument();
  });

  it('should display progress indicator', () => {
    render(<QuizPage />);
    expect(screen.getByText('1/8')).toBeInTheDocument();
  });

  it('should render four options for each question', () => {
    render(<QuizPage />);
    expect(screen.getByText('16 years')).toBeInTheDocument();
    expect(screen.getByText('18 years')).toBeInTheDocument();
    expect(screen.getByText('21 years')).toBeInTheDocument();
    expect(screen.getByText('25 years')).toBeInTheDocument();
  });

  it('should show explanation after selecting an answer', () => {
    render(<QuizPage />);
    fireEvent.click(screen.getByText('18 years'));
    expect(screen.getByText(/61st Amendment/i)).toBeInTheDocument();
  });

  it('should show Next Question button after answering', () => {
    render(<QuizPage />);
    fireEvent.click(screen.getByText('18 years'));
    expect(screen.getByText('Next Question')).toBeInTheDocument();
  });

  it('should advance to next question', () => {
    render(<QuizPage />);
    fireEvent.click(screen.getByText('18 years'));
    fireEvent.click(screen.getByText('Next Question'));
    expect(screen.getByText('2/8')).toBeInTheDocument();
  });

  it('should show See Results on last question', () => {
    render(<QuizPage />);
    // Answer all 8 questions
    for (let i = 0; i < 7; i++) {
      const options = screen.getAllByRole('button').filter(b => b.textContent && !b.textContent.includes('Next'));
      fireEvent.click(options[0]);
      fireEvent.click(screen.getByText('Next Question'));
    }
    // Last question
    const options = screen.getAllByRole('button').filter(b => b.textContent && !b.textContent.includes('See'));
    fireEvent.click(options[0]);
    expect(screen.getByText('See Results')).toBeInTheDocument();
  });

  it('should show results screen after completing quiz', () => {
    render(<QuizPage />);
    for (let i = 0; i < 8; i++) {
      const options = screen.getAllByRole('button').filter(
        b => b.textContent && !b.textContent.includes('Next') && !b.textContent.includes('See')
      );
      if (options.length > 0) fireEvent.click(options[0]);
      const nextBtn = screen.queryByText('Next Question') || screen.queryByText('See Results');
      if (nextBtn) fireEvent.click(nextBtn);
    }
    expect(screen.getByText(/accuracy/i)).toBeInTheDocument();
  });
});
