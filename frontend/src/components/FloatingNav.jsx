import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function FloatingNav() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Don't show on login/signup pages
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null
  }

  const quickActions = [
    { icon: '🏠', label: 'Dashboard', path: '/login' },
    { icon: '💼', label: 'Jobs', path: '/' },
    { icon: '➕', label: 'New Job', action: () => navigate('/') },
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Quick Actions Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 min-w-[160px]">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                if (action.path) navigate(action.path)
                if (action.action) action.action()
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="text-lg">{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center"
      >
        <svg 
          className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-45' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  )
}
