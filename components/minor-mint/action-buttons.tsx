"use client"

import { ArrowUp, RefreshCw, Landmark } from "lucide-react"

interface ActionButtonsProps {
  onSendClick: () => void
  onSwapClick: () => void
  onCashOutClick: () => void
}

export function ActionButtons({ onSendClick, onSwapClick, onCashOutClick }: ActionButtonsProps) {
  const actions = [
    { icon: ArrowUp, label: "Send", onClick: onSendClick },
    { icon: RefreshCw, label: "Swap", onClick: onSwapClick },
    { icon: Landmark, label: "Cash Out", onClick: onCashOutClick },
  ]

  return (
    <div className="flex justify-center gap-6">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className="group flex flex-col items-center gap-2"
        >
          <div className="relative w-14 h-14 rounded-2xl bg-[#0a0a0a] border border-[var(--glass-border)] flex items-center justify-center transition-all duration-300 group-hover:border-[#00FFA3]/50 group-hover:shadow-[var(--neon-glow)] group-active:scale-95">
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-2xl bg-[#00FFA3] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20" />
            <action.icon className="w-5 h-5 text-[#00FFA3] relative z-10 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="text-xs font-medium text-muted-foreground group-hover:text-white transition-colors">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  )
}
