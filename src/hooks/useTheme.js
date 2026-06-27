import { useState, useCallback } from 'react'

export const useTheme = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('bibliodrop-theme') || 'bibliolight'
  )

  const toggleTheme = useCallback(() => {
    const next = theme === 'bibliolight' ? 'bibliodark' : 'bibliolight'
    setTheme(next)
    localStorage.setItem('bibliodrop-theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }, [theme])

  return { theme, toggleTheme }
}
