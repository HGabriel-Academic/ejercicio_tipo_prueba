import { useMemo, useState } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import StickerCard from './components/StickerCard';
import stickersData from './data/stickers';

const statusOrder = ['falta', 'tengo', 'repetida'];

const statusLabels = {
  falta: 'Falta',
  tengo: 'Tengo',
  repetida: 'Repetida',
};

const getInitialStickers = () => {
  const safeStickers = Array.isArray(stickersData) ? stickersData : [];
  return safeStickers.filter((sticker) => sticker && typeof sticker === 'object');
};

const buildInitialStatuses = (stickers) =>
  Object.fromEntries(stickers.map((sticker) => [sticker.id, 'falta']));

function App() {
  const [stickers] = useState(getInitialStickers);
  const [statuses, setStatuses] = useState(() => buildInitialStatuses(stickers));
  const [filter, setFilter] = useState('all');

  const counts = useMemo(() => {
    return Object.values(statuses).reduce(
      (acc, status) => {
        acc[status] += 1;
        return acc;
      },
      { falta: 0, tengo: 0, repetida: 0 }
    );
  }, [statuses]);

  const handleStatusChange = (id) => {
    setStatuses((currentStatuses) => {
      const currentStatus = currentStatuses[id] ?? 'falta';
      const currentIndex = statusOrder.indexOf(currentStatus);
      const nextIndex = (currentIndex + 1) % statusOrder.length;

      return {
        ...currentStatuses,
        [id]: statusOrder[nextIndex],
      };
    });
  };

  const visibleStickers = stickers.filter((sticker) => filter === 'all' || statuses[sticker.id] === filter);
  const previewStickers = visibleStickers.slice(0, 5);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Mundial 2026</p>
          <h1 style={styles.title}>Mi álbum de figuritas</h1>
          <p style={styles.subtitle}>Gestiona tus figuritas de forma visual y rápida.</p>
        </div>
        <div style={styles.summaryBox} role="status" aria-live="polite">
          <div style={styles.summaryItem}><strong>{stickers.length}</strong><span>Total</span></div>
          <div style={styles.summaryItem}><strong>{counts.tengo}</strong><span>Tengo</span></div>
          <div style={styles.summaryItem}><strong>{counts.falta}</strong><span>Faltan</span></div>
          <div style={styles.summaryItem}><strong>{counts.repetida}</strong><span>Repetidas</span></div>
        </div>
      </header>

      <div style={styles.filters} role="group" aria-label="Filtrar figuritas por estado">
        {['all', 'falta', 'tengo', 'repetida'].map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            style={{ ...styles.filterButton, ...(filter === option ? styles.activeFilter : {}) }}
            aria-pressed={filter === option}
          >
            {option === 'all' ? 'Todas' : statusLabels[option]}
          </button>
        ))}
      </div>

      <section style={styles.grid} aria-label="Lista de figuritas">
        {previewStickers.map((sticker) => (
          <ErrorBoundary key={sticker.id}>
            <StickerCard
              number={sticker.number}
              name={sticker.name}
              group={sticker.group}
              status={statuses[sticker.id] ?? 'falta'}
              onToggle={() => handleStatusChange(sticker.id)}
            />
          </ErrorBoundary>
        ))}
      </section>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    padding: '24px',
    background: 'linear-gradient(135deg, #f4f7ff 0%, #e8f4ff 100%)',
    color: '#102a43',
    fontFamily: 'Inter, Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '24px',
  },
  eyebrow: {
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    fontSize: '0.8rem',
    color: '#486581',
  },
  title: {
    margin: '4px 0',
    fontSize: '2rem',
  },
  subtitle: {
    margin: 0,
    color: '#486581',
  },
  summaryBox: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(70px, 1fr))',
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
  filters: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  filterButton: {
    border: '1px solid #bcccdc',
    background: '#fff',
    padding: '8px 12px',
    borderRadius: '999px',
    cursor: 'pointer',
    color: '#334e68',
  },
  activeFilter: {
    background: '#102a43',
    color: '#fff',
    borderColor: '#102a43',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
};

export default App;
