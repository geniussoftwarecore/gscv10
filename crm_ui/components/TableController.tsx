import React, { useState, useEffect, useCallback } from 'react';
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
  ChevronRight
} from 'lucide-react';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  visible?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableSort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface TableFilter {
  field: string;
  operator: 'eq' | 'contains' | 'gt' | 'lt' | 'in';
  value: any;
}

export interface SavedView {
  id: string;
  name: string;
  columns: string[];
  sorts: TableSort[];
  filters: TableFilter[];
  pageSize: number;
}

export interface TableControllerProps {
  // Data fetching
  endpoint: string;
  queryKey: string[];
  
  // Table configuration
  columns: TableColumn[];
  defaultPageSize?: number;
  defaultSort?: TableSort[];
  
  // Features
  enableExport?: boolean;
  enableSavedViews?: boolean;
  enableColumnToggle?: boolean;
  
  // Styling
  className?: string;
  tableClassName?: string;
  
  // Events
  onRowClick?: (row: any) => void;
  onRowSelect?: (selectedRows: any[]) => void;
}

interface TableState {
  page: number;
  pageSize: number;
  sorts: TableSort[];
  filters: TableFilter[];
  search: string;
  visibleColumns: string[];
}

export const TableController: React.FC<TableControllerProps> = ({
  endpoint,
  queryKey,
  columns,
  defaultPageSize = 25,
  defaultSort = [],
  enableExport = true,
  enableSavedViews = true,
  enableColumnToggle = true,
  className = '',
  tableClassName = '',
  onRowClick,
  onRowSelect
}) => {
  const queryClient = useQueryClient();
  
  // Table state
  const [state, setState] = useState<TableState>({
    page: 1,
    pageSize: defaultPageSize,
    sorts: defaultSort,
    filters: [],
    search: '',
    visibleColumns: columns.filter(col => col.visible !== false).map(col => col.key)
  });
  
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [showSavedViews, setShowSavedViews] = useState(false);
  const [newViewName, setNewViewName] = useState('');

  // Fetch table data with server-side features
  const { data: tableData, isLoading, error } = useQuery({
    queryKey: [...queryKey, state],
    queryFn: () => fetchTableData(),
    keepPreviousData: true,
    staleTime: 30000
  });

  // Fetch saved views
  const { data: savedViews = [] } = useQuery({
    queryKey: ['saved-views', endpoint],
    queryFn: () => fetchSavedViews(),
    enabled: enableSavedViews
  });

  const fetchTableData = async () => {
    const params = new URLSearchParams({
      page: state.page.toString(),
      pageSize: state.pageSize.toString(),
      search: state.search,
      sorts: JSON.stringify(state.sorts),
      filters: JSON.stringify(state.filters),
      columns: JSON.stringify(state.visibleColumns)
    });

    const response = await fetch(`${endpoint}?${params}`);
    if (!response.ok) throw new Error('Failed to fetch data');
    return response.json();
  };

  const fetchSavedViews = async (): Promise<SavedView[]> => {
    const response = await fetch(`/api/saved-views?endpoint=${endpoint}`);
    if (!response.ok) throw new Error('Failed to fetch saved views');
    return response.json();
  };

  // Mutations for export and saved views
  const exportMutation = useMutation({
    mutationFn: async (format: 'csv' | 'pdf') => {
      const params = new URLSearchParams({
        format,
        search: state.search,
        sorts: JSON.stringify(state.sorts),
        filters: JSON.stringify(state.filters),
        columns: JSON.stringify(state.visibleColumns)
      });

      const response = await fetch(`${endpoint}/export?${params}`);
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  });

  const saveViewMutation = useMutation({
    mutationFn: async (viewData: Omit<SavedView, 'id'>) => {
      const response = await fetch('/api/saved-views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...viewData, endpoint })
      });
      if (!response.ok) throw new Error('Failed to save view');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['saved-views', endpoint]);
      setNewViewName('');
      setShowSavedViews(false);
    }
  });

  const loadViewMutation = useMutation({
    mutationFn: async (viewId: string) => {
      const view = savedViews.find(v => v.id === viewId);
      if (!view) throw new Error('View not found');
      
      setState(prev => ({
        ...prev,
        sorts: view.sorts,
        filters: view.filters,
        pageSize: view.pageSize,
        visibleColumns: view.columns,
        page: 1
      }));
    }
  });

  // Event handlers
  const handleSort = useCallback((columnKey: string) => {
    setState(prev => {
      const existingSort = prev.sorts.find(s => s.field === columnKey);
      let newSorts: TableSort[];
      
      if (existingSort) {
        if (existingSort.direction === 'asc') {
          newSorts = prev.sorts.map(s => 
            s.field === columnKey ? { ...s, direction: 'desc' as const } : s
          );
        } else {
          newSorts = prev.sorts.filter(s => s.field !== columnKey);
        }
      } else {
        newSorts = [...prev.sorts, { field: columnKey, direction: 'asc' }];
      }
      
      return { ...prev, sorts: newSorts, page: 1 };
    });
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setState(prev => ({ ...prev, page: newPage }));
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setState(prev => ({ ...prev, pageSize: newPageSize, page: 1 }));
  }, []);

  const handleSearch = useCallback((searchTerm: string) => {
    setState(prev => ({ ...prev, search: searchTerm, page: 1 }));
  }, []);

  const handleColumnToggle = useCallback((columnKey: string) => {
    setState(prev => ({
      ...prev,
      visibleColumns: prev.visibleColumns.includes(columnKey)
        ? prev.visibleColumns.filter(key => key !== columnKey)
        : [...prev.visibleColumns, columnKey]
    }));
  }, []);

  const handleRowSelection = useCallback((rowId: string, selected: boolean) => {
    setSelectedRows(prev => 
      selected 
        ? [...prev, rowId]
        : prev.filter(id => id !== rowId)
    );
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected && tableData?.data) {
      setSelectedRows(tableData.data.map((row: any) => row.id));
    } else {
      setSelectedRows([]);
    }
  }, [tableData]);

  // Update parent component with selected rows
  useEffect(() => {
    if (onRowSelect && tableData?.data) {
      const selectedRowData = tableData.data.filter((row: any) => 
        selectedRows.includes(row.id)
      );
      onRowSelect(selectedRowData);
    }
  }, [selectedRows, tableData, onRowSelect]);

  const getSortIcon = (columnKey: string) => {
    const sort = state.sorts.find(s => s.field === columnKey);
    if (!sort) return <ArrowUpDown className="w-4 h-4 opacity-40" />;
    return sort.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-blue-600" />
      : <ArrowDown className="w-4 h-4 text-blue-600" />;
  };

  const visibleColumnsData = columns.filter(col => 
    state.visibleColumns.includes(col.key)
  );

  if (error) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center text-red-600">
          خطأ في تحميل البيانات: {error.message}
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          {/* Search */}
          <Input
            type="text"
            placeholder="البحث..."
            value={state.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-64"
          />
          
          {/* Filters */}
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 ml-2" />
            تصفية
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Column Settings */}
          {enableColumnToggle && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowColumnSettings(!showColumnSettings)}
            >
              <Settings className="w-4 h-4 ml-2" />
              الأعمدة
            </Button>
          )}

          {/* Saved Views */}
          {enableSavedViews && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSavedViews(!showSavedViews)}
            >
              <Save className="w-4 h-4 ml-2" />
              العروض المحفوظة
            </Button>
          )}

          {/* Export */}
          {enableExport && (
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportMutation.mutate('csv')}
                disabled={exportMutation.isLoading}
              >
                <Download className="w-4 h-4 ml-2" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportMutation.mutate('pdf')}
                disabled={exportMutation.isLoading}
              >
                <FileText className="w-4 h-4 ml-2" />
                PDF
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Column Settings Panel */}
      {showColumnSettings && (
        <Card className="mb-4 p-4 bg-gray-50">
          <h3 className="font-medium mb-3">إعدادات الأعمدة</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {columns.map(column => (
              <label key={column.key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={state.visibleColumns.includes(column.key)}
                  onChange={(e) => handleColumnToggle(column.key)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{column.label}</span>
              </label>
            ))}
          </div>
        </Card>
      )}

      {/* Saved Views Panel */}
      {showSavedViews && (
        <Card className="mb-4 p-4 bg-gray-50">
          <h3 className="font-medium mb-3">العروض المحفوظة</h3>
          <div className="space-y-2 mb-4">
            {savedViews.map(view => (
              <div key={view.id} className="flex items-center justify-between">
                <span className="text-sm">{view.name}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => loadViewMutation.mutate(view.id)}
                >
                  تحميل
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="اسم العرض الجديد"
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              className="flex-1"
            />
            <Button
              size="sm"
              onClick={() => saveViewMutation.mutate({
                name: newViewName,
                columns: state.visibleColumns,
                sorts: state.sorts,
                filters: state.filters,
                pageSize: state.pageSize
              })}
              disabled={!newViewName || saveViewMutation.isLoading}
            >
              حفظ
            </Button>
          </div>
        </Card>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className={`w-full border-collapse ${tableClassName}`}>
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-right p-3 w-8">
                <input
                  type="checkbox"
                  checked={selectedRows.length === tableData?.data?.length && tableData?.data?.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300"
                />
              </th>
              {visibleColumnsData.map(column => (
                <th
                  key={column.key}
                  className="text-right p-3 text-sm font-medium text-muted-foreground"
                  style={{ width: column.width }}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable !== false && (
                      <button
                        onClick={() => handleSort(column.key)}
                        className="hover:bg-gray-100 p-1 rounded"
                      >
                        {getSortIcon(column.key)}
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={visibleColumnsData.length + 1} className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </td>
              </tr>
            ) : tableData?.data?.length ? (
              tableData.data.map((row: any) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onRowClick?.(row)}
                >
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleRowSelection(row.id, e.target.checked);
                      }}
                      className="rounded border-gray-300"
                    />
                  </td>
                  {visibleColumnsData.map(column => (
                    <td key={column.key} className="p-3">
                      {column.render 
                        ? column.render(row[column.key], row)
                        : row[column.key] || '—'
                      }
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={visibleColumnsData.length + 1} className="text-center py-8 text-gray-500">
                  لا توجد بيانات لعرضها
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {tableData?.pagination && (
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              عرض {((state.page - 1) * state.pageSize) + 1} إلى{' '}
              {Math.min(state.page * state.pageSize, tableData.pagination.total)} من{' '}
              {tableData.pagination.total} نتيجة
            </span>
            
            <Select
              value={state.pageSize.toString()}
              onValueChange={(value) => handlePageSizeChange(parseInt(value))}
              options={[
                { value: '10', label: '10' },
                { value: '25', label: '25' },
                { value: '50', label: '50' },
                { value: '100', label: '100' }
              ]}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(state.page - 1)}
              disabled={state.page <= 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            
            <span className="text-sm font-medium">
              {state.page} / {tableData.pagination.totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(state.page + 1)}
              disabled={state.page >= tableData.pagination.totalPages}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Selection Summary */}
      {selectedRows.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-700">
              تم تحديد {selectedRows.length} عنصر
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedRows([])}
            >
              إلغاء التحديد
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};