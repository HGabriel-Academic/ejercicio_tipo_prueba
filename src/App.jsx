import { useEffect, useMemo, useState } from 'react';
import AlbumSummary from './components/AlbumSummary';
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

const STORAGE_KEY = 'album-stickers-statuses';

function App() {
  const [stickers] = useState(getInitialStickers);
  const [statuses, setStatuses] = useState(() => {
    if (typeof window === 'undefined') {
      return buildInitialStatuses(stickers);
    }

    try {
      const savedStatuses = window.localStorage.getItem(STORAGE_KEY);
      if (!savedStatuses) {
        return buildInitialStatuses(stickers);
      }

      const parsedStatuses = JSON.parse(savedStatuses);
      if (!parsedStatuses || typeof parsedStatuses !== 'object') {
        return buildInitialStatuses(stickers);
      }

      return {
        ...buildInitialStatuses(stickers),
        ...parsedStatuses,
      };
    } catch {
      return buildInitialStatuses(stickers);
    }
  });
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  const visibleStickers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return stickers.filter((sticker) => {
      const matchesStatus = statusFilter === 'all' || statuses[sticker.id] === statusFilter;
      const haystack = `${sticker.number} ${sticker.name}`.toLowerCase();
      const matchesSearch = normalizedSearch === '' || haystack.includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [searchTerm, statusFilter, stickers, statuses]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
  }, [statuses]);

  const completionPercentage = stickers.length > 0
    ? Math.round((counts.tengo / stickers.length) * 100)
    : 0;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Mundial 2026</p>
          <h1 style={styles.title}>Mi álbum de figuritas</h1>
          <p style={styles.subtitle}>Gestiona tus figuritas de forma visual y rápida.</p>
        </div>
        <AlbumSummary
          total={stickers.length}
          tengo={counts.tengo}
          repetidas={counts.repetida}
          faltan={counts.falta}
          completionPercentage={completionPercentage}
        />
      </header>

      <div style={styles.controls}>
        <label style={styles.searchBox} htmlFor="sticker-search">
          <span style={styles.searchLabel}>Buscar</span>
          <input
            id="sticker-search"
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Por nombre o número"
            style={styles.searchInput}
          />
        </label>

        <div style={styles.filters} role="group" aria-label="Filtrar figuritas por estado">
          {['all', 'falta', 'tengo', 'repetida'].map((option) => (
            <button
              key={option}
              onClick={() => setStatusFilter(option)}
              style={{ ...styles.filterButton, ...(statusFilter === option ? styles.activeFilter : {}) }}
              aria-pressed={statusFilter === option}
            >
              {option === 'all' ? 'Todas' : statusLabels[option]}
            </button>
          ))}
        </div>
      </div>

      <p style={styles.resultsText}>Mostrando {visibleStickers.length} figuritas</p>

      <section style={styles.grid} aria-label="Lista de figuritas">
        {visibleStickers.map((sticker) => (
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
  controls: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: '12px',
  },
  searchBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: '220px',
    flex: 1,
  },
  searchLabel: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#486581',
  },
  searchInput: {
    border: '1px solid #bcccdc',
    borderRadius: '12px',
    padding: '10px 12px',
    fontSize: '0.95rem',
    color: '#102a43',
  },
  filters: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '8px',
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
  resultsText: {
    margin: '0 0 16px',
    color: '#486581',
    fontWeight: '600',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
};

export default App;
