"use client"

import { Bell, Settings, Sparkles } from "lucide-react"

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#00FFA3] to-[#00cc82] flex items-center justify-center">
          <span className="text-black font-bold text-lg">M</span>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00FFA3] rounded-full animate-pulse" />
        </div>
        <div>
          <h1 className="font-semibold text-white text-sm tracking-tight">MinorMint</h1>
          <p className="text-[10px] text-muted-foreground flex items-center gap-0.5">
            <Sparkles className="w-2.5 h-2.5 text-[#00FFA3]" />
            AI Protected
          </p>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="relative w-9 h-9 rounded-full bg-[var(--glass)] border border-[var(--glass-border)] flex items-center justify-center hover:bg-white/10 transition-colors">
          <Bell className="w-4 h-4 text-white" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00FFA3] rounded-full" />
        </button>
        <button className="w-9 h-9 rounded-full bg-[var(--glass)] border border-[var(--glass-border)] flex items-center justify-center hover:bg-white/10 transition-colors">
          <Settings className="w-4 h-4 text-white" />
        </button>
      </div>
    </header>
  )
}
