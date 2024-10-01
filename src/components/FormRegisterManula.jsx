import { useState } from 'react';
import axios from 'axios';

const ManualRegisterForm = () => {
  const [registro, setRegistro] = useState({
    id_usuarioRegistrador: '',
    horometro_inicial: '',
    horometro_final: '',
    registro_maquina: '',
    hora_asignadaRegistrador: '',
    id_asignacion: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegistro((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:3000/manual-register', registro);
      alert('Registro creado exitosamente');
      // Opcional: Resetear el formulario
      setRegistro({
        id_usuarioRegistrador: '',
        horometro_inicial: '',
        horometro_final: '',
        registro_maquina: '',
        hora_asignadaRegistrador: '',
        id_asignacion: '',
      });
    } catch (error) {
      console.error('Error al crear el registro:', error);
      alert('Error al crear el registro');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        ID Usuario Registrador:
        <input type="text" name="id_usuarioRegistrador" value={registro.id_usuarioRegistrador} onChange={handleChange} required />
      </label>
      <label>
        Horómetro Inicial:
        <input type="number" name="horometro_inicial" value={registro.horometro_inicial} onChange={handleChange} required />
      </label>
      <label>
        Horómetro Final:
        <input type="number" name="horometro_final" value={registro.horometro_final} onChange={handleChange} required />
      </label>
      <label>
        Registro Máquina:
        <input type="text" name="registro_maquina" value={registro.registro_maquina} onChange={handleChange} required />
      </label>
      <label>
        Hora Asignada Registrador:
        <input type="datetime-local" name="hora_asignadaRegistrador" value={registro.hora_asignadaRegistrador} onChange={handleChange} required />
      </label>
      <label>
        ID Asignación (opcional):
        <input type="text" name="id_asignacion" value={registro.id_asignacion} onChange={handleChange} />
      </label>
      <button type="submit" disabled={isSubmitting}>Crear Registro</button>
    </form>
  );
};

export default ManualRegisterForm;
