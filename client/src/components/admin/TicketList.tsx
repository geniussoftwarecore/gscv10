import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Clock, AlertTriangle, User } from "lucide-react";
import { CRMClientRequest } from "@/data/clientRequests";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

// Simple Arabic distance formatting
const formatDistanceToNow = (date: Date, options?: { addSuffix?: boolean }) => {
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `منذ ${diffDays} ${diffDays === 1 ? 'يوم' : 'أيام'}`;
  if (diffHours > 0) return `منذ ${diffHours} ${diffHours === 1 ? 'ساعة' : 'ساعات'}`;
  if (diffMinutes > 0) return `منذ ${diffMinutes} ${diffMinutes === 1 ? 'دقيقة' : 'دقائق'}`;
  return 'منذ لحظات';
};

interface TicketListProps {
  tickets: CRMClientRequest[];
  selectedTickets: string[];
  selectedTicketId?: string;
  onTicketSelect: (ticketId: string) => void;
  onTicketToggle: (ticketId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onBulkAction: (action: string, ticketIds: string[]) => void;
}

export const TicketList: React.FC<TicketListProps> = ({
  tickets,
  selectedTickets,
  selectedTicketId,
  onTicketSelect,
  onTicketToggle,
  onSelectAll,
  onBulkAction,
}) => {
  const [sortField, setSortField] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Sort tickets
  const sortedTickets = useMemo(() => {
    const sorted = [...tickets].sort((a, b) => {
      let aValue: any = a[sortField as keyof CRMClientRequest];
      let bValue: any = b[sortField as keyof CRMClientRequest];

      if (sortField.includes("Date") || sortField.includes("At")) {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      }

      if (sortField === "priority") {
        const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
        aValue = priorityOrder[aValue as keyof typeof priorityOrder] || 0;
        bValue = priorityOrder[bValue as keyof typeof priorityOrder] || 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [tickets, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "normal":
        return "bg-blue-500 text-white";
      case "low":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-green-500 text-white";
      case "open":
        return "bg-blue-500 text-white";
      case "pending-customer":
        return "bg-yellow-500 text-white";
      case "waiting":
        return "bg-purple-500 text-white";
      case "resolved":
        return "bg-gray-500 text-white";
      case "closed":
        return "bg-gray-800 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      urgent: "عاجل",
      high: "عالي",
      normal: "عادي",
      low: "منخفض",
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      new: "جديد",
      open: "مفتوح",
      "pending-customer": "في انتظار العميل",
      waiting: "في الانتظار",
      resolved: "محلول",
      closed: "مغلق",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getSLAIndicator = (ticket: CRMClientRequest) => {
    if (!ticket.sla) return null;

    const now = new Date();
    const dueAt = new Date(ticket.sla.dueAt);
    const diffMinutes = (dueAt.getTime() - now.getTime()) / (1000 * 60);

    if (ticket.sla.breached) {
      return (
        <div className="flex items-center text-red-600" title="SLA منتهك">
          <AlertTriangle className="h-4 w-4 mr-1" />
          <span className="text-xs">منتهك</span>
        </div>
      );
    }

    if (diffMinutes < 60) {
      return (
        <div className="flex items-center text-orange-600" title="SLA في خطر">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-xs">{Math.round(diffMinutes)}د</span>
        </div>
      );
    }

    return (
      <div className="flex items-center text-green-600" title="SLA آمن">
        <Clock className="h-4 w-4 mr-1" />
        <span className="text-xs">{Math.round(diffMinutes / 60)}س</span>
      </div>
    );
  };

  const allSelected = selectedTickets.length === tickets.length && tickets.length > 0;
  const someSelected = selectedTickets.length > 0 && selectedTickets.length < tickets.length;

  return (
    <div className="flex-1 overflow-hidden">
      {/* Bulk Actions */}
      {selectedTickets.length > 0 && (
        <div className="border-b bg-blue-50 dark:bg-blue-900/20 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700 dark:text-blue-300">
              تم تحديد {selectedTickets.length} تذكرة
            </span>
            <div className="flex space-x-2 rtl:space-x-reverse">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBulkAction("assign", selectedTickets)}
                data-testid="bulk-assign"
              >
                إسناد
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBulkAction("status", selectedTickets)}
                data-testid="bulk-status"
              >
                تغيير الحالة
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBulkAction("tag", selectedTickets)}
                data-testid="bulk-tag"
              >
                إضافة علامة
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-auto h-full">
        <Table>
          <TableHeader className="sticky top-0 bg-white dark:bg-gray-800 z-10">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                  data-testid="select-all-tickets"
                />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => handleSort("status")}
              >
                الحالة
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => handleSort("priority")}
              >
                الأولوية
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => handleSort("title")}
              >
                الموضوع
              </TableHead>
              <TableHead>العميل</TableHead>
              <TableHead>المسند إليه</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={() => handleSort("updatedAt")}
              >
                آخر تحديث
              </TableHead>
              <TableHead>SLA</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTickets.map((ticket) => (
              <TableRow
                key={ticket.id}
                className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  selectedTicketId === ticket.id
                    ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                    : ""
                }`}
                onClick={() => onTicketSelect(ticket.id)}
                data-testid={`ticket-row-${ticket.id}`}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedTickets.includes(ticket.id)}
                    onCheckedChange={(checked) =>
                      onTicketToggle(ticket.id, checked as boolean)
                    }
                    data-testid={`select-ticket-${ticket.id}`}
                  />
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(ticket.status)}>
                    {getStatusLabel(ticket.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {getPriorityLabel(ticket.priority)}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate font-medium">{ticket.title}</div>
                  <div className="text-sm text-gray-500 truncate">
                    {ticket.description}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400" />
                    <div>
                      <div className="font-medium">{ticket.requesterName}</div>
                      <div className="text-sm text-gray-500">
                        {ticket.requesterEmail}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {ticket.assigneeName ? (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{ticket.assigneeName}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">غير مسند</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDistanceToNow(ticket.updatedAt || new Date(), {
                      addSuffix: true,
                      locale: ar,
                    })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(ticket.updatedAt || new Date(), "PPp", { locale: ar })}
                  </div>
                </TableCell>
                <TableCell>{getSLAIndicator(ticket)}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" data-testid={`ticket-actions-${ticket.id}`}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>عرض التفاصيل</DropdownMenuItem>
                      <DropdownMenuItem>تعديل</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>إسناد</DropdownMenuItem>
                      <DropdownMenuItem>تغيير الحالة</DropdownMenuItem>
                      <DropdownMenuItem>إضافة علامة</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {sortedTickets.length === 0 && (
          <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
            لا توجد تذاكر مطابقة للفلاتر المحددة
          </div>
        )}
      </div>
    </div>
  );
};