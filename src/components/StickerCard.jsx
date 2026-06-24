const statusStyles = {
  missing: {
    border: '1px solid #f0b429',
    background: '#fff8e1',
    color: '#7c4a00',
  },
  collected: {
    border: '1px solid #2cb67d',
    background: '#e8fdf3',
    color: '#176b3d',
  },
  duplicate: {
    border: '1px solid #7c3aed',
    background: '#f3ebff',
    color: '#5b21b6',
  },
};

function StickerCard({ number, name, group, status, onToggle }) {
  return (
    <button onClick={onToggle} style={{ ...styles.card, ...statusStyles[status] }}>
      <span style={styles.number}>#{number}</span>
      <h3 style={styles.name}>{name}</h3>
      <p style={styles.group}>Grupo {group}</p>
      <span style={styles.status}>{status === 'missing' ? 'Falta' : status === 'collected' ? 'Tengo' : 'Repetida'}</span>
    </button>
  );
}

const styles = {
  card: {
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    cursor: 'pointer',
    textAlign: 'left',
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
    minHeight: '150px',
  },
  number: {
    fontSize: '0.9rem',
    fontWeight: '700',
    marginBottom: '8px',
  },
  name: {
    margin: '0 0 6px',
    fontSize: '1.05rem',
  },
  group: {
    margin: 0,
    fontSize: '0.9rem',
    opacity: 0.8,
  },
  status: {
    marginTop: 'auto',
    fontSize: '0.85rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
};

export default StickerCard;
