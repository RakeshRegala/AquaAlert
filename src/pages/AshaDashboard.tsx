import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Beaker, Users, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const AshaDashboard = () => {
  // Health Report Form State
  const [patientName, setPatientName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [location, setLocation] = useState('');
  const [waterSource, setWaterSource] = useState('');
  
  // Water Reading Form State
  const [waterLocation, setWaterLocation] = useState('');
  const [ph, setPh] = useState('');
  const [turbidity, setTurbidity] = useState('');
  const [contamination, setContamination] = useState('');
  
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleHealthReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('health_reports')
        .insert({
          reporter_id: user.id,
          patient_name: patientName,
          symptoms,
          location,
          water_source: waterSource,
        });

      if (error) throw error;

      toast({
        title: "Report Submitted",
        description: "Health report has been submitted successfully.",
      });
      
      // Reset form
      setPatientName('');
      setSymptoms('');
      setLocation('');
      setWaterSource('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit health report.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleWaterReadingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const phValue = parseFloat(ph);
    const turbidityValue = parseFloat(turbidity);
    const contaminationValue = parseFloat(contamination);

    setLoading(true);
    try {
      // Insert water reading
      const { error: waterError } = await supabase
        .from('water_readings')
        .insert({
          reporter_id: user.id,
          location: waterLocation,
          ph: phValue,
          turbidity: turbidityValue,
          contamination_level: contaminationValue,
        });

      if (waterError) throw waterError;

      // Check for dangerous readings and create alert if needed
      const isDangerous = phValue < 6.5 || phValue > 8.5 || turbidityValue > 5 || contaminationValue > 0.5;
      
      if (isDangerous) {
        let alertMessage = `Dangerous water quality detected at ${waterLocation}. `;
        if (phValue < 6.5 || phValue > 8.5) alertMessage += `pH: ${phValue} (unsafe). `;
        if (turbidityValue > 5) alertMessage += `Turbidity: ${turbidityValue} (high). `;
        if (contaminationValue > 0.5) alertMessage += `Contamination: ${contaminationValue} (high). `;

        const { error: alertError } = await supabase
          .from('alerts')
          .insert({
            triggered_by: user.id,
            location: waterLocation,
            alert_message: alertMessage,
            severity: phValue < 6 || phValue > 9 || turbidityValue > 10 ? 'high' : 'medium',
          });

        if (alertError) console.error('Alert creation failed:', alertError);
      }

      toast({
        title: "Water Reading Submitted",
        description: isDangerous ? "Alert has been created due to dangerous readings!" : "Water reading recorded successfully.",
        variant: isDangerous ? "destructive" : "default",
      });
      
      // Reset form
      setWaterLocation('');
      setPh('');
      setTurbidity('');
      setContamination('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit water reading.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <DashboardLayout title="ASHA Worker Dashboard">
      <div className="grid gap-6">
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports Today</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Water Tests</CardTitle>
              <Beaker className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                +1 from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients Visited</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +5 from yesterday
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alerts Created</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">3</div>
              <p className="text-xs text-muted-foreground">
                Requires attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Data Entry Forms */}
        <Tabs defaultValue="health" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="health">Health Reports</TabsTrigger>
            <TabsTrigger value="water">Water Testing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="health" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Submit Patient Health Report</CardTitle>
                <CardDescription>
                  Record patient symptoms and health observations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleHealthReportSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="patient-name">Patient Name</Label>
                      <Input
                        id="patient-name"
                        placeholder="Full name of patient"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patient-location">Location</Label>
                      <Input
                        id="patient-location"
                        placeholder="Patient's address/area"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-water-source">Water Source</Label>
                    <Input
                      id="patient-water-source"
                      placeholder="Primary water source used by patient"
                      value={waterSource}
                      onChange={(e) => setWaterSource(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-symptoms">Symptoms & Observations</Label>
                    <Textarea
                      id="patient-symptoms"
                      placeholder="Detailed description of symptoms, medical history, and observations..."
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      required
                      rows={4}
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Health Report'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="water" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Submit Water Test Results</CardTitle>
                <CardDescription>
                  Record water quality measurements and test results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleWaterReadingSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="water-test-location">Test Location</Label>
                    <Input
                      id="water-test-location"
                      placeholder="Location where water sample was taken"
                      value={waterLocation}
                      onChange={(e) => setWaterLocation(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="ph-level">pH Level</Label>
                      <Input
                        id="ph-level"
                        type="number"
                        step="0.1"
                        min="0"
                        max="14"
                        placeholder="6.5 - 8.5 (safe range)"
                        value={ph}
                        onChange={(e) => setPh(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="turbidity-level">Turbidity (NTU)</Label>
                      <Input
                        id="turbidity-level"
                        type="number"
                        step="0.1"
                        min="0"
                        placeholder="< 5 (safe range)"
                        value={turbidity}
                        onChange={(e) => setTurbidity(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contamination-level">Contamination Level</Label>
                      <Input
                        id="contamination-level"
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        placeholder="< 0.5 (safe range)"
                        value={contamination}
                        onChange={(e) => setContamination(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Safe Ranges:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• pH: 6.5 - 8.5</li>
                      <li>• Turbidity: Less than 5 NTU</li>
                      <li>• Contamination: Less than 0.5</li>
                    </ul>
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Water Test Results'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AshaDashboard;