"use client"

import { Lock, Droplets, Shield, Zap, Sparkles } from "lucide-react"
import { useWallet } from "@/lib/wallet-store"

interface BalanceCardProps {
  onLegacyTransfer?: () => void
  gasCredit?: number
}

export function BalanceCard({ onLegacyTransfer, gasCredit = 0 }: BalanceCardProps) {
  const { balance, vaultBalance, gasFeesSaved, userProfile } = useWallet()
  const totalBalance = balance + vaultBalance
  
  const isAdult = userProfile && !userProfile.isMinor

  // Format balance parts
  const formatBalance = (amount: number) => {
    const formatted = amount.toFixed(2)
    const [dollars, cents] = formatted.split(".")
    return { dollars, cents }
  }

  const total = formatBalance(totalBalance)
  const liquid = formatBalance(balance)
  const vault = formatBalance(vaultBalance)

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a0a0a] to-[#111111] border border-[var(--glass-border)] p-6">
      {/* Glow effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00FFA3] opacity-10 blur-[80px] rounded-full" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#00FFA3] opacity-5 blur-[60px] rounded-full" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#00FFA3] flex items-center justify-center">
            <Shield className="w-4 h-4 text-black" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">Sovereign Balance</span>
        </div>
        <div className="px-2 py-1 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20">
          <span className="text-xs font-mono text-[#00FFA3]">PROTECTED</span>
        </div>
      </div>
      
      {/* Main Balance */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold tracking-tight text-white">${total.dollars}</span>
          <span className="text-xl font-medium text-muted-foreground">.{total.cents}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Total Assets</p>
      </div>

      {/* Web3 Stats Row */}
      <div className="flex items-center gap-3 mb-6">
        {/* Gas Fees Saved Counter */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#00FFA3]/5 border border-[#00FFA3]/10">
          <Zap className="w-4 h-4 text-[#00FFA3]" />
          <span className="text-xs font-mono text-[#00FFA3]">
            ${gasFeesSaved.toFixed(2)} Gas Saved
          </span>
        </div>

        {/* Gas Credit Badge */}
        {gasCredit > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono text-amber-400">
              {gasCredit.toFixed(4)} ETH Credit
            </span>
          </div>
        )}
      </div>
      
      {/* Split Assets */}
      <div className="grid grid-cols-2 gap-4">
        {/* Liquid */}
        <div className="relative overflow-hidden rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-4 h-4 text-[#00FFA3]" />
            <span className="text-xs font-medium text-muted-foreground">Liquid</span>
          </div>
          <span className="text-xl font-semibold text-white">${liquid.dollars}</span>
          <span className="text-sm text-muted-foreground">.{liquid.cents}</span>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#00FFA3] to-[#00FFA3]/30" />
        </div>
        
        {/* Vault */}
        <div className="relative overflow-hidden rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-[#00FFA3]" />
            <span className="text-xs font-medium text-muted-foreground">Vault</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold text-white">${vault.dollars}</span>
            <span className="text-sm text-muted-foreground">.{vault.cents}</span>
            <div className="w-4 h-4 rounded-full bg-[#00FFA3]/20 flex items-center justify-center">
              <Lock className="w-2.5 h-2.5 text-[#00FFA3]" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#00FFA3]/30 to-[#00FFA3]" />
        </div>
      </div>

      {/* 18+ Legacy Transfer Button */}
      {isAdult && totalBalance > 0 && onLegacyTransfer && (
        <button
          onClick={onLegacyTransfer}
          className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 border border-[#FFD700]/30 text-[#FFD700] font-medium text-sm hover:from-[#FFD700]/30 hover:to-[#FFA500]/30 transition-all flex items-center justify-center gap-2"
        >
          <span>Unlock Adult Banking Features</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFD700]/20">18+</span>
        </button>
      )}
    </div>
  )
}
