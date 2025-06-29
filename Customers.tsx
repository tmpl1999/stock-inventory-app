import { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/card';
import CustomerList from '@/components/customers/CustomerList';
import CustomerDetails from '@/components/customers/CustomerDetails';
import useCustomers from '@/hooks/use-customers';

export default function Customers() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  
  const { 
    filteredCustomers, 
    isLoading, 
    error,
    getCustomerById,
    getCustomerOrders,
    setFilters
  } = useCustomers();
  
  // Update filters when search/sort values change
  useState(() => {
    setFilters({
      query: searchQuery,
      sort: {
        column: sortColumn,
        direction: sortDirection
      }
    });
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomerId(customerId);
  };
  
  const selectedCustomer = selectedCustomerId ? getCustomerById(selectedCustomerId) : null;
  const customerOrders = selectedCustomerId ? getCustomerOrders(selectedCustomerId) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} />
        
        <main className={`flex-1 p-4 md:p-6 transition-all duration-200 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Customers</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Manage customers and view their purchase history
              </p>
            </div>
          </div>
          
          <Card className="p-6">
            {selectedCustomer ? (
              <CustomerDetails 
                customer={selectedCustomer}
                customerOrders={customerOrders}
                onBack={() => setSelectedCustomerId(null)}
              />
            ) : (
              <CustomerList 
                customers={filteredCustomers}
                isLoading={isLoading}
                error={error}
                onCustomerSelect={handleCustomerSelect}
                onSort={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}
          </Card>
        </main>
      </div>
    </div>
  );
}