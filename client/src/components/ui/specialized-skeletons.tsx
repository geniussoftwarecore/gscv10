import { Skeleton } from "@/components/ui/skeleton";

// Portfolio specific skeleton
export function PortfolioSkeleton() {
  return (
    <div className="min-h-screen bg-background" data-testid="portfolio-loading">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero section skeleton */}
        <div className="text-center space-y-4">
          <Skeleton className="h-14 w-80 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
          
          {/* Filter skeleton */}
          <div className="flex justify-center space-x-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Portfolio grid skeleton */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex space-x-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Services specific skeleton  
export function ServicesSkeleton() {
  return (
    <div className="min-h-screen bg-background" data-testid="services-loading">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero section */}
        <div className="text-center space-y-4">
          <Skeleton className="h-14 w-96 mx-auto" />
          <Skeleton className="h-6 w-[500px] mx-auto" />
          
          {/* Search and filter */}
          <div className="flex justify-center space-x-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="p-6 border rounded-lg space-y-4">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Dashboard specific skeleton
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6" data-testid="dashboard-loading">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-6 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-6" />
              </div>
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="p-6 border rounded-lg">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-4">
            {/* Table header */}
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            {/* Table rows */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// CRM specific skeleton
export function CrmSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6" data-testid="crm-loading">
      <div className="space-y-6">
        {/* Header with tabs */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-24" />
            ))}
          </div>
        </div>

        {/* Filters and actions */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-20" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Data table */}
        <div className="border rounded-lg">
          <div className="p-4 border-b">
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-4 border-b last:border-b-0">
              <div className="grid grid-cols-5 gap-4 items-center">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24 mt-1" />
                  </div>
                </div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-32" />
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Contact form skeleton
export function ContactSkeleton() {
  return (
    <div className="min-h-screen bg-background" data-testid="contact-loading">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-4">
          <Skeleton className="h-14 w-80 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact form */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-32" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Empty states for when data loads but is empty
export function EmptyPortfolio() {
  return (
    <div className="text-center py-12" data-testid="empty-portfolio">
      <div className="space-y-4">
        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="w-12 h-12 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">لا توجد مشاريع</h3>
          <p className="text-gray-500">لم يتم العثور على مشاريع تطابق معايير البحث</p>
        </div>
      </div>
    </div>
  );
}

export function EmptyServices() {
  return (
    <div className="text-center py-12" data-testid="empty-services">
      <div className="space-y-4">
        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">لا توجد خدمات</h3>
          <p className="text-gray-500">لم يتم العثور على خدمات تطابق معايير البحث</p>
        </div>
      </div>
    </div>
  );
}

export function EmptyData() {
  return (
    <div className="text-center py-8" data-testid="empty-data">
      <div className="space-y-3">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-medium text-gray-900">لا توجد بيانات</h3>
          <p className="text-sm text-gray-500">لم يتم العثور على بيانات لعرضها</p>
        </div>
      </div>
    </div>
  );
}