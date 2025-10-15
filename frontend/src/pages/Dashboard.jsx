import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../state/AuthContext.jsx'
import { api } from '../utils/api.js'

// Simple in-file chart using inline SVG for zero-dep preview
function MiniBar({ values = [] }) {
  const max = Math.max(1, ...values)
  const path = values.map((v, i) => {
    const x = (i / (values.length - 1)) * 100
    const y = 100 - (v / max) * 100
    return `${x},${y}`
  }).join(' ')
  return (
    <svg viewBox="0 0 100 100" className="w-full h-24">
      <polyline fill="none" stroke="currentColor" strokeWidth="3" points={path} className="text-brand-600" />
    </svg>
  )
}

export default function Dashboard() {
  const { token } = useAuth()
  const [jobs, setJobs] = useState([])
  const [resumes, setResumes] = useState(0)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    (async () => {
      if (!token) return
      const list = await api.get('/api/jobs', token)
      setJobs(list)
      setResumes(list.length * 3) // mock count visual
    })()
  }, [token])

  const filtered = useMemo(() => jobs.filter(j => j.title.toLowerCase().includes(query.toLowerCase())), [jobs, query])

  return (
    <div className="grid lg:grid-cols-[260px_1fr] min-h-[calc(100vh-120px)] gap-4">
      {/* Sidebar */}
      <aside className="glass-card p-4 hidden lg:block">
        <div className="font-semibold text-slate-700 dark:text-slate-200 mb-3">Menu</div>
        <nav className="space-y-2 text-sm">
          <button className="btn-outline w-full">Overview</button>
          <button className="btn-outline w-full">Jobs</button>
          <button className="btn-outline w-full">Resumes</button>
          <button className="btn-outline w-full">Settings</button>
        </nav>
      </aside>

      {/* Main */}
      <section className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-2xl font-semibold">Dashboard</h2>
          <div className="flex gap-2">
            <input className="input" placeholder="Search jobs…" value={query} onChange={e=>setQuery(e.target.value)} />
            <button className="btn-primary" onClick={()=>setOpen(true)}>New Announcement</button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <div className="text-sm text-slate-500">Jobs</div>
            <div className="text-3xl font-semibold">{jobs.length}</div>
            <MiniBar values={[2,4,5,7,6,8]} />
          </div>
          <div className="glass-card p-4">
            <div className="text-sm text-slate-500">Resumes</div>
            <div className="text-3xl font-semibold">{resumes}</div>
            <MiniBar values={[1,3,2,6,4,9]} />
          </div>
          <div className="glass-card p-4">
            <div className="text-sm text-slate-500">Avg ATS</div>
            <div className="text-3xl font-semibold">72</div>
            <MiniBar values={[6,7,7,8,7,9]} />
          </div>
          <div className="glass-card p-4">
            <div className="text-sm text-slate-500">Shortlisted</div>
            <div className="text-3xl font-semibold">15</div>
            <MiniBar values={[0,1,2,3,4,5]} />
          </div>
        </div>

        {/* Table */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Jobs</h3>
            <div className="text-sm text-slate-500">{filtered.length} results</div>
          </div>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="py-2 pr-4">Title</th>
                  <th className="py-2 pr-4">Skills</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(j => (
                  <tr key={j._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="py-3 pr-4 font-medium">{j.title}</td>
                    <td className="py-3 pr-4 text-slate-600">{j.skills?.join(', ')}</td>
                    <td className="py-3 pr-4">
                      <div className="flex gap-2">
                        <a className="btn-outline" href={`#/jobs/${j._id}`}>Open</a>
                        <a className="btn-outline" href={`#/jobs/${j._id}/resumes`}>Resumes</a>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td className="py-6 text-slate-500" colSpan={3}>No results</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm grid place-items-center p-4">
            <div className="glass-card w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Announcement</h3>
                <button className="btn-outline" onClick={()=>setOpen(false)}>Close</button>
              </div>
              <textarea className="textarea" placeholder="Write an announcement..." />
              <div className="mt-3 flex justify-end gap-2">
                <button className="btn-outline" onClick={()=>setOpen(false)}>Cancel</button>
                <button className="btn-primary" onClick={()=>setOpen(false)}>Publish</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

