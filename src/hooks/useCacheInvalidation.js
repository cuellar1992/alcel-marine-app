import { useCallback } from 'react';
import { useDashboardCache } from '../context/DashboardCacheContext';

/**
 * Hook para invalidar el caché del dashboard desde otras páginas
 * Usar después de crear, actualizar o eliminar jobs/claims
 */
export const useCacheInvalidation = () => {
  const { invalidateCache } = useDashboardCache();

  const invalidateAfterMutation = useCallback(() => {
    console.log('🔄 Cache invalidated after data mutation');
    invalidateCache();
  }, [invalidateCache]);

  return {
    invalidateCache: invalidateAfterMutation
  };
};
