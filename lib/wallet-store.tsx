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
  icon: "deposit" | "send" | "swap" | "cashout" | "allowance" | "gas-gift"
}

export interface UserProfile {
  name: string
  username: string
  email: string
  age: number
  dateOfBirth: string
  country: string
  isMinor: boolean
  createdAt: Date
  walletAddress: string
  accountTier: "teen" | "adult" | "premium"
  kycStatus: "pending" | "verified" | "enhanced"
}

export interface SecurityData {
  seedPhrase: string[]
  pin: string
  biometricsEnabled: boolean
  termsAccepted: boolean
  termsSignedAt: Date | null
  emailVerified: boolean
  twoFactorEnabled: boolean
  lastLogin: Date | null
}

interface WalletState {
  balance: number
  vaultBalance: number
  gasCredit: number
  transactions: Transaction[]
  userProfile: UserProfile | null
  security: SecurityData | null
  isOnboarded: boolean
  isLocked: boolean
  gasFeesSaved: number
}

interface WalletContextType extends WalletState {
  deposit: (amount: number, description?: string) => void
  send: (amount: number, recipient: string) => boolean
  swap: (fromAmount: number, fromToken: string, toToken: string) => boolean
  cashOut: (amount: number, method: string) => boolean
  setUserProfile: (profile: UserProfile) => void
  completeOnboarding: (profile: UserProfile, security: SecurityData) => void
  resetWallet: () => void
  addToVault: (amount: number) => boolean
  withdrawFromVault: (amount: number) => boolean
  unlockWallet: (pin: string) => boolean
  lockWallet: () => void
  verifyPin: (pin: string) => boolean
}

const WalletContext = createContext<WalletContextType | null>(null)

const STORAGE_KEY = "minormint_wallet"
const SESSION_KEY = "minormint_session"

// BIP39-like word list for seed phrase generation
const WORD_LIST = [
  "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse",
  "access", "accident", "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "act",
  "action", "actor", "actress", "actual", "adapt", "add", "addict", "address", "adjust", "admit",
  "adult", "advance", "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent",
  "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol", "alert",
  "alien", "all", "alley", "allow", "almost", "alone", "alpha", "already", "also", "alter",
  "always", "amateur", "amazing", "among", "amount", "amused", "analyst", "anchor", "ancient", "anger",
  "angle", "angry", "animal", "ankle", "announce", "annual", "another", "answer", "antenna", "antique",
  "anxiety", "any", "apart", "apology", "appear", "apple", "approve", "april", "arch", "arctic",
  "area", "arena", "argue", "arm", "armed", "armor", "army", "around", "arrange", "arrest",
  "arrive", "arrow", "art", "artefact", "artist", "artwork", "ask", "aspect", "assault", "asset",
  "assist", "assume", "asthma", "athlete", "atom", "attack", "attend", "attitude", "attract", "auction",
  "audit", "august", "aunt", "author", "auto", "autumn", "average", "avocado", "avoid", "awake",
  "aware", "away", "awesome", "awful", "awkward", "axis", "baby", "bachelor", "bacon", "badge",
  "bag", "balance", "balcony", "ball", "bamboo", "banana", "banner", "bar", "barely", "bargain",
  "barrel", "base", "basic", "basket", "battle", "beach", "bean", "beauty", "because", "become",
  "beef", "before", "begin", "behave", "behind", "believe", "below", "belt", "bench", "benefit",
  "best", "betray", "better", "between", "beyond", "bicycle", "bid", "bike", "bind", "biology",
  "bird", "birth", "bitter", "black", "blade", "blame", "blanket", "blast", "bleak", "bless",
  "blind", "blood", "blossom", "blouse", "blue", "blur", "blush", "board", "boat", "body",
  "boil", "bomb", "bone", "bonus", "book", "boost", "border", "boring", "borrow", "boss",
  "bottom", "bounce", "box", "boy", "bracket", "brain", "brand", "brass", "brave", "bread",
  "breeze", "brick", "bridge", "brief", "bright", "bring", "brisk", "broccoli", "broken", "bronze",
  "broom", "brother", "brown", "brush", "bubble", "buddy", "budget", "buffalo", "build", "bulb",
  "bulk", "bullet", "bundle", "bunker", "burden", "burger", "burst", "bus", "business", "busy",
  "butter", "buyer", "buzz", "cabbage", "cabin", "cable", "cactus", "cage", "cake", "call",
  "calm", "camera", "camp", "can", "canal", "cancel", "candy", "cannon", "canoe", "canvas",
  "canyon", "capable", "capital", "captain", "car", "carbon", "card", "cargo", "carpet", "carry",
  "cart", "case", "cash", "casino", "castle", "casual", "cat", "catalog", "catch", "category",
  "cattle", "caught", "cause", "caution", "cave", "ceiling", "celery", "cement", "census", "century",
  "cereal", "certain", "chair", "chalk", "champion", "change", "chaos", "chapter", "charge", "chase",
  "chat", "cheap", "check", "cheese", "chef", "cherry", "chest", "chicken", "chief", "child",
  "chimney", "choice", "choose", "chronic", "chuckle", "chunk", "churn", "cigar", "cinnamon", "circle",
  "citizen", "city", "civil", "claim", "clap", "clarify", "claw", "clay", "clean", "clerk",
  "clever", "click", "client", "cliff", "climb", "clinic", "clip", "clock", "clog", "close",
  "cloth", "cloud", "clown", "club", "clump", "cluster", "clutch", "coach", "coast", "coconut",
  "code", "coffee", "coil", "coin", "collect", "color", "column", "combine", "come", "comfort",
  "comic", "common", "company", "concert", "conduct", "confirm", "congress", "connect", "consider", "control",
  "convince", "cook", "cool", "copper", "copy", "coral", "core", "corn", "correct", "cost",
  "cotton", "couch", "country", "couple", "course", "cousin", "cover", "coyote", "crack", "cradle",
  "craft", "cram", "crane", "crash", "crater", "crawl", "crazy", "cream", "credit", "creek",
  "crew", "cricket", "crime", "crisp", "critic", "crop", "cross", "crouch", "crowd", "crucial",
  "cruel", "cruise", "crumble", "crunch", "crush", "cry", "crystal", "cube", "culture", "cup",
  "cupboard", "curious", "current", "curtain", "curve", "cushion", "custom", "cute", "cycle", "dad",
  "damage", "damp", "dance", "danger", "daring", "dash", "daughter", "dawn", "day", "deal",
  "debate", "debris", "decade", "december", "decide", "decline", "decorate", "decrease", "deer", "defense",
  "define", "defy", "degree", "delay", "deliver", "demand", "demise", "denial", "dentist", "deny",
  "depart", "depend", "deposit", "depth", "deputy", "derive", "describe", "desert", "design", "desk",
  "despair", "destroy", "detail", "detect", "develop", "device", "devote", "diagram", "dial", "diamond",
  "diary", "dice", "diesel", "diet", "differ", "digital", "dignity", "dilemma", "dinner", "dinosaur",
  "direct", "dirt", "disagree", "discover", "disease", "dish", "dismiss", "disorder", "display", "distance",
  "divert", "divide", "divorce", "dizzy", "doctor", "document", "dog", "doll", "dolphin", "domain",
  "donate", "donkey", "donor", "door", "dose", "double", "dove", "draft", "dragon", "drama"
]

function generateSeedPhrase(): string[] {
  const phrase: string[] = []
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * WORD_LIST.length)
    phrase.push(WORD_LIST[randomIndex])
  }
  return phrase
}

function generateWalletAddress(): string {
  const chars = "0123456789abcdef"
  let address = "0x"
  for (let i = 0; i < 40; i++) {
    address += chars[Math.floor(Math.random() * chars.length)]
  }
  return address
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

const initialState: WalletState = {
  balance: 0,
  vaultBalance: 0,
  gasCredit: 0,
  transactions: [],
  userProfile: null,
  security: null,
  isOnboarded: false,
  isLocked: true,
  gasFeesSaved: 0,
}

export { generateSeedPhrase, generateWalletAddress, generateOTP }

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>(initialState)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    const session = sessionStorage.getItem(SESSION_KEY)
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setState({
          ...parsed,
          transactions: parsed.transactions?.map((t: Transaction & { timestamp: string }) => ({
            ...t,
            timestamp: new Date(t.timestamp),
          })) || [],
          userProfile: parsed.userProfile
            ? {
                ...parsed.userProfile,
                createdAt: new Date(parsed.userProfile.createdAt),
              }
            : null,
          security: parsed.security
            ? {
                ...parsed.security,
                termsSignedAt: parsed.security.termsSignedAt ? new Date(parsed.security.termsSignedAt) : null,
                lastLogin: parsed.security.lastLogin ? new Date(parsed.security.lastLogin) : null,
              }
            : null,
          isLocked: parsed.isOnboarded ? session !== "unlocked" : false,
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
      description: "Funds added to wallet",
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
      description: "Withdrawal processed",
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

  const completeOnboarding = (profile: UserProfile, security: SecurityData) => {
    const gasGiftTransaction: Transaction = {
      id: crypto.randomUUID(),
      type: "incoming",
      title: "AI Guardian Welcome Gift",
      description: "Gas credit for your first transactions",
      amount: 0,
      timestamp: new Date(),
      status: "completed",
      icon: "gas-gift",
    }

    setState((prev) => ({
      ...prev,
      userProfile: profile,
      security: {
        ...security,
        lastLogin: new Date(),
      },
      isOnboarded: true,
      isLocked: false,
      balance: 0,
      gasCredit: 0.001,
      transactions: [gasGiftTransaction],
    }))
    
    sessionStorage.setItem(SESSION_KEY, "unlocked")
  }

  const resetWallet = () => {
    setState(initialState)
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(SESSION_KEY)
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

  const unlockWallet = (pin: string): boolean => {
    if (state.security?.pin === pin) {
      setState((prev) => ({
        ...prev,
        isLocked: false,
        security: prev.security ? { ...prev.security, lastLogin: new Date() } : null,
      }))
      sessionStorage.setItem(SESSION_KEY, "unlocked")
      return true
    }
    return false
  }

  const lockWallet = () => {
    setState((prev) => ({ ...prev, isLocked: true }))
    sessionStorage.removeItem(SESSION_KEY)
  }

  const verifyPin = (pin: string): boolean => {
    return state.security?.pin === pin
  }

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
        unlockWallet,
        lockWallet,
        verifyPin,
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
