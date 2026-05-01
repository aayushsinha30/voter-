/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ElectionNewsFeed } from '@/components/voting/ElectionNewsFeed';

describe('ElectionNewsFeed', () => {
  it('should render India-specific news items', () => {
    render(<ElectionNewsFeed country="India" />);
    expect(screen.getByText(/ECI announces/i)).toBeInTheDocument();
    expect(screen.getByText(/Digital Voter ID/i)).toBeInTheDocument();
  });

  it('should render US-specific news items', () => {
    render(<ElectionNewsFeed country="United States" />);
    expect(screen.getByText(/Voter registration deadlines/i)).toBeInTheDocument();
  });

  it('should render default news for unknown countries', () => {
    render(<ElectionNewsFeed country="Wakanda" />);
    expect(screen.getByText(/Global democracy/i)).toBeInTheDocument();
  });

  it('should render the Election News heading', () => {
    render(<ElectionNewsFeed country="India" />);
    expect(screen.getByText('Election News')).toBeInTheDocument();
  });

  it('should render exactly 3 news items', () => {
    const { container } = render(<ElectionNewsFeed country="India" />);
    const newsCards = container.querySelectorAll('.news-card');
    expect(newsCards.length).toBe(3);
  });

  it('should display news source', () => {
    render(<ElectionNewsFeed country="India" />);
    expect(screen.getByText(/The Hindu/i)).toBeInTheDocument();
  });

  it('should display time stamps', () => {
    render(<ElectionNewsFeed country="India" />);
    expect(screen.getByText(/2h ago/i)).toBeInTheDocument();
  });

  it('should display tag badges', () => {
    render(<ElectionNewsFeed country="India" />);
    expect(screen.getByText('Official')).toBeInTheDocument();
    expect(screen.getByText('Policy')).toBeInTheDocument();
    expect(screen.getByText('Updates')).toBeInTheDocument();
  });
});
