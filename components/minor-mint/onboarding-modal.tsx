"use client"

import { useState } from "react"
import { Shield, Lock, Sparkles, ArrowRight, Eye, EyeOff, User, Calendar, AtSign } from "lucide-react"

interface OnboardingModalProps {
  isOpen: boolean
  onComplete: (name: string, username: string, age: number) => void
}

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [age, setAge] = useState("")
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false)

  if (!isOpen) return null

  const handleContinue = () => {
    if (step === 1 && name.trim()) {
      setStep(2)
    } else if (step === 2 && username.trim()) {
      setStep(3)
    } else if (step === 3 && age) {
      const ageNum = parseInt(age)
      if (ageNum > 0 && ageNum < 120) {
        if (ageNum < 18) {
          setShowPrivacyInfo(true)
        } else {
          onComplete(name, username, ageNum)
        }
      }
    }
  }

  const handlePrivacyConfirm = () => {
    onComplete(name, username, parseInt(age))
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00FFA3] opacity-[0.05] blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#00FFA3] opacity-[0.03] blur-[100px] rounded-full" />
      </div>

      {showPrivacyInfo ? (
        // Privacy Notice for Minors
        <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-[#00FFA3]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Your Private Vault</h1>
            <p className="text-muted-foreground">
              Welcome to your secure financial space
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00FFA3]/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-[#00FFA3]" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">AI Guardian Protected</h3>
                  <p className="text-sm text-muted-foreground">
                    Your AI Guardian is your only advisor, protecting your finances 24/7 with smart recommendations.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00FFA3]/10 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5 text-[#00FFA3]" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Complete Privacy</h3>
                  <p className="text-sm text-muted-foreground">
                    Your financial data stays private. No third-party access until you turn 18.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)]">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00FFA3]/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-[#00FFA3]" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Learn & Grow</h3>
                  <p className="text-sm text-muted-foreground">
                    Build smart financial habits with guidance from your AI Guardian.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handlePrivacyConfirm}
            className="w-full py-4 rounded-2xl bg-[#00FFA3] text-black font-semibold text-lg hover:shadow-[0_0_30px_rgba(0,255,163,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Enter My Private Vault
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        // Onboarding Steps
        <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00FFA3] to-[#00cc82] flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(0,255,163,0.4)]">
              <span className="text-black font-bold text-2xl">M</span>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00FFA3] rounded-full animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Welcome to MinorMint</h1>
            <p className="text-muted-foreground">
              {step === 1 && "Let's get started with your name"}
              {step === 2 && "Choose your unique username"}
              {step === 3 && "Almost there! Enter your age"}
            </p>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-all ${
                  s <= step ? "bg-[#00FFA3]" : "bg-white/10"
                }`}
              />
            ))}
          </div>

          {/* Step Content */}
          <div className="space-y-4 mb-8">
            {step === 1 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Your Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-[#00FFA3]/50 transition-colors text-lg"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Username</label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    placeholder="Choose a username"
                    className="w-full bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-[#00FFA3]/50 transition-colors text-lg"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-muted-foreground px-1">
                  Only lowercase letters, numbers, and underscores
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Your Age</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter your age"
                    min="1"
                    max="120"
                    className="w-full bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-[#00FFA3]/50 transition-colors text-lg"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-muted-foreground px-1">
                  This helps us personalize your experience
                </p>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={
              (step === 1 && !name.trim()) ||
              (step === 2 && !username.trim()) ||
              (step === 3 && !age)
            }
            className="w-full py-4 rounded-2xl bg-[#00FFA3] text-black font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(0,255,163,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {step === 3 ? "Complete Setup" : "Continue"}
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Privacy note */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            <Lock className="w-3 h-3 inline mr-1" />
            Your data is encrypted and never shared
          </p>
        </div>
      )}
    </div>
  )
}
