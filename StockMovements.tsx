import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { 
  ArrowDownUp, 
  MoveVertical, 
  ArrowRight, 
  Calendar, 
  Package, 
  Filter, 
  Search, 
  BarChart as BarChartIcon, 
  Download, 
  PieChart as PieChartIcon,
  Info
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, PieChart } from '@/components/ui/chart';
import useStockMovements from '@/hooks/use-stock-movements';
import MovementDetailsDialog from '@/components/inventory/MovementDetailsDialog';
import ProductMovementHistory from '@/components/inventory/ProductMovementHistory';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function StockMovements() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [movementTypeFilter, setMovementTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isMovementDetailsOpen, setIsMovementDetailsOpen] = useState(false);
  const [selectedMovementId, setSelectedMovementId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{id: string; name: string} | null>(null);
  
  const { 
    movements, 
    filteredMovements, 
    isLoading, 
    error, 
    getMovementById,
    getMovementsByProduct,
    getMovementStats,
    getMovementOverTime,
    setFilters 
  } = useStockMovements();

  // Update filters when search or filter values change
  useMemo(() => {
    setFilters({
      query: searchQuery,
      movementType: movementTypeFilter !== 'all' ? movementTypeFilter : undefined,
      dateRange: dateFilter !== 'all' ? dateFilter : undefined,
      sort: { column: 'date', direction: 'desc' }
    });
  }, [searchQuery, movementTypeFilter, dateFilter, setFilters]);

  const movementStats = useMemo(() => getMovementStats(), [getMovementStats]);
  const movementOverTime = useMemo(() => getMovementOverTime(), [getMovementOverTime]);

  const selectedMovement = selectedMovementId ? getMovementById(selectedMovementId) : null;

  // Get unique products for product filter
  const uniqueProducts = useMemo(() => {
    const products = new Map<string, {id: string; name: string}>();
    
    movements.forEach(movement => {
      if (!products.has(movement.productId)) {
        products.set(movement.productId, {
          id: movement.productId,
          name: movement.productName
        });
      }
    });
    
    return Array.from(products.values());
  }, [movements]);
  
  const handleViewDetails = (movementId: string) => {
    setSelectedMovementId(movementId);
    setIsMovementDetailsOpen(true);
  };

  const handleViewProductHistory = (productId: string, productName: string) => {
    setSelectedProduct({ id: productId, name: productName });
    setActiveTab('product');
  };
  
  const getMovementTypeIcon = (type: string) => {
    switch (type) {
      case 'New Stock':
        return <Package className="h-4 w-4" />;
      case 'Transfer':
        return <ArrowRight className="h-4 w-4" />;
      case 'Stock Out':
        return <ArrowDownUp className="h-4 w-4" />;
      case 'Adjustment':
        return <Filter className="h-4 w-4" />;
      default:
        return <MoveVertical className="h-4 w-4" />;
    }
  };

  const getMovementBadgeStyle = (type: string) => {
    switch (type) {
      case 'New Stock':
        return 'default'; // Green
      case 'Transfer':
        return 'secondary'; // Purple
      case 'Stock Out':
        return 'destructive'; // Red
      case 'Adjustment':
        return 'outline'; // Outline
      default:
        return 'outline';
    }
  };
  
  // Chart data for movement distribution
  const movementDistributionData = {
    labels: ['New Stock', 'Stock Out', 'Transfers', 'Adjustments'],
    datasets: [
      {
        label: 'Distribution of Movement Types',
        data: [
          movements.filter(m => m.movementType === 'New Stock').length,
          movements.filter(m => m.movementType === 'Stock Out').length,
          movements.filter(m => m.movementType === 'Transfer').length,
          movements.filter(m => m.movementType === 'Adjustment').length
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',  // Green for New Stock
          'rgba(239, 68, 68, 0.7)',   // Red for Stock Out
          'rgba(168, 85, 247, 0.7)',  // Purple for Transfers
          'rgba(107, 114, 128, 0.7)', // Gray for Adjustments
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(107, 114, 128, 1)',
        ],
      }
    ]
  };
  
  // Chart data for stock movement over time
  const stockMovementOverTimeData = {
    labels: movementOverTime.labels,
    datasets: [
      {
        label: 'Stock In',
        data: movementOverTime.stockIn,
        backgroundColor: 'rgba(34, 197, 94, 0.7)',
        borderColor: 'rgba(34, 197, 94, 1)',
      },
      {
        label: 'Stock Out',
        data: movementOverTime.stockOut,
        backgroundColor: 'rgba(239, 68, 68, 0.7)',
        borderColor: 'rgba(239, 68, 68, 1)',
      }
    ]
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
              <h1 className="text-3xl font-bold">Stock Movements</h1>
              <p className="text-gray-500 dark:text-gray-400">Track and analyze inventory movements across your business</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </div>
          </div>
          
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total New Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4">
                    <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{movementStats.totalNewStock}</p>
                    <p className="text-xs text-gray-500">units received</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Stock Out</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center mr-4">
                    <ArrowDownUp className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{movementStats.totalStockOut}</p>
                    <p className="text-xs text-gray-500">units depleted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Transfers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-4">
                    <ArrowRight className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{movementStats.totalTransfers}</p>
                    <p className="text-xs text-gray-500">transfer operations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Adjustments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-4">
                    <Filter className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{movementStats.totalAdjustments}</p>
                    <p className="text-xs text-gray-500">units adjusted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Movements</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              {selectedProduct && (
                <TabsTrigger value="product">{selectedProduct.name}</TabsTrigger>
              )}
            </TabsList>
            
            {/* All Movements Tab */}
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Movement History</CardTitle>
                  <CardDescription>
                    Complete history of all stock movements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <Input 
                          type="search" 
                          placeholder="Search movements..." 
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <div className="min-w-[130px]">
                          <Select value={movementTypeFilter} onValueChange={setMovementTypeFilter}>
                            <SelectTrigger>
                              <SelectValue placeholder="All types" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Types</SelectItem>
                              <SelectItem value="New Stock">New Stock</SelectItem>
                              <SelectItem value="Stock Out">Stock Out</SelectItem>
                              <SelectItem value="Transfer">Transfer</SelectItem>
                              <SelectItem value="Adjustment">Adjustment</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="min-w-[130px]">
                          <Select value={dateFilter} onValueChange={setDateFilter}>
                            <SelectTrigger>
                              <SelectValue placeholder="Date range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Time</SelectItem>
                              <SelectItem value="today">Today</SelectItem>
                              <SelectItem value="thisWeek">This Week</SelectItem>
                              <SelectItem value="thisMonth">This Month</SelectItem>
                              <SelectItem value="last3Months">Last 3 Months</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    {/* Table */}
                    <div className="overflow-auto">
                      {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                          <p className="text-gray-500 dark:text-gray-400">Loading movements...</p>
                        </div>
                      ) : error ? (
                        <div className="flex justify-center items-center h-64">
                          <p className="text-red-500 dark:text-red-400">Error loading movements: {error}</p>
                        </div>
                      ) : filteredMovements.length === 0 ? (
                        <div className="flex justify-center items-center h-64 flex-col space-y-2">
                          <MoveVertical className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                          <p className="text-gray-500 dark:text-gray-400">No movements found</p>
                          <p className="text-sm text-gray-400 dark:text-gray-500">Try adjusting your search or filter criteria</p>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Product</TableHead>
                              <TableHead>Batch #</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Quantity</TableHead>
                              <TableHead>From</TableHead>
                              <TableHead>To</TableHead>
                              <TableHead>By</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredMovements.map((movement) => (
                              <TableRow key={movement.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <TableCell>
                                  <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                                    <span>{format(new Date(movement.date), 'MMM dd, yyyy')}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                  <Button 
                                    variant="link" 
                                    className="p-0 h-auto font-medium" 
                                    onClick={() => handleViewProductHistory(movement.productId, movement.productName)}
                                  >
                                    {movement.productName}
                                  </Button>
                                </TableCell>
                                <TableCell>{movement.batchNumber}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1.5">
                                    {getMovementTypeIcon(movement.movementType)}
                                    <Badge variant={getMovementBadgeStyle(movement.movementType) as "default" | "secondary" | "destructive" | "outline"}>
                                      {movement.movementType}
                                    </Badge>
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium">{movement.quantity}</TableCell>
                                <TableCell>
                                  {movement.fromWarehouse ? (
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">{movement.fromWarehouse}</span>
                                      <span className="text-xs text-muted-foreground">{movement.fromLocation}</span>
                                    </div>
                                  ) : (
                                    <span className="text-sm text-muted-foreground">-</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {movement.toWarehouse ? (
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">{movement.toWarehouse}</span>
                                      <span className="text-xs text-muted-foreground">{movement.toLocation}</span>
                                    </div>
                                  ) : (
                                    <span className="text-sm text-muted-foreground">-</span>
                                  )}
                                </TableCell>
                                <TableCell>{movement.initiatedBy}</TableCell>
                                <TableCell className="text-right">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleViewDetails(movement.id)}
                                        >
                                          <Info className="h-4 w-4" />
                                          <span className="sr-only">View Details</span>
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>View Details</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Analysis Tab */}
            <TabsContent value="analysis">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Stock Movement Over Time</CardTitle>
                      <BarChartIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <CardDescription>Monthly stock in vs stock out quantities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <BarChart data={stockMovementOverTimeData} />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Movement Distribution</CardTitle>
                      <PieChartIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <CardDescription>Distribution of different types of inventory movements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <PieChart data={movementDistributionData} />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Products by Movement</CardTitle>
                  <CardDescription>Products with the most movement activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Total Movements</TableHead>
                          <TableHead className="text-right">Stock In</TableHead>
                          <TableHead className="text-right">Stock Out</TableHead>
                          <TableHead className="text-right">Net Change</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {uniqueProducts.map(product => {
                          const productMovements = getMovementsByProduct(product.id);
                          const stockIn = productMovements.filter(m => m.movementType === 'New Stock')
                            .reduce((sum, m) => sum + m.quantity, 0);
                          const stockOut = productMovements.filter(m => m.movementType === 'Stock Out')
                            .reduce((sum, m) => sum + m.quantity, 0);
                          const netChange = stockIn - stockOut;
                          
                          return (
                            <TableRow key={product.id}>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell className="text-right">{productMovements.length}</TableCell>
                              <TableCell className="text-right text-green-600">{stockIn}</TableCell>
                              <TableCell className="text-right text-red-600">{stockOut}</TableCell>
                              <TableCell className={`text-right font-medium ${netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {netChange >= 0 ? '+' : ''}{netChange}
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleViewProductHistory(product.id, product.name)}
                                >
                                  View History
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Product-specific Tab */}
            <TabsContent value="product">
              {selectedProduct && (
                <ProductMovementHistory 
                  productId={selectedProduct.id}
                  productName={selectedProduct.name}
                  movements={getMovementsByProduct(selectedProduct.id)}
                  onViewDetails={handleViewDetails}
                />
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
      
      {/* Movement Details Dialog */}
      <MovementDetailsDialog 
        isOpen={isMovementDetailsOpen}
        onClose={() => setIsMovementDetailsOpen(false)}
        movement={selectedMovement}
      />
    </div>
  );
}