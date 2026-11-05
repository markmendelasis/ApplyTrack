import { supabase, isSupabaseConfigured } from './supabaseClient';
import type {
  Application,
  CreateApplicationDTO,
  UpdateApplicationDTO,
  ApplicationFiltersState,
  DashboardStats,
} from '../types';
import { ACTIVE_STATUSES } from '../utils/constants';

/**
 * Service handling all database operations for Applications.
 * Keeps Supabase queries fully decoupled from UI components.
 */
export const applicationService = {
  /**
   * Retrieves all applications belonging to the user with optional filters and sorting.
   */
  async getApplications(
    userId: string,
    filters?: Partial<ApplicationFiltersState>
  ): Promise<Application[]> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please add your credentials to the .env file.');
    }

    let query = supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId);

    // Filter by status if specified and not 'All'
    if (filters?.status && filters.status !== 'All') {
      query = query.eq('status', filters.status);
    }

    // Filter by text search query (across company name and job position)
    if (filters?.searchQuery && filters.searchQuery.trim()) {
      const q = filters.searchQuery.trim();
      query = query.or(`company_name.ilike.%${q}%,job_position.ilike.%${q}%`);
    }

    // Sorting
    switch (filters?.sortBy) {
      case 'date_asc':
        query = query.order('application_date', { ascending: true });
        break;
      case 'company_asc':
        query = query.order('company_name', { ascending: true });
        break;
      case 'company_desc':
        query = query.order('company_name', { ascending: false });
        break;
      case 'date_desc':
      default:
        query = query.order('application_date', { ascending: false }).order('created_at', { ascending: false });
        break;
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching applications:', error);
      throw new Error(error.message || 'Failed to fetch applications.');
    }

    return (data as Application[]) || [];
  },

  /**
   * Retrieves the 5 most recent applications for the dashboard.
   */
  async getRecentApplications(userId: string, limit = 5): Promise<Application[]> {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .order('application_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent applications:', error);
      throw new Error(error.message || 'Failed to fetch recent applications.');
    }

    return (data as Application[]) || [];
  },

  /**
   * Computes key metrics for the dashboard summary cards.
   */
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    if (!isSupabaseConfigured()) {
      return { total: 0, active: 0, interviews: 0, offers: 0 };
    }

    const { data, error } = await supabase
      .from('applications')
      .select('status')
      .eq('user_id', userId);

    if (error) {
      console.error('Error calculating dashboard stats:', error);
      throw new Error(error.message || 'Failed to compute dashboard metrics.');
    }

    const applications = data || [];
    const total = applications.length;
    const active = applications.filter((app) => ACTIVE_STATUSES.includes(app.status as any)).length;
    const interviews = applications.filter((app) => app.status === 'Interview').length;
    const offers = applications.filter((app) => app.status === 'Offer').length;

    return { total, active, interviews, offers };
  },

  /**
   * Dedicated Core Feature: Case-insensitive search by company name.
   * Matches full or partial company names and returns all corresponding application records.
   */
  async searchByCompany(userId: string, companyQuery: string): Promise<Application[]> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please add your credentials to the .env file.');
    }

    const trimmed = companyQuery.trim();
    if (!trimmed) return [];

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .ilike('company_name', `%${trimmed}%`)
      .order('application_date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching companies:', error);
      throw new Error(error.message || 'Failed to search companies.');
    }

    return (data as Application[]) || [];
  },

  /**
   * Retrieves a single application by ID.
   */
  async getApplicationById(id: string): Promise<Application | null> {
    if (!isSupabaseConfigured()) return null;

    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching application ${id}:`, error);
      return null;
    }

    return data as Application;
  },

  /**
   * Creates a new application record.
   */
  async createApplication(userId: string, dto: CreateApplicationDTO): Promise<Application> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please add your credentials to the .env file.');
    }

    const payload = {
      user_id: userId,
      company_name: dto.company_name.trim(),
      job_position: dto.job_position.trim(),
      application_date: dto.application_date,
      status: dto.status,
      job_url: dto.job_url ? dto.job_url.trim() : null,
      notes: dto.notes ? dto.notes.trim() : null,
      created_by: userId,
      updated_by: userId,
    };

    const { data, error } = await supabase
      .from('applications')
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error('Error creating application:', error);
      throw new Error(error.message || 'Failed to create job application.');
    }

    return data as Application;
  },

  /**
   * Updates an existing application.
   */
  async updateApplication(id: string, dto: UpdateApplicationDTO): Promise<Application> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please add your credentials to the .env file.');
    }

    const payload: Record<string, any> = {};
    if (dto.company_name !== undefined) payload.company_name = dto.company_name.trim();
    if (dto.job_position !== undefined) payload.job_position = dto.job_position.trim();
    if (dto.application_date !== undefined) payload.application_date = dto.application_date;
    if (dto.status !== undefined) payload.status = dto.status;
    if (dto.job_url !== undefined) payload.job_url = dto.job_url ? dto.job_url.trim() : null;
    if (dto.notes !== undefined) payload.notes = dto.notes ? dto.notes.trim() : null;

    const { data, error } = await supabase
      .from('applications')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating application ${id}:`, error);
      throw new Error(error.message || 'Failed to update application.');
    }

    return data as Application;
  },

  /**
   * Deletes an application record.
   */
  async deleteApplication(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Please add your credentials to the .env file.');
    }

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting application ${id}:`, error);
      throw new Error(error.message || 'Failed to delete application.');
    }
  },
};
