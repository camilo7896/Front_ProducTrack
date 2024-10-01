/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { createContext, useContext, useState } from "react";

export const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const UserContext = ({ children }) => {


  // *********************** Estados del componente Eficiencia ************************************************************************

  const [searchTermUser, setSearchTermUser] = useState('');
  const [searchTermMachine, setSearchTermMachine] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalHours, setTotalHours] = useState(0);
  const [totalStandard, setTotalStandard] = useState(0);
  const [meta, setMeta] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [totalEfficiency, setTotalEfficiency] = useState(0);
  const [auth, setAuth] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(null); // Agrega el estado del rol



  // ***********************************************************************************************

  //Ruta conexiones
  //const rutaLocal = 'http://192.168.0.19:3000/api/';
  const rutaLocal = 'http://192.168.0.19:3000/api/';


  // Loggin *******************************************************************+
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role'); // Asegúrate de que también guardes el rol

    if (token) {
      setAuth(true);
      setRole(userRole || ''); // Establece el rol si está disponible
    }
  }, []);

  const login = (token, userRole) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', userRole); // Guarda el rol en localStorage
    setAuth(true);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setAuth(false);
    setRole('');
    // Redirige a la página de login
    window.location.href = '/';
  };
  
  // End Loggin ***************************************************************************************

  //data machines
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('http://192.168.0.19:3000/api/machines/')
      .then(response => response.json())
      .then(data => {
        setData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  //data users
  const [usersData, setUsersData] = useState([]);
  useEffect(() => {
    fetch('http://192.168.0.19:3000/api/users/')
      .then(response => response.json())
      .then(data => {
        setUsersData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  //data references
  const [referencesData, setReferencesData] = useState([]);
  useEffect(() => {
    fetch('http://192.168.0.19:3000/api/reference/')
      .then(response => response.json())
      .then(data => {
        setReferencesData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  //Assignament
  const [assignamentData, setAssignament] = useState([]);
  useEffect(() => {
    fetch('http://192.168.0.19:3000/api/assignaments/')
      .then(response => response.json())
      .then(data => {
        setAssignament(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  //all assign
  const [allassignamentData, setAllAssignament] = useState([]);
  useEffect(() => {
    fetch('http://192.168.0.19:3000/api/allassign/')
      .then(response => response.json())
      .then(data => {
        setAllAssignament(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // registers
  const [registerData, setRegisterData] = useState([]);
  useEffect(() => {
    fetch('http://192.168.0.19:3000/api/user-machines/')
      .then(response => response.json())
      .then(data => {
        setRegisterData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);



  //  Metodo para obtener todos los registros enviados
  const [allRegisterData, setAllRegisterData] = useState([]);
  useEffect(() => {
    fetch('http://192.168.0.19:3000/api/horometro-records')
      .then(response => response.json())
      .then(data => {
        setAllRegisterData(data);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);


  // Estado para crear usuarios
  const [user, setUser] = useState({
    codigo: '',
    nombres: '',
    apellidos: '',
    usuario: ''
  });

  // Estado para crear maquinas
  const [machine, setMachine] = useState({
    id_maquinas: '',
    nombre_maquina: '',
    capacidad: ''
  });

  // Estado para controlar la visibilidad del componente
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleMachine, setIsVisibleMachine] = useState(false);
  const [isVisibleReference, setIsVisibleReference] = useState(false);

  // Función para alternar la visibilidad del componente
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
  const toggleVisibilityMachine = () => {
    setIsVisibleMachine(!isVisibleMachine);
  };
  const toggleVisibilityReference = () => {
    setIsVisibleReference(!isVisibleReference);
  };

  const [capacity, setCapacity] = useState(0)


  // Metodo para eliminar una asignacion
  const fetchAssignations = async () => {
    try {
      const response = await fetch('http://192.168.0.19:3000/api/allassign');
      const data = await response.json();
      setAllAssignament(data);
    } catch (error) {
      console.error('Error fetching assignations:', error);
    }
  };
  // Efecto para cargar las asignaciones al montar el componente
  useEffect(() => {
    fetchAssignations();
  }, []);
  const handleDeleteAssignation = () => {
    console.log('Fetching assignments');
  }


  // Función para actualizar el usuario
  const updateUser = async (user) => {
    try {
      const response = await fetch(`http://192.168.0.19:3000/api/users/${user.id_usuarios}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al actualizar usuario: ${errorText}`);
      }

      // Actualizar el estado con el usuario actualizado
      setUsersData(usersData.map(u => u.id_usuarios === user.id_usuarios ? user : u));
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  };


  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`http://192.168.0.19:3000/api/users/${userId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        // Manejo de errores, por ejemplo, si el servidor devuelve un código de estado 404 o 500
        const errorText = await response.text();
        throw new Error(`Error al eliminar usuario: ${errorText}`);
      }
  
      // Actualizar el estado después de una eliminación exitosa
      setUsersData(usersData.filter(user => user.id_usuarios !== userId));
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  };
  

  return (
    <GlobalContext.Provider value={{
      user,
      setUser,
      isVisible,
      setIsVisible,
      toggleVisibility,
      isVisibleMachine,
      setIsVisibleMachine,
      toggleVisibilityMachine,
      machine,
      setMachine,
      data,
      setData,
      usersData,
      setUsersData,
      referencesData,
      setReferencesData,
      isVisibleReference,
      setIsVisibleReference,
      toggleVisibilityReference,
      assignamentData,
      setAssignament,
      capacity,
      setCapacity,
      allassignamentData,
      setAllAssignament,
      handleDeleteAssignation,
      registerData,
      setRegisterData,
      rutaLocal,
      allRegisterData,
      setAllRegisterData,
      totalEfficiency,
      setTotalEfficiency,
      searchTermUser,
      setSearchTermUser,
      searchTermMachine,
      setSearchTermMachine,
      startDate,
      setStartDate,
      endDate,
      setEndDate,
      totalHours,
      setTotalHours,
      totalStandard,
      setTotalStandard,
      meta,
      setMeta,
      efficiency,
      setEfficiency,
      auth,
      login,
      logout,
      role,
      updateUser,
      deleteUser
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default UserContext;
export const useAuth = () => useContext(GlobalContext)