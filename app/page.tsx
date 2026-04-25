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
import { SuccessModal } from "@/components/minor-mint/success-modal"
import { CardsView } from "@/components/minor-mint/cards-view"
import { InvestView } from "@/components/minor-mint/invest-view"
import { ProfileView } from "@/components/minor-mint/profile-view"
import { NotificationsModal } from "@/components/minor-mint/notifications-modal"

type SuccessType = "send" | "swap" | "cashout"

interface SuccessDetails {
  amount?: string
  recipient?: string
  from?: string
  to?: string
  method?: string
}

export default function MinorMintApp() {
  const [activeTab, setActiveTab] = useState("home")
  const [showAIGuardian, setShowAIGuardian] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [showSwapModal, setShowSwapModal] = useState(false)
  const [showCashOutModal, setShowCashOutModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  
  // Success modal state
  const [showSuccess, setShowSuccess] = useState(false)
  const [successType, setSuccessType] = useState<SuccessType>("send")
  const [successDetails, setSuccessDetails] = useState<SuccessDetails>({})

  const handleSendSuccess = (details: { amount: string; recipient: string }) => {
    setShowSendModal(false)
    setSuccessType("send")
    setSuccessDetails(details)
    setShowSuccess(true)
  }

  const handleSwapSuccess = (details: { from: string; to: string }) => {
    setShowSwapModal(false)
    setSuccessType("swap")
    setSuccessDetails(details)
    setShowSuccess(true)
  }

  const handleCashOutSuccess = (details: { amount: string; method: string }) => {
    setShowCashOutModal(false)
    setSuccessType("cashout")
    setSuccessDetails(details)
    setShowSuccess(true)
  }

  const renderContent = () => {
    switch (activeTab) {
      case "cards":
        return <CardsView />
      case "invest":
        return <InvestView />
      case "profile":
        return <ProfileView onShowNotifications={() => setShowNotifications(true)} />
      default:
        return (
          <>
            <BalanceCard />
            <ActionButtons 
              onSendClick={() => setShowSendModal(true)}
              onSwapClick={() => setShowSwapModal(true)}
              onCashOutClick={() => setShowCashOutModal(true)}
            />
            <Transactions />
          </>
        )
    }
  }

  return (
    <main className="min-h-screen bg-black text-white max-w-md mx-auto relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00FFA3] opacity-[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-[#00FFA3] opacity-[0.02] blur-[100px] rounded-full" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 pb-24">
        <Header onNotificationsClick={() => setShowNotifications(true)} />
        
        <div className="px-4 space-y-6 py-4">
          {renderContent()}
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
      <SendModal 
        isOpen={showSendModal} 
        onClose={() => setShowSendModal(false)} 
        onSuccess={handleSendSuccess}
      />
      <SwapModal 
        isOpen={showSwapModal} 
        onClose={() => setShowSwapModal(false)} 
        onSuccess={handleSwapSuccess}
      />
      <CashOutModal 
        isOpen={showCashOutModal} 
        onClose={() => setShowCashOutModal(false)} 
        onSuccess={handleCashOutSuccess}
      />
      <NotificationsModal 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
      <SuccessModal 
        isOpen={showSuccess} 
        onClose={() => setShowSuccess(false)}
        type={successType}
        details={successDetails}
      />
    </main>
  )
}
