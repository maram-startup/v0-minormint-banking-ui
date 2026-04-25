"use client"

import { Home, CreditCard, Bot, TrendingUp, User } from "lucide-react"

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onAIGuardianClick: () => void
}

export function BottomNav({ activeTab, onTabChange, onAIGuardianClick }: BottomNavProps) {
  const tabs = [
    { id: "home", icon: Home, label: "Home" },
    { id: "cards", icon: CreditCard, label: "Cards" },
    { id: "ai", icon: Bot, label: "Guardian", special: true },
    { id: "invest", icon: TrendingUp, label: "Invest" },
    { id: "profile", icon: User, label: "Profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-[var(--glass-border)] px-2 pb-6 pt-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => tab.special ? onAIGuardianClick() : onTabChange(tab.id)}
            className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
              activeTab === tab.id ? "text-[#00FFA3]" : "text-muted-foreground hover:text-white"
            }`}
          >
            {tab.special ? (
              <div className="relative -mt-6 w-14 h-14 rounded-full bg-gradient-to-br from-[#00FFA3] to-[#00cc82] flex items-center justify-center shadow-[var(--neon-glow)]">
                <tab.icon className="w-6 h-6 text-black" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-[#00FFA3] rounded-full animate-pulse" />
                </div>
              </div>
            ) : (
              <tab.icon className="w-5 h-5" />
            )}
            <span className={`text-[10px] font-medium ${tab.special ? "text-[#00FFA3] -mt-1" : ""}`}>
              {tab.label}
            </span>
            {activeTab === tab.id && !tab.special && (
              <div className="absolute -bottom-0.5 w-1 h-1 bg-[#00FFA3] rounded-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
