import React, { useState } from 'react';
import axios from 'axios';

const DataForm = () => {
    const [registros, setRegistros] = useState([{
        id_asignacion: '',
        horometro_inicial: '',
        horometro_final: '',
        registro_maquina: '',
        id_usuarioRegistrador: '',
        registro_referencia: '',
        hora_asignadaRegistrador: '',
        observaciones: '',
        registro_standard: ''
    }]);

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newRegistros = [...registros];
        newRegistros[index][name] = value;
        setRegistros(newRegistros);
    };

    const handleAddRegistro = () => {
        setRegistros([...registros, {
            id_asignacion: '',
            horometro_inicial: '',
            horometro_final: '',
            registro_maquina: '',
            id_usuarioRegistrador: '',
            registro_referencia: '',
            hora_asignadaRegistrador: '',
            observaciones: '',
            registro_standard: ''
        }]);
    };

    const handleRemoveRegistro = (index) => {
        const newRegistros = registros.filter((_, i) => i !== index);
        setRegistros(newRegistros);
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        try {
            // Envío de datos a la base de datos
            const response = await axios.post('http://192.168.0.19:3000/api/user-machines', registros);
            console.log('Respuesta:', response.data);
            alert('Registros creados exitosamente'); // Mensaje de éxito
        } catch (error) {
            console.error('Error al enviar los datos:', error.response ? error.response.data : error.message);
            alert('Error al crear registros'); // Mensaje de error
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-base-200 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-center mb-4">Registrar Horómetros</h2>
            <form onSubmit={handleSubmit}>
                {registros.map((registro, index) => (
                    <div key={index} className="mb-4">
                        <input
                            type="text"
                            name="id_asignacion"
                            placeholder="Maquina"
                            value={registro.id_asignacion}
                            onChange={(event) => handleInputChange(index, event)}
                            required
                            className="input input-bordered w-full mb-2"
                        />
                        <input
                            type="number"
                            name="horometro_inicial"
                            placeholder="Horómetro Inicial"
                            value={registro.horometro_inicial}
                            onChange={(event) => handleInputChange(index, event)}
                            required
                            className="input input-bordered w-full mb-2"
                        />
                        <input
                            type="number"
                            name="horometro_final"
                            placeholder="Horómetro Final"
                            value={registro.horometro_final}
                            onChange={(event) => handleInputChange(index, event)}
                            required
                            className="input input-bordered w-full mb-2"
                        />
                        <input
                            type="date"
                            name="registro_maquina"
                            placeholder="Fecha"
                            value={registro.registro_maquina}
                            onChange={(event) => handleInputChange(index, event)}
                            required
                            className="input input-bordered w-full mb-2"
                        />
                        <input
                            type="text"
                            name="id_usuarioRegistrador"
                            placeholder="Codigo Operario"
                            value={registro.id_usuarioRegistrador}
                            onChange={(event) => handleInputChange(index, event)}
                            required
                            className="input input-bordered w-full mb-2"
                        />
                       <input
    type="text"
    name="registro_referencia" // Cambia "Referencia" a "registro_referencia"
    placeholder="Registro Referencia"
    value={registro.registro_referencia}
    onChange={(event) => handleInputChange(index, event)}
    required
    className="input input-bordered w-full mb-2"
/>

                        <input
                            type="number"
                            name="hora_asignadaRegistrador"
                            placeholder='horas asignadas'
                            value={registro.hora_asignadaRegistrador}
                            onChange={(event) => handleInputChange(index, event)}
                            required
                            className="input input-bordered w-full mb-2"
                        />
                        <input
                            type="text"
                            name="observaciones"
                            placeholder="Observaciones"
                            value={registro.observaciones}
                            onChange={(event) => handleInputChange(index, event)}
                            className="input input-bordered w-full mb-2"
                        />
                        <input
                            type="text"
                            name="registro_standard"
                            placeholder="Standard"
                            value={registro.registro_standard}
                            onChange={(event) => handleInputChange(index, event)}
                            className="input input-bordered w-full mb-2"
                        />
                        <button
                            type="button"
                            className="btn btn-outline btn-error w-full"
                            onClick={() => handleRemoveRegistro(index)}
                        >
                            Eliminar Registro
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    className="btn btn-outline btn-success w-full mb-4"
                    onClick={handleAddRegistro}
                >
                    Agregar Registro
                </button>
                <button type="submit" className="btn btn-primary w-full">Enviar</button>
            </form>
        </div>
    );
};

export default DataForm;
