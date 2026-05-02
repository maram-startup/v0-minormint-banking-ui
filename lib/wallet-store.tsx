"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface Transaction {
  id: string
  type: "incoming" | "outgoing" | "swap"
  title: string
  description: string
  amount: number
  timestamp: Date
  status: "completed" | "approved" | "pending" | "limited"
  icon: "deposit" | "send" | "swap" | "cashout" | "allowance"
}

export interface UserProfile {
  name: string
  username: string
  age: number
  isMinor: boolean
  createdAt: Date
}

interface WalletState {
  balance: number
  vaultBalance: number
  transactions: Transaction[]
  userProfile: UserProfile | null
  isOnboarded: boolean
  gasFeesSaved: number
}

interface WalletContextType extends WalletState {
  deposit: (amount: number, description?: string) => void
  send: (amount: number, recipient: string) => boolean
  swap: (fromAmount: number, fromToken: string, toToken: string) => boolean
  cashOut: (amount: number, method: string) => boolean
  setUserProfile: (profile: UserProfile) => void
  completeOnboarding: (name: string, username: string, age: number) => void
  resetWallet: () => void
  addToVault: (amount: number) => boolean
  withdrawFromVault: (amount: number) => boolean
}

const WalletContext = createContext<WalletContextType | null>(null)

const STORAGE_KEY = "minormint_wallet"

const initialState: WalletState = {
  balance: 0,
  vaultBalance: 0,
  transactions: [],
  userProfile: null,
  isOnboarded: false,
  gasFeesSaved: 0,
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>(initialState)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setState({
          ...parsed,
          transactions: parsed.transactions.map((t: Transaction & { timestamp: string }) => ({
            ...t,
            timestamp: new Date(t.timestamp),
          })),
          userProfile: parsed.userProfile
            ? {
                ...parsed.userProfile,
                createdAt: new Date(parsed.userProfile.createdAt),
              }
            : null,
        })
      } catch (e) {
        console.error("Failed to parse wallet data:", e)
      }
    }
    setIsHydrated(true)
  }, [])

  // Save to localStorage on state change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state, isHydrated])

  const deposit = (amount: number, description = "Deposit") => {
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      type: "incoming",
      title: description,
      description: "Funds added",
      amount: amount,
      timestamp: new Date(),
      status: "completed",
      icon: "deposit",
    }

    setState((prev) => ({
      ...prev,
      balance: prev.balance + amount,
      transactions: [transaction, ...prev.transactions],
      gasFeesSaved: prev.gasFeesSaved + 0.12,
    }))
  }

  const send = (amount: number, recipient: string): boolean => {
    if (amount > state.balance || amount <= 0) {
      return false
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      type: "outgoing",
      title: `Sent to ${recipient}`,
      description: "AI Guardian Approved",
      amount: -amount,
      timestamp: new Date(),
      status: "approved",
      icon: "send",
    }

    setState((prev) => ({
      ...prev,
      balance: prev.balance - amount,
      transactions: [transaction, ...prev.transactions],
      gasFeesSaved: prev.gasFeesSaved + 0.08,
    }))

    return true
  }

  const swap = (fromAmount: number, fromToken: string, toToken: string): boolean => {
    if (fromAmount > state.balance || fromAmount <= 0) {
      return false
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      type: "swap",
      title: `Swap ${fromToken} to ${toToken}`,
      description: "Instant Exchange",
      amount: 0,
      timestamp: new Date(),
      status: "completed",
      icon: "swap",
    }

    setState((prev) => ({
      ...prev,
      transactions: [transaction, ...prev.transactions],
      gasFeesSaved: prev.gasFeesSaved + 0.15,
    }))

    return true
  }

  const cashOut = (amount: number, method: string): boolean => {
    if (amount > state.balance || amount <= 0) {
      return false
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      type: "outgoing",
      title: `Cash Out - ${method}`,
      description: "Withdrawal",
      amount: -amount,
      timestamp: new Date(),
      status: "completed",
      icon: "cashout",
    }

    setState((prev) => ({
      ...prev,
      balance: prev.balance - amount,
      transactions: [transaction, ...prev.transactions],
      gasFeesSaved: prev.gasFeesSaved + 0.05,
    }))

    return true
  }

  const setUserProfile = (profile: UserProfile) => {
    setState((prev) => ({
      ...prev,
      userProfile: profile,
    }))
  }

  const completeOnboarding = (name: string, username: string, age: number) => {
    const profile: UserProfile = {
      name,
      username,
      age,
      isMinor: age < 18,
      createdAt: new Date(),
    }

    setState((prev) => ({
      ...prev,
      userProfile: profile,
      isOnboarded: true,
    }))
  }

  const resetWallet = () => {
    setState(initialState)
    localStorage.removeItem(STORAGE_KEY)
  }

  const addToVault = (amount: number): boolean => {
    if (amount > state.balance || amount <= 0) {
      return false
    }

    setState((prev) => ({
      ...prev,
      balance: prev.balance - amount,
      vaultBalance: prev.vaultBalance + amount,
    }))

    return true
  }

  const withdrawFromVault = (amount: number): boolean => {
    if (amount > state.vaultBalance || amount <= 0) {
      return false
    }

    setState((prev) => ({
      ...prev,
      balance: prev.balance + amount,
      vaultBalance: prev.vaultBalance - amount,
    }))

    return true
  }

  // Don't render children until hydrated to prevent hydration mismatch
  if (!isHydrated) {
    return null
  }

  return (
    <WalletContext.Provider
      value={{
        ...state,
        deposit,
        send,
        swap,
        cashOut,
        setUserProfile,
        completeOnboarding,
        resetWallet,
        addToVault,
        withdrawFromVault,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
