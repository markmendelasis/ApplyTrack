-- ==============================================================================
-- ApplyTrack: Applications Schema & Row Level Security (RLS) Migration
-- ==============================================================================

-- 1. Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    job_position TEXT NOT NULL,
    application_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'Applied',
    job_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Constraints
    CONSTRAINT valid_status CHECK (
        status IN ('Applied', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn')
    ),
    CONSTRAINT company_name_not_empty CHECK (char_length(trim(company_name)) > 0),
    CONSTRAINT job_position_not_empty CHECK (char_length(trim(job_position)) > 0)
);

-- 2. Indexes for fast filtering, sorting, and case-insensitive search
CREATE INDEX IF NOT EXISTS idx_applications_user_id 
    ON public.applications(user_id);

CREATE INDEX IF NOT EXISTS idx_applications_user_date 
    ON public.applications(user_id, application_date DESC);

CREATE INDEX IF NOT EXISTS idx_applications_user_status 
    ON public.applications(user_id, status);

CREATE INDEX IF NOT EXISTS idx_applications_user_company_lower 
    ON public.applications(user_id, lower(company_name));

-- 3. Automatic updated_at and updated_by Trigger Function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    IF auth.uid() IS NOT NULL THEN
        NEW.updated_by = auth.uid();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_applications_updated_at ON public.applications;
CREATE TRIGGER trg_applications_updated_at
    BEFORE UPDATE ON public.applications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. Automatic created_by Trigger Function
CREATE OR REPLACE FUNCTION public.handle_created_by()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.created_by IS NULL AND auth.uid() IS NOT NULL THEN
        NEW.created_by = auth.uid();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_applications_created_by ON public.applications;
CREATE TRIGGER trg_applications_created_by
    BEFORE INSERT ON public.applications
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_created_by();

-- ==============================================================================
-- Row Level Security (RLS)
-- Enforces tenant isolation strictly at the PostgreSQL layer using auth.uid()
-- ==============================================================================

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 1. SELECT Policy
DROP POLICY IF EXISTS "Users can view their own applications" ON public.applications;
CREATE POLICY "Users can view their own applications"
    ON public.applications
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- 2. INSERT Policy
DROP POLICY IF EXISTS "Users can create their own applications" ON public.applications;
CREATE POLICY "Users can create their own applications"
    ON public.applications
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- 3. UPDATE Policy
DROP POLICY IF EXISTS "Users can update their own applications" ON public.applications;
CREATE POLICY "Users can update their own applications"
    ON public.applications
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. DELETE Policy
DROP POLICY IF EXISTS "Users can delete their own applications" ON public.applications;
CREATE POLICY "Users can delete their own applications"
    ON public.applications
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);
