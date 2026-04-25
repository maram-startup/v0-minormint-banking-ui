"use client"

import { useState } from "react"
import { Header } from "@/components/minor-mint/header"
import { BalanceCard } from "@/components/minor-mint/balance-card"
import { ActionButtons } from "@/components/minor-mint/action-buttons"
import { Transactions } from "@/components/minor-mint/transactions"
import { BottomNav } from "@/components/minor-mint/bottom-nav"
import { AIGuardian } from "@/components/minor-mint/ai-guardian"
import { SendModal } from "@/components/minor-mint/send-modal"
import { SwapModal } from "@/components/minor-mint/swap-modal"
import { CashOutModal } from "@/components/minor-mint/cash-out-modal"

export default function MinorMintApp() {
  const [activeTab, setActiveTab] = useState("home")
  const [showAIGuardian, setShowAIGuardian] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [showSwapModal, setShowSwapModal] = useState(false)
  const [showCashOutModal, setShowCashOutModal] = useState(false)

  return (
    <main className="min-h-screen bg-black text-white max-w-md mx-auto relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00FFA3] opacity-[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-[#00FFA3] opacity-[0.02] blur-[100px] rounded-full" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 pb-24">
        <Header />
        
        <div className="px-4 space-y-6 py-4">
          {/* Balance Card */}
          <BalanceCard />
          
          {/* Action Buttons */}
          <ActionButtons 
            onSendClick={() => setShowSendModal(true)}
            onSwapClick={() => setShowSwapModal(true)}
            onCashOutClick={() => setShowCashOutModal(true)}
          />
          
          {/* Transactions */}
          <Transactions />
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onAIGuardianClick={() => setShowAIGuardian(true)}
      />
      
      {/* Modals */}
      <AIGuardian isOpen={showAIGuardian} onClose={() => setShowAIGuardian(false)} />
      <SendModal isOpen={showSendModal} onClose={() => setShowSendModal(false)} />
      <SwapModal isOpen={showSwapModal} onClose={() => setShowSwapModal(false)} />
      <CashOutModal isOpen={showCashOutModal} onClose={() => setShowCashOutModal(false)} />
    </main>
  )
}
