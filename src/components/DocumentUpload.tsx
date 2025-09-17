import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, File, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const DocumentUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !user) return;

    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('government-documents')
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }

        return fileName;
      });

      const results = await Promise.all(uploadPromises);
      setUploadedFiles(prev => [...prev, ...results]);

      toast({
        title: "Documents uploaded successfully",
        description: `${files.length} document(s) uploaded for verification.`,
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getFileUrl = async (fileName: string) => {
    const { data } = supabase.storage
      .from('government-documents')
      .getPublicUrl(fileName);
    
    return data.publicUrl;
  };

  const downloadFile = async (fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('government-documents')
        .download(fileName);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName.split('/').pop() || 'document';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Download failed",
        description: "Could not download the file.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Document Verification
        </CardTitle>
        <CardDescription>
          Upload your government identification and authorization documents for verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="documents">Upload Documents</Label>
          <Input
            id="documents"
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <p className="text-sm text-muted-foreground">
            Accepted formats: PDF, JPG, PNG, DOC, DOCX. Maximum 10MB per file.
          </p>
        </div>

        {uploading && (
          <div className="flex items-center gap-2 text-info">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-info"></div>
            <span>Uploading documents...</span>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <Label>Uploaded Documents</Label>
            <div className="space-y-2">
              {uploadedFiles.map((fileName, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg bg-success/5"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <File className="h-4 w-4" />
                    <span className="text-sm">
                      {fileName.split('/').pop()}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile(fileName)}
                  >
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-info/10 p-4 rounded-lg">
          <h4 className="font-medium text-info mb-2">Required Documents:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Government-issued ID (Aadhaar, PAN, etc.)</li>
            <li>• Authorization letter from department</li>
            <li>• Official designation certificate</li>
            <li>• Any additional identification documents</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;