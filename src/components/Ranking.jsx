import { useState, useEffect } from 'react';
import { useGlobalContext } from "../context/UserContext";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import goldMedalImage from '../images/caballo_oro.png';
import silverMedalImage from '../images/caballlo_plata.png';
import bronzeMedalImage from '../images/bronce.jpeg';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Ranking() {
  const { allRegisterData, searchTermUser, searchTermMachine, setEfficiency } = useGlobalContext();
  const [topThree, setTopThree] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  // Funciones de formato y parseo de fechas
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date();
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}`);
  };

  // Función para obtener el primer y último día del mes
  const getMonthRange = (month) => {
    const [year, monthStr] = month.split('-');
    const firstDay = new Date(year, monthStr - 1, 1);
    const lastDay = new Date(year, monthStr, 0);
    return { firstDay, lastDay };
  };

  // Función para obtener el primer y último día del año
  const getYearRange = (year) => {
    const firstDay = new Date(year, 0, 1);
    const lastDay = new Date(year, 11, 31);
    return { firstDay, lastDay };
  };

  // Filtrado de datos usando useMemo para evitar cálculos innecesarios
  useEffect(() => {
    const { firstDay, lastDay } = monthFilter
      ? getMonthRange(monthFilter)
      : yearFilter
      ? getYearRange(yearFilter)
      : { firstDay: new Date(0), lastDay: new Date() };

    const filtered = allRegisterData.filter(user => {
      if (!user) return false;
      const searchLowerUser = searchTermUser.toLowerCase();
      const searchLowerMachine = searchTermMachine.toLowerCase();
      const recordDate = formatDate(user.registro_maquina);

      const withinDateRange = (!parseDate(recordDate) || parseDate(recordDate) >= firstDay) &&
        (!parseDate(recordDate) || parseDate(recordDate) <= lastDay);

      return (
        withinDateRange &&
        (user.id_usuarioRegistrador?.toString() || '').toLowerCase().includes(searchLowerUser) &&
        (user.id_asignacion?.toString() || '').toLowerCase().includes(searchLowerMachine)
      );
    });
    setFilteredData(filtered);
  }, [allRegisterData, searchTermUser, searchTermMachine, monthFilter, yearFilter]);

  useEffect(() => {
    const groupedData = filteredData.reduce((acc, user) => {
      const initialHours = user.horometro_inicial || 0;
      const finalHours = user.horometro_final || 0;
      const hoursWorked = finalHours - initialHours;
      const registroStand = user.registro_standard || 0;
      const horasAsignadas = user.hora_asignadaRegistrador || 0;
      const registroStandDecimal = registroStand / 100;
      const efficiencyValue = (hoursWorked - (registroStandDecimal * horasAsignadas)).toFixed(2);
  
      if (!acc[user.id_usuarioRegistrador]) {
        acc[user.id_usuarioRegistrador] = {
          totalHours: 0,
          totalStandard: 0,
          totalEfficiency: 0,
          totalRecords: 0, // Añadir total de registros
          id_usuarioRegistrador: user.id_usuarioRegistrador,
        };
      }
  
      acc[user.id_usuarioRegistrador].totalHours += hoursWorked;
      acc[user.id_usuarioRegistrador].totalStandard += registroStand;
      acc[user.id_usuarioRegistrador].totalEfficiency += parseFloat(efficiencyValue);
      acc[user.id_usuarioRegistrador].totalRecords += 1; // Incrementar el conteo de registros
  
      return acc;
    }, {});
  
    const efficiencyData = Object.values(groupedData);
  
    // Ordenar los datos por número de registros y eficiencia total
    const sortedData = efficiencyData.sort((a, b) => {
      if (b.totalRecords === a.totalRecords) {
        return Math.abs(a.totalEfficiency) - Math.abs(b.totalEfficiency);
      }
      return b.totalRecords - a.totalRecords;
    });
    setTopThree(sortedData.slice(0, 3));
  
    // Calcular la eficiencia global
    const totalHours = efficiencyData.reduce((acc, item) => acc + item.totalHours, 0);
    const totalStandard = efficiencyData.reduce((acc, item) => acc + item.totalStandard, 0);
    const overallEfficiency = totalStandard > 0 ? (totalHours / (totalStandard / 100)) * 100 : 0;
    setEfficiency(overallEfficiency.toFixed(2));
  }, [filteredData, setEfficiency]);
  
  

  // Datos para la gráfica
  const chartData = {
    labels: topThree.map(item => `Código: ${item.id_usuarioRegistrador}`),
    datasets: [{
      label: 'Eficiencia (%)',
      data: topThree.map(item => item.totalEfficiency.toFixed(2)),
      backgroundColor: topThree.map((_, index) => index === 0 ? 'rgba(119, 215, 0, 0.8)' : index === 1 ? 'rgba(205, 127, 50, 0.2)' : 'rgba(205, 127, 50, 0.2)'),
      borderColor: topThree.map((_, index) => index === 0 ? 'rgba(255, 215, 0, 1)' : index === 1 ? 'rgba(192, 192, 192, 1)' : 'rgba(205, 127, 50, 1)'),
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Eficiencia: ${tooltipItem.raw}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `${value}%`;
          }
        }
      }
    }
  };

  return (
    <>
      <div className="bg-slate-700 text-white rounded-xl p-3">
        <h2 className='font-semibold text-3xl text-center'>Picado</h2>
        <h3 className="font-semibold text-lg text-center m-5">Trabajadores del mes</h3>

        {/* Filtros de fecha y hora */}
        <div className="flex justify-center text-black flex-wrap">
          <input
            type="month"
            value={monthFilter}
            onChange={(e) => {
              setMonthFilter(e.target.value);
              setYearFilter(''); // Limpiar el filtro de año si se aplica el filtro de mes
            }}
            className="p-2 rounded-md border border-gray-300 m-2"
          />
          <input
            type="number"
            placeholder="Ingresa el año"
            value={yearFilter}
            onChange={(e) => {
              setYearFilter(e.target.value);
              setMonthFilter(''); // Limpiar el filtro de mes si se aplica el filtro de año
            }}
            className="p-2 rounded-md border border-gray-300 m-2"
          />
        </div>

        <div className="flex justify-around flex-wrap mt-4">
  {topThree.map((item, index) => (
    <div key={item.id_usuarioRegistrador} className={`m-4 p-4 border rounded-lg ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-silver-200' : 'bg-bronze-200'} flex items-center space-x-4`}>
      <img
        src={index === 0 ? goldMedalImage : index === 1 ? silverMedalImage : bronzeMedalImage} // Imágenes de medallas
        alt={`Medalla ${index + 1}`}
        className="w-16 h-16 rounded-full p-2 border border-l-cyan-50"
      />
      <div>
        <p className="font-bold">{index + 1}° Puesto</p>
        <p>Código: {item.id_usuarioRegistrador}</p>
        <p className='font-semibold'>Eficiencia: {item.totalEfficiency.toFixed(2)} %</p>
        <p>Número de registros: {item.totalRecords}</p> {/* Mostrar el número de registros */}
      </div>
    </div>
  ))}
</div>

        <div className='flex justify-center'>
          <div className="m-4 md:m-8 bg-white p-4 md:p-10 rounded-3xl w-full max-w-4xl">
            <h3 className="font-semibold text-lg text-center mb-4">Eficiencia de los Top 3</h3>
            <div className="relative h-64 md:h-80">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
