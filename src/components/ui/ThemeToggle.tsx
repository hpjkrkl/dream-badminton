'use client'

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/Button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="glass-primary" size="icon" disabled>
        <div className="w-4 h-4 rounded-full bg-white/20 animate-pulse" />
      </Button>
    )
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant="glass-primary"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden group"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Sun Icon */}
      <Sun
        className={`w-4 h-4 transition-all duration-500 transform ${
          theme === 'dark'
            ? 'scale-0 rotate-90 opacity-0'
            : 'scale-100 rotate-0 opacity-100'
        }`}
      />
      
      {/* Moon Icon */}
      <Moon
        className={`w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 transform ${
          theme === 'dark'
            ? 'scale-100 rotate-0 opacity-100'
            : 'scale-0 -rotate-90 opacity-0'
        }`}
      />
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-100 transition-transform duration-200" />
    </Button>
  )
}

export function ThemeToggleCompact() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-white/20 animate-pulse" />
      </button>
    )
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Sun Icon */}
      <Sun
        className={`w-4 h-4 text-white transition-all duration-500 transform ${
          theme === 'dark'
            ? 'scale-0 rotate-90 opacity-0'
            : 'scale-100 rotate-0 opacity-100'
        }`}
      />
      
      {/* Moon Icon */}
      <Moon
        className={`w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 transform ${
          theme === 'dark'
            ? 'scale-100 rotate-0 opacity-100'
            : 'scale-0 -rotate-90 opacity-0'
        }`}
      />
    </button>
  )
}