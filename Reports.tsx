import { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Calendar, FileText, BarChart as BarChartIcon, PieChart as PieChartIcon, LineChart as LineChartIcon, Filter } from 'lucide-react';
import { BarChart, PieChart, LineChart } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

export default function Reports() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('inventory');
  
  // Dialog states
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [isCustomReportOpen, setIsCustomReportOpen] = useState(false);
  
  // Date range state
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  
  // Custom report state
  const [reportType, setReportType] = useState('inventory');
  const [reportFormat, setReportFormat] = useState('pdf');

  // Mock data for inventory value chart
  const inventoryValueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Value',
        data: [25000, 27500, 30000, 32500, 35000, 38000],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
      }
    ]
  };

  // Mock data for stock movement
  const stockMovementData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Stock In',
        data: [350, 420, 380, 470, 410, 520],
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgba(34, 197, 94, 1)',
      },
      {
        label: 'Stock Out',
        data: [300, 370, 350, 410, 380, 460],
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgba(239, 68, 68, 1)',
      }
    ]
  };

  // Mock data for category distribution
  const categoryDistributionData = {
    labels: ['Electronics', 'Office Supplies', 'Furniture', 'Accessories', 'Others'],
    datasets: [
      {
        label: 'Items by Category',
        data: [45, 25, 15, 10, 5],
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(168, 85, 247, 0.7)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(168, 85, 247, 1)',
        ],
      }
    ]
  };

  // Mock data for top selling products
  const topSellingProducts = [
    { id: 1, name: 'Wireless Headphones', sku: 'PRD-001', sales: 120, revenue: 5980 },
    { id: 2, name: 'USB-C Cable', sku: 'PRD-032', sales: 210, revenue: 2100 },
    { id: 3, name: 'Laptop Stand', sku: 'PRD-018', sales: 95, revenue: 2850 },
    { id: 4, name: 'Bluetooth Speaker', sku: 'PRD-027', sales: 85, revenue: 4250 },
    { id: 5, name: 'Wireless Mouse', sku: 'PRD-045', sales: 150, revenue: 2250 },
  ];

  // Mock data for lowest stock items
  const lowestStockItems = [
    { id: 1, name: 'HDMI Cable', sku: 'PRD-052', quantity: 8, reorderLevel: 15 },
    { id: 2, name: 'Desk Lamp', sku: 'PRD-047', quantity: 5, reorderLevel: 10 },
    { id: 3, name: 'Power Bank', sku: 'PRD-063', quantity: 7, reorderLevel: 20 },
    { id: 4, name: 'Monitor Stand', sku: 'PRD-078', quantity: 3, reorderLevel: 10 },
    { id: 5, name: 'Wireless Keyboard', sku: 'PRD-015', quantity: 6, reorderLevel: 15 },
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Reports</h1>
              <p className="text-gray-500 dark:text-gray-400">Generate and view analytics for your inventory.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsDateRangeOpen(true)}>
                <Calendar className="h-4 w-4 mr-2" /> Date Range
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsCustomReportOpen(true)}>
                <FileText className="h-4 w-4 mr-2" /> Custom Report
              </Button>
              <Button size="sm" onClick={() => {
                console.log(`Exporting ${activeTab} report`);
                // This would trigger the export functionality in a real app
                alert(`Exporting ${activeTab} report as PDF...`);
              }}>
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="inventory" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="purchases">Purchases</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
            </TabsList>
            
            {/* Inventory Reports Tab */}
            <TabsContent value="inventory">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Inventory Value Over Time</CardTitle>
                      <LineChartIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <CardDescription>Trend showing total inventory value month by month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LineChart data={inventoryValueData} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Category Distribution</CardTitle>
                      <PieChartIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <CardDescription>Distribution of inventory items by category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <PieChart data={categoryDistributionData} />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Lowest Stock Items</CardTitle>
                    <CardDescription>Items that are close to or below reorder level</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Reorder Level</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lowestStockItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.sku}</TableCell>
                            <TableCell className="text-right">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                item.quantity < item.reorderLevel ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {item.quantity}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">{item.reorderLevel}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Stock Movement</CardTitle>
                      <BarChartIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <CardDescription>Monthly stock in vs stock out</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BarChart data={stockMovementData} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Purchases Reports Tab */}
            <TabsContent value="purchases">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Purchase Trends</CardTitle>
                  <CardDescription>This tab will contain purchase analysis reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-muted-foreground">
                    Purchase reports will be available in the next update. Check back soon!
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Sales Reports Tab */}
            <TabsContent value="sales">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>Products with the highest sales volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-right">Units Sold</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topSellingProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell className="text-right">{product.sales}</TableCell>
                          <TableCell className="text-right">${product.revenue.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Sales Analysis</CardTitle>
                  <CardDescription>Additional sales reports will be available soon</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-8 text-muted-foreground">
                    Detailed sales reports will be available in the next update. Check back soon!
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Date Range Dialog */}
      <Dialog open={isDateRangeOpen} onOpenChange={setIsDateRangeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Date Range</DialogTitle>
            <DialogDescription>
              Choose a date range for your reports.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="start-date"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="end-date"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDateRangeOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              console.log('Date range selected:', { startDate, endDate });
              setIsDateRangeOpen(false);
              // This would update the reports with the selected date range in a real app
              alert(`Date range applied: ${format(startDate as Date, 'MM/dd/yyyy')} - ${format(endDate as Date, 'MM/dd/yyyy')}`);
            }}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Report Dialog */}
      <Dialog open={isCustomReportOpen} onOpenChange={setIsCustomReportOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Custom Report</DialogTitle>
            <DialogDescription>
              Select options for generating a custom report.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inventory">Inventory Report</SelectItem>
                  <SelectItem value="purchases">Purchase Orders Report</SelectItem>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="low-stock">Low Stock Items Report</SelectItem>
                  <SelectItem value="valuation">Inventory Valuation Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="report-format">Format</Label>
                <Select value={reportFormat} onValueChange={setReportFormat}>
                  <SelectTrigger id="report-format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="include-charts">Include Charts</Label>
                <Select defaultValue="yes">
                  <SelectTrigger id="include-charts">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Date Range</Label>
              <div className="grid grid-cols-2 gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP') : <span>Start date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP') : <span>End date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomReportOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              console.log('Generating custom report:', { reportType, reportFormat, startDate, endDate });
              setIsCustomReportOpen(false);
              // This would generate the custom report in a real app
              alert(`Generating ${reportType} report in ${reportFormat.toUpperCase()} format...`);
            }}>
              <FileText className="h-4 w-4 mr-2" /> Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}