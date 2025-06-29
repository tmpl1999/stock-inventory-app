import { useState, useEffect, useMemo } from 'react';
import { Category, Supplier, InventoryItem } from '@/types';

interface InventoryFilters {
  query?: string;
  category?: string;
  supplier?: string;
  stock?: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
  sort?: {
    column: string;
    direction: 'asc' | 'desc';
  };
}

const useInventory = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<InventoryFilters>({
    sort: { column: 'name', direction: 'asc' }
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data from Supabase with fallback to mock data
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        
        // Import supabase client and check if it's configured
        const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
        
        if (isSupabaseConfigured()) {
          // Fetch real data from Supabase
          const { data, error } = await supabase
            .from('app_eb818_inventory_items')
            .select('*');
          
          if (error) throw new Error(error.message);
          
          if (data && data.length > 0) {
            setInventoryItems(data as InventoryItem[]);
            setIsLoading(false);
            setError(null);
            return;
          }
          
          // If no data in Supabase yet, seed with sample items
          const { data: categories } = await supabase
            .from('app_eb818_categories')
            .select('*');
            
          const { data: suppliers } = await supabase
            .from('app_eb818_suppliers')
            .select('*');
          
          if (categories && categories.length > 0 && suppliers && suppliers.length > 0) {
            const seedItems = [
              {
                name: 'Wireless Keyboard',
                description: 'Ergonomic wireless keyboard with long battery life',
                sku: 'KB-001',
                barcode: '1234567890123',
                category_id: categories[0].id,
                category_name: categories[0].name,
                supplier_id: suppliers[0].id,
                supplier_name: suppliers[0].name,
                quantity: 120,
                unit: 'piece',
                unit_cost: 39.99,
                selling_price: 59.99,
                reorder_level: 20,
                reorder_quantity: 50,
                location: 'Shelf A-1',
                image_url: '',
              },
              {
                name: 'Wireless Mouse',
                description: 'Precise wireless mouse with DPI adjustments',
                sku: 'MS-001',
                barcode: '1234567890124',
                category_id: categories[0].id,
                category_name: categories[0].name,
                supplier_id: suppliers[0].id,
                supplier_name: suppliers[0].name,
                quantity: 85,
                unit: 'piece',
                unit_cost: 24.99,
                selling_price: 39.99,
                reorder_level: 15,
                reorder_quantity: 30,
                location: 'Shelf A-2',
                image_url: '',
              },
              {
                name: 'Notebook Pack',
                description: 'Pack of 5 spiral notebooks',
                sku: 'NB-001',
                barcode: '1234567890129',
                category_id: categories[1].id,
                category_name: categories[1].name,
                supplier_id: suppliers[1].id,
                supplier_name: suppliers[1].name,
                quantity: 0,
                unit: 'pack',
                unit_cost: 7.99,
                selling_price: 12.99,
                reorder_level: 10,
                reorder_quantity: 20,
                location: 'Shelf C-2',
                image_url: '',
              }
            ];
            
            // Insert sample data into Supabase
            const { data: insertedItems, error: insertError } = await supabase
              .from('app_eb818_inventory_items')
              .insert(seedItems)
              .select();
              
            if (insertError) throw new Error(insertError.message);
            
            if (insertedItems) {
              setInventoryItems(insertedItems as InventoryItem[]);
              setIsLoading(false);
              setError(null);
              return;
            }
          }
        } else {
          console.warn('Supabase not configured. Using mock data instead.');
        }
        
        // Fallback to mock data if Supabase is not configured or data fetch failed
        const mockInventory: InventoryItem[] = [
          {
            id: 'item-1',
            name: 'Wireless Keyboard',
            description: 'Ergonomic wireless keyboard with long battery life',
            sku: 'KB-001',
            barcode: '1234567890123',
            category_id: 'cat-1',
            category_name: 'Electronics',
            supplier_id: 'sup-1',
            supplier_name: 'TechSupply Inc.',
            quantity: 120,
            unit: 'piece',
            unit_cost: 39.99,
            selling_price: 59.99,
            reorder_level: 20,
            reorder_quantity: 50,
            location: 'Shelf A-1',
            image_url: '',
            created_at: '2023-06-15T10:00:00Z',
            updated_at: '2023-07-20T14:30:00Z',
          },
          {
            id: 'item-2',
            name: 'Wireless Mouse',
            description: 'Precise wireless mouse with DPI adjustments',
            sku: 'MS-001',
            barcode: '1234567890124',
            category_id: 'cat-1',
            category_name: 'Electronics',
            supplier_id: 'sup-1',
            supplier_name: 'TechSupply Inc.',
            quantity: 85,
            unit: 'piece',
            unit_cost: 24.99,
            selling_price: 39.99,
            reorder_level: 15,
            reorder_quantity: 30,
            location: 'Shelf A-2',
            image_url: '',
            created_at: '2023-06-15T10:05:00Z',
            updated_at: '2023-07-20T14:35:00Z',
          },
          {
            id: 'item-7',
            name: 'Notebook Pack',
            description: 'Pack of 5 spiral notebooks',
            sku: 'NB-001',
            barcode: '1234567890129',
            category_id: 'cat-2',
            category_name: 'Office Supplies',
            supplier_id: 'sup-2',
            supplier_name: 'Office Essentials',
            quantity: 0,
            unit: 'pack',
            unit_cost: 7.99,
            selling_price: 12.99,
            reorder_level: 10,
            reorder_quantity: 20,
            location: 'Shelf C-2',
            image_url: '',
            created_at: '2023-06-15T10:30:00Z',
            updated_at: '2023-07-20T15:00:00Z',
          }
        ];
        
        setInventoryItems(mockInventory);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error fetching inventory:', err);
        setIsLoading(false);
        setError(err instanceof Error ? err.message : 'An error occurred while fetching inventory');
      }
    };

    fetchInventory();
  }, []);

  // Filter and sort inventory items based on filters
  const filteredItems = useMemo(() => {
    let filtered = [...inventoryItems];
    
    // Apply search query filter
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.barcode.includes(query)
      );
    }
    
    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(item => 
        item.category_id === filters.category
      );
    }
    
    // Apply supplier filter
    if (filters.supplier) {
      filtered = filtered.filter(item => 
        item.supplier_id === filters.supplier
      );
    }
    
    // Apply stock level filter
    if (filters.stock) {
      switch (filters.stock) {
        case 'in-stock':
          filtered = filtered.filter(item => item.quantity > 0);
          break;
        case 'low-stock':
          filtered = filtered.filter(item => 
            item.quantity > 0 && item.quantity <= item.reorder_level
          );
          break;
        case 'out-of-stock':
          filtered = filtered.filter(item => item.quantity === 0);
          break;
        // 'all' case - do nothing
      }
    }
    
    // Apply sorting
    if (filters.sort) {
      const { column, direction } = filters.sort;
      filtered.sort((a, b) => {
        let valueA: string | number;
        let valueB: string | number;
        
        switch (column) {
          case 'name':
            valueA = a.name;
            valueB = b.name;
            break;
          case 'quantity':
            valueA = a.quantity;
            valueB = b.quantity;
            break;
          case 'price':
            valueA = a.selling_price;
            valueB = b.selling_price;
            break;
          case 'category':
            valueA = a.category_name;
            valueB = b.category_name;
            break;
          case 'supplier':
            valueA = a.supplier_name;
            valueB = b.supplier_name;
            break;
          default:
            valueA = a[column as keyof InventoryItem];
            valueB = b[column as keyof InventoryItem];
        }
        
        if (valueA < valueB) {
          return direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filtered;
  }, [inventoryItems, filters]);

  // Get item by ID
  const getItemById = (itemId: string): InventoryItem | undefined => {
    return inventoryItems.find(item => item.id === itemId);
  };

  // Add new item
  const addItem = async (newItem: InventoryItem) => {
    try {
      const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
      
      if (isSupabaseConfigured()) {
        // Add to Supabase
        const { data, error } = await supabase
          .from('app_eb818_inventory_items')
          .insert(newItem)
          .select();
          
        if (error) throw new Error(error.message);
        
        if (data && data.length > 0) {
          setInventoryItems(prev => [...prev, data[0] as InventoryItem]);
          return data[0];
        }
      } else {
        // Fallback to local state if Supabase is not configured
        const itemWithId = { ...newItem, id: `item-${Date.now()}` };
        setInventoryItems(prev => [...prev, itemWithId]);
        return itemWithId;
      }
    } catch (err) {
      console.error('Error adding inventory item:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while adding the inventory item');
      return null;
    }
  };

  // Update existing item
  const updateItem = async (updatedItem: InventoryItem) => {
    try {
      const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
      
      if (isSupabaseConfigured()) {
        // Update in Supabase
        const { data, error } = await supabase
          .from('app_eb818_inventory_items')
          .update(updatedItem)
          .eq('id', updatedItem.id)
          .select();
          
        if (error) throw new Error(error.message);
        
        if (data && data.length > 0) {
          setInventoryItems(prev => 
            prev.map(item => item.id === updatedItem.id ? data[0] as InventoryItem : item)
          );
          return data[0];
        }
      } else {
        // Fallback to local state if Supabase is not configured
        setInventoryItems(prev => 
          prev.map(item => item.id === updatedItem.id ? updatedItem : item)
        );
        return updatedItem;
      }
    } catch (err) {
      console.error('Error updating inventory item:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while updating the inventory item');
      return null;
    }
  };

  // Delete item
  const deleteItem = async (itemId: string) => {
    try {
      const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');
      
      if (isSupabaseConfigured()) {
        // Delete from Supabase
        const { error } = await supabase
          .from('app_eb818_inventory_items')
          .delete()
          .eq('id', itemId);
          
        if (error) throw new Error(error.message);
      }
      
      // Update local state regardless of Supabase config
      setInventoryItems(prev => prev.filter(item => item.id !== itemId));
      return true;
    } catch (err) {
      console.error('Error deleting inventory item:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while deleting the inventory item');
      return false;
    }
  };

  // Set search filter
  const setSearchFilter = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
  };

  return {
    inventoryItems,
    filteredItems,
    isLoading,
    error,
    getItemById,
    addItem,
    updateItem,
    deleteItem,
    setFilters,
    setSearchFilter
  };
};

export default useInventory;