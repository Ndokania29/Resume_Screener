export const api = {
  async get(path, token) {
    const res = await fetch(path, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
  async post(path, body, token) {
    const res = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body || {}),
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
  async del(path, token) {
    const res = await fetch(path, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
  async upload(path, formData, token) {
    const res = await fetch(path, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
  async downloadBlob(path, token) {
    const res = await fetch(path, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    if (!res.ok) throw new Error(await res.text())
    return res.blob()
  },
}

