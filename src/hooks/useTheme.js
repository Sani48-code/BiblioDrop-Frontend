import { useState, useEffect } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('bibliodrop-theme') || 'bibliolight'
  )

  const toggleTheme = () => {
    const next = theme === 'bibliolight' ? 'bibliodark' : 'bibliolight'
    setTheme(next)
    localStorage.setItem('bibliodrop-theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return { theme, toggleTheme, isDark: theme === 'bibliodark' }
}
