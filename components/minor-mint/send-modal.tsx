"use client"

import { useState } from "react"
import { X, QrCode, User, Scan, ChevronDown, Shield, Loader2, AlertCircle } from "lucide-react"
import { useWallet } from "@/lib/wallet-store"

interface SendModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (details: { amount: string; recipient: string }) => void
}

const recentContacts = [
  { name: "Alex", avatar: "A", gradient: "from-pink-500 to-purple-500" },
  { name: "Jordan", avatar: "J", gradient: "from-blue-500 to-cyan-500" },
  { name: "Sam", avatar: "S", gradient: "from-orange-500 to-yellow-500" },
  { name: "Taylor", avatar: "T", gradient: "from-green-500 to-emerald-500" },
]

export function SendModal({ isOpen, onClose, onSuccess }: SendModalProps) {
  const { balance, send } = useWallet()
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [showScanner, setShowScanner] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [scanLine, setScanLine] = useState(0)

  // Animate scan line
  useState(() => {
    if (showScanner) {
      const interval = setInterval(() => {
        setScanLine((prev) => (prev >= 100 ? 0 : prev + 2))
      }, 30)
      return () => clearInterval(interval)
    }
  })

  const amountNum = parseFloat(amount) || 0
  const isInsufficientFunds = amountNum > balance
  const canSend = amount && recipient && amountNum > 0 && !isInsufficientFunds

  const handleSend = async () => {
    if (!canSend) return
    
    setError("")
    setIsProcessing(true)
    
    // Simulate AI Guardian verification
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    const success = send(amountNum, recipient)
    
    setIsProcessing(false)
    
    if (success) {
      onSuccess({ amount, recipient })
      setAmount("")
      setRecipient("")
    } else {
      setError("Transaction failed. Please try again.")
    }
  }

  const handleQuickSelect = (contact: typeof recentContacts[0]) => {
    setRecipient(contact.name)
  }

  const handleClose = () => {
    setAmount("")
    setRecipient("")
    setError("")
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center">
      <div className="w-full max-w-md h-[90vh] bg-[#0a0a0a] rounded-t-3xl border border-[var(--glass-border)] border-b-0 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#00FFA3] -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <h3 className="font-semibold text-white text-lg">Send Funds</h3>
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

          {/* QR Scanner Section */}
          {showScanner ? (
            <div className="space-y-4">
              <div className="relative aspect-square rounded-3xl bg-black border-2 border-[#00FFA3]/30 overflow-hidden">
                {/* Scanning animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00FFA3]" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00FFA3]" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00FFA3]" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00FFA3]" />
                    
                    {/* Scanning line */}
                    <div 
                      className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00FFA3] to-transparent"
                      style={{ 
                        top: `${scanLine}%`,
                        boxShadow: "0 0 15px #00FFA3"
                      }}
                    />
                  </div>
                </div>
                
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'linear-gradient(to right, #00FFA3 1px, transparent 1px), linear-gradient(to bottom, #00FFA3 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }} />
                </div>
                
                {/* Sample QR Code */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <QrCode className="w-32 h-32 text-white" />
                </div>
              </div>
              
              <p className="text-center text-sm text-muted-foreground">
                Point your camera at a QR code to scan
              </p>
              
              <button 
                onClick={() => setShowScanner(false)}
                className="w-full py-3 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] text-white font-medium hover:bg-white/10 transition-colors"
              >
                Enter Manually
              </button>
            </div>
          ) : (
            <>
              {/* Scan QR Button */}
              <button 
                onClick={() => setShowScanner(true)}
                className="w-full py-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] border-dashed flex items-center justify-center gap-3 hover:border-[#00FFA3]/50 hover:bg-[#00FFA3]/5 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#00FFA3]/10 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(0,255,163,0.3)] transition-shadow">
                  <QrCode className="w-6 h-6 text-[#00FFA3]" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-white">Scan QR Code</p>
                  <p className="text-xs text-muted-foreground">Quick send to any wallet</p>
                </div>
                <Scan className="w-5 h-5 text-muted-foreground ml-auto" />
              </button>
              
              {/* Recipient Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Recipient</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Username or wallet address"
                    className="w-full bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-[#00FFA3]/50 transition-colors"
                  />
                </div>
              </div>
              
              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Amount</label>
                <div className={`relative bg-[var(--glass)] border rounded-2xl p-4 ${
                  isInsufficientFunds ? "border-red-500/50" : "border-[var(--glass-border)]"
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl text-muted-foreground">$</span>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                      placeholder="0.00"
                      className="flex-1 bg-transparent text-3xl font-semibold text-white placeholder:text-muted-foreground focus:outline-none"
                    />
                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 text-[#00FFA3] text-sm font-medium">
                      USD
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--glass-border)]">
                    <span className={`text-sm ${isInsufficientFunds ? "text-red-400" : "text-muted-foreground"}`}>
                      Available: ${balance.toFixed(2)}
                    </span>
                    <button 
                      onClick={() => setAmount(balance.toFixed(2))}
                      className="text-sm text-[#00FFA3] font-medium"
                    >
                      Max
                    </button>
                  </div>
                  {isInsufficientFunds && (
                    <div className="flex items-center gap-1 mt-2 text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Insufficient funds</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Quick Amounts */}
              <div className="flex gap-2">
                {["10", "25", "50", "100"].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val)}
                    disabled={parseFloat(val) > balance}
                    className={`flex-1 py-2 rounded-xl border transition-all ${
                      amount === val
                        ? "bg-[#00FFA3]/10 border-[#00FFA3]/50 text-[#00FFA3]"
                        : parseFloat(val) > balance
                        ? "bg-[var(--glass)] border-[var(--glass-border)] text-muted-foreground/50 cursor-not-allowed"
                        : "bg-[var(--glass)] border-[var(--glass-border)] text-white hover:border-white/20"
                    }`}
                  >
                    ${val}
                  </button>
                ))}
              </div>
              
              {/* Recent Contacts */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Recent</p>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {recentContacts.map((contact) => (
                    <button 
                      key={contact.name} 
                      onClick={() => handleQuickSelect(contact)}
                      className={`flex flex-col items-center gap-2 min-w-[60px] transition-all ${
                        recipient === contact.name ? "scale-110" : ""
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${contact.gradient} flex items-center justify-center text-white font-semibold ${
                        recipient === contact.name ? "ring-2 ring-[#00FFA3] ring-offset-2 ring-offset-black" : ""
                      }`}>
                        {contact.avatar}
                      </div>
                      <span className={`text-xs ${recipient === contact.name ? "text-[#00FFA3]" : "text-muted-foreground"}`}>
                        {contact.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Footer */}
        {!showScanner && (
          <div className="p-4 border-t border-[var(--glass-border)] space-y-3">
            {/* AI Guardian notice */}
            <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
              <Shield className="w-3 h-3 text-[#00FFA3]" />
              <span>AI Guardian will verify this transaction</span>
            </div>
            
            <button
              onClick={handleSend}
              disabled={!canSend || isProcessing}
              className="w-full py-4 rounded-2xl bg-[#00FFA3] text-black font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(0,255,163,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                `Send $${amountNum.toFixed(2)}`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
