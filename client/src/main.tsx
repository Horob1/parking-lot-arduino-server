import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Monitor } from './pages/monitor/Monitor.tsx'
import { User } from './pages/user/User.tsx'
import { SocketProvider } from './Socket.tsx'
import { Card } from './pages/card/Card.tsx'
import { Log } from './pages/log/Log.tsx'
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Monitor /> },
      { path: 'user', element: <User /> },
      { path: 'card', element: <Card /> },
      { path: 'log', element: <Log /> }
    ]
  }
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  </StrictMode>
)
