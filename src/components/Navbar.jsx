import { Link } from "react-router-dom";
import { CogIcon, UserGroupIcon, Cog8ToothIcon } from '@heroicons/react/24/outline';
import { useGlobalContext } from '../context/UserContext';

export default function Navbar() {
  const {  role } = useGlobalContext();
  //const navigate = useNavigate();

const handleLogout = () => {
  // Elimina el token del almacenamiento local o cookies
  localStorage.removeItem('authToken');
  // Redirige a la página de login
  window.location.href = '/';
};


  return (
    <div className="navbar bg-neutral text-white">
      <div className="navbar-center">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-neutral rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li><Link to={'/'}>Home</Link></li>
           
            <li><Link to={'/picado'}>
              <Cog8ToothIcon className="h-6 w-6 text-blue-500 m-4" />
              Picado</Link></li>


            {/* <li><Link to={'/empaque'}>Empaque</Link></li> */}
            {role !== 'enrolador' && (
              <li>
                <Link to={'/admin'}>
                  <CogIcon className="h-6 w-6 text-blue-500 m-4" />
                  Administrador
                </Link>
              </li>

            )}
            {role !== 'enrolador' && (
              <li><Link to={'/asignation'}>
                <UserGroupIcon className="h-6 w-6 text-blue-500 m-4 " />
                Asignaciones</Link></li>
            )}
            
            <li><button onClick={handleLogout} className="btn btn-primary m-2">Salir</button></li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link to={"/home"} className="btn btn-ghost text-xl">ProductTrack</Link>
      </div>
      <div className="navbar-end"></div>
    </div>
  );
}
