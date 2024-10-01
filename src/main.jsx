import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from'react-router-dom'
import HomePage from './pages/HomePage'
import PicadoPage from './pages/PicadoPage'
import UserContext from './context/UserContext'
import AdminPage from './pages/AdminPage'
import TableUser from './components/TableUser'
import AsignationPage from './pages/AsignationPage'
import EficencePage from './pages/EficencePage'
import PrivateRoute from './PrivateRoute'
import LoginPage from './pages/LoginPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import HorometroTable from './components/HorometroTable'


const route = createBrowserRouter(
  [ {path: '/',
    element: <LoginPage/>,
    errorElement: <h1>Error</h1>
  },
    {path: '/home',
      element: <HomePage/>,
      errorElement: <h1>Error</h1>
    },
  
    {
      path: '/picado',
      element: <PicadoPage/>
    },
    {
      path: '/empaque',
      element: <h1>Empaque</h1>
    },
    {
      path: '/puas',
      element: <h1>Puas</h1>
    },
    {
      path: '/admin',
      element: <PrivateRoute element={<AdminPage/>} allowedRoles={['admin',"superadministrador"]}/>
    },
    {
      path: '/userlist',
      element: <TableUser/>
    },
    {
    path: '/asignation',
    element: <PrivateRoute element={<AsignationPage />} allowedRoles={['admin', 'superadministrador']} />,
  },
    {
      path: '/eficences',
      element: <EficencePage/>
    },
    {
      path: '/unauthorized',
      element: <UnauthorizedPage/>
    },
    {
      path: '/horometrotable',
      element: <HorometroTable/>
    }
  ]
)

ReactDOM.createRoot(document.getElementById('root')).render(
<UserContext>
  <RouterProvider router={route}/>

</UserContext>

)
