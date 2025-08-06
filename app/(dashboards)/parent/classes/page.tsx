"use client"

import { Card } from "@/components/ui/card"
import { ParentClassesTable } from "@/components/parents/ParentClassesTable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import PageTitleH1 from "@/components/ui/page-title-h1"
import { RefreshCw, Loader2 } from "lucide-react"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { getParentClasses, ParentClass } from "@/services/ParentClassService"

export default function ParentClassesPage() {
  const [selectedChild, setSelectedChild] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [refreshKey, setRefreshKey] = useState(0)
  const [classes, setClasses] = useState<ParentClass[]>([])
  const [filtersLoading, setFiltersLoading] = useState(true)
  const [filtersError, setFiltersError] = useState<string | null>(null)
  
  const { accessToken, refreshToken } = useRequestInfo()

  // Fetch classes data
  const fetchClasses = async () => {
    if (!accessToken) return
    
    setFiltersLoading(true)
    setFiltersError(null)
    
    try {
      const classesData = await getParentClasses(accessToken, refreshToken)
      setClasses(classesData)
    } catch (error) {
      setFiltersError(error instanceof Error ? error.message : "Error loading classes")
    } finally {
      setFiltersLoading(false)
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [accessToken, refreshToken])

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
    fetchClasses()
  }

  // Extract unique subjects from classes
  const subjects = classes.map(cls => ({
    id: cls.subject,
    name: cls.subject
  })).filter((subject, index, self) => 
    self.findIndex(s => s.id === subject.id) === index
  )

  // Extract unique levels (grades) from classes
  const levels = classes.map(cls => ({
    id: cls.level,
    name: `Grade ${cls.level}`
  })).filter((level, index, self) => 
    self.findIndex(l => l.id === level.id) === index
  )

  // Extract unique children from classes
  const children = classes.flatMap(cls => 
    cls.students.map(student => ({
      id: student.id,
      name: `${student.first_name} ${student.last_name}`
    }))
  ).filter((child, index, self) => 
    self.findIndex(c => c.id === child.id) === index
  )

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
                      {child.name}
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
        <div className="text-lg font-semibold text-gray-700">Classes ({classes.length})</div>
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
        classes={classes}
        key={refreshKey}
      />
    </section>
  )
}
