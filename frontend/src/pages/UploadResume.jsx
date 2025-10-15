import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../state/AuthContext.jsx'
import { api } from '../utils/api.js'

export default function UploadResume() {
  const { token } = useAuth()
  const { id } = useParams()
  const [resumePdf, setResumePdf] = useState(null)
  const [email, setEmail] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!token) return
    setLoading(true)
    setMessage('')
    try {
      if (resumePdf) {
        const form = new FormData()
        form.append('resumePdf', resumePdf)
        form.append('email', email)
        // jobId can be taken from query per backend flexibility
        const res = await api.upload(`/api/resumes/upload?jobId=${id}`, form, token)
        setMessage(res.message || 'Uploaded')
      } else {
        const res = await api.post('/api/resumes/upload', { jobId: id, email, resumeText }, token)
        setMessage(res.message || 'Uploaded')
      }
    } catch (err) {
      setMessage('Upload failed')
    } finally {
      setLoading(false)
    }
  }

  if (!token) return <div className="muted">Login to upload resumes</div>

  return (
    <div className="card stack" style={{ maxWidth: 720, margin: '0 auto' }}>
      <h2>Upload Resume</h2>
      <form className="stack" onSubmit={submit}>
        <input className="input" placeholder="Candidate Email (fallback for name)" value={email} onChange={e=>setEmail(e.target.value)} />
        <div className="row">
          <input className="input" type="file" accept="application/pdf" onChange={e=>setResumePdf(e.target.files?.[0]||null)} />
          <span className="muted">Optional: Upload PDF or paste text below</span>
        </div>
        <textarea className="textarea" placeholder="Paste resume text (optional)" value={resumeText} onChange={e=>setResumeText(e.target.value)} />
        <button className="btn-primary" disabled={loading}>{loading?'Uploading…':'Upload'}</button>
        {message && <div className="muted">{message}</div>}
      </form>
    </div>
  )
}

