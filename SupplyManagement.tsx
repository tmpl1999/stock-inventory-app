import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Download, Calendar, FileText, X, Truck, ShoppingCart } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Supplier Type
interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  status: string;
}

// Purchase Type
interface Purchase {
  id: string;
  supplier: string;
  orderDate: string;
  arrivalDate: string | null;
  amount: number;
  status: string;
  items: number;
}

export default function SupplyManagement() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('suppliers');
  
  // Handle tab selection from URL parameters
  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && (tabParam === 'suppliers' || tabParam === 'purchases')) {
      setActiveTab(tabParam);
    }
  }, [location]);
  
  // Suppliers state
  const [isAddSupplierDialogOpen, setIsAddSupplierDialogOpen] = useState(false);
  const [isEditSupplierDialogOpen, setIsEditSupplierDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contact: '',
    email: '',
    phone: '',
    status: 'Active'
  });

  // Purchases state
  const [isViewPurchaseDialogOpen, setIsViewPurchaseDialogOpen] = useState(false);
  const [isNewPurchaseDialogOpen, setIsNewPurchaseDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  interface PurchaseItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }

  const [newPurchase, setNewPurchase] = useState({
    supplier: '',
    orderDate: new Date().toISOString().split('T')[0],
    arrivalDate: '',
    items: [] as PurchaseItem[],
    notes: ''
  });

  // Mock suppliers data
  const suppliers = [
    { id: 1, name: 'ABC Distribution', contact: 'John Smith', email: 'john@abcdist.com', phone: '555-123-4567', status: 'Active' },
    { id: 2, name: 'Global Supplies Inc.', contact: 'Sarah Lee', email: 'slee@globalsupplies.com', phone: '555-987-6543', status: 'Active' },
    { id: 3, name: 'Premier Products', contact: 'Michael Johnson', email: 'mjohnson@premierproducts.com', phone: '555-456-7890', status: 'Inactive' },
    { id: 4, name: 'Quality Goods Co.', contact: 'Jennifer Williams', email: 'jwilliams@qualitygoods.com', phone: '555-234-5678', status: 'Active' },
    { id: 5, name: 'Fast Track Supply', contact: 'Robert Brown', email: 'rbrown@fasttrack.com', phone: '555-876-5432', status: 'Active' },
  ];

  // Mock purchase data
  const purchases = [
    { 
      id: 'PO-2023-001', 
      supplier: 'ABC Distribution', 
      orderDate: '2023-06-10', 
      arrivalDate: '2023-06-15', 
      amount: 2450.75, 
      status: 'Received', 
      items: 12 
    },
    { 
      id: 'PO-2023-002', 
      supplier: 'Global Supplies Inc.', 
      orderDate: '2023-06-22', 
      arrivalDate: null, 
      amount: 1875.50, 
      status: 'Pending', 
      items: 8 
    },
    { 
      id: 'PO-2023-003', 
      supplier: 'Premier Products', 
      orderDate: '2023-06-25', 
      arrivalDate: '2023-07-02', 
      amount: 3290.25, 
      status: 'Received', 
      items: 15 
    },
    { 
      id: 'PO-2023-004', 
      supplier: 'Quality Goods Co.', 
      orderDate: '2023-07-10', 
      arrivalDate: null, 
      amount: 985.65, 
      status: 'Cancelled', 
      items: 5 
    },
    { 
      id: 'PO-2023-005', 
      supplier: 'Fast Track Supply', 
      orderDate: '2023-07-18', 
      arrivalDate: null, 
      amount: 4125.80, 
      status: 'Ordered', 
      items: 20 
    },
  ];

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Received':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'Ordered':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'Active':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Supply Management</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your suppliers and purchase orders.</p>
          </div>
          
          <Tabs defaultValue="suppliers" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="suppliers" className="flex items-center">
                  <Truck className="h-4 w-4 mr-2" />
                  Suppliers
                </TabsTrigger>
                <TabsTrigger value="purchases" className="flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Purchase Orders
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                {activeTab === 'suppliers' ? (
                  <>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" /> Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" /> Export
                    </Button>
                    <Button size="sm" onClick={() => setIsAddSupplierDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" /> Add Supplier
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" /> Date Range
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" /> Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" /> Export
                    </Button>
                    <Button size="sm" onClick={() => setIsNewPurchaseDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" /> New Purchase
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Suppliers Tab Content */}
            <TabsContent value="suppliers" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Suppliers</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {suppliers.map((supplier) => (
                        <TableRow key={supplier.id}>
                          <TableCell className="font-medium">{supplier.name}</TableCell>
                          <TableCell>{supplier.contact}</TableCell>
                          <TableCell>{supplier.email}</TableCell>
                          <TableCell>{supplier.phone}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              supplier.status === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {supplier.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedSupplier(supplier);
                                setIsEditSupplierDialogOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Purchases Tab Content */}
            <TabsContent value="purchases" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Purchase Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Order Date</TableHead>
                        <TableHead>Arrival Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchases.map((purchase) => (
                        <TableRow key={purchase.id}>
                          <TableCell className="font-medium">{purchase.id}</TableCell>
                          <TableCell>{purchase.supplier}</TableCell>
                          <TableCell>{purchase.orderDate}</TableCell>
                          <TableCell>{purchase.arrivalDate || '—'}</TableCell>
                          <TableCell>{purchase.items}</TableCell>
                          <TableCell>${purchase.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeStyle(purchase.status)} variant="outline">
                              {purchase.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => {
                                setSelectedPurchase(purchase);
                                setIsViewPurchaseDialogOpen(true);
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Add Supplier Dialog */}
      <Dialog open={isAddSupplierDialogOpen} onOpenChange={setIsAddSupplierDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Supplier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="supplier-name">Company Name</Label>
              <Input
                id="supplier-name"
                placeholder="Enter company name"
                value={newSupplier.name}
                onChange={(e) => setNewSupplier({...newSupplier, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-person">Contact Person</Label>
              <Input
                id="contact-person"
                placeholder="Enter contact name"
                value={newSupplier.contact}
                onChange={(e) => setNewSupplier({...newSupplier, contact: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={newSupplier.email}
                  onChange={(e) => setNewSupplier({...newSupplier, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={newSupplier.phone}
                  onChange={(e) => setNewSupplier({...newSupplier, phone: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={newSupplier.status}
                onValueChange={(value) => setNewSupplier({...newSupplier, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSupplierDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              console.log('Add new supplier:', newSupplier);
              setIsAddSupplierDialogOpen(false);
              // Reset form
              setNewSupplier({name: '', contact: '', email: '', phone: '', status: 'Active'});
            }}>
              Add Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Supplier Dialog */}
      <Dialog open={isEditSupplierDialogOpen} onOpenChange={setIsEditSupplierDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
          </DialogHeader>
          {selectedSupplier && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-supplier-name">Company Name</Label>
                <Input
                  id="edit-supplier-name"
                  placeholder="Enter company name"
                  defaultValue={selectedSupplier.name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-contact-person">Contact Person</Label>
                <Input
                  id="edit-contact-person"
                  placeholder="Enter contact name"
                  defaultValue={selectedSupplier.contact}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="Enter email address"
                    defaultValue={selectedSupplier.email}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    placeholder="Enter phone number"
                    defaultValue={selectedSupplier.phone}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select defaultValue={selectedSupplier.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSupplierDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              console.log('Save supplier changes:', selectedSupplier?.id);
              setIsEditSupplierDialogOpen(false);
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Purchase Dialog */}
      <Dialog open={isViewPurchaseDialogOpen} onOpenChange={setIsViewPurchaseDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Purchase Order Details</DialogTitle>
          </DialogHeader>
          
          {selectedPurchase && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Order ID</p>
                  <p className="font-medium">{selectedPurchase.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Order Date</p>
                  <p>{selectedPurchase.orderDate}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Arrival Date</p>
                  <p>{selectedPurchase.arrivalDate || '—'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge className={getStatusBadgeStyle(selectedPurchase.status)} variant="outline">
                    {selectedPurchase.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Supplier</p>
                <p className="font-medium">{selectedPurchase.supplier}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <Badge className={getStatusBadgeStyle(selectedPurchase.status)} variant="outline">
                  {selectedPurchase.status}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Total Amount</p>
                <p className="text-lg font-bold">${selectedPurchase.amount.toFixed(2)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Items</p>
                <Card>
                  <CardContent className="p-3">
                    <p className="text-center py-2">{selectedPurchase.items} items in this order</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewPurchaseDialogOpen(false)}>Close</Button>
            {selectedPurchase && selectedPurchase.status === 'Pending' && (
              <Button>Approve Order</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New Purchase Dialog */}
      <Dialog open={isNewPurchaseDialogOpen} onOpenChange={setIsNewPurchaseDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Purchase Order</DialogTitle>
            <DialogDescription>
              Create a new purchase order for inventory stock
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select 
                value={newPurchase.supplier} 
                onValueChange={(value) => setNewPurchase({...newPurchase, supplier: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ABC Distribution">ABC Distribution</SelectItem>
                  <SelectItem value="Global Supplies Inc.">Global Supplies Inc.</SelectItem>
                  <SelectItem value="Premier Products">Premier Products</SelectItem>
                  <SelectItem value="Quality Goods Co.">Quality Goods Co.</SelectItem>
                  <SelectItem value="Fast Track Supply">Fast Track Supply</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="order-date">Order Date</Label>
                <Input 
                  id="order-date" 
                  type="date" 
                  value={newPurchase.orderDate}
                  onChange={(e) => setNewPurchase({...newPurchase, orderDate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrival-date">Arrival/Received Date</Label>
                <Input 
                  id="arrival-date" 
                  type="date" 
                  value={newPurchase.arrivalDate}
                  onChange={(e) => setNewPurchase({...newPurchase, arrivalDate: e.target.value})}
                  placeholder="Leave blank if not received"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Items</Label>
                <Button variant="outline" size="sm" className="h-8">
                  <Plus className="h-4 w-4 mr-1" /> Add Item
                </Button>
              </div>
              <Card>
                <CardContent className="p-3">
                  {newPurchase.items.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      No items added to this purchase order yet
                    </div>
                  ) : (
                    <p>Items will appear here</p>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input 
                id="notes" 
                placeholder="Additional notes for this order"
                value={newPurchase.notes}
                onChange={(e) => setNewPurchase({...newPurchase, notes: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewPurchaseDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              console.log('Create new purchase order:', newPurchase);
              setIsNewPurchaseDialogOpen(false);
              // Reset form
              setNewPurchase({
                supplier: '',
                orderDate: new Date().toISOString().split('T')[0],
                arrivalDate: '',
                items: [],
                notes: ''
              });
            }}>
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}