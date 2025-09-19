import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Users, Droplets, TrendingUp, MapPin, Calendar, User, Phone, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface HealthReport {
  id: string;
  patient_name: string;
  symptoms: string;
  location: string;
  water_source: string;
  created_at: string;
  profiles?: {
    name: string;
    role: 'community' | 'asha' | 'government';
  } | null;
}

interface WaterReading {
  id: string;
  location: string;
  ph: number;
  turbidity: number;
  contamination_level: number;
  created_at: string;
  profiles?: {
    name: string;
    role: 'community' | 'asha' | 'government';
  } | null;
}

interface Alert {
  id: string;
  location: string;
  alert_message: string;
  severity: 'low' | 'medium' | 'high';
  created_at: string;
  profiles?: {
    name: string;
  } | null;
}

const GovernmentDashboard = () => {
  const [healthReports, setHealthReports] = useState<HealthReport[]>([]);
  const [waterReadings, setWaterReadings] = useState<WaterReading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { userProfile } = useAuth();

  useEffect(() => {
    fetchDashboardData();
    
    // Set up real-time subscriptions
    const alertsSubscription = supabase
      .channel('alerts_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, () => {
        fetchAlerts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(alertsSubscription);
    };
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    await Promise.all([
      fetchHealthReports(),
      fetchWaterReadings(),
      fetchAlerts(),
    ]);
    setLoading(false);
  };

  const fetchHealthReports = async () => {
    try {
      const { data, error } = await supabase
        .from('health_reports')
        .select(`
          *,
          profiles!health_reports_reporter_id_fkey (
            name,
            role
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setHealthReports(data || []);
    } catch (error) {
      console.error('Error fetching health reports:', error);
    }
  };

  const fetchWaterReadings = async () => {
    try {
      const { data, error } = await supabase
        .from('water_readings')
        .select(`
          *,
          profiles!water_readings_reporter_id_fkey (
            name,
            role
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setWaterReadings(data || []);
    } catch (error) {
      console.error('Error fetching water readings:', error);
    }
  };

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-info text-info-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getWaterQualityStatus = (ph: number, turbidity: number, contamination: number) => {
    const isPhSafe = ph >= 6.5 && ph <= 8.5;
    const isTurbiditySafe = turbidity <= 5;
    const isContaminationSafe = contamination <= 0.5;
    
    if (isPhSafe && isTurbiditySafe && isContaminationSafe) {
      return { status: 'Safe', color: 'text-success' };
    } else if (!isPhSafe || turbidity > 10 || contamination > 0.8) {
      return { status: 'Dangerous', color: 'text-destructive' };
    } else {
      return { status: 'Caution', color: 'text-warning' };
    }
  };

  const getReporterType = (role: string | undefined) => {
    switch (role) {
      case 'asha':
        return 'ASHA Worker';
      case 'community':
        return 'Community Member';
      case 'government':
        return 'Government Official';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Government Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading dashboard data...</div>
        </div>
      </DashboardLayout>
    );
  }

  const highAlerts = alerts.filter(alert => alert.severity === 'high').length;
  const dangerousWaterSites = waterReadings.filter(reading => {
    const { status } = getWaterQualityStatus(reading.ph, reading.turbidity, reading.contamination_level);
    return status === 'Dangerous';
  }).length;

  return (
    <DashboardLayout title="Government Dashboard">
      <div className="grid gap-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Government Authority Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                <p className="text-lg">{userProfile?.name || 'Not set'}</p>
              </div>
              {userProfile?.phone_number && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                  <p className="text-lg flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {userProfile.phone_number}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Document Verification Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Document Verification Status
            </CardTitle>
            <CardDescription>
              Your verification documents uploaded during registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-success/10 p-4 rounded-lg">
              <p className="text-success font-medium">✓ Documents Verified</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your government authority credentials have been uploaded and are under review.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthReports.length}</div>
              <p className="text-xs text-muted-foreground">
                Health reports this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Water Tests</CardTitle>
              <Droplets className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{waterReadings.length}</div>
              <p className="text-xs text-muted-foreground">
                {dangerousWaterSites} sites need attention
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{alerts.length}</div>
              <p className="text-xs text-muted-foreground">
                {highAlerts} high priority
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${highAlerts > 0 ? 'text-destructive' : dangerousWaterSites > 0 ? 'text-warning' : 'text-success'}`}>
                {highAlerts > 0 ? 'High' : dangerousWaterSites > 0 ? 'Medium' : 'Low'}
              </div>
              <p className="text-xs text-muted-foreground">
                Community health risk
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Alerts
            </CardTitle>
            <CardDescription>
              Latest health and water quality alerts requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No alerts at this time</p>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                      alert.severity === 'high' ? 'text-destructive' : 
                      alert.severity === 'medium' ? 'text-warning' : 'text-info'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.location}
                        </span>
                      </div>
                      <p className="text-sm">{alert.alert_message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(alert.created_at).toLocaleDateString()}
                        </span>
                        <span>Reported by: System</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Data */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Health Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Health Reports</CardTitle>
              <CardDescription>Latest patient reports from ASHA workers and community members</CardDescription>
            </CardHeader>
            <CardContent>
              {healthReports.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No health reports yet</p>
              ) : (
                <div className="space-y-4">
                  {healthReports.slice(0, 5).map((report) => (
                    <div key={report.id} className="border-l-2 border-primary pl-4">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium">{report.patient_name}</h4>
                        <span className="text-xs text-muted-foreground">
                          {new Date(report.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{report.location}</p>
                      <p className="text-sm">{report.symptoms.substring(0, 100)}...</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        By: {getReporterType(report.profiles?.role)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Water Readings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Water Tests</CardTitle>
              <CardDescription>Latest water quality measurements</CardDescription>
            </CardHeader>
            <CardContent>
              {waterReadings.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No water readings yet</p>
              ) : (
                <div className="space-y-4">
                  {waterReadings.slice(0, 5).map((reading) => {
                    const { status, color } = getWaterQualityStatus(
                      reading.ph, 
                      reading.turbidity, 
                      reading.contamination_level
                    );
                    
                    return (
                      <div key={reading.id} className="border-l-2 border-info pl-4">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium">{reading.location}</h4>
                          <Badge className={`text-xs ${
                            status === 'Safe' ? 'bg-success text-success-foreground' :
                            status === 'Dangerous' ? 'bg-destructive text-destructive-foreground' :
                            'bg-warning text-warning-foreground'
                          }`}>
                            {status}
                          </Badge>
                        </div>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>pH:</span>
                            <span className={reading.ph < 6.5 || reading.ph > 8.5 ? 'text-destructive' : ''}>
                              {reading.ph}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Turbidity:</span>
                            <span className={reading.turbidity > 5 ? 'text-destructive' : ''}>
                              {reading.turbidity}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Contamination:</span>
                            <span className={reading.contamination_level > 0.5 ? 'text-destructive' : ''}>
                              {reading.contamination_level}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(reading.created_at).toLocaleDateString()} • {getReporterType(reading.profiles?.role)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GovernmentDashboard;