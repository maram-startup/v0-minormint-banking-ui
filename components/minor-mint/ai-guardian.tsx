"use client"

import { useState, useEffect, useRef } from "react"
import { Bot, Send, Sparkles, CheckCircle2, AlertCircle, X, Lightbulb, TrendingUp, PiggyBank } from "lucide-react"
import { useWallet } from "@/lib/wallet-store"

interface Message {
  id: number
  role: "ai" | "user"
  content: string
  status?: "approved" | "pending" | "declined" | "tip"
  timestamp: string
}

interface AIGuardianProps {
  isOpen: boolean
  onClose: () => void
}

export function AIGuardian({ isOpen, onClose }: AIGuardianProps) {
  const { balance, userProfile, transactions } = useWallet()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Generate context-aware welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessages = generateWelcomeMessages()
      setMessages(welcomeMessages)
    }
  }, [isOpen, balance, userProfile])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const generateWelcomeMessages = (): Message[] => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userName = userProfile?.name?.split(' ')[0] || 'there'
    
    const msgs: Message[] = [
      {
        id: 1,
        role: "ai",
        content: `Welcome back, ${userName}! I'm your AI Guardian, here to protect and guide your financial journey.`,
        timestamp: now
      }
    ]

    // Add balance-aware tips
    if (balance === 0) {
      msgs.push({
        id: 2,
        role: "ai",
        content: "I notice your balance is $0.00. Here are some ways to start building your savings:",
        timestamp: now
      })
      msgs.push({
        id: 3,
        role: "ai",
        content: "1. Ask family for your weekly allowance\n2. Do chores for extra cash\n3. Start a small side hustle\n4. Save birthday or holiday money\n\nEvery dollar counts! Tap 'Receive' to add your first funds.",
        status: "tip",
        timestamp: now
      })
    } else if (balance < 50) {
      msgs.push({
        id: 2,
        role: "ai",
        content: `Great start! You have $${balance.toFixed(2)} saved. Try to reach $50 to unlock your first savings milestone!`,
        status: "tip",
        timestamp: now
      })
    } else if (balance < 100) {
      msgs.push({
        id: 2,
        role: "ai",
        content: `You're doing well with $${balance.toFixed(2)}! Keep it up - you're almost at the $100 mark. Consider moving some to your Vault for extra protection.`,
        status: "tip",
        timestamp: now
      })
    } else {
      msgs.push({
        id: 2,
        role: "ai",
        content: `Impressive! With $${balance.toFixed(2)} saved, you're building strong financial habits. I'll help protect every transaction you make.`,
        timestamp: now
      })
    }

    return msgs
  }

  const generateAIResponse = (userMessage: string): Message => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const lowerMessage = userMessage.toLowerCase()
    
    // Balance check
    if (lowerMessage.includes('balance') || lowerMessage.includes('how much')) {
      return {
        id: messages.length + 2,
        role: "ai",
        content: `Your current balance is $${balance.toFixed(2)}. ${balance === 0 ? "Tap 'Receive' to add your first funds!" : "Keep up the great saving habits!"}`,
        timestamp: now
      }
    }

    // Saving tips
    if (lowerMessage.includes('save') || lowerMessage.includes('saving') || lowerMessage.includes('tips')) {
      return {
        id: messages.length + 2,
        role: "ai",
        content: "Here are my top saving tips:\n\n1. Save at least 20% of any money you receive\n2. Use the Vault to lock away savings\n3. Set specific goals (new phone, college fund)\n4. Track every expense - small purchases add up!\n5. Wait 24 hours before big purchases",
        status: "tip",
        timestamp: now
      }
    }

    // Spending request
    if (lowerMessage.includes('buy') || lowerMessage.includes('spend') || lowerMessage.includes('want')) {
      const amountMatch = userMessage.match(/\$?(\d+)/);
      const amount = amountMatch ? parseInt(amountMatch[1]) : 0;
      
      if (amount > balance) {
        return {
          id: messages.length + 2,
          role: "ai",
          content: `I can't approve that - it exceeds your available balance of $${balance.toFixed(2)}. Let's work on building your savings first!`,
          status: "declined",
          timestamp: now
        }
      }
      
      if (amount > balance * 0.5) {
        return {
          id: messages.length + 2,
          role: "ai",
          content: `That's more than 50% of your balance. I'd recommend sleeping on it - if you still want it tomorrow, we can discuss. Big purchases deserve careful thought!`,
          status: "pending",
          timestamp: now
        }
      }

      if (lowerMessage.includes('book') || lowerMessage.includes('education') || lowerMessage.includes('learn')) {
        return {
          id: messages.length + 2,
          role: "ai",
          content: `Educational purchase detected! I've approved this transaction. Investing in knowledge is always a smart choice.`,
          status: "approved",
          timestamp: now
        }
      }

      return {
        id: messages.length + 2,
        role: "ai",
        content: `I'm reviewing your request. Is this a need or a want? If it's a want, consider saving for it gradually rather than spending all at once.`,
        status: "pending",
        timestamp: now
      }
    }

    // Earning money
    if (lowerMessage.includes('earn') || lowerMessage.includes('money') || lowerMessage.includes('make')) {
      return {
        id: messages.length + 2,
        role: "ai",
        content: "Ways to earn money at your age:\n\n1. Household chores\n2. Tutoring younger students\n3. Pet sitting or dog walking\n4. Lawn care or yard work\n5. Selling crafts or artwork\n6. Online freelancing (age permitting)\n\nStart small and build your reputation!",
        status: "tip",
        timestamp: now
      }
    }

    // Default response
    return {
      id: messages.length + 2,
      role: "ai",
      content: `I'm here to help you make smart financial decisions. ${balance === 0 ? "Your first step should be adding funds - tap 'Receive' to get started!" : `You currently have $${balance.toFixed(2)} to work with.`} What would you like to know about saving, spending, or earning?`,
      timestamp: now
    }
  }

  const handleSend = () => {
    if (!input.trim()) return
    
    const newMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    setMessages(prev => [...prev, newMessage])
    setInput("")
    
    // Generate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(input)
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center">
      <div className="w-full max-w-md h-[85vh] bg-[#0a0a0a] rounded-t-3xl border border-[var(--glass-border)] border-b-0 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00FFA3] to-[#00cc82] flex items-center justify-center">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00FFA3] rounded-full border-2 border-[#0a0a0a]" />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Guardian</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#00FFA3]" />
                {userProfile?.isMinor ? "Your Private Advisor" : "Active & Protecting"}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--glass)] flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Balance Display */}
        <div className="px-4 py-3 border-b border-[var(--glass-border)] bg-[var(--glass)]">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Your Balance</span>
            <span className="font-semibold text-white">${balance.toFixed(2)}</span>
          </div>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-[#00FFA3] text-black rounded-br-md"
                    : "bg-[var(--glass)] border border-[var(--glass-border)] text-white rounded-bl-md"
                }`}
              >
                {message.status === "tip" && message.role === "ai" && (
                  <div className="flex items-center gap-1 mb-2 text-[#00FFA3]">
                    <Lightbulb className="w-4 h-4" />
                    <span className="text-xs font-medium">Financial Tip</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <div className="flex items-center justify-between mt-2 gap-2">
                  <span className={`text-xs ${message.role === "user" ? "text-black/60" : "text-muted-foreground"}`}>
                    {message.timestamp}
                  </span>
                  {message.status && message.status !== "tip" && (
                    <span className={`text-xs flex items-center gap-1 ${
                      message.status === "approved" ? "text-[#00FFA3]" : 
                      message.status === "declined" ? "text-red-400" : 
                      "text-yellow-400"
                    }`}>
                      {message.status === "approved" ? <CheckCircle2 className="w-3 h-3" /> : 
                       message.status === "declined" ? <AlertCircle className="w-3 h-3" /> : 
                       <Sparkles className="w-3 h-3" />}
                      {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {balance === 0 && (
          <div className="px-4 py-2 border-t border-[var(--glass-border)]">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button 
                onClick={() => setInput("How can I start saving?")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 text-[#00FFA3] text-xs whitespace-nowrap"
              >
                <PiggyBank className="w-3 h-3" />
                How to start?
              </button>
              <button 
                onClick={() => setInput("How can I earn money?")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 text-[#00FFA3] text-xs whitespace-nowrap"
              >
                <TrendingUp className="w-3 h-3" />
                Earn money
              </button>
              <button 
                onClick={() => setInput("Give me saving tips")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 text-[#00FFA3] text-xs whitespace-nowrap"
              >
                <Lightbulb className="w-3 h-3" />
                Saving tips
              </button>
            </div>
          </div>
        )}
        
        {/* Input */}
        <div className="p-4 border-t border-[var(--glass-border)]">
          <div className="flex items-center gap-2 bg-[var(--glass)] border border-[var(--glass-border)] rounded-2xl px-4 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask your AI Guardian..."
              className="flex-1 bg-transparent text-white placeholder:text-muted-foreground focus:outline-none text-sm"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-full bg-[#00FFA3] flex items-center justify-center hover:shadow-[var(--neon-glow)] transition-shadow disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
