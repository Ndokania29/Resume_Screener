import { useNavigate, useLocation } from 'react-router-dom'

export default function Navigation({ className = "" }) {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { path: '/login', label: 'Dashboard', icon: '🏠' },
    { path: '/', label: 'Jobs', icon: '💼' },
  ]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {navItems.map(item => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === item.path
              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
          }`}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  )
}
