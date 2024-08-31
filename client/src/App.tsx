import { Link, Outlet } from 'react-router-dom'
import './App.css'
import { UseSocket } from './Socket'
import { useEffect, useState } from 'react'
import FireAlertModal from './components/Warning'
import toast, { Toaster } from 'react-hot-toast'
import { IWarning } from './pages/warning/Warning'
function App() {
  const [isModalOpen, setModalOpen] = useState(false)
  const { socket } = UseSocket()
  const openModal = () => {
    toast.error("Cảnh báo phát hiện lửa!")
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  const handleWarning = (warning: IWarning) => {
    toast.error('Cảnh báo! ' + warning.desc)
  }

  useEffect(() => {
    if (socket) {
      socket.on('flame-on-client', openModal)
      socket.on('warning', handleWarning)
      // Cleanup on component unmount
      return () => {
        socket.off('flame-on-client', openModal)
        socket.off('warning', handleWarning)
      }
    }
  }, [socket])

  return (
    <>
      <div className='tab'>
        <Link to={'/'}>
          <button>Home 🏠</button>
        </Link>
        <Link to={'/user'}>
          <button>User 😊</button>
        </Link>
        <Link to={'/card'}>
          <button>Card 💳</button>
        </Link>
        <Link to={'/log'}>
          <button>Log 🗂️</button>
        </Link>
        <Link to={'/warning'}>
          <button>Warning ⚠️</button>
        </Link>
      </div>
      <div className='main-title'>
        <h1>🚗🚗 PARKING LOT 🚗🚗</h1>
      </div>
      <Outlet />
      <div>
        <FireAlertModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
      <Toaster position='top-center' reverseOrder={false} />
    </>
  )
}

export default App
