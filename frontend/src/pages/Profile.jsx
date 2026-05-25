import { useState } from 'react'
import ProfileHeader from '../components/profile/ProfileHeader'
import EditProfile from '../components/profile/EditProfile'
export default function Profile() {
  const [user, setUser] = useState({
    name: 'Ankit Kumar',
    username: 'ankit07',
    email: 'ankit@gmail.com',
    bio: 'Passionate cricket lover and full stack developer.',
    team: 'India',
    role: 'All Rounder',
    matches: 48,
    runs: 2190,
    wickets: 32,
    avatar: ''
  })

  const [editing, setEditing] = useState(false)

  const containerStyle = {
    minHeight: '100vh',
    background:
      'linear-gradient(135deg,#04130A 0%,#071A0F 25%,#0B2415 50%,#05080B 100%)',
    padding: 30,
    fontFamily: '"Cabinet Grotesk", sans-serif'
  }

  const cardStyle = {
    maxWidth: 950,
    margin: '0 auto',
    background: 'rgba(14,20,25,0.88)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 32,
    backdropFilter: 'blur(12px)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.4)'
  }

  const statCard = {
    flex: 1,
    minWidth: 160,
    background: '#111827',
    borderRadius: 20,
    padding: 20,
    border: '1px solid rgba(255,255,255,0.06)'
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <ProfileHeader user={user} onEdit={() => setEditing(true)} />
          </div>
        </div>

        <div
          style={{
            marginTop: 40,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
            gap: 20
          }}
        >

          <div style={statCard}>
            <h3 style={{ color: '#22c55e', marginBottom: 10 }}>Favorite Team</h3>
            <p style={{ color: '#F8FAFC', fontSize: 24, fontWeight: 700 }}>{user.team}</p>
          </div>

          <div style={statCard}>
            <h3 style={{ color: '#22c55e', marginBottom: 10 }}>Role</h3>
            <p style={{ color: '#F8FAFC', fontSize: 24, fontWeight: 700 }}>{user.role}</p>
          </div>

          <div style={statCard}>
            <h3 style={{ color: '#22c55e', marginBottom: 10 }}>Matches</h3>
            <p style={{ color: '#F8FAFC', fontSize: 24, fontWeight: 700 }}>{user.matches}</p>
          </div>

        </div>

        <div
          style={{
            marginTop: 28,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
            gap: 20
          }}
        >

          <div style={statCard}>
            <h3 style={{ color: '#22c55e', marginBottom: 10 }}>Total Runs</h3>
            <p style={{ color: '#F8FAFC', fontSize: 28, fontWeight: 800 }}>{user.runs}</p>
          </div>

          <div style={statCard}>
            <h3 style={{ color: '#22c55e', marginBottom: 10 }}>Wickets</h3>
            <p style={{ color: '#F8FAFC', fontSize: 28, fontWeight: 800 }}>{user.wickets}</p>
          </div>

          <div style={statCard}>
            <h3 style={{ color: '#22c55e', marginBottom: 10 }}>Email</h3>
            <p style={{ color: '#F8FAFC', fontSize: 18, fontWeight: 600 }}>{user.email}</p>
          </div>

        </div>

      </div>

      {editing && (
        <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.5)', zIndex: 60 }}>
          <div style={{ width: 'min(920px,95%)', padding: 20 }}>
            <div style={{ background: 'rgba(6,8,10,0.96)', borderRadius: 12, padding: 20 }}>
              <EditProfile
                user={user}
                onSave={(updated) => {
                  setUser(updated)
                  setEditing(false)
                }}
                onCancel={() => setEditing(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}