'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Clock, TrendingUp, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type SearchSuggestion = {
  id: string;
  title: string;
  type: 'faq' | 'article' | 'video' | 'forum';
  category: string;
  relevance: number;
  url: string;
};

type RecentSearch = {
  query: string;
  timestamp: Date;
};

const SEARCH_SUGGESTIONS: SearchSuggestion[] = [
  {
    id: '1',
    title: 'How to create a new class',
    type: 'faq',
    category: 'Classes',
    relevance: 0.95,
    url: '/support/faq#create-class',
  },
  {
    id: '2',
    title: 'Setting up gradebook categories',
    type: 'video',
    category: 'Gradebook',
    relevance: 0.88,
    url: '/support/videos/gradebook-setup',
  },
  {
    id: '3',
    title: 'Messaging parents about assignments',
    type: 'article',
    category: 'Communication',
    relevance: 0.92,
    url: '/support/articles/parent-communication',
  },
  {
    id: '4',
    title: 'Attendance tracking best practices',
    type: 'forum',
    category: 'Attendance',
    relevance: 0.85,
    url: '/support/forum/attendance-tips',
  },
];

const TRENDING_SEARCHES = [
  'password reset',
  'gradebook setup',
  'parent messages',
  'class creation',
  'attendance tracking',
];

export default function SmartSearchBox() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const filteredSuggestions = useMemo(() => {
    if (!query.trim()) return [];
    
    return SEARCH_SUGGESTIONS
      .filter(suggestion => 
        suggestion.title.toLowerCase().includes(query.toLowerCase()) ||
        suggestion.category.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5);
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    
    // Add to recent searches
    const newSearch: RecentSearch = {
      query: searchQuery,
      timestamp: new Date(),
    };
    
    setRecentSearches(prev => {
      const filtered = prev.filter(search => search.query !== searchQuery);
      return [newSearch, ...filtered].slice(0, 5);
    });
    
    // Simulate search delay
    setTimeout(() => {
      setIsLoading(false);
      setIsOpen(false);
    }, 800);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    handleSearch(suggestion.title);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'forum': return '💬';
      case 'article': return '📖';
      case 'faq': return '❓';
      default: return '📄';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-700';
      case 'forum': return 'bg-blue-100 text-blue-700';
      case 'article': return 'bg-green-100 text-green-700';
      case 'faq': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
          placeholder="Search for help articles, FAQs, tutorials..."
          className="pl-10 pr-4 h-12 text-base"
        />
        {isLoading && (
          <div className="absolute right-3 top-3.5">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full mt-2 w-full bg-white shadow-lg border z-50 max-h-96 overflow-hidden">
          <div className="p-4">
            {/* Search Suggestions */}
            {query && filteredSuggestions.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Suggestions</h4>
                <div className="space-y-2">
                  {filteredSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer group"
                    >
                      <span className="text-lg">{getTypeIcon(suggestion.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {suggestion.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${getTypeBadgeColor(suggestion.type)}`}>
                            {suggestion.type.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-500">{suggestion.category}</span>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent Searches
                </h4>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setQuery(search.query);
                        handleSearch(search.query);
                      }}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <span className="text-sm text-gray-700">{search.query}</span>
                      <span className="text-xs text-gray-400">
                        {search.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            {!query && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Trending
                </h4>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((trend, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuery(trend);
                        handleSearch(trend);
                      }}
                      className="text-xs h-7"
                    >
                      {trend}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {query && filteredSuggestions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No results found for "{query}"</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch(query)}
                  className="mt-2"
                >
                  Search anyway
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Overlay to close search */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}