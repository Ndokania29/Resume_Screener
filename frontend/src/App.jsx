import { Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from './state/AuthContext.jsx'
import FloatingNav from './components/FloatingNav.jsx'

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const isActive = path => location.pathname === path

  // If we're on the login or signup page, don't show the layout
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return <Outlet />
  }

  // If user is not logged in and trying to access protected routes, redirect to login
  if (!user && location.pathname !== '/login' && location.pathname !== '/signup') {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Smart Resume Screener
              </h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {user && (
                <>
                  <Link
                    to="/login"
                    className={'px-3 py-2 rounded-lg text-sm font-medium transition-colors ' +
                      (location.pathname === '/login'
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800')
                    }
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/"
                    className={'px-3 py-2 rounded-lg text-sm font-medium transition-colors ' +
                      (isActive('/')
                        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800')
                    }
                  >
                    Jobs
                  </Link>
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-2 rounded-lg text-sm font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                      {user.name} ({user.role})
                    </span>
                    <button
                      onClick={logout}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white/50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Smart Resume Screener. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Floating Navigation */}
      <FloatingNav />
    </div>
  )
}

export default App