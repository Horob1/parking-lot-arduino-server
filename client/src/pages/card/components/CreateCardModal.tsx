import React from 'react'
import './CreateCardModal.css'
import { IoClose } from 'react-icons/io5'
import sim from './../../../assets/sim.svg'

interface CreateCardProps {
  isOpen: boolean
  onClose: () => void
}

const CreateCardModal: React.FC<CreateCardProps> = ({ isOpen, onClose }) => {
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
          <button type='submit'>CREATE</button>
          <button onClick={onClose}>CANCEL</button>
        </div>
      </div>
      <button className='close-button' onClick={onClose}>
        <IoClose />
      </button>
    </div>
  )
}

export default CreateCardModal
