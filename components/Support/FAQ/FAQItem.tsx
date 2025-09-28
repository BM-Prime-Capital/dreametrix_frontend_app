// components/support/FAQ/FAQItem.tsx
'use client';
import { Highlight } from 'react-instantsearch-dom';

export function FAQItem({ hit }: { hit: any }) {
  return (
    <div className="border rounded-lg p-4 mb-4">
      <h3 className="font-medium text-lg">
        <Highlight attribute="question" hit={hit} />
      </h3>
      <p className="text-muted-foreground mt-2">
        <Highlight attribute="answer" hit={hit} />
      </p>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs bg-accent px-2 py-1 rounded">
          {hit.category}
        </span>
      </div>
    </div>
  );
}