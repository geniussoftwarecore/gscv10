import { useState, useEffect, useRef } from 'react';
import { Search, Filter, Save, Trash2, Users, Building, DollarSign, Ticket } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface SearchResult {
  id: string;
  entity: string;
  name?: string;
  title?: string;
  subject?: string;
  email?: string;
  phone?: string;
  company?: string;
  stage?: string;
  status?: string;
  [key: string]: any;
}

interface SavedFilter {
  id: string;
  name: string;
  entities: string[];
  filters: Record<string, any>;
  isDefault: string;
}

const ENTITY_OPTIONS = [
  { value: 'contacts', label: 'جهات الاتصال', icon: Users },
  { value: 'accounts', label: 'الشركات', icon: Building },
  { value: 'deals', label: 'الصفقات', icon: DollarSign },
  { value: 'tickets', label: 'التذاكر', icon: Ticket },
];

const getEntityIcon = (entity: string) => {
  switch (entity) {
    case 'contacts': return Users;
    case 'accounts': return Building;
    case 'deals':
    case 'opportunities': return DollarSign;
    case 'tickets': return Ticket;
    default: return Search;
  }
};

const getEntityColor = (entity: string) => {
  switch (entity) {
    case 'contacts': return 'bg-blue-100 text-blue-800';
    case 'accounts': return 'bg-green-100 text-green-800';
    case 'deals':
    case 'opportunities': return 'bg-purple-100 text-purple-800';
    case 'tickets': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function GlobalSearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntities, setSelectedEntities] = useState<string[]>(['contacts', 'accounts', 'deals', 'tickets']);
  const [showResults, setShowResults] = useState(false);
  const [saveFilterName, setSaveFilterName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Search query
  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ['search', debouncedQuery, selectedEntities],
    queryFn: () => {
      if (!debouncedQuery || debouncedQuery.length < 2) return [];
      const entities = selectedEntities.join(',');
      return fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&entities=${entities}`)
        .then(res => res.json());
    },
    enabled: debouncedQuery.length >= 2
  });

  // Saved filters query
  const { data: savedFilters = [] } = useQuery({
    queryKey: ['saved-filters'],
    queryFn: () => apiRequest('/api/saved-filters')
  });

  // Save filter mutation
  const saveFilterMutation = useMutation({
    mutationFn: (data: { name: string; entities: string[]; filters: Record<string, any> }) =>
      apiRequest('/api/saved-filters', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-filters'] });
      setShowSaveDialog(false);
      setSaveFilterName('');
    }
  });

  // Delete filter mutation
  const deleteFilterMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/saved-filters/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-filters'] });
    }
  });

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEntityToggle = (entity: string) => {
    setSelectedEntities(prev => 
      prev.includes(entity) 
        ? prev.filter(e => e !== entity)
        : [...prev, entity]
    );
  };

  const handleSaveFilter = () => {
    if (!saveFilterName.trim()) return;
    
    saveFilterMutation.mutate({
      name: saveFilterName.trim(),
      entities: selectedEntities,
      filters: { query: searchQuery }
    });
  };

  const handleLoadFilter = (filter: SavedFilter) => {
    setSelectedEntities(filter.entities);
    setSearchQuery(filter.filters.query || '');
    setShowResults(true);
  };

  const getResultTitle = (result: SearchResult) => {
    return result.name || result.title || result.subject || 'بلا عنوان';
  };

  const getResultSubtitle = (result: SearchResult) => {
    const parts = [];
    if (result.email) parts.push(result.email);
    if (result.phone) parts.push(result.phone);
    if (result.company && result.entity === 'contacts') parts.push(result.company);
    if (result.stage && result.entity === 'opportunities') parts.push(`المرحلة: ${result.stage}`);
    if (result.status) parts.push(`الحالة: ${result.status}`);
    return parts.join(' • ');
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchRef}>
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="البحث في جهات الاتصال، الشركات، الصفقات، والتذاكر..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          className="pl-10 pr-4 py-3 text-right"
        />
        
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex gap-2">
          {/* Entity Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7">
                <Filter className="h-4 w-4 ml-1" />
                تصفية ({selectedEntities.length})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {ENTITY_OPTIONS.map(option => {
                const Icon = option.icon;
                return (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleEntityToggle(option.value)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1">{option.label}</span>
                    {selectedEntities.includes(option.value) && (
                      <div className="h-2 w-2 rounded-full bg-blue-600" />
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Saved Filters Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7">
                <Save className="h-4 w-4 ml-1" />
                المحفوظة
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Save className="h-4 w-4 ml-2" />
                    حفظ البحث الحالي
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>حفظ فلتر البحث</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">اسم الفلتر</label>
                      <Input
                        value={saveFilterName}
                        onChange={(e) => setSaveFilterName(e.target.value)}
                        placeholder="أدخل اسم الفلتر"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowSaveDialog(false)}
                      >
                        إلغاء
                      </Button>
                      <Button
                        onClick={handleSaveFilter}
                        disabled={!saveFilterName.trim() || saveFilterMutation.isPending}
                      >
                        {saveFilterMutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {savedFilters.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  {savedFilters.map((filter: SavedFilter) => (
                    <DropdownMenuItem
                      key={filter.id}
                      onSelect={() => handleLoadFilter(filter)}
                      className="flex items-center justify-between"
                    >
                      <span>{filter.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFilterMutation.mutate(filter.id);
                        }}
                        className="h-6 w-6 p-0 text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active filters */}
      {selectedEntities.length < 4 && (
        <div className="flex gap-1 mt-2 justify-end">
          {selectedEntities.map(entity => {
            const option = ENTITY_OPTIONS.find(o => o.value === entity);
            return option ? (
              <Badge key={entity} variant="secondary" className="text-xs">
                {option.label}
              </Badge>
            ) : null;
          })}
        </div>
      )}

      {/* Search Results */}
      {showResults && debouncedQuery.length >= 2 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                جاري البحث...
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                لا توجد نتائج للبحث "{debouncedQuery}"
              </div>
            ) : (
              <div className="divide-y">
                {searchResults.map((result: SearchResult) => {
                  const Icon = getEntityIcon(result.entity);
                  return (
                    <div
                      key={`${result.entity}-${result.id}`}
                      className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => {
                        // Handle result click - navigate to entity
                        setShowResults(false);
                        console.log('Navigate to:', result);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-md ${getEntityColor(result.entity)}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {getResultTitle(result)}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {getResultSubtitle(result)}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={`${getEntityColor(result.entity)} text-xs`}
                        >
                          {ENTITY_OPTIONS.find(o => o.value === result.entity)?.label || result.entity}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}