import { useState } from 'react'

export default function EditProfile({ user = {}, onSave = () => {}, onCancel = () => {} }) {
  const [form, setForm] = useState({
    name: user.name || '',
    username: user.username || '',
    email: user.email || '',
    bio: user.bio || '',
    team: user.team || '',
    role: user.role || '',
    matches: user.matches || 0,
    runs: user.runs || 0,
    wickets: user.wickets || 0,
    
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function update(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) {
      setError('Name is required')
      return
    }

    if (!form.email.trim()) {
      setError('Email is required')
      return
    }

    setSaving(true)
    try {
      onSave({ ...form })
    } catch (err) {
      setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'transparent',
    color: '#F8FAFC'
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 20 }} aria-label="Edit profile form">
      {error && (
        <div style={{ color: '#fecaca', marginBottom: 12 }}>{error}</div>
      )}

      <div style={{ display: 'grid', gap: 12 }}>
        <label>
          <div style={{ color: '#94A3B8', marginBottom: 6 }}>Full name</div>
          <input
            style={inputStyle}
            value={form.name}
            onChange={e => update('name', e.target.value)}
            placeholder="Full name"
            aria-label="Full name"
          />
        </label>

        <label>
          <div style={{ color: '#94A3B8', marginBottom: 6 }}>Username</div>
          <input
            style={inputStyle}
            value={form.username}
            onChange={e => update('username', e.target.value)}
            placeholder="username"
            aria-label="Username"
          />
        </label>

        <label>
          <div style={{ color: '#94A3B8', marginBottom: 6 }}>Email</div>
          <input
            type="email"
            style={inputStyle}
            value={form.email}
            onChange={e => update('email', e.target.value)}
            placeholder="you@example.com"
            aria-label="Email"
          />
        </label>

        <label>
          <div style={{ color: '#94A3B8', marginBottom: 6 }}>Bio</div>
          <textarea
            style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
            value={form.bio}
            onChange={e => update('bio', e.target.value)}
            placeholder="Short bio"
            aria-label="Bio"
          />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label>
            <div style={{ color: '#94A3B8', marginBottom: 6 }}>Team</div>
            <input
              style={inputStyle}
              value={form.team}
              onChange={e => update('team', e.target.value)}
              placeholder="Favorite team"
              aria-label="Team"
            />
          </label>

          <label>
            <div style={{ color: '#94A3B8', marginBottom: 6 }}>Role</div>
            <input
              style={inputStyle}
              value={form.role}
              onChange={e => update('role', e.target.value)}
              placeholder="Role"
              aria-label="Role"
            />
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          <label>
            <div style={{ color: '#94A3B8', marginBottom: 6 }}>Matches</div>
            <input
              type="number"
              style={inputStyle}
              value={form.matches}
              onChange={e => update('matches', Number(e.target.value))}
              aria-label="Matches"
            />
          </label>

          <label>
            <div style={{ color: '#94A3B8', marginBottom: 6 }}>Runs</div>
            <input
              type="number"
              style={inputStyle}
              value={form.runs}
              onChange={e => update('runs', Number(e.target.value))}
              aria-label="Runs"
            />
          </label>

          <label>
            <div style={{ color: '#94A3B8', marginBottom: 6 }}>Wickets</div>
            <input
              type="number"
              style={inputStyle}
              value={form.wickets}
              onChange={e => update('wickets', Number(e.target.value))}
              aria-label="Wickets"
            />
          </label>
        </div>

        <label>
          <div style={{ color: '#94A3B8', marginBottom: 6 }}>Avatar URL</div>
          <input
            style={inputStyle}
            value={form.avatar}
            onChange={e => update('avatar', e.target.value)}
            placeholder="https://..."
            aria-label="Avatar URL"
          />
        </label>

        <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '10px 16px',
              borderRadius: 10,
              border: 'none',
              background: 'linear-gradient(135deg,#22c55e,#16a34a)',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '10px 16px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'transparent',
              color: '#F8FAFC',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
