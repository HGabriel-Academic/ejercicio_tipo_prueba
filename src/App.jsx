import { useEffect, useMemo, useState } from 'react';
import StickerCard from './components/StickerCard';
import stickersData from './data/stickers';

const statusOrder = ['missing', 'collected', 'duplicate'];

const statusLabels = {
  missing: 'Falta',
  collected: 'Tengo',
  duplicate: 'Repetida',
};

function App() {
  const [stickers, setStickers] = useState(() => {
    const safeStickers = Array.isArray(stickersData) ? stickersData : [];
    return safeStickers.filter((sticker) => sticker && typeof sticker === 'object');
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    console.log('Figuritas cargadas:', stickers);
  }, [stickers]);

  const counts = useMemo(() => {
    return stickers.reduce(
      (acc, sticker) => {
        acc[sticker.status] += 1;
        return acc;
      },
      { missing: 0, collected: 0, duplicate: 0 }
    );
  }, [stickers]);

  const toggleStatus = (id) => {
    setStickers((current) =>
      current.map((sticker) => {
        if (sticker.id !== id) return sticker;
        const currentIndex = statusOrder.indexOf(sticker.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        return { ...sticker, status: statusOrder[nextIndex] };
      })
    );
  };

  const visibleStickers = stickers.filter((sticker) => filter === 'all' || sticker.status === filter);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Mundial 2026</p>
          <h1 style={styles.title}>Mi álbum de figuritas</h1>
          <p style={styles.subtitle}>Gestiona tus figuritas de forma visual y rápida.</p>
        </div>
        <div style={styles.summaryBox}>
          <div style={styles.summaryItem}><strong>{stickers.length}</strong><span>Total</span></div>
          <div style={styles.summaryItem}><strong>{counts.collected}</strong><span>Tengo</span></div>
          <div style={styles.summaryItem}><strong>{counts.missing}</strong><span>Faltan</span></div>
          <div style={styles.summaryItem}><strong>{counts.duplicate}</strong><span>Repetidas</span></div>
        </div>
      </header>

      <div style={styles.filters}>
        {['all', 'missing', 'collected', 'duplicate'].map((option) => (
          <button
            key={option}
            onClick={() => setFilter(option)}
            style={{ ...styles.filterButton, ...(filter === option ? styles.activeFilter : {}) }}
          >
            {option === 'all' ? 'Todas' : statusLabels[option]}
          </button>
        ))}
      </div>

      <section style={styles.grid}>
        {visibleStickers.map((sticker) => (
          <StickerCard
            key={sticker.id}
            number={sticker.number}
            name={sticker.name}
            group={sticker.group}
            status={sticker.status}
            onToggle={() => toggleStatus(sticker.id)}
          />
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
