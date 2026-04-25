"use client"

import { useState } from "react"
import { Bot, Send, Sparkles, CheckCircle2, AlertCircle, X } from "lucide-react"

interface Message {
  id: number
  role: "ai" | "user"
  content: string
  status?: "approved" | "pending" | "declined"
  timestamp: string
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "ai",
    content: "Welcome back! I&apos;m your AI Guardian. I analyze every transaction to keep your finances safe and smart. 🛡️",
    timestamp: "2:30 PM"
  },
  {
    id: 2,
    role: "user",
    content: "I need $15 for some educational books",
    timestamp: "2:31 PM"
  },
  {
    id: 3,
    role: "ai",
    content: "I&apos;ve analyzed your request for $15. Since it&apos;s for educational books, I&apos;ve signed the transaction. Approved! ✅",
    status: "approved",
    timestamp: "2:31 PM"
  },
  {
    id: 4,
    role: "user",
    content: "Can I spend $200 on gaming skins?",
    timestamp: "2:45 PM"
  },
  {
    id: 5,
    role: "ai",
    content: "I&apos;m protecting your vault funds. This exceeds 50% of your liquid balance and isn&apos;t an essential purchase. Let&apos;s discuss a savings goal instead? 💡",
    status: "declined",
    timestamp: "2:45 PM"
  }
]

interface AIGuardianProps {
  isOpen: boolean
  onClose: () => void
}

export function AIGuardian({ isOpen, onClose }: AIGuardianProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return
    
    const newMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    
    setMessages([...messages, newMessage])
    setInput("")
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        role: "ai",
        content: "I&apos;m analyzing your request. Give me a moment to evaluate this transaction for your financial wellbeing... 🔍",
        status: "pending",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
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
                Active & Protecting
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
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-[#00FFA3] text-black rounded-br-md"
                    : "bg-[var(--glass)] border border-[var(--glass-border)] text-white rounded-bl-md"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-between mt-2 gap-2">
                  <span className={`text-xs ${message.role === "user" ? "text-black/60" : "text-muted-foreground"}`}>
                    {message.timestamp}
                  </span>
                  {message.status && (
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
        </div>
        
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
              className="w-8 h-8 rounded-full bg-[#00FFA3] flex items-center justify-center hover:shadow-[var(--neon-glow)] transition-shadow"
            >
              <Send className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
