"use client"

import { useState } from "react"
import { Bell, Settings, Sparkles, X, Moon, Sun, Globe, Shield, ChevronRight } from "lucide-react"

interface HeaderProps {
  onNotificationsClick: () => void
}

export function Header({ onNotificationsClick }: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#00FFA3] to-[#00cc82] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,163,0.3)]">
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
          <button 
            onClick={onNotificationsClick}
            className="relative w-9 h-9 rounded-full bg-[var(--glass)] border border-[var(--glass-border)] flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Bell className="w-4 h-4 text-white" />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00FFA3] rounded-full" />
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="w-9 h-9 rounded-full bg-[var(--glass)] border border-[var(--glass-border)] flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Settings className="w-4 h-4 text-white" />
          </button>
        </div>
      </header>
      
      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center">
          <div className="w-full max-w-md bg-[#0a0a0a] rounded-t-3xl border border-[var(--glass-border)] border-b-0 overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
              <h3 className="font-semibold text-white text-lg">Quick Settings</h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="w-8 h-8 rounded-full bg-[var(--glass)] flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            {/* Settings List */}
            <div className="p-4 space-y-2">
              <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Moon className="w-5 h-5 text-[#00FFA3]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-white">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Always on</p>
                </div>
                <div className="w-12 h-7 rounded-full p-1 bg-[#00FFA3]">
                  <div className="w-5 h-5 rounded-full bg-white shadow-sm translate-x-5" />
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-[#00FFA3]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-white">Language</p>
                  <p className="text-xs text-muted-foreground">English (US)</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              
              <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#00FFA3]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-white">AI Guardian Level</p>
                  <p className="text-xs text-muted-foreground">Protective</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-[var(--glass-border)]">
              <button 
                onClick={() => setShowSettings(false)}
                className="w-full py-3 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] text-white font-medium hover:bg-white/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
