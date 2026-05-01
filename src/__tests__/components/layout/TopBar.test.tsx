/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { TopBar } from '@/components/layout/TopBar';

jest.mock('@/app/lib/user-store', () => ({
  useUserContext: () => ({
    user: { country: 'India', location: 'Mumbai', age: 25, voterStatus: 'registered', onboarded: true },
    resetUser: jest.fn(),
    saveUser: jest.fn(),
    loading: false,
  }),
}));

describe('TopBar', () => {
  it('should render VoteWise branding', () => {
    render(<TopBar />);
    expect(screen.getByText('VoteWise')).toBeInTheDocument();
  });

  it('should display progress percentage', () => {
    render(<TopBar />);
    expect(screen.getByText(/Ready/i)).toBeInTheDocument();
  });

  it('should render as a header element', () => {
    const { container } = render(<TopBar />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  it('should be sticky positioned', () => {
    const { container } = render(<TopBar />);
    const header = container.querySelector('header');
    expect(header?.className).toContain('sticky');
  });

  it('should render settings button for onboarded users', () => {
    const { container } = render(<TopBar />);
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
