import { useState, useEffect, useMemo } from 'react';

// Types for customer orders
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  customer: Customer;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentMethod: string;
  shippingMethod: string;
  shippingAddress: string;
  billingAddress: string;
  notes: string;
  totalAmount: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

interface OrderFilters {
  query?: string;
  status?: string;
  dateRange?: string;
  sort?: {
    column: string;
    direction: 'asc' | 'desc';
  };
}

const useCustomerOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<OrderFilters>({
    sort: { column: 'date', direction: 'desc' }
  });

  // Mock data - in a real app, this would come from an API call to Supabase
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        const mockOrders: Order[] = [
          {
            id: 'order-1',
            orderNumber: '10001',
            orderDate: '2023-07-15T10:30:00Z',
            customer: {
              id: 'cust-1',
              name: 'John Smith',
              email: 'john.smith@example.com',
              phone: '(555) 123-4567',
              address: '123 Main St, Anytown, AN 12345'
            },
            items: [
              {
                id: 'item-1',
                productId: 'prod-1',
                productName: 'Wireless Keyboard',
                quantity: 1,
                unitPrice: 59.99,
                totalPrice: 59.99
              },
              {
                id: 'item-2',
                productId: 'prod-2',
                productName: 'Wireless Mouse',
                quantity: 1,
                unitPrice: 39.99,
                totalPrice: 39.99
              }
            ],
            status: 'completed',
            paymentMethod: 'Credit Card',
            shippingMethod: 'Standard Shipping',
            shippingAddress: '123 Main St, Anytown, AN 12345',
            billingAddress: '123 Main St, Anytown, AN 12345',
            notes: '',
            totalAmount: 99.98
          },
          {
            id: 'order-2',
            orderNumber: '10002',
            orderDate: '2023-07-20T14:45:00Z',
            customer: {
              id: 'cust-2',
              name: 'Jane Doe',
              email: 'jane.doe@example.com',
              phone: '(555) 987-6543',
              address: '456 Oak Ave, Somewhere, SM 67890'
            },
            items: [
              {
                id: 'item-3',
                productId: 'prod-3',
                productName: 'Monitor 24"',
                quantity: 1,
                unitPrice: 249.99,
                totalPrice: 249.99
              }
            ],
            status: 'processing',
            paymentMethod: 'PayPal',
            shippingMethod: 'Express Shipping',
            shippingAddress: '456 Oak Ave, Somewhere, SM 67890',
            billingAddress: '456 Oak Ave, Somewhere, SM 67890',
            notes: 'Please handle with care',
            totalAmount: 249.99,
            trackingNumber: 'TRK12345678',
            estimatedDelivery: '2023-07-24'
          },
          {
            id: 'order-3',
            orderNumber: '10003',
            orderDate: '2023-08-05T09:15:00Z',
            customer: {
              id: 'cust-3',
              name: 'Bob Johnson',
              email: 'bob.johnson@example.com',
              phone: '(555) 567-8901',
              address: '789 Pine Blvd, Elsewhere, EL 13579'
            },
            items: [
              {
                id: 'item-4',
                productId: 'prod-4',
                productName: 'USB-C Hub',
                quantity: 2,
                unitPrice: 29.99,
                totalPrice: 59.98
              },
              {
                id: 'item-5',
                productId: 'prod-5',
                productName: 'HDMI Cable',
                quantity: 3,
                unitPrice: 12.99,
                totalPrice: 38.97
              }
            ],
            status: 'pending',
            paymentMethod: 'Credit Card',
            shippingMethod: 'Standard Shipping',
            shippingAddress: '789 Pine Blvd, Elsewhere, EL 13579',
            billingAddress: '789 Pine Blvd, Elsewhere, EL 13579',
            notes: '',
            totalAmount: 98.95
          },
          {
            id: 'order-4',
            orderNumber: '10004',
            orderDate: '2023-08-10T16:20:00Z',
            customer: {
              id: 'cust-4',
              name: 'Sarah Williams',
              email: 'sarah.williams@example.com',
              phone: '(555) 234-5678',
              address: '101 Cedar Ln, Nowhereville, NV 24680'
            },
            items: [
              {
                id: 'item-6',
                productId: 'prod-6',
                productName: 'Desk Chair',
                quantity: 1,
                unitPrice: 199.99,
                totalPrice: 199.99
              }
            ],
            status: 'cancelled',
            paymentMethod: 'Debit Card',
            shippingMethod: 'Premium Shipping',
            shippingAddress: '101 Cedar Ln, Nowhereville, NV 24680',
            billingAddress: '101 Cedar Ln, Nowhereville, NV 24680',
            notes: 'Cancelled due to out of stock',
            totalAmount: 199.99
          },
          {
            id: 'order-5',
            orderNumber: '10005',
            orderDate: '2023-08-15T11:10:00Z',
            customer: {
              id: 'cust-5',
              name: 'Michael Brown',
              email: 'michael.brown@example.com',
              phone: '(555) 876-5432',
              address: '202 Maple St, Anyplace, AP 97531'
            },
            items: [
              {
                id: 'item-7',
                productId: 'prod-7',
                productName: 'Wireless Headphones',
                quantity: 1,
                unitPrice: 149.99,
                totalPrice: 149.99
              },
              {
                id: 'item-8',
                productId: 'prod-8',
                productName: 'Phone Charger',
                quantity: 2,
                unitPrice: 19.99,
                totalPrice: 39.98
              }
            ],
            status: 'completed',
            paymentMethod: 'Credit Card',
            shippingMethod: 'Standard Shipping',
            shippingAddress: '202 Maple St, Anyplace, AP 97531',
            billingAddress: '202 Maple St, Anyplace, AP 97531',
            notes: '',
            totalAmount: 189.97,
            trackingNumber: 'TRK87654321',
            estimatedDelivery: '2023-08-20'
          }
        ];
        
        setOrders(mockOrders);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        setIsLoading(false);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching orders');
      }
    };

    fetchOrders();
  }, []);

  // Filter and sort orders based on filters
  const filteredOrders = useMemo(() => {
    let filtered = [...orders];
    
    // Apply search query filter
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(query) ||
        order.customer.name.toLowerCase().includes(query) ||
        order.customer.email.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(order => 
        order.status.toLowerCase() === filters.status?.toLowerCase()
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
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate);
        
        switch (filters.dateRange) {
          case 'today':
            return orderDate >= today;
          case 'yesterday':
            return orderDate >= yesterday && orderDate < today;
          case 'thisWeek':
            return orderDate >= thisWeekStart;
          case 'thisMonth':
            return orderDate >= thisMonthStart;
          case 'lastMonth':
            return orderDate >= lastMonthStart && orderDate <= lastMonthEnd;
          case 'last3Months':
            return orderDate >= threeMonthsAgo;
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
          case 'id':
          case 'orderNumber':
            valueA = a.orderNumber;
            valueB = b.orderNumber;
            break;
          case 'date':
            valueA = new Date(a.orderDate);
            valueB = new Date(b.orderDate);
            break;
          case 'customer':
            valueA = a.customer.name;
            valueB = b.customer.name;
            break;
          case 'status':
            valueA = a.status;
            valueB = b.status;
            break;
          case 'amount':
            valueA = a.totalAmount;
            valueB = b.totalAmount;
            break;
          default:
            valueA = a[column as keyof Order];
            valueB = b[column as keyof Order];
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
  }, [orders, filters]);

  // Get order by ID
  const getOrderById = (orderId: string): Order | null => {
    return orders.find(order => order.id === orderId) || null;
  };

  return {
    orders,
    filteredOrders,
    isLoading,
    error,
    getOrderById,
    setFilters
  };
};

export default useCustomerOrders;