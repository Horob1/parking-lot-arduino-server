import { Link, Outlet } from 'react-router-dom'
import './App.css'
import { UseSocket } from './Socket'
import { useEffect } from 'react'
function App() {
  const { socket } = UseSocket()

  useEffect(() => {
    if (socket) {
      // Cleanup on component unmount
      return () => {
        socket.off()
      }
    }
  }, [socket])

  return (
    <>
      <div className='tab'>
        <Link to={'/'}>
          <button>Home</button>
        </Link>
        <Link to={'/user'}>
          <button>User</button>
        </Link>
        <Link to={'/warning'}>
          <button>Warning</button>
        </Link>
      </div>
      <div className='main-title'>
        <h1>🚗🚗 PARKING LOT 🚗🚗</h1>
      </div>
      <Outlet />
    </>
  )
}

export default App
