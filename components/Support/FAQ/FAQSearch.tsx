// components/support/FAQ/FAQSearch.tsx
'use client';
import { InstantSearch, SearchBox, Hits, Highlight } from 'react-instantsearch-dom';
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

const HitComponent = ({ hit }: { hit: any }) => (
  <article className="mb-6 last:mb-0">
    <h3 className="text-lg font-semibold">
      <Highlight attribute="question" hit={hit} />
    </h3>
    <p className="text-muted-foreground mt-1">
      <Highlight attribute="answer" hit={hit} />
    </p>
    <div className="mt-2 flex items-center gap-2">
      <span className="text-xs bg-accent px-2 py-1 rounded">
        {hit.category}
      </span>
      <span className="text-xs text-muted-foreground">
        Updated: {new Date(hit.updatedAt).toLocaleDateString()}
      </span>
    </div>
  </article>
);

export function FAQSearch() {
  return (
    <InstantSearch 
      searchClient={searchClient} 
      indexName="dreaMetrix_faq"
    >
      <div className="mb-6">
        <SearchBox 
        translations={{
          placeholder: 'Search knowledge base...',
        }}
      />
      </div>
      <Hits hitComponent={HitComponent} />
    </InstantSearch>
  );
}