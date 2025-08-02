// components/support/FAQ/FAQCategoryNav.tsx
'use client';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const categories = [
  { id: 'general', name: 'General Help' },
  { id: 'classes', name: 'Classes' },
  { id: 'assignments', name: 'Assignments' },
  { id: 'gradebook', name: 'Gradebook' },
  { id: 'technical', name: 'Technical Issues' },
];

export function FAQCategoryNav() {
  const params = useParams();
  const currentCategory = params.category || 'all';

  return (
    <Card className="p-4">
      <h2 className="font-semibold mb-4">Categories</h2>
      <nav className="space-y-2">
        <Link
          href="/teacher/support/faq"
          className={`block px-3 py-2 rounded-lg ${currentCategory === 'all' ? 'bg-accent' : 'hover:bg-muted'}`}
        >
          All Categories
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/teacher/support/faq/categories/${category.id}`}
            className={`block px-3 py-2 rounded-lg ${currentCategory === category.id ? 'bg-accent' : 'hover:bg-muted'}`}
          >
            {category.name}
          </Link>
        ))}
      </nav>
    </Card>
  );
}