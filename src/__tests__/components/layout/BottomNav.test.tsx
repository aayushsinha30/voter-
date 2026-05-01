/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BottomNav } from '@/components/layout/BottomNav';

describe('BottomNav', () => {
  it('should render all five navigation items', () => {
    render(<BottomNav />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Journey')).toBeInTheDocument();
    expect(screen.getByText('Learn')).toBeInTheDocument();
    expect(screen.getByText('Tools')).toBeInTheDocument();
    expect(screen.getByText('Quiz')).toBeInTheDocument();
  });

  it('should render links with correct hrefs', () => {
    render(<BottomNav />);
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Journey').closest('a')).toHaveAttribute('href', '/journey');
    expect(screen.getByText('Learn').closest('a')).toHaveAttribute('href', '/learn');
    expect(screen.getByText('Tools').closest('a')).toHaveAttribute('href', '/tools');
    expect(screen.getByText('Quiz').closest('a')).toHaveAttribute('href', '/quiz');
  });

  it('should be wrapped in a nav element with fixed positioning', () => {
    const { container } = render(<BottomNav />);
    const nav = container.querySelector('nav');
    expect(nav).toBeInTheDocument();
    expect(nav?.className).toContain('fixed');
  });
});
