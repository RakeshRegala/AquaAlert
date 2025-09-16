import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/auth/AuthForm';
import CommunityDashboard from './CommunityDashboard';
import AshaDashboard from './AshaDashboard';
import GovernmentDashboard from './GovernmentDashboard';

const Index = () => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  // Render appropriate dashboard based on user role
  switch (userRole) {
    case 'community':
      return <CommunityDashboard />;
    case 'asha':
      return <AshaDashboard />;
    case 'government':
      return <GovernmentDashboard />;
    default:
      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">Role not assigned</h1>
            <p className="text-muted-foreground">Please contact administrator to assign your role.</p>
          </div>
        </div>
      );
  }
};

export default Index;
