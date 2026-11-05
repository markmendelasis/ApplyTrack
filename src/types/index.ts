export type ApplicationStatus =
  | 'Applied'
  | 'Assessment'
  | 'Interview'
  | 'Offer'
  | 'Rejected'
  | 'Withdrawn';

export interface Application {
  id: string;
  user_id: string;
  company_name: string;
  job_position: string;
  application_date: string; // ISO date string YYYY-MM-DD
  status: ApplicationStatus;
  job_url?: string | null;
  notes?: string | null;
  created_at: string;
  created_by?: string | null;
  updated_at: string;
  updated_by?: string | null;
}

export interface CreateApplicationDTO {
  company_name: string;
  job_position: string;
  application_date: string;
  status: ApplicationStatus;
  job_url?: string | null;
  notes?: string | null;
}

export interface UpdateApplicationDTO {
  company_name?: string;
  job_position?: string;
  application_date?: string;
  status?: ApplicationStatus;
  job_url?: string | null;
  notes?: string | null;
}

export type SortOption = 'date_desc' | 'date_asc' | 'company_asc' | 'company_desc';

export interface ApplicationFiltersState {
  status: ApplicationStatus | 'All';
  searchQuery: string;
  sortBy: SortOption;
}

export interface DashboardStats {
  total: number;
  active: number;
  interviews: number;
  offers: number;
}

export interface CompanyApplicationGroup {
  company_name: string;
  total_applications: number;
  latest_application_date: string;
  latest_status: ApplicationStatus;
  applications: Application[];
}
