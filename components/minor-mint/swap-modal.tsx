"use client"

import { useState } from "react"
import { X, ArrowDownUp, ChevronDown, Sparkles, Info, Loader2, Shield } from "lucide-react"

interface SwapModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (details: { from: string; to: string }) => void
}

const tokens = {
  USDC: { symbol: "USDC", name: "USD Coin", balance: 500, price: 1, color: "#2775CA" },
  SOL: { symbol: "SOL", name: "Solana", balance: 2.5, price: 150, color: "#9945FF" },
  ETH: { symbol: "ETH", name: "Ethereum", balance: 0.15, price: 3200, color: "#627EEA" },
}

type TokenKey = keyof typeof tokens

export function SwapModal({ isOpen, onClose, onSuccess }: SwapModalProps) {
  const [fromAmount, setFromAmount] = useState("100")
  const [fromToken, setFromToken] = useState<TokenKey>("USDC")
  const [toToken, setToToken] = useState<TokenKey>("SOL")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showFromTokens, setShowFromTokens] = useState(false)
  const [showToTokens, setShowToTokens] = useState(false)

  const calculateToAmount = () => {
    const fromValue = parseFloat(fromAmount || "0") * tokens[fromToken].price
    return (fromValue / tokens[toToken].price).toFixed(6)
  }

  const exchangeRate = (tokens[fromToken].price / tokens[toToken].price).toFixed(6)

  const swapTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
  }

  const handleSwap = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2500))
    setIsProcessing(false)
    onSuccess({ from: fromToken, to: toToken })
    setFromAmount("100")
  }

  const selectFromToken = (token: TokenKey) => {
    if (token === toToken) {
      setToToken(fromToken)
    }
    setFromToken(token)
    setShowFromTokens(false)
  }

  const selectToToken = (token: TokenKey) => {
    if (token === fromToken) {
      setFromToken(toToken)
    }
    setToToken(token)
    setShowToTokens(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Glassmorphism Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
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
              <div className="relative">
                <button 
                  onClick={() => setShowFromTokens(!showFromTokens)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: tokens[fromToken].color }}>
                    {fromToken[0]}
                  </div>
                  <span className="font-semibold text-white">{fromToken}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
                
                {/* From Token Dropdown */}
                {showFromTokens && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden z-10">
                    {(Object.keys(tokens) as TokenKey[]).map((token) => (
                      <button
                        key={token}
                        onClick={() => selectFromToken(token)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-white/10 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: tokens[token].color }}>
                          {token[0]}
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-white">{token}</p>
                          <p className="text-xs text-muted-foreground">{tokens[token].name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
              className="w-10 h-10 rounded-full bg-[#00FFA3] flex items-center justify-center hover:shadow-[0_0_20px_rgba(0,255,163,0.5)] transition-all hover:scale-110 active:scale-95"
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
                {calculateToAmount()}
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowToTokens(!showToTokens)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: tokens[toToken].color }}>
                    {toToken[0]}
                  </div>
                  <span className="font-semibold text-white">{toToken}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
                
                {/* To Token Dropdown */}
                {showToTokens && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden z-10">
                    {(Object.keys(tokens) as TokenKey[]).map((token) => (
                      <button
                        key={token}
                        onClick={() => selectToToken(token)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-white/10 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: tokens[token].color }}>
                          {token[0]}
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-white">{token}</p>
                          <p className="text-xs text-muted-foreground">{tokens[token].name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
            <Shield className="w-3 h-3 text-[#00FFA3]" />
            <span>AI Guardian will verify this transaction</span>
          </div>
          
          <button 
            onClick={handleSwap}
            disabled={isProcessing || !fromAmount}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00FFA3] to-[#00cc82] text-black font-semibold text-lg hover:shadow-[0_0_30px_rgba(0,255,163,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Swapping...</span>
              </>
            ) : (
              "Swap Now"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
