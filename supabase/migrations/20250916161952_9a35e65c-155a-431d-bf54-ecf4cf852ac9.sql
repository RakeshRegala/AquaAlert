-- Create enums for user roles and alert severity
CREATE TYPE public.user_role AS ENUM ('community', 'asha', 'government');
CREATE TYPE public.alert_severity AS ENUM ('low', 'medium', 'high');

-- Create profiles table (Supabase handles auth.users, so we create profiles for additional user data)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'community',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create health_reports table
CREATE TABLE public.health_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  symptoms TEXT,
  location TEXT,
  water_source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create water_readings table
CREATE TABLE public.water_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  ph FLOAT,
  turbidity FLOAT,
  contamination_level FLOAT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  triggered_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location TEXT NOT NULL,
  alert_message TEXT NOT NULL,
  severity alert_severity NOT NULL DEFAULT 'low',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.water_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for health_reports
CREATE POLICY "ASHA and Government can view all health reports" ON public.health_reports
  FOR SELECT USING (
    public.get_current_user_role() IN ('asha', 'government') OR auth.uid() = reporter_id
  );

CREATE POLICY "ASHA workers can create health reports" ON public.health_reports
  FOR INSERT WITH CHECK (
    public.get_current_user_role() = 'asha'
  );

CREATE POLICY "ASHA workers can update health reports" ON public.health_reports
  FOR UPDATE USING (
    public.get_current_user_role() = 'asha'
  );

-- RLS policies for water_readings
CREATE POLICY "ASHA and Government can view all water readings" ON public.water_readings
  FOR SELECT USING (
    public.get_current_user_role() IN ('asha', 'government') OR auth.uid() = reporter_id
  );

CREATE POLICY "ASHA workers can create water readings" ON public.water_readings
  FOR INSERT WITH CHECK (
    public.get_current_user_role() = 'asha'
  );

CREATE POLICY "ASHA workers can update water readings" ON public.water_readings
  FOR UPDATE USING (
    public.get_current_user_role() = 'asha'
  );

-- RLS policies for alerts
CREATE POLICY "Government and ASHA can view alerts" ON public.alerts
  FOR SELECT USING (
    public.get_current_user_role() IN ('asha', 'government')
  );

CREATE POLICY "System can create alerts" ON public.alerts
  FOR INSERT WITH CHECK (true);

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'community'::user_role)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();