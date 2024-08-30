import React from 'react'
import { IoClose } from 'react-icons/io5'
import sim from './../../../assets/sim.svg'

interface UpdateCardProps {
  isOpen: boolean
  onClose: () => void
}

const UpdateCardModal: React.FC<UpdateCardProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className='modal-overlay'>
      <div>
        <div className='modal-content'>
          <form>
            <div className='card-title'>
              <h3>PARKING LOT CARD</h3>
            </div>
            <div className='main-card'>
              <div className='sim'>
                <img src={sim} alt='chip' />
              </div>
              <div className='card-uid'>
                <input type='text' placeholder='Type uid' />
              </div>
              <div className='card-user'>
              </div>
              <div className='card-type'>
                <select name='card-type' id='create-type'>
                  <option value='type-option'>user</option>
                  <option value='type-option'>guest</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        <div className='create-option'>
          <button type='submit'>UPDATE</button>
          <button onClick={onClose}>CANCEL</button>
        </div>
      </div>
      <button className='close-button' onClick={onClose}>
        <IoClose />
      </button>
    </div>
  )
}

export default UpdateCardModal

