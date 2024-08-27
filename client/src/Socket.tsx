// SocketContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import io, { Socket } from 'socket.io-client'

interface SocketContextType {
  socket: Socket | null
}

const SocketContext = createContext<SocketContextType>({ socket: null })

interface SocketProviderProps {
  children: ReactNode
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const socketInstance = io('http://localhost:3000') // Your server URL
    setSocket(socketInstance)

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
}

export const UseSocket = (): SocketContextType => {
  return useContext(SocketContext)
}
