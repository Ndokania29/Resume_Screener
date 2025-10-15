import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { api } from '../utils/api.js'

// Dashboard Component that appears after login
function Dashboard({ user, onLogout }) {
  const { token } = useAuth()
  const [jobs, setJobs] = useState([])
  const [stats, setStats] = useState({ totalJobs: 0, totalResumes: 0, avgScore: 0, shortlisted: 0 })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    console.log('Dashboard useEffect triggered, token:', !!token)
    if (token) {
      loadDashboardData()
    }
  }, [token])

  // Also refresh when returning from other pages
  useEffect(() => {
    const handleFocus = () => {
      if (token && !loading) {
        console.log('Window focused, refreshing dashboard')
        loadDashboardData()
      }
    }
    
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [token, loading])

  const loadDashboardData = async () => {
    if (!token) {
      setLoading(false)
      return
    }
    
    try {
      console.log('Loading dashboard data...')
      const jobsData = await api.get('/api/jobs', token)
      console.log('Jobs loaded:', jobsData)
      setJobs(jobsData)
      
      // Calculate real stats from API data
      let totalResumes = 0
      let totalScore = 0
      let shortlisted = 0
      let resumesWithScores = 0
      
      for (const job of jobsData) {
        try {
          const resumesData = await api.get(`/api/resumes/job/${job._id}`, token)
          console.log(`Resumes for job ${job.title}:`, resumesData.length)
          totalResumes += resumesData.length
          resumesData.forEach(resume => {
            if (typeof resume.atsScore === 'number') {
              totalScore += resume.atsScore
              resumesWithScores++
              if (resume.atsScore >= 70) shortlisted++
            }
          })
        } catch (err) {
          // Job has no resumes yet - this is normal
          console.log('No resumes for job:', job.title)
        }
      }

      const newStats = {
        totalJobs: jobsData.length,
        totalResumes,
        avgScore: resumesWithScores > 0 ? Math.round(totalScore / resumesWithScores) : 0,
        shortlisted
      }
      
      console.log('Updated stats:', newStats)
      setStats(newStats)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Add refresh function
  const refreshDashboard = () => {
    setLoading(true)
    loadDashboardData()
  }

  const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{title}</p>
          <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1 sm:mt-2">{value}</p>
          {trend && (
            <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 mt-1 flex items-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {trend}
            </p>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-full ${color} ml-2`}>
          <span className="text-lg sm:text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  )

  const QuickActionCard = ({ title, description, icon, onClick, color }) => (
    <button
      onClick={onClick}
      className="w-full bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 text-left group"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color} group-hover:scale-110 transition-transform`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        </div>
      </div>
    </button>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 lg:hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Smart Resume Screener
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{user.name.charAt(0)}</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 hidden lg:flex flex-col`}>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'jobs', label: 'Jobs', icon: '💼' },
              { id: 'candidates', label: 'Candidates', icon: '👥' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
              { id: 'settings', label: 'Settings', icon: '⚙️' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}>
            <aside className="w-64 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
              <nav className="p-4 space-y-2">
                {[
                  { id: 'overview', label: 'Overview', icon: '📊' },
                  { id: 'jobs', label: 'Jobs', icon: '💼' },
                  { id: 'candidates', label: 'Candidates', icon: '👥' },
                  { id: 'analytics', label: 'Analytics', icon: '📈' },
                  { id: 'settings', label: 'Settings', icon: '⚙️' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user.name}!</h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">Here's what's happening with your recruitment process.</p>
                </div>
                <button
                  onClick={refreshDashboard}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>

              {/* Stats Grid - Now with real data */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <StatCard
                  title="Total Jobs"
                  value={stats.totalJobs}
                  icon="💼"
                  color="bg-blue-100 dark:bg-blue-900/50"
                />
                <StatCard
                  title="Applications"
                  value={stats.totalResumes}
                  icon="📄"
                  color="bg-green-100 dark:bg-green-900/50"
                />
                <StatCard
                  title="Avg ATS Score"
                  value={stats.avgScore}
                  icon="🎯"
                  color="bg-purple-100 dark:bg-purple-900/50"
                />
                <StatCard
                  title="Shortlisted"
                  value={stats.shortlisted}
                  icon="⭐"
                  color="bg-orange-100 dark:bg-orange-900/50"
                />
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Link to="/" className="block">
                    <QuickActionCard
                      title="Manage Jobs"
                      description="Create and manage job postings"
                      icon="➕"
                      color="bg-indigo-100 dark:bg-indigo-900/50"
                    />
                  </Link>
                  <QuickActionCard
                    title="Review Applications"
                    description="Check new candidate applications and ATS scores"
                    icon="👀"
                    color="bg-green-100 dark:bg-green-900/50"
                    onClick={() => setActiveTab('candidates')}
                  />
                  <QuickActionCard
                    title="Refresh Data"
                    description="Update dashboard with latest statistics"
                    icon="🔄"
                    color="bg-purple-100 dark:bg-purple-900/50"
                    onClick={refreshDashboard}
                  />
                </div>
              </div>

              {/* Recent Jobs */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Jobs</h3>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  {jobs.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-gray-400 text-4xl mb-4">💼</div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No jobs yet</h4>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first job posting to get started</p>
                      <Link
                        to="/"
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                      >
                        Create Job
                      </Link>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Job Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Skills</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {jobs.slice(0, 5).map(job => (
                            <tr key={job._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{job.title}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500 dark:text-gray-400">{job.skills?.join(', ')}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <Link
                                  to={'/jobs/' + job._id + '/resumes'}
                                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                >
                                  View Resumes
                                </Link>
                                <Link
                                  to={'/jobs/' + job._id + '/upload'}
                                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                >
                                  Upload Resume
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Job Management</h2>
                <Link
                  to="/"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Manage Jobs
                </Link>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Manage your job postings and track applications.</p>
            </div>
          )}

          {activeTab === 'candidates' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Candidate Management</h2>
              <p className="text-gray-600 dark:text-gray-400">Review and manage candidate applications.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map(job => (
                  <Link
                    key={job._id}
                    to={`/jobs/${job._id}/resumes`}
                    className="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View candidates for this position</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics & Reports</h2>
              <p className="text-gray-600 dark:text-gray-400">View detailed analytics and recruitment metrics.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Conversion Rate</h3>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {stats.totalResumes > 0 ? Math.round((stats.shortlisted / stats.totalResumes) * 100) : 0}%
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Applications to shortlist</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Applications per Job</h3>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.totalJobs > 0 ? Math.round(stats.totalResumes / stats.totalJobs) : 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Average applications</p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Quality Score</h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.avgScore}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Average ATS score</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
              <p className="text-gray-600 dark:text-gray-400">Manage your account and application settings.</p>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Account Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Name:</span>
                    <p className="text-gray-900 dark:text-white">{user.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</span>
                    <p className="text-gray-900 dark:text-white">{user.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Role:</span>
                    <p className="text-gray-900 dark:text-white">{user.role}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Company ID:</span>
                    <p className="text-gray-900 dark:text-white">{user.companyId}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </main>
      </div>
    </div>
  )
}

// Main Login Component
export default function Login() {
  const { login, user, logout } = useAuth()
  const [email, setEmail] = useState('hr@example.com')
  const [password, setPassword] = useState('123456')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDashboard, setShowDashboard] = useState(false)

  useEffect(() => {
    if (user) {
      setShowDashboard(true)
    }
  }, [user])

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      // Dashboard will show automatically due to useEffect
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    setShowDashboard(false)
  }

  // Show dashboard if user is logged in
  if (showDashboard && user) {
    return <Dashboard user={user} onLogout={handleLogout} />
  }

  // Show login form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo & Title */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Smart Resume Screener
          </h1>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
            AI-powered resume screening and candidate matching
          </p>
        </div>

        {/* Login Form */}
        <div className="mt-8 bg-white dark:bg-gray-800 py-8 px-10 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700 backdrop-blur-lg backdrop-filter">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800">
            <div className="text-sm text-indigo-900 dark:text-indigo-200">
              <div className="font-semibold mb-1">👋 Try the demo account:</div>
              <div className="font-mono bg-white/50 dark:bg-black/20 p-2 rounded">
                <div>Email: hr@example.com</div>
                <div>Password: 123456</div>
              </div>
            </div>
          </div>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg text-center">
            <div className="text-xl mb-2">🎯</div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Smart Matching</h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">AI-powered resume to job matching</p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg text-center">
            <div className="text-xl mb-2">📊</div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">ATS Scoring</h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Automated candidate scoring</p>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg text-center">
            <div className="text-xl mb-2">🔒</div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">Secure</h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Multi-tenant data isolation</p>
          </div>
        </div>
      </div>
    </div>
  )
}