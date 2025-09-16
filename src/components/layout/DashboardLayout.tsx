import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Menu, Bell, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { signOut, userProfile, userRole } = useAuth();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'community':
        return 'bg-info text-info-foreground';
      case 'asha':
        return 'bg-success text-success-foreground';
      case 'government':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'community':
        return 'Community Member';
      case 'asha':
        return 'ASHA Worker';
      case 'government':
        return 'Government Authority';
      default:
        return 'User';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-card-foreground">{title}</h1>
              <p className="text-sm text-muted-foreground">Smart Community Health Monitor</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-medium">{userProfile?.name}</p>
                <Badge className={`text-xs ${getRoleBadgeColor(userRole || '')}`}>
                  {getRoleDisplayName(userRole || '')}
                </Badge>
              </div>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
            
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;