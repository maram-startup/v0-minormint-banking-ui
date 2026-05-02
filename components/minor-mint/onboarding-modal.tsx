"use client"

import { useState, useEffect, useCallback } from "react"
import { 
  Shield, Lock, Sparkles, ArrowRight, Eye, EyeOff, User, Calendar, 
  AtSign, Key, Fingerprint, FileSignature, Cpu, CheckCircle2, 
  AlertTriangle, Copy, Check, Loader2
} from "lucide-react"
import { generateSeedPhrase, UserProfile, SecurityData } from "@/lib/wallet-store"

interface OnboardingModalProps {
  isOpen: boolean
  onComplete: (profile: UserProfile, security: SecurityData) => void
}

type OnboardingStep = 
  | "identity" 
  | "seed-generate" 
  | "seed-verify" 
  | "pin-setup" 
  | "initializing" 
  | "terms"

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState<OnboardingStep>("identity")
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [age, setAge] = useState("")
  
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
  const [biometricsEnabled, setBiometricsEnabled] = useState(false)
  const [pinError, setPinError] = useState("")
  
  // Initialization state
  const [initStep, setInitStep] = useState(0)
  const initSteps = [
    { text: "Generating Secure Keys...", icon: Key },
    { text: "Deploying Smart Contract...", icon: Cpu },
    { text: "Syncing with AI Guardian...", icon: Shield },
    { text: "Finalizing Wallet Setup...", icon: Sparkles }
  ]

  // Generate seed phrase on mount
  useEffect(() => {
    if (isOpen && seedPhrase.length === 0) {
      const phrase = generateSeedPhrase()
      setSeedPhrase(phrase)
      
      // Select 3 random words for verification
      const indices = new Set<number>()
      while (indices.size < 3) {
        indices.add(Math.floor(Math.random() * 12))
      }
      const sortedIndices = Array.from(indices).sort((a, b) => a - b)
      setVerificationWords(sortedIndices.map(i => ({ index: i, word: phrase[i] })))
    }
  }, [isOpen, seedPhrase.length])

  // Run initialization animation
  useEffect(() => {
    if (step === "initializing") {
      const timer = setInterval(() => {
        setInitStep((prev) => {
          if (prev >= initSteps.length - 1) {
            clearInterval(timer)
            setTimeout(() => setStep("terms"), 500)
            return prev
          }
          return prev + 1
        })
      }, 1200)
      return () => clearInterval(timer)
    }
  }, [step, initSteps.length])

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
    setStep("initializing")
  }

  const handleFinalComplete = () => {
    const ageNum = parseInt(age)
    const profile: UserProfile = {
      name,
      username,
      age: ageNum,
      isMinor: ageNum < 18,
      createdAt: new Date(),
    }
    
    const security: SecurityData = {
      seedPhrase,
      pin,
      biometricsEnabled,
      termsAccepted: true,
      termsSignedAt: new Date(),
    }
    
    onComplete(profile, security)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4 overflow-y-auto">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00FFA3] opacity-[0.05] blur-[150px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#00FFA3] opacity-[0.03] blur-[100px] rounded-full" />
      </div>

      {/* Step 1: Identity Foundation */}
      {step === "identity" && (
        <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300 my-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00FFA3] to-[#00cc82] flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(0,255,163,0.4)]">
              <span className="text-black font-bold text-2xl">M</span>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00FFA3] rounded-full animate-pulse" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Identity Foundation</h1>
            <p className="text-muted-foreground text-sm">Create your sovereign financial identity</p>
          </div>

          {/* Progress */}
          <div className="flex gap-1.5 mb-6">
            {["identity", "seed-generate", "seed-verify", "pin-setup", "initializing", "terms"].map((s, i) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-all ${
                  i === 0 ? "bg-[#00FFA3]" : "bg-white/10"
                }`}
              />
            ))}
          </div>

          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Mint Name</label>
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
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-[#00FFA3]/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Age</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  min="1"
                  max="120"
                  className="w-full bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-[#00FFA3]/50 transition-colors"
                />
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
            onClick={() => setStep("seed-generate")}
            disabled={!username.trim() || !name.trim() || !age}
            className="w-full py-4 rounded-2xl bg-[#00FFA3] text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(0,255,163,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Continue to Security
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Step 2: Seed Phrase Generation */}
      {step === "seed-generate" && (
        <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300 my-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-[#00FFA3]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Security Matrix</h1>
            <p className="text-muted-foreground text-sm">Your 12-word recovery phrase</p>
          </div>

          {/* Progress */}
          <div className="flex gap-1.5 mb-6">
            {["identity", "seed-generate", "seed-verify", "pin-setup", "initializing", "terms"].map((s, i) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-all ${
                  i <= 1 ? "bg-[#00FFA3]" : "bg-white/10"
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
              <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-black/30">
                <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
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

      {/* Step 3: Seed Phrase Verification */}
      {step === "seed-verify" && (
        <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300 my-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-[#00FFA3]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Verify Your Phrase</h1>
            <p className="text-muted-foreground text-sm">Confirm you saved it correctly</p>
          </div>

          {/* Progress */}
          <div className="flex gap-1.5 mb-6">
            {["identity", "seed-generate", "seed-verify", "pin-setup", "initializing", "terms"].map((s, i) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-all ${
                  i <= 2 ? "bg-[#00FFA3]" : "bg-white/10"
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

      {/* Step 4: PIN Setup */}
      {step === "pin-setup" && (
        <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300 my-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-[#00FFA3]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Biometric & PIN Lock</h1>
            <p className="text-muted-foreground text-sm">Set up your secure access</p>
          </div>

          {/* Progress */}
          <div className="flex gap-1.5 mb-6">
            {["identity", "seed-generate", "seed-verify", "pin-setup", "initializing", "terms"].map((s, i) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-all ${
                  i <= 3 ? "bg-[#00FFA3]" : "bg-white/10"
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
                  placeholder="Confirm 6-digit PIN"
                  inputMode="numeric"
                  maxLength={6}
                  className="w-full bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-muted-foreground focus:outline-none focus:border-[#00FFA3]/50 transition-colors tracking-[0.5em] text-center font-mono text-xl"
                />
              </div>
            </div>
          </div>

          {/* Biometrics Toggle */}
          <div className="p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00FFA3]/10 flex items-center justify-center">
                  <Fingerprint className="w-5 h-5 text-[#00FFA3]" />
                </div>
                <div>
                  <p className="text-white font-medium">Enable FaceID/TouchID</p>
                  <p className="text-xs text-muted-foreground">Instant access with biometrics</p>
                </div>
              </div>
              <button
                onClick={() => setBiometricsEnabled(!biometricsEnabled)}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  biometricsEnabled ? "bg-[#00FFA3]" : "bg-white/20"
                }`}
              >
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
                  biometricsEnabled ? "left-6" : "left-1"
                }`} />
              </button>
            </div>
          </div>

          <button
            onClick={handlePinSubmit}
            disabled={pin.length !== 6 || confirmPin.length !== 6}
            className="w-full py-4 rounded-2xl bg-[#00FFA3] text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(0,255,163,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Initialize Wallet
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Step 5: Initialization Animation */}
      {step === "initializing" && (
        <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center mb-8">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-[#00FFA3]/20" />
              <div className="absolute inset-0 rounded-full border-4 border-[#00FFA3] border-t-transparent animate-spin" />
              <div className="absolute inset-4 rounded-full bg-[#00FFA3]/10 flex items-center justify-center">
                <Cpu className="w-8 h-8 text-[#00FFA3]" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Creating Your Wallet</h1>
            <p className="text-muted-foreground">Please wait while we set up your secure vault</p>
          </div>

          <div className="space-y-3">
            {initSteps.map((item, i) => {
              const Icon = item.icon
              const isActive = i === initStep
              const isComplete = i < initStep
              
              return (
                <div
                  key={i}
                  className={`p-4 rounded-2xl border transition-all duration-500 ${
                    isComplete 
                      ? "bg-[#00FFA3]/10 border-[#00FFA3]/30" 
                      : isActive 
                        ? "bg-[var(--glass)] border-[#00FFA3]/50" 
                        : "bg-[var(--glass)] border-[var(--glass-border)] opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isComplete 
                        ? "bg-[#00FFA3]" 
                        : isActive 
                          ? "bg-[#00FFA3]/20" 
                          : "bg-white/5"
                    }`}>
                      {isComplete ? (
                        <CheckCircle2 className="w-5 h-5 text-black" />
                      ) : isActive ? (
                        <Loader2 className="w-5 h-5 text-[#00FFA3] animate-spin" />
                      ) : (
                        <Icon className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <span className={`font-medium ${
                      isComplete || isActive ? "text-white" : "text-muted-foreground"
                    }`}>
                      {item.text}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Step 6: Terms of Sovereignty */}
      {step === "terms" && (
        <div className="relative w-full max-w-md animate-in fade-in zoom-in-95 duration-300 my-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center mx-auto mb-4">
              <FileSignature className="w-8 h-8 text-[#00FFA3]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Terms of Sovereignty</h1>
            <p className="text-muted-foreground text-sm">Your declaration of financial independence</p>
          </div>

          {/* Progress */}
          <div className="flex gap-1.5 mb-6">
            {["identity", "seed-generate", "seed-verify", "pin-setup", "initializing", "terms"].map((s, i) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-all bg-[#00FFA3]`}
              />
            ))}
          </div>

          {/* Terms Document */}
          <div className="p-5 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] mb-6 max-h-64 overflow-y-auto">
            <div className="space-y-4 text-sm text-muted-foreground">
              <p className="text-white font-semibold text-base">Declaration of Financial Sovereignty</p>
              
              <p>By signing this agreement, I, <span className="text-[#00FFA3] font-medium">@{username}</span>, hereby declare:</p>
              
              <div className="space-y-2">
                <p><span className="text-white">1.</span> I am the sole owner and controller of this digital wallet and all assets within it.</p>
                <p><span className="text-white">2.</span> I understand that my 12-word recovery phrase is the master key to my wallet, and I am solely responsible for its safekeeping.</p>
                <p><span className="text-white">3.</span> I acknowledge that no central authority, including MinorMint, can access, freeze, or recover my funds without my recovery phrase.</p>
                <p><span className="text-white">4.</span> I accept full responsibility for my financial decisions, guided by my AI Guardian.</p>
                <p><span className="text-white">5.</span> I commit to learning and practicing responsible financial habits.</p>
              </div>
              
              <p className="pt-2 border-t border-[var(--glass-border)]">
                This wallet operates on principles of self-custody and decentralization. Your keys, your coins, your future.
              </p>
            </div>
          </div>

          {/* Gas Gift Notice */}
          <div className="p-4 rounded-2xl bg-[#00FFA3]/5 border border-[#00FFA3]/20 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00FFA3]/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-[#00FFA3]" />
              </div>
              <div>
                <p className="text-sm text-white font-medium">Welcome Gift from AI Guardian</p>
                <p className="text-xs text-muted-foreground">0.001 ETH gas credit for your first transactions</p>
              </div>
            </div>
          </div>

          {/* Signature Line */}
          <div className="p-4 rounded-2xl bg-black/50 border border-[var(--glass-border)] mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Digital Signature</p>
                <p className="text-white font-mono">@{username}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground mb-1">Date</p>
                <p className="text-white font-mono text-sm">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleFinalComplete}
            className="w-full py-4 rounded-2xl bg-[#00FFA3] text-black font-semibold hover:shadow-[0_0_30px_rgba(0,255,163,0.5)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Sign & Enter MinorMint
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
