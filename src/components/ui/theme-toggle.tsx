import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Laptop, Moon, Sun } from "lucide-react"

const themes = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Laptop, label: "System" },
] as const

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const cycleTheme = () => {
    const currentIndex = themes.findIndex((t) => t.value === theme)
    const next = themes[(currentIndex + 1) % themes.length]
    setTheme(next.value)
  }

  const CurrentIcon = themes.find((t) => t.value === theme)?.icon ?? Sun

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      aria-label={`Current theme: ${theme}. Click to switch.`}
    >
      <CurrentIcon className="h-5 w-5" />
    </Button>
  )
}