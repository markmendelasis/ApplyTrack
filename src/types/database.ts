export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          job_position: string;
          application_date: string;
          status: 'Applied' | 'Assessment' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn';
          job_url: string | null;
          notes: string | null;
          created_at: string;
          created_by: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          job_position: string;
          application_date?: string;
          status?: 'Applied' | 'Assessment' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn';
          job_url?: string | null;
          notes?: string | null;
          created_at?: string;
          created_by?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string;
          job_position?: string;
          application_date?: string;
          status?: 'Applied' | 'Assessment' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn';
          job_url?: string | null;
          notes?: string | null;
          created_at?: string;
          created_by?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
      };
    };
  };
};
