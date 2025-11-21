import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { Search, Filter, Save, X, Clock, User, Building, DollarSign, Ticket } from 'lucide-react';
import { Card } from '../base/Card';
import { Input } from '../base/Input';
import { Button } from '../base/Button';
import { Badge } from '../base/Badge';

interface SearchResult {
  id: string;
  type: 'contact' | 'company' | 'deal' | 'ticket';
  title: string;
  subtitle: string;
  description: string;
  metadata: Record<string, any>;
}

interface SavedFilter {
  id: string;
  name: string;
  entities: string[];
  filters: Record<string, any>;
  isDefault: boolean;
}

interface GlobalSearchProps {
  onResultClick?: (result: SearchResult) => void;
  className?: string;
}

const entityIcons = {
  contact: User,
  company: Building,
  deal: DollarSign,
  ticket: Ticket,
};

const entityColors = {
  contact: 'bg-blue-100 text-blue-800',
  company: 'bg-green-100 text-green-800',
  deal: 'bg-purple-100 text-purple-800',
  ticket: 'bg-orange-100 text-orange-800',
};

export function GlobalSearch({ onResultClick, className = '' }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [entities, setEntities] = useState(['contacts', 'companies', 'deals', 'tickets']);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSaveFilter, setShowSaveFilter] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [searchTime, setSearchTime] = useState<string>('');
  
  const [debouncedQuery] = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load saved filters on mount
  useEffect(() => {
    loadSavedFilters();
  }, []);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [debouncedQuery, entities]);

  // Click outside to close results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setShowFilters(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadSavedFilters = async () => {
    try {
      const response = await fetch('/api/saved-filters');
      if (response.ok) {
        const filters = await response.json();
        setSavedFilters(filters);
      }
    } catch (error) {
      console.error('Failed to load saved filters:', error);
    }
  };

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    try {
      const entitiesParam = entities.join(',');
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&entities=${entitiesParam}`);
      
      if (response.ok) {
        const data = await response.json();
        setResults(data.results || []);
        setSearchTime(data.searchTime || '');
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleEntity = (entity: string) => {
    setEntities(prev => 
      prev.includes(entity) 
        ? prev.filter(e => e !== entity)
        : [...prev, entity]
    );
  };

  const applyFilter = (filter: SavedFilter) => {
    setEntities(filter.entities);
    setQuery('');
    setShowFilters(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const saveCurrentFilter = async () => {
    if (!filterName.trim()) return;

    try {
      const response = await fetch('/api/saved-filters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: filterName,
          entities,
          filters: { query },
        }),
      });

      if (response.ok) {
        await loadSavedFilters();
        setFilterName('');
        setShowSaveFilter(false);
      }
    } catch (error) {
      console.error('Failed to save filter:', error);
    }
  };

  const deleteFilter = async (filterId: string) => {
    try {
      const response = await fetch(`/api/saved-filters/${filterId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSavedFilters(prev => prev.filter(f => f.id !== filterId));
      }
    } catch (error) {
      console.error('Failed to delete filter:', error);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setShowResults(false);
    onResultClick?.(result);
  };

  const getResultIcon = (type: SearchResult['type']) => {
    const Icon = entityIcons[type];
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contacts, companies, deals, tickets..."
            className="pl-10 pr-4"
            onFocus={() => query && setShowResults(true)}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="px-3"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Entity Filters Panel */}
      {showFilters && (
        <Card className="absolute top-12 right-0 z-50 w-80 p-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Search In:</h3>
              <div className="space-y-2">
                {[
                  { key: 'contacts', label: 'Contacts', icon: User },
                  { key: 'companies', label: 'Companies', icon: Building },
                  { key: 'deals', label: 'Deals', icon: DollarSign },
                  { key: 'tickets', label: 'Tickets', icon: Ticket },
                ].map(({ key, label, icon: Icon }) => (
                  <label key={key} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={entities.includes(key)}
                      onChange={() => toggleEntity(key)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Icon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Saved Filters</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSaveFilter(!showSaveFilter)}
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>

              {showSaveFilter && (
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Filter name"
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    className="text-sm"
                  />
                  <Button size="sm" onClick={saveCurrentFilter}>
                    Save
                  </Button>
                </div>
              )}

              <div className="space-y-1 max-h-32 overflow-y-auto">
                {savedFilters.map(filter => (
                  <div key={filter.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <button
                      onClick={() => applyFilter(filter)}
                      className="text-sm text-left flex-1"
                    >
                      {filter.name}
                    </button>
                    <button
                      onClick={() => deleteFilter(filter.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {savedFilters.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">No saved filters</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Search Results */}
      {showResults && (
        <Card className="absolute top-12 left-0 right-0 z-40 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <div className="p-2">
              <div className="flex items-center justify-between text-xs text-gray-500 px-2 pb-2 border-b">
                <span>{results.length} results</span>
                {searchTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {searchTime}
                  </span>
                )}
              </div>
              <div className="space-y-1 mt-2">
                {results.map(result => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-full ${entityColors[result.type]}`}>
                        {getResultIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 truncate">
                            {result.title}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {result.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {result.subtitle}
                        </p>
                        {result.description && (
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {result.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : query && !isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No results found for "{query}"</p>
            </div>
          ) : null}
        </Card>
      )}
    </div>
  );
}

export default GlobalSearch;