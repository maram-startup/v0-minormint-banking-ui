"use client"

import { ArrowUpRight, ArrowDownLeft, RefreshCw, Landmark, Wallet, Gift, Sparkles } from "lucide-react"
import { useWallet, Transaction } from "@/lib/wallet-store"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  deposit: ArrowDownLeft,
  send: ArrowUpRight,
  swap: RefreshCw,
  cashout: Landmark,
  allowance: Gift,
  "gas-gift": Sparkles,
}

const iconBgMap: Record<string, string> = {
  deposit: "bg-[#00FFA3]/10",
  send: "bg-red-500/10",
  swap: "bg-purple-500/10",
  cashout: "bg-orange-500/10",
  allowance: "bg-blue-500/10",
  "gas-gift": "bg-amber-500/10",
}

const iconColorMap: Record<string, string> = {
  deposit: "text-[#00FFA3]",
  send: "text-red-400",
  swap: "text-purple-400",
  cashout: "text-orange-400",
  allowance: "text-blue-400",
  "gas-gift": "text-amber-400",
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function Transactions() {
  const { transactions, balance } = useWallet()

  // Show empty state if no transactions
  if (transactions.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">Recent Activity</h2>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-16 h-16 rounded-full bg-[var(--glass)] border border-[var(--glass-border)] flex items-center justify-center mb-4">
            <Wallet className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No transactions yet</h3>
          <p className="text-sm text-muted-foreground text-center max-w-[250px]">
            Start your financial journey by adding funds with the &quot;Receive&quot; button above.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white">Recent Activity</h2>
        <button className="text-sm text-[#00FFA3] font-medium">See All</button>
      </div>
      
      <div className="space-y-3">
        {transactions.slice(0, 10).map((tx) => {
          const Icon = iconMap[tx.icon] || ArrowDownLeft
          const iconBg = iconBgMap[tx.icon] || "bg-white/10"
          const iconColor = iconColorMap[tx.icon] || "text-white"

          return (
            <div
              key={tx.id}
              className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] hover:border-white/10 transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{tx.title}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {tx.description}
                  {tx.status === "approved" && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#00FFA3]/10 text-[#00FFA3] text-[10px]">
                      AI Approved
                    </span>
                  )}
                  {tx.status === "pending" && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px]">
                      Pending
                    </span>
                  )}
                </p>
              </div>
              
              <div className="text-right">
                <p className={`font-semibold ${tx.type === "incoming" ? "text-[#00FFA3]" : tx.type === "swap" ? "text-purple-400" : "text-white"}`}>
                  {tx.type === "incoming" ? "+" : tx.type === "swap" ? "" : ""}${Math.abs(tx.amount).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">{formatTimeAgo(tx.timestamp)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
