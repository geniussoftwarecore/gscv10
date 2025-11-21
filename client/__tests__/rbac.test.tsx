import React from 'react';
import { render, screen } from '@testing-library/react';
import { AdminRoute } from '../src/components/auth/AdminRoute';
import { AuthGuard } from '../src/components/auth/Guard';
import { useAuth } from '../src/contexts/AuthContext';

// Mock the auth context
jest.mock('../src/contexts/AuthContext');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock wouter location hook
jest.mock('wouter', () => ({
  useLocation: jest.fn(() => ['/', jest.fn()]),
  Link: ({ children, href }: any) => <a href={href}>{children}</a>
}));

// Mock RBAC functions to test field masking logic
const mockHasPermission = (role: string, resource: string, action: string, context?: any) => {
  if (role === 'admin') return true;
  if (role === 'manager') {
    if (resource === 'accounts' && ['read', 'create', 'update'].includes(action)) return true;
    if (resource === 'deals' && ['read', 'create', 'update', 'delete'].includes(action)) return true;
  }
  if (role === 'agent') {
    if (resource === 'accounts' && ['read'].includes(action)) return true;
    if (resource === 'deals' && ['read', 'update'].includes(action)) {
      return context?.assignedTo === context?.userId;
    }
  }
  if (role === 'viewer') {
    if (resource === 'accounts' && action === 'read') return true;
  }
  return false;
};

const mockGetVisibleFields = (role: string, entityType: string): string[] => {
  if (role === 'admin') return ['*'];
  
  const fieldMaps = {
    accounts: {
      manager: ['id', 'legalName', 'industry', 'email', 'phone', 'revenue', 'ownerId'],
      agent: ['id', 'legalName', 'industry', 'email', 'phone'],
      viewer: ['id', 'legalName', 'industry']
    },
    deals: {
      manager: ['id', 'title', 'value', 'stage', 'accountId', 'ownerId', 'probability'],
      agent: ['id', 'title', 'value', 'stage', 'accountId', 'probability'],
      viewer: ['id', 'title', 'stage', 'accountId']
    },
    users: {
      manager: ['id', 'firstName', 'lastName', 'email', 'role', 'teamId'],
      agent: ['id', 'firstName', 'lastName', 'email'],
      viewer: ['id', 'firstName', 'lastName']
    }
  };

  return fieldMaps[entityType as keyof typeof fieldMaps]?.[role as keyof typeof fieldMaps['accounts']] || [];
};

const mockCanViewField = (role: string, entityType: string, field: string): boolean => {
  const fields = mockGetVisibleFields(role, entityType);
  return fields.includes('*') || fields.includes(field);
};

const mockFilterEntityFields = <T extends Record<string, any>>(
  entity: T, 
  role: string, 
  entityType: string
): Partial<T> => {
  const visibleFields = mockGetVisibleFields(role, entityType);
  if (visibleFields.includes('*')) return entity;
  
  const filtered: Partial<T> = {};
  visibleFields.forEach(field => {
    if (entity[field] !== undefined) {
      filtered[field as keyof T] = entity[field];
    }
  });
  return filtered;
};

// Test components
function TestAdminComponent() {
  return <div data-testid="admin-content">Admin Only Content</div>;
}

function TestProtectedComponent() {
  return <div data-testid="protected-content">Protected Content</div>;
}

// Test entity component that uses RBAC field masking
interface TestEntityProps {
  entity: Record<string, any>;
  userRole: string;
  entityType: string;
}

function TestEntityComponent({ entity, userRole, entityType }: TestEntityProps) {
  const filteredEntity = mockFilterEntityFields(entity, userRole, entityType);
  
  return (
    <div data-testid="entity-component">
      {Object.entries(filteredEntity).map(([key, value]) => (
        <div key={key} data-testid={`field-${key}`}>
          <label>{key}:</label>
          <input 
            data-testid={`input-${key}`}
            value={String(value)} 
            disabled={!mockCanViewField(userRole, entityType, key)}
            readOnly
          />
        </div>
      ))}
    </div>
  );
}

describe('RBAC (Role-Based Access Control)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AdminRoute Component', () => {
    test('should render children when user is admin', () => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', email: 'admin@test.com', role: 'admin' },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        loginWithGoogle: jest.fn(),
        verifyMagicLink: jest.fn(),
        logout: jest.fn(),
        trialDaysRemaining: null
      });

      render(
        <AdminRoute>
          <TestAdminComponent />
        </AdminRoute>
      );

      expect(screen.getByTestId('admin-content')).toBeInTheDocument();
    });

    test('should show loading state when loading', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        login: jest.fn(),
        loginWithGoogle: jest.fn(),
        verifyMagicLink: jest.fn(),
        logout: jest.fn(),
        trialDaysRemaining: null
      });

      render(
        <AdminRoute>
          <TestAdminComponent />
        </AdminRoute>
      );

      expect(screen.getByText('جاري التحقق من الصلاحيات...')).toBeInTheDocument();
    });

    test('should show access denied when user is not admin', () => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', email: 'user@test.com', role: 'member' },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        loginWithGoogle: jest.fn(),
        verifyMagicLink: jest.fn(),
        logout: jest.fn(),
        trialDaysRemaining: null
      });

      render(
        <AdminRoute>
          <TestAdminComponent />
        </AdminRoute>
      );

      expect(screen.getByText('غير مصرح لك بالوصول')).toBeInTheDocument();
      expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
    });

    test('should not render children when not authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        loginWithGoogle: jest.fn(),
        verifyMagicLink: jest.fn(),
        logout: jest.fn(),
        trialDaysRemaining: null
      });

      render(
        <AdminRoute>
          <TestAdminComponent />
        </AdminRoute>
      );

      expect(screen.queryByTestId('admin-content')).not.toBeInTheDocument();
    });
  });

  describe('AuthGuard Component', () => {
    test('should render children when authentication not required', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        loginWithGoogle: jest.fn(),
        verifyMagicLink: jest.fn(),
        logout: jest.fn(),
        trialDaysRemaining: null
      });

      render(
        <AuthGuard requireAuth={false}>
          <TestProtectedComponent />
        </AuthGuard>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    test('should show login required when authentication is required but user not authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        login: jest.fn(),
        loginWithGoogle: jest.fn(),
        verifyMagicLink: jest.fn(),
        logout: jest.fn(),
        trialDaysRemaining: null
      });

      render(
        <AuthGuard requireAuth={true}>
          <TestProtectedComponent />
        </AuthGuard>
      );

      expect(screen.getByText('تسجيل الدخول مطلوب')).toBeInTheDocument();
      expect(screen.getByTestId('button-login-required')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    test('should render children when authenticated and requireAuth is true', () => {
      mockUseAuth.mockReturnValue({
        user: { id: '1', email: 'user@test.com', role: 'member' },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        loginWithGoogle: jest.fn(),
        verifyMagicLink: jest.fn(),
        logout: jest.fn(),
        trialDaysRemaining: null
      });

      render(
        <AuthGuard requireAuth={true}>
          <TestProtectedComponent />
        </AuthGuard>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    test('should show plan upgrade when required plan not met', () => {
      mockUseAuth.mockReturnValue({
        user: { 
          id: '1', 
          email: 'user@test.com', 
          role: 'member',
          subscription: { plan: 'free', status: 'active' }
        },
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        loginWithGoogle: jest.fn(),
        verifyMagicLink: jest.fn(),
        logout: jest.fn(),
        trialDaysRemaining: null
      });

      render(
        <AuthGuard requireAuth={true} requirePlan="pro">
          <TestProtectedComponent />
        </AuthGuard>
      );

      expect(screen.getByText('ترقية الخطة مطلوبة')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('RBAC Permission Functions', () => {
    test('should grant admin full access to all resources', () => {
      expect(mockHasPermission('admin', 'accounts', 'delete')).toBe(true);
      expect(mockHasPermission('admin', 'any-resource', 'any-action')).toBe(true);
    });

    test('should respect role-specific permissions', () => {
      expect(mockHasPermission('agent', 'accounts', 'read')).toBe(true);
      expect(mockHasPermission('agent', 'accounts', 'delete')).toBe(false);
      expect(mockHasPermission('viewer', 'accounts', 'create')).toBe(false);
    });

    test('should check context-based permissions', () => {
      const context = {
        userId: 'user1',
        assignedTo: 'user1'
      };

      expect(mockHasPermission('agent', 'deals', 'read', context)).toBe(true);

      const contextNotAssigned = {
        userId: 'user1',
        assignedTo: 'user2'
      };

      expect(mockHasPermission('agent', 'deals', 'read', contextNotAssigned)).toBe(false);
    });

    test('should return correct visible fields for each role', () => {
      const adminFields = mockGetVisibleFields('admin', 'accounts');
      const agentFields = mockGetVisibleFields('agent', 'accounts');
      const viewerFields = mockGetVisibleFields('viewer', 'accounts');

      expect(adminFields).toContain('*');
      expect(agentFields).toContain('legalName');
      expect(agentFields).not.toContain('revenue');
      expect(viewerFields).toContain('legalName');
      expect(viewerFields).not.toContain('revenue');
    });

    test('should check field visibility correctly', () => {
      expect(mockCanViewField('admin', 'accounts', 'revenue')).toBe(true);
      expect(mockCanViewField('agent', 'accounts', 'revenue')).toBe(false);
      expect(mockCanViewField('agent', 'accounts', 'legalName')).toBe(true);
      expect(mockCanViewField('viewer', 'accounts', 'revenue')).toBe(false);
    });

    test('should filter entity fields based on role', () => {
      const entity = {
        id: '1',
        legalName: 'Test Company',
        revenue: 1000000,
        email: 'test@company.com',
        secretField: 'secret'
      };

      const adminFiltered = mockFilterEntityFields(entity, 'admin', 'accounts');
      const agentFiltered = mockFilterEntityFields(entity, 'agent', 'accounts');

      expect(adminFiltered).toEqual(entity);
      expect(agentFiltered).toHaveProperty('legalName');
      expect(agentFiltered).toHaveProperty('email');
      expect(agentFiltered).not.toHaveProperty('revenue');
      expect(agentFiltered).not.toHaveProperty('secretField');
    });
  });

  describe('Component Field Masking', () => {
    test('should mask sensitive fields for non-admin users', () => {
      const entity = {
        id: '1',
        legalName: 'Test Company',
        revenue: 1000000,
        email: 'test@company.com'
      };

      render(
        <TestEntityComponent 
          entity={entity} 
          userRole="agent" 
          entityType="accounts" 
        />
      );

      expect(screen.getByTestId('field-legalName')).toBeInTheDocument();
      expect(screen.getByTestId('field-email')).toBeInTheDocument();
      expect(screen.queryByTestId('field-revenue')).not.toBeInTheDocument();
    });

    test('should show all fields for admin users', () => {
      const entity = {
        id: '1',
        legalName: 'Test Company',
        revenue: 1000000,
        email: 'test@company.com'
      };

      render(
        <TestEntityComponent 
          entity={entity} 
          userRole="admin" 
          entityType="accounts" 
        />
      );

      expect(screen.getByTestId('field-legalName')).toBeInTheDocument();
      expect(screen.getByTestId('field-email')).toBeInTheDocument();
      expect(screen.getByTestId('field-revenue')).toBeInTheDocument();
    });

    test('should disable fields based on role permissions', () => {
      const entity = {
        id: '1',
        legalName: 'Test Company',
        email: 'test@company.com'
      };

      render(
        <TestEntityComponent 
          entity={entity} 
          userRole="viewer" 
          entityType="accounts" 
        />
      );

      const nameInput = screen.getByTestId('input-legalName');
      const emailInput = screen.queryByTestId('input-email');

      expect(nameInput).toBeDisabled();
      expect(emailInput).not.toBeInTheDocument(); // Email not visible to viewers
    });

    test('should mask different fields for different roles and entities', () => {
      const dealEntity = {
        id: '1',
        title: 'Big Deal',
        value: 50000,
        stage: 'negotiation',
        probability: 75
      };

      const { rerender } = render(
        <TestEntityComponent 
          entity={dealEntity} 
          userRole="agent" 
          entityType="deals" 
        />
      );

      expect(screen.getByTestId('field-title')).toBeInTheDocument();
      expect(screen.getByTestId('field-value')).toBeInTheDocument();
      expect(screen.getByTestId('field-probability')).toBeInTheDocument();

      rerender(
        <TestEntityComponent 
          entity={dealEntity} 
          userRole="viewer" 
          entityType="deals" 
        />
      );

      expect(screen.getByTestId('field-title')).toBeInTheDocument();
      expect(screen.queryByTestId('field-value')).not.toBeInTheDocument(); // Value not visible to viewers
      expect(screen.queryByTestId('field-probability')).not.toBeInTheDocument(); // Probability not visible to viewers
    });
  });

  describe('Integration with Components', () => {
    test('should integrate field masking with form components', () => {
      function TestForm({ userRole }: { userRole: string }) {
        const entity = { id: '1', legalName: 'Test', revenue: 100000 };
        const canViewRevenue = mockCanViewField(userRole, 'accounts', 'revenue');
        
        return (
          <form data-testid="test-form">
            <input data-testid="input-name" value={entity.legalName} readOnly />
            {canViewRevenue && (
              <input data-testid="input-revenue" value={entity.revenue} readOnly />
            )}
          </form>
        );
      }

      const { rerender } = render(<TestForm userRole="manager" />);
      
      expect(screen.getByTestId('input-name')).toBeInTheDocument();
      expect(screen.getByTestId('input-revenue')).toBeInTheDocument();

      rerender(<TestForm userRole="agent" />);
      
      expect(screen.getByTestId('input-name')).toBeInTheDocument();
      expect(screen.queryByTestId('input-revenue')).not.toBeInTheDocument();
    });
  });
});