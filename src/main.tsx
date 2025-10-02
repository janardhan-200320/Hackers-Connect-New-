
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles/globals.css'
import App from './App'
import Feed from './routes/Feed'
import Profile from './routes/Profile'
import Groups from './routes/Groups'
import Events from './routes/Events'
import Messages from './routes/Messages'
import Marketplace from './routes/Marketplace'
import Challenges from './routes/Challenges'
import LoginGate from './routes/LoginGate'


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Feed /> },
      { path: 'profile/:id', element: <Profile /> },
      { path: 'groups', element: <Groups /> },
      { path: 'events', element: <Events /> },
      { path: 'messages', element: <Messages /> },
      { path: 'market', element: <Marketplace /> },
      { path: 'ctf', element: <Challenges /> },
      { path: 'access', element: <LoginGate /> },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
