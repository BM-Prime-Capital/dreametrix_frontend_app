'use client';

import { useState, useMemo } from 'react';
import { HelpCircle, Search, ChevronDown, ChevronUp, ChevronLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

type FAQCategory = {
  id: string;
  name: string;
  icon?: React.ReactNode;
};

type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  relatedFeatures?: string[];
  lastUpdated?: string;
};

const FAQ_CATEGORIES: FAQCategory[] = [
  { id: 'general', name: 'General' },
  { id: 'classes', name: 'Classes' },
  { id: 'assignments', name: 'Assignments' },
  { id: 'gradebook', name: 'Gradebook' },
  { id: 'attendance', name: 'Attendance' },
  { id: 'communication', name: 'Communication' },
];

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-001',
    question: 'How do I create a new class?',
    answer: 'Navigate to the "CLASSES" section and click "Add Class". Fill in the class details including name, subject, schedule, and student roster. You can also import students from existing classes.',
    category: 'classes',
    relatedFeatures: ['classes'],
    lastUpdated: '2023-10-15',
  },
  {
    id: 'faq-002',
    question: 'What types of assignments can I create?',
    answer: 'You can create homework, quizzes, exams, projects, and presentations. Each type has customizable settings including due dates, attachments, and grading rubrics.',
    category: 'assignments',
    relatedFeatures: ['assignments', 'digital_library'],
    lastUpdated: '2023-11-02',
  },
  {
    id: 'faq-003',
    question: 'How does the Gradebook calculate averages?',
    answer: 'The Gradebook automatically calculates weighted averages based on your grading system. You can configure weightings for different assignment types in Gradebook Settings.',
    category: 'gradebook',
    relatedFeatures: ['gradebook'],
    lastUpdated: '2023-09-28',
  },
  {
    id: 'faq-004',
    question: 'Can I take attendance for multiple classes at once?',
    answer: 'Yes, use the bulk attendance mode in the ATTENDANCE module. You can mark attendance across all your classes for a specific date with just a few clicks.',
    category: 'attendance',
    relatedFeatures: ['attendance'],
    lastUpdated: '2023-10-20',
  },
  {
    id: 'faq-005',
    question: 'How do I message parents about missing assignments?',
    answer: 'In the COMMUNICATE section, use the "Message Parents" feature filtered by students with missing work. You can include assignment details automatically.',
    category: 'communication',
    relatedFeatures: ['communicate', 'assignments'],
    lastUpdated: '2023-11-10',
  },
  {
    id: 'faq-006',
    question: 'What is BIG BRA.I.N and how does it help me?',
    answer: 'BIG BRA.I.N is our AI teaching assistant that analyzes student performance to suggest: 1) Remediation activities 2) Enrichment opportunities 3) Class-wide trends 4) Individual student interventions.',
    category: 'general',
    relatedFeatures: ['big_brain'],
    lastUpdated: '2023-11-15',
  },
  {
    id: 'faq-007',
    question: 'Can I reuse lesson plans from previous years?',
    answer: 'Absolutely. The DIGITAL LIBRARY archives all your materials. Use the "Copy to Current Year" feature to adapt previous content for your current classes.',
    category: 'general',
    relatedFeatures: ['digital_library', 'plan'],
    lastUpdated: '2023-10-05',
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter(faq => {
      const matchesSearch = 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        activeCategory === 'all' || faq.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const toggleFAQ = (id: string) => {
    const newSet = new Set(expandedItems);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedItems(newSet);
  };

  const expandAll = () => {
    setExpandedItems(new Set(filteredFAQs.map(faq => faq.id)));
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
            <div className="flex flex-col gap-4">
         <Button variant="ghost" size="sm" className="w-fit" asChild>
          <Link href="/teacher/support" className="flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Support Center</span>
          </Link>
        </Button>
        
        <div className="flex items-center gap-3">
          <HelpCircle className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
            <p className="text-muted-foreground">
              Find answers to common questions about using DreaMetrix
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold px-2">Categories</h3>
            <Button
              variant={activeCategory === 'all' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => setActiveCategory('all')}
            >
              All Questions
            </Button>
            {FAQ_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* FAQ content */}
        <div className="lg:col-span-3">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-3">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="border rounded-lg overflow-hidden bg-background hover:shadow-sm transition-shadow"
                >
                  <button
                    className="w-full p-4 text-left flex justify-between items-center"
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    <h3 className="font-medium text-lg">{faq.question}</h3>
                    {expandedItems.has(faq.id) ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  
                  {expandedItems.has(faq.id) && (
                    <>
                      <Separator />
                      <div className="p-4 pt-2">
                        <p className="text-muted-foreground">{faq.answer}</p>
                        {faq.relatedFeatures && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="text-xs text-muted-foreground">Related to:</span>
                            {faq.relatedFeatures.map(feature => (
                              <span 
                                key={feature} 
                                className="text-xs bg-accent px-2 py-1 rounded"
                              >
                                {feature.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-2">
              <HelpCircle className="h-10 w-10 text-muted-foreground" />
              <h3 className="text-lg font-medium">No results found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Support CTA */}
      <div className="border rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 p-6 mt-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-medium text-lg">Still need help?</h3>
            <p className="text-muted-foreground text-sm">
              Our support team is ready to assist you with any questions.
            </p>
          </div>
          <Button className="whitespace-nowrap">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}