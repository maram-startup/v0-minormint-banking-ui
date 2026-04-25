"use client"

import { useState } from "react"
import { 
  User, Bell, Shield, Moon, HelpCircle, LogOut, ChevronRight, 
  Fingerprint, Languages, CreditCard, FileText, Star, Gift,
  CheckCircle2, X
} from "lucide-react"

interface ProfileViewProps {
  onShowNotifications: () => void
}

export function ProfileView({ onShowNotifications }: ProfileViewProps) {
  const [biometricEnabled, setBiometricEnabled] = useState(true)

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

  return (
    <div className="space-y-6 pb-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center py-4">
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00FFA3] to-[#00cc82] flex items-center justify-center">
            <span className="text-3xl font-bold text-black">AJ</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#00FFA3] border-4 border-black flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-black" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-white">Alex Johnson</h2>
        <p className="text-sm text-muted-foreground">@alexj_mint</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-3 py-1 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 text-xs font-medium text-[#00FFA3]">
            Teen Account
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground">
            Member since 2024
          </span>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] text-center">
          <p className="text-lg font-bold text-white">47</p>
          <p className="text-xs text-muted-foreground">Transactions</p>
        </div>
        <div className="p-3 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] text-center">
          <p className="text-lg font-bold text-[#00FFA3]">92%</p>
          <p className="text-xs text-muted-foreground">AI Score</p>
        </div>
        <div className="p-3 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] text-center">
          <p className="text-lg font-bold text-white">3</p>
          <p className="text-xs text-muted-foreground">Goals</p>
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
                    setBiometricEnabled(!biometricEnabled)
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
      
      {/* Logout */}
      <button className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors">
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Sign Out</span>
      </button>
      
      {/* Version */}
      <p className="text-center text-xs text-muted-foreground">
        MinorMint v1.0.0
      </p>
    </div>
  )
}
