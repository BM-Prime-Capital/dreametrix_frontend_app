"use client"

import { CharacterRating } from "@/types/character"
import { Loader2, AlertCircle, MessageCircle, HistoryIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CharacterTableProps {
  data: CharacterRating[];
  loading: boolean;
  error: string | null;
  onOpenComments?: (item: CharacterRating) => void;
  onOpenHistory?: (item: CharacterRating) => void;
}

export function CharacterTable({ data, loading, error, onOpenComments, onOpenHistory }: CharacterTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const calculateStats = (rating: CharacterRating) => {
    const goodCount = rating.good_statistics_character.length;
    const badCount = rating.bad_statistics_character.length;
    const total = goodCount + badCount;
    const percentage = total > 0 ? (goodCount / total) * 100 : 0;
    
    return {
      goodCount,
      badCount,
      percentage
    };
  };

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading character data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">No character records found</div>
          <div className="text-gray-400 text-sm">Try selecting a different period or check back later.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-6 border-b bg-gray-50">
        <div className="p-4 font-bold text-gray-700">DATE / PERIOD</div>
        <div className="p-4 font-bold text-gray-700">CLASS / TEACHER</div>
        <div className="p-4 font-bold text-gray-700">CHARACTER</div>
        <div className="p-4 font-bold text-gray-700">STATISTICS</div>
        <div className="p-4 font-bold text-gray-700">COMMENTS</div>
        <div className="p-4 font-bold text-gray-700">HISTORY</div>
      </div>

      {data.map((item, index) => {
        const stats = calculateStats(item);
        
        return (
          <div key={item.id} className={`grid grid-cols-6 ${index % 2 === 0 ? "bg-blue-50/50" : "bg-white"} hover:bg-blue-100/50 transition-colors`}>
            <div className="p-4 text-gray-600 font-medium">
              <div className="font-semibold">{formatDate(item.date)}</div>
              <div className="text-sm text-gray-500">{item.period || 'All day'}</div>
            </div>
            <div className="p-4">
              <div className="font-semibold text-black">{item.class.name}</div>
              <div className="text-sm text-gray-500">{item.class.subject}</div>
              <div className="text-xs text-gray-400">{item.teacher.full_name}</div>
            </div>
            <div className="p-4 flex items-center gap-3">
              <span className="text-[#4CAF50] font-bold text-lg">{stats.goodCount}</span>
              <span className="text-gray-400 text-xl">/</span>
              <span className="text-[#FF5252] font-bold text-lg">{stats.badCount}</span>
            </div>
            <div className="p-4 flex items-center">
              <div className="w-full h-3 rounded-full overflow-hidden bg-gray-200 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-[#4CAF50] to-[#FF5252] shadow-sm"
                  style={{
                    width: `${stats.percentage}%`,
                  }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-600">{Math.round(stats.percentage)}%</span>
            </div>
            <div className="p-4">
              <button 
                className="text-[#25AAE1] hover:text-[#1D8CB3] hover:scale-110 transition-all duration-200" 
                onClick={() => onOpenComments?.(item)}
                title="View Comments"
              >
                <MessageCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <button 
                className="text-[#25AAE1] hover:text-[#1D8CB3] hover:scale-110 transition-all duration-200" 
                onClick={() => onOpenHistory?.(item)}
                title="View History"
              >
                <HistoryIcon className="h-6 w-6" />
              </button>
              <div className="flex items-center text-gray-500">
                Class {item.class_info}
                <MessageIcon />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function MessageIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-[#25AAE1] ml-2"
    >
      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}