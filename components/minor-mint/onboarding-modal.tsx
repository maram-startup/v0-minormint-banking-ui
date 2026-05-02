"use client"

import { useState, useEffect, useCallback } from "react"
import { 
  Shield, Lock, Sparkles, ArrowRight, Eye, EyeOff, User, Calendar, 
  AtSign, Key, Fingerprint, FileSignature, Cpu, CheckCircle2, 
  AlertTriangle, Copy, Check, Loader2, Mail, Globe, Phone,
  CreditCard, Building2, Zap, ShieldCheck, Clock, ArrowLeft
} from "lucide-react"
import { generateSeedPhrase, generateWalletAddress, generateOTP, UserProfile, SecurityData } from "@/lib/wallet-store"

interface OnboardingModalProps {
  isOpen: boolean
  onComplete: (profile: UserProfile, security: SecurityData) => void
}

type OnboardingStep = 
  | "welcome"
  | "email"
  | "email-verify"
  | "identity" 
  | "kyc"
  | "seed-generate" 
  | "seed-verify" 
  | "pin-setup" 
  | "biometrics"
  | "initializing" 
  | "terms"

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", 
  "France", "Japan", "South Korea", "United Arab Emirates", "Saudi Arabia",
  "Egypt", "Morocco", "Tunisia", "Algeria", "Jordan", "Lebanon", "Qatar",
  "Kuwait", "Bahrain", "Oman", "India", "Singapore", "Hong Kong", "Brazil"
]

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState<OnboardingStep>("welcome")
  
  // Email state
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [otp, setOtp] = useState("")
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpError, setOtpError] = useState("")
  const [resendTimer, setResendTimer] = useState(0)
  
  // Identity state
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [country, setCountry] = useState("")
  
  // KYC state (simulated)
  const [idType, setIdType] = useState<"passport" | "national_id" | "school_id">("school_id")
  const [idNumber, setIdNumber] = useState("")
  const [selfieConsent, setSelfieConsent] = useState(false)
  
  // Security state
  const [seedPhrase, setSeedPhrase] = useState<string[]>([])
  const [seedCopied, setSeedCopied] = useState(false)
  const [seedConfirmed, setSeedConfirmed] = useState(false)
  const [verificationWords, setVerificationWords] = useState<{index: number, word: string}[]>([])
  const [userVerification, setUserVerification] = useState<string[]>(["", "", ""])
  const [verificationError, setVerificationError] = useState(false)
  
  // PIN state
  const [pin, setPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [pinError, setPinError] = useState("")
  
  // Biometrics
  const [biometricsEnabled, setBiometricsEnabled] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  
  // Initialization state
  const [initStep, setInitStep] = useState(0)
  const initSteps = [
    { text: "Encrypting Identity Data...", icon: Shield },
    { text: "Generating Secure Keys...", icon: Key },
    { text: "Creating Smart Wallet...", icon: CreditCard },
    { text: "Deploying Contract...", icon: Cpu },
    { text: "Syncing with AI Guardian...", icon: Sparkles },
    { text: "Activating Account...", icon: Zap }
  ]
  
  // Generated wallet address
  const [walletAddress, setWalletAddress] = useState("")

  // Calculate age from DOB
  const calculateAge = (dob: string): number => {
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  // Generate seed phrase on mount
  useEffect(() => {
    if (isOpen && seedPhrase.length === 0) {
      const phrase = generateSeedPhrase()
      setSeedPhrase(phrase)
      setWalletAddress(generateWalletAddress())
      
      const indices = new Set<number>()
      while (indices.size < 3) {
        indices.add(Math.floor(Math.random() * 12))
      }
      const sortedIndices = Array.from(indices).sort((a, b) => a - b)
      setVerificationWords(sortedIndices.map(i => ({ index: i, word: phrase[i] })))
    }
  }, [isOpen, seedPhrase.length])

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendTimer])

  // Run initialization animation
  useEffect(() => {
    if (step === "initializing") {
      const timer = setInterval(() => {
        setInitStep((prev) => {
          if (prev >= initSteps.length - 1) {
            clearInterval(timer)
            setTimeout(() => setStep("terms"), 800)
            return prev
          }
          return prev + 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [step, initSteps.length])

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSendOtp = () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address")
      return
    }
    setEmailError("")
    const newOtp = generateOTP()
    setGeneratedOtp(newOtp)
    setOtpSent(true)
    setResendTimer(60)
    setStep("email-verify")
    
    // In production, this would send a real email
    console.log("[v0] OTP for demo:", newOtp)
  }

  const handleVerifyOtp = () => {
    if (otp === generatedOtp || otp === "000000") { // Allow bypass for demo
      setOtpError("")
      setStep("identity")
    } else {
      setOtpError("Invalid verification code. Please try again.")
    }
  }

  const handleCopySeedPhrase = useCallback(() => {
    navigator.clipboard.writeText(seedPhrase.join(" "))
    setSeedCopied(true)
    setTimeout(() => setSeedCopied(false), 2000)
  }, [seedPhrase])

  const handleVerifySeed = () => {
    const isValid = verificationWords.every((v, i) => 
      userVerification[i].toLowerCase().trim() === v.word.toLowerCase()
    )
    
    if (isValid) {
      setVerificationError(false)
      setStep("pin-setup")
    } else {
      setVerificationError(true)
    }
  }

  const handlePinSubmit = () => {
    if (pin.length !== 6) {
      setPinError("PIN must be 6 digits")
      return
    }
    if (pin !== confirmPin) {
      setPinError("PINs do not match")
      return
    }
    setPinError("")
    setStep("biometrics")
  }

  const handleBiometricsNext = () => {
    setStep("initializing")
  }

  const handleFinalComplete = () => {
    const age = calculateAge(dateOfBirth)
    const profile: UserProfile = {
      name,
      username,
      email,
      age,
      dateOfBirth,
      country,
      isMinor: age < 18,
      createdAt: new Date(),
      walletAddress,
      accountTier: age < 18 ? "teen" : "adult",
      kycStatus: "verified",
    }
    
    const security: SecurityData = {
      seedPhrase,
      pin,
      biometricsEnabled,
      termsAccepted: true,
      termsSignedAt: new Date(),
      emailVerified: true,
      twoFactorEnabled,
      lastLogin: null,
    }
    
    onComplete(profile, security)
  }

  if (!isOpen) return null

  const totalSteps = 11
  const currentStepIndex = ["welcome", "email", "email-verify", "identity", "kyc", "seed-generate", "seed-verify", "pin-setup", "biometrics", "initializing", "terms"].indexOf(step)

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4 overflow-y-auto">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#00FFA3] opacity-[0.03] blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500 opacity-[0.02] blur-[100px] rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-[#00FFA3] opacity-[0.02] blur-[100px] rounded-full" />
      </div>

      {/* Welcome Screen */}
      {step === "welcome" && (
        <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-500 my-8">
          <div className="text-center mb-8">
            {/* Animated Logo */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FFA3] to-cyan-400 rounded-3xl rotate-6 opacity-20 animate-pulse" />
              <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-[#00FFA3] to-[#00cc82] flex items-center justify-center shadow-[0_0_60px_rgba(0,255,163,0.4)]">
                <span className="text-black font-bold text-4xl">M</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#00FFA3] rounded-full animate-ping" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#00FFA3] rounded-full" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">MinorMint</h1>
            <p className="text-[#00FFA3] font-medium mb-4">Teen-First Digital Banking</p>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Your sovereign financial identity. No parental link required. Bank-grade security meets Gen-Z freedom.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            {[
              { icon: Shield, text: "Military-Grade Encryption", sub: "Your data, your control" },
              { icon: Zap, text: "Zero Gas Fees", sub: "AI-powered transactions" },
              { icon: Sparkles, text: "AI Guardian", sub: "Your personal financial advisor" },
            ].map((feature, i) => (
              <div 
                key={i}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)]"
              >
                <div className="w-12 h-12 rounded-xl bg-[#00FFA3]/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-[#00FFA3]" />
                </div>
                <div>
                  <p className="text-white font-medium">{feature.text}</p>
                  <p className="text-xs text-muted-foreground">{feature.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep("email")}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00FFA3] to-cyan-400 text-black font-bold hover:shadow-[0_0_40px_rgba(0,255,163,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg"
          >
            Create My Wallet
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-center text-xs text-muted-foreground mt-4">
            By continuing, you agree to our Terms of Service
          </p>
        </div>
      )}

      {/* Email Entry */}
      {step === "email" && (
        <div className="relative w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-300 my-8">
          <button
            onClick={() => setStep("welcome")}
            className="flex items-center gap-2 text-muted-foreground hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-[#00FFA3]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Secure Your Account</h1>
            <p className="text-muted-foreground text-sm">Enter your email to receive a verification code</p>
          </div>

          {/* Progress */}
          <div className="flex gap-1 mb-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-all ${
                  i <= currentStepIndex ? "bg-[#00FFA3]" : "bg-white/10"
                }`}
              />
            ))}
          </div>

          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setEmailError("")
                  }}
                  placeholder="you@gmail.com"
                  className="w-full bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-[#00FFA3]/50 transition-colors"
                  autoFocus
                />
              </div>
              {emailError && (
                <p className="text-sm text-red-400">{emailError}</p>
              )}
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="p-4 rounded-2xl bg-[#00FFA3]/5 border border-[#00FFA3]/20 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00FFA3]/10 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-[#00FFA3]" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">End-to-End Encrypted</p>
                <p className="text-xs text-muted-foreground">We never share your email with anyone</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleSendOtp}
            disabled={!email.trim()}
            className="w-full py-4 rounded-2xl bg-[#00FFA3] text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(0,255,163,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Send Verification Code
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Email Verification */}
      {step === "email-verify" && (
        <div className="relative w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-300 my-8">
          <button
            onClick={() => setStep("email")}
            className="flex items-center gap-2 text-muted-foreground hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Change Email
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-[#00FFA3]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Verify Your Email</h1>
            <p className="text-muted-foreground text-sm">
              Enter the 6-digit code sent to<br />
              <span className="text-white font-medium">{email}</span>
            </p>
          </div>

          {/* Progress */}
          <div className="flex gap-1 mb-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-all ${
                  i <= currentStepIndex ? "bg-[#00FFA3]" : "bg-white/10"
                }`}
              />
            ))}
          </div>

          {/* Demo Notice */}
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-4">
            <p className="text-xs text-cyan-400 text-center">
              Demo Mode: Enter <span className="font-mono font-bold">000000</span> or check console for OTP
            </p>
          </div>

          {otpError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
              <p className="text-sm text-red-400 text-center">{otpError}</p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Verification Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                  setOtp(value)
                  setOtpError("")
                }}
                placeholder="000000"
                inputMode="numeric"
                maxLength={6}
                className="w-full bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl py-4 px-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-[#00FFA3]/50 transition-colors tracking-[0.5em] text-center font-mono text-2xl"
                autoFocus
              />
            </div>
          </div>

          <button
            onClick={handleVerifyOtp}
            disabled={otp.length !== 6}
            className="w-full py-4 rounded-2xl bg-[#00FFA3] text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(0,255,163,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 mb-4"
          >
            Verify & Continue
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={handleSendOtp}
            disabled={resendTimer > 0}
            className="w-full py-3 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] text-muted-foreground font-medium disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {resendTimer > 0 ? (
              <>
                <Clock className="w-4 h-4" />
                Resend in {resendTimer}s
              </>
            ) : (
              "Resend Code"
            )}
          </button>
        </div>
      )}

      {/* Identity Foundation */}
      {step === "identity" && (
        <div className="relative w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-300 my-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-[#00FFA3]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Identity Foundation</h1>
            <p className="text-muted-foreground text-sm">Create your sovereign financial identity</p>
          </div>

          {/* Progress */}
          <div className="flex gap-1 mb-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-all ${
                  i <= currentStepIndex ? "bg-[#00FFA3]" : "bg-white/10"
                }`}
              />
            ))}
          </div>

          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Mint Name (Username)</label>
              <div className="relative">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  placeholder="Choose your unique Mint Name"
                  className="w-full bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-[#00FFA3]/50 transition-colors"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Full Legal Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="As it appears on your ID"
                  className="w-full bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-[#00FFA3]/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-[#00FFA3]/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Country of Residence</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#00FFA3]/50 transition-colors appearance-none cursor-pointer"
                >
                  <option value="" className="bg-black">Select country</option>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c} className="bg-black">{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Encryption Notice */}
          <div className="p-4 rounded-2xl bg-[#00FFA3]/5 border border-[#00FFA3]/20 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00FFA3]/10 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-[#00FFA3]" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">Your identity is encrypted</p>
                <p className="text-xs text-muted-foreground">No parental link required</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep("kyc")}
            disabled={!username.trim() || !name.trim() || !dateOfBirth || !country}
            className="w-full py-4 rounded-2xl bg-[#00FFA3] text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(0,255,163,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Continue to Verification
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* KYC Verification */}
      {step === "kyc" && (
        <div className="relative w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-300 my-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-[#00FFA3]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Identity Verification</h1>
            <p className="text-muted-foreground text-sm">Quick KYC for secure banking access</p>
          </div>

          {/* Progress */}
          <div className="flex gap-1 mb-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-all ${
                  i <= currentStepIndex ? "bg-[#00FFA3]" : "bg-white/10"
                }`}
              />
            ))}
          </div>

          {/* ID Type Selection */}
          <div className="space-y-2 mb-4">
            <label className="text-sm font-medium text-muted-foreground">ID Document Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "school_id", label: "School ID", icon: Building2 },
                { value: "passport", label: "Passport", icon: Globe },
                { value: "national_id", label: "National ID", icon: CreditCard },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setIdType(option.value as typeof idType)}
                  className={`p-3 rounded-xl border ${
                    idType === option.value
                      ? "bg-[#00FFA3]/10 border-[#00FFA3]/50"
                      : "bg-[var(--glass)] border-[var(--glass-border)]"
                  } transition-all flex flex-col items-center gap-2`}
                >
                  <option.icon className={`w-5 h-5 ${idType === option.value ? "text-[#00FFA3]" : "text-muted-foreground"}`} />
                  <span className={`text-xs ${idType === option.value ? "text-white" : "text-muted-foreground"}`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">ID Number</label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value.toUpperCase())}
                placeholder="Enter your ID number"
                className="w-full bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl py-4 px-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-[#00FFA3]/50 transition-colors font-mono"
              />
            </div>
          </div>

          {/* Selfie Consent */}
          <label className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] cursor-pointer mb-6">
            <input
              type="checkbox"
              checked={selfieConsent}
              onChange={(e) => setSelfieConsent(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-2 border-[#00FFA3]/50 bg-transparent checked:bg-[#00FFA3] appearance-none cursor-pointer relative after:content-[''] after:absolute after:left-1.5 after:top-0.5 after:w-1.5 after:h-3 after:border-r-2 after:border-b-2 after:border-black after:rotate-45 after:opacity-0 checked:after:opacity-100"
            />
            <span className="text-sm text-muted-foreground">
              I consent to facial recognition for account security. My data is encrypted and never shared.
            </span>
          </label>

          {/* Teen-Friendly Notice */}
          <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">Teen-Friendly KYC</p>
                <p className="text-xs text-muted-foreground">School IDs accepted for full access</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep("seed-generate")}
            disabled={!idNumber.trim() || !selfieConsent}
            className="w-full py-4 rounded-2xl bg-[#00FFA3] text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(0,255,163,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Continue to Security
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Seed Phrase Generation */}
      {step === "seed-generate" && (
        <div className="relative w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-300 my-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-[#00FFA3]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Security Matrix</h1>
            <p className="text-muted-foreground text-sm">Your 12-word recovery phrase</p>
          </div>

          {/* Progress */}
          <div className="flex gap-1 mb-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-all ${
                  i <= currentStepIndex ? "bg-[#00FFA3]" : "bg-white/10"
                }`}
              />
            ))}
          </div>

          {/* Warning */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-500 font-medium">Write this down immediately</p>
                <p className="text-xs text-amber-500/70">This is the ONLY way to recover your wallet. Store it safely offline.</p>
              </div>
            </div>
          </div>

          {/* Seed Phrase Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4 p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)]">
            {seedPhrase.map((word, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-xs text-muted-foreground w-5">{i + 1}.</span>
                <span className="text-white font-mono text-sm">{word}</span>
              </div>
            ))}
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopySeedPhrase}
            className="w-full mb-4 py-3 rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] text-white font-medium flex items-center justify-center gap-2 hover:border-[#00FFA3]/30 transition-colors"
          >
            {seedCopied ? (
              <>
                <Check className="w-4 h-4 text-[#00FFA3]" />
                Copied to Clipboard
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Recovery Phrase
              </>
            )}
          </button>

          {/* Confirmation Checkbox */}
          <label className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] cursor-pointer mb-6">
            <input
              type="checkbox"
              checked={seedConfirmed}
              onChange={(e) => setSeedConfirmed(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-2 border-[#00FFA3]/50 bg-transparent checked:bg-[#00FFA3] appearance-none cursor-pointer relative after:content-[''] after:absolute after:left-1.5 after:top-0.5 after:w-1.5 after:h-3 after:border-r-2 after:border-b-2 after:border-black after:rotate-45 after:opacity-0 checked:after:opacity-100"
            />
            <span className="text-sm text-muted-foreground">
              I have securely written down my 12-word recovery phrase and understand that losing it means losing access to my wallet forever.
            </span>
          </label>

          <button
            onClick={() => setStep("seed-verify")}
            disabled={!seedConfirmed}
            className="w-full py-4 rounded-2xl bg-[#00FFA3] text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(0,255,163,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Verify Recovery Phrase
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Seed Phrase Verification */}
      {step === "seed-verify" && (
        <div className="relative w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-300 my-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-[#00FFA3]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Verify Your Phrase</h1>
            <p className="text-muted-foreground text-sm">Confirm you saved it correctly</p>
          </div>

          {/* Progress */}
          <div className="flex gap-1 mb-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-all ${
                  i <= currentStepIndex ? "bg-[#00FFA3]" : "bg-white/10"
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Enter the following words from your recovery phrase:
          </p>

          {verificationError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
              <p className="text-sm text-red-400 text-center">
                Incorrect words. Please check your recovery phrase and try again.
              </p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            {verificationWords.map((v, i) => (
              <div key={v.index} className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Word #{v.index + 1}
                </label>
                <input
                  type="text"
                  value={userVerification[i]}
                  onChange={(e) => {
                    const newVerification = [...userVerification]
                    newVerification[i] = e.target.value
                    setUserVerification(newVerification)
                    setVerificationError(false)
                  }}
                  placeholder={`Enter word #${v.index + 1}`}
                  className="w-full bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl py-4 px-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-[#00FFA3]/50 transition-colors font-mono"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleVerifySeed}
            disabled={userVerification.some(v => !v.trim())}
            className="w-full py-4 rounded-2xl bg-[#00FFA3] text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(0,255,163,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Verify & Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* PIN Setup */}
      {step === "pin-setup" && (
        <div className="relative w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-300 my-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-[#00FFA3]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Create Secure PIN</h1>
            <p className="text-muted-foreground text-sm">6-digit code for quick access</p>
          </div>

          {/* Progress */}
          <div className="flex gap-1 mb-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-all ${
                  i <= currentStepIndex ? "bg-[#00FFA3]" : "bg-white/10"
                }`}
              />
            ))}
          </div>

          {pinError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
              <p className="text-sm text-red-400 text-center">{pinError}</p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Create 6-Digit PIN</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                    setPin(value)
                    setPinError("")
                  }}
                  placeholder="Enter 6-digit PIN"
                  inputMode="numeric"
                  maxLength={6}
                  className="w-full bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-muted-foreground focus:outline-none focus:border-[#00FFA3]/50 transition-colors tracking-[0.5em] text-center font-mono text-xl"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                >
                  {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Confirm PIN</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPin ? "text" : "password"}
                  value={confirmPin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                    setConfirmPin(value)
                    setPinError("")
                  }}
                  placeholder="Confirm your PIN"
                  inputMode="numeric"
                  maxLength={6}
                  className="w-full bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-muted-foreground focus:outline-none focus:border-[#00FFA3]/50 transition-colors tracking-[0.5em] text-center font-mono text-xl"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handlePinSubmit}
            disabled={pin.length !== 6 || confirmPin.length !== 6}
            className="w-full py-4 rounded-2xl bg-[#00FFA3] text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(0,255,163,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Set PIN & Continue
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Biometrics Setup */}
      {step === "biometrics" && (
        <div className="relative w-full max-w-md animate-in fade-in slide-in-from-right-4 duration-300 my-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center mx-auto mb-4">
              <Fingerprint className="w-8 h-8 text-[#00FFA3]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Biometric Security</h1>
            <p className="text-muted-foreground text-sm">Enable instant secure access</p>
          </div>

          {/* Progress */}
          <div className="flex gap-1 mb-6">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-all ${
                  i <= currentStepIndex ? "bg-[#00FFA3]" : "bg-white/10"
                }`}
              />
            ))}
          </div>

          <div className="space-y-3 mb-6">
            {/* FaceID/TouchID Toggle */}
            <div 
              onClick={() => setBiometricsEnabled(!biometricsEnabled)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                biometricsEnabled 
                  ? "bg-[#00FFA3]/10 border-[#00FFA3]/50" 
                  : "bg-[var(--glass)] border-[var(--glass-border)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    biometricsEnabled ? "bg-[#00FFA3]/20" : "bg-white/5"
                  }`}>
                    <Fingerprint className={`w-5 h-5 ${biometricsEnabled ? "text-[#00FFA3]" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className="text-white font-medium">Face ID / Touch ID</p>
                    <p className="text-xs text-muted-foreground">Unlock with biometrics</p>
                  </div>
                </div>
                <div className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  biometricsEnabled ? "bg-[#00FFA3]" : "bg-white/10"
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    biometricsEnabled ? "translate-x-5" : "translate-x-0"
                  }`} />
                </div>
              </div>
            </div>

            {/* 2FA Toggle */}
            <div 
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                twoFactorEnabled 
                  ? "bg-[#00FFA3]/10 border-[#00FFA3]/50" 
                  : "bg-[var(--glass)] border-[var(--glass-border)]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    twoFactorEnabled ? "bg-[#00FFA3]/20" : "bg-white/5"
                  }`}>
                    <ShieldCheck className={`w-5 h-5 ${twoFactorEnabled ? "text-[#00FFA3]" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className="text-white font-medium">Two-Factor Auth (2FA)</p>
                    <p className="text-xs text-muted-foreground">Extra security for transactions</p>
                  </div>
                </div>
                <div className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  twoFactorEnabled ? "bg-[#00FFA3]" : "bg-white/10"
                }`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    twoFactorEnabled ? "translate-x-5" : "translate-x-0"
                  }`} />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleBiometricsNext}
            className="w-full py-4 rounded-2xl bg-[#00FFA3] text-black font-semibold hover:shadow-[0_0_30px_rgba(0,255,163,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Initialize Wallet
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Wallet Initialization Animation */}
      {step === "initializing" && (
        <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center">
            {/* Animated Wallet */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FFA3] to-cyan-400 rounded-3xl opacity-20 animate-pulse" />
              <div className="absolute inset-2 bg-gradient-to-br from-[#00FFA3] to-cyan-400 rounded-2xl opacity-40 animate-ping" style={{ animationDuration: "2s" }} />
              <div className="relative w-32 h-32 rounded-3xl bg-black border-2 border-[#00FFA3]/50 flex items-center justify-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00FFA3] to-cyan-400 flex items-center justify-center shadow-[0_0_40px_rgba(0,255,163,0.5)]">
                  <span className="text-black font-bold text-3xl">M</span>
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-white mb-8">Creating Your Wallet</h1>

            {/* Progress Steps */}
            <div className="space-y-3 max-w-xs mx-auto">
              {initSteps.map((s, i) => {
                const Icon = s.icon
                const isActive = i === initStep
                const isComplete = i < initStep

                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isActive ? "bg-[#00FFA3]/10 border border-[#00FFA3]/30" : "opacity-50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isComplete ? "bg-[#00FFA3]" : isActive ? "bg-[#00FFA3]/20" : "bg-white/5"
                    }`}>
                      {isComplete ? (
                        <CheckCircle2 className="w-4 h-4 text-black" />
                      ) : isActive ? (
                        <Loader2 className="w-4 h-4 text-[#00FFA3] animate-spin" />
                      ) : (
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <span className={`text-sm ${isActive ? "text-white" : "text-muted-foreground"}`}>
                      {s.text}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Terms of Sovereignty */}
      {step === "terms" && (
        <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-500 my-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center mx-auto mb-4">
              <FileSignature className="w-8 h-8 text-[#00FFA3]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Terms of Sovereignty</h1>
            <p className="text-muted-foreground text-sm">Your declaration of financial independence</p>
          </div>

          {/* Wallet Created Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#00FFA3]/10 to-cyan-500/10 border border-[#00FFA3]/30 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00FFA3] to-cyan-400 flex items-center justify-center">
                <span className="text-black font-bold text-lg">M</span>
              </div>
              <div>
                <p className="text-white font-medium">Wallet Created</p>
                <p className="text-xs text-muted-foreground font-mono">{walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}</p>
              </div>
              <CheckCircle2 className="w-6 h-6 text-[#00FFA3] ml-auto" />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Gas Credit</span>
              <span className="text-[#00FFA3] font-mono">0.001 ETH</span>
            </div>
          </div>

          {/* Terms */}
          <div className="p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] mb-6 max-h-48 overflow-y-auto">
            <h3 className="text-sm font-semibold text-white mb-2">Declaration of Financial Sovereignty</h3>
            <div className="text-xs text-muted-foreground space-y-2">
              <p>By signing below, I acknowledge and agree to the following:</p>
              <p><strong className="text-white">1. Self-Custody:</strong> I am the sole owner of my wallet. MinorMint does not have access to my private keys or recovery phrase.</p>
              <p><strong className="text-white">2. Responsibility:</strong> I understand that I am responsible for safeguarding my recovery phrase. Loss of this phrase means permanent loss of access to my funds.</p>
              <p><strong className="text-white">3. Privacy:</strong> My financial data is encrypted end-to-end. No parental oversight unless I choose to enable it.</p>
              <p><strong className="text-white">4. AI Guardian:</strong> I consent to AI-powered financial guidance designed to help me build healthy money habits.</p>
              <p><strong className="text-white">5. Compliance:</strong> I agree to use this wallet in accordance with applicable laws in my jurisdiction.</p>
            </div>
          </div>

          {/* Signature */}
          <div className="p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Digital Signature</p>
                <p className="text-white font-medium">@{username}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-white font-mono text-sm">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleFinalComplete}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#00FFA3] to-cyan-400 text-black font-bold hover:shadow-[0_0_40px_rgba(0,255,163,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-lg"
          >
            <FileSignature className="w-5 h-5" />
            Sign & Activate Wallet
          </button>
        </div>
      )}
    </div>
  )
}
