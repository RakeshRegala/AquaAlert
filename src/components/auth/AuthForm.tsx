import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, File, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<'community' | 'asha' | 'government'>('community');
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [uploadingDocs, setUploadingDocs] = useState(false);

  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    await signIn(email, password);
    setLoading(false);
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setDocuments(Array.from(files));
    }
  };

  const uploadDocuments = async (userId: string) => {
    if (documents.length === 0) return;

    setUploadingDocs(true);
    try {
      const uploadPromises = documents.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${file.name}`;

        const { error } = await supabase.storage
          .from('government-documents')
          .upload(fileName, file);

        if (error) throw error;
        return fileName;
      });

      await Promise.all(uploadPromises);
      
      toast({
        title: "Documents uploaded successfully",
        description: "Your verification documents have been uploaded.",
      });
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast({
        title: "Document upload failed",
        description: "There was an error uploading your documents.",
        variant: "destructive",
      });
    } finally {
      setUploadingDocs(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (role === 'government' && documents.length === 0) {
      toast({
        title: "Documents required",
        description: "Please upload your verification documents before creating your account.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    const { error } = await signUp(email, password, name, role, phoneNumber);
    
    if (!error && role === 'government') {
      // Get the current user after signup to upload documents
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await uploadDocuments(user.id);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-info/5 to-success/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Smart Community Health Monitor</CardTitle>
          <CardDescription>
            Monitor community health and water safety
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Choose a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {role === 'government' && (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="role">Your Role</Label>
                  <Select value={role} onValueChange={(value: 'community' | 'asha' | 'government') => setRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="community">Community Member</SelectItem>
                      <SelectItem value="asha">ASHA Worker</SelectItem>
                      <SelectItem value="government">Government Authority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {role === 'government' && (
                  <div className="space-y-4 p-4 border rounded-lg bg-info/5">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-info mt-0.5" />
                      <div>
                        <Label className="text-sm font-medium text-info">Document Verification Required</Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          Government authorities must upload verification documents during registration.
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="documents">Upload Verification Documents *</Label>
                      <Input
                        id="documents"
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleDocumentUpload}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Upload: Government ID, Authorization letter, Official certificate, etc.
                      </p>
                    </div>
                    
                    {documents.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Selected Documents:</Label>
                        <div className="space-y-1">
                          {documents.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <File className="h-4 w-4" />
                              <span>{file.name}</span>
                              <span className="text-muted-foreground">({(file.size / 1024 / 1024).toFixed(1)}MB)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <Button type="submit" className="w-full" disabled={loading || uploadingDocs}>
                  {loading ? 'Creating account...' : uploadingDocs ? 'Uploading documents...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;