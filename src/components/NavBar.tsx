import { Link, useNavigate, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useAuth } from '../context/AuthContext'
import { useFont } from '../context/FontContext'
import { useTheme } from '../context/ThemeContext'
import { useScrollHide } from '../hooks/useScrollHide'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFont, faShieldAlt, faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'

export default function NavBar() {
  const { isLoggedIn, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { mode, toggle } = useFont()
  const { mode: themeMode, toggle: toggleTheme } = useTheme()
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [logoImg, setLogoImg] = useState('')
  const hidden = useScrollHide()

  useEffect(() => {
    if (window.innerWidth > 720) {
      const logos = Array.from({ length: 7 }, (_, i) =>
        `/images/logo/beholder${i + 1}.png`
      )
      setLogoImg(logos[Math.floor(Math.random() * logos.length)])
    }
  }, [location.pathname])

  return (
    <>
      <Navbar expand="lg" variant="dark" style={{
        backgroundColor: 'var(--color-black-60)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--color-gold-15)',
        transition: 'transform 0.3s ease',
        transform: hidden ? 'translateY(-100%)' : 'translateY(0)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}>
        <Container>
          {logoImg && (
            <Navbar.Brand>
              <img src={logoImg} alt="logo" height="65" />
            </Navbar.Brand>
          )}
          <div className="d-flex align-items-center ms-auto" style={{ gap: '8px' }}>
            <Button
              onClick={toggleTheme}
              variant="outline-warning"
              size="sm"
              style={{ borderColor: 'var(--color-gold)', background: 'var(--color-black-30)' }}
              title={`Cambiar a modo ${themeMode === 'dark' ? 'claro' : 'oscuro'}`}
              aria-label="Alternar tema"
            >
              <FontAwesomeIcon icon={themeMode === 'dark' ? faSun : faMoon} />
            </Button>
            <Button
              onClick={toggle}
              variant="outline-warning"
              size="sm"
              style={{ borderColor: 'var(--color-gold)', position: 'relative', background: 'var(--color-black-30)' }}
              title={`Fuente actual: ${mode === 'vinque' ? 'Vinque' : 'Cardo'}. Click para cambiar.`}
              aria-label="Alternar fuente de accesibilidad lectora"
            >
              <FontAwesomeIcon icon={faFont} />
              <span style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                fontSize: '9px',
                fontWeight: 'bold',
                color: 'var(--color-gold)',
                background: 'var(--color-black-70)',
                borderRadius: '2px',
                padding: '0 2px',
                lineHeight: 1.2,
              }}>
                {mode === 'vinque' ? 'V' : 'C'}
              </span>
            </Button>
            <Navbar.Toggle aria-controls="main-nav" />
          </div>
          <Navbar.Collapse id="main-nav">
            <Nav className="ms-auto" style={{ fontFamily: 'Rostock', fontSize: 20 }}>
              <Nav.Link as={Link} to="/principal" className={location.pathname === '/principal' ? 'active-link' : ''}>Home</Nav.Link>
              <Nav.Link as={Link} to="/info" className={location.pathname === '/info' ? 'active-link' : ''}>Informacion</Nav.Link>
              <Nav.Link as={Link} to="/como-jugar" className={location.pathname === '/como-jugar' ? 'active-link' : ''}>Como Jugar</Nav.Link>
              <Nav.Link as={Link} to="/utilidades" className={location.pathname === '/utilidades' ? 'active-link' : ''}>Herramientas</Nav.Link>
              {!isAdmin && !isLoggedIn && (
                <Nav.Link onClick={() => setShowRegister(true)} style={{ cursor: 'pointer' }}>
                  Registrate
                </Nav.Link>
              )}
              {!isLoggedIn ? (
                <Nav.Link onClick={() => setShowLogin(true)} style={{ cursor: 'pointer' }}>
                  Login
                </Nav.Link>
              ) : (
                <>
                  <Nav.Link as={Link} to="/usuario" className={location.pathname === '/usuario' ? 'active-link' : ''}>Mi cuenta</Nav.Link>
                  {isAdmin && (
                    <Nav.Link as={Link} to="/admin" className={location.pathname === '/admin' ? 'active-link' : ''}>
                      <FontAwesomeIcon icon={faShieldAlt} style={{ marginRight: 4 }} />
                      Admin
                    </Nav.Link>
                  )}
                  <Button
                    variant="link"
                    onClick={() => {
                      Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: isAdmin ? 'Nos vemos mas tarde Admin' : 'Hasta pronto!',
                        showConfirmButton: false,
                        timer: 1500,
                      }).then(() => {
                        logout()
                        navigate('/principal')
                      })
                    }}
                    style={{ fontFamily: 'Rostock', color: 'var(--color-cream)', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}
                  >
                    Cerrar sesion
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <LoginModal show={showLogin} onHide={() => setShowLogin(false)} onShowRegister={() => { setShowLogin(false); setShowRegister(true) }} />
      <RegisterModal show={showRegister} onHide={() => setShowRegister(false)} onShowLogin={() => { setShowRegister(false); setShowLogin(true) }} />
    </>
  )
}
