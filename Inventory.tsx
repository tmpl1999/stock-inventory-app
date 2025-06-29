import { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import InventoryTable from '@/components/inventory/InventoryTable'; 
import AddItemForm from '@/components/inventory/AddItemForm';
import useInventory from '@/hooks/use-inventory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileDown, FileUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Category, Supplier } from '@/types';

export default function Inventory() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('view');
  
  const { 
    inventoryItems, 
    filteredItems,
    isLoading, 
    error, 
    deleteItem,
    updateItem,
    addItem,
    setSearchFilter
  } = useInventory();
  
  // Update search filter when search query changes
  useState(() => {
    setSearchFilter(searchQuery);
  });
  
  // Mock data for categories and suppliers - in a real app, these would come from Supabase
  const categories: Category[] = [
    { id: "cat-1", name: "Electronics", description: "Electronic devices and accessories", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "cat-2", name: "Office Supplies", description: "Office stationery and supplies", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "cat-3", name: "Furniture", description: "Office furniture items", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ];
  
  const suppliers: Supplier[] = [
    { id: "sup-1", name: "TechSupply Inc.", contact_person: "John Smith", email: "john@techsupply.com", phone: "555-1234", address: "123 Tech St", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "sup-2", name: "Office Essentials", contact_person: "Jane Doe", email: "jane@essentials.com", phone: "555-5678", address: "456 Office Ave", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ];

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Inventory Management</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Manage your stock, products and supplies
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setActiveTab('add')} className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Item
              </Button>
            </div>
          </div>

          <Tabs defaultValue="view" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="view">View Inventory</TabsTrigger>
              <TabsTrigger value="add">Add New Item</TabsTrigger>
            </TabsList>
            
            <TabsContent value="view">
              <Card className="p-4">
                <InventoryTable 
                  items={searchQuery ? filteredItems : inventoryItems}
                  isLoading={isLoading}
                  error={error}
                  onDelete={deleteItem}
                  onUpdate={updateItem}
                />
              </Card>
            </TabsContent>
            
            <TabsContent value="add">
              <AddItemForm 
                categories={categories} 
                suppliers={suppliers}
                onSubmit={(newItem) => {
                  addItem({
                    ...newItem,
                    id: `item-${Date.now()}`,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  });
                  setActiveTab('view');
                }}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}