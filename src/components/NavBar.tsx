import { Link, useNavigate, useLocation } from 'react-router-dom'
import Swal from 'sweetalert2'
import { useAuth } from '../context/AuthContext'
import { useFont } from '../context/FontContext'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFont, faShieldAlt } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect } from 'react'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'

export default function NavBar() {
  const { isLoggedIn, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { mode, toggle } = useFont()
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [logoImg, setLogoImg] = useState('')

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
      <Navbar expand="lg" variant="dark" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
        <Container>
          {logoImg && (
            <Navbar.Brand>
              <img src={logoImg} alt="logo" height="65" />
            </Navbar.Brand>
          )}
          <div className="d-flex align-items-center ms-auto" style={{ gap: '8px' }}>
            <Button
              onClick={toggle}
              variant="outline-warning"
              size="sm"
              style={{ borderColor: '#d4af37', position: 'relative' }}
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
                color: '#d4af37',
                background: 'rgba(0,0,0,0.7)',
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
              <Nav.Link as={Link} to="/principal">Home</Nav.Link>
              <Nav.Link as={Link} to="/info">Informacion</Nav.Link>
              <Nav.Link as={Link} to="/como-jugar">Como Jugar</Nav.Link>
              <Nav.Link as={Link} to="/utilidades">Herramientas</Nav.Link>
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
                  <Nav.Link as={Link} to="/usuario">Mi cuenta</Nav.Link>
                  {isAdmin && (
                    <Nav.Link as={Link} to="/admin">
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
                    style={{ fontFamily: 'Rostock', color: '#FFFEBD', fontSize: 14, textDecoration: 'none' }}
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
