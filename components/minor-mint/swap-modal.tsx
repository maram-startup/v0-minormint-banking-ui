"use client"

import { useState } from "react"
import { X, ArrowDownUp, ChevronDown, Sparkles, Info } from "lucide-react"

interface SwapModalProps {
  isOpen: boolean
  onClose: () => void
}

const tokens = {
  USDC: { symbol: "USDC", name: "USD Coin", balance: 500, icon: "💵", color: "#2775CA" },
  SOL: { symbol: "SOL", name: "Solana", balance: 2.5, icon: "◎", color: "#9945FF" },
  ETH: { symbol: "ETH", name: "Ethereum", balance: 0.15, icon: "⟠", color: "#627EEA" },
}

export function SwapModal({ isOpen, onClose }: SwapModalProps) {
  const [fromAmount, setFromAmount] = useState("100")
  const [fromToken, setFromToken] = useState<keyof typeof tokens>("USDC")
  const [toToken, setToToken] = useState<keyof typeof tokens>("SOL")

  const exchangeRate = fromToken === "USDC" ? 0.0067 : 150
  const toAmount = (parseFloat(fromAmount || "0") * exchangeRate).toFixed(4)

  const swapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Glassmorphism Modal */}
      <div className="w-full max-w-md bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#00FFA3]/10 via-transparent to-[#9945FF]/10 pointer-events-none" />
        
        {/* Header */}
        <div className="relative flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00FFA3] to-[#9945FF] flex items-center justify-center">
              <ArrowDownUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">Swap Assets</h3>
              <p className="text-xs text-muted-foreground">Instant exchange</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
        
        {/* Content */}
        <div className="relative p-4 space-y-3">
          {/* From Token */}
          <div className="relative bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">You pay</span>
              <span className="text-sm text-muted-foreground">
                Balance: {tokens[fromToken].balance} {fromToken}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                className="flex-1 bg-transparent text-3xl font-semibold text-white placeholder:text-muted-foreground focus:outline-none"
                placeholder="0"
              />
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-colors">
                <span className="text-lg">{tokens[fromToken].icon}</span>
                <span className="font-semibold text-white">{fromToken}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <button 
              onClick={() => setFromAmount(tokens[fromToken].balance.toString())}
              className="mt-2 text-xs text-[#00FFA3] font-medium hover:underline"
            >
              Use Max
            </button>
          </div>
          
          {/* Swap Button */}
          <div className="flex justify-center -my-1 relative z-10">
            <button 
              onClick={swapTokens}
              className="w-10 h-10 rounded-full bg-[#00FFA3] flex items-center justify-center hover:shadow-[var(--neon-glow)] transition-all hover:scale-110 active:scale-95"
            >
              <ArrowDownUp className="w-5 h-5 text-black" />
            </button>
          </div>
          
          {/* To Token */}
          <div className="relative bg-black/40 backdrop-blur-sm rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">You receive</span>
              <span className="text-sm text-muted-foreground">
                Balance: {tokens[toToken].balance} {toToken}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 text-3xl font-semibold text-white">
                {toAmount}
              </div>
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-colors">
                <span className="text-lg">{tokens[toToken].icon}</span>
                <span className="font-semibold text-white">{toToken}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
          
          {/* Exchange Info */}
          <div className="bg-white/5 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#00FFA3]" />
                Rate
              </span>
              <span className="text-white font-mono">
                1 {fromToken} = {exchangeRate} {toToken}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1">
                <Info className="w-3 h-3" />
                Network Fee
              </span>
              <span className="text-white">~$0.02</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Slippage</span>
              <span className="text-[#00FFA3]">0.5%</span>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00FFA3] to-[#00cc82] text-black font-semibold text-lg hover:shadow-[var(--neon-glow-strong)] transition-all active:scale-[0.98]">
            Swap Now
          </button>
          <p className="text-center text-xs text-muted-foreground mt-3">
            AI Guardian will verify this transaction
          </p>
        </div>
      </div>
    </div>
  )
}
