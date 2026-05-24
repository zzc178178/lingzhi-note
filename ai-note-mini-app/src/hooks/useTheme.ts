import { useState, useEffect, useCallback, createContext, useContext } from 'react'
import Taro from '@tarojs/taro'
import { isH5 } from '../utils/platform'

type ThemeMode = 'light' | 'dark'

interface ThemeContextValue {
  theme: ThemeMode
  isDark: boolean
  toggleTheme: () => void
  setTheme: (theme: ThemeMode) => void
}

const THEME_KEY = 'ai_note_theme'

function getStoredTheme(): ThemeMode {
  try {
    if (isH5()) {
      const stored = localStorage.getItem(THEME_KEY)
      if (stored === 'dark' || stored === 'light') return stored
    } else {
      const stored = Taro.getStorageSync(THEME_KEY)
      if (stored === 'dark' || stored === 'light') return stored
    }
  } catch {
    // fallback to light
  }
  return 'light'
}

function storeTheme(theme: ThemeMode): void {
  try {
    if (isH5()) {
      localStorage.setItem(THEME_KEY, theme)
    } else {
      Taro.setStorageSync(THEME_KEY, theme)
    }
  } catch {
    // ignore
  }
}

function applyThemeAttribute(theme: ThemeMode): void {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('data-theme', theme)
  }
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {}
})

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}

export function useThemeProvider(): ThemeContextValue {
  const [theme, setThemeState] = useState<ThemeMode>('light')

  useEffect(() => {
    const stored = getStoredTheme()
    setThemeState(stored)
    applyThemeAttribute(stored)
  }, [])

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode)
    storeTheme(mode)
    applyThemeAttribute(mode)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: ThemeMode = prev === 'light' ? 'dark' : 'light'
      storeTheme(next)
      applyThemeAttribute(next)
      return next
    })
  }, [])

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme
  }
}