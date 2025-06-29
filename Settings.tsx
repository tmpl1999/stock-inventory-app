import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { User, ChevronRight, Save, RotateCcw, Database } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Profile settings form schema
const profileFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  role: z.string(),
  bio: z.string().optional(),
});

// Application settings form schema
const appSettingsFormSchema = z.object({
  companyName: z.string().min(1, { message: 'Company name is required' }),
  currencySymbol: z.string().min(1, { message: 'Currency symbol is required' }),
  lowStockThreshold: z.coerce.number().int().min(1),
  enableNotifications: z.boolean(),
  enableDarkMode: z.boolean(),
  dateFormat: z.string(),
  timezone: z.string(),
});

// Database settings form schema
const dbSettingsFormSchema = z.object({
  backupFrequency: z.string(),
  lastBackup: z.string().optional(),
  enableCloudBackup: z.boolean(),
});

export default function Settings() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState<{ id?: string; email?: string } | null>(null);
  const { toast } = useToast();

  // Initialize forms
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'admin',
      bio: '',
    },
  });

  const appSettingsForm = useForm<z.infer<typeof appSettingsFormSchema>>({
    resolver: zodResolver(appSettingsFormSchema),
    defaultValues: {
      companyName: 'My Company',
      currencySymbol: '$',
      lowStockThreshold: 5,
      enableNotifications: true,
      enableDarkMode: false,
      dateFormat: 'MM/DD/YYYY',
      timezone: 'UTC',
    },
  });

  const dbSettingsForm = useForm<z.infer<typeof dbSettingsFormSchema>>({
    resolver: zodResolver(dbSettingsFormSchema),
    defaultValues: {
      backupFrequency: 'daily',
      lastBackup: '2023-05-15T08:30:00Z',
      enableCloudBackup: true,
    },
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // In a real implementation, this would be fetched from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setUser(session.user);
          
          // Mock user profile data
          const mockUserProfile = {
            firstName: 'John',
            lastName: 'Doe',
            email: session.user.email || 'john.doe@example.com',
            role: 'admin',
            bio: 'Inventory management specialist with over 5 years of experience.',
          };
          
          // Set profile form values
          profileForm.reset(mockUserProfile);
        } else {
          // For demo purposes, set mock data
          const mockUserProfile = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'admin',
            bio: 'Inventory management specialist with over 5 years of experience.',
          };
          profileForm.reset(mockUserProfile);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [profileForm]);

  // Handle form submissions
  const onProfileSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    setIsLoading(true);
    
    try {
      // In a real implementation, update the user profile in Supabase
      // const { error } = await supabase
      //   .from('profiles')
      //   .update({
      //     first_name: data.firstName,
      //     last_name: data.lastName,
      //     role: data.role,
      //     bio: data.bio,
      //   })
      //   .eq('id', user.id);
      
      // if (error) throw error;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onAppSettingsSubmit = async (data: z.infer<typeof appSettingsFormSchema>) => {
    setIsLoading(true);
    
    try {
      // In a real implementation, update app settings in Supabase
      // const { error } = await supabase
      //   .from('app_settings')
      //   .update({
      //     company_name: data.companyName,
      //     currency_symbol: data.currencySymbol,
      //     low_stock_threshold: data.lowStockThreshold,
      //     enable_notifications: data.enableNotifications,
      //     enable_dark_mode: data.enableDarkMode,
      //     date_format: data.dateFormat,
      //     timezone: data.timezone,
      //   })
      //   .eq('user_id', user.id);
      
      // if (error) throw error;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings saved",
        description: "Application settings have been updated.",
      });
    } catch (error) {
      console.error("Error updating app settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDbSettingsSubmit = async (data: z.infer<typeof dbSettingsFormSchema>) => {
    setIsLoading(true);
    
    try {
      // In a real implementation, update database settings in Supabase
      // const { error } = await supabase
      //   .from('db_settings')
      //   .update({
      //     backup_frequency: data.backupFrequency,
      //     enable_cloud_backup: data.enableCloudBackup,
      //   })
      //   .eq('user_id', user.id);
      
      // if (error) throw error;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Database settings saved",
        description: "Database configuration has been updated.",
      });
    } catch (error) {
      console.error("Error updating database settings:", error);
      toast({
        title: "Error",
        description: "Failed to update database settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackupNow = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, trigger a database backup
      // const { error } = await supabase.rpc('trigger_backup');
      // if (error) throw error;
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the last backup time
      const newBackupTime = new Date().toISOString();
      dbSettingsForm.setValue('lastBackup', newBackupTime);
      
      toast({
        title: "Backup completed",
        description: "Database backup has been completed successfully.",
      });
    } catch (error) {
      console.error("Error during backup:", error);
      toast({
        title: "Backup failed",
        description: "Failed to complete database backup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage your account and application preferences</p>
          </div>

          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="application">Application</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
            </TabsList>
            
            {/* Profile Settings */}
            <TabsContent value="profile" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
                <div className="md:col-span-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        Update your personal details and preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField
                              control={profileForm.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={profileForm.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Doe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="john.doe@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="staff">Staff</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="A brief description about yourself"
                                    rows={4}
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button type="submit" disabled={isLoading} className="mt-4">
                            {isLoading ? 'Saving...' : 'Save changes'}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            Change password
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Update your account password
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            Two-factor Authentication
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-destructive">
                            Delete Account
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Application Settings */}
            <TabsContent value="application">
              <Card>
                <CardHeader>
                  <CardTitle>Application Settings</CardTitle>
                  <CardDescription>
                    Configure how the application works and displays information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...appSettingsForm}>
                    <form onSubmit={appSettingsForm.handleSubmit(onAppSettingsSubmit)} className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">General</h3>
                        <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
                          <FormField
                            control={appSettingsForm.control}
                            name="companyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={appSettingsForm.control}
                            name="currencySymbol"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Currency Symbol</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium">Inventory</h3>
                        <div className="grid grid-cols-1 gap-4 mt-4">
                          <FormField
                            control={appSettingsForm.control}
                            name="lowStockThreshold"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Low Stock Alert Threshold</FormLabel>
                                <FormControl>
                                  <Input type="number" min="1" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium">Display</h3>
                        <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                          <FormField
                            control={appSettingsForm.control}
                            name="dateFormat"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date Format</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a date format" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={appSettingsForm.control}
                            name="timezone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Timezone</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a timezone" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="UTC">UTC</SelectItem>
                                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium">Preferences</h3>
                        <div className="space-y-4 mt-4">
                          <FormField
                            control={appSettingsForm.control}
                            name="enableNotifications"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Notifications
                                  </FormLabel>
                                  <p className="text-sm text-muted-foreground">
                                    Receive alerts for low stock and other important events
                                  </p>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={appSettingsForm.control}
                            name="enableDarkMode"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Dark Mode
                                  </FormLabel>
                                  <p className="text-sm text-muted-foreground">
                                    Use dark theme for the application interface
                                  </p>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <Button type="submit" disabled={isLoading} className="mt-6">
                        <Save className="mr-2 h-4 w-4" />
                        {isLoading ? 'Saving...' : 'Save Settings'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Database Settings */}
            <TabsContent value="database">
              <Card>
                <CardHeader>
                  <CardTitle>Database Configuration</CardTitle>
                  <CardDescription>
                    Configure database settings and backup options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...dbSettingsForm}>
                    <form onSubmit={dbSettingsForm.handleSubmit(onDbSettingsSubmit)} className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">Backup Settings</h3>
                        <div className="space-y-4 mt-4">
                          <FormField
                            control={dbSettingsForm.control}
                            name="backupFrequency"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Automatic Backup Frequency</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select frequency" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="hourly">Hourly</SelectItem>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="never">Never</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="lastBackup">Last Backup</Label>
                            <Input
                              id="lastBackup"
                              value={dbSettingsForm.watch('lastBackup') ? 
                                new Date(dbSettingsForm.watch('lastBackup')).toLocaleString() : 
                                'Never'
                              }
                              readOnly
                              className="bg-gray-50"
                            />
                          </div>
                          
                          <div className="flex justify-start space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleBackupNow}
                              disabled={isLoading}
                            >
                              <RotateCcw className="mr-2 h-4 w-4" />
                              {isLoading ? 'Backing up...' : 'Backup Now'}
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <FormField
                        control={dbSettingsForm.control}
                        name="enableCloudBackup"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Cloud Backup
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                Store backups in the cloud for added security
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Database Information</h3>
                        <div className="rounded-lg border p-4 bg-gray-50">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">Database Type</p>
                              <p className="text-sm">PostgreSQL</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Version</p>
                              <p className="text-sm">14.5</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Host</p>
                              <p className="text-sm">db.supabase.co</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Size</p>
                              <p className="text-sm">125 MB</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-500">Connection String</p>
                            <div className="flex mt-1">
                              <Input 
                                type="password" 
                                value="postgresql://postgres:******@db.supabase.co:5432/postgres" 
                                readOnly
                                className="bg-gray-100 border-gray-200"
                              />
                              <Button variant="outline" size="sm" className="ml-2">
                                Copy
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button type="submit" disabled={isLoading} className="mt-6">
                        <Database className="mr-2 h-4 w-4" />
                        {isLoading ? 'Saving...' : 'Save Database Settings'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}