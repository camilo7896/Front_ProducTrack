import { useGlobalContext } from "../context/UserContext";

export default function FormReference() {
  const { setReferencesData } = useGlobalContext();

  const sendData = async (e) => {
    e.preventDefault();
    let target = e.target;
    let id_referencia = target.id_referencia.value;
    let nombre_referencia = target.nombre_referencia.value;
    let codigo_referencia = target.codigo_referencia.value;

    let createReference = {
      id_referencia: id_referencia,
      nombre_referencia: nombre_referencia,
      codigo_referencia: codigo_referencia,
    };

    try {
      const response = await fetch('http://localhost:3000/api/reference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createReference)
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Success:', data);
        alert("Creado exitosamente");
        setReferencesData(createReference);
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
      <h2 className="font-semibold text-center">Crear referencia</h2>
      <form className="flex flex-col" onSubmit={sendData}>
        <input
          type="number"
          placeholder="Id"
          name="id_referencia"
          required
          className="input input-bordered input-primary w-full max-w-xl m-2"
        />
        <input
          type="text"
          placeholder="Nombre de referencia"
          name="nombre_referencia"
          required
          className="input input-bordered input-primary w-full max-w-xl m-2"
        />
        <input
          type="number"
          placeholder="Codigo de referencia"
          name="codigo_referencia"
          required
          className="input input-bordered input-primary w-full max-w-xl m-2"
        />
        <button className="btn btn-info w-full max-w-xl m-2">Enviar</button>
      </form>
    </div>
  );
}
