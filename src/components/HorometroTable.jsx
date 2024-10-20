import { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateModal from './UpdateModal';
import DataForm from './DataForm'; // Importa el nuevo componente
import { Button } from '@tremor/react';
import { RiRefreshLine } from '@remixicon/react';
import { useNavigate } from 'react-router-dom';

const RegisterTable = () => {
  const [registers, setRegisters] = useState([]);
  const [originalRegisters, setOriginalRegisters] = useState([]); // Para guardar el estado original
  const [selectedRegister, setSelectedRegister] = useState(null); // Para almacenar el registro a editar
  const [showTable, setShowTable] = useState(true); // Para manejar la visibilidad de la tabla
  const [showForm, setShowForm] = useState(false); // Para manejar la visibilidad del formulario
  const [searchTerm, setSearchTerm] = useState(''); // Estado para almacenar el término de búsqueda

  useEffect(() => {
    const fetchRegisters = async () => {
      try {
        const response = await axios.get('http://192.168.0.19:3000/api/horometro-all');
        setRegisters(response.data);
        setOriginalRegisters(response.data); // Guardar una copia del estado original
      } catch (error) {
        console.error('Error al obtener los registros:', error);
      }
    };

    fetchRegisters();
  }, []);

  const handleUpdateClick = (register) => {
    setSelectedRegister(register);
    setShowTable(false);
  };

  const handleCloseModal = () => {
    setSelectedRegister(null);
    setShowTable(true);
  };

  const navigate = useNavigate();

  const handleGoBack = () => navigate(-1);

  const isModified = (register) => {
    const original = originalRegisters.find((orig) => orig.id_registro === register.id_registro);
    return original && (
      register.horometro_inicial !== original.horometro_inicial ||
      register.horometro_final !== original.horometro_final ||
      register.observaciones !== original.observaciones ||
      register.hora_asignadaRegistrador !== original.hora_asignadaRegistrador
    );
  };

  // Función para refrescar los registros después de enviar datos
  const refreshRegisters = async () => {
    try {
      const response = await axios.get('http://192.168.0.19:3000/api/horometro-all');
      setRegisters(response.data);
      setOriginalRegisters(response.data); // Actualiza la copia del estado original
    } catch (error) {
      console.error('Error al obtener los registros:', error);
    }
  };

  // Función para manejar el cambio en el campo de búsqueda
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtrar los registros en función del término de búsqueda
  const filteredRegisters = registers.filter((register) =>
    register.id_registro.toString().includes(searchTerm) ||
    register.registro_maquina.toLowerCase().includes(searchTerm.toLowerCase()) ||
    register.id_usuarioRegistrador.toString().includes(searchTerm)
  );

  return (
    <div className="container mx-auto p-6">
      {showTable ? (
        <>
          <div className="mb-4 flex justify-between">
            <div>
              <Button className="m-5" onClick={handleGoBack} icon={RiRefreshLine}>Volver</Button>
              <Button className="m-5" onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Ocultar Formulario' : 'Agregar Registro'}
              </Button>
            </div>

            {/* Agregar campo de búsqueda */}
            <div className="flex items-center">
              <label htmlFor="search" className="mr-2">Buscar:</label>
              <input
                id="search"
                type="text"
                className="input input-bordered"
                placeholder="Buscar por ID, Fecha, Operario..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {showForm && <DataForm onSubmit={refreshRegisters} />} {/* Agregar el formulario */}
          
          {/* Mostrar el número total de registros */}
          <h1 className="text-2xl font-bold mb-4">Tabla de Registros (Total: {filteredRegisters.length})</h1>
          
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Maquina</th>
                  <th>Operario</th>
                  <th>Horómetro Inicial</th>
                  <th>Horómetro Final</th>
                  <th>Observaciones</th>
                  <th>Hora asignada</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegisters.map((register) => (
                  <tr key={register.id_registro}>
                    <td>{register.id_registro}</td>
                    <td>{register.registro_maquina}</td>
                    <td>{register.id_asignacion}</td>

                    <td>{register.id_usuarioRegistrador}</td>

                    <td className={isModified(register) ? 'bg-warning/20' : ''}>
                      {register.horometro_inicial}
                    </td>
                    <td className={isModified(register) ? 'bg-warning/20' : ''}>
                      {register.horometro_final}
                    </td>
                    <td className={isModified(register) ? 'bg-warning/20' : ''}>
                      {register.observaciones}
                    </td>
                    <td className={isModified(register) ? 'bg-warning/20' : ''}>
                      {register.hora_asignadaRegistrador}
                    </td>

                    <td>
                      <button
                        className={`btn mr-2 ${isModified(register) ? 'btn-error' : 'btn-primary'}`}
                        onClick={() => handleUpdateClick(register)}
                      >
                        {isModified(register) ? 'Editado' : 'Actualizar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="mt-4">
          <button
            className="btn btn-secondary"
            onClick={handleCloseModal}
          >
            Volver a la Tabla
          </button>
          {selectedRegister && (
            <UpdateModal
              register={selectedRegister}
              setSelectedRegister={setSelectedRegister}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default RegisterTable;
