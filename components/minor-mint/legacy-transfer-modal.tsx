"use client"

import { useState } from "react"
import { X, Building2, Link2, Sparkles, ArrowRight, Shield, CheckCircle2, Loader2, Cake, Crown } from "lucide-react"

interface LegacyTransferModalProps {
  isOpen: boolean
  onClose: () => void
  balance: number
}

export function LegacyTransferModal({ isOpen, onClose, balance }: LegacyTransferModalProps) {
  const [selectedOption, setSelectedOption] = useState<"export" | "connect" | null>(null)
  const [step, setStep] = useState<"select" | "processing" | "success">("select")

  const handleContinue = async () => {
    if (!selectedOption) return
    
    setStep("processing")
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setStep("success")
  }

  const handleDone = () => {
    setStep("select")
    setSelectedOption(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Background celebration effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00FFA3] opacity-[0.05] blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#FFD700] opacity-[0.05] blur-[100px] rounded-full animate-pulse" />
      </div>

      <div className="relative w-full max-w-md bg-gradient-to-b from-[#111] to-[#0a0a0a] rounded-3xl border border-[var(--glass-border)] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--glass)] flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {step === "select" && (
          <div className="px-6 pb-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
                  <Cake className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#00FFA3] flex items-center justify-center">
                  <Crown className="w-4 h-4 text-black" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome to Adulthood!
              </h2>
              <p className="text-muted-foreground">
                You&apos;re now 18+. It&apos;s time to unlock your full financial potential.
              </p>
            </div>

            {/* Balance Display */}
            <div className="p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your MinorMint Balance</p>
                  <p className="text-2xl font-bold text-white">${balance.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#00FFA3]/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#00FFA3]" />
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              <p className="text-sm font-medium text-muted-foreground">Choose your path</p>
              
              <button
                onClick={() => setSelectedOption("export")}
                className={`w-full p-4 rounded-2xl border transition-all text-left ${
                  selectedOption === "export"
                    ? "bg-[#00FFA3]/10 border-[#00FFA3]/50"
                    : "bg-[var(--glass)] border-[var(--glass-border)] hover:border-white/20"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedOption === "export" ? "bg-[#00FFA3]/20" : "bg-white/5"
                  }`}>
                    <Building2 className={`w-6 h-6 ${selectedOption === "export" ? "text-[#00FFA3]" : "text-white"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">Export to Traditional Bank</h3>
                    <p className="text-sm text-muted-foreground">
                      Transfer your balance to your existing bank account. Takes 1-3 business days.
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setSelectedOption("connect")}
                className={`w-full p-4 rounded-2xl border transition-all text-left ${
                  selectedOption === "connect"
                    ? "bg-[#00FFA3]/10 border-[#00FFA3]/50"
                    : "bg-[var(--glass)] border-[var(--glass-border)] hover:border-white/20"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedOption === "connect" ? "bg-[#00FFA3]/20" : "bg-white/5"
                  }`}>
                    <Link2 className={`w-6 h-6 ${selectedOption === "connect" ? "text-[#00FFA3]" : "text-white"}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">Connect Personal Bank Account</h3>
                    <p className="text-sm text-muted-foreground">
                      Upgrade to full adult banking with advanced features, investments, and more.
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <Sparkles className="w-3 h-3 text-[#FFD700]" />
                      <span className="text-xs text-[#FFD700]">Recommended</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!selectedOption}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00FFA3] to-[#00cc82] text-black font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(0,255,163,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === "processing" && (
          <div className="px-6 pb-8">
            <div className="flex flex-col items-center py-12">
              <div className="w-20 h-20 rounded-full bg-[#00FFA3]/20 flex items-center justify-center mb-6">
                <Loader2 className="w-10 h-10 text-[#00FFA3] animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                {selectedOption === "export" ? "Initiating Transfer..." : "Connecting Account..."}
              </h2>
              <p className="text-muted-foreground text-center">
                {selectedOption === "export"
                  ? "We're preparing your funds for transfer"
                  : "Setting up your upgraded adult banking suite"}
              </p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="px-6 pb-8">
            <div className="flex flex-col items-center py-8">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-[#00FFA3]/20 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#00FFA3] flex items-center justify-center animate-in zoom-in-50 duration-500">
                    <CheckCircle2 className="w-8 h-8 text-black" />
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-[#00FFA3] animate-ping opacity-20" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                {selectedOption === "export" ? "Transfer Initiated!" : "Account Connected!"}
              </h2>
              <p className="text-muted-foreground text-center mb-6">
                {selectedOption === "export"
                  ? `$${balance.toFixed(2)} will arrive in your bank within 1-3 business days`
                  : "Your MinorMint wallet is now upgraded to a full adult banking suite"}
              </p>

              {selectedOption === "connect" && (
                <div className="w-full p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] mb-6">
                  <h3 className="font-medium text-white mb-2">New Features Unlocked:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00FFA3]" />
                      Investment portfolios & stocks
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00FFA3]" />
                      Credit building tools
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00FFA3]" />
                      Higher transaction limits
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00FFA3]" />
                      Direct deposit support
                    </li>
                  </ul>
                </div>
              )}

              <button
                onClick={handleDone}
                className="w-full py-4 rounded-2xl bg-[#00FFA3] text-black font-semibold text-lg hover:shadow-[var(--neon-glow)] transition-all active:scale-[0.98]"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
