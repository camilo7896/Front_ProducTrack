import { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

const ExportRecords = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [operarioFilter, setOperarioFilter] = useState('');

  useEffect(() => {
    // Función para obtener los registros
    const fetchRecords = async () => {
      try {
        const response = await axios.get('http://192.168.0.19:3000/api/horometro-all');
        setRecords(response.data);
        setFilteredRecords(response.data); // Inicialmente, los registros filtrados son todos los registros
      } catch (error) {
        console.error('Error al obtener los registros:', error);
      }
    };

    fetchRecords();
  }, []);

  // Función para filtrar registros
  const filterRecords = () => {
    console.log('Aplicando filtros...');

    let filtered = [...records];

    // Filtrar por rango de fechas si están definidos
    if (startDate && endDate) {
      filtered = filtered.filter(record => {
        const recordDate = new Date(record.registro_maquina);
        const start = new Date(startDate);
        const end = new Date(endDate);

        console.log('Fecha del registro:', recordDate);
        console.log('Fecha inicio:', start);
        console.log('Fecha fin:', end);

        return recordDate >= start && recordDate <= end;
      });
    }
    
    // Filtrar por operario si el filtro no está vacío
    if (operarioFilter) {
      filtered = filtered.filter(record => {
        console.log('Operario del registro:', record.operario);
        return record.operario && record.operario.includes(operarioFilter);
      });
    }

    console.log('Registros originales:', records);
    console.log('Registros filtrados:', filtered);

    if (filtered.length === 0) {
      alert('No hay registros que coincidan con los filtros aplicados.');
    } else {
      setFilteredRecords(filtered); // Actualiza el estado con los registros filtrados
      alert('Filtros aplicados.');
    }
  };

  // Función para exportar a CSV
  const exportToCSV = (data, filename) => {
    if (data.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Función para manejar el clic en el botón de exportar registros filtrados
  const handleExportFiltered = () => {
    if (filteredRecords.length > 0) {
      exportToCSV(filteredRecords, 'filtered_records.csv');
    } else {
      alert('No hay registros que exportar con los filtros aplicados.');
    }
  };

  // Función para manejar el clic en el botón de exportar todos los registros
  const handleExportAll = () => {
    if (records.length > 0) {
      exportToCSV(records, 'all_records.csv');
    } else {
      alert('No hay registros disponibles para exportar.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Exportar Registros</h1>

      <div className="mb-4">
        <div className="form-control mb-2">
          <label className="label">Fecha de Inicio</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input input-bordered"
          />
        </div>
        <div className="form-control mb-2">
          <label className="label">Fecha de Fin</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="input input-bordered"
          />
        </div>
        <div className="form-control mb-2">
          <label className="label">Operario (Opcional)</label>
          <input
            type="text"
            value={operarioFilter}
            onChange={(e) => setOperarioFilter(e.target.value)}
            className="input input-bordered"
            placeholder="Ingrese operario"
          />
        </div>
        <button
          className="btn btn-primary mr-2"
          onClick={filterRecords}
        >
          Aplicar Filtros
        </button>
      </div>

      <div className="mb-4">
        <button
          className="btn btn-success mr-2"
          onClick={handleExportFiltered}
        >
          Exportar Registros Filtrados
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleExportAll}
        >
          Exportar Todos los Registros
        </button>
      </div>
    </div>
  );
};

export default ExportRecords;
