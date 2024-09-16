import { useEffect, useState } from 'react';
import 'daisyui/dist/full.css'; // Asegúrate de importar los estilos de DaisyUI
import { useGlobalContext } from '../context/UserContext';

const AssignationsTable = () => {
  const { rutaLocal } = useGlobalContext();

  const [allAssignamentData, setAllAssignament] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssignation, setCurrentAssignation] = useState(null);
  const [users, setUsers] = useState([]);
  const [machines, setMachines] = useState([]);

  console.log(allAssignamentData);

  // Función para obtener todas las asignaciones
  const fetchAssignations = async () => {
    try {
      const response = await fetch(`${rutaLocal}allassign`);
      const data = await response.json();
      setAllAssignament(data);
    } catch (error) {
      console.error('Error fetching assignations:', error);
    }
  };

  // Función para obtener usuarios y máquinas para los selects
  const fetchUsersAndMachines = async () => {
    try {
      const usersResponse = await fetch(`${rutaLocal}users`);
      const usersData = await usersResponse.json();
      setUsers(usersData);

      const machinesResponse = await fetch(`${rutaLocal}machines`);
      const machinesData = await machinesResponse.json();
      setMachines(machinesData);
    } catch (error) {
      console.error('Error fetching users or machines:', error);
    }
  };

  // Efecto para cargar las asignaciones y datos de usuarios y máquinas al montar el componente
  useEffect(() => {
    fetchAssignations();
    fetchUsersAndMachines();
  }, []);

  // Función para eliminar una asignación por su ID
  const handleDeleteAssignation = async (id) => {
    try {
      const response = await fetch(`${rutaLocal}allassign/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Actualizar la lista de asignaciones después de eliminar
        fetchAssignations();
      } else {
        console.error('Error deleting assignation');
      }
    } catch (error) {
      console.error('Error deleting assignation:', error);
    }
  };

  // Función para abrir el modal de edición con los datos actuales
  const handleEditAssignation = (assignation) => {
    setCurrentAssignation(assignation);
    setIsModalOpen(true);

  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentAssignation(null);
  };

  // Función para actualizar una asignación por su ID
  const handleUpdateAssignation = async () => {
    console.log('Updating assignation:', currentAssignation);  // Agrega un log para depuración
    try {
      const response = await fetch(`${rutaLocal}allassign/${currentAssignation.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentAssignation)
      });
      if (response.ok) {
        fetchAssignations();
        handleCloseModal();
      } else {
        console.error('Error updating assignation');
      }
    } catch (error) {
      console.error('Error updating assignation:', error);
    }
  };
  

  // Manejar el cambio de los campos de entrada del modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to ${value}`);  // Agrega un log para depuración
    setCurrentAssignation((prev) => ({ ...prev, [name]: value }));
  };
  

  return (
    <>
      <div className="overflow-x-auto mt-40">
      <h2 className='text-4xl p-2'>Tabla de asignaciones</h2>
        <table className="table table-xs table-pin-rows table-pin-cols text-center border border-gray-200 p-2">
          <thead>
            <tr>
              <th>Codigo</th>
              <td>Maquina</td>
              <td>Referencia</td>
              <td>H.asignada</td>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allAssignamentData.map((data) => (
              <tr key={data.id}>
                <th>{data.id_usuarios}</th>
                <td>{data.maquina}</td>
                <td>{data.nombre_referencia}</td>
                <td>{data.horas_asignadas}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm m-2"
                    onClick={() => handleDeleteAssignation(data.id)}
                  >
                    Borrar
                  </button>
                  <button
                    className="btn btn-primary btn-sm m-2"
                    onClick={() => handleEditAssignation(data)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>Codigo</th>
              <td>Maquina</td>
              <td>Capacidad</td>
              <th></th>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Modal de edición */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h2 className="font-bold text-lg">Editar Asignación</h2>
            <div className="py-4">

              <select
                name="nombre_usuario"
                value={currentAssignation.id_usuarios}
                onChange={handleInputChange}
                className="select select-bordered w-full mb-2"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id_usuarios}>
                    {user.id_usuarios}
                  </option>
                ))}
              </select>

              <select
                name="nombre_maquina"
                value={currentAssignation.nombre_maquina}
                onChange={handleInputChange}
                className="select select-bordered w-full mb-2"
              >
                {machines.map((machine) => (
                  <option key={machine.id} value={machine.maquina}>
                    {machine.maquina}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="nombre_referencia"
                value={currentAssignation.nombre_referencia}
                onChange={handleInputChange}
                className="input input-bordered w-full mb-2"
                placeholder="Nombre de Referencia"
              />
              <input
                type="number"
                name="horas_asignadas"
                value={currentAssignation.horas_asignadas}
                onChange={handleInputChange}
                className="input input-bordered w-full mb-2"
                placeholder="Horas Asignadas"
              />
            </div>
            <div className="modal-action">
              <button
                className="btn"
                onClick={handleUpdateAssignation}
              >
                Guardar
              </button>
              <button
                className="btn"
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignationsTable;
