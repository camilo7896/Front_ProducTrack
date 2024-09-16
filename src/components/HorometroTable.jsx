import { useState, useEffect } from 'react';
import axios from 'axios';
import UpdateModal from './UpdateModal';
import { Button } from '@tremor/react';
import { RiRefreshLine } from '@remixicon/react';
import { useNavigate } from 'react-router-dom';

const RegisterTable = () => {
  const [registers, setRegisters] = useState([]);
  const [selectedRegister, setSelectedRegister] = useState(null); // Para almacenar el registro a editar
  const [showTable, setShowTable] = useState(true); // Para manejar la visibilidad de la tabla

  useEffect(() => {
    // Función para obtener los registros
    const fetchRegisters = async () => {
      try {
        const response = await axios.get('http://192.168.0.19:3000/api/horometro-all');
        setRegisters(response.data);
      } catch (error) {
        console.error('Error al obtener los registros:', error);
      }
    };

    fetchRegisters();
  }, []);

  // Función para abrir el formulario de actualización
  const handleUpdateClick = (register) => {
    setSelectedRegister(register); // Guarda el registro que se quiere actualizar
    setShowTable(false); // Oculta la tabla
  };

  // Función para cerrar el modal y volver a la tabla
  const handleCloseModal = () => {
    setSelectedRegister(null); // Resetea el registro seleccionado
    setShowTable(true); // Muestra la tabla
  };
  const navigate = useNavigate();

  const handleGoBack = () => navigate(-1);


  return (
    <div className="container mx-auto p-6">
      {showTable ? (
        <>
          <div className="mb-4">
            {/* Botón de Volver al inicio (si es necesario) */}
            <Button className="m-5" onClick={handleGoBack} icon={RiRefreshLine}>Volver</Button>


            
          </div>
          <h1 className="text-2xl font-bold mb-4">Tabla de Registros</h1>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <td>Fecha</td>
                  <th>Operario</th>
                  <th>Horómetro Inicial</th>
                  <th>Horómetro Final</th>
                  <th>Observaciones</th>
                  <th>Acciones</th>
                  <th>Hora asignada</th>
                </tr>
              </thead>
              <tbody>
                {registers.map((register) => (
                  <tr key={register.id_registro}>
                    <td>{register.id_registro}</td>
                    <td>{register.registro_maquina}</td>
                    <td>{register.id_usuarioRegistrador}</td>
                    <td>{register.horometro_inicial}</td>
                    <td>{register.horometro_final}</td>
                    <td>{register.observaciones}</td>
                    <td>{register.hora_asignadaRegistrador}</td>
                    <td>
                      <button
                        className="btn btn-primary mr-2"
                        onClick={() => handleUpdateClick(register)}
                      >
                        Actualizar
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
