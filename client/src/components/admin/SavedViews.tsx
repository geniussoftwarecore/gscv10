import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Filter } from "lucide-react";
import {
  getSavedViews,
  getSavedView,
  type SavedView,
} from "@/data/savedViews";
import { getCRMRequests } from "@/data/clientRequests";
import { applyViewFilters } from "@/data/savedViews";

interface SavedViewsProps {
  selectedViewId: string;
  onViewSelect: (viewId: string) => void;
  onCreateView: () => void;
}

export const SavedViews: React.FC<SavedViewsProps> = ({
  selectedViewId,
  onViewSelect,
  onCreateView,
}) => {
  const savedViews = getSavedViews();
  const allRequests = getCRMRequests();

  // Calculate counts for each view
  const getViewCount = (view: SavedView): number => {
    const filtered = applyViewFilters(allRequests, view.filters);
    return filtered.length;
  };

  return (
    <div className="w-64 border-r bg-gray-50 dark:bg-gray-900 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900 dark:text-white">
          العروض المحفوظة
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCreateView}
          data-testid="create-view"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {savedViews.map((view) => {
          const count = getViewCount(view);
          const isSelected = selectedViewId === view.id;

          return (
            <Button
              key={view.id}
              variant={isSelected ? "default" : "ghost"}
              className={`w-full justify-between text-right ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => onViewSelect(view.id)}
              data-testid={`view-${view.id}`}
            >
              <span className="flex-1 text-right">{view.name}</span>
              <Badge
                variant={isSelected ? "secondary" : "outline"}
                className="ml-2 rtl:ml-0 rtl:mr-2"
              >
                {count}
              </Badge>
            </Button>
          );
        })}

        {/* Special views */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
            عروض خاصة
          </p>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-orange-600 dark:text-orange-400"
            onClick={() => onViewSelect("sla-at-risk")}
            data-testid="sla-at-risk-view"
          >
            <Filter className="mr-2 h-4 w-4" />
            SLA في خطر
            <Badge variant="destructive" className="ml-auto">
              {applyViewFilters(allRequests, { status: [] }).filter(req => 
                req.sla?.breached
              ).length}
            </Badge>
          </Button>
        </div>
      </div>
    </div>
  );
};