import PropTypes from 'prop-types';

const statusStyles = {
  missing: {
    border: '1px solid #4b5563',
    background: '#f3f4f6',
    color: '#111827',
  },
  collected: {
    border: '1px solid #1f7a1f',
    background: '#e6f4ea',
    color: '#0f3d1a',
  },
  duplicate: {
    border: '1px solid #b45309',
    background: '#fef3c7',
    color: '#78350f',
  },
};

function StickerCard({ number, name, group, status, onToggle }) {
  const safeStatus = statusStyles[status] ? status : 'missing';
  const label = safeStatus === 'missing' ? 'Falta' : safeStatus === 'collected' ? 'Tengo' : 'Repetida';

  return (
    <button
      type="button"
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onToggle?.();
        }
      }}
      aria-label={`Cambiar estado de la figurita ${name}`}
      aria-describedby={`sticker-${number}-status`}
      style={{ ...styles.card, ...statusStyles[safeStatus] }}
    >
      <span style={styles.number}>#{number}</span>
      <h3 style={styles.name}>{name}</h3>
      <p style={styles.group}>{group ? `Grupo ${group}` : 'Sin grupo'}</p>
      <span id={`sticker-${number}-status`} style={styles.status} role="status" aria-live="polite">{label}</span>
    </button>
  );
}

StickerCard.propTypes = {
  number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  name: PropTypes.string.isRequired,
  group: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  status: PropTypes.oneOf(['missing', 'collected', 'duplicate']),
  onToggle: PropTypes.func,
};

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
    fontFamily: 'Segoe UI, Arial, sans-serif',
    width: '100%',
    outlineOffset: '2px',
    border: '2px solid transparent',
  },
  number: {
    fontSize: '0.95rem',
    fontWeight: '700',
    marginBottom: '8px',
  },
  name: {
    margin: '0 0 6px',
    fontSize: '1.05rem',
    lineHeight: 1.3,
  },
  group: {
    margin: 0,
    fontSize: '0.9rem',
    opacity: 0.9,
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
