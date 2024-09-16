import { useState } from "react";
import { useGlobalContext } from "../context/UserContext";

export default function Login() {
  const { login } = useGlobalContext();
  const [password, setPasswords] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/login', { // Ajusta la URL si es necesario
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Error en el login');
      }

      const data = await response.json();
      login(data.token, data.role); // Guarda el token y el rol en el contexto
      window.location.href = '/home'; // Redirige a la página principal u otra ruta
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md m-20">
        <div>
          <div className="flex justify-center items-center">
            <img className="h-32 w-auto object-cover" src="public/logo-productrak.svg" alt="Workflow" />
          </div>


        </div>
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nombre de usuario</label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Ingrese su nombre de usuario"
              onChange={(e) => { setUsername(e.target.value) }}
              required
              autoComplete="off"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              className="input input-bordered w-full"
              onChange={(e) => { setPasswords(e.target.value) }}
              placeholder="Ingrese su contraseña"
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">Iniciar sesión</button>
        </form>
        {error && <p>{error}</p>}

      </div>
    </>
  )
}