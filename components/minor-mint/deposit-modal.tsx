"use client"

import { useState } from "react"
import { X, ArrowDownLeft, Gift, Briefcase, CreditCard, Loader2, Sparkles, QrCode } from "lucide-react"

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (amount: number, source: string) => void
}

const depositSources = [
  { id: "allowance", icon: Gift, title: "Allowance", desc: "Weekly/monthly funds", color: "from-[#00FFA3] to-[#00cc82]" },
  { id: "gift", icon: Gift, title: "Gift Money", desc: "Birthday, holidays", color: "from-pink-500 to-purple-500" },
  { id: "job", icon: Briefcase, title: "Job Earnings", desc: "Part-time work", color: "from-blue-500 to-cyan-500" },
  { id: "external", icon: CreditCard, title: "External Transfer", desc: "From bank/card", color: "from-orange-500 to-yellow-500" },
]

export function DepositModal({ isOpen, onClose, onSuccess }: DepositModalProps) {
  const [amount, setAmount] = useState("")
  const [selectedSource, setSelectedSource] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const handleDeposit = async () => {
    if (!amount || !selectedSource) return
    
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) return

    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsProcessing(false)

    const source = depositSources.find((s) => s.id === selectedSource)
    onSuccess(amountNum, source?.title || "Deposit")
    setAmount("")
    setSelectedSource(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center">
      <div className="w-full max-w-md h-[90vh] bg-[#0a0a0a] rounded-t-3xl border border-[var(--glass-border)] border-b-0 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5 text-[#00FFA3]" />
            </div>
            <h3 className="font-semibold text-white text-lg">Receive Funds</h3>
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
          {showQR ? (
            // QR Code View
            <div className="flex flex-col items-center py-6">
              <div className="w-48 h-48 rounded-2xl bg-white p-4 mb-4">
                <div className="w-full h-full rounded-lg bg-black flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-white" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Scan this code to receive funds
              </p>
              <div className="px-4 py-2 rounded-full bg-[var(--glass)] border border-[var(--glass-border)]">
                <span className="text-sm font-mono text-white">@{"{username}"}</span>
              </div>
              <button
                onClick={() => setShowQR(false)}
                className="mt-6 py-3 px-6 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] text-white font-medium"
              >
                Manual Entry
              </button>
            </div>
          ) : (
            <>
              {/* Show QR Option */}
              <button
                onClick={() => setShowQR(true)}
                className="w-full py-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] border-dashed flex items-center justify-center gap-3 hover:border-[#00FFA3]/50 hover:bg-[#00FFA3]/5 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#00FFA3]/10 flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-[#00FFA3]" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-white">Show My QR Code</p>
                  <p className="text-xs text-muted-foreground">Let others scan to send you money</p>
                </div>
              </button>

              {/* Amount Input */}
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-2">Amount to receive</p>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-4xl text-muted-foreground">$</span>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="0"
                    className="bg-transparent text-5xl font-bold text-white placeholder:text-muted-foreground focus:outline-none w-40 text-center"
                  />
                </div>

                {/* Quick amounts */}
                <div className="flex justify-center gap-2 mt-4">
                  {[10, 25, 50, 100].map((val) => (
                    <button
                      key={val}
                      onClick={() => setAmount(val.toString())}
                      className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                        amount === val.toString()
                          ? "bg-[#00FFA3]/10 border-[#00FFA3]/50 text-[#00FFA3]"
                          : "bg-[var(--glass)] border-[var(--glass-border)] text-white hover:border-white/20"
                      }`}
                    >
                      ${val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Source Selection */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Source of Funds</p>
                {depositSources.map((source) => (
                  <button
                    key={source.id}
                    onClick={() => setSelectedSource(source.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                      selectedSource === source.id
                        ? "bg-[#00FFA3]/10 border-[#00FFA3]/50"
                        : "bg-[var(--glass)] border-[var(--glass-border)] hover:border-white/20"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${source.color} flex items-center justify-center`}>
                      <source.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-white">{source.title}</p>
                      <p className="text-sm text-muted-foreground">{source.desc}</p>
                    </div>
                    {selectedSource === source.id && (
                      <div className="w-6 h-6 rounded-full bg-[#00FFA3] flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-black" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!showQR && (
          <div className="p-4 border-t border-[var(--glass-border)] space-y-3">
            <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
              <Sparkles className="w-3 h-3 text-[#00FFA3]" />
              <span>Funds added instantly to your balance</span>
            </div>

            <button
              onClick={handleDeposit}
              disabled={!amount || !selectedSource || isProcessing}
              className="w-full py-4 rounded-2xl bg-[#00FFA3] text-black font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(0,255,163,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <ArrowDownLeft className="w-5 h-5" />
                  Add ${amount || "0"} to Wallet
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
