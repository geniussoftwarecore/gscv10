import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider, useLanguage, initializeLanguage } from '../src/i18n/lang';

// Test component to use language context
function TestComponent() {
  const { lang, dir, setLang, toggleLang } = useLanguage();
  
  return (
    <div data-testid="test-component">
      <span data-testid="current-lang">{lang}</span>
      <span data-testid="current-dir">{dir}</span>
      <button data-testid="set-english" onClick={() => setLang('en')}>
        Set English
      </button>
      <button data-testid="set-arabic" onClick={() => setLang('ar')}>
        Set Arabic
      </button>
      <button data-testid="toggle-lang" onClick={toggleLang}>
        Toggle Language
      </button>
    </div>
  );
}

function WrappedTestComponent() {
  return (
    <LanguageProvider>
      <TestComponent />
    </LanguageProvider>
  );
}

describe('Language Persistence (i18n)', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    
    // Reset document attributes
    document.documentElement.lang = '';
    document.documentElement.dir = '';
    document.body.className = '';
  });

  describe('Language Storage', () => {
    test('should persist language to localStorage', async () => {
      const user = userEvent.setup();
      render(<WrappedTestComponent />);

      // Initial state should be Arabic (default)
      expect(screen.getByTestId('current-lang')).toHaveTextContent('ar');

      // Change to English
      await user.click(screen.getByTestId('set-english'));

      // Check localStorage was updated
      expect(localStorage.getItem('gsc-language')).toBe('en');
    });

    test('should load language from localStorage on initialization', () => {
      // Set language in localStorage
      localStorage.setItem('gsc-language', 'en');

      render(<WrappedTestComponent />);

      // Should start with English from localStorage
      expect(screen.getByTestId('current-lang')).toHaveTextContent('en');
      expect(screen.getByTestId('current-dir')).toHaveTextContent('ltr');
    });

    test('should fallback to Arabic when localStorage is empty', () => {
      render(<WrappedTestComponent />);

      // Should default to Arabic
      expect(screen.getByTestId('current-lang')).toHaveTextContent('ar');
      expect(screen.getByTestId('current-dir')).toHaveTextContent('rtl');
    });

    test('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw an error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('localStorage failed');
      });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(<WrappedTestComponent />);

      expect(consoleSpy).not.toHaveBeenCalled();

      // Restore
      localStorage.setItem = originalSetItem;
      consoleSpy.mockRestore();
    });
  });

  describe('Language Toggle', () => {
    test('should toggle between Arabic and English', async () => {
      const user = userEvent.setup();
      render(<WrappedTestComponent />);

      // Start with Arabic
      expect(screen.getByTestId('current-lang')).toHaveTextContent('ar');

      // Toggle to English
      await user.click(screen.getByTestId('toggle-lang'));
      expect(screen.getByTestId('current-lang')).toHaveTextContent('en');

      // Toggle back to Arabic
      await user.click(screen.getByTestId('toggle-lang'));
      expect(screen.getByTestId('current-lang')).toHaveTextContent('ar');
    });

    test('should update direction when toggling language', async () => {
      const user = userEvent.setup();
      render(<WrappedTestComponent />);

      // Start with Arabic (RTL)
      expect(screen.getByTestId('current-dir')).toHaveTextContent('rtl');

      // Toggle to English (LTR)
      await user.click(screen.getByTestId('toggle-lang'));
      expect(screen.getByTestId('current-dir')).toHaveTextContent('ltr');
    });
  });

  describe('Document Updates', () => {
    test('should update document attributes when language changes', async () => {
      const user = userEvent.setup();
      render(<WrappedTestComponent />);

      // Change to English
      await user.click(screen.getByTestId('set-english'));

      await waitFor(() => {
        expect(document.documentElement.lang).toBe('en');
        expect(document.documentElement.dir).toBe('ltr');
      });
    });

    test('should update body font classes when language changes', async () => {
      const user = userEvent.setup();
      render(<WrappedTestComponent />);

      // Start with Arabic - should have font-cairo
      await waitFor(() => {
        expect(document.body).toHaveClass('font-cairo');
        expect(document.body).not.toHaveClass('font-inter');
      });

      // Change to English - should have font-inter
      await user.click(screen.getByTestId('set-english'));

      await waitFor(() => {
        expect(document.body).toHaveClass('font-inter');
        expect(document.body).not.toHaveClass('font-cairo');
      });
    });

    test('initializeLanguage should set document attributes immediately', () => {
      localStorage.setItem('gsc-language', 'en');

      initializeLanguage();

      expect(document.documentElement.lang).toBe('en');
      expect(document.documentElement.dir).toBe('ltr');
      expect(document.body).toHaveClass('font-inter');
    });
  });

  describe('Error Handling', () => {
    test('should throw error when useLanguage is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useLanguage must be used within a LanguageProvider');

      consoleSpy.mockRestore();
    });

    test('should handle invalid localStorage values', () => {
      localStorage.setItem('gsc-language', 'invalid');

      render(<WrappedTestComponent />);

      // Should fallback to Arabic
      expect(screen.getByTestId('current-lang')).toHaveTextContent('ar');
    });
  });
});