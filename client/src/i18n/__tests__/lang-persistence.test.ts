import { renderHook, act } from '@testing-library/react';
import React, { ReactNode } from 'react';
import { LanguageProvider, useLanguage, initializeLanguage, Language } from '../lang';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock document
const mockDocument = {
  documentElement: {
    lang: '',
    dir: '',
  },
  body: {
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
    }
  }
};

Object.defineProperty(global, 'document', {
  value: mockDocument,
  writable: true
});

const wrapper = ({ children }: { children: ReactNode }) => (
  React.createElement(LanguageProvider, null, children)
);

describe('Language Persistence and Direction Tests', () => {
  beforeEach(() => {
    localStorageMock.clear();
    mockDocument.documentElement.lang = '';
    mockDocument.documentElement.dir = '';
    (mockDocument.body.classList.add as jest.Mock).mockClear();
    (mockDocument.body.classList.remove as jest.Mock).mockClear();
  });

  describe('Language Persistence', () => {
    it('should persist language changes to localStorage', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      act(() => {
        result.current.setLang('en');
      });

      expect(localStorageMock.getItem('gsc-language')).toBe('en');
    });

    it('should reload persisted language from localStorage', () => {
      localStorageMock.setItem('gsc-language', 'en');
      
      const { result } = renderHook(() => useLanguage(), { wrapper });

      expect(result.current.lang).toBe('en');
      expect(result.current.dir).toBe('ltr');
    });

    it('should update HTML attributes on language change', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      act(() => {
        result.current.setLang('en');
      });

      expect(mockDocument.documentElement.lang).toBe('en');
      expect(mockDocument.documentElement.dir).toBe('ltr');
    });

    it('should update body font classes on language change', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      act(() => {
        result.current.setLang('en');
      });

      expect(mockDocument.body.classList.add).toHaveBeenCalledWith('font-inter');
      expect(mockDocument.body.classList.remove).toHaveBeenCalledWith('font-cairo');
    });

    it('should toggle between Arabic and English correctly', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      // Initially Arabic
      expect(result.current.lang).toBe('ar');
      expect(result.current.dir).toBe('rtl');

      // Toggle to English
      act(() => {
        result.current.toggleLang();
      });

      expect(result.current.lang).toBe('en');
      expect(result.current.dir).toBe('ltr');
      expect(localStorageMock.getItem('gsc-language')).toBe('en');

      // Toggle back to Arabic
      act(() => {
        result.current.toggleLang();
      });

      expect(result.current.lang).toBe('ar');
      expect(result.current.dir).toBe('rtl');
      expect(localStorageMock.getItem('gsc-language')).toBe('ar');
    });
  });

  describe('Direction Updates', () => {
    it('should correctly set RTL direction for Arabic', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      act(() => {
        result.current.setLang('ar');
      });

      expect(result.current.dir).toBe('rtl');
      expect(mockDocument.documentElement.dir).toBe('rtl');
    });

    it('should correctly set LTR direction for English', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      act(() => {
        result.current.setLang('en');
      });

      expect(result.current.dir).toBe('ltr');
      expect(mockDocument.documentElement.dir).toBe('ltr');
    });
  });

  describe('Page Reload Behavior', () => {
    it('should maintain language after simulated page reload', () => {
      // First session: set language to English
      localStorageMock.setItem('gsc-language', 'en');
      
      // Simulate page reload by creating new hook instance
      const { result: firstResult } = renderHook(() => useLanguage(), { wrapper });
      expect(firstResult.current.lang).toBe('en');
      
      // Simulate another reload
      const { result: secondResult } = renderHook(() => useLanguage(), { wrapper });
      expect(secondResult.current.lang).toBe('en');
      expect(secondResult.current.dir).toBe('ltr');
    });

    it('should initialize with Arabic when no stored preference', () => {
      localStorageMock.clear();
      
      const { result } = renderHook(() => useLanguage(), { wrapper });
      
      expect(result.current.lang).toBe('ar');
      expect(result.current.dir).toBe('rtl');
    });
  });

  describe('DOM Initialization', () => {
    it('should initialize DOM correctly with initializeLanguage', () => {
      localStorageMock.setItem('gsc-language', 'en');
      
      initializeLanguage();
      
      expect(mockDocument.documentElement.lang).toBe('en');
      expect(mockDocument.documentElement.dir).toBe('ltr');
      expect(mockDocument.body.classList.add).toHaveBeenCalledWith('font-inter');
      expect(mockDocument.body.classList.remove).toHaveBeenCalledWith('font-cairo');
    });

    it('should prevent FOUC by setting attributes before React hydration', () => {
      localStorageMock.setItem('gsc-language', 'ar');
      
      // Clear previous calls
      (mockDocument.body.classList.add as jest.Mock).mockClear();
      (mockDocument.body.classList.remove as jest.Mock).mockClear();
      
      initializeLanguage();
      
      expect(mockDocument.documentElement.lang).toBe('ar');
      expect(mockDocument.documentElement.dir).toBe('rtl');
      expect(mockDocument.body.classList.add).toHaveBeenCalledWith('font-cairo');
      expect(mockDocument.body.classList.remove).toHaveBeenCalledWith('font-inter');
    });
  });

  describe('Error Handling', () => {
    it('should handle localStorage errors gracefully', () => {
      const originalConsoleWarn = console.warn;
      console.warn = jest.fn();
      
      // Mock localStorage to throw error
      const originalSetItem = localStorageMock.setItem;
      localStorageMock.setItem = jest.fn().mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });
      
      const { result } = renderHook(() => useLanguage(), { wrapper });
      
      act(() => {
        result.current.setLang('en');
      });
      
      expect(console.warn).toHaveBeenCalledWith('Failed to save language preference:', expect.any(Error));
      
      // Restore mocks
      localStorageMock.setItem = originalSetItem;
      console.warn = originalConsoleWarn;
    });
  });

  describe('Cross-App Consistency', () => {
    it('should provide consistent language state across multiple hook instances', () => {
      const { result: result1 } = renderHook(() => useLanguage(), { wrapper });
      const { result: result2 } = renderHook(() => useLanguage(), { wrapper });
      
      act(() => {
        result1.current.setLang('en');
      });
      
      // Both instances should reflect the same state
      expect(result1.current.lang).toBe('en');
      expect(result2.current.lang).toBe('en');
      expect(result1.current.dir).toBe('ltr');
      expect(result2.current.dir).toBe('ltr');
    });
  });
});