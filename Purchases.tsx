import { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

interface Purchase {
  id: string;
  supplier: string;
  date: string;
  amount: number;
  status: string;
  items: number;
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Download, Calendar, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Purchases() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isNewPurchaseDialogOpen, setIsNewPurchaseDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [newPurchase, setNewPurchase] = useState({
    supplier: '',
    date: new Date().toISOString().split('T')[0],
    items: [],
    notes: ''
  });

  // Mock purchase data
  const purchases = [
    { 
      id: 'PO-2023-001', 
      supplier: 'ABC Distribution', 
      date: '2023-06-15', 
      amount: 2450.75, 
      status: 'Received', 
      items: 12 
    },
    { 
      id: 'PO-2023-002', 
      supplier: 'Global Supplies Inc.', 
      date: '2023-06-22', 
      amount: 1875.50, 
      status: 'Pending', 
      items: 8 
    },
    { 
      id: 'PO-2023-003', 
      supplier: 'Premier Products', 
      date: '2023-07-02', 
      amount: 3290.25, 
      status: 'Received', 
      items: 15 
    },
    { 
      id: 'PO-2023-004', 
      supplier: 'Quality Goods Co.', 
      date: '2023-07-10', 
      amount: 985.65, 
      status: 'Cancelled', 
      items: 5 
    },
    { 
      id: 'PO-2023-005', 
      supplier: 'Fast Track Supply', 
      date: '2023-07-18', 
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Purchase Orders</h1>
              <p className="text-gray-500 dark:text-gray-400">Track and manage purchase orders for your inventory.</p>
            </div>
            <div className="flex gap-2">
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
            </div>
          </div>
          
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
                    <TableHead>Date</TableHead>
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
                      <TableCell>{purchase.date}</TableCell>
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
                            setIsViewDialogOpen(true);
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
        </main>
      </div>

      {/* View Purchase Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
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
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p>{selectedPurchase.date}</p>
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
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
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
            
            <div className="space-y-2">
              <Label htmlFor="order-date">Order Date</Label>
              <Input 
                id="order-date" 
                type="date" 
                value={newPurchase.date}
                onChange={(e) => setNewPurchase({...newPurchase, date: e.target.value})}
              />
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
                date: new Date().toISOString().split('T')[0],
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