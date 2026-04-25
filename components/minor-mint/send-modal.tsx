"use client"

import { useState } from "react"
import { X, QrCode, User, ArrowRight, Scan, ChevronDown } from "lucide-react"

interface SendModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SendModal({ isOpen, onClose }: SendModalProps) {
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [showScanner, setShowScanner] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center">
      <div className="w-full max-w-md h-[90vh] bg-[#0a0a0a] rounded-t-3xl border border-[var(--glass-border)] border-b-0 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-[#00FFA3] rotate-[-45deg]" />
            </div>
            <h3 className="font-semibold text-white text-lg">Send Funds</h3>
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
                    <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00FFA3] to-transparent animate-pulse" 
                      style={{ top: '50%', animation: 'scan 2s ease-in-out infinite' }}
                    />
                  </div>
                </div>
                
                {/* Camera preview placeholder */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
                
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" style={{
                    backgroundImage: 'linear-gradient(to right, #00FFA3 1px, transparent 1px), linear-gradient(to bottom, #00FFA3 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }} />
                </div>
              </div>
              
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
                <div className="w-12 h-12 rounded-xl bg-[#00FFA3]/10 flex items-center justify-center group-hover:shadow-[var(--neon-glow)] transition-shadow">
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
                <div className="relative bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl p-4">
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
                    <span className="text-sm text-muted-foreground">Available: $700.00</span>
                    <button className="text-sm text-[#00FFA3] font-medium">Max</button>
                  </div>
                </div>
              </div>
              
              {/* Recent Contacts */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Recent</p>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {['Alex', 'Jordan', 'Sam', 'Taylor'].map((name, i) => (
                    <button key={name} className="flex flex-col items-center gap-2 min-w-[60px]">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${
                        i === 0 ? 'from-pink-500 to-purple-500' :
                        i === 1 ? 'from-blue-500 to-cyan-500' :
                        i === 2 ? 'from-orange-500 to-yellow-500' :
                        'from-green-500 to-emerald-500'
                      } flex items-center justify-center text-white font-semibold`}>
                        {name[0]}
                      </div>
                      <span className="text-xs text-muted-foreground">{name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Footer */}
        {!showScanner && (
          <div className="p-4 border-t border-[var(--glass-border)]">
            <button
              disabled={!amount || !recipient}
              className="w-full py-4 rounded-2xl bg-[#00FFA3] text-black font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[var(--neon-glow)] transition-all active:scale-[0.98]"
            >
              Review Send
            </button>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes scan {
          0%, 100% { transform: translateY(-40px); }
          50% { transform: translateY(40px); }
        }
      `}</style>
    </div>
  )
}
