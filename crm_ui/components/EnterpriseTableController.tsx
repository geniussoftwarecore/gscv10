import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from './base/Card';
import { Button } from './base/Button';
import { Input } from './base/Input';
import { Select } from './base/Select';
import { Badge } from './base/Badge';
import { 
  Download, 
  FileText, 
  Eye, 
  EyeOff, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  Save,
  Settings,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  X,
  Loader2,
  Grid,
  List,
  BookmarkPlus,
  Star,
  MoreHorizontal
} from 'lucide-react';
import { CrmSavedView } from '@shared/crm-schema';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  visible?: boolean;
  width?: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'badge' | 'currency';
  render?: (value: any, row: any) => React.ReactNode;
  exportRender?: (value: any, row: any) => string;
}

export interface TableSort {
  field: string;
  direction: 'asc' | 'desc';
  priority?: number;
}

export interface TableFilter {
  field: string;
  operator: 'eq' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'not_in' | 'is_null' | 'is_not_null';
  value: any;
  label?: string;
}

export interface TableResponse {
  data: any[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TableControllerProps {
  // Data fetching
  endpoint: string;
  tableName: string;
  queryKey: string[];
  
  // Table configuration
  columns: TableColumn[];
  defaultPageSize?: number;
  defaultSort?: TableSort[];
  defaultView?: string;
  
  // Features
  enableExport?: boolean;
  enableSavedViews?: boolean;
  enableColumnToggle?: boolean;
  enableMultiSort?: boolean;
  enableSearch?: boolean;
  enableFilters?: boolean;
  
  // Styling
  className?: string;
  tableClassName?: string;
  
  // Events
  onRowClick?: (row: any) => void;
  onRowSelect?: (selectedRows: any[]) => void;
  onExport?: (format: 'csv' | 'pdf', data: any[]) => void;
}

interface TableState {
  page: number;
  pageSize: number;
  sorts: TableSort[];
  filters: TableFilter[];
  search: string;
  visibleColumns: string[];
  selectedRows: string[];
}

export const EnterpriseTableController: React.FC<TableControllerProps> = ({
  endpoint,
  tableName,
  queryKey,
  columns,
  defaultPageSize = 25,
  defaultSort = [],
  defaultView,
  enableExport = true,
  enableSavedViews = true,
  enableColumnToggle = true,
  enableMultiSort = true,
  enableSearch = true,
  enableFilters = true,
  className = '',
  tableClassName = '',
  onRowClick,
  onRowSelect,
  onExport
}) => {
  const queryClient = useQueryClient();
  
  // Table state
  const [state, setState] = useState<TableState>({
    page: 1,
    pageSize: defaultPageSize,
    sorts: defaultSort,
    filters: [],
    search: '',
    visibleColumns: columns.filter(col => col.visible !== false).map(col => col.key),
    selectedRows: []
  });
  
  // UI state
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [showSavedViews, setShowSavedViews] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [newViewName, setNewViewName] = useState('');
  const [isExporting, setIsExporting] = useState<'csv' | 'pdf' | null>(null);

  // Compute query parameters
  const queryParams = useMemo(() => ({
    page: state.page,
    pageSize: state.pageSize,
    sorts: state.sorts,
    filters: state.filters,
    search: state.search.trim(),
    columns: state.visibleColumns
  }), [state]);

  // Fetch table data with server-side features
  const { data: tableData, isLoading, error } = useQuery({
    queryKey: [...queryKey, queryParams],
    queryFn: async (): Promise<TableResponse> => {
      const params = new URLSearchParams({
        page: queryParams.page.toString(),
        pageSize: queryParams.pageSize.toString(),
        sorts: JSON.stringify(queryParams.sorts),
        filters: JSON.stringify(queryParams.filters),
        search: queryParams.search,
        columns: queryParams.columns.join(',')
      });
      
      const response = await fetch(`${endpoint}?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      return response.json();
    },
    keepPreviousData: true,
    staleTime: 30000
  });

  // Fetch saved views
  const { data: savedViews = [] } = useQuery({
    queryKey: ['saved-views', tableName],
    queryFn: async (): Promise<CrmSavedView[]> => {
      const response = await fetch(`/api/saved-views/${tableName}`);
      if (!response.ok) throw new Error('Failed to fetch saved views');
      return response.json();
    },
    enabled: enableSavedViews
  });

  // Export data mutation
  const exportMutation = useMutation({
    mutationFn: async ({ format, filters }: { format: 'csv' | 'pdf', filters: any }) => {
      const params = new URLSearchParams({
        format,
        sorts: JSON.stringify(queryParams.sorts),
        filters: JSON.stringify(queryParams.filters),
        search: queryParams.search,
        columns: queryParams.columns.join(',')
      });
      
      const response = await fetch(`${endpoint}/export?${params}`);
      if (!response.ok) throw new Error(`Export failed: ${response.statusText}`);
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${tableName}_export_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => {
      setIsExporting(null);
    },
    onError: (error) => {
      console.error('Export failed:', error);
      setIsExporting(null);
    }
  });

  // Save view mutation
  const saveViewMutation = useMutation({
    mutationFn: async ({ name, isDefault }: { name: string, isDefault?: boolean }) => {
      const config = {
        columns: state.visibleColumns,
        sorts: state.sorts,
        filters: state.filters,
        pageSize: state.pageSize,
        search: state.search
      };
      
      const response = await fetch('/api/saved-views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableName,
          name,
          isDefault: isDefault || false,
          config
        })
      });
      
      if (!response.ok) throw new Error('Failed to save view');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-views', tableName] });
      setNewViewName('');
      setShowSavedViews(false);
    }
  });

  // Load saved view
  const loadView = useCallback((view: CrmSavedView) => {
    setState(prev => ({
      ...prev,
      page: 1,
      pageSize: view.config.pageSize,
      sorts: view.config.sorts,
      filters: view.config.filters,
      search: view.config.search || '',
      visibleColumns: view.config.columns
    }));
  }, []);

  // Handle sorting
  const handleSort = useCallback((field: string) => {
    setState(prev => {
      const existingSortIndex = prev.sorts.findIndex(s => s.field === field);
      let newSorts = [...prev.sorts];
      
      if (existingSortIndex >= 0) {
        const currentSort = newSorts[existingSortIndex];
        if (currentSort.direction === 'asc') {
          newSorts[existingSortIndex] = { ...currentSort, direction: 'desc' };
        } else {
          newSorts.splice(existingSortIndex, 1);
        }
      } else {
        if (!enableMultiSort) {
          newSorts = [{ field, direction: 'asc' }];
        } else {
          newSorts.push({ field, direction: 'asc', priority: newSorts.length });
        }
      }
      
      return {
        ...prev,
        sorts: newSorts,
        page: 1
      };
    });
  }, [enableMultiSort]);

  // Handle pagination
  const handlePageChange = useCallback((newPage: number) => {
    setState(prev => ({ ...prev, page: newPage }));
  }, []);

  // Handle page size change
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setState(prev => ({ 
      ...prev, 
      pageSize: newPageSize,
      page: 1
    }));
  }, []);

  // Handle search
  const handleSearch = useCallback((searchTerm: string) => {
    setState(prev => ({ 
      ...prev, 
      search: searchTerm,
      page: 1
    }));
  }, []);

  // Handle column visibility toggle
  const toggleColumn = useCallback((columnKey: string) => {
    setState(prev => ({
      ...prev,
      visibleColumns: prev.visibleColumns.includes(columnKey)
        ? prev.visibleColumns.filter(key => key !== columnKey)
        : [...prev.visibleColumns, columnKey]
    }));
  }, []);

  // Handle row selection
  const handleRowSelect = useCallback((rowId: string, selected: boolean) => {
    setState(prev => {
      const newSelectedRows = selected
        ? [...prev.selectedRows, rowId]
        : prev.selectedRows.filter(id => id !== rowId);
      
      onRowSelect?.(newSelectedRows.map(id => 
        tableData?.data.find(row => row.id === id)
      ).filter(Boolean));
      
      return { ...prev, selectedRows: newSelectedRows };
    });
  }, [tableData?.data, onRowSelect]);

  // Handle select all
  const handleSelectAll = useCallback((selected: boolean) => {
    const allIds = tableData?.data.map(row => row.id) || [];
    setState(prev => ({ 
      ...prev, 
      selectedRows: selected ? allIds : [] 
    }));
  }, [tableData?.data]);

  // Export handlers
  const handleExport = useCallback((format: 'csv' | 'pdf') => {
    setIsExporting(format);
    exportMutation.mutate({ format, filters: queryParams });
  }, [exportMutation, queryParams]);

  // Visible columns for rendering
  const visibleColumnDefs = useMemo(() => 
    columns.filter(col => state.visibleColumns.includes(col.key)),
    [columns, state.visibleColumns]
  );

  // Get sort state for column
  const getSortState = useCallback((field: string) => {
    const sort = state.sorts.find(s => s.field === field);
    return sort ? sort.direction : null;
  }, [state.sorts]);

  // Pagination info
  const paginationInfo = useMemo(() => {
    const totalCount = tableData?.totalCount || 0;
    const currentPage = tableData?.page || 1;
    const pageSize = tableData?.pageSize || defaultPageSize;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, totalCount);
    
    return { totalCount, currentPage, totalPages, startIndex, endIndex, pageSize };
  }, [tableData, defaultPageSize]);

  return (
    <div className={`space-y-4 ${className}`} data-testid="enterprise-table-controller">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-wrap gap-2">
          {enableSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={`Search ${tableName}...`}
                value={state.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 w-64"
                data-testid="search-input"
              />
              {state.search && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSearch('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  data-testid="clear-search"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
          
          {enableFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              data-testid="toggle-filters"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {state.filters.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {state.filters.length}
                </Badge>
              )}
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          {enableColumnToggle && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColumnSettings(!showColumnSettings)}
              data-testid="toggle-columns"
            >
              <Settings className="w-4 h-4 mr-2" />
              Columns
            </Button>
          )}
          
          {enableSavedViews && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSavedViews(!showSavedViews)}
              data-testid="toggle-views"
            >
              <BookmarkPlus className="w-4 h-4 mr-2" />
              Views
            </Button>
          )}
          
          {enableExport && (
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('csv')}
                disabled={isExporting === 'csv'}
                data-testid="export-csv"
              >
                {isExporting === 'csv' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('pdf')}
                disabled={isExporting === 'pdf'}
                data-testid="export-pdf"
              >
                {isExporting === 'pdf' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                PDF
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {state.filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {state.filters.map((filter, index) => (
            <Badge key={index} variant="outline" className="flex items-center gap-2">
              {filter.label || `${filter.field} ${filter.operator} ${filter.value}`}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setState(prev => ({
                    ...prev,
                    filters: prev.filters.filter((_, i) => i !== index),
                    page: 1
                  }));
                }}
                className="h-4 w-4 p-0 hover:bg-transparent"
                data-testid={`remove-filter-${index}`}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setState(prev => ({ ...prev, filters: [], page: 1 }))}
            data-testid="clear-all-filters"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className={`w-full ${tableClassName}`} data-testid="data-table">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="w-8 p-3">
                  <input
                    type="checkbox"
                    checked={state.selectedRows.length === tableData?.data.length && tableData?.data.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300"
                    data-testid="select-all-checkbox"
                  />
                </th>
                {visibleColumnDefs.map((column) => (
                  <th
                    key={column.key}
                    className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    style={{ width: column.width }}
                    onClick={() => column.sortable !== false && handleSort(column.key)}
                    data-testid={`header-${column.key}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{column.label}</span>
                      {column.sortable !== false && (
                        <div className="flex items-center ml-2">
                          {getSortState(column.key) === 'asc' && <ArrowUp className="w-4 h-4 text-blue-600" />}
                          {getSortState(column.key) === 'desc' && <ArrowDown className="w-4 h-4 text-blue-600" />}
                          {!getSortState(column.key) && <ArrowUpDown className="w-4 h-4 text-gray-400" />}
                          {enableMultiSort && state.sorts.find(s => s.field === column.key) && (
                            <Badge variant="secondary" className="ml-1 text-xs">
                              {state.sorts.findIndex(s => s.field === column.key) + 1}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                <th className="w-8 p-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData?.data.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => onRowClick?.(row)}
                  data-testid={`row-${row.id}`}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={state.selectedRows.includes(row.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleRowSelect(row.id, e.target.checked);
                      }}
                      className="rounded border-gray-300"
                      data-testid={`select-row-${row.id}`}
                    />
                  </td>
                  {visibleColumnDefs.map((column) => (
                    <td
                      key={column.key}
                      className="px-3 py-3 text-sm text-gray-900"
                      data-testid={`cell-${row.id}-${column.key}`}
                    >
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                  <td className="p-3">
                    <Button variant="ghost" size="sm" data-testid={`actions-${row.id}`}>
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {tableData?.data.length === 0 && !isLoading && (
            <div className="text-center py-12 text-gray-500" data-testid="no-data">
              No data found
            </div>
          )}
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <span>Show</span>
          <Select
            value={paginationInfo.pageSize.toString()}
            onValueChange={(value) => handlePageSizeChange(parseInt(value))}
            data-testid="page-size-select"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </Select>
          <span>
            of {paginationInfo.totalCount} results 
            ({paginationInfo.startIndex}-{paginationInfo.endIndex})
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
            disabled={paginationInfo.currentPage <= 1}
            data-testid="prev-page"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, paginationInfo.totalPages) }, (_, i) => {
              let pageNum;
              if (paginationInfo.totalPages <= 5) {
                pageNum = i + 1;
              } else if (paginationInfo.currentPage <= 3) {
                pageNum = i + 1;
              } else if (paginationInfo.currentPage >= paginationInfo.totalPages - 2) {
                pageNum = paginationInfo.totalPages - 4 + i;
              } else {
                pageNum = paginationInfo.currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === paginationInfo.currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  data-testid={`page-${pageNum}`}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
            disabled={paginationInfo.currentPage >= paginationInfo.totalPages}
            data-testid="next-page"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Column Settings Modal */}
      {showColumnSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 max-h-96 overflow-y-auto" data-testid="column-settings-modal">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Manage Columns</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowColumnSettings(false)}
                  data-testid="close-column-settings"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {columns.map((column) => (
                  <div key={column.key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={column.key}
                      checked={state.visibleColumns.includes(column.key)}
                      onChange={() => toggleColumn(column.key)}
                      className="rounded border-gray-300"
                      data-testid={`toggle-column-${column.key}`}
                    />
                    <label htmlFor={column.key} className="text-sm font-medium">
                      {column.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Saved Views Modal */}
      {showSavedViews && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 max-h-96 overflow-y-auto" data-testid="saved-views-modal">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Saved Views</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSavedViews(false)}
                  data-testid="close-saved-views"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Create new view */}
              <div className="space-y-2 mb-4 p-3 border rounded-lg">
                <Input
                  placeholder="View name..."
                  value={newViewName}
                  onChange={(e) => setNewViewName(e.target.value)}
                  data-testid="new-view-name"
                />
                <Button
                  onClick={() => saveViewMutation.mutate({ name: newViewName })}
                  disabled={!newViewName.trim() || saveViewMutation.isPending}
                  size="sm"
                  className="w-full"
                  data-testid="save-view"
                >
                  {saveViewMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Current View
                </Button>
              </div>
              
              {/* Existing views */}
              <div className="space-y-2">
                {savedViews.map((view) => (
                  <div
                    key={view.id}
                    className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => loadView(view)}
                    data-testid={`saved-view-${view.id}`}
                  >
                    <div className="flex items-center gap-2">
                      {view.isDefault && <Star className="w-4 h-4 text-yellow-500" />}
                      <span className="font-medium">{view.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};