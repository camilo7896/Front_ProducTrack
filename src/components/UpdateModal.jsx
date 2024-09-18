import React, { useState } from 'react';
import axios from 'axios';

const UpdateModal = ({ register, setSelectedRegister }) => {
  const [formData, setFormData] = useState({
    horometro_inicial: register.horometro_inicial,
    horometro_final: register.horometro_final,
    observaciones: register.observaciones,
    registro_maquina: register.registro_maquina,
    id_usuarioRegistrador: register.id_usuarioRegistrador,
    hora_asignadaRegistrador: register.hora_asignadaRegistrador,
    registro_referencia: register.registro_referencia,
    registro_standard: register.registro_standard,
  });

  const [alert, setAlert] = useState({ visible: false, message: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ visible: false, message: '', type: '' }); // Reset alert before submission

    try {
      const response = await axios.patch(
        `http://192.168.0.19:3000/api/horometro-all/${register.id_registro}`,
        formData
      );
      console.log('Registro actualizado:', response.data);
      setAlert({ visible: true, message: 'Registro actualizado exitosamente.', type: 'success' });
      setSelectedRegister(null); // Cierra el modal
    } catch (error) {
      console.error('Error al actualizar el registro:', error);
      setAlert({ visible: true, message: 'Error al actualizar el registro.', type: 'error' });
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h2 className="font-bold text-lg mb-4">Actualizar Registro</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-4">
            <label className="label">Horómetro Inicial</label>
            <input
              type="number"
              name="horometro_inicial"
              value={formData.horometro_inicial}
              onChange={handleChange}
              className="input input-bordered"
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">Horómetro Final</label>
            <input
              type="number"
              name="horometro_final"
              value={formData.horometro_final}
              onChange={handleChange}
              className="input input-bordered"
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">Observaciones</label>
            <input
              type="text"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              className="input input-bordered"
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">Hora Asignada</label>
            <input
              type="text"
              name="hora_asignadaRegistrador"
              value={formData.hora_asignadaRegistrador}
              onChange={handleChange}
              className="input input-bordered"
            />
          </div>

          <div className="modal-action">
            <button type="submit" className="btn btn-success">
              Guardar Cambios
            </button>
            <button
              type="button"
              className="btn btn-error"
              onClick={() => setSelectedRegister(null)}
            >
              Cancelar
            </button>
          </div>
        </form>

        {alert.visible && (
          <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'} mt-4`}>
            <div>
              <span>{alert.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateModal;
