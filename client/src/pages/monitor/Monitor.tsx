import { useEffect, useState } from 'react'
import { Card } from './components/Card'
import './Monitor.css'
import { UseSocket } from '../../Socket'
export const Monitor = () => {
  const [isInGateOpen, setInGateOpen] = useState<boolean>(false)
  const [isOutGateOpen, setOutGateOpen] = useState<boolean>(false)
  const [slots, setSlots] = useState<boolean[]>([false, false, false, false])
  const { socket } = UseSocket()

  const handleOpenGateIn = () => setInGateOpen(true)
  const handleCloseGateIn = () => setInGateOpen(false)
  const handleOpenGateOut = () => setOutGateOpen(true)
  const handleCloseGateOut = () => setOutGateOpen(false)
  const handleUpdateSlots = (data: string) => {
    setSlots(
      data
        .split('')
        .map((item) => item === '1')
        .reverse()
    )
  }

  useEffect(() => {
    if (socket) {
      socket.on('open-gate-in', handleOpenGateIn)
      socket.on('close-gate-in', handleCloseGateIn)
      socket.on('open-gate-out', handleOpenGateOut)
      socket.on('close-gate-out', handleCloseGateOut)
      socket.on('ui-update', handleUpdateSlots)

      // Cleanup on component unmount
      return () => {
        socket.off('open-gate-in', handleOpenGateIn)
        socket.off('close-gate-in', handleCloseGateIn)
        socket.off('open-gate-out', handleOpenGateOut)
        socket.off('close-gate-out', handleCloseGateOut)
        socket.off('ui-update', handleUpdateSlots)
      }
    }
  }, [socket])
  return (
    <div className='monitor-container'>
      <div className={`road-out ${isOutGateOpen ? 'open' : 'close'}`}></div>
      <div className='monitor'>
        {[0, 1, 2, 3].map((value) => {
          return <Card key={value} name={(4 - value).toString()} isFull={slots[value]} />
        })}
        <div className={`road-in ${isInGateOpen ? 'open' : 'close'}`}></div>
      </div>
    </div>
  )
}
