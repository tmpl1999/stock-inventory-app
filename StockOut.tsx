import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import useCustomers from '@/hooks/use-customers';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

interface StockOutRecord {
  id: string;
  date: string;
  product: string;
  productId: string;
  quantity: number;
  reason: string;
  requestedBy: string;
  customerId?: string;
  customerName?: string;
  unitPrice: number;
  totalPrice: number;
  orderReference?: string;
  destination?: string;
  notes?: string;
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Download, Calendar, PackageOpen } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function StockOut() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<StockOutRecord | null>(null);
  const [newStockOutRecord, setNewStockOutRecord] = useState({
    product: '',
    productId: '',
    quantity: 1,
    unitPrice: 0,
    totalPrice: 0,
    reason: 'Sale',
    requestedBy: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    customerId: '',
    customerName: '',
    destination: '',
    orderReference: ''
  });

  // Mock stock out data with enhanced details
  const stockOutRecords = [
    { 
      id: 'SO-2023-001', 
      date: '2023-06-18', 
      product: 'Wireless Headphones',
      productId: 'prod-007',
      quantity: 25, 
      reason: 'Sale', 
      requestedBy: 'Jane Smith',
      customerId: 'cust-1',
      customerName: 'John Smith',
      unitPrice: 149.99,
      totalPrice: 3749.75,
      orderReference: 'ORD-10001',
      destination: 'Retail Store',
      notes: 'Bulk order for retail promotion'
    },
    { 
      id: 'SO-2023-002', 
      date: '2023-06-20', 
      product: 'USB-C Cable',
      productId: 'prod-002',
      quantity: 50, 
      reason: 'Sale', 
      requestedBy: 'John Davis',
      customerId: 'cust-2',
      customerName: 'Jane Doe', 
      unitPrice: 19.99,
      totalPrice: 999.50,
      orderReference: 'ORD-10002',
      destination: 'Online Order',
      notes: 'Expedited shipping requested'
    },
    { 
      id: 'SO-2023-003', 
      date: '2023-06-25', 
      product: 'Laptop Stand',
      productId: 'prod-009',
      quantity: 10, 
      reason: 'Damaged', 
      requestedBy: 'Mike Johnson',
      unitPrice: 39.99,
      totalPrice: 399.90,
      notes: 'Items damaged during warehouse transfer'
    },
    { 
      id: 'SO-2023-004', 
      date: '2023-07-01', 
      product: 'Bluetooth Speaker',
      productId: 'prod-004',
      quantity: 15, 
      reason: 'Sale', 
      requestedBy: 'Sarah Wilson',
      customerId: 'cust-3',
      customerName: 'Bob Johnson',
      unitPrice: 79.99,
      totalPrice: 1199.85,
      orderReference: 'ORD-10003',
      destination: 'Corporate Client'
    },
    { 
      id: 'SO-2023-005', 
      date: '2023-07-05', 
      product: 'HDMI Cable',
      productId: 'prod-005',
      quantity: 30, 
      reason: 'Sale', 
      requestedBy: 'Alex Miller',
      customerId: 'cust-5',
      customerName: 'Michael Brown',
      unitPrice: 12.99,
      totalPrice: 389.70,
      orderReference: 'ORD-10005',
      destination: 'Online Order'
    },
    { 
      id: 'SO-2023-006', 
      date: '2023-07-10', 
      product: 'Wireless Mouse',
      productId: 'prod-002',
      quantity: 5, 
      reason: 'Internal Use', 
      requestedBy: 'Technical Department',
      unitPrice: 39.99,
      totalPrice: 199.95,
      destination: 'IT Department',
      notes: 'For new employee onboarding'
    },
    { 
      id: 'SO-2023-007', 
      date: '2023-07-15', 
      product: 'Monitor 24"',
      productId: 'prod-003',
      quantity: 2, 
      reason: 'Return', 
      requestedBy: 'Customer Support',
      customerId: 'cust-4',
      customerName: 'Sarah Williams',
      unitPrice: 249.99,
      totalPrice: 499.98,
      orderReference: 'RET-10001',
      notes: 'Returned due to dead pixels'
    },
  ];

  const getReasonBadgeStyle = (reason: string) => {
    switch (reason) {
      case 'Sale':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'Damaged':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'Return':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'Internal Use':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
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
              <h1 className="text-3xl font-bold">Stock Out</h1>
              <p className="text-gray-500 dark:text-gray-400">Track items leaving your inventory.</p>
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
              <Button size="sm" onClick={() => setIsRecordDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Record Stock Out
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Stock Out History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockOutRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.id}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.product}</TableCell>
                      <TableCell>{record.quantity}</TableCell>
                      <TableCell>{formatCurrency(record.totalPrice || 0)}</TableCell>
                      <TableCell>
                        {record.customerName || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getReasonBadgeStyle(record.reason)} variant="outline">
                          {record.reason}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {record.destination || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedRecord(record);
                            setIsDetailsDialogOpen(true);
                          }}
                        >
                          Details
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

      {/* Stock Out Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Stock Out Record Details</span>
              {selectedRecord && selectedRecord.orderReference && (
                <Badge variant="secondary" className="ml-2">
                  Order Ref: {selectedRecord.orderReference}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reference ID</p>
                    <p className="font-medium">{selectedRecord.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p>{format(new Date(selectedRecord.date), 'MMMM d, yyyy')}</p>
                  </div>
                </div>
              </div>
              
              {/* Product Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Product Information</h3>
                <div>
                  <p className="text-sm font-medium text-gray-500">Product</p>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{selectedRecord.product}</p>
                    <Badge variant="outline" className="text-xs">{selectedRecord.productId}</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Quantity</p>
                    <p className="font-bold">{selectedRecord.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Unit Price</p>
                    <p>{formatCurrency(selectedRecord.unitPrice)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Value</p>
                    <p className="font-bold">{formatCurrency(selectedRecord.totalPrice)}</p>
                  </div>
                </div>
              </div>
              
              {/* Customer Information (if available) */}
              {selectedRecord.customerName && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Customer Information</h3>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Customer</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{selectedRecord.customerName}</p>
                      {selectedRecord.customerId && (
                        <Badge variant="outline" className="text-xs">{selectedRecord.customerId}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Additional Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reason</p>
                    <Badge className={getReasonBadgeStyle(selectedRecord.reason)} variant="outline">
                      {selectedRecord.reason}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Requested By</p>
                    <p>{selectedRecord.requestedBy}</p>
                  </div>
                  {selectedRecord.destination && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Destination</p>
                      <p>{selectedRecord.destination}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Notes */}
              {selectedRecord.notes && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Notes</p>
                  <div className="bg-gray-50 rounded p-3 text-sm">
                    {selectedRecord.notes}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="mt-6">
            {selectedRecord && selectedRecord.customerId && (
              <Button 
                variant="outline" 
                onClick={() => console.log(`View customer profile: ${selectedRecord?.customerId}`)}
                className="mr-auto"
              >
                View Customer Profile
              </Button>
            )}
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Record Stock Out Dialog */}
      <Dialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Record Stock Out</DialogTitle>
            <DialogDescription>
              Record items leaving your inventory due to sales, damage, returns, or internal use
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Product Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Product Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="product">Product</Label>
                <Select 
                  value={newStockOutRecord.product} 
                  onValueChange={(value) => {
                    // Simplified product ID lookup based on selection
                    const productIdMap: {[key: string]: string} = {
                      'Wireless Headphones': 'prod-007',
                      'USB-C Cable': 'prod-002',
                      'Laptop Stand': 'prod-009',
                      'Bluetooth Speaker': 'prod-004',
                      'HDMI Cable': 'prod-005',
                      'Wireless Mouse': 'prod-006',
                      'Monitor 24"': 'prod-003'
                    };
                    
                    // Simplified price lookup based on selection
                    const priceMap: {[key: string]: number} = {
                      'Wireless Headphones': 149.99,
                      'USB-C Cable': 19.99,
                      'Laptop Stand': 39.99,
                      'Bluetooth Speaker': 79.99,
                      'HDMI Cable': 12.99,
                      'Wireless Mouse': 39.99,
                      'Monitor 24"': 249.99
                    };
                    
                    const productId = productIdMap[value] || '';
                    const unitPrice = priceMap[value] || 0;
                    const totalPrice = unitPrice * newStockOutRecord.quantity;
                    
                    setNewStockOutRecord({
                      ...newStockOutRecord, 
                      product: value,
                      productId,
                      unitPrice,
                      totalPrice
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wireless Headphones">Wireless Headphones</SelectItem>
                    <SelectItem value="USB-C Cable">USB-C Cable</SelectItem>
                    <SelectItem value="Laptop Stand">Laptop Stand</SelectItem>
                    <SelectItem value="Bluetooth Speaker">Bluetooth Speaker</SelectItem>
                    <SelectItem value="HDMI Cable">HDMI Cable</SelectItem>
                    <SelectItem value="Wireless Mouse">Wireless Mouse</SelectItem>
                    <SelectItem value='Monitor 24"'>Monitor 24"</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    min="1"
                    value={newStockOutRecord.quantity}
                    onChange={(e) => {
                      const quantity = parseInt(e.target.value) || 1;
                      setNewStockOutRecord({
                        ...newStockOutRecord, 
                        quantity,
                        totalPrice: quantity * newStockOutRecord.unitPrice
                      });
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unitPrice">Unit Price</Label>
                  <Input 
                    id="unitPrice" 
                    type="number" 
                    min="0"
                    step="0.01"
                    value={newStockOutRecord.unitPrice}
                    onChange={(e) => {
                      const unitPrice = parseFloat(e.target.value) || 0;
                      setNewStockOutRecord({
                        ...newStockOutRecord, 
                        unitPrice,
                        totalPrice: unitPrice * newStockOutRecord.quantity
                      });
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="totalPrice">Total Value</Label>
                  <Input 
                    id="totalPrice" 
                    value={formatCurrency(newStockOutRecord.totalPrice)}
                    readOnly
                  />
                </div>
              </div>
            </div>
            
            {/* Customer Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Customer Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Select
                    onValueChange={(value) => {
                      // Simplified customer lookup
                      const customerMap: {[key: string]: string} = {
                        'cust-1': 'John Smith',
                        'cust-2': 'Jane Doe',
                        'cust-3': 'Bob Johnson',
                        'cust-4': 'Sarah Williams',
                        'cust-5': 'Michael Brown'
                      };
                      
                      setNewStockOutRecord({
                        ...newStockOutRecord, 
                        customerId: value,
                        customerName: customerMap[value] || ''
                      });
                    }}
                  >
                    <SelectTrigger id="customer">
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Customer (Internal)</SelectItem>
                      <SelectItem value="cust-1">John Smith</SelectItem>
                      <SelectItem value="cust-2">Jane Doe</SelectItem>
                      <SelectItem value="cust-3">Bob Johnson</SelectItem>
                      <SelectItem value="cust-4">Sarah Williams</SelectItem>
                      <SelectItem value="cust-5">Michael Brown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="orderReference">Order Reference</Label>
                  <Input
                    id="orderReference"
                    placeholder="Optional reference number"
                    value={newStockOutRecord.orderReference}
                    onChange={(e) => setNewStockOutRecord({...newStockOutRecord, orderReference: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            {/* Additional Details Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Additional Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Select
                    value={newStockOutRecord.destination}
                    onValueChange={(value) => setNewStockOutRecord({...newStockOutRecord, destination: value})}
                  >
                    <SelectTrigger id="destination">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Retail Store">Retail Store</SelectItem>
                      <SelectItem value="Online Order">Online Order</SelectItem>
                      <SelectItem value="Wholesale Client">Wholesale Client</SelectItem>
                      <SelectItem value="Corporate Client">Corporate Client</SelectItem>
                      <SelectItem value="Internal Use">Internal Use</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Select 
                    value={newStockOutRecord.reason} 
                    onValueChange={(value) => setNewStockOutRecord({...newStockOutRecord, reason: value})}
                  >
                    <SelectTrigger id="reason">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sale">Sale</SelectItem>
                      <SelectItem value="Damaged">Damaged</SelectItem>
                      <SelectItem value="Return">Return</SelectItem>
                      <SelectItem value="Internal Use">Internal Use</SelectItem>
                      <SelectItem value="Expired">Expired</SelectItem>
                      <SelectItem value="Lost">Lost</SelectItem>
                      <SelectItem value="Transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requestedBy">Requested By</Label>
                  <Input 
                    id="requestedBy" 
                    placeholder="Name of person requesting stock out"
                    value={newStockOutRecord.requestedBy}
                    onChange={(e) => setNewStockOutRecord({...newStockOutRecord, requestedBy: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={newStockOutRecord.date}
                    onChange={(e) => setNewStockOutRecord({...newStockOutRecord, date: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <textarea
                  id="notes"
                  className="w-full p-2 border border-gray-300 rounded-md min-h-[80px]"
                  placeholder="Additional information about this stock out"
                  value={newStockOutRecord.notes}
                  onChange={(e) => setNewStockOutRecord({...newStockOutRecord, notes: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRecordDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              console.log('Record stock out:', newStockOutRecord);
              setIsRecordDialogOpen(false);
              // Reset form
              setNewStockOutRecord({
                product: '',
                quantity: 1,
                reason: 'Sale',
                requestedBy: '',
                notes: '',
                date: new Date().toISOString().split('T')[0]
              });
            }}>
              <PackageOpen className="h-4 w-4 mr-2" /> Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}