/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { QuickStats } from '@/components/voting/QuickStats';
import { UserContext } from '@/app/lib/user-store';

describe('QuickStats', () => {
  const registeredUser: UserContext = {
    country: 'India',
    location: 'Mumbai, Maharashtra',
    age: 25,
    voterStatus: 'registered',
    onboarded: true,
  };

  const unregisteredUser: UserContext = {
    country: 'United States',
    location: 'Austin, TX',
    age: 30,
    voterStatus: 'unregistered',
    onboarded: true,
  };

  const unknownStatusUser: UserContext = {
    country: 'United Kingdom',
    location: 'London',
    age: 40,
    voterStatus: 'unknown',
    onboarded: true,
  };

  it('should render country correctly', () => {
    render(<QuickStats user={registeredUser} />);
    expect(screen.getByText('India')).toBeInTheDocument();
  });

  it('should render location correctly', () => {
    render(<QuickStats user={registeredUser} />);
    expect(screen.getByText('Mumbai, Maharashtra')).toBeInTheDocument();
  });

  it('should render age correctly', () => {
    render(<QuickStats user={registeredUser} />);
    expect(screen.getByText('25 yrs')).toBeInTheDocument();
  });

  it('should display "Registered" for registered voters', () => {
    render(<QuickStats user={registeredUser} />);
    expect(screen.getByText('Registered')).toBeInTheDocument();
  });

  it('should display "Not Registered" for unregistered voters', () => {
    render(<QuickStats user={unregisteredUser} />);
    expect(screen.getByText('Not Registered')).toBeInTheDocument();
  });

  it('should display "Unknown" for unknown voter status', () => {
    render(<QuickStats user={unknownStatusUser} />);
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('should render all four stat labels', () => {
    render(<QuickStats user={registeredUser} />);
    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('should show "Not set" when location is empty', () => {
    const noLocUser = { ...registeredUser, location: '' };
    render(<QuickStats user={noLocUser} />);
    expect(screen.getByText('Not set')).toBeInTheDocument();
  });

  it('should render US user data correctly', () => {
    render(<QuickStats user={unregisteredUser} />);
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('Austin, TX')).toBeInTheDocument();
    expect(screen.getByText('30 yrs')).toBeInTheDocument();
  });
});
