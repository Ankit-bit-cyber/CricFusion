import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log({ name, email, password })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg,#04130A 0%,#071A0F 25%,#0B2415 50%,#05080B 100%)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        fontFamily: '"Cabinet Grotesk", sans-serif'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 520,
          background: 'rgba(14,20,25,0.92)',
          border: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)',
          borderRadius: 20,
          padding: 36,
          boxShadow: '0 20px 50px rgba(0,0,0,0.4)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'linear-gradient(135deg,#22c55e,#15803d)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🏏</div>
          <h2 style={{ color: '#F0F4F8', fontSize: 26, marginTop: 12 }}>Create your free account</h2>
          <p style={{ color: '#94A3B8', marginTop: 8 }}>Join CricConnect — it's free and fast.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', color: '#CBD5E1', fontSize: 13, marginBottom: 6 }}>Full name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', background: '#0b1220', color: '#fff' }} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', color: '#CBD5E1', fontSize: 13, marginBottom: 6 }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@domain.com" required style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', background: '#0b1220', color: '#fff' }} />
          </div>

          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', color: '#CBD5E1', fontSize: 13, marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Choose a password" required style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', background: '#0b1220', color: '#fff' }} />
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Create account</button>
        </form>

        <p style={{ textAlign: 'center', color: '#94A3B8', marginTop: 16 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4ade80', fontWeight: 700 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}