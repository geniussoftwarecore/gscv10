import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import AdminRoute from "@/components/admin/AdminRoute";
import { CRMHeader } from "@/components/admin/CRMHeader";
import { SavedViews } from "@/components/admin/SavedViews";
import { TicketList } from "@/components/admin/TicketList";
import { TicketPanel } from "@/components/admin/TicketPanel";
import { NotificationsDrawer } from "@/components/admin/NotificationsDrawer";
import { CRMFilters } from "@/components/admin/CRMFilters";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  getCRMRequests,
  getCRMRequestById,
  setAssignee,
  setStatus,
  setPriority,
  addTags,
  removeTag,
  addReply,
  addInternalNote,
  checkAndMarkSLABreaches,
  type CRMClientRequest,
} from "@/data/clientRequests";
import {
  getSavedViews,
  getSavedView,
  applyViewFilters,
  applySorting,
  type SavedView,
} from "@/data/savedViews";
import { addNotification } from "@/data/notifications";

const AdminCRM: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // State for tickets and views
  const [tickets, setTickets] = useState<CRMClientRequest[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<CRMClientRequest[]>([]);
  const [selectedViewId, setSelectedViewId] = useState<string>("my-open");
  const [currentView, setCurrentView] = useState<SavedView | null>(null);
  const [customFilters, setCustomFilters] = useState<SavedView['filters']>({});
  
  // State for selection and UI
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadTickets();
    
    // Set up SLA checking interval
    const slaInterval = setInterval(() => {
      checkAndMarkSLABreaches();
      loadTickets(); // Refresh to show updated SLA statuses
    }, 60000); // Check every minute

    return () => clearInterval(slaInterval);
  }, []);

  // Apply filters when view or custom filters change
  useEffect(() => {
    applyFilters();
  }, [tickets, selectedViewId, customFilters, searchQuery]);

  const loadTickets = () => {
    const allTickets = getCRMRequests();
    setTickets(allTickets);
  };

  const applyFilters = () => {
    let filtered = [...tickets];
    
    // Apply view filters
    if (currentView) {
      filtered = applyViewFilters(filtered, currentView.filters);
    }
    
    // Apply custom filters (override view filters)
    if (Object.keys(customFilters).length > 0) {
      filtered = applyViewFilters(filtered, customFilters);
    }
    
    // Apply search
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchLower) ||
        ticket.description.toLowerCase().includes(searchLower) ||
        ticket.requesterName?.toLowerCase().includes(searchLower) ||
        ticket.requesterEmail?.toLowerCase().includes(searchLower) ||
        ticket.id.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    if (currentView) {
      filtered = applySorting(filtered, currentView.sort);
    }
    
    setFilteredTickets(filtered);
  };

  const handleViewSelect = (viewId: string) => {
    setSelectedViewId(viewId);
    const view = getSavedView(viewId);
    setCurrentView(view);
    setCustomFilters({}); // Reset custom filters when switching views
    setSelectedTickets([]); // Clear selection
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleFiltersChange = (filters: SavedView['filters']) => {
    setCustomFilters(filters);
  };

  const handleFilterReset = () => {
    setCustomFilters({});
  };

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setSelectedTickets([]); // Clear bulk selection when opening ticket
  };

  const handleTicketToggle = (ticketId: string, checked: boolean) => {
    if (checked) {
      setSelectedTickets(prev => [...prev, ticketId]);
    } else {
      setSelectedTickets(prev => prev.filter(id => id !== ticketId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTickets(filteredTickets.map(t => t.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const handleBulkAction = async (action: string, ticketIds: string[]) => {
    if (!user) return;
    
    try {
      switch (action) {
        case 'assign':
          // For demo, assign to current admin
          for (const ticketId of ticketIds) {
            setAssignee(ticketId, user.id, user.name, user.id, user.name);
          }
          toast({
            title: "تم الإسناد بنجاح",
            description: `تم إسناد ${ticketIds.length} تذكرة إليك`,
          });
          break;
          
        case 'status':
          // For demo, mark as open
          for (const ticketId of ticketIds) {
            setStatus(ticketId, 'open', user.id, user.name);
          }
          toast({
            title: "تم تحديث الحالة",
            description: `تم تحديث حالة ${ticketIds.length} تذكرة إلى "مفتوح"`,
          });
          break;
          
        case 'tag':
          // For demo, add "مراجعة" tag
          for (const ticketId of ticketIds) {
            addTags(ticketId, ['مراجعة'], user.id, user.name);
          }
          toast({
            title: "تم إضافة العلامة",
            description: `تم إضافة علامة "مراجعة" إلى ${ticketIds.length} تذكرة`,
          });
          break;
      }
      
      loadTickets();
      setSelectedTickets([]);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تنفيذ العملية",
        variant: "destructive",
      });
    }
  };

  const handleReply = (ticketId: string, message: string, isInternal: boolean) => {
    if (!user) return;
    
    try {
      if (isInternal) {
        addInternalNote(ticketId, user.id, user.name, message);
        toast({
          title: "تم إضافة الملاحظة",
          description: "تم إضافة الملاحظة الداخلية بنجاح",
        });
      } else {
        addReply(ticketId, user.id, user.name, message);
        toast({
          title: "تم إرسال الرد",
          description: "تم إرسال الرد للعميل بنجاح",
        });
      }
      
      loadTickets();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال الرد",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = (ticketId: string, status: string) => {
    if (!user) return;
    
    try {
      setStatus(ticketId, status as CRMClientRequest['status'], user.id, user.name);
      toast({
        title: "تم تحديث الحالة",
        description: "تم تحديث حالة التذكرة بنجاح",
      });
      loadTickets();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الحالة",
        variant: "destructive",
      });
    }
  };

  const handlePriorityChange = (ticketId: string, priority: string) => {
    if (!user) return;
    
    try {
      setPriority(ticketId, priority as CRMClientRequest['priority'], user.id, user.name);
      toast({
        title: "تم تحديث الأولوية",
        description: "تم تحديث أولوية التذكرة بنجاح",
      });
      loadTickets();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الأولوية",
        variant: "destructive",
      });
    }
  };

  const handleAssigneeChange = (ticketId: string, assigneeId: string, assigneeName: string) => {
    if (!user) return;
    
    try {
      setAssignee(ticketId, assigneeId, assigneeName, user.id, user.name);
      toast({
        title: "تم الإسناد",
        description: `تم إسناد التذكرة إلى ${assigneeName}`,
      });
      loadTickets();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء الإسناد",
        variant: "destructive",
      });
    }
  };

  const handleTagAdd = (ticketId: string, tags: string[]) => {
    if (!user) return;
    
    try {
      addTags(ticketId, tags, user.id, user.name);
      toast({
        title: "تم إضافة العلامات",
        description: "تم إضافة العلامات بنجاح",
      });
      loadTickets();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة العلامات",
        variant: "destructive",
      });
    }
  };

  const handleTagRemove = (ticketId: string, tag: string) => {
    if (!user) return;
    
    try {
      removeTag(ticketId, tag, user.id, user.name);
      toast({
        title: "تم إزالة العلامة",
        description: "تم إزالة العلامة بنجاح",
      });
      loadTickets();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إزالة العلامة",
        variant: "destructive",
      });
    }
  };

  const selectedTicket = selectedTicketId ? getCRMRequestById(selectedTicketId) : null;

  return (
    <AdminRoute>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <NotificationsDrawer>
          <CRMHeader
            onSearchChange={handleSearchChange}
            onNotificationClick={() => setNotificationsOpen(true)}
          />
        </NotificationsDrawer>

        {/* Filters */}
        <CRMFilters
          currentView={currentView}
          onFiltersChange={handleFiltersChange}
          onFilterReset={handleFilterReset}
        />

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Saved Views Sidebar */}
          <SavedViews
            selectedViewId={selectedViewId}
            onViewSelect={handleViewSelect}
            onCreateView={() => {
              toast({
                title: "قريباً",
                description: "ستتمكن من إنشاء عروض مخصصة قريباً",
              });
            }}
          />

          {/* Ticket List */}
          <TicketList
            tickets={filteredTickets}
            selectedTickets={selectedTickets}
            selectedTicketId={selectedTicketId}
            onTicketSelect={handleTicketSelect}
            onTicketToggle={handleTicketToggle}
            onSelectAll={handleSelectAll}
            onBulkAction={handleBulkAction}
          />

          {/* Ticket Panel */}
          <TicketPanel
            ticket={selectedTicket}
            onClose={() => setSelectedTicketId(undefined)}
            onReply={handleReply}
            onStatusChange={handleStatusChange}
            onPriorityChange={handlePriorityChange}
            onAssigneeChange={handleAssigneeChange}
            onTagAdd={handleTagAdd}
            onTagRemove={handleTagRemove}
          />
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminCRM;