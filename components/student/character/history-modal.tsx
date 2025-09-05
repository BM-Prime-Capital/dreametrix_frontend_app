"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CharacterRating } from "@/types/character"
import { X, Calendar, TrendingUp, TrendingDown } from "lucide-react"

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: CharacterRating | null;
  allData?: CharacterRating[]; // All character data for trend analysis
}

export function HistoryModal({ isOpen, onClose, selectedItem, allData = [] }: HistoryModalProps) {
  if (!selectedItem) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Filter data for the same class
  const classHistory = allData.filter(item => 
    item.class_info === selectedItem.class_info && 
    item.character_id !== selectedItem.character_id
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const calculateTrend = () => {
    if (classHistory.length < 2) return null;
    
    const recent = classHistory[0];
    const older = classHistory[1];
    
    const recentGood = recent.good_statistics_character.length;
    const recentBad = recent.bad_statistics_character.length;
    const olderGood = older.good_statistics_character.length;
    const olderBad = older.bad_statistics_character.length;
    
    const recentScore = recentGood - recentBad;
    const olderScore = olderGood - olderBad;
    
    return recentScore - olderScore;
  };

  const trend = calculateTrend();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 max-h-[80vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-gray-700">Character History</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 transition-colors" 
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="border-t mb-4"></div>

          <div className="text-gray-500 mb-6">
            Class {selectedItem.class_info} - Character Development Timeline
          </div>

          {/* Trend Indicator */}
          {trend !== null && (
            <div className={`flex items-center gap-2 mb-6 p-4 rounded-lg ${
              trend > 0 ? 'bg-green-50 text-green-700' : 
              trend < 0 ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-700'
            }`}>
              {trend > 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : trend < 0 ? (
                <TrendingDown className="h-5 w-5" />
              ) : (
                <Calendar className="h-5 w-5" />
              )}
              <span className="font-medium">
                {trend > 0 ? 'Improving trend' : 
                 trend < 0 ? 'Declining trend' : 'Stable performance'}
              </span>
            </div>
          )}

          {/* Current Record */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-blue-800">Current Record</h4>
              <span className="text-sm text-blue-600">{formatDate(selectedItem.date)}</span>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-green-600 font-bold">+{selectedItem.good_statistics_character.length}</span>
                <span className="text-sm text-gray-600">Good behaviors</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-red-600 font-bold">-{selectedItem.bad_statistics_character.length}</span>
                <span className="text-sm text-gray-600">Bad behaviors</span>
              </div>
            </div>
          </div>

          {/* History Timeline */}
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            <h4 className="font-semibold text-gray-700 mb-3">Previous Records</h4>
            
            {classHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No previous records found for this class.</p>
                <p className="text-sm">This might be the first character assessment.</p>
              </div>
            ) : (
              classHistory.map((record) => {
                const goodCount = record.good_statistics_character.length;
                const badCount = record.bad_statistics_character.length;
                const netScore = goodCount - badCount;
                
                return (
                  <div key={record.character_id} className="flex items-center gap-4 p-3 bg-white border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{formatDate(record.date)}</span>
                        <span className="text-xs text-gray-500">{record.period}</span>
                      </div>
                      <div className="flex gap-3 mt-1">
                        <span className="text-green-600 text-sm">+{goodCount}</span>
                        <span className="text-red-600 text-sm">-{badCount}</span>
                        <span className={`text-sm font-medium ${
                          netScore > 0 ? 'text-green-700' : 
                          netScore < 0 ? 'text-red-700' : 'text-gray-700'
                        }`}>
                          Net: {netScore > 0 ? '+' : ''}{netScore}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Summary Stats */}
          {classHistory.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-2">Class Average</h5>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {Math.round(classHistory.reduce((acc, r) => acc + r.good_statistics_character.length, 0) / classHistory.length * 10) / 10}
                  </div>
                  <div className="text-xs text-gray-600">Avg Good</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">
                    {Math.round(classHistory.reduce((acc, r) => acc + r.bad_statistics_character.length, 0) / classHistory.length * 10) / 10}
                  </div>
                  <div className="text-xs text-gray-600">Avg Bad</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {classHistory.length + 1}
                  </div>
                  <div className="text-xs text-gray-600">Total Records</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}