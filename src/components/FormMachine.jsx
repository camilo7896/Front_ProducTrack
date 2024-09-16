import { useGlobalContext } from "../context/UserContext";

export default function FormMachine() {
  const { setMachine } = useGlobalContext();

  const sendData = async (e) => {
    e.preventDefault();
    let target = e.target;
    let id_maquinas = target.id_maquinas.value;
    let maquina = target.maquina.value;
    let nombre_maquina = target.nombre_maquina.value;
    let capacidad = target.capacidad.value;

    let createUser = {
      id_maquinas: id_maquinas,
      maquina: maquina,
      nombre_maquina: nombre_maquina,
      capacidad: capacidad,
    };

    try {
      const response = await fetch('http://localhost:3000/api/machines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createUser)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Success:', data);
        alert("Creado exitosamente");
        setMachine(createUser);
        e.target.reset();
      } else {
        console.error('Error:', data);
        alert("Error al crear el usuario");
      }
    } catch (error) {
      console.error('Error:', error);
      alert("Error de conexión");
    }
  };

  return (
    <div className="p-10 content-center">
      <h2 className="font-semibold text-center">Registrar maquina</h2>
      <form className="flex flex-col" onSubmit={sendData}>
        <input
          type="number"
          placeholder="Codigo de maquina"
          name="id_maquinas"
          required
          className="input input-bordered input-warning w-full max-w-xl m-2"
        />
        <input
          type="text"
          placeholder="Maquina"
          name="maquina"
          required
          className="input input-bordered input-warning w-full max-w-xl m-2"
        />
        <input
          type="text"
          placeholder="Nombre de la maquina"
          name="nombre_maquina"
          required
          className="input input-bordered input-warning w-full max-w-xl m-2"
        />
        <input
          type="text"
          placeholder="Capacidad de la maquina"
          name="capacidad"
          required
          className="input input-bordered input-warning w-full max-w-xl m-2"
        />
        <button className="btn btn-info w-full max-w-xl m-2">Enviar</button>
      </form>
    </div>
  );
}
