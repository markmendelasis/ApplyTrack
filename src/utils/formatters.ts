/**
 * Formats a date string (YYYY-MM-DD or ISO) into a clean, human-readable format.
 * E.g., '2026-11-05' -> 'Nov 5, 2026'
 */
export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '—';
  try {
    const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
    if (!year || !month || !day) return dateString;
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
};

/**
 * Returns a relative time string (e.g., "Today", "Yesterday", "3 days ago")
 */
export const getRelativeDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('T')[0].split('-').map(Number);
    const target = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - target.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays === -1) return 'Tomorrow';
    if (diffDays > 1 && diffDays < 30) return `${diffDays} days ago`;
    if (diffDays >= 30 && diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
    return formatDate(dateString);
  } catch {
    return formatDate(dateString);
  }
};

/**
 * Ensures a valid web URL prefix (http/https) for job posting links.
 */
export const sanitizeUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};
