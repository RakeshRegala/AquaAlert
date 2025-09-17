import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, AlertCircle, BadgeCheck, Users, ShieldCheck } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<'community' | 'asha' | 'government' | null>(null);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

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
    if (!role) {
      toast({
        title: 'Please select your role.',
        description: 'Choose ASHA Worker, Government Authority, or Community/Public.',
        variant: 'destructive',
      });
      return;
    }
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-600/30 via-teal-500/20 to-purple-700/30">
      <Card className="w-full max-w-2xl backdrop-blur-xl bg-white/10 border-white/20 shadow-[0_10px_40px_rgba(0,0,0,0.25)] rounded-2xl animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight">Smart Community Health Monitor</CardTitle>
          <CardDescription>Monitor community health and water safety</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-md">
              <TabsTrigger value="signin" className="data-[state=active]:bg-white/20 data-[state=active]:text-foreground">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-white/20 data-[state=active]:text-foreground">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 placeholder:text-foreground/60 focus:ring-2 focus:ring-cyan-300/60 focus-visible:ring-2 focus-visible:ring-cyan-300/60"
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
                    className="bg-white/10 border-white/20 placeholder:text-foreground/60 focus:ring-2 focus:ring-cyan-300/60 focus-visible:ring-2 focus-visible:ring-cyan-300/60"
                  />
                </div>
                <Button type="submit" className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 text-white hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/30 transition-transform disabled:opacity-60" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-6">
                {/* Role Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    type="button"
                    role="button"
                    aria-pressed={role === 'asha'}
                    tabIndex={0}
                    onClick={() => setRole('asha')}
                    className={`group flex flex-col items-center justify-center gap-2 rounded-xl border p-4 bg-white/5 backdrop-blur-md transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${role === 'asha' ? 'border-cyan-300/70 shadow-[0_0_0_2px_rgba(34,211,238,0.5)]' : 'border-white/20'}`}
                  >
                    <BadgeCheck className={`h-6 w-6 ${role === 'asha' ? 'text-cyan-600' : 'text-foreground/80'}`} />
                    <span>ASHA Worker</span>
                  </button>
                  <button
                    type="button"
                    role="button"
                    aria-pressed={role === 'government'}
                    tabIndex={0}
                    onClick={() => setRole('government')}
                    className={`group flex flex-col items-center justify-center gap-2 rounded-xl border p-4 bg-white/5 backdrop-blur-md transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${role === 'government' ? 'border-cyan-300/70 shadow-[0_0_0_2px_rgba(34,211,238,0.5)]' : 'border-white/20'}`}
                  >
                    <ShieldCheck className={`h-6 w-6 ${role === 'government' ? 'text-cyan-600' : 'text-foreground/80'}`} />
                    <span>Government Authority</span>
                  </button>
                  <button
                    type="button"
                    role="button"
                    aria-pressed={role === 'community'}
                    tabIndex={0}
                    onClick={() => setRole('community')}
                    className={`group flex flex-col items-center justify-center gap-2 rounded-xl border p-4 bg-white/5 backdrop-blur-md transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 ${role === 'community' ? 'border-cyan-300/70 shadow-[0_0_0_2px_rgba(34,211,238,0.5)]' : 'border-white/20'}`}
                  >
                    <Users className={`h-6 w-6 ${role === 'community' ? 'text-cyan-600' : 'text-foreground/80'}`} />
                    <span>Community/Public</span>
                  </button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  className="bg-white/10 border-white/20 placeholder:text-foreground/60 focus:ring-2 focus:ring-cyan-300/60 focus-visible:ring-2 focus-visible:ring-cyan-300/60" />
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
                  className="bg-white/10 border-white/20 placeholder:text-foreground/60 focus:ring-2 focus:ring-cyan-300/60 focus-visible:ring-2 focus-visible:ring-cyan-300/60" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="bg-white/10 border-white/20 placeholder:text-foreground/60 focus:ring-2 focus:ring-cyan-300/60 focus-visible:ring-2 focus-visible:ring-cyan-300/60"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      if (!phoneNumber) {
                        toast({ title: 'Enter phone', description: 'Please provide a valid phone number.', variant: 'destructive' });
                        return;
                      }
                      setOtpSent(true);
                      toast({ title: 'OTP sent', description: 'We have sent an OTP to your phone.' });
                    }}
                    className="rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 text-white hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/30 transition-transform disabled:opacity-60"
                  >
                    Send OTP
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Enter OTP</Label>
                  <InputOTP maxLength={6} value={otp} onChange={setOtp} className="justify-start">
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="bg-white/10 border-white/20 focus:ring-2 focus:ring-cyan-300/60" />
                      <InputOTPSlot index={1} className="bg-white/10 border-white/20 focus:ring-2 focus:ring-cyan-300/60" />
                      <InputOTPSlot index={2} className="bg-white/10 border-white/20 focus:ring-2 focus:ring-cyan-300/60" />
                      <InputOTPSlot index={3} className="bg-white/10 border-white/20 focus:ring-2 focus:ring-cyan-300/60" />
                      <InputOTPSlot index={4} className="bg-white/10 border-white/20 focus:ring-2 focus:ring-cyan-300/60 hidden sm:inline-flex" />
                      <InputOTPSlot index={5} className="bg-white/10 border-white/20 focus:ring-2 focus:ring-cyan-300/60 hidden sm:inline-flex" />
                    </InputOTPGroup>
                  </InputOTP>
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
                    className="bg-white/10 border-white/20 placeholder:text-foreground/60 focus:ring-2 focus:ring-cyan-300/60 focus-visible:ring-2 focus-visible:ring-cyan-300/60"
                  />
                </div>
                
                {role === 'government' && (
                  <div className="space-y-4 p-4 border rounded-xl bg-white/5 border-white/20">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-cyan-600 mt-0.5" />
                      <div>
                        <Label className="text-sm font-medium">Document Verification Required</Label>
                        <p className="text-sm text-foreground/70 mt-1">
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
                        className="bg-white/10 border-white/20 file:bg-white/10 file:text-foreground"
                      />
                      <p className="text-xs text-foreground/70">
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
                              <span className="text-foreground/70">({(file.size / 1024 / 1024).toFixed(1)}MB)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <Button type="submit" className="w-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 text-white hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/30 transition-transform disabled:opacity-60" disabled={loading || uploadingDocs}>
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