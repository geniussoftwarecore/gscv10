import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, Building2, UserCheck, Target, Ticket,
  Phone, Mail, Calendar, DollarSign, TrendingUp, Filter, BarChart3
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { KPICards } from "@/components/dashboard/KPICards";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";

type Period = 'week' | 'month' | 'quarter' | 'year' | 'custom';

export default function CrmDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  
  // Fetch batched dashboard analytics
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/dashboard/analytics', selectedPeriod],
    queryFn: () => fetch(`/api/dashboard/analytics?period=${selectedPeriod}`).then(res => res.json()),
    enabled: true
  });

  // Fetch individual CRM data for detailed views
  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ['/api/crm/leads'],
    enabled: activeTab !== 'overview'
  });

  const { data: accountsData, isLoading: accountsLoading } = useQuery({
    queryKey: ['/api/crm/accounts'], 
    enabled: activeTab !== 'overview'
  });

  const { data: contactsData, isLoading: contactsLoading } = useQuery({
    queryKey: ['/api/crm/contacts'],
    enabled: activeTab !== 'overview'
  });

  const { data: opportunitiesData, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ['/api/crm/opportunities'],
    enabled: activeTab !== 'overview'
  });

  const { data: ticketsData, isLoading: ticketsLoading } = useQuery({
    queryKey: ['/api/crm/tickets'],
    enabled: activeTab !== 'overview'
  });

  const leads = (leadsData as any)?.leads || [];
  const accounts = (accountsData as any)?.accounts || [];
  const contacts = (contactsData as any)?.contacts || [];
  const opportunities = (opportunitiesData as any)?.opportunities || [];
  const tickets = (ticketsData as any)?.tickets || [];

  // Analytics data from batched endpoint
  const kpiData = analyticsData?.kpis || {
    totalDeals: 0,
    pipelineValue: 0,
    conversionRate: 0,
    avgResolutionTime: 0
  };
  
  const chartData = analyticsData?.chartData || {
    dealsByStage: {},
    monthlyTrend: [],
    ticketStatus: {}
  };
  
  const summary = analyticsData?.summary || {
    totalContacts: 0,
    totalAccounts: 0,
    totalOpportunities: 0,
    totalTickets: 0,
    totalTasks: 0
  };

  // Calculate stats for other tabs (when not using analytics endpoint)
  const stats = {
    totalLeads: leads.length,
    totalAccounts: accounts.length,
    totalContacts: contacts.length,
    totalOpportunities: opportunities.length,
    openTickets: tickets.filter((t: any) => t.status === 'open').length,
    totalRevenue: opportunities
      .filter((o: any) => o.stage === 'closed-won')
      .reduce((sum: number, o: any) => sum + parseFloat(o.expected_value || '0'), 0)
      .toLocaleString()
  };

  const handlePeriodChange = (period: Period, customRange?: { from: Date; to: Date }) => {
    setSelectedPeriod(period);
    // customRange handling would go here if needed
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'hot': return 'bg-red-500 text-white';
      case 'warm': return 'bg-orange-500 text-white';
      case 'cold': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500 text-white';
      case 'qualified': return 'bg-green-500 text-white';
      case 'converted': return 'bg-purple-500 text-white';
      case 'open': return 'bg-yellow-500 text-white';
      case 'in_progress': return 'bg-blue-500 text-white';
      case 'resolved': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-orange-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const isLoading = activeTab === 'overview' ? analyticsLoading : 
    (leadsLoading || accountsLoading || contactsLoading || opportunitiesLoading || ticketsLoading);

  if (isLoading && activeTab !== 'overview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Loading CRM Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-8" dir="ltr">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              CRM Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage your customer relationships and sales pipeline
            </p>
          </div>
          <PeriodSelector 
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
          />
        </div>

        {/* KPI Cards */}
        <div className="mb-8">
          <KPICards data={kpiData} isLoading={analyticsLoading} />
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 w-full mb-6">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="leads" data-testid="tab-leads">Leads</TabsTrigger>
            <TabsTrigger value="accounts" data-testid="tab-accounts">Accounts</TabsTrigger>
            <TabsTrigger value="contacts" data-testid="tab-contacts">Contacts</TabsTrigger>
            <TabsTrigger value="deals" data-testid="tab-deals">Deals</TabsTrigger>
            <TabsTrigger value="tickets" data-testid="tab-tickets">Support</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Charts */}
            <DashboardCharts data={chartData} isLoading={analyticsLoading} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card data-testid="recent-leads-card">
                <CardHeader>
                  <CardTitle>Recent Leads</CardTitle>
                  <CardDescription>Latest prospects in your pipeline</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {leads.slice(0, 5).map((lead: any) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg" data-testid={`lead-${lead.id}`}>
                      <div>
                        <div className="font-semibold" data-testid={`lead-name-${lead.id}`}>
                          {lead.first_name} {lead.last_name}
                        </div>
                        <div className="text-sm text-gray-600" data-testid={`lead-company-${lead.id}`}>
                          {lead.company}
                        </div>
                        <div className="text-xs text-gray-500" data-testid={`lead-value-${lead.id}`}>
                          ${lead.estimated_value}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getRatingColor(lead.lead_rating)} data-testid={`lead-rating-${lead.id}`}>
                          {lead.lead_rating}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1" data-testid={`lead-score-${lead.id}`}>
                          Score: {lead.lead_score}
                        </div>
                      </div>
                    </div>
                  ))}
                  {leads.length === 0 && (
                    <div className="text-center py-8 text-gray-500" data-testid="no-leads">
                      No leads found
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card data-testid="open-tickets-card">
                <CardHeader>
                  <CardTitle>Open Tickets</CardTitle>
                  <CardDescription>Support tickets requiring attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tickets.filter((t: any) => t.status === 'open').slice(0, 5).map((ticket: any) => (
                    <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg" data-testid={`ticket-${ticket.id}`}>
                      <div>
                        <div className="font-semibold" data-testid={`ticket-number-${ticket.id}`}>
                          {ticket.ticket_number}
                        </div>
                        <div className="text-sm text-gray-600" data-testid={`ticket-subject-${ticket.id}`}>
                          {ticket.subject}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getPriorityColor(ticket.priority)} data-testid={`ticket-priority-${ticket.id}`}>
                          {ticket.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {tickets.filter((t: any) => t.status === 'open').length === 0 && (
                    <div className="text-center py-8 text-gray-500" data-testid="no-open-tickets">
                      No open tickets
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-6">
            <Card data-testid="leads-management-card">
              <CardHeader>
                <CardTitle>Leads Management</CardTitle>
                <CardDescription>Track and manage your sales prospects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Input
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                    data-testid="input-search-leads"
                  />
                  <Button variant="outline" data-testid="button-filter-leads">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {leads
                    .filter((lead: any) => 
                      `${lead.first_name} ${lead.last_name} ${lead.company}`.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((lead: any) => (
                    <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800" data-testid={`lead-item-${lead.id}`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg" data-testid={`lead-full-name-${lead.id}`}>
                            {lead.first_name} {lead.last_name}
                          </h3>
                          <Badge className={getRatingColor(lead.lead_rating)} data-testid={`lead-rating-badge-${lead.id}`}>
                            {lead.lead_rating}
                          </Badge>
                          <Badge className={getStatusColor(lead.lead_status)} data-testid={`lead-status-badge-${lead.id}`}>
                            {lead.lead_status}
                          </Badge>
                        </div>
                        <div className="text-gray-600 mb-1" data-testid={`lead-company-name-${lead.id}`}>
                          {lead.company}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1" data-testid={`lead-email-${lead.id}`}>
                            <Mail className="h-4 w-4" />
                            {lead.email}
                          </span>
                          <span className="flex items-center gap-1" data-testid={`lead-estimated-value-${lead.id}`}>
                            <DollarSign className="h-4 w-4" />
                            ${lead.estimated_value}
                          </span>
                          <span data-testid={`lead-score-display-${lead.id}`}>Score: {lead.lead_score}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" data-testid={`button-call-${lead.id}`}>
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" data-testid={`button-email-${lead.id}`}>
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" data-testid={`button-schedule-${lead.id}`}>
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {leads.length === 0 && (
                    <div className="text-center py-8 text-gray-500" data-testid="no-leads-message">
                      No leads found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accounts Tab */}
          <TabsContent value="accounts" className="space-y-6">
            <Card data-testid="accounts-management-card">
              <CardHeader>
                <CardTitle>Accounts Management</CardTitle>
                <CardDescription>Manage your customer accounts and companies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accounts.map((account: any) => (
                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800" data-testid={`account-item-${account.id}`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg" data-testid={`account-name-${account.id}`}>
                            {account.legal_name}
                          </h3>
                          <Badge variant="outline" data-testid={`account-size-${account.id}`}>
                            {account.size_tier}
                          </Badge>
                          <Badge variant="outline" data-testid={`account-industry-${account.id}`}>
                            {account.industry}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {account.website && (
                            <span className="flex items-center gap-1" data-testid={`account-website-${account.id}`}>
                              <TrendingUp className="h-4 w-4" />
                              {account.website}
                            </span>
                          )}
                          {account.phone && (
                            <span className="flex items-center gap-1" data-testid={`account-phone-${account.id}`}>
                              <Phone className="h-4 w-4" />
                              {account.phone}
                            </span>
                          )}
                          {account.email && (
                            <span className="flex items-center gap-1" data-testid={`account-email-${account.id}`}>
                              <Mail className="h-4 w-4" />
                              {account.email}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" data-testid={`button-view-${account.id}`}>View</Button>
                        <Button variant="outline" size="sm" data-testid={`button-edit-${account.id}`}>Edit</Button>
                      </div>
                    </div>
                  ))}
                  
                  {accounts.length === 0 && (
                    <div className="text-center py-8 text-gray-500" data-testid="no-accounts-message">
                      No accounts found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs placeholder */}
          <TabsContent value="contacts">
            <Card data-testid="contacts-placeholder-card">
              <CardHeader>
                <CardTitle>Contacts</CardTitle>
                <CardDescription>Manage individual contacts and their information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500" data-testid="contacts-coming-soon">
                  Contacts management interface coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deals">
            <Card data-testid="deals-placeholder-card">
              <CardHeader>
                <CardTitle>Deals Pipeline</CardTitle>
                <CardDescription>Track opportunities through your sales process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500" data-testid="deals-coming-soon">
                  Deals pipeline interface coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets">
            <Card data-testid="tickets-placeholder-card">
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>Manage customer support requests and issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500" data-testid="tickets-coming-soon">
                  Support tickets interface coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}