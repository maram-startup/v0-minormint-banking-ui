"use client"

import { useState } from "react"
import { Lock, Unlock, Eye, EyeOff, Snowflake, Copy, CheckCircle2, Shield, Wifi } from "lucide-react"

export function CardsView() {
  const [showDetails, setShowDetails] = useState(false)
  const [cardFrozen, setCardFrozen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText("4532 •••• •••• 7891")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Virtual Card */}
      <div className="relative">
        <div className={`relative overflow-hidden rounded-3xl p-6 transition-all duration-500 ${
          cardFrozen 
            ? "bg-gradient-to-br from-slate-800 to-slate-900" 
            : "bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]"
        }`}>
          {/* Holographic effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00FFA3]/5 via-transparent to-[#00FFA3]/5 opacity-50" />
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#00FFA3] opacity-[0.03] blur-[60px] rounded-full" />
          
          {/* Frozen overlay */}
          {cardFrozen && (
            <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[1px] flex items-center justify-center z-10">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30">
                <Snowflake className="w-5 h-5 text-blue-400 animate-pulse" />
                <span className="text-blue-300 font-medium">Card Frozen</span>
              </div>
            </div>
          )}
          
          {/* Card content */}
          <div className="relative z-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#00FFA3] flex items-center justify-center">
                  <span className="text-black font-bold text-sm">M</span>
                </div>
                <span className="text-white font-semibold">MinorMint</span>
              </div>
              <div className="flex items-center gap-1">
                <Wifi className="w-6 h-6 text-white/60 rotate-90" />
              </div>
            </div>
            
            {/* Chip */}
            <div className="w-12 h-9 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-600 mb-6 flex items-center justify-center overflow-hidden">
              <div className="w-8 h-6 border border-yellow-700/50 rounded-sm" />
            </div>
            
            {/* Card Number */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <p className="text-xl font-mono tracking-widest text-white">
                  {showDetails ? "4532 8891 2345 7891" : "4532 •••• •••• 7891"}
                </p>
                <button onClick={handleCopy} className="p-1 hover:bg-white/10 rounded transition-colors">
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4 text-[#00FFA3]" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/60" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Details */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Card Holder</p>
                <p className="text-white font-medium">ALEX JOHNSON</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Expires</p>
                <p className="text-white font-medium">{showDetails ? "12/27" : "••/••"}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">CVV</p>
                <p className="text-white font-medium">{showDetails ? "892" : "•••"}</p>
              </div>
            </div>
          </div>
          
          {/* Card border glow */}
          <div className="absolute inset-0 rounded-3xl border border-[#00FFA3]/20" />
        </div>
        
        {/* Card type badge */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#0a0a0a] border border-[#00FFA3]/30">
          <span className="text-xs font-mono text-[#00FFA3]">VIRTUAL DEBIT</span>
        </div>
      </div>
      
      {/* Card Controls */}
      <div className="grid grid-cols-3 gap-3 pt-4">
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] hover:border-[#00FFA3]/30 transition-all"
        >
          {showDetails ? (
            <EyeOff className="w-5 h-5 text-[#00FFA3]" />
          ) : (
            <Eye className="w-5 h-5 text-[#00FFA3]" />
          )}
          <span className="text-xs text-white">{showDetails ? "Hide" : "Show"}</span>
        </button>
        
        <button 
          onClick={() => setCardFrozen(!cardFrozen)}
          className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
            cardFrozen 
              ? "bg-blue-500/10 border-blue-400/30" 
              : "bg-[var(--glass)] border-[var(--glass-border)] hover:border-[#00FFA3]/30"
          }`}
        >
          {cardFrozen ? (
            <Unlock className="w-5 h-5 text-blue-400" />
          ) : (
            <Snowflake className="w-5 h-5 text-[#00FFA3]" />
          )}
          <span className="text-xs text-white">{cardFrozen ? "Unfreeze" : "Freeze"}</span>
        </button>
        
        <button className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] hover:border-[#00FFA3]/30 transition-all">
          <Lock className="w-5 h-5 text-[#00FFA3]" />
          <span className="text-xs text-white">PIN</span>
        </button>
      </div>
      
      {/* Spending Limits */}
      <div className="space-y-4">
        <h3 className="font-semibold text-white">Spending Limits</h3>
        
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Daily Limit</span>
              <span className="text-sm font-medium text-white">$150 / $200</span>
            </div>
            <div className="h-2 rounded-full bg-black/50 overflow-hidden">
              <div className="h-full w-[75%] rounded-full bg-gradient-to-r from-[#00FFA3] to-[#00cc82]" />
            </div>
          </div>
          
          <div className="p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Monthly Limit</span>
              <span className="text-sm font-medium text-white">$450 / $1,000</span>
            </div>
            <div className="h-2 rounded-full bg-black/50 overflow-hidden">
              <div className="h-full w-[45%] rounded-full bg-gradient-to-r from-[#00FFA3] to-[#00cc82]" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Security Notice */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#00FFA3]/5 border border-[#00FFA3]/20">
        <Shield className="w-5 h-5 text-[#00FFA3] mt-0.5" />
        <div>
          <p className="text-sm font-medium text-white">AI Guardian Active</p>
          <p className="text-xs text-muted-foreground mt-1">
            Your card is protected by AI monitoring. Suspicious transactions are automatically blocked.
          </p>
        </div>
      </div>
    </div>
  )
}
