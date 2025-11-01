import { createContext, useContext, useState, useCallback } from 'react';
import { dashboardAPI } from '../services/api';
import toast from 'react-hot-toast';

const DashboardCacheContext = createContext(null);

export const useDashboardCache = () => {
  const context = useContext(DashboardCacheContext);
  if (!context) {
    throw new Error('useDashboardCache must be used within DashboardCacheProvider');
  }
  return context;
};

export const DashboardCacheProvider = ({ children }) => {
  const [cache, setCache] = useState({
    data: null,
    timestamp: null,
    loading: false
  });

  // Cache duration: 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000;

  const isCacheValid = useCallback(() => {
    if (!cache.data || !cache.timestamp) return false;
    const now = Date.now();
    return (now - cache.timestamp) < CACHE_DURATION;
  }, [cache.timestamp, cache.data]);

  const fetchDashboardData = useCallback(async (forceRefresh = false) => {
    // Si el caché es válido y no es refresh forzado, retornar caché
    if (!forceRefresh && isCacheValid()) {
      return { success: true, data: cache.data, fromCache: true };
    }

    setCache(prev => ({ ...prev, loading: true }));

    try {
      // Fetch all dashboard data in parallel
      const [
        statsRes,
        statusRes,
        trendsRes,
        clientsRes,
        typesRes,
        portsRes,
        activityRes,
        invoiceRes,
        scheduleRes,
        monthlyRes,
        groupedRes
      ] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getJobsByStatus(),
        dashboardAPI.getRevenueTrends(12),
        dashboardAPI.getTopClients(5, 'revenue'),
        dashboardAPI.getJobsByType(),
        dashboardAPI.getShipsByPort(),
        dashboardAPI.getRecentActivity(10),
        dashboardAPI.getInvoiceOverview(),
        dashboardAPI.getVesselSchedule(14),
        dashboardAPI.getJobsPerMonth(new Date().getFullYear()),
        dashboardAPI.getJobsByMonthGrouped(new Date().getFullYear())
      ]);

      const dashboardData = {
        stats: statsRes.success ? statsRes.data : null,
        jobsByStatus: statusRes.success ? statusRes.data : [],
        revenueTrends: trendsRes.success ? trendsRes.data : [],
        topClients: clientsRes.success ? clientsRes.data : [],
        jobsByType: typesRes.success ? typesRes.data : [],
        shipsByPort: portsRes.success ? portsRes.data : [],
        recentActivity: activityRes.success ? activityRes.data : [],
        invoiceOverview: invoiceRes.success ? invoiceRes.data : [],
        vesselSchedule: scheduleRes.success ? scheduleRes.data : [],
        jobsPerMonth: monthlyRes.success ? monthlyRes.data : [],
        jobsByMonthGrouped: groupedRes.success ? groupedRes.data : []
      }

      setCache({
        data: dashboardData,
        timestamp: Date.now(),
        loading: false
      });

      return { success: true, data: dashboardData, fromCache: false };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setCache(prev => ({ ...prev, loading: false }));
      return { success: false, error };
    }
  }, [cache.data, cache.timestamp, isCacheValid]);

  const invalidateCache = useCallback(() => {
    console.log('🗑️ Cache invalidated');
    setCache({
      data: null,
      timestamp: null,
      loading: false
    });
  }, []);

  const refreshDashboard = useCallback(() => {
    return fetchDashboardData(true);
  }, [fetchDashboardData]);

  const value = {
    cache: cache.data,
    loading: cache.loading,
    timestamp: cache.timestamp,
    isCacheValid: isCacheValid(),
    fetchDashboardData,
    invalidateCache,
    refreshDashboard
  };

  return (
    <DashboardCacheContext.Provider value={value}>
      {children}
    </DashboardCacheContext.Provider>
  );
};
