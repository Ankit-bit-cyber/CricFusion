export default function StatCard({ title, value, children }) {
  const statCard = {
    flex: 1,
    minWidth: 160,
    background: '#111827',
    borderRadius: 20,
    padding: 20,
    border: '1px solid rgba(255,255,255,0.06)'
  }

  return (
    <div style={statCard}>
      <h3 style={{ color: '#22c55e', marginBottom: 10 }}>{title}</h3>

      <div>
        {typeof value === 'object' ? value : (
          <p style={{ color: '#F8FAFC', fontSize: 24, fontWeight: 700 }}>
            {value}
          </p>
        )}
      </div>

      {children}
    </div>
  )
}