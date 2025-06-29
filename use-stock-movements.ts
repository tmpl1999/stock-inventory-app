import { useState, useEffect, useMemo } from 'react';

// Define interfaces for stock movements
export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  batchNumber: string;
  quantity: number;
  fromWarehouse: string;
  fromLocation: string;
  toWarehouse: string;
  toLocation: string;
  movementType: 'New Stock' | 'Transfer' | 'Stock Out' | 'Adjustment';
  movementReason?: string;
  date: string;
  initiatedBy: string;
  orderNumber?: string;
  customerName?: string;
  referenceId?: string;
}

interface MovementFilters {
  query?: string;
  productId?: string;
  movementType?: string;
  dateRange?: string;
  warehouse?: string;
  sort?: {
    column: string;
    direction: 'asc' | 'desc';
  };
}

const useStockMovements = () => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<MovementFilters>({
    sort: { column: 'date', direction: 'desc' }
  });

  // Mock data - in a real app, this would come from an API call to Supabase
  useEffect(() => {
    const fetchStockMovements = async () => {
      try {
        setIsLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        const mockMovements: StockMovement[] = [
          {
            id: "mov-001",
            productId: "item-1",
            productName: "Wireless Keyboard",
            batchNumber: "KB-2023-001",
            quantity: 50,
            fromWarehouse: "",
            fromLocation: "",
            toWarehouse: "Main Warehouse",
            toLocation: "Section A, Shelf 3",
            movementType: "New Stock",
            movementReason: "Initial stock receipt from supplier",
            date: "2023-03-15T09:30:00Z",
            initiatedBy: "John Smith",
            referenceId: "PO-2023-001"
          },
          {
            id: "mov-002",
            productId: "item-1",
            productName: "Wireless Keyboard",
            batchNumber: "KB-2023-001",
            quantity: 30,
            fromWarehouse: "Main Warehouse",
            fromLocation: "Section A, Shelf 3",
            toWarehouse: "Secondary Warehouse",
            toLocation: "Section B, Shelf 5",
            movementType: "Transfer",
            movementReason: "Balance stock between warehouses",
            date: "2023-04-20T14:15:00Z",
            initiatedBy: "Jane Doe"
          },
          {
            id: "mov-003",
            productId: "item-3",
            productName: "USB-C Hub",
            batchNumber: "USB-2023-001",
            quantity: 25,
            fromWarehouse: "Distribution Center",
            fromLocation: "Section C, Shelf 2",
            toWarehouse: "",
            toLocation: "",
            movementType: "Stock Out",
            movementReason: "Customer order",
            date: "2023-05-12T11:45:00Z",
            initiatedBy: "Michael Johnson",
            orderNumber: "10003",
            customerName: "Bob Johnson"
          },
          {
            id: "mov-004",
            productId: "item-4",
            productName: "Monitor 24\"",
            batchNumber: "MON-2023-001",
            quantity: 2,
            fromWarehouse: "Main Warehouse",
            fromLocation: "Section D, Shelf 1",
            toWarehouse: "Main Warehouse",
            toLocation: "Section D, Shelf 1",
            movementType: "Adjustment",
            movementReason: "Damaged during handling",
            date: "2023-07-05T16:20:00Z",
            initiatedBy: "Susan Williams"
          },
          {
            id: "mov-005",
            productId: "item-5",
            productName: "Desk Chair",
            batchNumber: "CH-2023-001",
            quantity: 12,
            fromWarehouse: "",
            fromLocation: "",
            toWarehouse: "Secondary Warehouse",
            toLocation: "Section F, Floor Area",
            movementType: "New Stock",
            date: "2023-04-12T10:00:00Z",
            initiatedBy: "Robert Brown",
            referenceId: "PO-2023-002"
          },
          {
            id: "mov-006",
            productId: "item-2",
            productName: "Wireless Mouse",
            batchNumber: "MS-2023-001",
            quantity: 10,
            fromWarehouse: "Main Warehouse",
            fromLocation: "Section A, Shelf 4",
            toWarehouse: "",
            toLocation: "",
            movementType: "Stock Out",
            movementReason: "Customer order",
            date: "2023-06-18T13:25:00Z",
            initiatedBy: "Jane Doe",
            orderNumber: "10001",
            customerName: "John Smith"
          },
          {
            id: "mov-007",
            productId: "item-7",
            productName: "Wireless Headphones",
            batchNumber: "WH-2023-001",
            quantity: 8,
            fromWarehouse: "Secondary Warehouse",
            fromLocation: "Section C, Shelf 1",
            toWarehouse: "",
            toLocation: "",
            movementType: "Stock Out",
            movementReason: "Customer order",
            date: "2023-08-15T11:10:00Z",
            initiatedBy: "Michael Johnson",
            orderNumber: "10005",
            customerName: "Michael Brown"
          },
          {
            id: "mov-008",
            productId: "item-6",
            productName: "Desk Chair",
            batchNumber: "CH-2023-002",
            quantity: 5,
            fromWarehouse: "",
            fromLocation: "",
            toWarehouse: "Main Warehouse",
            toLocation: "Section E, Floor Area",
            movementType: "New Stock",
            movementReason: "Additional stock from supplier",
            date: "2023-08-10T09:45:00Z",
            initiatedBy: "Robert Brown",
            referenceId: "PO-2023-003"
          },
          {
            id: "mov-009",
            productId: "item-8",
            productName: "Phone Charger",
            batchNumber: "PC-2023-001",
            quantity: 50,
            fromWarehouse: "",
            fromLocation: "",
            toWarehouse: "Distribution Center",
            toLocation: "Section A, Shelf 2",
            movementType: "New Stock",
            date: "2023-07-25T14:30:00Z",
            initiatedBy: "John Smith",
            referenceId: "PO-2023-004"
          },
          {
            id: "mov-010",
            productId: "item-1",
            productName: "Wireless Keyboard",
            batchNumber: "KB-2023-002",
            quantity: 20,
            fromWarehouse: "Secondary Warehouse",
            fromLocation: "Section B, Shelf 5",
            toWarehouse: "Main Warehouse",
            toLocation: "Section A, Shelf 3",
            movementType: "Transfer",
            movementReason: "Consolidating inventory",
            date: "2023-08-01T10:20:00Z",
            initiatedBy: "Susan Williams"
          }
        ];
        
        setMovements(mockMovements);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        setIsLoading(false);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching stock movements');
      }
    };

    fetchStockMovements();
  }, []);

  // Filter and sort movements based on filters
  const filteredMovements = useMemo(() => {
    let filtered = [...movements];
    
    // Apply search query filter
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(movement => 
        movement.productName.toLowerCase().includes(query) ||
        movement.batchNumber.toLowerCase().includes(query) ||
        movement.movementReason?.toLowerCase().includes(query) ||
        movement.initiatedBy.toLowerCase().includes(query) ||
        movement.customerName?.toLowerCase().includes(query)
      );
    }
    
    // Apply product filter
    if (filters.productId) {
      filtered = filtered.filter(movement => 
        movement.productId === filters.productId
      );
    }
    
    // Apply movement type filter
    if (filters.movementType) {
      filtered = filtered.filter(movement => 
        movement.movementType === filters.movementType
      );
    }

    // Apply warehouse filter
    if (filters.warehouse) {
      filtered = filtered.filter(movement => 
        movement.fromWarehouse === filters.warehouse || 
        movement.toWarehouse === filters.warehouse
      );
    }
    
    // Apply date range filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const thisWeekStart = new Date(today);
      thisWeekStart.setDate(today.getDate() - today.getDay());
      const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      const threeMonthsAgo = new Date(today);
      threeMonthsAgo.setMonth(today.getMonth() - 3);
      
      filtered = filtered.filter(movement => {
        const movementDate = new Date(movement.date);
        
        switch (filters.dateRange) {
          case 'today':
            return movementDate >= today;
          case 'yesterday':
            return movementDate >= yesterday && movementDate < today;
          case 'thisWeek':
            return movementDate >= thisWeekStart;
          case 'thisMonth':
            return movementDate >= thisMonthStart;
          case 'lastMonth':
            return movementDate >= lastMonthStart && movementDate <= lastMonthEnd;
          case 'last3Months':
            return movementDate >= threeMonthsAgo;
          default:
            return true;
        }
      });
    }
    
    // Apply sorting
    if (filters.sort) {
      const { column, direction } = filters.sort;
      filtered.sort((a, b) => {
        let valueA: string | number | Date;
        let valueB: string | number | Date;
        
        switch (column) {
          case 'date':
            valueA = new Date(a.date);
            valueB = new Date(b.date);
            break;
          case 'productName':
            valueA = a.productName;
            valueB = b.productName;
            break;
          case 'quantity':
            valueA = a.quantity;
            valueB = b.quantity;
            break;
          case 'movementType':
            valueA = a.movementType;
            valueB = b.movementType;
            break;
          case 'initiatedBy':
            valueA = a.initiatedBy;
            valueB = b.initiatedBy;
            break;
          default:
            valueA = a[column as keyof StockMovement] || '';
            valueB = b[column as keyof StockMovement] || '';
        }
        
        if (valueA < valueB) {
          return direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filtered;
  }, [movements, filters]);

  // Get movements for a specific product
  const getMovementsByProduct = (productId: string): StockMovement[] => {
    return movements.filter(movement => movement.productId === productId);
  };

  // Get movement by ID
  const getMovementById = (movementId: string): StockMovement | null => {
    return movements.find(movement => movement.id === movementId) || null;
  };

  // Get movement statistics
  const getMovementStats = () => {
    const totalNewStock = movements.filter(m => m.movementType === 'New Stock')
      .reduce((sum, m) => sum + m.quantity, 0);
    
    const totalStockOut = movements.filter(m => m.movementType === 'Stock Out')
      .reduce((sum, m) => sum + m.quantity, 0);
    
    const totalTransfers = movements.filter(m => m.movementType === 'Transfer').length;
    
    const totalAdjustments = movements.filter(m => m.movementType === 'Adjustment')
      .reduce((sum, m) => sum + m.quantity, 0);
    
    return {
      totalNewStock,
      totalStockOut,
      totalTransfers,
      totalAdjustments
    };
  };

  // Get stock movement over time for charting
  const getMovementOverTime = () => {
    const movementsByMonth: Record<string, {stockIn: number, stockOut: number}> = {};
    
    movements.forEach(movement => {
      const date = new Date(movement.date);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!movementsByMonth[monthYear]) {
        movementsByMonth[monthYear] = { stockIn: 0, stockOut: 0 };
      }
      
      if (movement.movementType === 'New Stock') {
        movementsByMonth[monthYear].stockIn += movement.quantity;
      } else if (movement.movementType === 'Stock Out') {
        movementsByMonth[monthYear].stockOut += movement.quantity;
      }
    });
    
    // Convert to array and sort by date
    const sortedMonths = Object.keys(movementsByMonth).sort();
    
    return {
      labels: sortedMonths.map(month => {
        const [year, monthNum] = month.split('-');
        return `${new Date(0, parseInt(monthNum) - 1).toLocaleString('default', { month: 'short' })} ${year}`;
      }),
      stockIn: sortedMonths.map(month => movementsByMonth[month].stockIn),
      stockOut: sortedMonths.map(month => movementsByMonth[month].stockOut)
    };
  };

  return {
    movements,
    filteredMovements,
    isLoading,
    error,
    getMovementsByProduct,
    getMovementById,
    getMovementStats,
    getMovementOverTime,
    setFilters
  };
};

export default useStockMovements;