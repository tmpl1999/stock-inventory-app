import { useState, useEffect, useMemo } from 'react';
import { Customer, Order } from '@/hooks/use-customer-orders';
import useCustomerOrders from '@/hooks/use-customer-orders';

export interface CustomerWithStats extends Customer {
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
  lastOrderStatus: string | null;
}

interface CustomerFilters {
  query?: string;
  sort?: {
    column: string;
    direction: 'asc' | 'desc';
  };
}

const useCustomers = () => {
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CustomerFilters>({
    sort: { column: 'name', direction: 'asc' }
  });

  const { orders } = useCustomerOrders();

  // Process customer data from orders
  useEffect(() => {
    try {
      setIsLoading(true);

      // Extract unique customers from orders
      const customerMap = new Map<string, CustomerWithStats>();
      
      orders.forEach(order => {
        const { customer } = order;
        
        if (!customerMap.has(customer.id)) {
          customerMap.set(customer.id, {
            ...customer,
            totalOrders: 1,
            totalSpent: order.totalAmount,
            lastOrderDate: order.orderDate,
            lastOrderStatus: order.status
          });
        } else {
          const existingCustomer = customerMap.get(customer.id)!;
          customerMap.set(customer.id, {
            ...existingCustomer,
            totalOrders: existingCustomer.totalOrders + 1,
            totalSpent: existingCustomer.totalSpent + order.totalAmount,
            // Update last order date only if this order is more recent
            lastOrderDate: new Date(order.orderDate) > new Date(existingCustomer.lastOrderDate || '') 
              ? order.orderDate 
              : existingCustomer.lastOrderDate,
            lastOrderStatus: new Date(order.orderDate) > new Date(existingCustomer.lastOrderDate || '')
              ? order.status
              : existingCustomer.lastOrderStatus
          });
        }
      });
      
      setCustomers(Array.from(customerMap.values()));
      setIsLoading(false);
      setError(null);
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : 'Error processing customer data');
    }
  }, [orders]);

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    let filtered = [...customers];
    
    // Apply search query filter
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(customer => 
        customer.name.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    if (filters.sort) {
      const { column, direction } = filters.sort;
      filtered.sort((a, b) => {
        let valueA: string | number | Date;
        let valueB: string | number | Date;
        
        switch (column) {
          case 'name':
            valueA = a.name;
            valueB = b.name;
            break;
          case 'email':
            valueA = a.email;
            valueB = b.email;
            break;
          case 'totalOrders':
            valueA = a.totalOrders;
            valueB = b.totalOrders;
            break;
          case 'totalSpent':
            valueA = a.totalSpent;
            valueB = b.totalSpent;
            break;
          case 'lastOrderDate':
            valueA = a.lastOrderDate ? new Date(a.lastOrderDate) : new Date(0);
            valueB = b.lastOrderDate ? new Date(b.lastOrderDate) : new Date(0);
            break;
          default:
            valueA = a[column as keyof CustomerWithStats] as string;
            valueB = b[column as keyof CustomerWithStats] as string;
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
  }, [customers, filters]);

  // Get customer by ID
  const getCustomerById = (customerId: string): CustomerWithStats | null => {
    return customers.find(customer => customer.id === customerId) || null;
  };

  // Get orders for a specific customer
  const getCustomerOrders = (customerId: string): Order[] => {
    return orders.filter(order => order.customer.id === customerId);
  };

  return {
    customers,
    filteredCustomers,
    isLoading,
    error,
    getCustomerById,
    getCustomerOrders,
    setFilters
  };
};

export default useCustomers;