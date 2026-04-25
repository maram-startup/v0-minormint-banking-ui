"use client"

import { X, Bell, Shield, TrendingUp, Gift, CheckCircle2 } from "lucide-react"

interface NotificationsModalProps {
  isOpen: boolean
  onClose: () => void
}

const notifications = [
  {
    id: 1,
    type: "security",
    icon: Shield,
    title: "Transaction Approved",
    message: "AI Guardian approved your $15 purchase at Amazon Books",
    time: "2 min ago",
    read: false,
    color: "text-[#00FFA3]",
    bgColor: "bg-[#00FFA3]/10"
  },
  {
    id: 2,
    type: "money",
    icon: TrendingUp,
    title: "Allowance Received",
    message: "You received $50 weekly allowance from Parent",
    time: "1 hour ago",
    read: false,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10"
  },
  {
    id: 3,
    type: "promo",
    icon: Gift,
    title: "New Savings Goal",
    message: "Start saving for your dream iPhone today!",
    time: "3 hours ago",
    read: true,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10"
  },
  {
    id: 4,
    type: "security",
    icon: Shield,
    title: "Spending Alert",
    message: "You have used 75% of your daily limit",
    time: "Yesterday",
    read: true,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10"
  },
  {
    id: 5,
    type: "general",
    icon: Bell,
    title: "Welcome to MinorMint",
    message: "Your AI Guardian is now active and protecting your funds",
    time: "2 days ago",
    read: true,
    color: "text-[#00FFA3]",
    bgColor: "bg-[#00FFA3]/10"
  }
]

export function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  if (!isOpen) return null

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center">
      <div className="w-full max-w-md h-[85vh] bg-[#0a0a0a] rounded-t-3xl border border-[var(--glass-border)] border-b-0 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#00FFA3]" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#00FFA3] flex items-center justify-center">
                  <span className="text-[10px] font-bold text-black">{unreadCount}</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white text-lg">Notifications</h3>
              <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--glass)] flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        
        {/* Mark all as read */}
        <div className="px-4 py-2 border-b border-[var(--glass-border)]">
          <button className="text-sm text-[#00FFA3] font-medium hover:underline">
            Mark all as read
          </button>
        </div>
        
        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              className={`w-full flex items-start gap-3 p-4 border-b border-[var(--glass-border)] hover:bg-white/5 transition-colors ${
                !notification.read ? "bg-white/[0.02]" : ""
              }`}
            >
              <div className={`w-10 h-10 rounded-xl ${notification.bgColor} flex items-center justify-center flex-shrink-0`}>
                <notification.icon className={`w-5 h-5 ${notification.color}`} />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{notification.title}</span>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-[#00FFA3]" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
              </div>
            </button>
          ))}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-[var(--glass-border)]">
          <button className="w-full py-3 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] text-white font-medium hover:bg-white/10 transition-colors">
            Notification Settings
          </button>
        </div>
      </div>
    </div>
  )
}
