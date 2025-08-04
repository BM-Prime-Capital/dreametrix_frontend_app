'use client';
import Link from "next/link";
import { ChevronLeft, HelpCircle, FilePlus, FolderOpen, LifeBuoy, ChevronRight, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const supportLinks = [
  {
    title: "Browse FAQ",
    description: "Find answers to common questions about using DreaMetrix",
    href: "/teacher/support/faq",
    icon: HelpCircle,
  },
  {
    title: "Create Ticket",
    description: "Submit a new support request to our team",
    href: "/teacher/support/new",
    icon: FilePlus,
  },
  {
    title: "My Tickets",
    description: "Track the status of your support requests",
    href: "/teacher/support/my-tickets",
    icon: FolderOpen,
  },
];

export default function SupportHomePage() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header with back button */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" className="w-fit" asChild>
          <Link href="/teacher" className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </Button>
        
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <LifeBuoy className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Support Center</h1>
            <p className="text-muted-foreground mt-2">
              Get help with DreaMetrix features and troubleshoot issues
            </p>
          </div>
        </div>
      </div>

      {/* Support cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {supportLinks.map(({ title, description, href, icon: Icon }) => (
          <Link key={href} href={href} className="group">
            <Card className="h-full transition-all hover:border-primary hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="mb-4">{description}</CardDescription>
                <Button 
                  variant="link" 
                  className="px-0 text-primary hover:no-underline group-hover:underline"
                >
                  Access
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Emergency support section */}
      <div className="border rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-medium text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Need immediate assistance?
            </h3>
            <p className="text-muted-foreground text-sm">
              Our team is available weekdays from 8AM to 6PM
            </p>
          </div>
          {/* <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="gap-2" asChild>
              <Link href="mailto:support@dreametrix.com">
                <Mail className="h-4 w-4" />
                Email Support
              </Link>
            </Button>
            <Button className="gap-2" asChild>
              <Link href="/teacher/support/new">
                <AlertCircle className="h-4 w-4" />
                Emergency Ticket
              </Link>
            </Button>
          </div> */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" asChild>
              <Link href="mailto:support@dreametrix.com" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>Email Support</span>
              </Link>
            </Button>
            <Button asChild>
              <Link href="/teacher/support/new" className="flex items-center gap-2 text-white">
                <AlertCircle className="h-4 w-4" />
                <span className="whitespace-nowrap">Emergency Ticket</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}