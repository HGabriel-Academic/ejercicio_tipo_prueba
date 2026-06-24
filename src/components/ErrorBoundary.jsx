import { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section role="alert" aria-live="assertive" style={styles.container}>
          <h2 style={styles.title}>No se pudo cargar este bloque</h2>
          <p style={styles.message}>Intenta recargar la página o volver a intentar más tarde.</p>
        </section>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    border: '2px solid #b91c1c',
    background: '#fef2f2',
    color: '#7f1d1d',
    borderRadius: '16px',
    padding: '16px',
    fontFamily: 'Segoe UI, Arial, sans-serif',
  },
  title: {
    margin: '0 0 8px',
    fontSize: '1rem',
  },
  message: {
    margin: 0,
    fontSize: '0.95rem',
  },
};

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

export default ErrorBoundary;
