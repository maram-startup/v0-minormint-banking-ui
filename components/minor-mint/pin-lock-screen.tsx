"use client"

import { useState, useEffect, useRef } from "react"
import { Lock, Fingerprint, AlertCircle, Eye, EyeOff, RotateCcw } from "lucide-react"

interface PinLockScreenProps {
  onUnlock: (pin: string) => boolean
  onReset: () => void
  biometricsEnabled?: boolean
  username?: string
}

export function PinLockScreen({ onUnlock, onReset, biometricsEnabled = false, username }: PinLockScreenProps) {
  const [pin, setPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [error, setError] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [isShaking, setIsShaking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handlePinChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, "").slice(0, 6)
    setPin(cleanValue)
    setError(false)

    // Auto-submit when 6 digits entered
    if (cleanValue.length === 6) {
      const success = onUnlock(cleanValue)
      if (!success) {
        setError(true)
        setIsShaking(true)
        setAttempts(prev => prev + 1)
        setTimeout(() => {
          setIsShaking(false)
          setPin("")
          inputRef.current?.focus()
        }, 500)
      }
    }
  }

  const handleKeypadPress = (digit: string) => {
    if (pin.length < 6) {
      handlePinChange(pin + digit)
    }
  }

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1))
    setError(false)
  }

  const handleBiometricAuth = () => {
    // Simulate biometric authentication
    // In a real app, this would use the Web Authentication API
    onUnlock(pin) // For demo, we'll just try to unlock
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00FFA3] opacity-[0.03] blur-[150px] rounded-full" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00FFA3] to-[#00cc82] flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(0,255,163,0.4)]">
            <span className="text-black font-bold text-2xl">M</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
          {username && (
            <p className="text-[#00FFA3] font-medium">@{username}</p>
          )}
          <p className="text-muted-foreground text-sm mt-2">Enter your PIN to unlock</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">
              Incorrect PIN. {attempts >= 3 ? "Consider resetting your wallet." : `${3 - attempts} attempts remaining.`}
            </span>
          </div>
        )}

        {/* PIN Display */}
        <div className={`mb-6 ${isShaking ? "animate-shake" : ""}`}>
          <div className="flex justify-center gap-3 mb-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${
                  i < pin.length
                    ? "border-[#00FFA3] bg-[#00FFA3]/10"
                    : error
                      ? "border-red-500/50 bg-red-500/5"
                      : "border-white/20 bg-white/5"
                }`}
              >
                {i < pin.length && (
                  <div className={`w-3 h-3 rounded-full ${error ? "bg-red-400" : "bg-[#00FFA3]"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Hidden Input for keyboard input */}
          <input
            ref={inputRef}
            type={showPin ? "text" : "password"}
            value={pin}
            onChange={(e) => handlePinChange(e.target.value)}
            className="sr-only"
            inputMode="numeric"
            autoComplete="off"
          />

          {/* Show/Hide toggle */}
          <button
            onClick={() => setShowPin(!showPin)}
            className="flex items-center gap-2 mx-auto text-sm text-muted-foreground hover:text-white transition-colors"
          >
            {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showPin ? "Hide" : "Show"} PIN
          </button>
        </div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((key, i) => (
            <button
              key={i}
              onClick={() => {
                if (key === "del") handleBackspace()
                else if (key) handleKeypadPress(key)
              }}
              disabled={!key}
              className={`h-14 rounded-xl font-semibold text-xl transition-all ${
                key === "del"
                  ? "bg-white/5 text-muted-foreground hover:bg-white/10"
                  : key
                    ? "bg-[var(--glass)] border border-[var(--glass-border)] text-white hover:bg-white/10 active:scale-95"
                    : "invisible"
              }`}
            >
              {key === "del" ? "⌫" : key}
            </button>
          ))}
        </div>

        {/* Biometric Option */}
        {biometricsEnabled && (
          <button
            onClick={handleBiometricAuth}
            className="w-full py-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] text-white font-medium flex items-center justify-center gap-2 hover:border-[#00FFA3]/30 transition-colors mb-4"
          >
            <Fingerprint className="w-5 h-5 text-[#00FFA3]" />
            Use FaceID/TouchID
          </button>
        )}

        {/* Reset Option */}
        {attempts >= 3 && (
          <button
            onClick={onReset}
            className="w-full py-3 rounded-xl text-red-400 font-medium flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Wallet
          </button>
        )}

        {/* Security Note */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          <Lock className="w-3 h-3 inline mr-1" />
          Your wallet is protected by end-to-end encryption
        </p>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  )
}
