import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { api } from '../utils/api.js'

export default function UploadResume() {
  const { token } = useAuth()
  const { id } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [resumePdf, setResumePdf] = useState(null)
  const [candidateName, setCandidateName] = useState('')
  const [email, setEmail] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  // Load job details for breadcrumb
  useEffect(() => {
    if (token && id) {
      loadJobDetails()
    }
  }, [token, id])

  const loadJobDetails = async () => {
    try {
      const jobData = await api.get(`/api/jobs/${id}`, token)
      setJob(jobData)
    } catch (err) {
      console.error('Failed to load job details:', err)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!token) return
    setLoading(true)
    setError('')
    setResult(null)
    
    try {
      if (resumePdf) {
        const form = new FormData()
        form.append('resumePdf', resumePdf)
        if (candidateName) form.append('candidateName', candidateName)
        if (email) form.append('email', email)
        
        const res = await api.upload(`/api/resumes/upload?jobId=${id}`, form, token)
        setResult(res.resume)
      } else if (resumeText) {
        const res = await api.post('/api/resumes/upload', { 
          jobId: id, 
          candidateName: candidateName || 'Unknown Candidate',
          email, 
          resumeText 
        }, token)
        setResult(res.resume)
      } else {
        setError('Please upload a PDF or paste resume text')
        return
      }
    } catch (err) {
      setError('Upload failed: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const viewAllResumes = () => {
    navigate(`/jobs/${id}/resumes`)
  }

  if (!token) return <div className="text-center py-12 text-gray-500">Login to upload resumes</div>

  return (
    <div className="max-w-4xl mx-auto space-y-8">
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
        <Link to={`/jobs/${id}/resumes`} className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1">
          <span>👥</span> {job?.title || 'Job'} Candidates
        </Link>
        <span>›</span>
        <span className="text-gray-900 dark:text-white font-medium">Upload Resume</span>
      </nav>

      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Upload Resume</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Upload a candidate's resume for <strong>{job?.title}</strong> and get instant ATS scoring
        </p>
      </div>

      {/* Upload Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <form onSubmit={submit} className="space-y-6">
          {/* Candidate Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="candidateName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Candidate Name
              </label>
              <input
                id="candidateName"
                type="text"
                value={candidateName}
                onChange={e => setCandidateName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="John Doe (optional - will be extracted from resume)"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="john@example.com (optional)"
              />
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Resume (PDF)
            </label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
              <input
                type="file"
                accept="application/pdf"
                onChange={e => setResumePdf(e.target.files?.[0] || null)}
                className="hidden"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload" className="cursor-pointer">
                <div className="text-gray-400 mb-2">
                  <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {resumePdf ? resumePdf.name : 'Click to upload PDF or drag and drop'}
                </p>
              </label>
            </div>
          </div>

          {/* OR Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">OR</span>
            </div>
          </div>

          {/* Text Input */}
          <div>
            <label htmlFor="resumeText" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Paste Resume Text
            </label>
            <textarea
              id="resumeText"
              value={resumeText}
              onChange={e => setResumeText(e.target.value)}
              rows={8}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Paste the candidate's resume text here..."
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/50 p-4">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Processing & Scoring...' : 'Upload & Score Resume'}
            </button>
            <button
              type="button"
              onClick={viewAllResumes}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              View All Resumes
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Resume Analysis Complete!</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Candidate Info */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Candidate Information</h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Name:</span>
                  <p className="text-gray-900 dark:text-white">{result.candidateName}</p>
                </div>
                {result.email && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email:</span>
                    <p className="text-gray-900 dark:text-white">{result.email}</p>
                  </div>
                )}
                {result.phone && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone:</span>
                    <p className="text-gray-900 dark:text-white">{result.phone}</p>
                  </div>
                )}
                {result.skills && result.skills.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Skills:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {result.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ATS Score & Analysis */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">ATS Analysis</h4>
              <div className="space-y-4">
                {/* Score */}
                <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
                  <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                    {result.atsScore || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">ATS Score (out of 100)</div>
                  <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                    (result.atsScore || 0) >= 70 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                      : (result.atsScore || 0) >= 50
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
                  }`}>
                    {(result.atsScore || 0) >= 70 ? 'Strong Match' : (result.atsScore || 0) >= 50 ? 'Moderate Match' : 'Weak Match'}
                  </div>
                </div>

                {/* Justification */}
                {result.justification && (
                  <div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">AI Analysis:</span>
                    <p className="text-gray-900 dark:text-white mt-1 text-sm leading-relaxed">
                      {result.justification}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={viewAllResumes}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              View All Candidates
            </button>
            <button
              onClick={() => setResult(null)}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Upload Another
            </button>
          </div>
        </div>
      )}
    </div>
  )
}