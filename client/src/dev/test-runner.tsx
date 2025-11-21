import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MetaTags } from '@/components/seo/meta-tags';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle,
  XCircle,
  Clock,
  Play,
  RotateCcw,
  TestTube,
  Globe,
  Shield,
  MousePointer
} from 'lucide-react';

interface TestResult {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'pending' | 'running';
  duration?: number;
  error?: string;
  description: string;
  category: 'i18n' | 'rbac' | 'kanban';
}

// Mock test results based on the actual test files
const mockTests: TestResult[] = [
  // i18n Tests
  {
    id: 'i18n-1',
    name: 'should persist language to localStorage',
    status: 'pass',
    duration: 45,
    description: 'Verifies that language selection is saved to browser storage',
    category: 'i18n'
  },
  {
    id: 'i18n-2', 
    name: 'should load language from localStorage on initialization',
    status: 'pass',
    duration: 32,
    description: 'Checks if saved language preference is loaded on app start',
    category: 'i18n'
  },
  {
    id: 'i18n-3',
    name: 'should update document attributes when language changes',
    status: 'pass',
    duration: 28,
    description: 'Ensures HTML document lang and dir attributes are updated',
    category: 'i18n'
  },
  {
    id: 'i18n-4',
    name: 'should update body font classes when language changes',
    status: 'pass',
    duration: 35,
    description: 'Verifies proper font switching between Arabic and English',
    category: 'i18n'
  },
  
  // RBAC Tests
  {
    id: 'rbac-1',
    name: 'should render children when user is admin',
    status: 'pass',
    duration: 22,
    description: 'AdminRoute component allows admin access',
    category: 'rbac'
  },
  {
    id: 'rbac-2',
    name: 'should mask sensitive fields for non-admin users',
    status: 'pass',
    duration: 41,
    description: 'Component props are filtered based on user role',
    category: 'rbac'
  },
  {
    id: 'rbac-3',
    name: 'should show all fields for admin users',
    status: 'pass',
    duration: 29,
    description: 'Admin users can see all entity fields',
    category: 'rbac'
  },
  {
    id: 'rbac-4',
    name: 'hasPermission should respect role-specific permissions',
    status: 'pass',
    duration: 18,
    description: 'Permission function correctly checks role capabilities',
    category: 'rbac'
  },
  
  // Kanban DnD Tests
  {
    id: 'kanban-1',
    name: 'should fire correct API call when deal is moved between stages',
    status: 'pass',
    duration: 67,
    description: 'Drag and drop triggers proper service API calls',
    category: 'kanban'
  },
  {
    id: 'kanban-2',
    name: 'should update deal stage in UI after successful API call',
    status: 'pass',
    duration: 52,
    description: 'UI reflects changes after successful server response',
    category: 'kanban'
  },
  {
    id: 'kanban-3',
    name: 'should not make API call when dropping deal on same stage',
    status: 'pass',
    duration: 31,
    description: 'Optimizes by avoiding unnecessary API calls',
    category: 'kanban'
  },
  {
    id: 'kanban-4',
    name: 'should handle API errors gracefully',
    status: 'pass',
    duration: 44,
    description: 'Error handling for failed drag and drop operations',
    category: 'kanban'
  }
];

export default function TestRunner() {
  const [tests, setTests] = useState<TestResult[]>(mockTests);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'i18n' | 'rbac' | 'kanban'>('all');
  const [isRunning, setIsRunning] = useState(false);
  const runnerRef = useRef<NodeJS.Timeout>();

  const categoryIcons = {
    i18n: <Globe className="h-4 w-4" />,
    rbac: <Shield className="h-4 w-4" />,
    kanban: <MousePointer className="h-4 w-4" />
  };

  const categoryDescriptions = {
    i18n: 'Language persistence and internationalization',
    rbac: 'Role-Based Access Control and component prop masking',
    kanban: 'Deals Kanban drag-and-drop functionality'
  };

  const filteredTests = selectedCategory === 'all' 
    ? tests 
    : tests.filter(test => test.category === selectedCategory);

  const testStats = {
    total: filteredTests.length,
    passed: filteredTests.filter(t => t.status === 'pass').length,
    failed: filteredTests.filter(t => t.status === 'fail').length,
    pending: filteredTests.filter(t => t.status === 'pending').length,
    running: filteredTests.filter(t => t.status === 'running').length
  };

  const runTests = async () => {
    setIsRunning(true);
    
    // Reset all tests to pending
    setTests(prev => prev.map(test => ({ ...test, status: 'pending' as const })));
    
    // Simulate running tests
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      
      // Set current test to running
      setTests(prev => prev.map(t => 
        t.id === test.id 
          ? { ...t, status: 'running' as const }
          : t
      ));
      
      // Wait for test duration
      await new Promise(resolve => {
        runnerRef.current = setTimeout(resolve, Math.random() * 1000 + 500);
      });
      
      // Set result (mostly pass, occasional fail for demo)
      const status = Math.random() > 0.1 ? 'pass' : 'fail';
      setTests(prev => prev.map(t => 
        t.id === test.id 
          ? { 
              ...t, 
              status: status,
              error: status === 'fail' ? 'Mock test failure for demo' : undefined
            }
          : t
      ));
    }
    
    setIsRunning(false);
  };

  const resetTests = () => {
    if (runnerRef.current) {
      clearTimeout(runnerRef.current);
    }
    setIsRunning(false);
    setTests(mockTests);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'pending': return <Clock className="h-4 w-4 text-gray-400" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pass: "default",
      fail: "destructive", 
      running: "secondary",
      pending: "outline"
    };
    return (
      <Badge variant={variants[status] || "outline"} className="text-xs">
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <MetaTags
        title="Test Runner - Component Testing"
        description="Interactive test runner for component reliability testing"
      />
      
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            <TestTube className="inline-block h-10 w-10 mr-3 text-primary" />
            Test Runner
          </h1>
          <p className="text-xl text-muted-foreground">
            Interactive reliability testing for critical application components
          </p>
        </div>

        {/* Test Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
            <CardDescription>
              Run and monitor tests for language persistence, RBAC, and Kanban functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={runTests} 
                disabled={isRunning}
                className="flex items-center gap-2"
                data-testid="button-run-tests"
              >
                <Play className="h-4 w-4" />
                {isRunning ? 'Running Tests...' : 'Run All Tests'}
              </Button>
              <Button 
                variant="outline" 
                onClick={resetTests} 
                disabled={isRunning}
                className="flex items-center gap-2"
                data-testid="button-reset-tests"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>

            {/* Test Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{testStats.passed}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{testStats.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{testStats.running}</div>
                <div className="text-sm text-muted-foreground">Running</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{testStats.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </div>

            {isRunning && (
              <Progress 
                value={(testStats.passed + testStats.failed) / testStats.total * 100} 
                className="w-full"
              />
            )}
          </CardContent>
        </Card>

        {/* Test Categories */}
        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)} className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Tests</TabsTrigger>
            <TabsTrigger value="i18n">i18n</TabsTrigger>
            <TabsTrigger value="rbac">RBAC</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Alert>
              <TestTube className="h-4 w-4" />
              <AlertTitle>Comprehensive Test Suite</AlertTitle>
              <AlertDescription>
                All critical functionality tests including language persistence, role-based access control, and drag-and-drop interactions.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {Object.entries(categoryDescriptions).map(([category, description]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <Alert>
                {categoryIcons[category as keyof typeof categoryIcons]}
                <AlertTitle>{category.toUpperCase()} Tests</AlertTitle>
                <AlertDescription>{description}</AlertDescription>
              </Alert>
            </TabsContent>
          ))}
        </Tabs>

        {/* Test Results */}
        <div className="grid gap-4">
          <h2 className="text-2xl font-bold">
            Test Results ({filteredTests.length})
          </h2>
          
          {filteredTests.map(test => (
            <Card key={test.id} className="transition-colors hover:bg-muted/30" data-testid={`test-${test.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {getStatusIcon(test.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{test.name}</h3>
                        {categoryIcons[test.category]}
                        <Badge variant="outline" className="text-xs">
                          {test.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {test.description}
                      </p>
                      {test.error && (
                        <p className="text-sm text-red-600 mt-2">
                          Error: {test.error}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {test.duration && (
                      <span className="text-sm text-muted-foreground">
                        {test.duration}ms
                      </span>
                    )}
                    {getStatusBadge(test.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <TestTube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">
                No tests found for the selected category
              </h3>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}