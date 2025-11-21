import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge, Input } from "./base";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../client/src/components/ui/tabs";
import { useLanguage } from "../../client/src/i18n/lang";
import { 
  Users, Building2, UserCheck, Target, Activity, Ticket,
  Phone, Mail, Calendar, DollarSign, TrendingUp, Filter
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface CrmStats {
  totalLeads: number;
  totalAccounts: number;
  totalContacts: number;
  totalOpportunities: number;
  openTickets: number;
  totalRevenue: string;
}

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  lead_status: string;
  lead_rating: string;
  lead_score: number;
  estimated_value: string;
  created_at: string;
}

interface Account {
  id: string;
  legal_name: string;
  industry: string;
  size_tier: string;
  website: string;
  phone: string;
  email: string;
  created_at: string;
}

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  primary_email: string;
  job_title: string;
  account_id: string;
  phones: string[];
  created_at: string;
}

interface Opportunity {
  id: string;
  name: string;
  stage: string;
  expected_value: string;
  close_date: string;
  win_probability: number;
  account_id: string;
  created_at: string;
}

interface Ticket {
  id: string;
  ticket_number: string;
  subject: string;
  priority: string;
  status: string;
  contact_id: string;
  created_at: string;
}

export default function CrmDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch CRM data
  const { data: leadsData } = useQuery({
    queryKey: ['/api/crm/leads'],
    enabled: true
  });

  const { data: accountsData } = useQuery({
    queryKey: ['/api/crm/accounts'],
    enabled: true
  });

  const { data: contactsData } = useQuery({
    queryKey: ['/api/crm/contacts'],
    enabled: true
  });

  const { data: opportunitiesData } = useQuery({
    queryKey: ['/api/crm/opportunities'],
    enabled: true
  });

  const { data: ticketsData } = useQuery({
    queryKey: ['/api/crm/tickets'],
    enabled: true
  });

  const leads: Lead[] = Array.isArray(leadsData?.leads) ? leadsData.leads : [];
  const accounts: Account[] = Array.isArray(accountsData?.accounts) ? accountsData.accounts : [];
  const contacts: Contact[] = Array.isArray(contactsData?.contacts) ? contactsData.contacts : [];
  const opportunities: Opportunity[] = Array.isArray(opportunitiesData?.opportunities) ? opportunitiesData.opportunities : [];
  const tickets: Ticket[] = Array.isArray(ticketsData?.tickets) ? ticketsData.tickets : [];

  // Calculate stats
  const stats: CrmStats = {
    totalLeads: leads.length,
    totalAccounts: accounts.length,
    totalContacts: contacts.length,
    totalOpportunities: opportunities.length,
    openTickets: tickets.filter(t => t.status === 'open').length,
    totalRevenue: opportunities
      .filter(o => o.stage === 'closed-won')
      .reduce((sum, o) => sum + parseFloat(o.expected_value || '0'), 0)
      .toLocaleString()
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'hot': return 'bg-red-500';
      case 'warm': return 'bg-orange-500';
      case 'cold': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'qualified': return 'bg-green-500';
      case 'converted': return 'bg-purple-500';
      case 'closed-won': return 'bg-green-600';
      case 'closed-lost': return 'bg-red-500';
      case 'open': return 'bg-yellow-500';
      case 'in_progress': return 'bg-blue-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            CRM Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your customer relationships and sales pipeline
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLeads}</div>
              <p className="text-xs text-muted-foreground">Active prospects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accounts</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAccounts}</div>
              <p className="text-xs text-muted-foreground">Companies</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalContacts}</div>
              <p className="text-xs text-muted-foreground">People</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deals</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOpportunities}</div>
              <p className="text-xs text-muted-foreground">Opportunities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.openTickets}</div>
              <p className="text-xs text-muted-foreground">Open issues</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue}</div>
              <p className="text-xs text-muted-foreground">Closed deals</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 w-full mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="tickets">Support</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Leads</CardTitle>
                  <CardDescription>Latest prospects in your pipeline</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {leads.slice(0, 5).map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-semibold">{lead.first_name} {lead.last_name}</div>
                        <div className="text-sm text-gray-600">{lead.company}</div>
                        <div className="text-xs text-gray-500">${lead.estimated_value}</div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getRatingColor(lead.lead_rating)} text-white`}>
                          {lead.lead_rating}
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">Score: {lead.lead_score}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Open Tickets</CardTitle>
                  <CardDescription>Support tickets requiring attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tickets.filter(t => t.status === 'open').slice(0, 5).map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-semibold">{ticket.ticket_number}</div>
                        <div className="text-sm text-gray-600">{ticket.subject}</div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getPriorityColor(ticket.priority)} text-white`}>
                          {ticket.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-6">
            <Card>
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
                  />
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {leads
                    .filter(lead => 
                      `${lead.first_name} ${lead.last_name} ${lead.company}`.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {lead.first_name} {lead.last_name}
                          </h3>
                          <Badge className={`${getRatingColor(lead.lead_rating)} text-white`}>
                            {lead.lead_rating}
                          </Badge>
                          <Badge className={`${getStatusColor(lead.lead_status)} text-white`}>
                            {lead.lead_status}
                          </Badge>
                        </div>
                        <div className="text-gray-600 mb-1">{lead.company}</div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {lead.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ${lead.estimated_value}
                          </span>
                          <span>Score: {lead.lead_score}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accounts Tab */}
          <TabsContent value="accounts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Accounts Management</CardTitle>
                <CardDescription>Manage your customer accounts and companies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {accounts.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{account.legal_name}</h3>
                          <Badge variant="outline">{account.size_tier}</Badge>
                          <Badge variant="outline">{account.industry}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {account.website && (
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              {account.website}
                            </span>
                          )}
                          {account.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {account.phone}
                            </span>
                          )}
                          {account.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {account.email}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs would be similar... */}
          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Contacts</CardTitle>
                <CardDescription>Manage individual contacts and their information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Contacts management interface coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deals">
            <Card>
              <CardHeader>
                <CardTitle>Deals Pipeline</CardTitle>
                <CardDescription>Track opportunities through your sales process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  Deals pipeline interface coming soon...
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>Manage customer support requests and issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
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