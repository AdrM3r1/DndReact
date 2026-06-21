import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

export default function Layout() {
  return (
    <>
      <h1 className="titulo">The Iris Of The Beholder</h1>
      <NavBar />
      <div className="content-area">
        <Outlet />
      </div>
    </>
  )
}
