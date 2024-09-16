import React, { useState } from 'react';
import { useGlobalContext } from '../context/UserContext';

const OperariosEficiencia = ({ allRegisterData }) => {
  const { searchTermUser, searchTermMachine, startDate, endDate } = useGlobalContext();
  const [searchTermOperario, setSearchTermOperario] = useState('');

  const parseDate = (dateStr) => new Date(dateStr);

  const filteredData = allRegisterData.filter(user => {
    if (!user) return false;
    const searchLowerUser = searchTermUser.toLowerCase();
    const searchLowerMachine = searchTermMachine.toLowerCase();
    const recordDate = parseDate(user.registro_maquina);

    const withinDateRange = (!startDate || parseDate(startDate) <= recordDate) &&
                            (!endDate || recordDate <= parseDate(endDate));

    return (
      withinDateRange &&
      (user.id_usuarioRegistrador?.toString() || '').toLowerCase().includes(searchLowerUser) &&
      (user.id_asignacion?.toString() || '').toLowerCase().includes(searchLowerMachine)
    );
  });

  const calculateEfficiency = (data) => {
    const efficiencyMap = {};

    data.forEach(user => {
      const initialHours = user.horometro_inicial || 0;
      const finalHours = user.horometro_final || 0;
      const hoursWorked = finalHours - initialHours;

      if (!efficiencyMap[user.id_usuarioRegistrador]) {
        efficiencyMap[user.id_usuarioRegistrador] = {
          totalHours: 0,
          totalEfficiency: 0,
          recordCount: 0,
        };
      }

      const horasAsignadas = user.hora_asignadaRegistrador || 0;
      const registroStandDecimal = (user.registro_standard || 0) / 100;
      const efficiencyValue = (hoursWorked - (registroStandDecimal * horasAsignadas)).toFixed(2);

      efficiencyMap[user.id_usuarioRegistrador].totalHours += hoursWorked;
      efficiencyMap[user.id_usuarioRegistrador].totalEfficiency += parseFloat(efficiencyValue);
      efficiencyMap[user.id_usuarioRegistrador].recordCount += 1;
    });

    return Object.entries(efficiencyMap).map(([userId, { totalHours, totalEfficiency, recordCount }]) => ({
      userId,
      totalHours: totalHours.toFixed(2),
      totalEfficiency: totalEfficiency.toFixed(2),
      recordCount,
      averageEfficiency: recordCount > 0 ? (totalEfficiency / recordCount).toFixed(2) : 0,
    })).sort((a, b) => b.recordCount - a.recordCount || b.averageEfficiency - a.averageEfficiency); // Sort by record count and efficiency
  };

  const efficiencyList = calculateEfficiency(filteredData);

  // Filter the list based on searchTermOperario
  const filteredList = searchTermOperario
    ? efficiencyList.filter(operator => operator.userId === searchTermOperario)
    : efficiencyList;

  return (
    <aside className="w-1/4 p-6 bg-gradient-to-r from-blue-950 via-gray-400 to-black text-gray rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Ranking de Eficiencia de Operarios</h2>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por código de operario..."
          value={searchTermOperario}
          onChange={(e) => setSearchTermOperario(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      <ul className="space-y-4">
        {filteredList.length > 0 ? (
          filteredList.map((operator, index) => (
            <li key={operator.userId} className="p-4 bg-white text-black rounded-lg shadow-md">
            <span className="font-extrabold text-cyan-800">Puesto {efficiencyList.findIndex(op => op.userId === operator.userId) + 1}:</span> <br />
              Operario: <span className="font-bold text-cyan-800">{operator.userId}</span>, 
              Registros: <span className="font-bold text-cyan-800">{operator.recordCount}</span>, <br />
              Eficiencia Promedio: <span className={`font-bold ${operator.averageEfficiency < -0.1 ? 'text-red-500' : 'text-green-500'}`}>{operator.averageEfficiency}</span>
            </li>
          ))
        ) : (
          <li className="p-4 bg-white text-black rounded-lg shadow-md">No hay datos disponibles</li>
        )}
      </ul>
    </aside>
  );
};

export default OperariosEficiencia;
