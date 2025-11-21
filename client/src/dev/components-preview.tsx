import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { PageSkeleton, ListSkeleton, CardSkeleton, TableSkeleton } from '@/components/ui/page-skeleton';
import { MetaTags } from '@/components/seo/meta-tags';
import { 
  Calendar, 
  Download, 
  Heart, 
  Home, 
  Mail, 
  Phone, 
  Search, 
  Settings, 
  Star, 
  User,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle
} from 'lucide-react';

export default function ComponentsPreview() {
  const [progress, setProgress] = useState(33);
  const [sliderValue, setSliderValue] = useState([50]);
  const [switchValue, setSwitchValue] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background p-8" data-testid="components-preview">
        <MetaTags 
          title="Components Preview - GSC Dev"
          description="Development preview for all UI components"
        />
        
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Components Preview
            </h1>
            <p className="text-xl text-muted-foreground">
              Development preview for all UI components
            </p>
          </div>

          <Tabs defaultValue="buttons" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="buttons">Buttons</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="loading">Loading</TabsTrigger>
              <TabsTrigger value="icons">Icons</TabsTrigger>
            </TabsList>

            <TabsContent value="buttons" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Button Variants</CardTitle>
                  <CardDescription>Different button styles and states</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    <Button data-testid="button-default">Default</Button>
                    <Button variant="secondary" data-testid="button-secondary">Secondary</Button>
                    <Button variant="destructive" data-testid="button-destructive">Destructive</Button>
                    <Button variant="outline" data-testid="button-outline">Outline</Button>
                    <Button variant="ghost" data-testid="button-ghost">Ghost</Button>
                    <Button variant="link" data-testid="button-link">Link</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm" data-testid="button-small">Small</Button>
                    <Button size="default" data-testid="button-default-size">Default</Button>
                    <Button size="lg" data-testid="button-large">Large</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex flex-wrap gap-3">
                    <Button disabled data-testid="button-disabled">Disabled</Button>
                    <Button data-testid="button-with-icon">
                      <Download className="mr-2 h-4 w-4" />
                      With Icon
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forms" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Form Components</CardTitle>
                  <CardDescription>Input fields, selects, and form controls</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="input-text">Text Input</Label>
                      <Input 
                        id="input-text" 
                        placeholder="Enter text..." 
                        data-testid="input-text"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="input-email">Email Input</Label>
                      <Input 
                        id="input-email" 
                        type="email" 
                        placeholder="Enter email..." 
                        data-testid="input-email"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="select-demo">Select</Label>
                      <Select>
                        <SelectTrigger data-testid="select-trigger">
                          <SelectValue placeholder="Select option..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="option1">Option 1</SelectItem>
                          <SelectItem value="option2">Option 2</SelectItem>
                          <SelectItem value="option3">Option 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="checkbox-demo" data-testid="checkbox-demo" />
                        <Label htmlFor="checkbox-demo">Checkbox option</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="switch-demo" 
                          checked={switchValue}
                          onCheckedChange={setSwitchValue}
                          data-testid="switch-demo"
                        />
                        <Label htmlFor="switch-demo">Switch option</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Slider: {sliderValue[0]}</Label>
                    <Slider
                      value={sliderValue}
                      onValueChange={setSliderValue}
                      max={100}
                      step={1}
                      data-testid="slider-demo"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cards" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card data-testid="card-basic">
                  <CardHeader>
                    <CardTitle>Basic Card</CardTitle>
                    <CardDescription>Simple card with header and content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>This is the card content area.</p>
                  </CardContent>
                </Card>
                
                <Card data-testid="card-with-badge">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Card with Badge</CardTitle>
                      <Badge data-testid="badge-new">New</Badge>
                    </div>
                    <CardDescription>Card featuring a status badge</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge variant="secondary" data-testid="badge-secondary">Secondary</Badge>
                      <Badge variant="destructive" data-testid="badge-destructive">Destructive</Badge>
                      <Badge variant="outline" data-testid="badge-outline">Outline</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card data-testid="card-interactive">
                  <CardHeader>
                    <CardTitle>Interactive Card</CardTitle>
                    <CardDescription>Card with interactive elements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Progress value={progress} data-testid="progress-demo" />
                    <div className="flex justify-between">
                      <Button size="sm" data-testid="button-card-action">Action</Button>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="outline" data-testid="button-info">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>More information</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Alerts</CardTitle>
                    <CardDescription>Different alert types for user feedback</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert data-testid="alert-info">
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        This is an informational alert.
                      </AlertDescription>
                    </Alert>
                    
                    <Alert data-testid="alert-success">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        This is a success alert.
                      </AlertDescription>
                    </Alert>
                    
                    <Alert variant="destructive" data-testid="alert-error">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        This is an error alert.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Dialog Example</CardTitle>
                    <CardDescription>Modal dialog component</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button data-testid="button-open-dialog">Open Dialog</Button>
                      </DialogTrigger>
                      <DialogContent data-testid="dialog-content">
                        <DialogHeader>
                          <DialogTitle>Dialog Title</DialogTitle>
                          <DialogDescription>
                            This is a dialog description that explains what the dialog is for.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <Input placeholder="Enter something..." data-testid="dialog-input" />
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline">Cancel</Button>
                            <Button>Confirm</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="loading" className="space-y-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Loading States</CardTitle>
                    <CardDescription>Different loading and skeleton components</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="mb-4 font-semibold">Basic Skeletons</h4>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" data-testid="skeleton-line-1" />
                        <Skeleton className="h-4 w-3/4" data-testid="skeleton-line-2" />
                        <Skeleton className="h-4 w-1/2" data-testid="skeleton-line-3" />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="mb-4 font-semibold">Card Skeleton</h4>
                      <CardSkeleton />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="mb-4 font-semibold">List Skeleton</h4>
                      <ListSkeleton count={3} />
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="mb-4 font-semibold">Table Skeleton</h4>
                      <TableSkeleton rows={3} cols={4} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="icons" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Icon Library</CardTitle>
                  <CardDescription>Commonly used icons from Lucide React</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
                    {[
                      { icon: Home, name: 'Home' },
                      { icon: User, name: 'User' },
                      { icon: Mail, name: 'Mail' },
                      { icon: Phone, name: 'Phone' },
                      { icon: Calendar, name: 'Calendar' },
                      { icon: Search, name: 'Search' },
                      { icon: Settings, name: 'Settings' },
                      { icon: Download, name: 'Download' },
                      { icon: Heart, name: 'Heart' },
                      { icon: Star, name: 'Star' },
                      { icon: Bell, name: 'Bell' },
                      { icon: CheckCircle, name: 'Check' },
                      { icon: AlertCircle, name: 'Alert' },
                      { icon: Info, name: 'Info' },
                      { icon: XCircle, name: 'Error' }
                    ].map(({ icon: Icon, name }, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <div 
                            className="flex flex-col items-center p-3 rounded-lg border hover:bg-accent cursor-pointer"
                            data-testid={`icon-${name.toLowerCase()}`}
                          >
                            <Icon className="h-6 w-6 mb-1" />
                            <span className="text-xs text-center">{name}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{name} Icon</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
}