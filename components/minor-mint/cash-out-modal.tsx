"use client"

import { useState } from "react"
import { X, Landmark, MapPin, ChevronRight, CreditCard, Banknote, Building2 } from "lucide-react"

interface CashOutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CashOutModal({ isOpen, onClose }: CashOutModalProps) {
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState<"atm" | "bank" | "card" | null>(null)

  if (!isOpen) return null

  const methods = [
    { id: "atm" as const, icon: Banknote, title: "ATM Withdrawal", desc: "Find nearby ATMs", fee: "$0" },
    { id: "bank" as const, icon: Building2, title: "Bank Transfer", desc: "1-3 business days", fee: "Free" },
    { id: "card" as const, icon: CreditCard, title: "Debit Card", desc: "Instant to card", fee: "$1.50" },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center">
      <div className="w-full max-w-md h-[85vh] bg-[#0a0a0a] rounded-t-3xl border border-[var(--glass-border)] border-b-0 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center">
              <Landmark className="w-5 h-5 text-[#00FFA3]" />
            </div>
            <h3 className="font-semibold text-white text-lg">Cash Out</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--glass)] flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Amount Input */}
          <div className="text-center py-6">
            <p className="text-sm text-muted-foreground mb-2">Amount to withdraw</p>
            <div className="flex items-center justify-center gap-1">
              <span className="text-4xl text-muted-foreground">$</span>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                placeholder="0"
                className="bg-transparent text-5xl font-bold text-white placeholder:text-muted-foreground focus:outline-none w-40 text-center"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Available: $700.00</p>
            
            {/* Quick amounts */}
            <div className="flex justify-center gap-2 mt-4">
              {[20, 50, 100, 200].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className="px-4 py-2 rounded-full bg-[var(--glass)] border border-[var(--glass-border)] text-sm font-medium text-white hover:border-[#00FFA3]/50 hover:text-[#00FFA3] transition-colors"
                >
                  ${val}
                </button>
              ))}
            </div>
          </div>
          
          {/* Withdrawal Methods */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Withdrawal Method</p>
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  method === m.id 
                    ? "bg-[#00FFA3]/10 border-[#00FFA3]/50" 
                    : "bg-[var(--glass)] border-[var(--glass-border)] hover:border-white/20"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  method === m.id ? "bg-[#00FFA3]/20" : "bg-white/5"
                }`}>
                  <m.icon className={`w-6 h-6 ${method === m.id ? "text-[#00FFA3]" : "text-white"}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-white">{m.title}</p>
                  <p className="text-sm text-muted-foreground">{m.desc}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${m.fee === "Free" || m.fee === "$0" ? "text-[#00FFA3]" : "text-white"}`}>
                    {m.fee}
                  </p>
                  <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                </div>
              </button>
            ))}
          </div>
          
          {/* ATM Locator Preview */}
          {method === "atm" && (
            <div className="relative overflow-hidden rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] p-4">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5 text-[#00FFA3]" />
                <span className="font-medium text-white">Nearby ATMs</span>
              </div>
              <div className="space-y-2">
                {["Chase ATM - 0.2 mi", "Bank of America - 0.5 mi", "Wells Fargo - 0.8 mi"].map((atm, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--glass-border)] last:border-0">
                    <span className="text-sm text-muted-foreground">{atm}</span>
                    <button className="text-xs text-[#00FFA3] font-medium">Directions</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-[var(--glass-border)]">
          <button
            disabled={!amount || !method}
            className="w-full py-4 rounded-2xl bg-[#00FFA3] text-black font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[var(--neon-glow)] transition-all active:scale-[0.98]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
