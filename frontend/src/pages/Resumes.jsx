import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { api } from '../utils/api.js'

export default function Resumes() {
  const { token } = useAuth()
  const { id } = useParams()
  const [resumes, setResumes] = useState([])
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, shortlisted, rejected

  useEffect(() => {
    loadData()
  }, [id, token])

  const loadData = async () => {
    if (!token) return
    try {
      // Load job details and resumes
      const [jobRes, resumesRes] = await Promise.all([
        api.get(`/api/jobs/${id}`, token),
        api.get(`/api/resumes/job/${id}`, token)
      ])
      setJob(jobRes)
      setResumes(resumesRes)
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  const download = async (resumeId, candidateName) => {
    try {
      const blob = await api.downloadBlob(`/api/resumes/download/${resumeId}`, token)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${candidateName || 'resume'}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-200'
    if (score >= 50) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-200'
    return 'text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-200'
  }

  const getScoreLabel = (score) => {
    if (score >= 70) return 'Strong Match'
    if (score >= 50) return 'Moderate Match'
    return 'Weak Match'
  }

  const filteredResumes = resumes.filter(resume => {
    if (filter === 'shortlisted') return (resume.atsScore || 0) >= 70
    if (filter === 'rejected') return (resume.atsScore || 0) < 50
    return true
  })

  if (!token) return <div className="text-center py-12 text-gray-500">Login to view resumes</div>

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
        <Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1">
          <span>🏠</span> Dashboard
        </Link>
        <span>›</span>
        <Link to="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1">
          <span>💼</span> Jobs
        </Link>
        <span>›</span>
        <span className="text-gray-900 dark:text-white font-medium flex items-center gap-1">
          <span>👥</span> {job?.title || 'Job'} Candidates
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Candidates for {job?.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {resumes.length} total applications • {resumes.filter(r => (r.atsScore || 0) >= 70).length} shortlisted
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/jobs/${id}/upload`}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Upload Resume
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'All Candidates', count: resumes.length },
          { key: 'shortlisted', label: 'Shortlisted', count: resumes.filter(r => (r.atsScore || 0) >= 70).length },
          { key: 'rejected', label: 'Needs Review', count: resumes.filter(r => (r.atsScore || 0) < 50).length }
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === item.key
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            {item.label} ({item.count})
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {resumes.length > 0 ? Math.round(resumes.reduce((sum, r) => sum + (r.atsScore || 0), 0) / resumes.length) : 0}
              </p>
            </div>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
              <span className="text-xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Shortlisted</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {resumes.filter(r => (r.atsScore || 0) >= 70).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full">
              <span className="text-xl">⭐</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Top Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {resumes.length > 0 ? Math.max(...resumes.map(r => r.atsScore || 0)) : 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full">
              <span className="text-xl">🏆</span>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredResumes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-4xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No candidates found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {filter === 'all' ? 'No resumes have been uploaded yet.' : `No candidates match the ${filter} criteria.`}
            </p>
            <Link
              to={`/jobs/${id}/upload`}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Upload First Resume
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredResumes.map(resume => (
              <div key={resume._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {resume.candidateName}
                      </h3>
                      {typeof resume.atsScore === 'number' && (
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(resume.atsScore)}`}>
                            {resume.atsScore}/100
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(resume.atsScore)}`}>
                            {getScoreLabel(resume.atsScore)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        {resume.email && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            📧 {resume.email}
                          </p>
                        )}
                        {resume.phone && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            📞 {resume.phone}
                          </p>
                        )}
                        {resume.experience > 0 && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            💼 {resume.experience} years experience
                          </p>
                        )}
                      </div>
                      
                      {resume.skills && resume.skills.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {resume.skills.slice(0, 5).map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                            {resume.skills.length > 5 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded">
                                +{resume.skills.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {resume.justification && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Analysis:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {resume.justification}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      {resume.resumePdf && (
                        <button
                          onClick={() => download(resume._id, resume.candidateName)}
                          className="px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                        >
                          Download PDF
                        </button>
                      )}
                      <span className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        Uploaded {new Date(resume.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}