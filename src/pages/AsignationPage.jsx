import { useState, useEffect } from 'react';
import { useGlobalContext } from "../context/UserContext";
import Navbar from '../components/Navbar';
import CapacityPanel from '../components/CapacityPanel';
import AssignationsTable from '../components/AssignationsTable ';
import { Link } from 'react-router-dom';

const AsignationPage = () => {
  const { data: machinesData, usersData, referencesData, setAssignament, capacity, setCapacity } = useGlobalContext();
  const [searchId, setSearchId] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [machines, setMachines] = useState(Array(5).fill(''));
  const [references, setReferences] = useState(Array(5).fill(''));
  const [times, setTimes] = useState(Array(5).fill(''));
  const [standards, setStandards] = useState(Array(5).fill(''));

  useEffect(() => {
    // Al seleccionar una máquina, actualizar el estándar correspondiente
    machines.forEach((machine, index) => {
      const selectedMachine = machinesData.find(m => m.id_maquinas === parseInt(machine));
      if (selectedMachine) {
        const newStandards = [...standards];
        newStandards[index] = selectedMachine.estandar || '';
        setStandards(newStandards);
      }
    });
  }, [machines, machinesData]);

  const handleSearch = () => {
    const user = usersData.find(user => user.id_usuarios === parseInt(searchId));
    setSelectedUser(user);
  };

  const handleMachineChange = (index, value) => {
    const selectedMachine = machinesData.find(machine => machine.id_maquinas === parseInt(value));
    const machineCapacity = selectedMachine ? selectedMachine.capacidad : 0;

    const currentMachineId = machines[index];
    const previousMachine = machinesData.find(machine => machine.id_maquinas === parseInt(currentMachineId));
    const previousCapacity = previousMachine ? previousMachine.capacidad : 0;

    const capacityDifference = machineCapacity - previousCapacity;
    setCapacity(prevCapacity => prevCapacity + capacityDifference);

    const newMachines = [...machines];
    newMachines[index] = value;
    setMachines(newMachines);

    // Actualizar el estándar en el estado
    const newStandards = [...standards];
    newStandards[index] = selectedMachine ? selectedMachine.estandar || '' : '';
    setStandards(newStandards);

    const newReferences = [...references];
    newReferences[index] = '';
    setReferences(newReferences);

    const newTimes = [...times];
    newTimes[index] = '';
    setTimes(newTimes);
  };

  const handleReferenceChange = (machineIndex, value) => {
    const newReferences = [...references];
    newReferences[machineIndex] = value;
    setReferences(newReferences);
  };

  const handleTimeChange = (machineIndex, value) => {
    const newTimes = [...times];
    newTimes[machineIndex] = value;
    setTimes(newTimes);
  };

  const handleStandardChange = (machineIndex, value) => {
    const newStandards = [...standards];
    newStandards[machineIndex] = value;
    setStandards(newStandards);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      alert('Por favor seleccione un usuario');
      return;
    }

    const asignaciones = machines.map((machine, machineIndex) => ({
      id_usuarioAsignado: selectedUser.id_usuarios,
      id_maquinaAsignada: machine,
      id_referenciaAsignada: references[machineIndex] || null,
      horas_asignadas: times[machineIndex] || null,
      id_standar: standards[machineIndex] || null
    })).filter(asignacion => asignacion.id_maquinaAsignada);

    try {
      const response = await fetch('http://localhost:3000/api/assignations/multiple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(asignaciones)
      });

      if (!response.ok) {
        const errorText = await response.text(); // Obtener texto del error
        console.error('Error:', errorText);
        alert("Error al crear las asignaciones");
        return;
      }

      const data = await response.json();
      console.log('Success:', data);
      alert("Asignaciones creadas exitosamente");
      setAssignament(data);
      setMachines(Array(5).fill(''));
      setReferences(Array(5).fill(''));
      setTimes(Array(5).fill(''));
      setStandards(Array(5).fill(''));
      setCapacity(0);
    } catch (error) {
      console.error('Error:', error);
      alert("Error de conexión");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="p-8 flex-grow">
          <h1 className="text-2xl font-bold mb-4">Asignar Máquinas y Referencias</h1>
          <div className="mb-4 flex items-center">
            <input
              type="text"
              className="input input-bordered w-full max-w-xs"
              placeholder="Buscar por ID de Usuario"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button className="btn btn-primary ml-2" onClick={handleSearch}>Buscar</button>
          </div>

          
               <Link to={'/horometrotable'}>
                <button className="btn join-item m-2">Editar registro</button>
              </Link>

          {selectedUser && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className='flex justify-center items-center flex-col'>
                <h2 className="text-xl font-semibold">Usuario: {selectedUser.nombres} {selectedUser.apellidos}</h2>
                <CapacityPanel />
              </div>

              

              <p className="font-semibold">Capacidad Total Seleccionada: {capacity}%</p>
              {machines.map((machine, machineIndex) => (
                <div key={machineIndex} className="space-y-2">
                  <select
                    className={`select select-bordered w-full max-w-xs ${machine ? 'bg-green-200' : 'bg-white'} m-2`}
                    value={machine}
                    onChange={(e) => handleMachineChange(machineIndex, e.target.value)}
                  >
                    <option value="">Seleccionar Máquina</option>
                    {machinesData.map(machine => (
                      <option key={machine.id_maquinas} value={machine.id_maquinas}>
                        {machine.maquina} - Capacidad: {machine.capacidad}%
                      </option>
                    ))}
                  </select>
                  <select
                    className={`select select-bordered ${references[machineIndex] ? 'bg-green-200' : 'bg-white'} m-5`}
                    value={references[machineIndex]}
                    onChange={(e) => handleReferenceChange(machineIndex, e.target.value)}
                  >
                    <option value="">Seleccionar Referencia</option>
                    {referencesData.map(reference => (
                      <option key={reference.id_referencia} value={reference.id_referencia}>
                        {reference.nombre_referencia}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    className={`input input-bordered w-full max-w-xs ${times[machineIndex] ? 'bg-green-200' : 'bg-white'} m-5`}
                    placeholder="Ingresar Hora"
                    value={times[machineIndex]}
                    onChange={(e) => handleTimeChange(machineIndex, e.target.value)}
                  />
                  <input
                    type="text"
                    className={`input input-bordered w-full max-w-xs ${standards[machineIndex] ? 'bg-green-200' : 'bg-white'} m-5`}
                    placeholder="Ingresar Estándar"
                    value={standards[machineIndex]}
                    onChange={(e) => handleStandardChange(machineIndex, e.target.value)}
                  />
                </div>
              ))}
              <button type="submit" className="btn btn-primary">Asignar</button>
            </form>
          )}
          <AssignationsTable />
        </div>
      </div>
    </>
  );
};

export default AsignationPage;
