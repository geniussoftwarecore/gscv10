import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangle,
  Clock,
  User,
  Tag,
  Send,
  Paperclip,
  MoreVertical,
  FileText,
  MessageSquare,
  Activity,
} from "lucide-react";
import { CRMClientRequest, TimelineEntry } from "@/data/clientRequests";
import { getMacros, getMacrosByCategory } from "@/data/macros";
import { getAuditEntries } from "@/data/auditLog";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

// Helper function for Arabic distance formatting
const formatDistanceToNow = (date: Date, options?: { addSuffix?: boolean }) => {
  // Simple Arabic distance formatting
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `منذ ${diffDays} ${diffDays === 1 ? 'يوم' : 'أيام'}`;
  if (diffHours > 0) return `منذ ${diffHours} ${diffHours === 1 ? 'ساعة' : 'ساعات'}`;
  if (diffMinutes > 0) return `منذ ${diffMinutes} ${diffMinutes === 1 ? 'دقيقة' : 'دقائق'}`;
  return 'منذ لحظات';
};

interface TicketPanelProps {
  ticket: CRMClientRequest | null;
  onClose: () => void;
  onReply: (ticketId: string, message: string, isInternal: boolean) => void;
  onStatusChange: (ticketId: string, status: string) => void;
  onPriorityChange: (ticketId: string, priority: string) => void;
  onAssigneeChange: (ticketId: string, assigneeId: string, assigneeName: string) => void;
  onTagAdd: (ticketId: string, tags: string[]) => void;
  onTagRemove: (ticketId: string, tag: string) => void;
}

export const TicketPanel: React.FC<TicketPanelProps> = ({
  ticket,
  onClose,
  onReply,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
  onTagAdd,
  onTagRemove,
}) => {
  const { user } = useAuth();
  const [replyMessage, setReplyMessage] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [activeTab, setActiveTab] = useState("timeline");

  useEffect(() => {
    if (ticket) {
      setReplyMessage("");
      setInternalNote("");
    }
  }, [ticket?.id]);

  if (!ticket) {
    return (
      <div className="w-96 border-r bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <MessageSquare className="h-12 w-12 mx-auto mb-4" />
          <p>اختر تذكرة لعرض التفاصيل</p>
        </div>
      </div>
    );
  }

  const handleSendReply = () => {
    if (replyMessage.trim() && user) {
      onReply(ticket.id, replyMessage, false);
      setReplyMessage("");
    }
  };

  const handleSendInternalNote = () => {
    if (internalNote.trim() && user) {
      onReply(ticket.id, internalNote, true);
      setInternalNote("");
    }
  };

  const insertMacro = (macroContent: string, isInternal: boolean = false) => {
    const processedContent = macroContent.replace(/\{\{customer_name\}\}/g, ticket.requesterName || 'عزيزي العميل')
                                       .replace(/\{\{agent_name\}\}/g, user?.name || 'فريق الدعم')
                                       .replace(/\{\{ticket_id\}\}/g, ticket.id);
    
    if (isInternal) {
      setInternalNote(processedContent);
    } else {
      setReplyMessage(processedContent);
    }
  };

  const getSLAStatus = () => {
    if (!ticket.sla) return null;

    const now = new Date();
    const dueAt = new Date(ticket.sla.dueAt);
    const diffMinutes = (dueAt.getTime() - now.getTime()) / (1000 * 60);

    if (ticket.sla.breached) {
      return {
        status: "breached",
        color: "text-red-600",
        icon: AlertTriangle,
        text: "منتهك",
        time: formatDistanceToNow(dueAt, { addSuffix: true })
      };
    }

    if (diffMinutes < 60) {
      return {
        status: "at-risk",
        color: "text-orange-600", 
        icon: Clock,
        text: "في خطر",
        time: `${Math.round(diffMinutes)} دقيقة متبقية`
      };
    }

    return {
      status: "safe",
      color: "text-green-600",
      icon: Clock,
      text: "آمن",
      time: `${Math.round(diffMinutes / 60)} ساعة متبقية`
    };
  };

  const slaStatus = getSLAStatus();
  const macros = getMacros();
  const auditEntries = getAuditEntries({ targetId: ticket.id });



  return (
    <div className="w-96 border-r bg-white dark:bg-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white leading-tight">
              {ticket.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {ticket.id}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} data-testid="close-ticket-panel">
            ×
          </Button>
        </div>

        {/* Ticket Meta */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">الحالة</p>
            <Badge className="mt-1">{ticket.status}</Badge>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">الأولوية</p>
            <Badge className="mt-1">{ticket.priority}</Badge>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">المسند إليه</p>
            <p className="text-sm mt-1">{ticket.assigneeName || 'غير مسند'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">العميل</p>
            <p className="text-sm mt-1">{ticket.requesterName}</p>
          </div>
        </div>

        {/* SLA Status */}
        {slaStatus && (
          <div className={`flex items-center mt-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-700 ${slaStatus.color}`}>
            <slaStatus.icon className="h-4 w-4 mr-2" />
            <div>
              <span className="text-sm font-medium">SLA {slaStatus.text}</span>
              <p className="text-xs">{slaStatus.time}</p>
            </div>
          </div>
        )}

        {/* Tags */}
        {ticket.tags && ticket.tags.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">العلامات</p>
            <div className="flex flex-wrap gap-1">
              {ticket.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 m-4">
          <TabsTrigger value="timeline" data-testid="timeline-tab">
            <MessageSquare className="h-4 w-4 mr-2" />
            المحادثة
          </TabsTrigger>
          <TabsTrigger value="audit" data-testid="audit-tab">
            <Activity className="h-4 w-4 mr-2" />
            سجل الأنشطة
          </TabsTrigger>
          <TabsTrigger value="details" data-testid="details-tab">
            <FileText className="h-4 w-4 mr-2" />
            التفاصيل
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="timeline" className="h-full flex flex-col m-0">
            {/* Timeline */}
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-4">
                {ticket.timeline?.map((entry) => (
                  <div key={entry.id} className="border-l-2 border-gray-200 pl-4 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        {entry.kind === 'reply' && (
                          <MessageSquare className="h-4 w-4 text-blue-500" />
                        )}
                        {entry.kind === 'note' && (
                          <FileText className="h-4 w-4 text-orange-500" />
                        )}
                        {entry.kind === 'event' && (
                          <Activity className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {entry.authorName}
                        </span>
                        {entry.internal && (
                          <Badge variant="outline" className="text-xs">
                            داخلي
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(entry.createdAt))}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {entry.body}
                    </div>
                    {entry.attachments && entry.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {entry.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center text-xs text-blue-600">
                            <Paperclip className="h-3 w-3 mr-1" />
                            {attachment.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {(!ticket.timeline || ticket.timeline.length === 0) && (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    لا توجد محادثات بعد
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Reply Composer */}
            <div className="border-t p-4 space-y-3">
              <Tabs defaultValue="reply" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="reply">رد</TabsTrigger>
                  <TabsTrigger value="note">ملاحظة داخلية</TabsTrigger>
                </TabsList>
                
                <TabsContent value="reply" className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">رد على العميل</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" data-testid="reply-macros">
                          القوالب
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64">
                        {macros.slice(0, 5).map((macro) => (
                          <DropdownMenuItem
                            key={macro.id}
                            onClick={() => insertMacro(macro.content, false)}
                          >
                            {macro.title}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Textarea
                    placeholder="اكتب ردك هنا..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="min-h-[100px]"
                    data-testid="reply-message"
                  />
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4 mr-2" />
                      إرفاق ملف
                    </Button>
                    <Button 
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim()}
                      data-testid="send-reply"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      إرسال الرد
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="note" className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">ملاحظة داخلية</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" data-testid="note-macros">
                          القوالب
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64">
                        {macros.slice(0, 5).map((macro) => (
                          <DropdownMenuItem
                            key={macro.id}
                            onClick={() => insertMacro(macro.content, true)}
                          >
                            {macro.title}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <Textarea
                    placeholder="اكتب ملاحظة داخلية..."
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    className="min-h-[100px]"
                    data-testid="internal-note"
                  />
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4 mr-2" />
                      إرفاق ملف
                    </Button>
                    <Button 
                      onClick={handleSendInternalNote}
                      disabled={!internalNote.trim()}
                      data-testid="send-note"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      إضافة ملاحظة
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="h-full m-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-3">
                {auditEntries.map((entry) => (
                  <Card key={entry.id} className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium">{entry.actorName}</p>
                        <p className="text-xs text-gray-500">{entry.action}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {format(new Date(entry.at), 'PPp', { locale: ar })}
                      </span>
                    </div>
                    {Object.keys(entry.meta).length > 0 && (
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        {JSON.stringify(entry.meta, null, 2)}
                      </div>
                    )}
                  </Card>
                ))}

                {auditEntries.length === 0 && (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    لا توجد أنشطة مسجلة
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="details" className="h-full m-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">معلومات أساسية</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="text-xs text-gray-500">الخدمة:</span>
                      <p className="text-sm">{ticket.serviceTitle}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">النوع:</span>
                      <p className="text-sm">{ticket.type}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">تاريخ الإنشاء:</span>
                      <p className="text-sm">
                        {format(ticket.createdAt || new Date(), 'PPp', { locale: ar })}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">آخر تحديث:</span>
                      <p className="text-sm">
                        {format(ticket.updatedAt || new Date(), 'PPp', { locale: ar })}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">الوصف</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
                  </CardContent>
                </Card>

                {ticket.escalation && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">معلومات التصعيد</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="text-xs text-gray-500">المستوى:</span>
                        <p className="text-sm">{ticket.escalation.tier}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">تاريخ التصعيد:</span>
                        <p className="text-sm">
                          {ticket.escalation.escalatedAt && 
                           format(new Date(ticket.escalation.escalatedAt), 'PPp', { locale: ar })}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">السبب:</span>
                        <p className="text-sm">{ticket.escalation.reason}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};