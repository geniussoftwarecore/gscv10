import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Building2, 
  DollarSign, 
  Activity,
  Plus,
  Eye,
  Edit,
  Trash2,
  History,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';

// Test data interfaces
interface TestContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  accountId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TestCompany {
  id: string;
  name: string;
  type: string;
  industry?: string;
  website?: string;
  email?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TestUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'agent' | 'viewer';
  token: string;
}

export default function CrmTestPage() {
  const [currentUser, setCurrentUser] = useState<TestUser | null>(null);
  const [contacts, setContacts] = useState<TestContact[]>([]);
  const [companies, setCompanies] = useState<TestCompany[]>([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<{ type: string; id: string; name: string } | null>(null);
  const { toast } = useToast();

  // Test users with different roles
  const testUsers = [
    { id: '1', name: 'Admin User', email: 'admin@test.com', role: 'admin' as const, token: 'admin-token' },
    { id: '2', name: 'Manager User', email: 'manager@test.com', role: 'manager' as const, token: 'manager-token' },
    { id: '3', name: 'Agent User', email: 'agent@test.com', role: 'agent' as const, token: 'agent-token' },
    { id: '4', name: 'Viewer User', email: 'viewer@test.com', role: 'viewer' as const, token: 'viewer-token' }
  ];

  // Mock authentication for testing
  useEffect(() => {
    // Set admin user by default for testing
    setCurrentUser(testUsers[0]);
  }, []);

  // Fetch data with current user role
  const fetchData = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const headers = {
        'Authorization': `Bearer ${currentUser.token}`,
        'Content-Type': 'application/json'
      };

      // Fetch contacts and companies
      const [contactsRes, companiesRes] = await Promise.all([
        fetch('/api/crm/contacts', { headers }),
        fetch('/api/crm/companies', { headers })
      ]);

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        setContacts(contactsData.contacts || []);
      }

      if (companiesRes.ok) {
        const companiesData = await companiesRes.json();
        setCompanies(companiesData.companies || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch CRM data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Create test contact
  const createTestContact = async () => {
    if (!currentUser) return;

    const testContact = {
      firstName: 'Test',
      lastName: 'Contact',
      email: `test.contact.${Date.now()}@example.com`,
      phone: '+1234567890',
      jobTitle: 'Test Manager',
      isActive: true
    };

    try {
      const response = await fetch('/api/crm/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testContact)
      });

      if (response.ok) {
        const createdContact = await response.json();
        toast({
          title: 'Success',
          description: 'Test contact created successfully',
        });
        fetchData();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create contact');
      }
    } catch (error) {
      console.error('Error creating contact:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create contact',
        variant: 'destructive'
      });
    }
  };

  // Create test company
  const createTestCompany = async () => {
    if (!currentUser) return;

    const testCompany = {
      name: `Test Company ${Date.now()}`,
      type: 'prospect',
      industry: 'Technology',
      website: 'https://example.com',
      email: `contact@testcompany${Date.now()}.com`,
      isActive: true
    };

    try {
      const response = await fetch('/api/crm/companies', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testCompany)
      });

      if (response.ok) {
        const createdCompany = await response.json();
        toast({
          title: 'Success',
          description: 'Test company created successfully',
        });
        fetchData();
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create company');
      }
    } catch (error) {
      console.error('Error creating company:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create company',
        variant: 'destructive'
      });
    }
  };

  // View audit history
  const viewAuditHistory = async (entityType: string, entityId: string, entityName: string) => {
    if (!currentUser) return;

    setSelectedEntity({ type: entityType, id: entityId, name: entityName });

    try {
      const response = await fetch(`/api/crm/${entityType}/${entityId}/history`, {
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const historyData = await response.json();
        setAuditLogs(historyData.logs || []);
      }
    } catch (error) {
      console.error('Error fetching audit history:', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'agent': return 'bg-green-100 text-green-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const hasCreatePermission = currentUser && ['admin', 'manager', 'agent'].includes(currentUser.role);
  const hasEditPermission = currentUser && ['admin', 'manager', 'agent'].includes(currentUser.role);
  const hasDeletePermission = currentUser && ['admin', 'manager'].includes(currentUser.role);
  const hasAuditPermission = currentUser && ['admin', 'manager'].includes(currentUser.role);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">CRM System Test</h1>
          <p className="text-gray-600">Testing role-based access control and audit logging</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-medium">{currentUser.name}</div>
            <Badge className={getRoleBadgeColor(currentUser.role)}>
              {currentUser.role.toUpperCase()}
            </Badge>
          </div>
          <select 
            value={currentUser.id}
            onChange={(e) => {
              const user = testUsers.find(u => u.id === e.target.value);
              if (user) {
                setCurrentUser(user);
                setContacts([]);
                setCompanies([]);
                setAuditLogs([]);
              }
            }}
            className="px-3 py-2 border rounded-md"
          >
            {testUsers.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          {hasAuditPermission && <TabsTrigger value="audit">Audit Logs</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Permission Level</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentUser.role}</div>
                <p className="text-xs text-muted-foreground">
                  Current user role
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Create Access</CardTitle>
                {hasCreatePermission ? 
                  <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
                  <AlertCircle className="h-4 w-4 text-red-600" />
                }
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hasCreatePermission ? 'Yes' : 'No'}</div>
                <p className="text-xs text-muted-foreground">
                  Can create records
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Edit Access</CardTitle>
                {hasEditPermission ? 
                  <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
                  <AlertCircle className="h-4 w-4 text-red-600" />
                }
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hasEditPermission ? 'Yes' : 'No'}</div>
                <p className="text-xs text-muted-foreground">
                  Can edit records
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Audit Access</CardTitle>
                {hasAuditPermission ? 
                  <CheckCircle2 className="h-4 w-4 text-green-600" /> : 
                  <AlertCircle className="h-4 w-4 text-red-600" />
                }
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{hasAuditPermission ? 'Yes' : 'No'}</div>
                <p className="text-xs text-muted-foreground">
                  Can view audit logs
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Test Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button onClick={fetchData} disabled={loading}>
                  <Eye className="h-4 w-4 mr-2" />
                  {loading ? 'Loading...' : 'Fetch Data'}
                </Button>
                {hasCreatePermission && (
                  <>
                    <Button onClick={createTestContact} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Test Contact
                    </Button>
                    <Button onClick={createTestCompany} variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Test Company
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Contacts ({contacts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contacts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <div>No contacts found</div>
                  <div className="text-sm">Create a test contact to see role-based filtering</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {contacts.map(contact => (
                    <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          {contact.firstName} {contact.lastName}
                        </div>
                        <div className="text-sm text-gray-600">{contact.email}</div>
                        {contact.jobTitle && (
                          <div className="text-xs text-gray-500">{contact.jobTitle}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={contact.isActive ? 'default' : 'secondary'}>
                          {contact.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {hasAuditPermission && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewAuditHistory('contacts', contact.id, `${contact.firstName} ${contact.lastName}`)}
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="companies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Companies ({companies.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {companies.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <div>No companies found</div>
                  <div className="text-sm">Create a test company to see role-based filtering</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {companies.map(company => (
                    <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{company.name}</div>
                        <div className="text-sm text-gray-600">{company.email}</div>
                        {company.industry && (
                          <div className="text-xs text-gray-500">{company.industry}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{company.type}</Badge>
                        <Badge variant={company.isActive ? 'default' : 'secondary'}>
                          {company.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {hasAuditPermission && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewAuditHistory('companies', company.id, company.name)}
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {hasAuditPermission && (
          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Audit Logs
                  {selectedEntity && (
                    <span className="text-sm font-normal text-gray-500">
                      for {selectedEntity.name}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {auditLogs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <div>No audit logs found</div>
                    <div className="text-sm">Create or edit records to see audit trail</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {auditLogs.map((log: any) => (
                      <div key={log.id} className="flex items-start gap-3 p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{log.action}</Badge>
                            <span className="text-sm text-gray-600">by {log.actorId}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(log.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-800">{log.entityName}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}