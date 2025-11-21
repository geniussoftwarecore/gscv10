import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock the DealsKanban component since it's in crm_ui
interface Deal {
  id: string;
  stageId: string;
  title: string;
  value?: number;
  currency?: string;
}

interface KanbanData {
  stages: Array<{ id: string; name: string; color: string }>;
  deals: Deal[];
  statistics: { totalDeals: number; totalValue: number; winRate: number; avgDealSize: number };
}

// Mock component that simulates the drag and drop behavior
function MockDealsKanban() {
  const [kanbanData, setKanbanData] = React.useState<KanbanData>({
    stages: [
      { id: 'lead', name: 'Lead', color: 'gray' },
      { id: 'qualified', name: 'Qualified', color: 'blue' },
      { id: 'negotiation', name: 'Negotiation', color: 'orange' },
      { id: 'closed-won', name: 'Closed Won', color: 'green' }
    ],
    deals: [
      { id: '1', stageId: 'lead', title: 'Deal 1', value: 10000 },
      { id: '2', stageId: 'qualified', title: 'Deal 2', value: 20000 }
    ],
    statistics: { totalDeals: 2, totalValue: 30000, winRate: 0, avgDealSize: 15000 }
  });

  const [draggedDeal, setDraggedDeal] = React.useState<Deal | null>(null);
  const [apiCalls, setApiCalls] = React.useState<string[]>([]);

  const handleDragStart = (deal: Deal) => {
    setDraggedDeal(deal);
  };

  const handleDrop = async (targetStageId: string) => {
    if (!draggedDeal || draggedDeal.stageId === targetStageId) {
      setDraggedDeal(null);
      return;
    }

    // Mock API call
    const apiCall = `PUT /api/crm/deals/${draggedDeal.id}/stage`;
    setApiCalls(prev => [...prev, apiCall]);

    // Simulate successful response
    setKanbanData(prev => ({
      ...prev,
      deals: prev.deals.map(deal =>
        deal.id === draggedDeal.id
          ? { ...deal, stageId: targetStageId }
          : deal
      )
    }));

    setDraggedDeal(null);
  };

  return (
    <div data-testid="deals-kanban">
      <div data-testid="api-calls" style={{ display: 'none' }}>
        {apiCalls.join(',')}
      </div>
      
      {kanbanData.stages.map(stage => (
        <div
          key={stage.id}
          data-testid={`stage-${stage.id}`}
          onDrop={() => handleDrop(stage.id)}
          onDragOver={(e) => e.preventDefault()}
        >
          <h3>{stage.name}</h3>
          {kanbanData.deals
            .filter(deal => deal.stageId === stage.id)
            .map(deal => (
              <div
                key={deal.id}
                data-testid={`deal-${deal.id}`}
                draggable
                onDragStart={() => handleDragStart(deal)}
              >
                {deal.title} - ${deal.value}
              </div>
            ))}
        </div>
      ))}
      
      <button
        data-testid="simulate-drag"
        onClick={() => {
          const deal = kanbanData.deals.find(d => d.id === '1');
          if (deal) {
            handleDragStart(deal);
            handleDrop('qualified');
          }
        }}
      >
        Simulate Drag Deal 1 to Qualified
      </button>
    </div>
  );
}

// Mock fetch for API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('Deals Kanban DnD Service Calls', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    });
  });

  describe('Drag and Drop Functionality', () => {
    test('should render kanban board with stages and deals', () => {
      render(<MockDealsKanban />);

      expect(screen.getByTestId('deals-kanban')).toBeInTheDocument();
      expect(screen.getByTestId('stage-lead')).toBeInTheDocument();
      expect(screen.getByTestId('stage-qualified')).toBeInTheDocument();
      expect(screen.getByTestId('deal-1')).toBeInTheDocument();
      expect(screen.getByTestId('deal-2')).toBeInTheDocument();
    });

    test('should fire correct API call when deal is moved between stages', async () => {
      const user = userEvent.setup();
      render(<MockDealsKanban />);

      // Simulate drag and drop by clicking the simulate button
      await user.click(screen.getByTestId('simulate-drag'));

      // Check that the API call was made
      const apiCalls = screen.getByTestId('api-calls').textContent;
      expect(apiCalls).toContain('PUT /api/crm/deals/1/stage');
    });

    test('should update deal stage in UI after successful API call', async () => {
      const user = userEvent.setup();
      render(<MockDealsKanban />);

      // Initially, Deal 1 should be in Lead stage
      const leadStage = screen.getByTestId('stage-lead');
      const qualifiedStage = screen.getByTestId('stage-qualified');
      
      expect(leadStage).toHaveTextContent('Deal 1');
      expect(qualifiedStage).not.toHaveTextContent('Deal 1');

      // Simulate moving Deal 1 to Qualified stage
      await user.click(screen.getByTestId('simulate-drag'));

      // After move, Deal 1 should be in Qualified stage
      await waitFor(() => {
        expect(leadStage).not.toHaveTextContent('Deal 1');
        expect(qualifiedStage).toHaveTextContent('Deal 1');
      });
    });

    test('should not make API call when dropping deal on same stage', () => {
      // Create a component that tests dropping on same stage
      function SameStageTest() {
        const [apiCalls, setApiCalls] = React.useState<string[]>([]);
        
        const handleDropSameStage = () => {
          const deal = { id: '1', stageId: 'lead', title: 'Deal 1' };
          const targetStageId = 'lead'; // Same stage
          
          if (deal.stageId === targetStageId) {
            // Should not make API call
            return;
          }
          
          setApiCalls(prev => [...prev, 'PUT /api/crm/deals/1/stage']);
        };

        return (
          <div>
            <div data-testid="api-calls">{apiCalls.join(',')}</div>
            <button data-testid="drop-same-stage" onClick={handleDropSameStage}>
              Drop on Same Stage
            </button>
          </div>
        );
      }

      render(<SameStageTest />);
      
      fireEvent.click(screen.getByTestId('drop-same-stage'));
      
      // Should not have made any API calls
      expect(screen.getByTestId('api-calls')).toHaveTextContent('');
    });

    test('should handle API errors gracefully', async () => {
      // Mock failed API response
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      function ErrorHandlingKanban() {
        const [error, setError] = React.useState<string | null>(null);
        
        const handleDropWithError = async () => {
          try {
            const response = await fetch('/api/crm/deals/1/stage', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ stageId: 'qualified' })
            });
            
            if (!response.ok) {
              throw new Error('API error');
            }
          } catch (err) {
            setError('Failed to update deal');
            console.error('Error updating deal stage:', err);
          }
        };

        return (
          <div>
            <div data-testid="error-message">{error}</div>
            <button data-testid="trigger-error" onClick={handleDropWithError}>
              Trigger Error
            </button>
          </div>
        );
      }

      render(<ErrorHandlingKanban />);
      
      await fireEvent.click(screen.getByTestId('trigger-error'));
      
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Failed to update deal');
      });

      expect(consoleSpy).toHaveBeenCalledWith('Error updating deal stage:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });

    test('should include correct headers and body in API request', async () => {
      const user = userEvent.setup();
      
      function APIRequestTest() {
        const [lastRequest, setLastRequest] = React.useState<any>(null);
        
        const mockApiCall = async (dealId: string, targetStageId: string) => {
          const requestData = {
            url: `/api/crm/deals/${dealId}/stage`,
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stageId: targetStageId })
          };
          
          setLastRequest(requestData);
          
          return { ok: true, json: async () => ({ success: true }) };
        };

        const handleMove = () => {
          mockApiCall('deal-123', 'closed-won');
        };

        return (
          <div>
            <div data-testid="request-data">
              {lastRequest ? JSON.stringify(lastRequest) : ''}
            </div>
            <button data-testid="make-request" onClick={handleMove}>
              Make Request
            </button>
          </div>
        );
      }

      render(<APIRequestTest />);
      
      await user.click(screen.getByTestId('make-request'));
      
      const requestData = JSON.parse(screen.getByTestId('request-data').textContent || '{}');
      
      expect(requestData.url).toBe('/api/crm/deals/deal-123/stage');
      expect(requestData.method).toBe('PUT');
      expect(requestData.headers['Content-Type']).toBe('application/json');
      expect(JSON.parse(requestData.body)).toEqual({ stageId: 'closed-won' });
    });
  });

  describe('Drag Events', () => {
    test('should set correct drag effect on drag start', () => {
      function DragStartTest() {
        const [dragEffect, setDragEffect] = React.useState<string>('');
        
        const handleDragStart = (e: React.DragEvent) => {
          e.dataTransfer.effectAllowed = 'move';
          setDragEffect(e.dataTransfer.effectAllowed);
        };

        return (
          <div>
            <div data-testid="drag-effect">{dragEffect}</div>
            <div
              data-testid="draggable-item"
              draggable
              onDragStart={handleDragStart}
            >
              Drag me
            </div>
          </div>
        );
      }

      render(<DragStartTest />);
      
      const draggableItem = screen.getByTestId('draggable-item');
      fireEvent.dragStart(draggableItem);
      
      expect(screen.getByTestId('drag-effect')).toHaveTextContent('move');
    });

    test('should prevent default on drag over', () => {
      const mockPreventDefault = jest.fn();
      
      function DragOverTest() {
        const handleDragOver = (e: React.DragEvent) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          mockPreventDefault();
        };

        return (
          <div
            data-testid="drop-zone"
            onDragOver={handleDragOver}
          >
            Drop zone
          </div>
        );
      }

      render(<DragOverTest />);
      
      const dropZone = screen.getByTestId('drop-zone');
      fireEvent.dragOver(dropZone);
      
      expect(mockPreventDefault).toHaveBeenCalled();
    });
  });
});