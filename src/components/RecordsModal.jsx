import { useContext, useEffect, useState } from 'react';
import CardPicadoComponent from './CardPicadoComponent';
import { GlobalContext } from '../context/UserContext';
import { Button } from '@tremor/react';
import { RiRefreshLine } from '@remixicon/react';

const RecordsModal = () => {
  const { data } = useContext(GlobalContext); // Asumiendo que tienes tu data en el GlobalContext
  const [filteredData, setFilteredData] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [totalStandard, setTotalStandard] = useState(0);
  const [totalEfficiency, setTotalEfficiency] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [meta] = useState(0.1); // Asignar algún valor de referencia si es necesario

  useEffect(() => {
    // Filtrar datos para obtener sólo los registros que necesitas (esto dependerá de tus filtros)
    setFilteredData(data);
  }, [data]);

  // Calcular el total de horas trabajadas y otros valores
  useEffect(() => {
    let totalHours = 0;
    let totalStandard = 0;
    let totalEfficiency = 0;

    filteredData.forEach(user => {
      const initialHours = user.horometro_inicial || 0;
      const finalHours = user.horometro_final || 0;
      const hoursWorked = finalHours - initialHours;

      totalHours += hoursWorked;

      if (user.registro_standard) {
        totalStandard += user.registro_standard;
      }

      const horasAsignadas = user.hora_asignadaRegistrador || 0;
      const registroStandDecimal = user.registro_standard / 100;
      const efficiencyValue = (hoursWorked - (registroStandDecimal * horasAsignadas)).toFixed(2);
      totalEfficiency += parseFloat(efficiencyValue);
    });

    setTotalHours(totalHours.toFixed(2)); // Redondear a 2 decimales
    setTotalStandard(totalStandard);
    setTotalEfficiency(totalEfficiency.toFixed(2));

    const efficiencyValue = totalStandard > 0 ? (totalHours / (totalStandard / 100)) * 100 : 0;
    setEfficiency(efficiencyValue.toFixed(2));
  }, [filteredData]);

  // Función para volver atrás (según sea necesario)
  const handleGoBack = () => {
    // Lógica para manejar el botón de regreso
  };

  // Formateo de fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date;
  };

  return (
    <>
      <Button className="m-5" onClick={handleGoBack} icon={RiRefreshLine}>
        Volver
      </Button>

      <div className='flex justify-around flex-wrap'>
        <div>
          <CardPicadoComponent/>
        </div>

        <div className="mx-auto max-w-full mt-4">
          {/* Mostrar el total de horas trabajadas */}
          <div className="total-hours mt-4">
            <h2 className="text-lg font-bold">Total de Horas Trabajadas: {totalHours} horas</h2>
          </div>

          <div className="flex flex-col mb-4 space-y-4">
            {/* Aquí puedes agregar filtros u otros inputs según sea necesario */}
          </div>

          <div className="overflow-x-auto">
            <table className="table table-xs min-w-full">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Codigo</th>
                  <th>Maquina</th>
                  <th>Referencia</th>
                  <th>H.Inicial</th>
                  <th>H.Final</th>
                  <th>H.Trabajadas</th>
                  <th>Observaciones</th>
                  <th>H.Asignada</th>
                  <th>Standar</th>
                  <th>Meta/horas</th>
                  <th>Eficiencia</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((user, index) => {
                    const initialHours = user.horometro_inicial || 0;
                    const finalHours = user.horometro_final || 0;
                    const hoursWorked = (finalHours - initialHours).toFixed(2); // Redondeado a 2 decimales
                    const registroStand = user.registro_standard || 0;
                    const horasAsignadas = user.hora_asignadaRegistrador || 0;
                    const observaciones = user.observaciones || [];
                    const registroStandDecimal = registroStand / 100;
                    const efficiencyValue = (hoursWorked - (registroStandDecimal * horasAsignadas)).toFixed(2);

                    return (
                      <tr key={index}>
                        <td>{formatDate(user.registro_maquina).toLocaleDateString()}</td>
                        <td>{user.id_usuarioRegistrador}</td>
                        <td>{user.id_asignacion}</td>
                        <td>{user.registro_referencia}</td>
                        <td>{initialHours}</td>
                        <td>{finalHours}</td>
                        <td>{hoursWorked}</td> {/* Redondeado a 2 decimales */}
                        <td>{observaciones}</td>
                        <td>{horasAsignadas}</td>
                        <td>{registroStand}</td>
                        <td>{meta} %</td>
                        <td className={efficiencyValue < -0.1 ? 'text-red-500' : 'text-green-500'}>{efficiencyValue}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="12">No hay registros disponibles</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecordsModal;
