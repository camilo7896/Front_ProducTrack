import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Importa el plugin de etiquetas de datos

// Register the components of Chart.js and the plugin
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ChartDataLabels);

const MachineHoursChart = ({ data }) => {
  // Extract machine names and hours worked from data
  const labels = data.map(item => `Máquina ${item.machineId}`);
  const hoursWorked = data.map(item => item.totalHoursWorked);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Horas Trabajadas',
        data: hoursWorked,
        backgroundColor: 'rgba(0, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Horas Trabajadas por Máquina',
            },
            datalabels: {
              display: true,
              color: 'black', // Color del texto
              anchor: 'end', // Ancla la etiqueta al final de la barra
              align: 'top',  // Alinea la etiqueta en la parte superior
              formatter: (value) => {
                const roundedValue = Math.round(value); // Redondea el valor
                return `${roundedValue} h`; // Formatea como horas
              },
            },
          },
          animation: {
            duration: 0, // Disable animation
          },
        }}
      />
    </div>
  );
};

export default MachineHoursChart;
