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

  const calculateData = (data) => {
    const dataMap = {};

    data.forEach(user => {
      const recordDate = parseDate(user.registro_maquina).toLocaleDateString(); // Parse date to a string

      if (!dataMap[user.id_usuarioRegistrador]) {
        dataMap[user.id_usuarioRegistrador] = {
          recordCount: 0,
          uniqueDays: new Set(), // Store unique dates
        };
      }

      dataMap[user.id_usuarioRegistrador].recordCount += 1;
      dataMap[user.id_usuarioRegistrador].uniqueDays.add(recordDate); // Add the date to the set of unique days
    });

    return Object.entries(dataMap).map(([userId, { recordCount, uniqueDays }]) => ({
      userId,
      recordCount,
      uniqueDaysCount: uniqueDays.size, // Count of unique days worked
    })).sort((a, b) => b.recordCount - a.recordCount); // Sort by record count
  };

  const dataList = calculateData(filteredData);

  // Filter the list based on searchTermOperario
  const filteredList = searchTermOperario
    ? dataList.filter(operator => operator.userId === searchTermOperario)
    : dataList;

  return (
    <aside className="w-1/4 p-6 bg-gradient-to-r from-blue-950 via-gray-400 to-black text-gray rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Ranking de Operarios</h2>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por código de operario..."
          value={searchTermOperario}
          onChange={(e) => setSearchTermOperario(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      <div className="max-h-80 overflow-y-auto">
        <ul className="space-y-4">
          {filteredList.length > 0 ? (
            filteredList.map((operator, index) => (
              <li key={operator.userId} className="p-4 bg-white text-black rounded-lg shadow-md">
                <span className="font-extrabold text-cyan-800">Puesto {dataList.findIndex(op => op.userId === operator.userId) + 1}:</span> <br />
                Operario: <span className="font-bold text-cyan-800">{operator.userId}</span>, <br />
                Registros: <span className="font-bold text-cyan-800">{operator.recordCount}</span>, <br />
                Días Trabajados: <span className="font-bold text-cyan-800">{operator.uniqueDaysCount}</span>
              </li>
            ))
          ) : (
            <li className="p-4 bg-white text-black rounded-lg shadow-md">No hay datos disponibles</li>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default OperariosEficiencia;
