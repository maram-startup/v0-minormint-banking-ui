"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, PiggyBank, Target, Plus, ChevronRight, Sparkles, Lock } from "lucide-react"

const savingsGoals = [
  { id: 1, name: "New iPhone", target: 1200, current: 450, icon: "📱", color: "from-blue-500 to-purple-500" },
  { id: 2, name: "Summer Trip", target: 800, current: 320, icon: "✈️", color: "from-orange-500 to-pink-500" },
  { id: 3, name: "College Fund", target: 5000, current: 1200, icon: "🎓", color: "from-green-500 to-emerald-500" },
]

const educationalStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 178.50, change: 2.34, changePercent: 1.33, trend: "up" },
  { symbol: "GOOGL", name: "Alphabet", price: 141.20, change: -1.15, changePercent: -0.81, trend: "down" },
  { symbol: "MSFT", name: "Microsoft", price: 378.90, change: 4.56, changePercent: 1.22, trend: "up" },
  { symbol: "TSLA", name: "Tesla", price: 245.30, change: 8.90, changePercent: 3.76, trend: "up" },
]

export function InvestView() {
  const [activeTab, setActiveTab] = useState<"goals" | "learn">("goals")

  return (
    <div className="space-y-6 pb-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#00FFA3]/10 to-transparent border border-[#00FFA3]/20">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank className="w-4 h-4 text-[#00FFA3]" />
            <span className="text-xs text-muted-foreground">Total Saved</span>
          </div>
          <p className="text-2xl font-bold text-white">$1,970</p>
          <p className="text-xs text-[#00FFA3] mt-1">+$120 this month</p>
        </div>
        
        <div className="p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)]">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-[#00FFA3]" />
            <span className="text-xs text-muted-foreground">Active Goals</span>
          </div>
          <p className="text-2xl font-bold text-white">3</p>
          <p className="text-xs text-muted-foreground mt-1">On track</p>
        </div>
      </div>
      
      {/* Tab Switcher */}
      <div className="flex gap-2 p-1 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)]">
        <button
          onClick={() => setActiveTab("goals")}
          className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${
            activeTab === "goals"
              ? "bg-[#00FFA3] text-black"
              : "text-muted-foreground hover:text-white"
          }`}
        >
          Savings Goals
        </button>
        <button
          onClick={() => setActiveTab("learn")}
          className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${
            activeTab === "learn"
              ? "bg-[#00FFA3] text-black"
              : "text-muted-foreground hover:text-white"
          }`}
        >
          Learn Investing
        </button>
      </div>
      
      {activeTab === "goals" ? (
        <>
          {/* Savings Goals */}
          <div className="space-y-3">
            {savingsGoals.map((goal) => {
              const progress = (goal.current / goal.target) * 100
              return (
                <button
                  key={goal.id}
                  className="w-full p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] hover:border-white/20 transition-all text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${goal.color} flex items-center justify-center text-2xl`}>
                      {goal.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-white">{goal.name}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">${goal.current} of ${goal.target}</span>
                        <span className="text-[#00FFA3] font-medium">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-black/50 overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${goal.color}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          
          {/* Add Goal Button */}
          <button className="w-full p-4 rounded-2xl border-2 border-dashed border-[var(--glass-border)] hover:border-[#00FFA3]/50 flex items-center justify-center gap-2 text-muted-foreground hover:text-[#00FFA3] transition-all">
            <Plus className="w-5 h-5" />
            <span className="font-medium">Create New Goal</span>
          </button>
        </>
      ) : (
        <>
          {/* Educational Stocks */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00FFA3]" />
              <span className="text-sm font-medium text-white">Practice Portfolio</span>
              <span className="px-2 py-0.5 rounded-full bg-[#00FFA3]/10 text-[10px] font-mono text-[#00FFA3]">SIMULATION</span>
            </div>
            
            {educationalStocks.map((stock) => (
              <div
                key={stock.symbol}
                className="p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)] hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <span className="font-bold text-white text-sm">{stock.symbol[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{stock.symbol}</p>
                      <p className="text-xs text-muted-foreground">{stock.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">${stock.price}</p>
                    <p className={`text-xs flex items-center gap-0.5 justify-end ${
                      stock.trend === "up" ? "text-[#00FFA3]" : "text-red-400"
                    }`}>
                      {stock.trend === "up" ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {stock.changePercent > 0 ? "+" : ""}{stock.changePercent}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Real Investing Locked */}
          <div className="p-4 rounded-2xl bg-[var(--glass)] border border-[var(--glass-border)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                <Lock className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Real Investing</p>
                <p className="text-xs text-muted-foreground">Available when you turn 18</p>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <span className="text-xs text-muted-foreground">Locked</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
