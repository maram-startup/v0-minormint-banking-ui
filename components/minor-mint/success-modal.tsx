"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, X, ArrowUpRight, Share2 } from "lucide-react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  type: "send" | "swap" | "cashout"
  details?: {
    amount?: string
    recipient?: string
    from?: string
    to?: string
    method?: string
  }
}

export function SuccessModal({ isOpen, onClose, type, details }: SuccessModalProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 2000)
    }
  }, [isOpen])

  if (!isOpen) return null

  const titles = {
    send: "Money Sent!",
    swap: "Swap Complete!",
    cashout: "Withdrawal Initiated!"
  }

  const messages = {
    send: `$${details?.amount || "0"} sent to ${details?.recipient || "recipient"}`,
    swap: `Successfully swapped ${details?.from || "USDC"} to ${details?.to || "SOL"}`,
    cashout: `$${details?.amount || "0"} withdrawal via ${details?.method || "Bank Transfer"}`
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: i % 2 === 0 ? "#00FFA3" : "#ffffff",
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}
      
      <div className="w-full max-w-sm bg-gradient-to-b from-[#111] to-[#0a0a0a] rounded-3xl border border-[var(--glass-border)] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--glass)] flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        
        {/* Success Icon */}
        <div className="flex flex-col items-center px-6 pb-8">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-[#00FFA3]/20 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#00FFA3] flex items-center justify-center animate-in zoom-in-50 duration-500">
                <CheckCircle2 className="w-8 h-8 text-black" />
              </div>
            </div>
            {/* Pulse rings */}
            <div className="absolute inset-0 rounded-full border-2 border-[#00FFA3] animate-ping opacity-20" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">{titles[type]}</h2>
          <p className="text-muted-foreground text-center">{messages[type]}</p>
          
          {/* Transaction ID */}
          <div className="mt-6 px-4 py-2 rounded-full bg-[var(--glass)] border border-[var(--glass-border)]">
            <span className="text-xs font-mono text-muted-foreground">TX: 0x7f8a...3e2d</span>
          </div>
          
          {/* AI Guardian Badge */}
          <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20">
            <div className="w-2 h-2 rounded-full bg-[#00FFA3] animate-pulse" />
            <span className="text-xs text-[#00FFA3]">Verified by AI Guardian</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="p-4 border-t border-[var(--glass-border)] space-y-3">
          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-[#00FFA3] text-black font-semibold text-lg hover:shadow-[var(--neon-glow)] transition-all active:scale-[0.98]"
          >
            Done
          </button>
          
          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] text-white font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              <ArrowUpRight className="w-4 h-4" />
              View Details
            </button>
            <button className="flex-1 py-3 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] text-white font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes confetti {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  )
}
