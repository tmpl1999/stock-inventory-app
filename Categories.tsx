import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Category } from '@/types';
import { supabase } from '@/lib/supabase';

export default function Categories() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('view');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Form states
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isFormLoading, setIsFormLoading] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real implementation, this would be fetched from Supabase
        // const { data, error } = await supabase.from('categories').select('*');
        // if (error) throw error;
        
        // Mock data for demonstration
        const mockCategories: Category[] = [
          {
            id: "cat-1",
            name: "Electronics",
            description: "Electronic devices including computers, phones, and accessories",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "cat-2",
            name: "Office Supplies",
            description: "Paper, pens, staplers, and other office necessities",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "cat-3",
            name: "Furniture",
            description: "Desks, chairs, filing cabinets and other office furniture",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];

        setCategories(mockCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories based on search query
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }

    setIsFormLoading(true);

    try {
      const newCategoryData: Category = {
        id: `cat-${Date.now()}`, // In production, Supabase would generate this
        name: newCategory.name.trim(),
        description: newCategory.description.trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // In a real implementation, this would be inserted into Supabase
      // const { data, error } = await supabase.from('categories').insert(newCategoryData);
      // if (error) throw error;

      // Add to local state
      setCategories([...categories, newCategoryData]);
      setNewCategory({ name: '', description: '' });
      setActiveTab('view');

      toast({
        title: "Category Added",
        description: `${newCategoryData.name} has been added successfully.`
      });
    } catch (err) {
      console.error('Error adding category:', err);
      toast({
        title: "Error",
        description: "Failed to add category. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  // Update existing category
  const handleUpdateCategory = async () => {
    if (!editCategory || !editCategory.name.trim()) return;

    setIsFormLoading(true);

    try {
      const updatedCategory = {
        ...editCategory,
        name: editCategory.name.trim(),
        description: editCategory.description?.trim() || '',
        updated_at: new Date().toISOString()
      };

      // In a real implementation, this would update Supabase
      // const { error } = await supabase.from('categories')
      //   .update(updatedCategory)
      //   .eq('id', updatedCategory.id);
      // if (error) throw error;

      // Update local state
      setCategories(categories.map(cat => 
        cat.id === updatedCategory.id ? updatedCategory : cat
      ));

      setIsEditDialogOpen(false);
      setEditCategory(null);

      toast({
        title: "Category Updated",
        description: `${updatedCategory.name} has been updated successfully.`
      });
    } catch (err) {
      console.error('Error updating category:', err);
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    setIsFormLoading(true);

    try {
      // In a real implementation, this would delete from Supabase
      // const { error } = await supabase.from('categories')
      //   .delete()
      //   .eq('id', categoryToDelete.id);
      // if (error) throw error;

      // Remove from local state
      setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
      
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);

      toast({
        title: "Category Deleted",
        description: `${categoryToDelete.name} has been deleted successfully.`
      });
    } catch (err) {
      console.error('Error deleting category:', err);
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsFormLoading(false);
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Categories</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Manage product categories for your inventory
              </p>
            </div>
            <div>
              <Button onClick={() => setActiveTab('add')} className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Category
              </Button>
            </div>
          </div>

          <Tabs defaultValue="view" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="view">View Categories</TabsTrigger>
              <TabsTrigger value="add">Add New Category</TabsTrigger>
            </TabsList>
            
            <TabsContent value="view">
              <Card>
                <CardHeader>
                  <CardTitle>Product Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-4 rounded">
                      {error}
                    </div>
                  )}
                  
                  {isLoading ? (
                    <div className="text-center py-10">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                      <p className="mt-2 text-gray-500">Loading categories...</p>
                    </div>
                  ) : filteredCategories.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No categories found.</p>
                      <Button 
                        variant="link" 
                        onClick={() => setActiveTab('add')}
                        className="mt-2"
                      >
                        Add your first category
                      </Button>
                    </div>
                  ) : (
                    <div className="border rounded-md overflow-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[200px]">Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredCategories.map((category) => (
                            <TableRow key={category.id}>
                              <TableCell className="font-medium">{category.name}</TableCell>
                              <TableCell>{category.description || '-'}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => {
                                      setEditCategory(category);
                                      setIsEditDialogOpen(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => {
                                      setCategoryToDelete(category);
                                      setIsDeleteDialogOpen(true);
                                    }}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="add">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="name"
                        placeholder="Enter category name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <Textarea
                        id="description"
                        placeholder="Enter category description"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                        className="mt-1"
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setNewCategory({ name: '', description: '' });
                          setActiveTab('view');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddCategory}
                        disabled={!newCategory.name || isFormLoading}
                      >
                        {isFormLoading ? 'Adding...' : 'Add Category'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="edit-name"
                value={editCategory?.name || ''}
                onChange={(e) => setEditCategory(editCategory ? {...editCategory, name: e.target.value} : null)}
                className="mt-1"
              />
            </div>
            
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                id="edit-description"
                value={editCategory?.description || ''}
                onChange={(e) => setEditCategory(editCategory ? {...editCategory, description: e.target.value} : null)}
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateCategory}
              disabled={!editCategory?.name || isFormLoading}
            >
              {isFormLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the category "{categoryToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteCategory}
              disabled={isFormLoading}
            >
              {isFormLoading ? 'Deleting...' : 'Delete Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}