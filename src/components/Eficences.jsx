import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from "../context/UserContext";
import { RiRefreshLine } from '@remixicon/react';
import { Button } from '@tremor/react';
import CardPicadoComponent from './CardPicadoComponent';

export default function Eficences() {
  const { allRegisterData, searchTermUser, setSearchTermUser, searchTermMachine, setSearchTermMachine, startDate, setTotalHours, setStartDate, endDate, setEndDate, setTotalStandard, setEfficiency, setTotalEfficiency } = useGlobalContext();

  const [meta, setMeta] = useState(0);

  const navigate = useNavigate();

  const handleSearchChangeUser = (e) => setSearchTermUser(e.target.value);
  const handleSearchChangeMachine = (e) => setSearchTermMachine(e.target.value);
  const handleStartDateChange = (e) => setStartDate(formatDate(e.target.value));
  const handleEndDateChange = (e) => setEndDate(formatDate(e.target.value));
  const handleResetDates = () => {
    setStartDate('');
    setEndDate('');
  };

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return new Date(`${year}-${month}-${day}`);
  };

  const filteredData = allRegisterData.filter(user => {
    if (!user) return false;
    const searchLowerUser = searchTermUser.toLowerCase();
    const searchLowerMachine = searchTermMachine.toLowerCase();
    const recordDate = formatDate(user.registro_maquina);

    const withinDateRange = (!startDate || formatDate(startDate) <= recordDate) &&
                            (!endDate || recordDate <= formatDate(endDate));

    return (
      withinDateRange &&
      (user.id_usuarioRegistrador?.toString() || '').toLowerCase().includes(searchLowerUser) &&
      (user.id_asignacion?.toString() || '').toLowerCase().includes(searchLowerMachine)
    );
  }).sort((a, b) => formatDate(b.registro_maquina) - formatDate(a.registro_maquina)); // Sort by date descending

  const handleGoBack = () => navigate(-1);

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

    const averageMeta = totalStandard > 0 ? ((totalStandard / filteredData.length) / 100).toFixed(2) : 0;
    setMeta(averageMeta);
    setTotalHours(parseFloat(totalHours.toFixed(1)));
    setTotalStandard(totalStandard);
    setTotalEfficiency(totalEfficiency.toFixed(2));

    const efficiencyValue = totalStandard > 0 ? (totalHours / (totalStandard / 100)) * 100 : 0;
    setEfficiency(efficiencyValue.toFixed(2));

  }, [filteredData]);

  return (
    <>
      <Button className="m-5" onClick={handleGoBack} icon={RiRefreshLine}>Volver</Button>

      <div className='flex justify-around flex-wrap'>
        <div>
          <CardPicadoComponent/>
        </div>

        <div className="mx-auto max-w-full mt-4">
          <div className="flex flex-col mb-4 space-y-4">
            <div className='flex justify-center'>
              <input
                type="text"
                placeholder="Buscar por usuario..."
                value={searchTermUser}
                onChange={handleSearchChangeUser}
                className="input input-bordered w-full max-w-xs m-1"
              />
              <input
                type="text"
                placeholder="Buscar por máquina..."
                value={searchTermMachine}
                onChange={handleSearchChangeMachine}
                className="input input-bordered w-full max-w-xs m-1"
              />
            </div>
            <div className='flex justify-center'>
              <div className="flex space-x-4 mt-4">
                <input
                  type="date"
                  value={startDate ? startDate.split('-').reverse().join('-') : ''}
                  onChange={handleStartDateChange}
                  className="input input-bordered w-full max-w-xs"
                />
                <input
                  type="date"
                  value={endDate ? endDate.split('-').reverse().join('-') : ''}
                  onChange={handleEndDateChange}
                  className="input input-bordered w-full max-w-xs"
                />
              </div>
            </div>
            <button
              onClick={handleResetDates}
              className="btn btn-primary w-full"
            >
              Restablecer Fechas
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-xs min-w-full">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Codigo</th>
                  <th>Maquina</th>
                  <th>Referencia</th>
                  <th>H.Incial</th>
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
                    const observciones = user.observaciones || [];
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
                        <td>{observciones}</td>
                        <td>{horasAsignadas}</td>
                        <td>{registroStand}</td>
                        <td>{meta} %</td>
                        <td className={efficiencyValue < -0.1 ? 'text-red-500' : 'text-green-500'}>{efficiencyValue}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="11">No hay registros disponibles</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
