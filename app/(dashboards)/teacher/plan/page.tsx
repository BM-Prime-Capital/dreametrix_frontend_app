
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { GanttChartSquare, BookCopy, ClipboardList, ArrowRight, NotebookText } from 'lucide-react';
import PageTitleH1 from '@/components/ui/page-title-h1';

export default function PlansPage() {
  const planningTools = [
    {
      title: "Scope & Sequence",
      description: "Outline your academic year, mapping units and standards month by month.",
      icon: GanttChartSquare,
      href: "/teacher/plan/scope-and-sequence",
      cta: "Manage Scope & Sequence",
    },
    {
      title: "Unit Plans",
      description: "Design comprehensive units by organizing standards, assessments, and activities.",
      icon: BookCopy,
      href: "/teacher/plan/unit-plans",
      cta: "Manage Unit Plans",
    },
    {
      title: "Lesson Plans",
      description: "Craft detailed daily lesson plans with clear objectives, procedures, and materials.",
      icon: ClipboardList,
      href: "/teacher/plan/lesson-plans",
      cta: "Manage Lesson Plans",
    },
  ];

  return (
    <div className="space-y-8">
      <header className="bg-[#3e81d4] px-4 py-3 rounded-md">
        <div className="flex items-center gap-4">
          <NotebookText className="h-8 w-8 text-white" />
          <PageTitleH1 title="Planning Center" className="text-white" />
        </div>
        <p className="text-white mt-2 ml-12">
          Access and manage your Scope & Sequence, Unit Plans, and Lesson Plans.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planningTools.map((tool) => (
          <Card key={tool.title} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline" >
                <tool.icon className="h-6 w-6 text-blue-500" />
                {tool.title}
              </CardTitle>
              <CardDescription>
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* You can add more specific content here if needed in the future */}
              <p className="text-sm text-muted-foreground">
                Click below to view and create your {tool.title.toLowerCase()}.
              </p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full bg-purple-500 text-white hover:bg-blue-600">
                <Link href={tool.href} className="flex items-center justify-center">
                  <span>{tool.cta}</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>
       <section className="bg-card p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold font-headline mb-3">Quick Create</h2>
        <p className="text-muted-foreground mb-4">
          Start planning right away by creating a new document.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button asChild className="bg-blue-500 hover:bg-primary/90 text-primary-foreground">
            <Link href="/teacher/plan/scope-and-sequence/create">New Scope & Sequence</Link>
          </Button>
          <Button asChild className=" bg-yellow-500 hover:bg-primary/90 text-primary-foreground">
            <Link href="/teacher/plan/unit-plans/create">New Unit Plan</Link>
          </Button>
          <Button asChild className="bg-green-500 hover:bg-primary/90 text-primary-foreground">
            <Link href="/teacher/plan/lesson-plans/create">New Lesson Plan</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
