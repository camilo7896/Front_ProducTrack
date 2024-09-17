import React from 'react';
import { FaMedal, FaTrophy } from 'react-icons/fa'; // Importar íconos adicionales

const messages = [
  "¡Sigue esforzándote, vas muy bien!",
  "¡Estás en el camino correcto, no te detengas!",
  "¡Gran trabajo! ¡Puedes alcanzar a los de arriba!",
  "¡Impresionante! ¡Un poco más y estarás en el top 3!",
  "¡Estás haciendo un excelente trabajo!",
  "¡No te rindas, cada esfuerzo cuenta!",
  "¡Estás cerca de los primeros puestos!",
  "¡Mantén el ritmo, el top 10 está a la vista!",
  "¡Tu rendimiento es notable, sigue así!",
  "¡Tienes lo necesario para superar tu puesto!"
];

const getRandomMessage = (index) => {
  const positionMessages = [
    "¡Eres el campeón, sigue brillando!",
    "¡Gran trabajo en el segundo lugar!",
    "¡Estás en el podio, sigue presionando!",
    "¡Excelente, estás en el cuarto lugar!",
    "¡Quinto puesto, pero puedes más!",
    "¡Sexto lugar, mantén el esfuerzo!",
    "¡Séptimo lugar, no te detengas!",
    "¡Octavo puesto, estás en el top 10!",
    "¡Noveno lugar, excelente trabajo!",
    "¡Décimo puesto, sigue subiendo!"
  ];

  return positionMessages[index] || messages[Math.floor(Math.random() * messages.length)];
};

const RaceRanking = ({ rankingList }) => {
  const sortedRankingList = [...rankingList].reverse();

  return (
    <div className="p-6 bg-gradient-to-r from-blue-800 via-black to-gray-800 min-h-screen">
      <h1 className="text-5xl font-extrabold mb-8 text-center text-yellow-100 drop-shadow-xl">Ranking de Operarios</h1>
      <div className="relative h-96 overflow-y-auto">
        <div className="pt-20 relative space-y-4 bg-[url('https://www.transparenttextures.com/patterns/45-degree-fabric-light.png')] bg-gray-800 border-4 border-yellow-600 rounded-lg overflow-hidden shadow-2xl p-4">
          <div className="absolute top-4 right-4 bg-yellow-500 text-black rounded-full p-2 text-xs font-bold">
            Total: {sortedRankingList.length}
          </div>
          {sortedRankingList.map((operator, index) => (
            <div
              key={operator.userId}
              className="flex items-center p-5"
              style={{
                transform: `translateY(-50%)`,
              }}
            >
              <div className="relative">
                <FaMedal className={`text-6xl ${index < 3 ? 'text-yellow-500' : 'text-gray-500'} bg-gray-900 rounded-full border-4 border-yellow-400 shadow-2xl p-2`} />
                {index === 0 && <FaTrophy className="absolute top-[-2.5rem] left-[-2rem] text-5xl text-yellow-500" />} {/* Trofeo para el primer lugar */}
                <div className="absolute top-[-2.5rem] left-[-1rem] bg-yellow-500 text-black rounded-full p-2 text-xs font-bold">
                  {index + 1}
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-white">{operator.userId}</div>
                <div className="text-md text-gray-200">Puesto: {index + 1}</div>
                <div className="text-md text-gray-300">Registros: {operator.recordCount}</div>
                <div className="text-md text-gray-300">Eficiencia: {operator.efficiency}%</div>
                <div className="text-md text-green-300 mt-2">{getRandomMessage(index)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RaceRanking;
