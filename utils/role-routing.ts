export type DbRole = 'host' | 'provider' | 'traveler' | 'conciergerie';

export function getDashboardPath(role?: string | null) {
  switch ((role || '').toLowerCase()) {
    case 'conciergerie': 
    case 'concierge':     
      return '/conciergerie-dashboard/dashboard';
    case 'host':
      return '/vendor-dashboard/dashboard';
    case 'provider':
      return '/partenaire-dashboard/dashboard';
    case 'traveler':
      return '/traveler-dashboard/dashboard';
    default:
      return '/traveler-dashboard/dashboard'; // défaut 
  }
}
