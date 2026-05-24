import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    console.log({ email, password})
  }

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#04130A 0%,#071A0F 25%,#0B2415 50%,#05080B 100%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    fontFamily: '"Cabinet Grotesk", sans-serif'
  }

  const cardStyle = {
    width: '100%',
    maxWidth: 420,
    background: 'rgba(14,20,25,0.88)',
    border: '1px solid rgba(255,255,255,0.08)',
    backdropFilter: 'blur(12px)',
    borderRadius: 24,
    padding: 32,
    boxShadow: '0 20px 50px rgba(0,0,0,0.4)'
  }

  const logoStyle = {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#22c55e,#15803d)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 34,
    margin: '0 auto 18px'
  }

  const inputStyle = {
    width: '100%',
    marginTop: 8,
    padding: '14px 16px',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.08)',
    background: '#111827',
    color: '#fff',
    outline: 'none'
  }

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: 14,
    border: 'none',
    background: 'linear-gradient(135deg,#22c55e,#16a34a)',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer'
  }

  return (
    <div style={containerStyle}>

      <div style={cardStyle}>

        <div style={{ textAlign: 'center', marginBottom: 30 }}>

          <div style={logoStyle}>
            🏏
          </div>

          <h1 style={{ color: '#F0F4F8', fontSize: 34, fontWeight: 800 }}>
            Welcome Back
          </h1>

          <p style={{ color: '#94A3B8', fontSize: 14 }}>
            Sign in to continue to CricConnect
          </p>

        </div>

        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: 20 }}>

            <label style={{ color: '#CBD5E1', fontSize: 14 }}>
              Email
            </label>

            <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />

          </div>

          <div style={{ marginBottom: 26 }}>

            <label style={{ color: '#CBD5E1', fontSize: 14 }}>
              Password
            </label>

            <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

          </div>

          <button type="submit" style={buttonStyle}>
            Sign In
          </button>

        </form>

        <p style={{ textAlign: 'center', color: '#94A3B8', marginTop: 24, fontSize: 14 }}>

          Don’t have an account?{' '}

          <Link to="/register" style={{ color: '#4ade80', textDecoration: 'none', fontWeight: 700 }}>
            Join Free
          </Link>

        </p>

      </div>

    </div>
  )
}