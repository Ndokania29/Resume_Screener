import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { api } from '../utils/api.js'

export default function Resumes() {
  const { token } = useAuth()
  const { id } = useParams()
  const [resumes, setResumes] = useState([])

  useEffect(() => {
    (async () => {
      if (!token) return
      const res = await api.get(`/api/resumes/job/${id}`, token)
      setResumes(res)
    })()
  }, [id, token])

  if (!token) return <div className="muted">Login to view resumes</div>

  const download = async (resumeId, candidateName) => {
    const blob = await api.downloadBlob(`/api/resumes/download/${resumeId}`, token)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${candidateName || 'resume'}.pdf`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <h2>Resumes</h2>
        <Link className="btn-primary" to={`/jobs/${id}/upload`}>Upload Resume</Link>
      </div>
      <div className="grid">
        {resumes.map(r => (
          <div key={r._id} className="card stack">
            <div className="row" style={{ justifyContent: 'space-between' }}>
              <h3>{r.candidateName}</h3>
              {typeof r.atsScore === 'number' && <div className="muted">ATS: {r.atsScore}</div>}
            </div>
            <div className="muted">{r.email} • {r.phone}</div>
            <p>{r.justification || 'No justification'}</p>
            {r.resumePdf && <button className="btn-outline" onClick={()=>download(r._id, r.candidateName)}>Download PDF</button>}
          </div>
        ))}
      </div>
    </div>
  )
}

