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
import { dashboardAPI } from '../services/api'
import { 
  TrendingUp, 
  FileText, 
  DollarSign, 
  AlertCircle,
  Ship,
  Users,
  Anchor,
  Calendar
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [jobsByStatus, setJobsByStatus] = useState([])
  const [revenueTrends, setRevenueTrends] = useState([])
  const [topClients, setTopClients] = useState([])
  const [jobsByType, setJobsByType] = useState([])
  const [shipsByPort, setShipsByPort] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [invoiceOverview, setInvoiceOverview] = useState([])
  const [vesselSchedule, setVesselSchedule] = useState([])
  const [jobsPerMonth, setJobsPerMonth] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
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
        monthlyRes
      ] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getJobsByStatus(),
        dashboardAPI.getRevenueTrends(12),
        dashboardAPI.getTopClients(5, 'revenue'),
        dashboardAPI.getJobsByType(),
        dashboardAPI.getShipsByPort(),
        dashboardAPI.getRecentActivity(10),
        dashboardAPI.getInvoiceOverview(),
        dashboardAPI.getVesselSchedule(7),
        dashboardAPI.getJobsPerMonth(new Date().getFullYear())
      ])

      if (statsRes.success) {
        console.log('Dashboard Stats:', statsRes.data)
        setStats(statsRes.data)
      }
      if (statusRes.success) setJobsByStatus(statusRes.data)
      if (trendsRes.success) setRevenueTrends(trendsRes.data)
      if (clientsRes.success) setTopClients(clientsRes.data)
      if (typesRes.success) setJobsByType(typesRes.data)
      if (portsRes.success) setShipsByPort(portsRes.data)
      if (activityRes.success) setRecentActivity(activityRes.data)
      if (invoiceRes.success) setInvoiceOverview(invoiceRes.data)
      if (scheduleRes.success) setVesselSchedule(scheduleRes.data)
      if (monthlyRes.success) setJobsPerMonth(monthlyRes.data)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

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
          value={stats?.totalRecords || 0}
          icon={FileText}
          color="blue"
          loading={loading}
          trend="up"
          trendValue={`${stats?.totalJobs || 0} jobs, ${stats?.totalClaims || 0} claims`}
        />
        <KPICard
          title="Total Invoice Amount"
          value={stats?.totalInvoiceAmount ? `$${stats.totalInvoiceAmount.toLocaleString()}` : '$0'}
          icon={DollarSign}
          color="green"
          loading={loading}
        />
        <KPICard
          title="Pending Jobs"
          value={stats?.pendingJobs || 0}
          icon={AlertCircle}
          color="orange"
          loading={loading}
        />
        <KPICard
          title="Issued Invoices"
          value={stats?.issuedInvoices || 0}
          icon={TrendingUp}
          color="purple"
          loading={loading}
          trendValue={`${stats?.notIssuedInvoices || 0} not issued`}
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Jobs by Status */}
        <JobsByStatusChart data={jobsByStatus} loading={loading} />
        
        {/* Revenue Trends */}
        <RevenueTrendsChart data={revenueTrends} loading={loading} />
        
        {/* Top Clients */}
        <TopClientsChart data={topClients} loading={loading} sortBy="revenue" />
        
        {/* Jobs by Type */}
        <JobsByTypeChart data={jobsByType} loading={loading} />
        
        {/* Ships by Port */}
        <ShipsByPortChart data={shipsByPort} loading={loading} />
        
        {/* Invoice Overview */}
        <InvoiceOverview data={invoiceOverview} loading={loading} />
      </div>

      {/* Jobs Per Month - Full Width */}
      <div className="mb-8">
        <JobsPerMonthChart data={jobsPerMonth} loading={loading} />
      </div>

      {/* Vessel Schedule - Full Width */}
      <div className="mb-8">
        <VesselSchedule data={vesselSchedule} loading={loading} />
      </div>

      {/* Recent Activity */}
      <div className="mb-8">
        <RecentActivity data={recentActivity} loading={loading} />
      </div>
    </Container>
  )
}
