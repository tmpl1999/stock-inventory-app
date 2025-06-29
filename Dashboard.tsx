import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { InventoryItem, StockAlert } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import useInventory from '@/hooks/use-inventory';
import { BarChart, LineChart, PieChart } from '@/components/ui/chart';
import { 
  Activity, 
  AlertTriangle, 
  ArrowUp, 
  ArrowDown, 
  Package, 
  DollarSign,
  BarChart as BarChartIcon,
  FileBarChart
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<{ id?: string; email?: string } | null>(null);
  
  // Get inventory items from custom hook
  const { 
    inventoryItems, 
    isLoading, 
    error, 
    filteredItems,
    fetchItems 
  } = useInventory();

  // Calculate low stock items
  const lowStockItems = useMemo(() => {
    return inventoryItems?.filter(item => item?.quantity <= item?.reorder_level) || [];
  }, [inventoryItems]);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if Supabase is properly configured
        const { isSupabaseConfigured } = await import('@/lib/supabase');
        
        if (!isSupabaseConfigured()) {
          toast({
            title: "Supabase Notice",
            description: "Supabase is not configured. Running in local mode with mock data.",
          });
          // Set a mock user in development mode
          setUser({ id: 'mock-user', email: 'mock@example.com' });
          return;
        }
        
        // Try to get the session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            title: "Authentication Notice",
            description: "In a production app with Supabase enabled, this would require login. Currently running in demo mode.",
          });
        } else {
          setUser(session.user);
        }
      } catch (error) {
        console.error('Auth error:', error);
        toast({
          title: "Authentication Error",
          description: "Could not validate authentication. Running in demo mode.",
        });
        // Set a mock user
        setUser({ id: 'error-user', email: 'error@example.com' });
      }
    };
    
    checkAuth();
  }, [toast]);

  // Statistics calculations
  const totalItems = inventoryItems?.length || 0;
  const totalStock = inventoryItems?.reduce((sum, item) => sum + (item?.quantity || 0), 0) || 0;
  const totalValue = inventoryItems?.reduce((sum, item) => sum + ((item?.quantity || 0) * (item?.cost_price || 0)), 0) || 0;
  const lowStockCount = lowStockItems?.length || 0;

  // Data for charts
  const categoryData = inventoryItems && inventoryItems.length > 0 ? inventoryItems.reduce((acc, item) => {
    // In a real app, we would look up category names
    const categoryName = `Category ${item && item.category_id ? item.category_id.substring(0, 5) : 'Unknown'}`;
    
    if (!acc[categoryName]) {
      acc[categoryName] = 0;
    }
    acc[categoryName] += item.quantity || 0;
    return acc;
  }, {} as Record<string, number>) : {'No Data': 1};

  const pieChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        label: 'Items by Category',
        data: Object.values(categoryData),
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Dummy data for recent months - in a real app, this would come from the database
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Stock In',
        data: [150, 230, 180, 290, 210, 320],
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
      {
        label: 'Stock Out',
        data: [120, 190, 170, 250, 180, 280],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      }
    ],
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
          <div className="pb-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Welcome to your inventory management dashboard.</p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{totalItems}</div>
                  <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                    <Package size={20} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {inventoryItems.length > 0 ? `${inventoryItems.length} unique products` : 'No products'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{totalStock}</div>
                  <div className="p-2 bg-green-100 rounded-full text-green-600">
                    <BarChartIcon size={20} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <span className="text-green-600 flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1" /> +2.5% from last month
                  </span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
                  <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                    <DollarSign size={20} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <span className="text-green-600 flex items-center">
                    <ArrowUp className="h-3 w-3 mr-1" /> +4.75% from last month
                  </span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{lowStockCount}</div>
                  <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                    <AlertTriangle size={20} />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {lowStockCount > 0 ? (
                    <span className="text-amber-600 flex items-center">
                      <Activity className="h-3 w-3 mr-1" /> Requires attention
                    </span>
                  ) : (
                    'All items above reorder levels'
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Stock Movement - Last 6 Months</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={monthlyData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Stock Distribution by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <PieChart data={pieChartData} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Low stock alerts */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Low Stock Alerts</CardTitle>
                <Button variant="outline" size="sm" onClick={() => navigate('/inventory')}>
                  View All Inventory
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {lowStockItems.length === 0 ? (
                <p className="text-sm text-center py-4 text-gray-500">
                  No low stock alerts at this time. All inventory levels are good!
                </p>
              ) : (
                <div className="overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Item</th>
                        <th className="text-left py-3 px-4 font-medium">SKU</th>
                        <th className="text-center py-3 px-4 font-medium">Current Stock</th>
                        <th className="text-center py-3 px-4 font-medium">Reorder Level</th>
                        <th className="text-right py-3 px-4 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockItems.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{item.name}</td>
                          <td className="py-3 px-4">{item.sku}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`${item.quantity === 0 ? 'text-red-600' : 'text-amber-600'} font-medium`}>
                              {item.quantity}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">{item.reorder_level}</td>
                          <td className="py-3 px-4 text-right">
                            <Button size="sm" variant="outline">
                              Reorder
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}