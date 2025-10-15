import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { api } from '../utils/api.js'

export default function JobDetails() {
  const { token } = useAuth()
  const { id } = useParams()
  const [job, setJob] = useState(null)

  useEffect(() => {
    (async () => {
      if (!token) return
      const res = await api.get(`/api/jobs/${id}`, token)
      setJob(res)
    })()
  }, [id, token])

  if (!token) return <div className="muted">Login to view job</div>
  if (!job) return <div className="muted">Loading…</div>

  return (
    <div className="stack">
      <div className="card stack">
        <h2>{job.title}</h2>
        <div className="muted">Skills: {job.skills?.join(', ')}</div>
        <p>{job.description}</p>
        <div className="row">
          <Link className="btn-primary" to={`/jobs/${job._id}/upload`}>Upload Resume</Link>
          <Link className="btn-outline" to={`/jobs/${job._id}/resumes`}>View Resumes</Link>
        </div>
      </div>
    </div>
  )
}

