import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EnhancedInventory from './pages/EnhancedInventory';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import SupplyManagement from './pages/SupplyManagement';
import StockOut from './pages/StockOut';
import StockMovements from './pages/StockMovements';
import Users from './pages/Users';
import Reports from './pages/Reports';
import CustomerOrders from './pages/CustomerOrders';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<EnhancedInventory />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/supply-management" element={<SupplyManagement />} />
          <Route path="/stock-out" element={<StockOut />} />
          <Route path="/stock-movements" element={<StockMovements />} />
          <Route path="/users" element={<Users />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/customer-orders" element={<CustomerOrders />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
