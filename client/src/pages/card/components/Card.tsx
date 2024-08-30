import { FiEdit } from 'react-icons/fi'
import sim from './../../../assets/sim.svg'
import './Card.css'
export const Card = () => {
  return (
    <div className='modal-content card-display'>
      <div className='card-title'>
        <h3>PARKING LOT CARD</h3>
      </div>
      <div className='main-card'>
        <div className='sim'>
          <img src={sim} alt='chip' />
        </div>
        <div className='card-details'>
          <p>UID: XXXX-XXXX-XXXX-0000</p>
          <p>TYPE: Thru: 01/23</p>
        </div>
      </div>
      <button className='edit'>
        <FiEdit />
      </button>
    </div>
  )
}
