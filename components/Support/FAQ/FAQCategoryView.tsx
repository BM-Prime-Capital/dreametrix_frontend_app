// components/support/FAQ/FAQCategoryView.tsx
'use client';
import { Hits, InstantSearch } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch';
import { FAQItem } from './FAQItem';


const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

export function FAQCategoryView({ categoryId }: { categoryId: string }) {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="dreaMetrix_faq"
      searchState={{
        refine: [`category:${categoryId}`]
      }}
    >
      <div className="space-y-4">
        <h2 className="text-xl font-bold capitalize">{categoryId.replace('_', ' ')}</h2>
        <Hits hitComponent={FAQItem} />
      </div>
    </InstantSearch>
  );
}