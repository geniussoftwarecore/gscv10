import { useState } from "react";
import { Calendar, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Period = 'week' | 'month' | 'quarter' | 'year' | 'custom';

interface PeriodSelectorProps {
  selectedPeriod: Period;
  onPeriodChange: (period: Period, customRange?: { from: Date; to: Date }) => void;
}

const periodOptions = [
  { value: 'week' as Period, label: 'هذا الأسبوع' },
  { value: 'month' as Period, label: 'هذا الشهر' }, 
  { value: 'quarter' as Period, label: 'هذا الربع' },
  { value: 'year' as Period, label: 'هذا العام' },
  { value: 'custom' as Period, label: 'نطاق مخصص' },
];

export function PeriodSelector({ selectedPeriod, onPeriodChange }: PeriodSelectorProps) {
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [showCustomDialog, setShowCustomDialog] = useState(false);

  const selectedLabel = periodOptions.find(option => option.value === selectedPeriod)?.label || 'هذا الشهر';

  const handleCustomApply = () => {
    if (customFrom && customTo) {
      onPeriodChange('custom', {
        from: new Date(customFrom),
        to: new Date(customTo)
      });
      setShowCustomDialog(false);
    }
  };

  const handlePeriodSelect = (period: Period) => {
    if (period === 'custom') {
      setShowCustomDialog(true);
    } else {
      onPeriodChange(period);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <CalendarIcon className="h-4 w-4 text-gray-500" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            {selectedLabel}
            <Calendar className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {periodOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handlePeriodSelect(option.value)}
              className={selectedPeriod === option.value ? 'bg-gray-100' : ''}
            >
              {option.label}
              {selectedPeriod === option.value && (
                <div className="mr-auto h-2 w-2 rounded-full bg-blue-600" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>اختيار نطاق تاريخ مخصص</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="from-date">من تاريخ</Label>
              <Input
                id="from-date"
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="to-date">إلى تاريخ</Label>
              <Input
                id="to-date"
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowCustomDialog(false)}
              >
                إلغاء
              </Button>
              <Button onClick={handleCustomApply}>
                تطبيق
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}