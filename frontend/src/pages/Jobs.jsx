import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { api } from '../utils/api.js'

export default function Jobs() {
  const { token, user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [skills, setSkills] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    if (!token) return
    try {
      const res = await api.get('/api/jobs', token)
      setJobs(res)
    } catch (err) {
      setError('Failed to load jobs')
    }
  }

  useEffect(() => { load() }, [token])

  const createJob = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const body = {
        title,
        description,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean)
      }
      await api.post('/api/jobs', body, token)
      setTitle('')
      setDescription('')
      setSkills('')
      await load()
    } catch (err) {
      setError('Failed to create job')
    } finally {
      setLoading(false)
    }
  }

  const deleteJob = async (id) => {
    try {
      await api.del('/api/jobs/' + id, token)
      await load()
    } catch (err) {
      setError('Failed to delete job')
    }
  }

  if (!token) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Smart Resume Screener
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Please login to manage jobs and screen resumes
        </p>
        <Link
          to="/login"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Jobs</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Manage job postings and screen candidates
        </p>
      </div>

      {/* Create Job Form */}
      <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create New Job</h3>
          <form onSubmit={createJob} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Frontend Engineer"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
                rows={4}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Job requirements and responsibilities..."
              />
            </div>

            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Required Skills
              </label>
              <input
                type="text"
                id="skills"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="React, Node.js, TypeScript (comma separated)"
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

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Creating...' : 'Create Job'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Your Jobs
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {jobs.length} total jobs
          </p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-800">
          {jobs.map(job => (
            <li key={job._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                    {job.title}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Skills: {job.skills?.join(', ')}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-500 line-clamp-2">
                    {job.description}
                  </p>
                </div>
                <div className="ml-6 flex items-center gap-4">
                  <Link
                    to={'/jobs/' + job._id + '/resumes'}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    View Resumes
                  </Link>
                  <Link
                    to={'/jobs/' + job._id + '/upload'}
                    className="inline-flex items-center px-3 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Upload Resume
                  </Link>
                  <button
                    onClick={() => deleteJob(job._id)}
                    className="inline-flex items-center p-2 border border-transparent rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
          {jobs.length === 0 && (
            <li className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
              No jobs found. Create your first job above.
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}