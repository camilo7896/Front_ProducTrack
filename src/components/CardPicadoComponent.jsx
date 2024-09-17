import { Card} from '@tremor/react';
import { useGlobalContext } from '../context/UserContext';

export default function CardPicadoComponent() {
    const { totalEfficiency,totalHours} = useGlobalContext();

  return (
    <>
    <div className='flex flex-wrap'>

          <Card className="mx-auto max-w-md">
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Eficiencia picado</p>
            <p className= {`${totalEfficiency < -0.1 ? 'text-red-500' : 'text-green-500'} font-semibold text-tremor-metric`}>{totalEfficiency}%</p>
            <small className='text-tremor-default text-tremor-content dark:text-dark-tremor-content'>Horas trabajadas: {totalHours} hrs</small>
        
          </Card>

          <Card className="mx-auto max-w-md mt-4">
            <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Horas trabajadas maquina</p>
            <p className="text-tremor-metric text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">{totalHours}</p>
          </Card>

          
          
        </div>
    </>
  )
}
