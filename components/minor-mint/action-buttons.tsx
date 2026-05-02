"use client"

import { ArrowUp, ArrowDown, RefreshCw, Landmark } from "lucide-react"

interface ActionButtonsProps {
  onSendClick: () => void
  onSwapClick: () => void
  onCashOutClick: () => void
  onDepositClick: () => void
}

export function ActionButtons({ onSendClick, onSwapClick, onCashOutClick, onDepositClick }: ActionButtonsProps) {
  const actions = [
    { icon: ArrowDown, label: "Receive", onClick: onDepositClick, highlight: true },
    { icon: ArrowUp, label: "Send", onClick: onSendClick },
    { icon: RefreshCw, label: "Swap", onClick: onSwapClick },
    { icon: Landmark, label: "Cash Out", onClick: onCashOutClick },
  ]

  return (
    <div className="flex justify-center gap-4">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className="group flex flex-col items-center gap-2"
        >
          <div className={`relative w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 group-hover:shadow-[var(--neon-glow)] group-active:scale-95 ${
            action.highlight 
              ? "bg-[#00FFA3] border-[#00FFA3] group-hover:shadow-[0_0_30px_rgba(0,255,163,0.6)]" 
              : "bg-[#0a0a0a] border-[var(--glass-border)] group-hover:border-[#00FFA3]/50"
          }`}>
            {/* Glow effect on hover */}
            <div className="absolute inset-0 rounded-2xl bg-[#00FFA3] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20" />
            <action.icon className={`w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110 ${
              action.highlight ? "text-black" : "text-[#00FFA3]"
            }`} />
          </div>
          <span className={`text-xs font-medium transition-colors ${
            action.highlight ? "text-[#00FFA3]" : "text-muted-foreground group-hover:text-white"
          }`}>
            {action.label}
          </span>
        </button>
      ))}
    </div>
  )
}
