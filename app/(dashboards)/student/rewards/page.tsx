"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Eye, Trash2 } from "lucide-react"

interface Transaction {
  id: number
  class: string
  reason: string
  credit: number
  date: string
}

interface MonthlyData {
  month: string
  value: number
  color: string
}

interface HistoryItem {
  id: number
  date: string
  message: string
}

const transactions: Transaction[] = [
  {
    id: 1,
    class: "Class 5 - Sci",
    reason: "Points in Character - Emotional Intelligence",
    credit: 1000,
    date: "11/21",
  },
  {
    id: 2,
    class: "Class 5 - Math",
    reason: "You bought a pass to choose your group",
    credit: -200,
    date: "11/26",
  },
  {
    id: 3,
    class: "Class 6 - Math",
    reason: "You bought a pass to choose your group",
    credit: -500,
    date: "11/28",
  },
  {
    id: 4,
    class: "Class 7 - Sci",
    reason: "Points in Character - Emotional Intelligence",
    credit: 1000,
    date: "11/29",
  },
]

const monthlyData: MonthlyData[] = [
  { month: "January", value: 600, color: "#4FC3F7" },
  { month: "February", value: 800, color: "#29B6F6" },
  { month: "March", value: 400, color: "#0288D1" },
  { month: "April", value: 900, color: "#01579B" },
  { month: "May", value: 600, color: "#4FC3F7" },
  { month: "June", value: 200, color: "#EF5350" },
  { month: "July", value: 400, color: "#0288D1" },
  { month: "August", value: 900, color: "#01579B" },
  { month: "September", value: 600, color: "#4FC3F7" },
  { month: "October", value: 800, color: "#29B6F6" },
  { month: "November", value: 400, color: "#0288D1" },
  { month: "December", value: 1100, color: "#01579B" },
]

const historyItems: HistoryItem[] = [
  { id: 1, date: "11/05", message: "I need help with this exercise: -23 - 45 ..." },
  { id: 2, date: "11/02", message: "I need information about the structure ..." },
  { id: 3, date: "11/02", message: "I need information about the structure ..." },
  { id: 4, date: "11/02", message: "I need information about the structure ..." },
  { id: 5, date: "10/30", message: "I need information about the structure ..." },
  { id: 6, date: "10/30", message: "I need information about the structure ..." },
]

export default function RewardsPage() {
  const [isExchangeOpen, setIsExchangeOpen] = useState(false)
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false)
  const [isBestMonthOpen, setIsBestMonthOpen] = useState(false)
  const [isWorstMonthOpen, setIsWorstMonthOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [selectedExchange, setSelectedExchange] = useState<string>("")
  const [exchangeCost, setExchangeCost] = useState(0)
  const bestMonth = { month: "December", value: 1100 }
  const worstMonth = { month: "June", value: 300 }
  const handleExchangeSelect = (value: string) => {
    setSelectedExchange(value)
    if (value === "group-pass") {
      setExchangeCost(200)
    } else if (value === "seat-pass") {
      setExchangeCost(100)
    } else {
      setExchangeCost(0)
    }
  }

  const maxValue = Math.max(...monthlyData.map((item) => item.value))

  return (
    <section className="flex flex-col gap-4 w-full mx-auto p-4">
      <h1 className="text-destructive text-xl font-bold">REWARDS</h1>

      <div className="flex gap-4">
        <button
          className="bg-secondary text-white px-6 py-3 rounded-md flex items-center gap-2 w-[200px] hover:bg-secondary-hover transition-colors"
          onClick={() => setIsExchangeOpen(true)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 10L3 14L7 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 18L21 14L17 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M3 14H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Exchange</span>
        </button>

        <button
          className="bg-accent text-white px-6 py-3 rounded-md flex items-center gap-2 w-[200px] hover:bg-accent/80 transition-colors"
          onClick={() => setIsTransactionsOpen(true)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M12 11H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 16H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 11H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 16H8.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>View Transactions</span>
        </button>
      </div>

      <Card className="p-6 flex justify-between items-center">
        <h2 className="text-2xl text-foreground font-medium">Balance</h2>
        <div className="text-4xl font-bold text-primary">2,300 D</div>
      </Card>

      <div
        className="bg-accent/10 p-6 rounded-lg flex justify-between items-center cursor-pointer hover:bg-accent/20 transition-colors"
        onClick={() => setIsBestMonthOpen(true)}
      >
        <h2 className="text-xl text-foreground">Your Best Month</h2>
        <div className="text-xl font-medium">{bestMonth.month}</div>
        <div className="text-2xl font-bold text-success flex items-center">
          1,100 D
          <Eye className="ml-4 text-primary" />
        </div>
      </div>

      <div
        className="bg-accent/10 p-6 rounded-lg flex justify-between items-center cursor-pointer hover:bg-accent/20 transition-colors"
        onClick={() => setIsWorstMonthOpen(true)}
      >
        <h2 className="text-xl text-foreground">Your Worst Month</h2>
        <div className="text-xl font-medium">{worstMonth.month}</div>
        <div className="text-2xl font-bold text-destructive flex items-center">
          300 D
          <Eye className="ml-4 text-primary" />
        </div>
      </div>

      <div className="bg-accent/10 p-6 rounded-lg flex justify-between items-center">
        <h2 className="text-xl text-foreground">Average</h2>
        <div className="text-xl font-medium">Every Month</div>
        <div className="text-2xl font-bold text-foreground">900 D</div>
      </div>

      {/* Exchange Dialog */}
      <Dialog open={isExchangeOpen} onOpenChange={setIsExchangeOpen}>
        <DialogContent className="sm:max-w-[500px] p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-foreground">Exchange</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsExchangeOpen(false)} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-between items-center bg-accent/10 p-2 px-4 rounded-md mb-6">
            <span className="text-muted-foreground">Credit</span>
            <span className="text-2xl font-medium text-primary">2300 D</span>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4 items-center">
              <Select value={selectedExchange} onValueChange={handleExchangeSelect}>
                <SelectTrigger className="w-full rounded-full">
                  <SelectValue placeholder="Select what you want to exchange" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="group-pass">Pass to choose your group</SelectItem>
                  <SelectItem value="seat-pass">Pass to choose your seat</SelectItem>
                </SelectContent>
              </Select>

              <div className="bg-accent/10 p-2 px-4 rounded-md min-w-[80px] text-center">
                <span className="text-xl font-medium text-primary">{exchangeCost} D</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4">
              <Button variant="ghost" onClick={() => setIsExchangeOpen(false)} className="text-muted-foreground">
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary-hover text-white rounded-md px-8 py-6">EXCHANGE</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transactions Dialog */}
      <Dialog open={isTransactionsOpen} onOpenChange={setIsTransactionsOpen}>
        <DialogContent className="sm:max-w-[800px] p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-foreground">Transactions</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsTransactionsOpen(false)} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="border-t mb-6"></div>

          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2 font-bold text-foreground">CLASS</th>
                <th className="pb-2 font-bold text-foreground">REASON</th>
                <th className="pb-2 font-bold text-foreground text-right">CREDIT</th>
                <th className="pb-2 font-bold text-foreground text-right">DATE</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={transaction.id} className={index % 2 === 0 ? "bg-accent/10" : ""}>
                  <td className="py-4 text-muted-foreground">{transaction.class}</td>
                  <td className="py-4 text-muted-foreground">{transaction.reason}</td>
                  <td
                    className={`py-4 text-right font-medium ${transaction.credit > 0 ? "text-success" : "text-destructive"}`}
                  >
                    <span className="bg-accent/10 px-2 py-1 rounded">
                      {transaction.credit > 0 ? "+" : ""}
                      {transaction.credit} D
                    </span>
                  </td>
                  <td className="py-4 text-muted-foreground text-right">{transaction.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DialogContent>
      </Dialog>

      {/* Best Month Dialog */}
      <Dialog open={isBestMonthOpen} onOpenChange={setIsBestMonthOpen}>
        <DialogContent className="sm:max-w-[500px] p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-foreground">Your Best Month</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsBestMonthOpen(false)} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="border-t mb-6"></div>

          <div className="space-y-3">
            {monthlyData.map((item) => (
              <div key={item.month} className="flex items-center">
                <div
                  className="h-6 rounded-sm"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor:
                      item.month === "December" ? "hsl(var(--success))" : item.month === "June" ? "hsl(var(--destructive))" : item.color,
                    maxWidth: "70%",
                  }}
                ></div>
                <span className="ml-2 text-muted-foreground">{item.month}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between text-muted-foreground text-sm">
            <span>0</span>
            <span>200</span>
            <span>400</span>
            <span>800</span>
            <span>1000</span>
            <span>1200</span>
          </div>
        </DialogContent>
      </Dialog>

      {/* Worst Month Dialog - Same as Best Month but with different title */}
      <Dialog open={isWorstMonthOpen} onOpenChange={setIsWorstMonthOpen}>
        <DialogContent className="sm:max-w-[500px] p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-foreground">Your Worst Month</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsWorstMonthOpen(false)} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="border-t mb-6"></div>

          <div className="space-y-3">
            {monthlyData.map((item) => (
              <div key={item.month} className="flex items-center">
                <div
                  className="h-6 rounded-sm"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor:
                      item.month === "December" ? "hsl(var(--success))" : item.month === "June" ? "hsl(var(--destructive))" : item.color,
                    maxWidth: "70%",
                  }}
                ></div>
                <span className="ml-2 text-muted-foreground">{item.month}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between text-muted-foreground text-sm">
            <span>0</span>
            <span>200</span>
            <span>400</span>
            <span>800</span>
            <span>1000</span>
            <span>1200</span>
          </div>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="sm:max-w-[500px] p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-foreground">History</h2>
            <Button variant="ghost" size="icon" onClick={() => setIsHistoryOpen(false)} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="border-t mb-6"></div>

          <p className="text-muted-foreground mb-4">The history is automatically deleted in 10 days.</p>

          <div className="space-y-4">
            {historyItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="text-muted-foreground w-16">{item.date}</div>
                <div className="flex-1 text-foreground">{item.message}</div>
                <div className="flex gap-2">
                  <button className="text-primary" title="View">
                    <Eye className="h-5 w-5" />
                  </button>
                  <button className="text-destructive" title="Delete">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}

