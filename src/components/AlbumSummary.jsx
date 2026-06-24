import PropTypes from 'prop-types';

function AlbumSummary({ total, tengo, repetidas, faltan, completionPercentage }) {
  const summaryItems = [
    { label: 'Total', value: total },
    { label: 'Tengo', value: tengo },
    { label: 'Repetidas', value: repetidas },
    { label: 'Faltan', value: faltan },
  ];

  return (
    <div style={styles.summaryBox} role="status" aria-live="polite">
      {summaryItems.map((item) => (
        <div key={item.label} style={styles.summaryItem}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </div>
      ))}
      <div style={styles.progressItem}>
        <strong>{completionPercentage}%</strong>
        <span>Completitud</span>
      </div>
    </div>
  );
}

AlbumSummary.propTypes = {
  total: PropTypes.number.isRequired,
  tengo: PropTypes.number.isRequired,
  repetidas: PropTypes.number.isRequired,
  faltan: PropTypes.number.isRequired,
  completionPercentage: PropTypes.number.isRequired,
};

const styles = {
  summaryBox: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, minmax(70px, 1fr))',
    gap: '8px',
    padding: '12px',
    borderRadius: '16px',
    background: '#fff',
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
  },
  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '0.9rem',
  },
  progressItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '0.9rem',
    color: '#0f766e',
  },
};

export default AlbumSummary;
