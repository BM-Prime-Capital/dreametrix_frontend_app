"use client"

import { Card } from "@/components/ui/card"
import { ParentClassesTable } from "@/components/parents/ParentClassesTable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import PageTitleH1 from "@/components/ui/page-title-h1"
import { RefreshCw, Loader2 } from "lucide-react"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { useParentFilters } from "@/hooks/useParentFilters"

export default function ParentClassesPage() {
  const [selectedChild, setSelectedChild] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [refreshKey, setRefreshKey] = useState(0)
  const { accessToken, refreshToken } = useRequestInfo()

  // Get filter data from API
  const { children, subjects, levels, loading: filtersLoading, error: filtersError, refreshFilters } = useParentFilters({
    accessToken,
    refreshToken
  })

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
    refreshFilters()
  }

  return (
    <section className="flex flex-col gap-4 w-full mx-auto px-8">
      <div className="flex justify-between items-center bg-[#3e81d4] px-4 py-3 rounded-md">
        <PageTitleH1 title="Classes" className="text-white"/>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="text-gray-700 font-medium">PARENT&apos;S CODE: 8787NK920</div>
        </div>
        
        <div className="flex gap-4">
          {filtersLoading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading filters...
            </div>
          ) : filtersError ? (
            <div className="text-red-500 text-sm">
              Error loading filters: {filtersError}
            </div>
          ) : (
            <>
              <Select value={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="All Children"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Children ({children.length})</SelectItem>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id.toString()}>
                      {child.first_name} {child.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="All Subjects"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="All Levels"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-700">Classes (1)</div>
        <Button 
          onClick={handleRefresh}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <ParentClassesTable 
        selectedChild={selectedChild}
        selectedSubject={selectedSubject}
        selectedLevel={selectedLevel}
        key={refreshKey}
      />
    </section>
  )
}
