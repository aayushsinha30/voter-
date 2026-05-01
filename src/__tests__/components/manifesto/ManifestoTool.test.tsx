/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ManifestoTool } from '@/components/manifesto/ManifestoTool';

jest.mock('@/ai/flows/manifesto-summarizer-flow', () => ({
  summarizeManifesto: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

import { summarizeManifesto } from '@/ai/flows/manifesto-summarizer-flow';
const mockSummarize = summarizeManifesto as jest.MockedFunction<typeof summarizeManifesto>;

describe('ManifestoTool', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('should render the Manifesto Decoder title', () => {
    render(<ManifestoTool />);
    expect(screen.getByText('Manifesto Decoder')).toBeInTheDocument();
  });

  it('should render textarea for manifesto input', () => {
    render(<ManifestoTool />);
    expect(screen.getByPlaceholderText(/manifesto/i)).toBeInTheDocument();
  });

  it('should show character count', () => {
    render(<ManifestoTool />);
    expect(screen.getByText('0 characters')).toBeInTheDocument();
  });

  it('should update character count on input', () => {
    render(<ManifestoTool />);
    const textarea = screen.getByPlaceholderText(/manifesto/i);
    fireEvent.change(textarea, { target: { value: 'Hello World' } });
    expect(screen.getByText('11 characters')).toBeInTheDocument();
  });

  it('should disable button when text is too short', () => {
    render(<ManifestoTool />);
    const btn = screen.getByText('Generate Neutral Summary').closest('button');
    expect(btn).toBeDisabled();
  });

  it('should enable button with sufficient text', () => {
    render(<ManifestoTool />);
    const textarea = screen.getByPlaceholderText(/manifesto/i);
    fireEvent.change(textarea, { target: { value: 'A long enough manifesto text for testing purposes here.' } });
    const btn = screen.getByText('Generate Neutral Summary').closest('button');
    expect(btn).not.toBeDisabled();
  });

  it('should call AI on submit', async () => {
    mockSummarize.mockResolvedValue({ summary: 'Key points summarized.' });
    render(<ManifestoTool />);
    const textarea = screen.getByPlaceholderText(/manifesto/i);
    fireEvent.change(textarea, { target: { value: 'A long manifesto text about policies and governance.' } });
    fireEvent.click(screen.getByText('Generate Neutral Summary'));
    expect(mockSummarize).toHaveBeenCalled();
  });

  it('should display summary after AI responds', async () => {
    mockSummarize.mockResolvedValue({ summary: 'The manifesto covers education reform.' });
    render(<ManifestoTool />);
    fireEvent.change(screen.getByPlaceholderText(/manifesto/i), {
      target: { value: 'A long manifesto text about education reform and policy.' },
    });
    fireEvent.click(screen.getByText('Generate Neutral Summary'));
    const summary = await screen.findByText(/education reform/i);
    expect(summary).toBeInTheDocument();
  });
});
