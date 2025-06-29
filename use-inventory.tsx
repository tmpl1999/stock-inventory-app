import { useEffect, useState } from 'react';
import { InventoryItem, StockAlert } from '@/types';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

/**
 * Custom hook for managing inventory items with Supabase integration
 */
export default function useInventory() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>([]);
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [outOfStockItems, setOutOfStockItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch inventory items on component mount
  useEffect(() => {
    fetchItems();
  }, []);

  // Filter items when search query or category filter changes
  useEffect(() => {
    filterItems();
  }, [searchFilter, categoryFilter, inventoryItems]);

  // Update low stock and out of stock arrays when inventory changes
  useEffect(() => {
    // Identify low stock items
    const lowStock = inventoryItems.filter(
      (item) => item.quantity > 0 && item.quantity <= item.reorder_level
    );
    setLowStockItems(lowStock);

    // Identify out of stock items
    const outOfStock = inventoryItems.filter((item) => item.quantity <= 0);
    setOutOfStockItems(outOfStock);
  }, [inventoryItems]);

  /**
   * Fetches inventory items from Supabase or falls back to mock data
   */
  const fetchItems = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Import the helper from supabase.ts
      const { isSupabaseConfigured } = await import('@/lib/supabase');
      
      // Try to fetch from Supabase if properly configured
      if (isSupabaseConfigured()) {
        try {
          const { data, error } = await supabase.from('inventory_items').select('*');
          if (error) throw error;
          
          if (data && data.length > 0) {
            setInventoryItems(data as InventoryItem[]);
            setFilteredItems(data as InventoryItem[]);
            setIsLoading(false);
            return;
          }
        } catch (supabaseError) {
          console.warn('Error fetching from Supabase, falling back to mock data:', supabaseError);
          // Continue to use mock data if Supabase fetch fails
        }
      } else {
        console.info('Supabase not properly configured, using mock data.');
      }
      
      // Use mock data as fallback
      const mockItems: InventoryItem[] = [
        {
          id: "item-1",
          name: "Laptop - Dell XPS 13",
          description: "13-inch laptop with Intel i7 processor, 16GB RAM, 512GB SSD",
          sku: "LAP-DELL-001",
          category_id: "cat-1", // Electronics
          quantity: 8,
          reorder_level: 5,
          cost_price: 899.99,
          selling_price: 1299.99,
          supplier_id: "sup-1",
          location: "Warehouse A, Shelf 3",
          created_at: "2023-08-15T10:30:00Z",
          updated_at: "2023-09-01T14:45:00Z"
        },
        {
          id: "item-2",
          name: "Wireless Mouse",
          description: "Ergonomic wireless mouse with long battery life",
          sku: "ACC-MOU-002",
          category_id: "cat-1", // Electronics
          quantity: 25,
          reorder_level: 10,
          cost_price: 12.50,
          selling_price: 24.99,
          supplier_id: "sup-1",
          location: "Warehouse A, Shelf 4",
          created_at: "2023-08-20T09:15:00Z",
          updated_at: "2023-08-20T09:15:00Z"
        },
        {
          id: "item-3",
          name: "Office Chair",
          description: "Ergonomic office chair with lumbar support",
          sku: "FUR-CHA-003",
          category_id: "cat-3", // Furniture
          quantity: 4,
          reorder_level: 5,
          cost_price: 149.99,
          selling_price: 249.99,
          supplier_id: "sup-2",
          location: "Warehouse B, Section 2",
          created_at: "2023-07-05T11:20:00Z",
          updated_at: "2023-08-12T16:30:00Z"
        },
        {
          id: "item-4",
          name: "Printer Paper",
          description: "A4 size, 80gsm, 500 sheets per ream",
          sku: "SUP-PAP-004",
          category_id: "cat-2", // Office Supplies
          quantity: 3,
          reorder_level: 20,
          cost_price: 3.99,
          selling_price: 6.99,
          supplier_id: "sup-2",
          location: "Warehouse A, Shelf 1",
          created_at: "2023-08-01T08:45:00Z",
          updated_at: "2023-09-10T10:15:00Z"
        },
        {
          id: "item-5",
          name: "USB Drive - 64GB",
          description: "High-speed USB 3.0 flash drive, 64GB capacity",
          sku: "ACC-USB-005",
          category_id: "cat-1", // Electronics
          quantity: 0,
          reorder_level: 15,
          cost_price: 8.50,
          selling_price: 19.99,
          supplier_id: "sup-1",
          location: "Warehouse A, Shelf 2",
          created_at: "2023-08-10T13:25:00Z",
          updated_at: "2023-09-05T09:45:00Z"
        },
        {
          id: "item-6",
          name: "Desk Organizer",
          description: "Multi-compartment desk organizer for office supplies",
          sku: "SUP-ORG-006",
          category_id: "cat-2", // Office Supplies
          quantity: 12,
          reorder_level: 8,
          cost_price: 7.99,
          selling_price: 14.99,
          supplier_id: "sup-2",
          location: "Warehouse A, Shelf 5",
          created_at: "2023-08-18T15:10:00Z",
          updated_at: "2023-08-18T15:10:00Z"
        }
      ];
      
      // Set inventory items
      setInventoryItems(mockItems);
      setFilteredItems(mockItems);
    } catch (err) {
      console.error('Error fetching inventory items:', err);
      setError('Failed to load inventory items. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Filters inventory items based on search query and category
   */
  const filterItems = () => {
    let filtered = [...inventoryItems];
    
    // Apply search filter
    if (searchFilter) {
      const searchLower = searchFilter.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.sku.toLowerCase().includes(searchLower) ||
          (item.description && item.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter((item) => item.category_id === categoryFilter);
    }
    
    setFilteredItems(filtered);
  };

  /**
   * Adds a new inventory item
   * @param item New inventory item to add
   */
  const addItem = async (item: InventoryItem) => {
    try {
      // Check if Supabase is configured
      const { isSupabaseConfigured } = await import('@/lib/supabase');
      
      if (isSupabaseConfigured()) {
        // Use Supabase when properly configured
        const { data, error } = await supabase.from('inventory_items').insert(item).select();
        if (error) throw error;
        
        // If successful, use returned data from Supabase
        if (data && data[0]) {
          setInventoryItems([...inventoryItems, data[0] as InventoryItem]);
        } else {
          setInventoryItems([...inventoryItems, item]);
        }
      } else {
        // Use local state only when Supabase is not configured
        setInventoryItems([...inventoryItems, item]);
      }
      
      toast({
        title: "Item Added",
        description: `${item.name} has been added to inventory.`,
      });
      
      return true;
    } catch (err) {
      console.error('Error adding item:', err);
      toast({
        title: "Error",
        description: "Failed to add item to inventory.",
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Updates an existing inventory item
   * @param updatedItem Updated inventory item data
   */
  const updateItem = async (updatedItem: InventoryItem) => {
    try {
      // Check if Supabase is configured
      const { isSupabaseConfigured } = await import('@/lib/supabase');
      
      if (isSupabaseConfigured()) {
        // Use Supabase when properly configured
        const { error } = await supabase
          .from('inventory_items')
          .update(updatedItem)
          .eq('id', updatedItem.id);
          
        if (error) throw error;
      }
      
      // Always update local state
      setInventoryItems(inventoryItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      ));
      
      toast({
        title: "Item Updated",
        description: `${updatedItem.name} has been updated.`,
      });
      
      return true;
    } catch (err) {
      console.error('Error updating item:', err);
      toast({
        title: "Error",
        description: "Failed to update item.",
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Deletes an inventory item
   * @param id ID of the item to delete
   */
  const deleteItem = async (id: string) => {
    try {
      // Find the item name before deletion for the toast message
      const itemToDelete = inventoryItems.find(item => item.id === id);
      const itemName = itemToDelete?.name || 'Item';
      
      // Check if Supabase is configured
      const { isSupabaseConfigured } = await import('@/lib/supabase');
      
      if (isSupabaseConfigured()) {
        // Use Supabase when properly configured
        const { error } = await supabase.from('inventory_items').delete().eq('id', id);
        if (error) throw error;
      }
      
      // Always update local state
      setInventoryItems(inventoryItems.filter(item => item.id !== id));
      
      toast({
        title: "Item Deleted",
        description: `${itemName} has been removed from inventory.`,
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting item:', err);
      toast({
        title: "Error",
        description: "Failed to delete item.",
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Adjusts the quantity of an inventory item
   * @param id Item ID
   * @param quantity New quantity value
   * @param isAddition Whether this is adding to or setting the quantity
   */
  const adjustQuantity = async (id: string, quantity: number, isAddition = false) => {
    try {
      const itemToUpdate = inventoryItems.find(item => item.id === id);
      if (!itemToUpdate) {
        throw new Error('Item not found');
      }

      const newQuantity = isAddition 
        ? itemToUpdate.quantity + quantity 
        : quantity;

      if (newQuantity < 0) {
        toast({
          title: "Invalid Quantity",
          description: "Quantity cannot be negative.",
          variant: "destructive",
        });
        return false;
      }

      const updatedItem = {
        ...itemToUpdate,
        quantity: newQuantity,
        updated_at: new Date().toISOString()
      };

      // Check if Supabase is configured
      const { isSupabaseConfigured } = await import('@/lib/supabase');
      
      if (isSupabaseConfigured()) {
        // Use Supabase when properly configured
        const { error } = await supabase
          .from('inventory_items')
          .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
          .eq('id', id);
        if (error) throw error;
      }

      // Update local state
      setInventoryItems(inventoryItems.map(item => 
        item.id === id ? updatedItem : item
      ));

      toast({
        title: "Quantity Updated",
        description: `${updatedItem.name} quantity ${isAddition ? 'adjusted' : 'set'} to ${newQuantity}.`,
      });

      return true;
    } catch (err) {
      console.error('Error adjusting quantity:', err);
      toast({
        title: "Error",
        description: "Failed to update quantity.",
        variant: "destructive",
      });
      return false;
    }
  };

  /**
   * Generates stock alerts based on current inventory levels
   */
  const generateStockAlerts = (): StockAlert[] => {
    const alerts: StockAlert[] = [];
    
    inventoryItems.forEach(item => {
      if (item.quantity <= item.reorder_level) {
        alerts.push({
          item_id: item.id,
          item_name: item.name,
          current_quantity: item.quantity,
          reorder_level: item.reorder_level
        });
      }
    });
    
    return alerts.sort((a, b) => a.current_quantity - b.current_quantity);
  };

  return {
    inventoryItems,
    filteredItems,
    lowStockItems,
    outOfStockItems,
    isLoading,
    error,
    searchFilter,
    setSearchFilter,
    categoryFilter,
    setCategoryFilter,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    adjustQuantity,
    generateStockAlerts
  };
}