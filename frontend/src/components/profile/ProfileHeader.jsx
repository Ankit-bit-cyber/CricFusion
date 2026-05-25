export default function ProfileHeader({user}){
    const buttonStyle = {
    padding: '12px 20px',
    border: 'none',
    borderRadius: 12,
    background: 'linear-gradient(135deg,#22c55e,#16a34a)',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer'
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 20
      }}
    >

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>

        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: '50%',
            background: 'linear-gradient(135deg,#22c55e,#15803d)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 48,
            fontWeight: 800,
            color: '#fff'
          }}
        >
          {user.name.charAt(0)}
        </div>

        <div>
          <h1
            style={{
              color: '#F8FAFC',
              marginBottom: 6,
              fontSize: 34
            }}
          >
            {user.name}
          </h1>

          <p style={{ color: '#94A3B8', marginBottom: 8 }}>
            @{user.username}
          </p>

          <p style={{ color: '#CBD5E1', maxWidth: 500 }}>
            {user.bio}
          </p>
        </div>
      </div>

      <button style={buttonStyle}>
        Edit Profile
      </button>

    </div>
  )
}