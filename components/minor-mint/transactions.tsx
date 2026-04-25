"use client"

import { ArrowUpRight, ArrowDownLeft, ShoppingBag, BookOpen, Coffee, Gamepad2 } from "lucide-react"

const transactions = [
  {
    id: 1,
    type: "incoming",
    title: "Allowance Received",
    description: "Weekly allowance",
    amount: "+$50.00",
    icon: ArrowDownLeft,
    iconBg: "bg-[#00FFA3]/10",
    iconColor: "text-[#00FFA3]",
    time: "Today, 2:30 PM",
    status: "completed"
  },
  {
    id: 2,
    type: "outgoing",
    title: "Amazon Books",
    description: "Educational • AI Approved",
    amount: "-$15.00",
    icon: BookOpen,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    time: "Today, 11:20 AM",
    status: "approved"
  },
  {
    id: 3,
    type: "outgoing",
    title: "Starbucks",
    description: "Food & Drinks",
    amount: "-$6.50",
    icon: Coffee,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    time: "Yesterday",
    status: "completed"
  },
  {
    id: 4,
    type: "outgoing",
    title: "Steam Games",
    description: "Entertainment • Limited",
    amount: "-$19.99",
    icon: Gamepad2,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
    time: "Apr 22",
    status: "limited"
  },
  {
    id: 5,
    type: "outgoing",
    title: "Nike Store",
    description: "Shopping",
    amount: "-$89.00",
    icon: ShoppingBag,
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-400",
    time: "Apr 20",
    status: "completed"
  },
]

export function Transactions() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white">Recent Activity</h2>
        <button className="text-sm text-[#00FFA3] font-medium">See All</button>
      </div>
      
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] hover:border-white/10 transition-colors"
          >
            <div className={`w-10 h-10 rounded-xl ${tx.iconBg} flex items-center justify-center`}>
              <tx.icon className={`w-5 h-5 ${tx.iconColor}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{tx.title}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {tx.description}
                {tx.status === "approved" && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#00FFA3]/10 text-[#00FFA3] text-[10px]">
                    ✓ AI
                  </span>
                )}
                {tx.status === "limited" && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px]">
                    ⚠ Limit
                  </span>
                )}
              </p>
            </div>
            
            <div className="text-right">
              <p className={`font-semibold ${tx.type === "incoming" ? "text-[#00FFA3]" : "text-white"}`}>
                {tx.amount}
              </p>
              <p className="text-xs text-muted-foreground">{tx.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
