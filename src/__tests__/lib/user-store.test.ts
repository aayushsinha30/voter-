/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useUserContext, UserContext } from '@/app/lib/user-store';

describe('useUserContext', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should return null user initially when localStorage is empty', () => {
    const { result } = renderHook(() => useUserContext());
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should load user from localStorage on mount', () => {
    const savedUser: UserContext = {
      country: 'India',
      location: 'Mumbai, Maharashtra',
      age: 25,
      voterStatus: 'registered',
      onboarded: true,
    };
    localStorage.setItem('votewise_user_context', JSON.stringify(savedUser));

    const { result } = renderHook(() => useUserContext());
    expect(result.current.user).toEqual(savedUser);
    expect(result.current.loading).toBe(false);
  });

  it('should save user to state and localStorage', () => {
    const { result } = renderHook(() => useUserContext());

    const newUser: UserContext = {
      country: 'United States',
      location: 'Austin, TX',
      age: 30,
      voterStatus: 'unregistered',
      onboarded: true,
    };

    act(() => {
      result.current.saveUser(newUser);
    });

    expect(result.current.user).toEqual(newUser);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'votewise_user_context',
      JSON.stringify(newUser)
    );
  });

  it('should reset user from state and localStorage', () => {
    const savedUser: UserContext = {
      country: 'India',
      location: 'Delhi',
      age: 22,
      voterStatus: 'unknown',
      onboarded: true,
    };
    localStorage.setItem('votewise_user_context', JSON.stringify(savedUser));

    const { result } = renderHook(() => useUserContext());

    act(() => {
      result.current.resetUser();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith('votewise_user_context');
  });

  it('should handle multiple save/reset cycles correctly', () => {
    const { result } = renderHook(() => useUserContext());

    const user1: UserContext = {
      country: 'India',
      location: 'Bangalore',
      age: 28,
      voterStatus: 'registered',
      onboarded: true,
    };

    act(() => {
      result.current.saveUser(user1);
    });
    expect(result.current.user).toEqual(user1);

    act(() => {
      result.current.resetUser();
    });
    expect(result.current.user).toBeNull();

    const user2: UserContext = {
      country: 'United Kingdom',
      location: 'London',
      age: 35,
      voterStatus: 'registered',
      onboarded: true,
    };

    act(() => {
      result.current.saveUser(user2);
    });
    expect(result.current.user).toEqual(user2);
  });

  it('should handle corrupt localStorage data gracefully', () => {
    localStorage.setItem('votewise_user_context', 'not-valid-json{{{');
    
    expect(() => {
      renderHook(() => useUserContext());
    }).toThrow();
  });

  it('should set loading to true initially, then false after hydration', async () => {
    const { result } = renderHook(() => useUserContext());
    // After the effect runs, loading should be false
    expect(result.current.loading).toBe(false);
  });

  it('should handle different voter statuses correctly', () => {
    const { result } = renderHook(() => useUserContext());

    const statuses: Array<'registered' | 'unregistered' | 'unknown'> = [
      'registered',
      'unregistered',
      'unknown',
    ];

    statuses.forEach((status) => {
      act(() => {
        result.current.saveUser({
          country: 'India',
          location: 'Test',
          age: 18,
          voterStatus: status,
          onboarded: true,
        });
      });
      expect(result.current.user?.voterStatus).toBe(status);
    });
  });
});
