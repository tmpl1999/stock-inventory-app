import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { formatCurrency } from '@/lib/utils';
import { format, subDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Filter, Download, Search, FileText, User, ChevronDown, ShoppingCart } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define interfaces
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
}

interface OrderItem {
  productId: string;
  product: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface CustomerOrder {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  status: 'completed' | 'processing' | 'cancelled' | 'pending';
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  shippingAddress: string;
  notes?: string;
  stockOutId?: string;
}

export default function CustomerOrders() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isCreateOrderDialogOpen, setIsCreateOrderDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [orderStatus, setOrderStatus] = useState<string>('all');

  // Mock customers data
  const customers: Customer[] = [
    {
      id: 'cust-1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Anytown, AT 12345',
      joinDate: '2022-01-15',
      totalOrders: 12,
      totalSpent: 5892.50
    },
    {
      id: 'cust-2',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '(555) 987-6543',
      address: '456 Oak Ave, Somewhere, SW 67890',
      joinDate: '2022-02-20',
      totalOrders: 8,
      totalSpent: 3452.75
    },
    {
      id: 'cust-3',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone: '(555) 246-8102',
      address: '789 Pine Rd, Elsewhere, EL 34567',
      joinDate: '2022-03-10',
      totalOrders: 5,
      totalSpent: 1845.30
    },
    {
      id: 'cust-4',
      name: 'Sarah Williams',
      email: 'sarah.williams@example.com',
      phone: '(555) 369-8521',
      address: '321 Elm Blvd, Nowhere, NW 89012',
      joinDate: '2022-04-05',
      totalOrders: 3,
      totalSpent: 958.25
    },
    {
      id: 'cust-5',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '(555) 741-9630',
      address: '654 Maple Ct, Anywhere, AW 56789',
      joinDate: '2022-05-22',
      totalOrders: 7,
      totalSpent: 2743.80
    }
  ];

  // Mock orders data
  const mockOrders: CustomerOrder[] = [
    {
      id: 'ORD-10001',
      customerId: 'cust-1',
      customerName: 'John Smith',
      date: '2023-06-18',
      status: 'completed',
      items: [
        {
          productId: 'prod-007',
          product: 'Wireless Headphones',
          quantity: 25,
          unitPrice: 149.99,
          subtotal: 3749.75
        }
      ],
      total: 3749.75,
      paymentMethod: 'Credit Card',
      shippingAddress: '123 Main St, Anytown, AT 12345',
      notes: 'Bulk order for retail promotion',
      stockOutId: 'SO-2023-001'
    },
    {
      id: 'ORD-10002',
      customerId: 'cust-2',
      customerName: 'Jane Doe',
      date: '2023-06-20',
      status: 'completed',
      items: [
        {
          productId: 'prod-002',
          product: 'USB-C Cable',
          quantity: 50,
          unitPrice: 19.99,
          subtotal: 999.50
        }
      ],
      total: 999.50,
      paymentMethod: 'PayPal',
      shippingAddress: '456 Oak Ave, Somewhere, SW 67890',
      notes: 'Expedited shipping requested',
      stockOutId: 'SO-2023-002'
    },
    {
      id: 'ORD-10003',
      customerId: 'cust-3',
      customerName: 'Bob Johnson',
      date: '2023-07-01',
      status: 'completed',
      items: [
        {
          productId: 'prod-004',
          product: 'Bluetooth Speaker',
          quantity: 15,
          unitPrice: 79.99,
          subtotal: 1199.85
        }
      ],
      total: 1199.85,
      paymentMethod: 'Credit Card',
      shippingAddress: '789 Pine Rd, Elsewhere, EL 34567',
      stockOutId: 'SO-2023-004'
    },
    {
      id: 'ORD-10004',
      customerId: 'cust-2',
      customerName: 'Jane Doe',
      date: '2023-07-12',
      status: 'processing',
      items: [
        {
          productId: 'prod-001',
          product: 'Smartphone Case',
          quantity: 30,
          unitPrice: 24.99,
          subtotal: 749.70
        },
        {
          productId: 'prod-003',
          product: 'Monitor 24"',
          quantity: 5,
          unitPrice: 249.99,
          subtotal: 1249.95
        }
      ],
      total: 1999.65,
      paymentMethod: 'Bank Transfer',
      shippingAddress: '456 Oak Ave, Somewhere, SW 67890'
    },
    {
      id: 'ORD-10005',
      customerId: 'cust-5',
      customerName: 'Michael Brown',
      date: '2023-07-05',
      status: 'completed',
      items: [
        {
          productId: 'prod-005',
          product: 'HDMI Cable',
          quantity: 30,
          unitPrice: 12.99,
          subtotal: 389.70
        }
      ],
      total: 389.70,
      paymentMethod: 'Credit Card',
      shippingAddress: '654 Maple Ct, Anywhere, AW 56789',
      stockOutId: 'SO-2023-005'
    },
    {
      id: 'RET-10001',
      customerId: 'cust-4',
      customerName: 'Sarah Williams',
      date: '2023-07-15',
      status: 'completed',
      items: [
        {
          productId: 'prod-003',
          product: 'Monitor 24"',
          quantity: 2,
          unitPrice: 249.99,
          subtotal: 499.98
        }
      ],
      total: 499.98,
      paymentMethod: 'Credit Card Refund',
      shippingAddress: '321 Elm Blvd, Nowhere, NW 89012',
      notes: 'Returned due to dead pixels',
      stockOutId: 'SO-2023-007'
    },
    {
      id: 'ORD-10006',
      customerId: 'cust-1',
      customerName: 'John Smith',
      date: '2023-07-20',
      status: 'pending',
      items: [
        {
          productId: 'prod-008',
          product: 'Tablet',
          quantity: 10,
          unitPrice: 299.99,
          subtotal: 2999.90
        }
      ],
      total: 2999.90,
      paymentMethod: 'Credit Card',
      shippingAddress: '123 Main St, Anytown, AT 12345'
    }
  ];

  // Filter orders based on search query, customer, date range, and status
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.product.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCustomer = selectedCustomer === 'all' || order.customerId === selectedCustomer;
    
    let matchesDateRange = true;
    if (dateRange === 'week') {
      const orderDate = new Date(order.date);
      const weekAgo = subDays(new Date(), 7);
      matchesDateRange = orderDate >= weekAgo;
    } else if (dateRange === 'month') {
      const orderDate = new Date(order.date);
      const monthAgo = subDays(new Date(), 30);
      matchesDateRange = orderDate >= monthAgo;
    }
    
    const matchesStatus = orderStatus === 'all' || order.status === orderStatus;
    
    return matchesSearch && matchesCustomer && matchesDateRange && matchesStatus;
  });

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">Processing</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">Cancelled</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">{status}</Badge>;
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
              <h1 className="text-3xl font-bold">Customer Orders</h1>
              <p className="text-gray-500 dark:text-gray-400">Track and manage customer orders.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" /> Date Range
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
              <Button size="sm" onClick={() => setIsCreateOrderDialogOpen(true)}>
                <ShoppingCart className="h-4 w-4 mr-2" /> New Order
              </Button>
            </div>
          </div>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle>Order History</CardTitle>
                  <div className="flex flex-wrap gap-2 items-center">
                    {/* Search input */}
                    <div className="relative w-full md:w-auto">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input 
                        placeholder="Search orders..." 
                        className="pl-8 w-full md:w-[200px]" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    {/* Customer filter */}
                    <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Customer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Customers</SelectItem>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Date range filter */}
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger className="w-full md:w-[150px]">
                        <SelectValue placeholder="Date Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="week">Last 7 Days</SelectItem>
                        <SelectItem value="month">Last 30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {/* Status filter */}
                    <Select value={orderStatus} onValueChange={setOrderStatus}>
                      <SelectTrigger className="w-full md:w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Stock Out Ref</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{format(new Date(order.date), 'MMM d, yyyy')}</TableCell>
                          <TableCell>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="text-sm text-gray-500">ID: {order.customerId}</div>
                          </TableCell>
                          <TableCell>{formatCurrency(order.total)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>{order.stockOutId || '-'}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setIsDetailsDialogOpen(true);
                              }}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                          No orders found matching the current filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Order Details</span>
              {selectedOrder && (
                <Badge variant="secondary" className="ml-2">
                  {selectedOrder.id}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Order Details</TabsTrigger>
                  <TabsTrigger value="items">Order Items</TabsTrigger>
                  <TabsTrigger value="customer">Customer Info</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Order Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Order Date</p>
                            <p>{format(new Date(selectedOrder.date), 'MMMM d, yyyy')}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Status</p>
                            {getStatusBadge(selectedOrder.status)}
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500">Payment Method</p>
                          <p>{selectedOrder.paymentMethod}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-500">Total Amount</p>
                          <p className="text-xl font-bold">{formatCurrency(selectedOrder.total)}</p>
                        </div>
                        
                        {selectedOrder.stockOutId && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Stock Out Reference</p>
                            <div className="flex items-center gap-2">
                              <p>{selectedOrder.stockOutId}</p>
                              <Button variant="ghost" size="sm" className="h-6 px-2">
                                View
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Shipping Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Shipping Address</p>
                          <p className="whitespace-pre-line">{selectedOrder.shippingAddress}</p>
                        </div>
                        
                        {selectedOrder.notes && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Notes</p>
                            <p className="bg-gray-50 p-3 rounded text-sm">{selectedOrder.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="items">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Order Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead className="text-right">Quantity</TableHead>
                            <TableHead className="text-right">Unit Price</TableHead>
                            <TableHead className="text-right">Subtotal</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedOrder.items.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{item.product}</TableCell>
                              <TableCell>{item.productId}</TableCell>
                              <TableCell className="text-right">{item.quantity}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={4} className="text-right font-medium">
                              Total:
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              {formatCurrency(selectedOrder.total)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="customer">
                  {customers.find(c => c.id === selectedOrder.customerId) && (
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Customer Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          const customer = customers.find(c => c.id === selectedOrder.customerId)!;
                          return (
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                  <User className="h-6 w-6 text-gray-500" />
                                </div>
                                <div>
                                  <p className="font-medium">{customer.name}</p>
                                  <p className="text-sm text-gray-500">Customer since {format(new Date(customer.joinDate), 'MMM yyyy')}</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Email</p>
                                  <p>{customer.email}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Phone</p>
                                  <p>{customer.phone}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Address</p>
                                  <p className="whitespace-pre-line">{customer.address}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                                  <p>{customer.totalOrders} orders</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-500">Total Spent</p>
                                  <p className="font-bold">{formatCurrency(customer.totalSpent)}</p>
                                </div>
                              </div>
                              
                              <Button variant="outline" size="sm">
                                <User className="h-4 w-4 mr-2" /> View Customer Profile
                              </Button>
                            </div>
                          );
                        })()}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create New Order Dialog */}
      <Dialog open={isCreateOrderDialogOpen} onOpenChange={setIsCreateOrderDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Customer Information</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Select Customer</Label>
                  <Select>
                    <SelectTrigger id="customer">
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold">Order Items</h3>
                <Button variant="outline" size="sm">
                  Add Item
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                      No items added yet. Click "Add Item" to add products to this order.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Order Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select>
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Order Status</Label>
                  <Select>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <textarea
                    id="notes"
                    className="w-full p-2 border border-gray-300 rounded-md min-h-[80px]"
                    placeholder="Add any additional notes about this order"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setIsCreateOrderDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              // In a real app, we would save the order here
              console.log('Creating new order');
              setIsCreateOrderDialogOpen(false);
            }}>
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}