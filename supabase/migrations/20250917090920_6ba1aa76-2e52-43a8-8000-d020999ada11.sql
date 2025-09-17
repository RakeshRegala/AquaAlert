-- Add phone number to profiles table
ALTER TABLE public.profiles 
ADD COLUMN phone_number text;

-- Create storage bucket for government document verification
INSERT INTO storage.buckets (id, name, public) 
VALUES ('government-documents', 'government-documents', false);

-- Create storage policies for government document uploads
CREATE POLICY "Government users can upload their own documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'government-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'government'
  )
);

CREATE POLICY "Government users can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'government-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'government'
  )
);

CREATE POLICY "Government users can update their own documents" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'government-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'government'
  )
);

CREATE POLICY "Government users can delete their own documents" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'government-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'government'
  )
);