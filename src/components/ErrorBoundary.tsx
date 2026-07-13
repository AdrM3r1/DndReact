import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '100vh', padding: '2rem',
          fontFamily: 'var(--font-body)', color: 'var(--color-cream)',
          background: 'var(--bg-page)', textAlign: 'center'
        }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-gold)', marginBottom: '1rem' }}>
            Algo salio mal
          </h2>
          <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
            Ha ocurrido un error inesperado. Intenta recargar la pagina.
          </p>
          <button
            className="dnd-btn"
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
          >
            Recargar pagina
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
