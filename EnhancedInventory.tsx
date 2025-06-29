import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import InventoryTable from '@/components/inventory/InventoryTable'; 
import AddItemForm from '@/components/inventory/AddItemForm';
import BatchTrackingTable from '@/components/inventory/BatchTrackingTable';
import StockMovementLog from '@/components/inventory/StockMovementLog';
import { useToast } from '@/components/ui/use-toast';
import useInventory from '@/hooks/use-inventory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileDown, FileUp, Warehouse, MoveVertical, Edit, Trash, Tags } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Category, Supplier } from '@/types';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

export default function EnhancedInventory() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('view');
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [movementModalOpen, setMovementModalOpen] = useState(false);
  const [selectedMovementType, setSelectedMovementType] = useState<'New Stock' | 'Transfer' | 'Stock Out' | 'Adjustment'>('Transfer');
  
  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const { toast } = useToast();
  
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
  
  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsCategoryLoading(true);
      setCategoryError(null);

      try {
        // In a real implementation, this would be fetched from Supabase
        // const { data, error } = await supabase.from('categories').select('*');
        // if (error) throw error;
        
        // Mock data for demonstration
        const mockCategories: Category[] = [
          {
            id: "cat-1",
            name: "Electronics",
            description: "Electronic devices including computers, phones, and accessories",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "cat-2",
            name: "Office Supplies",
            description: "Paper, pens, staplers, and other office necessities",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "cat-3",
            name: "Furniture",
            description: "Desks, chairs, filing cabinets and other office furniture",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];

        setCategories(mockCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategoryError('Failed to load categories. Please try again later.');
      } finally {
        setIsCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);
  
  const suppliers: Supplier[] = [
    { id: "sup-1", name: "TechSupply Inc.", contact_person: "John Smith", email: "john@techsupply.com", phone: "555-1234", address: "123 Tech St", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: "sup-2", name: "Office Essentials", contact_person: "Jane Doe", email: "jane@essentials.com", phone: "555-5678", address: "456 Office Ave", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  ];

  // Filter categories based on search query
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }

    setIsFormLoading(true);

    try {
      const newCategoryData: Category = {
        id: `cat-${Date.now()}`, // In production, Supabase would generate this
        name: newCategory.name.trim(),
        description: newCategory.description.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // In a real implementation, this would be inserted into Supabase
      // const { data, error } = await supabase.from('categories').insert(newCategoryData);
      // if (error) throw error;

      // Add to local state
      setCategories([...categories, newCategoryData]);
      setNewCategory({ name: '', description: '' });
      setActiveTab('categories');

      toast({
        title: "Category Added",
        description: `${newCategoryData.name} has been added successfully.`
      });
    } catch (err) {
      console.error('Error adding category:', err);
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  // Update existing category
  const handleUpdateCategory = async () => {
    if (!editCategory || !editCategory.name.trim()) return;

    setIsFormLoading(true);

    try {
      const updatedCategory = {
        ...editCategory,
        name: editCategory.name.trim(),
        description: editCategory.description?.trim() || '',
        updated_at: new Date().toISOString()
      };

      // In a real implementation, this would update Supabase
      // const { error } = await supabase.from('categories')
      //   .update(updatedCategory)
      //   .eq('id', updatedCategory.id);
      // if (error) throw error;

      // Update local state
      setCategories(categories.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      ));

      setIsEditDialogOpen(false);
      setEditCategory(null);

      toast({
        title: "Category Updated",
        description: `${updatedCategory.name} has been updated successfully.`
      });
    } catch (err) {
      console.error('Error updating category:', err);
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    setIsFormLoading(true);

    try {
      // In a real implementation, this would delete from Supabase
      // const { error } = await supabase.from('categories')
      //   .delete()
      //   .eq('id', categoryToDelete.id);
      // if (error) throw error;

      // Remove from local state
      setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
      
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);

      toast({
        title: "Category Deleted",
        description: `${categoryToDelete.name} has been deleted successfully.`
      });
    } catch (err) {
      console.error('Error deleting category:', err);
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  // Mock data for warehouses
  const warehouses = [
    { id: "wh-1", name: "Main Warehouse", location: "Building A" },
    { id: "wh-2", name: "Secondary Warehouse", location: "Building B" },
    { id: "wh-3", name: "Distribution Center", location: "North Region" },
  ];

  // Mock data for batch items
  const batchItems = [
    { 
      id: "batch-1", 
      productId: "item-1", 
      productName: "Wireless Keyboard", 
      batchNumber: "KB-2023-001", 
      quantity: 120, 
      warehouse: "Main Warehouse", 
      location: "Section A, Shelf 3", 
      receivedDate: "2023-03-15", 
      expiryDate: "2025-03-15", 
      status: "Available" as const
    },
    { 
      id: "batch-2", 
      productId: "item-1", 
      productName: "Wireless Keyboard", 
      batchNumber: "KB-2023-002", 
      quantity: 50, 
      warehouse: "Secondary Warehouse", 
      location: "Section B, Shelf 5", 
      receivedDate: "2023-05-20", 
      status: "Available" as const
    },
    { 
      id: "batch-3", 
      productId: "item-2", 
      productName: "Wireless Mouse", 
      batchNumber: "MS-2023-001", 
      quantity: 200, 
      warehouse: "Main Warehouse", 
      location: "Section A, Shelf 4", 
      receivedDate: "2023-02-10", 
      status: "Available" as const
    },
    { 
      id: "batch-4", 
      productId: "item-3", 
      productName: "USB-C Hub", 
      batchNumber: "USB-2023-001", 
      quantity: 75, 
      warehouse: "Distribution Center", 
      location: "Section C, Shelf 2", 
      receivedDate: "2023-01-05", 
      status: "Low Stock" as const
    },
    { 
      id: "batch-5", 
      productId: "item-4", 
      productName: "Monitor 24\"", 
      batchNumber: "MON-2023-001", 
      quantity: 15, 
      warehouse: "Main Warehouse", 
      location: "Section D, Shelf 1", 
      receivedDate: "2023-06-30", 
      status: "Available" as const
    },
    { 
      id: "batch-6", 
      productId: "item-5", 
      productName: "Desk Chair", 
      batchNumber: "CH-2023-001", 
      quantity: 8, 
      warehouse: "Secondary Warehouse", 
      location: "Section F, Floor Area", 
      receivedDate: "2023-04-12", 
      status: "Reserved" as const
    },
  ];

  // Mock data for stock movements
  const stockMovements = [
    {
      id: "mov-1",
      productId: "item-1",
      productName: "Wireless Keyboard",
      batchNumber: "KB-2023-001",
      quantity: 50,
      fromWarehouse: "Main Warehouse",
      fromLocation: "Receiving",
      toWarehouse: "Main Warehouse",
      toLocation: "Section A, Shelf 3",
      movementType: "New Stock" as const,
      movementReason: "Initial stock receipt",
      date: "2023-03-15T09:30:00Z",
      initiatedBy: "John Smith"
    },
    {
      id: "mov-2",
      productId: "item-1",
      productName: "Wireless Keyboard",
      batchNumber: "KB-2023-001",
      quantity: 30,
      fromWarehouse: "Main Warehouse",
      fromLocation: "Section A, Shelf 3",
      toWarehouse: "Secondary Warehouse",
      toLocation: "Section B, Shelf 5",
      movementType: "Transfer" as const,
      movementReason: "Balance stock between warehouses",
      date: "2023-04-20T14:15:00Z",
      initiatedBy: "Jane Doe"
    },
    {
      id: "mov-3",
      productId: "item-3",
      productName: "USB-C Hub",
      batchNumber: "USB-2023-001",
      quantity: 25,
      fromWarehouse: "Distribution Center",
      fromLocation: "Section C, Shelf 2",
      toWarehouse: "",
      toLocation: "",
      movementType: "Stock Out" as const,
      movementReason: "Customer order #ORD-2023-005",
      date: "2023-05-12T11:45:00Z",
      initiatedBy: "Michael Johnson"
    },
    {
      id: "mov-4",
      productId: "item-4",
      productName: "Monitor 24\"",
      batchNumber: "MON-2023-001",
      quantity: 2,
      fromWarehouse: "Main Warehouse",
      fromLocation: "Section D, Shelf 1",
      toWarehouse: "Main Warehouse",
      toLocation: "Section D, Shelf 1",
      movementType: "Adjustment" as const,
      movementReason: "Damaged during handling",
      date: "2023-07-05T16:20:00Z",
      initiatedBy: "Susan Williams"
    },
    {
      id: "mov-5",
      productId: "item-5",
      productName: "Desk Chair",
      batchNumber: "CH-2023-001",
      quantity: 12,
      fromWarehouse: "",
      fromLocation: "",
      toWarehouse: "Secondary Warehouse",
      toLocation: "Section F, Floor Area",
      movementType: "New Stock" as const,
      date: "2023-04-12T10:00:00Z",
      initiatedBy: "Robert Brown"
    },
  ];

  // Functions to handle batch operations
  const handleViewBatchDetails = (batchId: string) => {
    console.log('View details for batch:', batchId);
    // Implement view details functionality
  };

  const handleUpdateBatch = (batchId: string) => {
    console.log('Update batch:', batchId);
    // Implement batch update functionality
  };

  const handleMoveBatch = (batchId: string) => {
    setSelectedBatchId(batchId);
    setIsTransferDialogOpen(true);
  };

  const handleViewMovementDetails = (movementId: string) => {
    console.log('View movement details:', movementId);
    // Implement view details functionality
  };

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
                Manage your stock, products, batches and movements
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setActiveTab('add')} className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Item
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setMovementModalOpen(true)} 
                className="flex items-center"
              >
                <MoveVertical className="mr-2 h-4 w-4" />
                Record Movement
              </Button>
            </div>
          </div>

          <Tabs defaultValue="view" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="view">Products</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="batches">Batch Tracking</TabsTrigger>
              <TabsTrigger value="movements">Stock Movements</TabsTrigger>
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
            
            <TabsContent value="categories">
              <Card>
                <CardHeader>
                  <CardTitle>Product Categories</CardTitle>
                  <CardDescription>
                    Manage product categories for your inventory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {categoryError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-4 rounded">
                      {categoryError}
                    </div>
                  )}
                  
                  {isCategoryLoading ? (
                    <div className="text-center py-10">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                      <p className="mt-2 text-gray-500">Loading categories...</p>
                    </div>
                  ) : filteredCategories.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No categories found.</p>
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setNewCategory({ name: '', description: '' });
                          setActiveTab('add-category');
                        }}
                        className="mt-2"
                      >
                        Add your first category
                      </Button>
                    </div>
                  ) : (
                    <div className="border rounded-md overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px]">Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredCategories.map((category) => (
                            <TableRow key={category.id}>
                              <TableCell className="font-medium">{category.name}</TableCell>
                              <TableCell>{category.description || '-'}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => {
                                      setEditCategory(category);
                                      setIsEditDialogOpen(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => {
                                      setCategoryToDelete(category);
                                      setIsDeleteDialogOpen(true);
                                    }}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={() => {
                        setNewCategory({ name: '', description: '' });
                        setActiveTab('add-category');
                      }}
                      className="flex items-center"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Category
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="batches">
              <Card className="p-4">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Batch Tracking</CardTitle>
                  <CardDescription>
                    Track inventory batches by warehouse location and storage duration
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <BatchTrackingTable
                    batches={batchItems}
                    onViewDetails={handleViewBatchDetails}
                    onUpdateBatch={handleUpdateBatch}
                    onMoveBatch={handleMoveBatch}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="movements">
              <Card className="p-4">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Stock Movements</CardTitle>
                  <CardDescription>
                    Track all stock movements between locations
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <StockMovementLog
                    movements={stockMovements}
                    onViewDetails={handleViewMovementDetails}
                  />
                </CardContent>
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
            
            <TabsContent value="add-category">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Category</CardTitle>
                  <CardDescription>
                    Create a new product category for your inventory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="name"
                        placeholder="Enter category name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <Textarea
                        id="description"
                        placeholder="Enter category description"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                        className="mt-1"
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setNewCategory({ name: '', description: '' });
                          setActiveTab('categories');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddCategory}
                        disabled={!newCategory.name || isFormLoading}
                      >
                        {isFormLoading ? 'Adding...' : 'Add Category'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Dialog for Batch Transfer */}
          <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Transfer Batch</DialogTitle>
                <DialogDescription>
                  Move inventory batch to a new warehouse location
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Batch Number</Label>
                  <div className="font-medium">
                    {batchItems.find(batch => batch.id === selectedBatchId)?.batchNumber || ''}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Product</Label>
                  <div>
                    {batchItems.find(batch => batch.id === selectedBatchId)?.productName || ''}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Current Location</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {batchItems.find(batch => batch.id === selectedBatchId)?.warehouse || ''}
                    </Badge>
                    <span>-</span>
                    <span className="text-sm text-muted-foreground">
                      {batchItems.find(batch => batch.id === selectedBatchId)?.location || ''}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity to Transfer</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    placeholder="Enter quantity"
                    defaultValue={batchItems.find(batch => batch.id === selectedBatchId)?.quantity || 0} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destination-warehouse">Destination Warehouse</Label>
                  <Select defaultValue={warehouses[0]?.id || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map(warehouse => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destination-location">Destination Location</Label>
                  <Input id="destination-location" placeholder="Enter location (e.g., Section A, Shelf 3)" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Transfer</Label>
                  <Input id="reason" placeholder="Enter reason for transfer" />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsTransferDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => {
                  // Handle transfer logic here
                  console.log('Transfer confirmed for batch:', selectedBatchId);
                  setIsTransferDialogOpen(false);
                }}>
                  Confirm Transfer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Dialog for Recording Stock Movement */}
          <Dialog open={movementModalOpen} onOpenChange={setMovementModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Record Stock Movement</DialogTitle>
                <DialogDescription>
                  Record a new stock movement transaction
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Movement Type</Label>
                  <Select 
                    value={selectedMovementType} 
                    onValueChange={(value) => setSelectedMovementType(value as 'New Stock' | 'Transfer' | 'Stock Out' | 'Adjustment')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New Stock">New Stock</SelectItem>
                      <SelectItem value="Transfer">Transfer</SelectItem>
                      <SelectItem value="Stock Out">Stock Out</SelectItem>
                      <SelectItem value="Adjustment">Adjustment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Product</Label>
                  <Select defaultValue={inventoryItems[0]?.id || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryItems.map(item => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Batch Number</Label>
                  <Select defaultValue={batchItems[0]?.id || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {batchItems.map(batch => (
                        <SelectItem key={batch.id} value={batch.id}>
                          {batch.batchNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="movement-quantity">Quantity</Label>
                  <Input id="movement-quantity" type="number" placeholder="Enter quantity" />
                </div>
                
                {selectedMovementType !== 'New Stock' && (
                  <div className="space-y-2">
                    <Label>From</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Select defaultValue={warehouses[0]?.id || ""}>
                        <SelectTrigger>
                          <SelectValue placeholder="Warehouse" />
                        </SelectTrigger>
                        <SelectContent>
                          {warehouses.map(warehouse => (
                            <SelectItem key={warehouse.id} value={warehouse.id}>
                              {warehouse.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input placeholder="Location" />
                    </div>
                  </div>
                )}
                
                {selectedMovementType !== 'Stock Out' && (
                  <div className="space-y-2">
                    <Label>To</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Select defaultValue={warehouses[0]?.id || ""}>
                        <SelectTrigger>
                          <SelectValue placeholder="Warehouse" />
                        </SelectTrigger>
                        <SelectContent>
                          {warehouses.map(warehouse => (
                            <SelectItem key={warehouse.id} value={warehouse.id}>
                              {warehouse.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input placeholder="Location" />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="movement-reason">Reason</Label>
                  <Input id="movement-reason" placeholder="Enter reason for movement" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="movement-date">Date</Label>
                  <Input 
                    id="movement-date" 
                    type="date" 
                    defaultValue={format(new Date(), 'yyyy-MM-dd')} 
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setMovementModalOpen(false)}>Cancel</Button>
                <Button onClick={() => {
                  // Handle recording movement logic here
                  console.log('Record movement:', selectedMovementType);
                  setMovementModalOpen(false);
                }}>
                  Record Movement
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Category Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="edit-name"
                    value={editCategory?.name || ''}
                    onChange={(e) => setEditCategory(editCategory ? {...editCategory, name: e.target.value} : null)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <Textarea
                    id="edit-description"
                    value={editCategory?.description || ''}
                    onChange={(e) => setEditCategory(editCategory ? {...editCategory, description: e.target.value} : null)}
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateCategory}
                  disabled={!editCategory?.name || isFormLoading}
                >
                  {isFormLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete the category "{categoryToDelete?.name}"? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={handleDeleteCategory}
                  disabled={isFormLoading}
                >
                  {isFormLoading ? 'Deleting...' : 'Delete Category'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}