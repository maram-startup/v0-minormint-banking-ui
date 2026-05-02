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
import { DepositModal } from "@/components/minor-mint/deposit-modal"
import { SuccessModal } from "@/components/minor-mint/success-modal"
import { CardsView } from "@/components/minor-mint/cards-view"
import { InvestView } from "@/components/minor-mint/invest-view"
import { ProfileView } from "@/components/minor-mint/profile-view"
import { NotificationsModal } from "@/components/minor-mint/notifications-modal"
import { OnboardingModal } from "@/components/minor-mint/onboarding-modal"
import { LegacyTransferModal } from "@/components/minor-mint/legacy-transfer-modal"
import { PinLockScreen } from "@/components/minor-mint/pin-lock-screen"
import { WalletProvider, useWallet, UserProfile, SecurityData } from "@/lib/wallet-store"

type SuccessType = "send" | "swap" | "cashout" | "deposit"

interface SuccessDetails {
  amount?: string
  recipient?: string
  from?: string
  to?: string
  method?: string
  source?: string
}

function MinorMintContent() {
  const { 
    isOnboarded, 
    isLocked,
    completeOnboarding, 
    deposit, 
    balance,
    gasCredit,
    userProfile,
    security,
    unlockWallet,
    resetWallet
  } = useWallet()
  
  const [activeTab, setActiveTab] = useState("home")
  const [showAIGuardian, setShowAIGuardian] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [showSwapModal, setShowSwapModal] = useState(false)
  const [showCashOutModal, setShowCashOutModal] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showLegacyTransfer, setShowLegacyTransfer] = useState(false)
  
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

  const handleSwapSuccess = (details: { from: string; to: string; amount: string }) => {
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

  const handleDepositSuccess = (amount: number, source: string) => {
    deposit(amount, source)
    setShowDepositModal(false)
    setSuccessType("deposit")
    setSuccessDetails({ amount: amount.toString(), source })
    setShowSuccess(true)
  }

  const handleOnboardingComplete = (profile: UserProfile, securityData: SecurityData) => {
    completeOnboarding(profile, securityData)
  }

  // Show PIN lock screen for returning users
  if (isOnboarded && isLocked) {
    return (
      <PinLockScreen
        onUnlock={unlockWallet}
        onReset={resetWallet}
        biometricsEnabled={security?.biometricsEnabled}
        username={userProfile?.username}
      />
    )
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
            <BalanceCard 
              onLegacyTransfer={() => setShowLegacyTransfer(true)} 
              gasCredit={gasCredit}
            />
            <ActionButtons 
              onSendClick={() => setShowSendModal(true)}
              onSwapClick={() => setShowSwapModal(true)}
              onCashOutClick={() => setShowCashOutModal(true)}
              onDepositClick={() => setShowDepositModal(true)}
            />
            <Transactions />
          </>
        )
    }
  }

  return (
    <>
      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={!isOnboarded}
        onComplete={handleOnboardingComplete}
      />

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
        <DepositModal
          isOpen={showDepositModal}
          onClose={() => setShowDepositModal(false)}
          onSuccess={handleDepositSuccess}
        />
        <NotificationsModal 
          isOpen={showNotifications} 
          onClose={() => setShowNotifications(false)} 
        />
        <LegacyTransferModal
          isOpen={showLegacyTransfer}
          onClose={() => setShowLegacyTransfer(false)}
          balance={balance}
        />
        <SuccessModal 
          isOpen={showSuccess} 
          onClose={() => setShowSuccess(false)}
          type={successType}
          details={successDetails}
        />
      </main>
    </>
  )
}

export default function MinorMintApp() {
  return (
    <WalletProvider>
      <MinorMintContent />
    </WalletProvider>
  )
}
