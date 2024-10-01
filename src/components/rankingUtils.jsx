// rankingUtils.js
export const calculateEfficiency = (data) => {
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
  