"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { GanttChartSquare, BookCopy, ClipboardList, ArrowRight, NotebookText, Wand2 } from 'lucide-react';
import PageTitleH1 from '@/components/ui/page-title-h1';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScopeAndSequenceForm } from '@/components/plan/scope-and-sequence-form';
import { UnitPlanForm } from '@/components/plan/unit-plan-form';
import { LessonPlanForm } from '@/components/plan/lesson-plan-form';
import { useState } from 'react';

export default function PlansPage() {
  const [isScopeAndSequenceDialogOpen, setIsScopeAndSequenceDialogOpen] = useState(false);
  const [isUnitPlanDialogOpen, setIsUnitPlanDialogOpen] = useState(false);
  const [isLessonPlanDialogOpen, setIsLessonPlanDialogOpen] = useState(false);

  const planningTools = [
    {
      title: "Scope & Sequence",
      description: "Outline your academic year, mapping units and standards month by month.",
      icon: GanttChartSquare,
      href: "/teacher/plan/scope-and-sequence",
      cta: "Manage Scope & Sequence",
      color: "blue",
    },
    {
      title: "Unit Plans",
      description: "Design comprehensive units by organizing standards, assessments, and activities.",
      icon: BookCopy,
      href: "/teacher/plan/unit-plans",
      cta: "Manage Unit Plans",
      color: "yellow",
    },
    {
      title: "Lesson Plans",
      description: "Craft detailed daily lesson plans with clear objectives, procedures, and materials.",
      icon: ClipboardList,
      href: "/teacher/plan/lesson-plans",
      cta: "Manage Lesson Plans",
      color: "green",
    },
  ];

  const handleScopeAndSequenceSuccess = () => {
    setIsScopeAndSequenceDialogOpen(false);
  };

  const handleUnitPlanSuccess = () => {
    setIsUnitPlanDialogOpen(false);
  };

  const handleLessonPlanSuccess = () => {
    setIsLessonPlanDialogOpen(false);
  };

  return (
    <div className="space-y-8 p-4 sm:p-6">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#3e81d4] to-[#2a6fc9] px-6 py-5 rounded-lg shadow-md mb-8">
        <div className="flex items-center gap-4">
          <NotebookText className="h-9 w-9 text-white" />
          <div>
            <PageTitleH1 title="Planning Center" className="text-white" />
            <p className="text-white/90 mt-1 text-sm">
              Access and manage your Scope & Sequence, Unit Plans, and Lesson Plans.
            </p>
          </div>
        </div>
      </header>

      {/* Planning Tools Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planningTools.map((tool) => (
          <Card
            key={tool.title}
            className="flex flex-col border border-gray-100 hover:shadow-lg transition-all duration-200"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${tool.color === "blue" ? "bg-blue-50" : tool.color === "yellow" ? "bg-yellow-50" : "bg-green-50"}`}>
                  <tool.icon className={`h-7 w-7 ${tool.color === "blue" ? "text-blue-600" : tool.color === "yellow" ? "text-yellow-600" : "text-green-600"}`} />
                </div>
                <CardTitle className="text-lg font-semibold">
                  {tool.title}
                </CardTitle>
              </div>
              <CardDescription className="text-gray-600">
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-500">
                Create, edit, or view your existing {tool.title.toLowerCase()}.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className={`w-full ${
                  tool.color === "blue"
                    ? "text-blue-700 border border-blue-300 bg-white hover:bg-blue-50"
                    : tool.color === "yellow"
                    ? "text-yellow-700 border border-yellow-300 bg-white hover:bg-yellow-50"
                    : "text-green-700 border border-green-300 bg-white hover:bg-green-50"
                }`}
              >
                <Link href={tool.href} className="flex items-center justify-center">
                  <span>{tool.cta}</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>


      {/* AI-Powered Tools Section */}
{/* ✨ AI-Powered Tools Section */}
<section className="relative bg-white p-10 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
  <div className="relative z-10 max-w-5xl mx-auto text-center">
    <div className="flex items-center justify-center gap-3 mb-4">
      <Wand2 className="h-6 w-6 text-indigo-500" />
      <h2 className="text-3xl font-semibold tracking-tight text-gray-800">
        AI-Powered Tools
      </h2>
    </div>
    <p className="text-gray-500 text-base max-w-2xl mx-auto mb-10">
      Smart assistants designed to save you time and inspire your teaching flow.
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Activity Suggester */}
      <Card className="group bg-gray-50 hover:bg-white border border-gray-200 rounded-xl transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
            <Wand2 className="h-5 w-5 text-indigo-500 group-hover:text-indigo-600 transition-transform duration-200" />
            Activity Suggester
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm leading-relaxed">
            Instantly generate original and engaging class activities powered by AI.
          </p>
        </CardContent>
        <CardFooter className="pt-4">
          <Button
            asChild
            variant="outline"
            className="w-full text-sm font-medium border-gray-300 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            <Link href="/teacher/plan/tools/activity-suggester">Try now</Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Alignment Verifier */}
      <Card className="group bg-gray-50 hover:bg-white border border-gray-200 rounded-xl transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">
            <Wand2 className="h-5 w-5 text-indigo-500 group-hover:text-indigo-600 transition-transform duration-200" />
            Alignment Verifier
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm leading-relaxed">
            Check your lesson plans’ alignment with official standards in seconds.
          </p>
        </CardContent>
        <CardFooter className="pt-4">
          <Button
            asChild
            variant="outline"
            className="w-full text-sm font-medium border-gray-300 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            <Link href="/teacher/plan/tools/alignment-verifier">Try now</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</section>


      {/* Dialogs */}
      <Dialog open={isScopeAndSequenceDialogOpen} onOpenChange={setIsScopeAndSequenceDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sm:flex sm:items-center sm:gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <GanttChartSquare className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="font-bold text-xl">Create New Scope & Sequence</DialogTitle>
              <DialogDescription className="text-gray-600">
                Outline the academic year by mapping out units, standards, and pacing month by month.
              </DialogDescription>
            </div>
          </DialogHeader>
          <ScopeAndSequenceForm onSubmitSuccess={handleScopeAndSequenceSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={isUnitPlanDialogOpen} onOpenChange={setIsUnitPlanDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sm:flex sm:items-center sm:gap-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <BookCopy className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <DialogTitle className="font-bold text-xl">Create New Unit Plan</DialogTitle>
              <DialogDescription className="text-gray-600">
                Lay the foundation for a series of lessons by defining standards, objectives, and assessments for your unit.
              </DialogDescription>
            </div>
          </DialogHeader>
          <UnitPlanForm onSubmitSuccess={handleUnitPlanSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={isLessonPlanDialogOpen} onOpenChange={setIsLessonPlanDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sm:flex sm:items-center sm:gap-4">
            <div className="bg-green-100 p-3 rounded-full">
              <ClipboardList className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <DialogTitle className="font-bold text-xl">Create New Lesson Plan</DialogTitle>
              <DialogDescription className="text-gray-600">
                Outline your daily instruction, from objectives to assessments.
              </DialogDescription>
            </div>
          </DialogHeader>
          <LessonPlanForm onSubmitSuccess={handleLessonPlanSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
