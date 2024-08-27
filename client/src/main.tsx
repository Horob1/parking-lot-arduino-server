import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Monitor } from './pages/monitor/Monitor.tsx'
import { User } from './pages/user/User.tsx'
import { SocketProvider } from './Socket.tsx'
import { Warning } from './pages/warning/Warning.tsx'
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Monitor /> },
      { path: 'user', element: <User /> },
      { path: 'warning', element: <Warning />}
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
