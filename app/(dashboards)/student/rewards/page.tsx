"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X, Eye, ArrowLeft } from "lucide-react"

interface Transaction {
  id: number
  class: string
  credit: number
  date: string
  type: string
}

interface HistoryItem {
  id: number
  date: string
  message: string
}

const transactions: Transaction[] = [
  { id: 1, class: "Class 5 - Math", credit: 100, date: "2024-01-15", type: "assignment" },
  { id: 2, class: "Class 5 - Science", credit: -50, date: "2024-01-14", type: "exchange" },
  { id: 3, class: "Class 5 - English", credit: 75, date: "2024-01-13", type: "participation" },
  { id: 4, class: "Class 5 - History", credit: 25, date: "2024-01-12", type: "homework" },
]

const historyItems: HistoryItem[] = [
  { id: 1, date: "01/15", message: "Completed Math Assignment" },
  { id: 2, date: "01/14", message: "Exchanged 50 points for reward" },
  { id: 3, date: "01/13", message: "Active participation in class" },
  { id: 4, date: "01/12", message: "Submitted homework on time" },
]

export default function RewardsPage() {
  const [exchangeCost] = useState(100)
  const [isExchangeOpen, setIsExchangeOpen] = useState(false)
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen">
      {/* Header avec gradient moderne */}
      <div className="bg-gradient-to-r from-[#25AAE1] via-[#25AAE1] to-[#1D8CB3] p-8 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4 text-white">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-3 rounded-full transition-all duration-200"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-wide mb-1">
              REWARDS
            </h1>
            <p className="text-white/80 text-sm">Manage your points and rewards</p>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-6 w-full mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen rounded-2xl">
        {/* Header Section avec design moderne */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-xl flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#25AAE1]">Rewards Center</h2>
              <p className="text-gray-600 text-sm">Earn and exchange points for rewards</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button
              className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white px-8 py-4 rounded-xl flex items-center gap-3 hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md"
              onClick={() => setIsExchangeOpen(true)}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <span className="font-semibold">Exchange</span>
            </Button>
            
            <Button
              className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white px-8 py-4 rounded-xl flex items-center gap-3 hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md"
              onClick={() => setIsTransactionsOpen(true)}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="font-semibold">Transactions</span>
            </Button>
          </div>
        </div>

        {/* Balance Card avec design moderne */}
        <Card className="p-8 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white rounded-2xl shadow-xl border-0">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">Balance</h2>
            <div className="text-5xl font-bold">2,300 D</div>
          </div>
        </Card>

        {/* Performance Cards avec design moderne */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-to-r from-[#25AAE1]/10 to-[#D15A9D]/10 rounded-2xl flex justify-between items-center cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-0">
            <div>
              <h2 className="text-xl text-gray-800 font-semibold">Your Best Month</h2>
              <div className="text-2xl font-bold text-[#4CAF50] flex items-center mt-2">
                December
                <Eye className="ml-4 text-[#25AAE1]" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-[#25AAE1]/10 to-[#D15A9D]/10 rounded-2xl flex justify-between items-center cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-0">
            <div>
              <h2 className="text-xl text-gray-800 font-semibold">Your Worst Month</h2>
              <div className="text-2xl font-bold text-[#FF5252] flex items-center mt-2">
                June
                <Eye className="ml-4 text-[#25AAE1]" />
              </div>
            </div>
          </Card>
        </div>

        {/* Average Card avec design moderne */}
        <Card className="p-6 bg-gradient-to-r from-[#25AAE1]/10 to-[#D15A9D]/10 rounded-2xl flex justify-between items-center border-0">
          <div>
            <h2 className="text-xl text-gray-800 font-semibold">Average</h2>
            <div className="text-2xl font-bold text-gray-800 mt-2">900 D</div>
          </div>
        </Card>

        {/* Exchange Dialog */}
        <Dialog open={isExchangeOpen} onOpenChange={setIsExchangeOpen}>
          <DialogContent className="sm:max-w-[400px] p-0">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-gray-700">Exchange Points</h2>
                <button onClick={() => setIsExchangeOpen(false)} className="text-gray-500 hover:text-gray-700" title="Close">
                  <X size={18} />
                </button>
              </div>

              <div className="border-t mb-6"></div>

              <div className="space-y-4">
                <div className="flex justify-between items-center bg-gradient-to-r from-[#25AAE1]/10 to-[#D15A9D]/10 p-4 rounded-xl">
                  <span className="text-gray-600">Credit</span>
                  <span className="text-2xl font-medium text-[#25AAE1]">2300 D</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Exchange Cost</span>
                  <div className="bg-gradient-to-r from-[#25AAE1]/10 to-[#D15A9D]/10 p-3 rounded-xl min-w-[100px] text-center">
                    <span className="text-xl font-medium text-[#25AAE1]">{exchangeCost} D</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] hover:shadow-lg text-white rounded-xl px-8 py-6">EXCHANGE</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Transactions Dialog */}
        <Dialog open={isTransactionsOpen} onOpenChange={setIsTransactionsOpen}>
          <DialogContent className="sm:max-w-[600px] p-0">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-gray-700">Transaction History</h2>
                <button onClick={() => setIsTransactionsOpen(false)} className="text-gray-500 hover:text-gray-700" title="Close">
                  <X size={18} />
                </button>
              </div>

              <div className="border-t mb-6"></div>

              <div className="space-y-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-2 font-bold text-gray-700 text-left">CLASS</th>
                      <th className="pb-2 font-bold text-gray-700 text-right">CREDIT</th>
                      <th className="pb-2 font-bold text-gray-700 text-right">DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr key={transaction.id} className={index % 2 === 0 ? "bg-gradient-to-r from-[#25AAE1]/5 to-[#D15A9D]/5" : ""}>
                        <td className="py-4 text-gray-600">{transaction.class}</td>
                        <td className={`py-4 text-right font-medium ${transaction.credit > 0 ? "text-[#4CAF50]" : "text-[#FF5252]"}`}>
                          {transaction.credit > 0 ? "+" : ""}{transaction.credit} D
                          <span className="bg-gradient-to-r from-[#25AAE1]/10 to-[#D15A9D]/10 px-2 py-1 rounded ml-2 text-xs">
                            {transaction.type}
                          </span>
                        </td>
                        <td className="py-4 text-gray-600 text-right">{transaction.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* History Dialog */}
        <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <DialogContent className="sm:max-w-[500px] p-0">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-gray-700">History</h2>
                <button onClick={() => setIsHistoryOpen(false)} className="text-gray-500 hover:text-gray-700" title="Close">
                  <X size={18} />
                </button>
              </div>

              <div className="border-t mb-6"></div>

              <p className="text-gray-600 mb-4">The history is automatically deleted in 10 days.</p>

              <div className="space-y-4">
                {historyItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-gray-500 w-16 text-sm">{item.date}</div>
                    <div className="flex-1 text-gray-700">{item.message}</div>
                    <div className="flex gap-2">
                      <button className="text-[#25AAE1]" title="View">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-[#FF5252]" title="Delete">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  )
}

