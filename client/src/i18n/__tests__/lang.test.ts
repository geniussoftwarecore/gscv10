import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
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
  <LanguageProvider>{children}</LanguageProvider>
);

describe('Language Management System', () => {
  beforeEach(() => {
    localStorageMock.clear();
    mockDocument.documentElement.lang = '';
    mockDocument.documentElement.dir = '';
    (mockDocument.body.classList.add as jest.Mock).mockClear();
    (mockDocument.body.classList.remove as jest.Mock).mockClear();
  });

  describe('useLanguage hook', () => {
    it('should default to Arabic language with RTL direction', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      expect(result.current.lang).toBe('ar');
      expect(result.current.dir).toBe('rtl');
    });

    it('should toggle language from Arabic to English', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      act(() => {
        result.current.toggleLang();
      });

      expect(result.current.lang).toBe('en');
      expect(result.current.dir).toBe('ltr');
    });

    it('should set specific language', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      act(() => {
        result.current.setLang('en');
      });

      expect(result.current.lang).toBe('en');
      expect(result.current.dir).toBe('ltr');
    });

    it('should not change state when setting same language', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });
      const initialLang = result.current.lang;

      act(() => {
        result.current.setLang('ar'); // Same as default
      });

      expect(result.current.lang).toBe(initialLang);
    });
  });

  describe('Language Persistence', () => {
    it('should persist language to localStorage', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      act(() => {
        result.current.setLang('en');
      });

      expect(localStorageMock.getItem('gsc-language')).toBe('en');
    });

    it('should restore language from localStorage', () => {
      localStorageMock.setItem('gsc-language', 'en');

      const { result } = renderHook(() => useLanguage(), { wrapper });

      expect(result.current.lang).toBe('en');
      expect(result.current.dir).toBe('ltr');
    });

    it('should handle invalid localStorage values gracefully', () => {
      localStorageMock.setItem('gsc-language', 'invalid' as Language);

      const { result } = renderHook(() => useLanguage(), { wrapper });

      expect(result.current.lang).toBe('ar'); // Should fallback to default
    });

    it('should handle localStorage errors gracefully', () => {
      const originalGetItem = localStorageMock.getItem;
      localStorageMock.getItem = () => {
        throw new Error('localStorage error');
      };

      const { result } = renderHook(() => useLanguage(), { wrapper });

      expect(result.current.lang).toBe('ar'); // Should fallback to default

      localStorageMock.getItem = originalGetItem;
    });
  });

  describe('Document Updates', () => {
    it('should update document attributes when language changes', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      act(() => {
        result.current.setLang('en');
      });

      expect(mockDocument.documentElement.lang).toBe('en');
      expect(mockDocument.documentElement.dir).toBe('ltr');
    });

    it('should update body font classes when language changes', () => {
      const { result } = renderHook(() => useLanguage(), { wrapper });

      // Initial Arabic state
      expect(mockDocument.body.classList.add).toHaveBeenCalledWith('font-cairo');
      expect(mockDocument.body.classList.remove).toHaveBeenCalledWith('font-inter');

      act(() => {
        result.current.setLang('en');
      });

      expect(mockDocument.body.classList.add).toHaveBeenCalledWith('font-inter');
      expect(mockDocument.body.classList.remove).toHaveBeenCalledWith('font-cairo');
    });
  });

  describe('initializeLanguage function', () => {
    it('should initialize language from localStorage', () => {
      localStorageMock.setItem('gsc-language', 'en');

      initializeLanguage();

      expect(mockDocument.documentElement.lang).toBe('en');
      expect(mockDocument.documentElement.dir).toBe('ltr');
    });

    it('should initialize with default Arabic when no stored language', () => {
      initializeLanguage();

      expect(mockDocument.documentElement.lang).toBe('ar');
      expect(mockDocument.documentElement.dir).toBe('rtl');
    });
  });

  describe('Edge Cases', () => {
    it('should work in server-side rendering environment', () => {
      const originalWindow = global.window;
      delete (global as any).window;

      expect(() => {
        initializeLanguage();
      }).not.toThrow();

      global.window = originalWindow;
    });

    it('should throw error when useLanguage used outside provider', () => {
      const { result } = renderHook(() => useLanguage());

      expect(result.error).toBeDefined();
      expect(result.error?.message).toContain('must be used within a LanguageProvider');
    });
  });
});