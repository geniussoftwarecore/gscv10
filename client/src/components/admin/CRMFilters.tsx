import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Filter,
  X,
  CalendarIcon,
  Tag,
  User,
  RotateCcw,
} from "lucide-react";
import { SavedView } from "@/data/savedViews";
import { getUsersList } from "@/data/users";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface CRMFiltersProps {
  currentView: SavedView | null;
  onFiltersChange: (filters: SavedView['filters']) => void;
  onFilterReset: () => void;
}

export const CRMFilters: React.FC<CRMFiltersProps> = ({
  currentView,
  onFiltersChange,
  onFilterReset,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tempFilters, setTempFilters] = useState<SavedView['filters']>(
    currentView?.filters || {}
  );

  const users = getUsersList().filter(u => u.role === 'admin');

  const statusOptions = [
    { value: 'new', label: 'جديد' },
    { value: 'open', label: 'مفتوح' },
    { value: 'pending-customer', label: 'في انتظار العميل' },
    { value: 'waiting', label: 'في الانتظار' },
    { value: 'resolved', label: 'محلول' },
    { value: 'closed', label: 'مغلق' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'منخفض' },
    { value: 'normal', label: 'عادي' },
    { value: 'high', label: 'عالي' },
    { value: 'urgent', label: 'عاجل' },
  ];

  const serviceOptions = [
    { value: 'mobile_app', label: 'تطبيقات الجوال' },
    { value: 'web_development', label: 'تطوير المواقع' },
    { value: 'ui_ux', label: 'تصميم UI/UX' },
    { value: 'digital_marketing', label: 'التسويق الرقمي' },
    { value: 'graphic_design', label: 'التصميم الجرافيكي' },
  ];

  const popularTags = [
    'عاجل',
    'تطوير',
    'تصميم',
    'دعم فني',
    'فاتورة',
    'استفسار',
    'شكوى',
    'اقتراح',
  ];

  const handleFilterChange = (key: keyof SavedView['filters'], value: any) => {
    const newFilters = { ...tempFilters, [key]: value };
    setTempFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleMultiSelectChange = (
    key: keyof SavedView['filters'],
    value: string,
    checked: boolean
  ) => {
    const currentValues = (tempFilters[key] as string[]) || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    handleFilterChange(key, newValues.length > 0 ? newValues : undefined);
  };

  const handleDateRangeChange = (field: 'start' | 'end', date: Date | undefined) => {
    const currentRange = tempFilters.dateRange || { start: '', end: '' };
    const newRange = {
      ...currentRange,
      [field]: date ? date.toISOString() : ''
    };
    
    if (newRange.start || newRange.end) {
      handleFilterChange('dateRange', newRange);
    } else {
      handleFilterChange('dateRange', undefined);
    }
  };

  const handleReset = () => {
    setTempFilters({});
    onFilterReset();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (tempFilters.status?.length) count++;
    if (tempFilters.priority?.length) count++;
    if (tempFilters.assigneeId?.length) count++;
    if (tempFilters.tags?.length) count++;
    if (tempFilters.service?.length) count++;
    if (tempFilters.dateRange) count++;
    if (tempFilters.search) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="border-b bg-white dark:bg-gray-800 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            data-testid="toggle-filters"
          >
            <Filter className="h-4 w-4 mr-2" />
            فلاتر
            {activeFilterCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              data-testid="reset-filters"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              إعادة تعيين
            </Button>
          )}
        </div>

        <div className="text-sm text-gray-500">
          {currentView?.name && `العرض: ${currentView.name}`}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">الحالة</label>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox
                    id={`status-${option.value}`}
                    checked={(tempFilters.status || []).includes(option.value)}
                    onCheckedChange={(checked) =>
                      handleMultiSelectChange('status', option.value, checked as boolean)
                    }
                    data-testid={`filter-status-${option.value}`}
                  />
                  <label htmlFor={`status-${option.value}`} className="text-sm">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">الأولوية</label>
            <div className="space-y-2">
              {priorityOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox
                    id={`priority-${option.value}`}
                    checked={(tempFilters.priority || []).includes(option.value)}
                    onCheckedChange={(checked) =>
                      handleMultiSelectChange('priority', option.value, checked as boolean)
                    }
                    data-testid={`filter-priority-${option.value}`}
                  />
                  <label htmlFor={`priority-${option.value}`} className="text-sm">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Assignee Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">المسند إليه</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id="assignee-unassigned"
                  checked={(tempFilters.assigneeId || []).includes('')}
                  onCheckedChange={(checked) =>
                    handleMultiSelectChange('assigneeId', '', checked as boolean)
                  }
                  data-testid="filter-assignee-unassigned"
                />
                <label htmlFor="assignee-unassigned" className="text-sm">
                  غير مسند
                </label>
              </div>
              {users.map((user) => (
                <div key={user.id} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox
                    id={`assignee-${user.id}`}
                    checked={(tempFilters.assigneeId || []).includes(user.id)}
                    onCheckedChange={(checked) =>
                      handleMultiSelectChange('assigneeId', user.id, checked as boolean)
                    }
                    data-testid={`filter-assignee-${user.id}`}
                  />
                  <label htmlFor={`assignee-${user.id}`} className="text-sm">
                    {user.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Service Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">الخدمة</label>
            <div className="space-y-2">
              {serviceOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox
                    id={`service-${option.value}`}
                    checked={(tempFilters.service || []).includes(option.value)}
                    onCheckedChange={(checked) =>
                      handleMultiSelectChange('service', option.value, checked as boolean)
                    }
                    data-testid={`filter-service-${option.value}`}
                  />
                  <label htmlFor={`service-${option.value}`} className="text-sm">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-2 block">العلامات</label>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Button
                  key={tag}
                  variant={(tempFilters.tags || []).includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const isSelected = (tempFilters.tags || []).includes(tag);
                    handleMultiSelectChange('tags', tag, !isSelected);
                  }}
                  data-testid={`filter-tag-${tag}`}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-2 block">نطاق التاريخ</label>
            <div className="flex space-x-2 rtl:space-x-reverse">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" data-testid="date-range-start">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {tempFilters.dateRange?.start
                      ? format(new Date(tempFilters.dateRange.start), 'PPP', { locale: ar })
                      : 'من تاريخ'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={tempFilters.dateRange?.start ? new Date(tempFilters.dateRange.start) : undefined}
                    onSelect={(date) => handleDateRangeChange('start', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" data-testid="date-range-end">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {tempFilters.dateRange?.end
                      ? format(new Date(tempFilters.dateRange.end), 'PPP', { locale: ar })
                      : 'إلى تاريخ'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={tempFilters.dateRange?.end ? new Date(tempFilters.dateRange.end) : undefined}
                    onSelect={(date) => handleDateRangeChange('end', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {tempFilters.dateRange && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFilterChange('dateRange', undefined)}
                  data-testid="clear-date-range"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tempFilters.status?.map((status) => (
            <Badge key={`status-${status}`} variant="secondary" className="text-xs">
              حالة: {statusOptions.find(s => s.value === status)?.label}
              <button
                className="ml-1 rtl:ml-0 rtl:mr-1"
                onClick={() => handleMultiSelectChange('status', status, false)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {tempFilters.priority?.map((priority) => (
            <Badge key={`priority-${priority}`} variant="secondary" className="text-xs">
              أولوية: {priorityOptions.find(p => p.value === priority)?.label}
              <button
                className="ml-1 rtl:ml-0 rtl:mr-1"
                onClick={() => handleMultiSelectChange('priority', priority, false)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {tempFilters.assigneeId?.map((assigneeId) => (
            <Badge key={`assignee-${assigneeId}`} variant="secondary" className="text-xs">
              مسند إلى: {assigneeId === '' ? 'غير مسند' : users.find(u => u.id === assigneeId)?.name}
              <button
                className="ml-1 rtl:ml-0 rtl:mr-1"
                onClick={() => handleMultiSelectChange('assigneeId', assigneeId, false)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {tempFilters.tags?.map((tag) => (
            <Badge key={`tag-${tag}`} variant="secondary" className="text-xs">
              علامة: {tag}
              <button
                className="ml-1 rtl:ml-0 rtl:mr-1"
                onClick={() => handleMultiSelectChange('tags', tag, false)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}

          {tempFilters.dateRange && (
            <Badge variant="secondary" className="text-xs">
              التاريخ: {tempFilters.dateRange.start && format(new Date(tempFilters.dateRange.start), 'PP', { locale: ar })} - {tempFilters.dateRange.end && format(new Date(tempFilters.dateRange.end), 'PP', { locale: ar })}
              <button
                className="ml-1 rtl:ml-0 rtl:mr-1"
                onClick={() => handleFilterChange('dateRange', undefined)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};