/**
 * Home Page - Dashboard
 * Main dashboard with KPIs, charts, and analytics
 */

import { useState, useEffect } from 'react'
import { Container } from '../components/ui'
import {
  KPICard,
  JobsByStatusChart,
  RevenueTrendsChart,
  TopClientsChart,
  JobsByTypeChart,
  ShipsByPortChart,
  RecentActivity,
  InvoiceOverview,
  VesselSchedule,
  JobsPerMonthChart
} from '../components/dashboard'
import { useDashboardCache } from '../context/DashboardCacheContext'
import {
  TrendingUp,
  FileText,
  DollarSign,
  AlertCircle
} from 'lucide-react'

export default function Home() {
  const { cache, loading, fetchDashboardData } = useDashboardCache()

  useEffect(() => {
    // Cargar datos solo si el caché no es válido
    fetchDashboardData()
  }, [fetchDashboardData])

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-gray-400">
          Marine Operations Overview & Analytics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Jobs & Claims"
          value={cache?.stats?.totalRecords || 0}
          icon={FileText}
          color="blue"
          loading={loading}
          trend="up"
          trendValue={`${cache?.stats?.totalJobs || 0} jobs, ${cache?.stats?.totalClaims || 0} claims`}
        />
        <KPICard
          title="Total Invoice Amount"
          value={cache?.stats?.totalInvoiceAmount ? `$${cache.stats.totalInvoiceAmount.toLocaleString()}` : '$0'}
          icon={DollarSign}
          color="green"
          loading={loading}
        />
        <KPICard
          title="Pending Jobs"
          value={cache?.stats?.pendingJobs || 0}
          icon={AlertCircle}
          color="orange"
          loading={loading}
        />
        <KPICard
          title="Issued Invoices"
          value={cache?.stats?.issuedInvoices || 0}
          icon={TrendingUp}
          color="purple"
          loading={loading}
          trendValue={`${cache?.stats?.notIssuedInvoices || 0} not issued`}
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Jobs by Status */}
        <JobsByStatusChart data={cache?.jobsByStatus || []} loading={loading} />

        {/* Revenue Trends */}
        <RevenueTrendsChart data={cache?.revenueTrends || []} loading={loading} />

        {/* Top Clients */}
        <TopClientsChart data={cache?.topClients || []} loading={loading} sortBy="revenue" />

        {/* Jobs by Type */}
        <JobsByTypeChart data={cache?.jobsByType || []} loading={loading} />

        {/* Ships by Port */}
        <ShipsByPortChart data={cache?.shipsByPort || []} loading={loading} />

        {/* Invoice Overview */}
        <InvoiceOverview data={cache?.invoiceOverview || []} loading={loading} />
      </div>

      {/* Jobs Per Month - Full Width */}
      <div className="mb-8">
        <JobsPerMonthChart data={cache?.jobsPerMonth || []} loading={loading} />
      </div>

      {/* Vessel Schedule - Full Width */}
      <div className="mb-8">
        <VesselSchedule data={cache?.vesselSchedule || []} loading={loading} />
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <RecentActivity data={cache?.recentActivity || []} loading={loading} />
      </div>
    </Container>
  )
}
