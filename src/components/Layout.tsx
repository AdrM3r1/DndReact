import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import NavBar from './NavBar'
import Particles from './Particles'

export default function Layout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <>
      <Particles />
      <h1 className="titulo">The Iris Of The Beholder</h1>
      <NavBar />
      <div className="content-area" style={{ position: 'relative', zIndex: 1 }}>
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
      </div>
    </>
  )
}
