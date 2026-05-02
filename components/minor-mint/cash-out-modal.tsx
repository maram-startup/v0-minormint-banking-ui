"use client"

import { useState } from "react"
import { X, Landmark, MapPin, CreditCard, Banknote, Building2, Loader2, Shield, Navigation, AlertCircle } from "lucide-react"
import { useWallet } from "@/lib/wallet-store"

interface CashOutModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (details: { amount: string; method: string }) => void
}

const methods = [
  { id: "atm" as const, icon: Banknote, title: "ATM Withdrawal", desc: "Find nearby ATMs", fee: "$0" },
  { id: "bank" as const, icon: Building2, title: "Bank Transfer", desc: "1-3 business days", fee: "Free" },
  { id: "card" as const, icon: CreditCard, title: "Debit Card", desc: "Instant to card", fee: "$1.50" },
]

const nearbyATMs = [
  { name: "Chase ATM", distance: "0.2 mi", address: "123 Main St" },
  { name: "Bank of America", distance: "0.5 mi", address: "456 Oak Ave" },
  { name: "Wells Fargo", distance: "0.8 mi", address: "789 Pine Blvd" },
]

export function CashOutModal({ isOpen, onClose, onSuccess }: CashOutModalProps) {
  const { balance, cashOut: performCashOut } = useWallet()
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState<"atm" | "bank" | "card" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  const amountNum = parseFloat(amount) || 0
  const isInsufficientFunds = amountNum > balance
  const canCashOut = amount && method && amountNum > 0 && !isInsufficientFunds

  const handleCashOut = async () => {
    if (!canCashOut) return
    
    setError("")
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    const methodTitle = methods.find(m => m.id === method)?.title || ""
    const success = performCashOut(amountNum, methodTitle)
    
    setIsProcessing(false)
    
    if (success) {
      onSuccess({ amount, method: methodTitle })
      setAmount("")
      setMethod(null)
    } else {
      setError("Cash out failed. Please try again.")
    }
  }

  const handleClose = () => {
    setAmount("")
    setMethod(null)
    setError("")
    onClose()
  }

  if (!isOpen) return null

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
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[var(--glass)] flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

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
            <p className={`text-sm mt-2 ${isInsufficientFunds ? "text-red-400" : "text-muted-foreground"}`}>
              Available: ${balance.toFixed(2)}
            </p>
            {isInsufficientFunds && (
              <p className="text-sm text-red-400 flex items-center justify-center gap-1 mt-1">
                <AlertCircle className="w-4 h-4" />
                Insufficient funds
              </p>
            )}
            
            {/* Quick amounts */}
            <div className="flex justify-center gap-2 mt-4">
              {[20, 50, 100, 200].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  disabled={val > balance}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                    amount === val.toString()
                      ? "bg-[#00FFA3]/10 border-[#00FFA3]/50 text-[#00FFA3]"
                      : val > balance
                      ? "bg-[var(--glass)] border-[var(--glass-border)] text-muted-foreground/50 cursor-not-allowed"
                      : "bg-[var(--glass)] border-[var(--glass-border)] text-white hover:border-white/20"
                  }`}
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
                </div>
              </button>
            ))}
          </div>
          
          {/* ATM Locator Preview */}
          {method === "atm" && (
            <div className="relative overflow-hidden rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)]">
              <div className="flex items-center gap-3 p-4 border-b border-[var(--glass-border)]">
                <MapPin className="w-5 h-5 text-[#00FFA3]" />
                <span className="font-medium text-white">Nearby ATMs</span>
              </div>
              <div className="divide-y divide-[var(--glass-border)]">
                {nearbyATMs.map((atm, i) => (
                  <button 
                    key={i} 
                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="text-left">
                      <p className="font-medium text-white">{atm.name}</p>
                      <p className="text-sm text-muted-foreground">{atm.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{atm.distance}</span>
                      <div className="w-8 h-8 rounded-full bg-[#00FFA3]/10 flex items-center justify-center">
                        <Navigation className="w-4 h-4 text-[#00FFA3]" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Bank Account Preview */}
          {method === "bank" && (
            <div className="p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)]">
              <div className="flex items-center gap-3 mb-3">
                <Building2 className="w-5 h-5 text-[#00FFA3]" />
                <span className="font-medium text-white">Linked Bank</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="font-bold text-blue-400">C</span>
                </div>
                <div>
                  <p className="font-medium text-white">Chase Checking</p>
                  <p className="text-sm text-muted-foreground">****4521</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Card Preview */}
          {method === "card" && (
            <div className="p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)]">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="w-5 h-5 text-[#00FFA3]" />
                <span className="font-medium text-white">Linked Card</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00FFA3] to-[#00cc82] flex items-center justify-center">
                  <span className="font-bold text-black">M</span>
                </div>
                <div>
                  <p className="font-medium text-white">MinorMint Debit</p>
                  <p className="text-sm text-muted-foreground">****7891</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-[var(--glass-border)] space-y-3">
          <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
            <Shield className="w-3 h-3 text-[#00FFA3]" />
            <span>AI Guardian will verify this transaction</span>
          </div>
          
          <button
            onClick={handleCashOut}
            disabled={!canCashOut || isProcessing}
            className="w-full py-4 rounded-2xl bg-[#00FFA3] text-black font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(0,255,163,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              `Withdraw $${amountNum.toFixed(2)}`
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
