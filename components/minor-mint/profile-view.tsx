"use client"

import { useState } from "react"
import { 
  User, Bell, Shield, Moon, HelpCircle, LogOut, ChevronRight, 
  Fingerprint, Languages, CreditCard, FileText, Star, Gift,
  CheckCircle2, Lock, Trash2
} from "lucide-react"
import { useWallet } from "@/lib/wallet-store"

interface ProfileViewProps {
  onShowNotifications: () => void
}

export function ProfileView({ onShowNotifications }: ProfileViewProps) {
  const { userProfile, transactions, balance, vaultBalance, resetWallet, security, lockWallet } = useWallet()
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showSeedPhrase, setShowSeedPhrase] = useState(false)
  
  const biometricEnabled = security?.biometricsEnabled ?? false

  const initials = userProfile?.name
    ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "MM"

  const memberSince = userProfile?.createdAt
    ? new Date(userProfile.createdAt).getFullYear()
    : new Date().getFullYear()

  const menuSections = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Personal Info", action: "navigate" },
        { icon: CreditCard, label: "Linked Accounts", action: "navigate" },
        { icon: FileText, label: "Statements", action: "navigate" },
      ]
    },
    {
      title: "Security",
      items: [
        { icon: Shield, label: "AI Guardian Settings", action: "navigate", badge: "Active" },
        { icon: Fingerprint, label: "Biometric Login", action: "toggle", enabled: biometricEnabled },
        { icon: Bell, label: "Notifications", action: "navigate" },
      ]
    },
    {
      title: "Preferences",
      items: [
        { icon: Moon, label: "Appearance", action: "navigate", value: "Dark" },
        { icon: Languages, label: "Language", action: "navigate", value: "English" },
      ]
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help Center", action: "navigate" },
        { icon: Star, label: "Rate MinorMint", action: "navigate" },
        { icon: Gift, label: "Refer Friends", action: "navigate", badge: "Earn $10" },
      ]
    }
  ]

  const handleReset = () => {
    resetWallet()
    setShowResetConfirm(false)
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center py-4">
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00FFA3] to-[#00cc82] flex items-center justify-center">
            <span className="text-3xl font-bold text-black">{initials}</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#00FFA3] border-4 border-black flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-black" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-white">{userProfile?.name || "MinorMint User"}</h2>
        <p className="text-sm text-muted-foreground">@{userProfile?.username || "user"}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-3 py-1 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 text-xs font-medium text-[#00FFA3]">
            {userProfile?.isMinor ? "Teen Account" : "Adult Account"}
          </span>
          {userProfile?.isMinor && (
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Private Vault
            </span>
          )}
        </div>
        <span className="mt-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground">
          Member since {memberSince}
        </span>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] text-center">
          <p className="text-lg font-bold text-white">{transactions.length}</p>
          <p className="text-xs text-muted-foreground">Transactions</p>
        </div>
        <div className="p-3 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] text-center">
          <p className="text-lg font-bold text-[#00FFA3]">
            {transactions.length === 0 ? "0%" : Math.min(Math.round((vaultBalance / (balance + vaultBalance || 1)) * 100), 100) + "%"}
          </p>
          <p className="text-xs text-muted-foreground">Saved</p>
        </div>
        <div className="p-3 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] text-center">
          <p className="text-lg font-bold text-white">{userProfile?.age || "--"}</p>
          <p className="text-xs text-muted-foreground">Age</p>
        </div>
      </div>
      
      {/* Menu Sections */}
      {menuSections.map((section) => (
        <div key={section.title} className="space-y-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
            {section.title}
          </h3>
          <div className="rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] overflow-hidden divide-y divide-[var(--glass-border)]">
            {section.items.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.label === "Notifications") {
                    onShowNotifications()
                  } else if (item.action === "toggle") {
                    // Biometrics are set during onboarding
                  }
                }}
                className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-[#00FFA3]" />
                </div>
                <span className="flex-1 text-left font-medium text-white">{item.label}</span>
                
                {item.action === "toggle" ? (
                  <div 
                    className={`w-12 h-7 rounded-full p-1 transition-colors ${
                      item.enabled ? "bg-[#00FFA3]" : "bg-white/20"
                    }`}
                  >
                    <div 
                      className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                        item.enabled ? "translate-x-5" : ""
                      }`}
                    />
                  </div>
                ) : (
                  <>
                    {"value" in item && (
                      <span className="text-sm text-muted-foreground">{item.value}</span>
                    )}
                    {"badge" in item && (
                      <span className="px-2 py-0.5 rounded-full bg-[#00FFA3]/10 text-xs font-medium text-[#00FFA3]">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Security & Recovery */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
          Security & Recovery
        </h3>
        <div className="rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] overflow-hidden">
          <button 
            onClick={() => setShowSeedPhrase(!showSeedPhrase)}
            className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <span className="flex-1 text-left font-medium text-white">View Recovery Phrase</span>
            <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${showSeedPhrase ? "rotate-90" : ""}`} />
          </button>
          
          {showSeedPhrase && security?.seedPhrase && (
            <div className="p-4 border-t border-[var(--glass-border)]">
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-3">
                <p className="text-xs text-amber-400">Keep this phrase secret. Anyone with it can access your wallet.</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {security.seedPhrase.map((word, i) => (
                  <div key={i} className="flex items-center gap-1 p-2 rounded-lg bg-black/30 text-xs">
                    <span className="text-muted-foreground w-4">{i + 1}.</span>
                    <span className="text-white font-mono">{word}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Developer Options */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">
          Developer
        </h3>
        <button 
          onClick={() => setShowResetConfirm(true)}
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] hover:bg-white/5 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <Trash2 className="w-4 h-4 text-yellow-400" />
          </div>
          <span className="flex-1 text-left font-medium text-white">Reset Wallet (Demo)</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      
      {/* Logout */}
      <button 
        onClick={() => lockWallet()}
        className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Lock Wallet</span>
      </button>
      
      {/* Version */}
      <p className="text-center text-xs text-muted-foreground">
        MinorMint v1.0.0
      </p>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0a0a0a] rounded-3xl border border-[var(--glass-border)] p-6">
            <h3 className="text-xl font-bold text-white mb-2">Reset Wallet?</h3>
            <p className="text-muted-foreground mb-6">
              This will clear all your data including balance, transactions, and profile. This is for demo purposes only.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] text-white font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
